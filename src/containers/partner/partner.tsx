"use client";

import { useState, useEffect } from "react";
import { Stack, Button } from "@mui/material";
import PartnerGrid from "./partner-grid";

interface Company {
  id: string;
  name: string;
  type: "payment" | "collection"; // payment: 지급회사, collection: 수금회사
}

interface FinancialData {
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

const generateMockCompanies = (): Company[] => {
  return [
    { id: "1", name: "디앤비", type: "payment" },
    { id: "2", name: "대한", type: "payment" },
    { id: "3", name: "남해", type: "collection" },
    { id: "4", name: "박인터", type: "collection" },
    { id: "5", name: "한끼", type: "payment" },
  ];
};

// 회사 목록 API 호출 함수 (현재는 목업)
const fetchCompanies = async (): Promise<Company[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(generateMockCompanies());
    }, 300);
  });
};

// 임시 데이터 생성 함수 (나중에 API 호출로 대체)
const generateMockData = (companyId: string, year: number): FinancialData[] => {
  const months = [
    "1월",
    "2월",
    "3월",
    "4월",
    "5월",
    "6월",
    "7월",
    "8월",
    "9월",
    "10월",
    "11월",
    "12월",
  ];

  return months
    .map((month, index) => ({
      id: `${year}-${index + 1}`,
      month,
      year,
      lamplePurchase: Math.floor(Math.random() * 5000) + 1000,
      lamplePayment: Math.floor(Math.random() * 4000) + 800,
      lampleBalance: Math.floor(Math.random() * 1000) + 200,
      gompyoPurchase: Math.floor(Math.random() * 6000) + 1200,
      gompyoPayment: Math.floor(Math.random() * 5000) + 1000,
      gompyoBalance: Math.floor(Math.random() * 1200) + 200,
      totalPurchase: null, // 계산되어 설정됨
      totalPayment: null, // 계산되어 설정됨
      totalBalance: null, // 계산되어 설정됨
    }))
    .map((item) => ({
      ...item,
      totalPurchase: (item.lamplePurchase || 0) + (item.gompyoPurchase || 0),
      totalPayment: (item.lamplePayment || 0) + (item.gompyoPayment || 0),
      totalBalance: (item.lampleBalance || 0) + (item.gompyoBalance || 0),
    }));
};

// API 호출 함수 (현재는 목업, 나중에 실제 API로 대체)
const fetchFinancialData = async (
  companyId: string,
  year: number,
): Promise<FinancialData[]> => {
  // 실제 API 호출 시뮬레이션
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(generateMockData(companyId, year));
    }, 500); // 로딩 시뮬레이션
  });
};

export default function Partner() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<string>("");
  const [selectedYear, setSelectedYear] = useState(2025);
  const [financialData, setFinancialData] = useState<FinancialData[]>([]);
  const [loading, setLoading] = useState(false);

  // 회사 목록 로드
  useEffect(() => {
    const loadCompanies = async () => {
      try {
        const companiesData = await fetchCompanies();
        setCompanies(companiesData);
        // 첫 번째 회사를 기본 선택
        if (companiesData.length > 0) {
          setSelectedCompany(companiesData[0].id);
        }
      } catch (error) {
        console.error("회사 목록 로드 실패:", error);
      }
    };

    loadCompanies();
  }, []);

  // 데이터 로드 함수
  const loadData = async (year: number, companyId: string) => {
    setLoading(true);
    try {
      const data = await fetchFinancialData(companyId, year);
      setFinancialData(data);
    } catch (error) {
      console.error("데이터 로드 실패:", error);
      setFinancialData([]);
    } finally {
      setLoading(false);
    }
  };

  // 회사나 년도 변경시 데이터 로드
  useEffect(() => {
    if (selectedCompany && selectedYear) {
      loadData(selectedYear, selectedCompany);
    }
  }, [selectedCompany, selectedYear]);

  // 해당 연도 삭제
  const handleDeleteYear = async () => {
    if (confirm(`${selectedYear}년 데이터를 삭제하시겠습니까?`)) {
      try {
        // 실제로는 API 호출
        // await deleteYearData(selectedYear);
        console.log(`${selectedYear}년 데이터 삭제`);
        setFinancialData([]);
      } catch (error) {
        console.error("데이터 삭제 실패:", error);
      }
    }
  };

  // 회사 추가
  const handleAddCompany = () => {
    // 실제로는 모달이나 다른 UI로 회사 정보 입력받음
    console.log("회사 추가 기능");
  };

  // 회사 삭제
  const handleDeleteCompany = () => {
    // 실제로는 선택된 회사 삭제
    console.log("회사 삭제 기능");
  };

  return (
    <div className="w-full min-h-screen bg-gray-100">
      <div className="p-4 sm:p-8">
        <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">
          거래처 관리
        </h1>
        <Stack
          direction="row"
          spacing={2}
          className="w-full justify-end mb-4 sm:mb-6"
        >
          <Button
            variant="contained"
            color="primary"
            onClick={handleDeleteYear}
            disabled={loading || financialData.length === 0}
            sx={{
              minWidth: 120,
              fontWeight: 600,
              backgroundColor: "#EF4444",
              "&:hover": {
                backgroundColor: "#DC2626",
              },
              "&:disabled": {
                backgroundColor: "#9CA3AF",
              },
              boxShadow: "none",
            }}
          >
            해당 연도 삭제
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddCompany}
            disabled={loading}
            sx={{
              minWidth: 120,
              fontWeight: 600,
              backgroundColor: "#22C55E",
              "&:hover": {
                backgroundColor: "#16A34A",
              },
              "&:disabled": {
                backgroundColor: "#9CA3AF",
              },
              boxShadow: "none",
            }}
          >
            회사 추가
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleDeleteCompany}
            disabled={loading}
            sx={{
              minWidth: 120,
              fontWeight: 600,
              backgroundColor: "#F59E0B",
              "&:hover": {
                backgroundColor: "#D97706",
              },
              "&:disabled": {
                backgroundColor: "#9CA3AF",
              },
              boxShadow: "none",
            }}
          >
            회사 삭제
          </Button>
        </Stack>

        {/* 그리드 */}
        <div className="overflow-hidden">
          <PartnerGrid
            companies={companies}
            selectedCompany={selectedCompany}
            onCompanyChange={setSelectedCompany}
            selectedYear={selectedYear}
            onYearChange={setSelectedYear}
            data={financialData}
            loading={loading}
            onDataChange={setFinancialData}
          />
        </div>
      </div>
    </div>
  );
}
