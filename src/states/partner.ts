import { Company, FinancialData } from "@/types/partner";
import { atom } from "jotai";

export const companiesAtom = atom<Company[]>([]);
export const selectedCompanyAtom = atom<string>("");

// 년도 관련
export const availableYearsAtom = atom<number[]>([]);
export const selectedYearAtom = atom<number>(2025);

export const financialDataAtom = atom<FinancialData[]>([]);

// 변경사항 추적용 atoms 추가
export const changedDataIdsAtom = atom<Set<string>>(new Set<string>());

// 변경사항 초기화 함수
export const clearChangesAtom = atom(null, (get, set) => {
  set(changedDataIdsAtom, new Set<string>());
});

// 새로고침 트리거
export const partnerRefreshAtom = atom<number>(0);
