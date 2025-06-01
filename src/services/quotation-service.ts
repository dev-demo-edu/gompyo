/**
 * @file quotation-service.ts
 * @description 견적 그리드 데이터 서비스
 *
 * 이 서비스는 정규화된 관계형 데이터를 엑셀 형태의 그리드로 변환하고,
 * 그리드에서의 데이터 수정을 다시 관계형 데이터베이스에 반영하는 기능을 제공합니다.
 *
 * 주요 기능:
 * 1. 피벗 형태의 그리드 데이터 조회 (companyType 필터링 지원)
 * 2. 그리드 셀 값 업데이트
 * 3. 회사/품목 추가/삭제
 *
 * 데이터 구조:
 * - 행: 품목 (quotationItems)
 * - 열: 회사 (partners)
 * - 값: 회사별 품목 값 (partnersItems.value)
 */

import { db } from "@/db";
import {
  quotationCompanies,
  quotationItems,
  quotationCompaniesItems,
} from "@/db/schema";
import { eq, and, inArray, InferSelectModel } from "drizzle-orm";
import { nanoid } from "nanoid";

export type QuotationItem = InferSelectModel<typeof quotationItems>;
export type QuotationCompany = InferSelectModel<typeof quotationCompanies>;
export type QuotationRelation = InferSelectModel<
  typeof quotationCompaniesItems
>;

// 그리드 데이터 타입 정의
export interface QuotationGridItem {
  id: string;
  itemName: string;
  itemOrigin: string;
  itemNameEn?: string | null;
  itemOriginEn?: string | null;
  values: Record<string, number | null>; // companyId를 키로 하는 값들
}

export interface QuotationGridData {
  items: QuotationItem[];
  companies: QuotationCompany[];
  priceData: Record<string, Record<string, number>>;
}

export interface QuotationCellUpdate {
  itemId: string;
  companyId: string;
  value: number | null;
}

/**
 * 피벗 형태의 그리드 데이터 조회 (companyType 필터링 지원)
 * 관계형 데이터를 엑셀 형태로 변환하여 반환
 */

/**
 * 그리드 셀 값 업데이트
 * 특정 회사-품목 조합의 값을 업데이트
 */
export async function updateQuotationCell(
  update: QuotationCellUpdate,
): Promise<void> {
  try {
    const { itemId, companyId, value } = update;

    // 기존 관계 데이터 확인
    const existingRelation = await db
      .select()
      .from(quotationCompaniesItems)
      .where(
        and(
          eq(quotationCompaniesItems.itemId, itemId),
          eq(quotationCompaniesItems.companyId, companyId),
        ),
      )
      .limit(1);

    if (existingRelation.length > 0) {
      // 기존 데이터 업데이트
      await db
        .update(quotationCompaniesItems)
        .set({
          value,
          updatedAt: new Date().toISOString(),
        })
        .where(
          and(
            eq(quotationCompaniesItems.itemId, itemId),
            eq(quotationCompaniesItems.companyId, companyId),
          ),
        );
    } else {
      // 새 관계 데이터 생성
      await db.insert(quotationCompaniesItems).values({
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
  company: QuotationCompany,
): Promise<QuotationCompany> {
  try {
    await db.insert(quotationCompanies).values(company);

    return company;
  } catch (error) {
    console.error("회사 추가 실패:", error);
    throw new Error("회사 추가에 실패했습니다.");
  }
}

/**
 * 새 품목 추가
 */
export async function addItem(item: QuotationItem): Promise<QuotationItem> {
  try {
    await db.insert(quotationItems).values(item);

    return item;
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
    await db
      .delete(quotationCompanies)
      .where(eq(quotationCompanies.id, companyId));
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

/**
 * companyType에 따라 필터링된 회사 목록 조회
 */
export async function getCompanies(
  companyType?: string,
): Promise<QuotationCompany[]> {
  const query = db
    .select()
    .from(quotationCompanies)
    .orderBy(quotationCompanies.companyName);

  return companyType
    ? await query.where(eq(quotationCompanies.companyType, companyType))
    : await query;
}

/**
 * companyType에 따라 필터링된 품목 목록 조회
 * 해당 companyType의 회사들과 관계 데이터가 있는 품목들만 반환
 */
export async function getItems(companyType?: string): Promise<QuotationItem[]> {
  if (!companyType) {
    // companyType이 없으면 모든 품목 반환
    return await db
      .select()
      .from(quotationItems)
      .orderBy(quotationItems.itemName);
  }

  // 1. companyType에 해당하는 회사들의 ID 조회
  const companies = await getCompanies(companyType);
  const companyIds = companies.map((company) => company.id);

  if (companyIds.length === 0) {
    return [];
  }

  // 2. 해당 회사들과 관계가 있는 품목 ID들 조회
  const relationshipsQuery = db
    .selectDistinct({ itemId: quotationCompaniesItems.itemId })
    .from(quotationCompaniesItems)
    .where(
      companyIds.length === 1
        ? eq(quotationCompaniesItems.companyId, companyIds[0])
        : inArray(quotationCompaniesItems.companyId, companyIds),
    );

  const relationships = await relationshipsQuery;
  const itemIds = relationships.map((rel) => rel.itemId);

  if (itemIds.length === 0) {
    return [];
  }

  // 3. 해당 품목들의 상세 정보 조회
  return await db
    .select()
    .from(quotationItems)
    .where(
      itemIds.length === 1
        ? eq(quotationItems.id, itemIds[0])
        : inArray(quotationItems.id, itemIds),
    )
    .orderBy(quotationItems.itemName);
}

/**
 * companyType에 따라 필터링된 견적 관계 데이터 조회
 * priceData를 기반으로 items와 companies 데이터를 함께 조회
 */
export async function getQuotationRelations(
  companyType?: string,
): Promise<QuotationGridData> {
  try {
    if (!companyType) {
      return {
        items: [],
        companies: [],
        priceData: {},
      };
    }

    // 1. companyType에 해당하는 회사들 조회
    const companies = await getCompanies(companyType);
    const companyIds = companies.map((company) => company.id);

    if (companyIds.length === 0) {
      return {
        items: [],
        companies: [],
        priceData: {},
      };
    }

    // 2. 해당 회사들과 관계가 있는 품목들 조회
    const items = await getItems(companyType);
    const itemIds = items.map((item) => item.id);

    if (itemIds.length === 0) {
      return {
        items: [],
        companies: [],
        priceData: {},
      };
    }

    // 3. 해당 회사들과 품목들의 관계 데이터(priceData) 조회
    const relationshipsData = await db
      .select()
      .from(quotationCompaniesItems)
      .where(
        companyIds.length === 1
          ? eq(quotationCompaniesItems.companyId, companyIds[0])
          : inArray(quotationCompaniesItems.companyId, companyIds),
      );

    // 4. priceData 구조로 변환 (companyId -> itemName -> value)
    const priceData: Record<string, Record<string, number>> = {};

    companies.forEach((company) => {
      priceData[company.id] = {};
    });

    relationshipsData.forEach((relation) => {
      const item = items.find((item) => item.id === relation.itemId);
      if (item && relation.value !== null) {
        if (!priceData[relation.companyId]) {
          priceData[relation.companyId] = {};
        }
        priceData[relation.companyId][item.itemName] = relation.value;
      }
    });

    return {
      items,
      companies,
      priceData,
    };
  } catch (error) {
    console.error("getQuotationRelations error", error);
    throw new Error("견적 관계 데이터 조회에 실패했습니다.");
  }
}

/**
 * 회사 정보 업데이트
 */
export async function updateCompany(
  companyId: string,
  updates: Partial<Omit<QuotationCompany, "id" | "createdAt">>,
): Promise<QuotationCompany> {
  try {
    await db
      .update(quotationCompanies)
      .set({
        ...updates,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(quotationCompanies.id, companyId));

    // 업데이트된 회사 정보 반환
    const updatedCompany = await db
      .select()
      .from(quotationCompanies)
      .where(eq(quotationCompanies.id, companyId))
      .limit(1);

    if (updatedCompany.length === 0) {
      throw new Error("업데이트된 회사를 찾을 수 없습니다.");
    }

    return updatedCompany[0];
  } catch (error) {
    console.error("회사 업데이트 실패:", error);
    throw new Error("회사 정보 업데이트에 실패했습니다.");
  }
}

/**
 * 품목 정보 업데이트
 */
export async function updateItem(
  itemId: string,
  updates: Partial<Omit<QuotationItem, "id" | "createdAt">>,
): Promise<QuotationItem> {
  try {
    await db
      .update(quotationItems)
      .set({
        ...updates,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(quotationItems.id, itemId));

    // 업데이트된 품목 정보 반환
    const updatedItem = await db
      .select()
      .from(quotationItems)
      .where(eq(quotationItems.id, itemId))
      .limit(1);

    if (updatedItem.length === 0) {
      throw new Error("업데이트된 품목을 찾을 수 없습니다.");
    }

    return updatedItem[0];
  } catch (error) {
    console.error("품목 업데이트 실패:", error);
    throw new Error("품목 정보 업데이트에 실패했습니다.");
  }
}
