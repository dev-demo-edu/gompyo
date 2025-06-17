// utils/financial-calculator.ts

import { Company, FinancialDataWithCalculated } from "@/types/partner";

export type CompanyType = "payment" | "collection";
export type BalanceField = "lampleBalance" | "gompyoBalance";

/**
 * 기본 잔액 계산 함수
 * @param prevBalance 이전 잔액
 * @param purchase 구매/판매 금액
 * @param payment 지급/수금 금액
 * @param companyType 회사 타입 (payment: 지급, collection: 수금)
 * @returns 계산된 잔액
 */
export const calculateBalance = (
  prevBalance: number,
  purchase: number,
  payment: number,
  companyType: Company["type"],
): number => {
  if (companyType === "payment") {
    const result = prevBalance - purchase + payment;
    return result;
  } else {
    const result = prevBalance + purchase - payment;
    return result;
  }
};

/**
 * 특정 월의 잔액을 이월잔액부터 누적 계산
 * @param monthIndex 계산할 월의 인덱스 (1=1월, 2=2월, ...)
 * @param field 계산할 잔액 필드
 * @param data 전체 재무 데이터
 * @param companyType 회사 타입
 * @returns 계산된 잔액
 */
export const calculateMonthlyBalance = (
  monthIndex: number,
  field: BalanceField,
  data: FinancialDataWithCalculated[],
  companyType: CompanyType,
): number => {
  // 이월잔액 찾기
  const carryoverData = data.find((item) => item.isCarryover);
  if (!carryoverData) return 0;

  // 이월잔액에서 시작
  let balance =
    field === "lampleBalance"
      ? carryoverData.lampleBalance || 0
      : carryoverData.gompyoBalance || 0;

  // 1월부터 해당 월까지 누적 계산
  for (let i = 1; i <= monthIndex; i++) {
    const monthData = data[i]; // data[0]=이월잔액, data[1]=1월, data[2]=2월, ...
    if (!monthData || monthData.isCarryover) continue;

    const purchase =
      field === "lampleBalance"
        ? monthData.lamplePurchase || 0
        : monthData.gompyoPurchase || 0;

    const payment =
      field === "lampleBalance"
        ? monthData.lamplePayment || 0
        : monthData.gompyoPayment || 0;

    balance = calculateBalance(balance, purchase, payment, companyType);
  }

  return balance;
};

/**
 * 전체 데이터의 모든 잔액 재계산 (누적 방식)
 * @param data 전체 재무 데이터
 * @param companyType 회사 타입
 * @returns 업데이트된 데이터 배열
 */
export const recalculateAllBalances = (
  data: FinancialDataWithCalculated[],
  companyType: CompanyType,
): FinancialDataWithCalculated[] => {
  const updatedData = [...data];

  // 데이터를 월 순서대로 정렬
  updatedData.sort((a, b) => {
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
    const orderA = monthOrder[a.month as keyof typeof monthOrder] ?? 999;
    const orderB = monthOrder[b.month as keyof typeof monthOrder] ?? 999;
    return orderA - orderB;
  });

  let lampleRunningBalance = 0;
  let gompyoRunningBalance = 0;

  for (let i = 0; i < updatedData.length; i++) {
    const item = updatedData[i];

    if (item.isCarryover) {
      // 이월잔액: 편집된 잔액 값 사용
      lampleRunningBalance = item.lampleBalance || 0;
      gompyoRunningBalance = item.gompyoBalance || 0;

      item.totalBalance = lampleRunningBalance + gompyoRunningBalance;
    } else {
      // 월별 데이터: 이전 잔액 + 구매 - 지급으로 누적 계산
      const lamplePurchase = item.lamplePurchase || 0;
      const lamplePayment = item.lamplePayment || 0;
      const gompyoPurchase = item.gompyoPurchase || 0;
      const gompyoPayment = item.gompyoPayment || 0;

      // 회사 타입에 따른 잔액 계산
      if (companyType === "payment") {
        // 지급 회사: 구매하면 빚이 늘어나고(음수), 지급하면 빚이 줄어듦(양수)
        lampleRunningBalance =
          lampleRunningBalance - lamplePurchase + lamplePayment;
        gompyoRunningBalance =
          gompyoRunningBalance - gompyoPurchase + gompyoPayment;
      } else {
        // 수금 회사: 판매하면 채권이 늘어나고(양수), 수금하면 채권이 줄어듦(음수)
        lampleRunningBalance =
          lampleRunningBalance + lamplePurchase - lamplePayment;
        gompyoRunningBalance =
          gompyoRunningBalance + gompyoPurchase - gompyoPayment;
      }

      // 계산된 값들 업데이트
      item.lampleBalance = lampleRunningBalance;
      item.gompyoBalance = gompyoRunningBalance;
      item.totalPurchase = lamplePurchase + gompyoPurchase;
      item.totalPayment = lamplePayment + gompyoPayment;
      item.totalBalance = lampleRunningBalance + gompyoRunningBalance;
    }
  }

  return updatedData;
};

/**
 * 특정 행의 구매/지급 변경 시 전체 잔액 재계산
 * @param changedRowIndex 변경된 행의 인덱스 (사용하지 않음, 전체 재계산)
 * @param field 변경된 잔액 필드 (사용하지 않음, 전체 재계산)
 * @param data 전체 재무 데이터
 * @param companyType 회사 타입
 * @returns 업데이트된 데이터 배열
 */
export const recalculateBalancesFromMonth = (
  changedRowIndex: number,
  field: BalanceField,
  data: FinancialDataWithCalculated[],
  companyType: CompanyType,
): FinancialDataWithCalculated[] => {
  // 간단하게 전체 재계산으로 변경
  return recalculateAllBalances(data, companyType);
};

/**
 * 이월잔액의 전체 잔액 계산
 * @param carryoverData 이월잔액 데이터
 * @returns 업데이트된 이월잔액 데이터
 */
export const calculateCarryoverTotal = (
  carryoverData: FinancialDataWithCalculated,
): FinancialDataWithCalculated => {
  return {
    ...carryoverData,
    totalBalance:
      (carryoverData.lampleBalance || 0) + (carryoverData.gompyoBalance || 0),
  };
};
