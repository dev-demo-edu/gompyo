/**
 * @file grid-service.ts
 * @description 엑셀형 그리드 데이터 서비스
 *
 * 이 서비스는 정규화된 관계형 데이터를 엑셀 형태의 그리드로 변환하고,
 * 그리드에서의 데이터 수정을 다시 관계형 데이터베이스에 반영하는 기능을 제공합니다.
 *
 * 주요 기능:
 * 1. 피벗 형태의 그리드 데이터 조회
 * 2. 그리드 셀 값 업데이트
 * 3. 회사/품목 추가/삭제
 *
 * 데이터 구조:
 * - 행: 품목 (gridItems)
 * - 열: 회사 (gridCompanies)
 * - 값: 회사별 품목 값 (gridCompanyItems.value)
 */

import { db } from "@/db";
import { partners, quotationItems, partnersItems } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { nanoid } from "nanoid";

// 그리드 데이터 타입 정의
export interface GridData {
  items: GridItem[];
  companies: GridCompany[];
}

export interface GridItem {
  id: string;
  itemName: string;
  values: Record<string, number | null>; // companyId -> value
}

export interface GridCompany {
  id: string;
  companyName: string;
}

export interface GridCellUpdate {
  itemId: string;
  companyId: string;
  value: number | null;
}

/**
 * 피벗 형태의 그리드 데이터 조회
 * 관계형 데이터를 엑셀 형태로 변환하여 반환
 */
export async function getGridData(): Promise<GridData> {
  try {
    // 1. 모든 회사 조회
    const companies = await db
      .select({
        id: partners.id,
        companyName: partners.companyName,
      })
      .from(partners)
      .orderBy(partners.companyName);

    // 2. 모든 품목 조회
    const items = await db
      .select({
        id: quotationItems.id,
        itemName: quotationItems.itemName,
      })
      .from(quotationItems)
      .orderBy(quotationItems.itemName);

    // 3. 모든 관계 데이터 조회
    const relationships = await db
      .select({
        itemId: partnersItems.itemId,
        companyId: partnersItems.companyId,
        value: partnersItems.value,
      })
      .from(partnersItems);

    // 4. 피벗 형태로 데이터 변환
    const gridItemsData: GridItem[] = items.map((item) => {
      const values: Record<string, number | null> = {};

      // 각 회사별로 해당 품목의 값 찾기
      companies.forEach((company) => {
        const relationship = relationships.find(
          (rel) => rel.itemId === item.id && rel.companyId === company.id,
        );
        values[company.id] = relationship?.value ?? null;
      });

      return {
        id: item.id,
        itemName: item.itemName,
        values,
      };
    });

    return {
      items: gridItemsData,
      companies,
    };
  } catch (error) {
    console.error("그리드 데이터 조회 실패:", error);
    throw new Error("그리드 데이터를 불러올 수 없습니다.");
  }
}

/**
 * 그리드 셀 값 업데이트
 * 특정 회사-품목 조합의 값을 업데이트
 */
export async function updateGridCell(update: GridCellUpdate): Promise<void> {
  try {
    const { itemId, companyId, value } = update;

    // 기존 관계 데이터 확인
    const existingRelation = await db
      .select()
      .from(partnersItems)
      .where(
        and(
          eq(partnersItems.itemId, itemId),
          eq(partnersItems.companyId, companyId),
        ),
      )
      .limit(1);

    if (existingRelation.length > 0) {
      // 기존 데이터 업데이트
      await db
        .update(partnersItems)
        .set({
          value,
          updatedAt: new Date().toISOString(),
        })
        .where(
          and(
            eq(partnersItems.itemId, itemId),
            eq(partnersItems.companyId, companyId),
          ),
        );
    } else {
      // 새 관계 데이터 생성
      await db.insert(partnersItems).values({
        id: nanoid(),
        itemId,
        companyId,
        value,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }
  } catch (error) {
    console.error("그리드 셀 업데이트 실패:", error);
    throw new Error("데이터 업데이트에 실패했습니다.");
  }
}

/**
 * 새 회사 추가
 */
export async function addCompany(
  companyName: string,
  companyType: string,
): Promise<GridCompany> {
  try {
    const newCompany = {
      id: nanoid(),
      companyName,
      companyType,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await db.insert(partners).values(newCompany);

    return {
      id: newCompany.id,
      companyName: newCompany.companyName,
    };
  } catch (error) {
    console.error("회사 추가 실패:", error);
    throw new Error("회사 추가에 실패했습니다.");
  }
}

/**
 * 새 품목 추가
 */
export async function addItem(
  itemName: string,
  itemOrigin: string,
  itemNameEn: string,
  itemOriginEn: string,
): Promise<GridItem> {
  try {
    const newItem = {
      id: nanoid(),
      itemName,
      itemOrigin,
      itemNameEn,
      itemOriginEn,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await db.insert(quotationItems).values(newItem);

    return {
      id: newItem.id,
      itemName: newItem.itemName,
      values: {}, // 빈 값으로 시작
    };
  } catch (error) {
    console.error("품목 추가 실패:", error);
    throw new Error("품목 추가에 실패했습니다.");
  }
}

/**
 * 회사 삭제
 */
export async function deleteCompany(companyId: string): Promise<void> {
  try {
    // CASCADE 설정으로 관련 데이터도 자동 삭제됨
    await db.delete(partners).where(eq(partners.id, companyId));
  } catch (error) {
    console.error("회사 삭제 실패:", error);
    throw new Error("회사 삭제에 실패했습니다.");
  }
}

/**
 * 품목 삭제
 */
export async function deleteItem(itemId: string): Promise<void> {
  try {
    // CASCADE 설정으로 관련 데이터도 자동 삭제됨
    await db.delete(quotationItems).where(eq(quotationItems.id, itemId));
  } catch (error) {
    console.error("품목 삭제 실패:", error);
    throw new Error("품목 삭제에 실패했습니다.");
  }
}
