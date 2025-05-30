import { atom } from "jotai";

// 회사 관련
export interface Company {
  id: string;
  name: string;
  type: "payment" | "collection";
}

export const companiesAtom = atom<Company[]>([]);
export const selectedCompanyAtom = atom<string>("");

// 년도 관련
export const availableYearsAtom = atom<number[]>([]);
export const selectedYearAtom = atom<number>(2025);

// 재무 데이터
export interface FinancialData {
  id: string;
  year: number;
  month: string;
  lamplePurchase: number | null;
  lamplePayment: number | null;
  lampleBalance: number | null;
  gompyoPurchase: number | null;
  gompyoPayment: number | null;
  gompyoBalance: number | null;
  totalPurchase: number | null;
  totalPayment: number | null;
  totalBalance: number | null;
}

export const financialDataAtom = atom<FinancialData[]>([]);

// 새로고침 트리거
export const partnerRefreshAtom = atom<number>(0);
