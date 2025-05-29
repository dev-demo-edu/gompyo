"use client";

import { useState, useEffect } from "react";
import { Stack, Button, FormControl, InputLabel } from "@mui/material";
import { Select } from "@mui/material";
import { MenuItem } from "@mui/material";
import PartnerGrid from "./partner-grid";
import {
  CompanyAddModal,
  CompanyDeleteModal,
  YearAddModal,
  YearDeleteModal,
  YearDeleteWarningModal,
} from "./partner-modal-container";

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
  const [isYearModalOpen, setIsYearModalOpen] = useState(false);
  const [isYearDeleteModalOpen, setIsYearDeleteModalOpen] = useState(false);
  const [isYearDeleteWarningModalOpen, setIsYearDeleteWarningModalOpen] =
    useState(false);
  const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false);
  const [isCompanyDeleteModalOpen, setIsCompanyDeleteModalOpen] =
    useState(false);
  const [availableYears, setAvailableYears] = useState<number[]>([
    2025, 2024, 2023, 2022,
  ]);

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

  // 년도 변경 핸들러
  const handleYearChange = (value: string | number) => {
    if (value === "add_year") {
      setIsYearModalOpen(true);
    } else {
      setSelectedYear(value as number);
    }
  };

  const handleConfirmDeleteYear = async () => {
    try {
      console.log("availableYears.length:", availableYears.length); // 디버그용

      // 현재 회사가 가진 연도가 하나뿐인지 체크
      if (availableYears.length === 1) {
        console.log("경고 모달 열기 시도"); // 디버그용
        // 일반 연도 삭제 모달 닫고, 경고 모달 열기
        setIsYearDeleteModalOpen(false);
        setIsYearDeleteWarningModalOpen(true);
        return;
      }

      // 일반 연도 삭제 (여러 연도 중 하나)
      const updatedYears = availableYears.filter((y) => y !== selectedYear);
      setAvailableYears(updatedYears);
      setSelectedYear(updatedYears[updatedYears.length - 1]); // 마지막 연도로 선택
      setFinancialData([]);
      setIsYearDeleteModalOpen(false);

      console.log(`${selectedYear}년 데이터 삭제`);
    } catch (error) {
      console.error("데이터 삭제 실패:", error);
    }
  };

  // 회사까지 삭제하는 핸들러 (마지막 연도 삭제시)
  const handleConfirmDeleteCompanyWithYear = async () => {
    try {
      // 실제로는 API 호출
      // await deleteCompanyWithYear(selectedCompany, selectedYear);

      const updatedCompanies = companies.filter(
        (c) => c.id !== selectedCompany,
      );
      setCompanies(updatedCompanies);

      // 첫 번째 회사로 선택 변경 (남은 회사가 있다면)
      if (updatedCompanies.length > 0) {
        setSelectedCompany(updatedCompanies[0].id);
      } else {
        setSelectedCompany("");
        setFinancialData([]);
      }

      setIsYearDeleteWarningModalOpen(false);
      console.log(`${selectedYear}년 삭제로 인한 회사 삭제 완료`);
    } catch (error) {
      console.error("회사 삭제 실패:", error);
    }
  };

  // 새 연도 추가 핸들러
  const handleYearAdd = (year: number) => {
    // 연도 추가 및 정렬
    const updatedYears = [...availableYears, year].sort((a, b) => a - b);
    setAvailableYears(updatedYears);
    setSelectedYear(year);
  };

  const handleCompanyAdd = (newCompany: {
    name: string;
    type: "payment" | "collection";
  }) => {
    // 새 ID 생성 (실제로는 서버에서 받아옴)
    const newId = (companies.length + 1).toString();
    const company = { id: newId, ...newCompany };

    const updatedCompanies = [...companies, company];
    setCompanies(updatedCompanies);
    setSelectedCompany(newId); // 새로 추가된 회사를 선택

    console.log("회사 추가:", company);
  };

  //회사 삭제 핸들러
  const handleConfirmDeleteCompany = async () => {
    try {
      // 실제로는 API 호출
      // await deleteCompany(selectedCompany);

      const updatedCompanies = companies.filter(
        (c) => c.id !== selectedCompany,
      );
      setCompanies(updatedCompanies);

      // 첫 번째 회사로 선택 변경 (남은 회사가 있다면)
      if (updatedCompanies.length > 0) {
        setSelectedCompany(updatedCompanies[0].id);
      } else {
        setSelectedCompany("");
        setFinancialData([]);
      }

      setIsCompanyDeleteModalOpen(false);
      console.log("회사 삭제 완료");
    } catch (error) {
      console.error("회사 삭제 실패:", error);
    }
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
          className="w-full justify-between items-center mb-4 sm:mb-6"
        >
          {/* 왼쪽: 회사 및 년도 선택 */}
          <Stack direction="row" spacing={2}>
            {/* 회사 선택 */}
            <FormControl size="small" sx={{ minWidth: 200 }}>
              <InputLabel shrink>회사</InputLabel>
              <Select
                value={selectedCompany}
                label="회사"
                onChange={(e) => setSelectedCompany(e.target.value as string)}
                disabled={loading}
              >
                {companies.map((company) => (
                  <MenuItem key={company.id} value={company.id}>
                    {company.name} (
                    {company.type === "payment" ? "지급" : "수금"})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* 년도 선택 */}
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>년도</InputLabel>
              <Select
                value={selectedYear}
                label="년도"
                onChange={(e) => handleYearChange(e.target.value as number)}
                disabled={loading || !selectedCompany}
              >
                {availableYears.map((year) => (
                  <MenuItem key={year} value={year}>
                    {year}년
                  </MenuItem>
                ))}
                <MenuItem
                  value="add_year"
                  onClick={() => setIsYearModalOpen(true)}
                >
                  + 연도 추가하기
                </MenuItem>
              </Select>
            </FormControl>
          </Stack>

          {/* 오른쪽: 버튼들 */}
          <Stack direction="row" spacing={2}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setIsCompanyModalOpen(true)}
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
              onClick={() => setIsCompanyDeleteModalOpen(true)}
              disabled={loading}
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
              회사 삭제
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setIsYearDeleteModalOpen(true)}
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
          </Stack>
        </Stack>

        {/* 그리드 */}
        <div className="overflow-hidden">
          <PartnerGrid
            companies={companies}
            selectedCompany={selectedCompany}
            selectedYear={selectedYear}
            data={financialData}
            loading={loading}
            onDataChange={setFinancialData}
          />
        </div>
      </div>
      {/* 연도 추가 모달 */}
      <YearAddModal
        open={isYearModalOpen}
        onClose={() => setIsYearModalOpen(false)}
        existingYears={availableYears}
        onSubmit={handleYearAdd}
      />

      {/* 연도 삭제 확인 모달 */}
      <YearDeleteModal
        open={isYearDeleteModalOpen}
        onClose={() => setIsYearDeleteModalOpen(false)}
        onConfirm={handleConfirmDeleteYear}
        year={selectedYear}
      />

      {/* 연도 삭제 경고 모달 (마지막 연도일 때) */}
      <YearDeleteWarningModal
        open={isYearDeleteWarningModalOpen}
        onClose={() => setIsYearDeleteWarningModalOpen(false)}
        onConfirm={handleConfirmDeleteCompanyWithYear}
        companyName={
          companies.find((c) => c.id === selectedCompany)?.name || ""
        }
        year={selectedYear}
      />

      {/* 회사 추가 모달 */}
      <CompanyAddModal
        open={isCompanyModalOpen}
        onClose={() => setIsCompanyModalOpen(false)}
        onSubmit={handleCompanyAdd}
      />

      {/* 회사 삭제 확인 모달 */}
      <CompanyDeleteModal
        open={isCompanyDeleteModalOpen}
        onClose={() => setIsCompanyDeleteModalOpen(false)}
        onConfirm={handleConfirmDeleteCompany}
        companyName={
          companies.find((c) => c.id === selectedCompany)?.name || ""
        }
      />
    </div>
  );
}
