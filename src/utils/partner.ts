// utils/financial-calculator.ts

import { Company, FinancialData } from "@/types/partner";

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
  console.log("계산 입력값:", { prevBalance, purchase, payment, companyType });

  if (companyType === "payment") {
    const result = prevBalance - purchase + payment;
    console.log(
      "지급 타입 계산:",
      `${prevBalance} - ${purchase} + ${payment} = ${result}`,
    );
    return result;
  } else {
    const result = prevBalance + purchase - payment;
    console.log(
      "수금 타입 계산:",
      `${prevBalance} + ${purchase} - ${payment} = ${result}`,
    );
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
  data: FinancialData[],
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
 * 특정 행의 구매/지급 변경 시 해당 월부터 12월까지 잔액 재계산
 * @param changedRowIndex 변경된 행의 인덱스
 * @param field 변경된 잔액 필드
 * @param data 전체 재무 데이터
 * @param companyType 회사 타입
 * @returns 업데이트된 데이터 배열
 */
export const recalculateBalancesFromMonth = (
  changedRowIndex: number,
  field: BalanceField,
  data: FinancialData[],
  companyType: CompanyType,
): FinancialData[] => {
  const updatedData = [...data];

  // 변경된 월부터 12월까지 재계산
  for (let i = changedRowIndex; i < updatedData.length; i++) {
    const item = updatedData[i];
    if (item.isCarryover) continue;

    // 월 인덱스 계산 (1월=1, 2월=2, ...)
    const monthIndex = i;

    // 잔액 재계산
    const newBalance = calculateMonthlyBalance(
      monthIndex,
      field,
      updatedData,
      companyType,
    );

    if (field === "lampleBalance") {
      item.lampleBalance = newBalance;
    } else {
      item.gompyoBalance = newBalance;
    }

    // 전체 잔액 재계산
    item.totalBalance = (item.lampleBalance || 0) + (item.gompyoBalance || 0);
  }

  return updatedData;
};

/**
 * 전체 데이터의 모든 잔액 재계산
 * @param data 전체 재무 데이터
 * @param companyType 회사 타입
 * @returns 업데이트된 데이터 배열
 */
export const recalculateAllBalances = (
  data: FinancialData[],
  companyType: CompanyType,
): FinancialData[] => {
  const updatedData = [...data];

  // 1월부터 12월까지 순차적으로 계산
  for (let i = 1; i < updatedData.length; i++) {
    const item = updatedData[i];
    if (item.isCarryover) continue;

    // 램플 잔액 계산
    item.lampleBalance = calculateMonthlyBalance(
      i,
      "lampleBalance",
      updatedData,
      companyType,
    );

    // 곰표 잔액 계산
    item.gompyoBalance = calculateMonthlyBalance(
      i,
      "gompyoBalance",
      updatedData,
      companyType,
    );

    // 전체 구매/지급/잔액 계산
    item.totalPurchase =
      (item.lamplePurchase || 0) + (item.gompyoPurchase || 0);
    item.totalPayment = (item.lamplePayment || 0) + (item.gompyoPayment || 0);
    item.totalBalance = (item.lampleBalance || 0) + (item.gompyoBalance || 0);
  }

  return updatedData;
};

/**
 * 이월잔액의 전체 잔액 계산
 * @param carryoverData 이월잔액 데이터
 * @returns 업데이트된 이월잔액 데이터
 */
export const calculateCarryoverTotal = (
  carryoverData: FinancialData,
): FinancialData => {
  return {
    ...carryoverData,
    totalBalance:
      (carryoverData.lampleBalance || 0) + (carryoverData.gompyoBalance || 0),
  };
};
