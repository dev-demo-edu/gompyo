// 재무 데이터 (DB 저장용)
export interface FinancialData {
  isCarryover?: boolean;
  id: string;
  yearId: string;
  month: string;
  lamplePurchase: number | null;
  lamplePayment: number | null;
  gompyoPurchase: number | null;
  gompyoPayment: number | null;
}

// 계산된 필드를 포함한 재무 데이터 (프론트엔드 표시용)
export interface FinancialDataWithCalculated extends FinancialData {
  // 연도 정보 (조인된 데이터)
  year: number;
  companyId: string;
  // 계산된 필드들
  lampleBalance: number | null;
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

// 회사별 연도 데이터
export interface CompanyYear {
  id: string;
  companyId: string;
  year: number;
  lampleOpeningBalance: number;
  gompyoOpeningBalance: number;
  lampleClosingBalance: number;
  gompyoClosingBalance: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
