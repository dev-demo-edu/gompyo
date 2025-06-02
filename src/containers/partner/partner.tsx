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
} from "./partner-modal-container";
import {
  availableYearsAtom,
  changedDataIdsAtom,
  clearChangesAtom,
  companiesAtom,
  Company,
  FinancialData,
  financialDataAtom,
  partnerRefreshAtom,
  selectedCompanyAtom,
  selectedYearAtom,
} from "@/states/partner";
import { useAtom, useAtomValue, useSetAtom } from "jotai";

// 서버액션 완성 시 삭제 - Mock데이터
const generateMockCompanies = (): Company[] => {
  return [
    { id: "1", name: "디앤비", type: "payment" },
    { id: "2", name: "대한", type: "payment" },
    { id: "3", name: "남해", type: "collection" },
    { id: "4", name: "박인터", type: "collection" },
    { id: "5", name: "한끼", type: "payment" },
  ];
};

// 서버액션 완성 시 삭제 - 회사 목록 API 호출 함수 (현재는 목업)
const fetchCompanies = async (): Promise<Company[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(generateMockCompanies());
    }, 300);
  });
};

// 서버액션 완성 시 삭제 - Mock 재무 데이터 생성
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

// 서버액션 완성 시 삭제 - Mock API 호출
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
  // 전역 상태
  const companies = useAtomValue(companiesAtom);
  const [selectedCompany, setSelectedCompany] = useAtom(selectedCompanyAtom);
  const [selectedYear, setSelectedYear] = useAtom(selectedYearAtom);
  const financialData = useAtomValue(financialDataAtom);
  const availableYears = useAtomValue(availableYearsAtom);
  const refresh = useAtomValue(partnerRefreshAtom);

  // 변경사항 관련 상태 추가
  const changedDataIds = useAtomValue(changedDataIdsAtom);
  const clearChanges = useSetAtom(clearChangesAtom);

  const setCompanies = useSetAtom(companiesAtom);
  const setAvailableYears = useSetAtom(availableYearsAtom);
  const setFinancialData = useSetAtom(financialDataAtom);

  // 로컬 UI 상태들
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [isYearModalOpen, setIsYearModalOpen] = useState(false);
  const [isYearDeleteModalOpen, setIsYearDeleteModalOpen] = useState(false);
  const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false);
  const [isCompanyDeleteModalOpen, setIsCompanyDeleteModalOpen] =
    useState(false);
  const [saving, setSaving] = useState(false);

  // 초기 데이터 로드
  useEffect(() => {
    const loadCompanies = async () => {
      try {
        //서버액션 완성 시 실제 api로 교체
        const companiesData = await fetchCompanies();
        setCompanies(companiesData);

        if (companiesData.length > 0) {
          setSelectedCompany(companiesData[0].id);
          // 첫 번째 회사의 년도 목록도 설정
          setAvailableYears([2025, 2024, 2023, 2022]);
        }
      } catch (error) {
        console.error("회사 목록 로드 실패:", error);
      }
    };

    loadCompanies();
  }, [refresh]); // refresh 감지

  // 재무 데이터 로드
  useEffect(() => {
    const loadData = async () => {
      if (!selectedCompany || !selectedYear) return;

      setLoading(true);
      try {
        //서버액션 완성 시 실제 API로 교체
        const data = await fetchFinancialData(selectedCompany, selectedYear);
        setFinancialData(data);
      } catch (error) {
        console.error("데이터 로드 실패:", error);
        setFinancialData([]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [selectedCompany, selectedYear]);

  const handleEditModeToggle = async () => {
    if (editMode && changedDataIds.size > 0) {
      setSaving(true);
      try {
        const changedData = financialData.filter((item) =>
          changedDataIds.has(item.id),
        );

        // 서버액션 완성 시 아래 임시 코드들 삭제하고 실제 서버액션 호출
        console.log("서버에 저장될 데이터:", {
          companyId: selectedCompany,
          year: selectedYear,
          changedData,
        });

        // 서버액션 완성 시 삭제 - 임시 딜레이
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // 유지: 실제 서버액션으로 교체
        // await saveFinancialDataAction(selectedCompany, selectedYear, changedData);

        clearChanges();
        console.log("저장 완료!");
      } catch (error) {
        console.error("저장 실패:", error);
        setSaving(false);
        return;
      } finally {
        setSaving(false);
      }
    }

    setEditMode(!editMode);
  };

  // 년도 변경 핸들러
  const handleYearChange = (value: string | number) => {
    if (value === "add_year") {
      setIsYearModalOpen(true);
    } else {
      setSelectedYear(value as number);
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
              color="secondary"
              onClick={handleEditModeToggle}
              disabled={loading || financialData.length === 0}
              sx={{
                minWidth: 120,
                fontWeight: 600,
                backgroundColor: editMode ? "#f3f4f6" : "#64748b",
                color: editMode ? "#374151" : "#fff",
                "&:hover": {
                  backgroundColor: editMode ? "#e5e7eb" : "#475569",
                },
                "&:disabled": {
                  backgroundColor: "#9CA3AF",
                },
                boxShadow: "none",
                border: editMode ? "1px solid #cbd5e1" : "none",
              }}
            >
              {editMode ? "편집 종료" : "편집 모드"}
            </Button>
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
              disabled={loading || financialData.length === 0 || saving}
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
            editMode={editMode}
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
      />

      {/* 연도 삭제 확인 모달 */}
      <YearDeleteModal
        open={isYearDeleteModalOpen}
        onClose={() => setIsYearDeleteModalOpen(false)}
      />

      {/* 회사 추가 모달 */}
      <CompanyAddModal
        open={isCompanyModalOpen}
        onClose={() => setIsCompanyModalOpen(false)}
      />

      {/* 회사 삭제 확인 모달 */}
      <CompanyDeleteModal
        open={isCompanyDeleteModalOpen}
        onClose={() => setIsCompanyDeleteModalOpen(false)}
        companyName={
          companies.find((c) => c.id === selectedCompany)?.name || ""
        }
      />
    </div>
  );
}
