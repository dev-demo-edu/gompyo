"use server";

import { revalidatePath } from "next/cache";
import { desc, eq, and, asc } from "drizzle-orm";
import { db } from "@/db";
import { partnerCompanies, financialData, companyYears } from "@/db/schema";
import { Company, FinancialData, CompanyYear } from "@/types/partner";
import { nanoid } from "nanoid";

/**
 * 월별 데이터 정렬 함수
 */
function sortByMonth<T extends { month: string }>(data: T[]): T[] {
  const monthOrder = {
    이월잔액: 0,
    "1월": 1,
    "2월": 2,
    "3월": 3,
    "4월": 4,
    "5월": 5,
    "6월": 6,
    "7월": 7,
    "8월": 8,
    "9월": 9,
    "10월": 10,
    "11월": 11,
    "12월": 12,
  };

  return data.sort((a, b) => {
    const orderA = monthOrder[a.month as keyof typeof monthOrder] ?? 999;
    const orderB = monthOrder[b.month as keyof typeof monthOrder] ?? 999;
    return orderA - orderB;
  });
}

/**
 * 거래처 목록 조회
 */
export async function fetchCompanies(): Promise<Company[]> {
  try {
    const companies = await db
      .select({
        id: partnerCompanies.id,
        name: partnerCompanies.name,
        type: partnerCompanies.type,
      })
      .from(partnerCompanies)
      .orderBy(asc(partnerCompanies.name));

    return companies as Company[];
  } catch (error) {
    console.error("거래처 목록 조회 실패:", error);
    throw new Error("거래처 목록을 불러오는데 실패했습니다.");
  }
}

/**
 * 거래처 추가
 */
export async function createCompany(
  name: string,
  type: "payment" | "collection",
): Promise<{ id: string }> {
  try {
    if (!name || !name.trim()) {
      throw new Error("회사명을 입력해주세요.");
    }

    if (!type || !["payment", "collection"].includes(type)) {
      throw new Error("올바른 회사 유형을 선택해주세요.");
    }

    // 중복 이름 체크
    const existingCompany = await db
      .select()
      .from(partnerCompanies)
      .where(eq(partnerCompanies.name, name.trim()))
      .limit(1);

    if (existingCompany.length > 0) {
      throw new Error("이미 존재하는 회사명입니다.");
    }

    const now = new Date().toISOString();
    const companyId = nanoid();

    await db.insert(partnerCompanies).values({
      id: companyId,
      name: name.trim(),
      type,
      createdAt: now,
      updatedAt: now,
    });

    // 현재 연도 데이터 생성
    const currentYear = new Date().getFullYear();
    const yearId = await createCompanyYear(companyId, currentYear);
    await createInitialFinancialData(yearId);

    revalidatePath("/partner");

    return { id: companyId };
  } catch (error) {
    console.error("거래처 추가 실패:", error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("거래처 추가에 실패했습니다.");
  }
}

/**
 * 거래처 삭제
 */
export async function deleteCompany(companyId: string): Promise<void> {
  try {
    if (!companyId) {
      throw new Error("삭제할 회사를 선택해주세요.");
    }

    // 회사 존재 여부 확인
    const company = await db
      .select()
      .from(partnerCompanies)
      .where(eq(partnerCompanies.id, companyId))
      .limit(1);

    if (company.length === 0) {
      throw new Error("존재하지 않는 회사입니다.");
    }

    // 트랜잭션으로 안전하게 삭제
    await db.transaction(async (tx) => {
      // 1. 해당 회사의 모든 연도 데이터 조회
      const companyYearsList = await tx
        .select()
        .from(companyYears)
        .where(eq(companyYears.companyId, companyId));

      // 2. 각 연도의 재무 데이터 삭제 (가장 하위 레벨부터)
      for (const yearData of companyYearsList) {
        // 재무 데이터 삭제
        await tx
          .delete(financialData)
          .where(eq(financialData.yearId, yearData.id));
      }

      // 3. 회사 연도 데이터 삭제
      await tx
        .delete(companyYears)
        .where(eq(companyYears.companyId, companyId));

      // 4. 마지막으로 회사 데이터 삭제
      await tx
        .delete(partnerCompanies)
        .where(eq(partnerCompanies.id, companyId));
    });

    // 캐시 무효화
    revalidatePath("/partner");
  } catch (error) {
    console.error("거래처 삭제 실패:", error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("거래처 삭제에 실패했습니다.");
  }
}

/**
 * 특정 회사/연도의 재무 데이터 조회 (연도 정보 포함)
 */
export async function fetchFinancialData(
  companyId: string,
  year: number,
): Promise<FinancialData[]> {
  try {
    if (!companyId || !year) {
      throw new Error("회사와 연도를 선택해주세요.");
    }

    // 먼저 해당 회사의 연도 데이터가 있는지 확인
    let companyYear = await db
      .select()
      .from(companyYears)
      .where(
        and(eq(companyYears.companyId, companyId), eq(companyYears.year, year)),
      )
      .limit(1);

    // 연도 데이터가 없으면 생성
    if (companyYear.length === 0) {
      await createCompanyYear(companyId, year);
      companyYear = await db
        .select()
        .from(companyYears)
        .where(
          and(
            eq(companyYears.companyId, companyId),
            eq(companyYears.year, year),
          ),
        )
        .limit(1);
    }

    const yearId = companyYear[0].id;

    // 재무 데이터 조회
    const data = await db
      .select()
      .from(financialData)
      .where(eq(financialData.yearId, yearId));

    // 데이터가 없는 경우 초기 데이터 생성
    if (data.length === 0) {
      await createInitialFinancialData(yearId);
      return await fetchFinancialData(companyId, year);
    }

    // 정렬된 데이터 반환
    const sortedData = sortByMonth(data);

    return sortedData.map((item) => ({
      id: item.id,
      yearId: item.yearId,
      month: item.month,
      isCarryover: item.isCarryover || false,
      lamplePurchase: item.lamplePurchase,
      lamplePayment: item.lamplePayment,
      gompyoPurchase: item.gompyoPurchase,
      gompyoPayment: item.gompyoPayment,
    }));
  } catch (error) {
    console.error("재무 데이터 조회 실패:", error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("재무 데이터를 불러오는데 실패했습니다.");
  }
}

/**
 * 회사 연도 데이터 생성
 */
async function createCompanyYear(
  companyId: string,
  year: number,
): Promise<string> {
  const now = new Date().toISOString();
  const yearId = nanoid();

  // 전년도 데이터에서 이월잔액 가져오기
  const prevYear = year - 1;
  const prevYearData = await db
    .select()
    .from(companyYears)
    .where(
      and(
        eq(companyYears.companyId, companyId),
        eq(companyYears.year, prevYear),
      ),
    )
    .limit(1);

  const lampleOpeningBalance =
    prevYearData.length > 0 ? prevYearData[0].lampleClosingBalance || 0 : 0;
  const gompyoOpeningBalance =
    prevYearData.length > 0 ? prevYearData[0].gompyoClosingBalance || 0 : 0;

  console.log("lampleOpeningBalance", lampleOpeningBalance);
  console.log("gompyoOpeningBalance", gompyoOpeningBalance);

  await db.insert(companyYears).values({
    id: yearId,
    companyId,
    year,
    lampleOpeningBalance,
    gompyoOpeningBalance,
    lampleClosingBalance: 0,
    gompyoClosingBalance: 0,
    isActive: true,
    createdAt: now,
    updatedAt: now,
  });

  return yearId;
}

/**
 * 초기 재무 데이터 생성 (이월잔액 + 12개월)
 */
async function createInitialFinancialData(yearId: string): Promise<void> {
  const now = new Date().toISOString();
  const months = [
    "1월",
    "2월",
    "3월",
    "4월",
    "5월",
    "6월",
    "7월",
    "8월",
    "9월",
    "10월",
    "11월",
    "12월",
  ];

  const initialData = [
    // 이월잔액
    {
      id: nanoid(),
      yearId,
      month: "이월잔액",
      isCarryover: true,
      lamplePurchase: null,
      lamplePayment: null,
      gompyoPurchase: null,
      gompyoPayment: null,
      createdAt: now,
      updatedAt: now,
    },
    // 12개월 데이터
    ...months.map((month) => ({
      id: nanoid(),
      yearId,
      month,
      isCarryover: false,
      lamplePurchase: null,
      lamplePayment: null,
      gompyoPurchase: null,
      gompyoPayment: null,
      createdAt: now,
      updatedAt: now,
    })),
  ];

  await db.insert(financialData).values(initialData);
}

/**
 * 재무 데이터 저장 및 연말 잔액 업데이트
 */
export async function saveFinancialData(
  companyId: string,
  year: number,
  data: FinancialData[],
): Promise<void> {
  try {
    if (!companyId || !year || !data || data.length === 0) {
      throw new Error("저장할 데이터가 없습니다.");
    }

    const now = new Date().toISOString();

    // 해당 연도의 companyYear 찾기
    const companyYear = await db
      .select()
      .from(companyYears)
      .where(
        and(eq(companyYears.companyId, companyId), eq(companyYears.year, year)),
      )
      .limit(1);

    if (companyYear.length === 0) {
      throw new Error("해당 연도 데이터를 찾을 수 없습니다.");
    }

    const yearId = companyYear[0].id;

    // 각 데이터 항목을 업데이트
    for (const item of data) {
      await db
        .update(financialData)
        .set({
          lamplePurchase: item.lamplePurchase,
          lamplePayment: item.lamplePayment,
          gompyoPurchase: item.gompyoPurchase,
          gompyoPayment: item.gompyoPayment,
          updatedAt: now,
        })
        .where(eq(financialData.id, item.id));

      // 이월잔액 데이터인 경우 companyYears의 이월잔액도 업데이트
      if (item.isCarryover && item.month === "이월잔액") {
        await updateOpeningBalance(yearId, item);
      }
    }

    // 연말 잔액 계산 및 업데이트
    await updateYearEndBalance(companyId, year);

    revalidatePath("/partner");
  } catch (error) {
    console.error("재무 데이터 저장 실패:", error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("재무 데이터 저장에 실패했습니다.");
  }
}

/**
 * 이월잔액 업데이트 (companyYears 테이블)
 */
async function updateOpeningBalance(
  yearId: string,
  carryoverData: FinancialData,
): Promise<void> {
  try {
    const now = new Date().toISOString();

    // 이월잔액의 경우 구매 필드에 잔액 값이 직접 저장됨
    const lampleOpeningBalance = carryoverData.lamplePurchase || 0;
    const gompyoOpeningBalance = carryoverData.gompyoPurchase || 0;

    // companyYears 테이블의 이월잔액 업데이트
    await db
      .update(companyYears)
      .set({
        lampleOpeningBalance,
        gompyoOpeningBalance,
        updatedAt: now,
      })
      .where(eq(companyYears.id, yearId));
  } catch (error) {
    console.error("이월잔액 업데이트 실패:", error);
    throw new Error("이월잔액 업데이트에 실패했습니다.");
  }
}

/**
 * 연말 잔액 계산 및 업데이트
 */
async function updateYearEndBalance(
  companyId: string,
  year: number,
): Promise<void> {
  // 해당 연도의 companyYear 찾기
  const companyYear = await db
    .select()
    .from(companyYears)
    .where(
      and(eq(companyYears.companyId, companyId), eq(companyYears.year, year)),
    )
    .limit(1);

  if (companyYear.length === 0) return;

  const yearId = companyYear[0].id;

  // 해당 연도의 모든 재무 데이터 조회
  const allData = await db
    .select()
    .from(financialData)
    .where(eq(financialData.yearId, yearId));

  // 정렬된 데이터
  const sortedData = sortByMonth(allData);

  // 연말 잔액 계산 (12월 기준)
  const decemberData = sortedData.find((item) => item.month === "12월");

  if (decemberData) {
    // 여기서 실제 잔액 계산 로직이 필요 - 프론트엔드와 동일한 로직 사용
    // 임시로 0으로 설정 (실제로는 계산된 값 사용)
    await db
      .update(companyYears)
      .set({
        lampleClosingBalance: 0, // 실제 계산 값
        gompyoClosingBalance: 0, // 실제 계산 값
        updatedAt: new Date().toISOString(),
      })
      .where(eq(companyYears.id, yearId));
  }
}

/**
 * 새 연도 데이터 추가
 */
export async function addYear(companyId: string, year: number): Promise<void> {
  try {
    if (!companyId || !year) {
      throw new Error("회사와 연도를 선택해주세요.");
    }

    // 이미 존재하는 연도인지 확인
    const existingYear = await db
      .select()
      .from(companyYears)
      .where(
        and(eq(companyYears.companyId, companyId), eq(companyYears.year, year)),
      )
      .limit(1);

    if (existingYear.length > 0) {
      throw new Error("이미 존재하는 연도입니다.");
    }

    const yearId = await createCompanyYear(companyId, year);
    await createInitialFinancialData(yearId);

    revalidatePath("/partner");
  } catch (error) {
    console.error("연도 추가 실패:", error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("연도 추가에 실패했습니다.");
  }
}

/**
 * 연도별 데이터 삭제
 */
export async function deleteYear(
  companyId: string,
  year: number,
): Promise<void> {
  try {
    if (!companyId || !year) {
      throw new Error("삭제할 회사와 연도를 선택해주세요.");
    }

    // 해당 연도 데이터 확인
    const companyYear = await db
      .select()
      .from(companyYears)
      .where(
        and(eq(companyYears.companyId, companyId), eq(companyYears.year, year)),
      )
      .limit(1);

    if (companyYear.length === 0) {
      throw new Error("존재하지 않는 연도입니다.");
    }

    const yearId = companyYear[0].id;

    // 트랜잭션으로 안전하게 삭제
    await db.transaction(async (tx) => {
      // 1. 해당 연도의 재무 데이터 먼저 삭제
      await tx.delete(financialData).where(eq(financialData.yearId, yearId));

      // 2. 연도 데이터 삭제
      await tx
        .delete(companyYears)
        .where(
          and(
            eq(companyYears.companyId, companyId),
            eq(companyYears.year, year),
          ),
        );
    });

    revalidatePath("/partner");
  } catch (error) {
    console.error("연도별 데이터 삭제 실패:", error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("연도별 데이터 삭제에 실패했습니다.");
  }
}

/**
 * 사용 가능한 연도 목록 조회
 */
export async function fetchAvailableYears(
  companyId: string,
): Promise<number[]> {
  try {
    if (!companyId) {
      return [];
    }

    const years = await db
      .select({ year: companyYears.year })
      .from(companyYears)
      .where(eq(companyYears.companyId, companyId))
      .orderBy(desc(companyYears.year));

    return years.map((item) => item.year);
  } catch (error) {
    console.error("사용 가능한 연도 목록 조회 실패:", error);
    return [];
  }
}

/**
 * 회사별 연도 데이터 조회 (이월잔액 확인용)
 */
export async function fetchCompanyYear(
  companyId: string,
  year: number,
): Promise<CompanyYear | null> {
  try {
    const result = await db
      .select()
      .from(companyYears)
      .where(
        and(eq(companyYears.companyId, companyId), eq(companyYears.year, year)),
      )
      .limit(1);

    if (result.length === 0) return null;

    const item = result[0];
    return {
      id: item.id,
      companyId: item.companyId,
      year: item.year,
      lampleOpeningBalance: item.lampleOpeningBalance || 0,
      gompyoOpeningBalance: item.gompyoOpeningBalance || 0,
      lampleClosingBalance: item.lampleClosingBalance || 0,
      gompyoClosingBalance: item.gompyoClosingBalance || 0,
      isActive: item.isActive || true,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    };
  } catch (error) {
    console.error("회사 연도 데이터 조회 실패:", error);
    return null;
  }
}
