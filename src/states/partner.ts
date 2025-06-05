import { Company, FinancialData } from "@/types/partner";
import { atom } from "jotai";

export const companiesAtom = atom<Company[]>([]);
export const selectedCompanyAtom = atom<string>("");

// 년도 관련
export const availableYearsAtom = atom<number[]>([]);
export const selectedYearAtom = atom<number>(2025);

export const financialDataAtom = atom<FinancialData[]>([]);

// 새로고침 트리거
export const partnerRefreshAtom = atom<number>(0);
