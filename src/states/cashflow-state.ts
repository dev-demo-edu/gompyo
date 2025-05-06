import { atom } from "jotai";

import { InferSelectModel } from "drizzle-orm";
import { cashflows, companies } from "@/db/schema";

export type CashflowItem = InferSelectModel<typeof cashflows>;
export type Company = InferSelectModel<typeof companies>;

export const cashflowListAtom = atom<CashflowItem[]>([]);

export const selectedCompanyIdAtom = atom<string>("com-1");

// 선택된 회사의 항목만 필터링
export const selectedCompanyFlowsAtom = atom((get) => {
  const all = get(cashflowListAtom);
  const companyId = get(selectedCompanyIdAtom);
  return all.filter((flow) => flow.companyId === companyId);
});

export const cashflowRefreshAtom = atom<number>(0);

export const companyListAtom = atom<Company[]>([
  {
    id: "com-1",
    name: "곰표",
    companyBalance: 20,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "com-2",
    name: "램플러스",
    companyBalance: 20,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "com-3",
    name: "인우",
    companyBalance: 20,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]);
