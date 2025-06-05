// 재무 데이터
export interface FinancialData {
  isCarryover?: boolean;
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

// 회사 관련
export interface Company {
  id: string;
  name: string;
  type: "payment" | "collection";
}
