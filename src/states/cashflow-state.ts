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

export const companyBalanceAtom = atom<number>((get) => {
  const companyId = get(selectedCompanyIdAtom);
  const company = get(companyListAtom).find(
    (company) => company.id === companyId,
  );
  return company?.companyBalance ?? 0;
});

export const setCompanyBalanceAtom = atom(null, (get, set, update: number) => {
  const companyId = get(selectedCompanyIdAtom);
  set(companyListAtom, (prev) =>
    prev.map((company) =>
      company.id === companyId
        ? { ...company, companyBalance: update }
        : company,
    ),
  );
});

export const editModeAtom = atom<boolean>(false);
