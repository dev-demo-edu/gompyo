import { CashflowItem } from "@/states/cashflow-state";

/**
 * 선택된 수금(income)과 지출(expense) 항목 배열을 받아
 * 수금은 +, 지출은 -로 합산한 값을 반환합니다.
 * @param incomeRows 수금 항목 배열
 * @param expenseRows 지출 항목 배열
 * @returns 합산 금액 (number)
 */
export function calculateCashflowAmountByType(
  incomeRows: CashflowItem[],
  expenseRows: CashflowItem[],
): number {
  const incomeSum = incomeRows.reduce((sum, item) => sum + item.amount, 0);
  const expenseSum = expenseRows.reduce((sum, item) => sum + item.amount, 0);
  return incomeSum - expenseSum;
}
