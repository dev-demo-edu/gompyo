import { atom } from "jotai";

import { InferSelectModel } from "drizzle-orm";
import { cashflows, companies } from "@/db/schema";

export type CashflowItem = InferSelectModel<typeof cashflows>;
export type Company = InferSelectModel<typeof companies>;

export const cashflowListAtom = atom<CashflowItem[]>([]);

export const selectedCompanyIdAtom = atom<string>("");

// 선택된 회사의 항목만 필터링
export const selectedCompanyFlowsAtom = atom((get) => {
  const all = get(cashflowListAtom);
  const companyId = get(selectedCompanyIdAtom);
  return all.filter((flow) => flow.companyId === companyId);
});

export const cashflowRefreshAtom = atom<number>(0);

export const companyListAtom = atom<Company[]>([]);

export const selectedExpenseRowsAtom = atom<CashflowItem[]>([]);
export const selectedIncomeRowsAtom = atom<CashflowItem[]>([]);
