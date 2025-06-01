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
  updateQuotationCell,
  addCompany,
  addItem,
  deleteCompany,
  deleteItem,
  QuotationItem,
  QuotationCompany,
  QuotationGridData,
  QuotationCellUpdate,
  getCompanies,
  getItems,
  getQuotationRelations,
} from "@/services/quotation-service";
import { revalidatePath } from "next/cache";
import { renderToBuffer } from "@react-pdf/renderer";
import QuotationDocument from "@/containers/quotation/quotation-document";
import { QuotationData } from "@/containers/quotation/quotation-document";

export async function getQuotationDataAction(): Promise<QuotationGridData> {
  try {
    return await getQuotationRelations();
  } catch (error) {
    console.error("getQuotationDataAction error", error);
    throw error;
  }
}

/**
 * 그리드 셀 값 업데이트 액션
 */
export async function updateQuotationCellAction(
  update: QuotationCellUpdate,
): Promise<void> {
  try {
    await updateQuotationCell(update);
    revalidatePath("/grid"); // 그리드 페이지 캐시 무효화
  } catch (error) {
    console.error("updateQuotationCellAction error", error);
    throw error;
  }
}

/**
 * 회사 추가 액션
 */
export async function addQuotationCompanyAction(
  company: QuotationCompany,
): Promise<QuotationCompany> {
  try {
    const result = await addCompany(company);
    revalidatePath("/grid");
    return result;
  } catch (error) {
    console.error("addQuotationCompanyAction error", error);
    throw error;
  }
}

/**
 * 품목 추가 액션
 */
export async function addQuotationItemAction(
  item: QuotationItem,
): Promise<QuotationItem> {
  try {
    const result = await addItem(item);
    revalidatePath("/grid");
    return result;
  } catch (error) {
    console.error("addQuotationItemAction error", error);
    throw error;
  }
}

/**
 * 회사 삭제 액션
 */
export async function deleteQuotationCompanyAction(
  companyId: string,
): Promise<void> {
  try {
    await deleteCompany(companyId);
    revalidatePath("/grid");
  } catch (error) {
    console.error("deleteQuotationCompanyAction error", error);
    throw error;
  }
}

/**
 * 품목 삭제 액션
 */
export async function deleteQuotationItemAction(itemId: string): Promise<void> {
  try {
    await deleteItem(itemId);
    revalidatePath("/grid");
  } catch (error) {
    console.error("deleteQuotationItemAction error", error);
    throw error;
  }
}

export async function getCompaniesAction(): Promise<QuotationCompany[]> {
  try {
    return await getCompanies();
  } catch (error) {
    console.error("getCompaniesAction error", error);
    throw error;
  }
}

export async function getItemsAction(): Promise<QuotationItem[]> {
  try {
    return await getItems();
  } catch (error) {
    console.error("getItemsAction error", error);
    throw error;
  }
}

/**
 * 국내 업체 데이터 조회 액션
 */
export async function getDomesticAction(): Promise<QuotationGridData> {
  try {
    return await getQuotationRelations("domestic");
  } catch (error) {
    console.error("getDomesticAction error", error);
    throw error;
  }
}

/**
 * 해외 업체 데이터 조회 액션
 */
export async function getForeignerAction(): Promise<QuotationGridData> {
  try {
    return await getQuotationRelations("foreign");
  } catch (error) {
    console.error("getForeignerAction error", error);
    throw error;
  }
}

export async function generateQuotationPDF(quotationData: QuotationData) {
  try {
    // QuotationDocument 컴포넌트 인스턴스 생성
    const documentElement = QuotationDocument({ invoiceData: quotationData });

    // PDF 버퍼 생성
    const pdfBuffer = await renderToBuffer(documentElement);

    // Buffer를 base64로 변환하여 클라이언트로 전송
    const base64PDF = pdfBuffer.toString("base64");

    return {
      success: true,
      pdf: base64PDF,
      filename: `${quotationData.receiver}_견적서_${new Date().toISOString().split("T")[0]}.pdf`,
    };
  } catch (error) {
    console.error("PDF 생성 오류:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
