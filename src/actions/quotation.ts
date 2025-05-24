/**
 * @file grid-actions.ts
 * @description 그리드 데이터 관련 Server Actions
 *
 * Next.js Server Actions를 사용하여 클라이언트에서 서버 함수를 직접 호출할 수 있도록 합니다.
 *
 * 주요 기능:
 * 1. 그리드 데이터 조회
 * 2. 셀 값 업데이트
 * 3. 회사/품목 추가/삭제
 */

"use server";

import {
  getGridData,
  updateGridCell,
  addCompany,
  addItem,
  deleteCompany,
  deleteItem,
  type GridData,
  type GridCellUpdate,
  type GridCompany,
  type GridItem,
} from "@/services/quotation-service";
import { revalidatePath } from "next/cache";

/**
 * 그리드 데이터 조회 액션
 */
export async function getGridDataAction(): Promise<GridData> {
  try {
    return await getGridData();
  } catch (error) {
    console.error("그리드 데이터 조회 액션 실패:", error);
    throw error;
  }
}

/**
 * 그리드 셀 값 업데이트 액션
 */
export async function updateGridCellAction(
  update: GridCellUpdate,
): Promise<void> {
  try {
    await updateGridCell(update);
    revalidatePath("/grid"); // 그리드 페이지 캐시 무효화
  } catch (error) {
    console.error("그리드 셀 업데이트 액션 실패:", error);
    throw error;
  }
}

/**
 * 회사 추가 액션
 */
export async function addCompanyAction(
  companyName: string,
  companyType: string,
): Promise<GridCompany> {
  try {
    const result = await addCompany(companyName, companyType);
    revalidatePath("/grid");
    return result;
  } catch (error) {
    console.error("회사 추가 액션 실패:", error);
    throw error;
  }
}

/**
 * 품목 추가 액션
 */
export async function addItemAction(
  itemName: string,
  itemOrigin: string,
  itemNameEn: string,
  itemOriginEn: string,
): Promise<GridItem> {
  try {
    const result = await addItem(
      itemName,
      itemOrigin,
      itemNameEn,
      itemOriginEn,
    );
    revalidatePath("/grid");
    return result;
  } catch (error) {
    console.error("품목 추가 액션 실패:", error);
    throw error;
  }
}

/**
 * 회사 삭제 액션
 */
export async function deleteCompanyAction(companyId: string): Promise<void> {
  try {
    await deleteCompany(companyId);
    revalidatePath("/grid");
  } catch (error) {
    console.error("회사 삭제 액션 실패:", error);
    throw error;
  }
}

/**
 * 품목 삭제 액션
 */
export async function deleteItemAction(itemId: string): Promise<void> {
  try {
    await deleteItem(itemId);
    revalidatePath("/grid");
  } catch (error) {
    console.error("품목 삭제 액션 실패:", error);
    throw error;
  }
}
