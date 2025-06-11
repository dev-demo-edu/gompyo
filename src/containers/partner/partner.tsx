"use client";

import { useState, useEffect } from "react";
import { Stack, Button, FormControl, InputLabel, Alert } from "@mui/material";
import { Select } from "@mui/material";
import { MenuItem } from "@mui/material";
import PartnerGrid from "./partner-grid";
import {
  CompanyAddModal,
  CompanyDeleteModal,
  EditCancelConfirmModal,
  YearAddModal,
  YearDeleteModal,
} from "./partner-modal-container";
import {
  availableYearsAtom,
  companiesAtom,
  financialDataAtom,
  partnerRefreshAtom,
  selectedCompanyAtom,
  selectedYearAtom,
} from "@/states/partner";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { GridApi } from "ag-grid-community";
import { FinancialData, FinancialDataWithCalculated } from "@/types/partner";
import {
  fetchCompanies,
  fetchFinancialData,
  saveFinancialData,
  fetchAvailableYears,
} from "@/actions/partner";

/**
 * 재무 데이터에 계산된 필드들을 추가하는 함수
 */
async function calculateFinancialData(
  data: FinancialData[],
  companyId: string,
  year: number,
): Promise<FinancialDataWithCalculated[]> {
  // 회사 정보 조회 (타입 확인용)
  const companyInfo = await fetchCompanies();
  const company = companyInfo.find((c) => c.id === companyId);
  const companyType = company?.type || "collection";

  // 데이터를 월 순서대로 정렬
  const sortedData = [...data].sort((a, b) => {
    const monthOrder = {
      이월잔액: 0,
      "1월": 1,
      "2월": 2,
      "3월": 3,
      "4월": 4,
      "5월": 5,
      "6월": 6,
      "7월": 7,
      "8월": 8,
      "9월": 9,
      "10월": 10,
      "11월": 11,
      "12월": 12,
    };
    const orderA = monthOrder[a.month as keyof typeof monthOrder] ?? 999;
    const orderB = monthOrder[b.month as keyof typeof monthOrder] ?? 999;
    return orderA - orderB;
  });

  const result: FinancialDataWithCalculated[] = [];
  let lampleRunningBalance = 0;
  let gompyoRunningBalance = 0;

  for (let i = 0; i < sortedData.length; i++) {
    const item = sortedData[i];

    if (item.isCarryover) {
      // 이월잔액: 구매 필드에 저장된 값을 잔액으로 사용
      lampleRunningBalance = item.lamplePurchase || 0;
      gompyoRunningBalance = item.gompyoPurchase || 0;

      result.push({
        ...item,
        year,
        companyId,
        lampleBalance: lampleRunningBalance,
        gompyoBalance: gompyoRunningBalance,
        totalPurchase: null,
        totalPayment: null,
        totalBalance: lampleRunningBalance + gompyoRunningBalance,
      });
    } else {
      // 월별 데이터: 이전 잔액 + 구매 - 지급으로 누적 계산
      const lamplePurchase = item.lamplePurchase || 0;
      const lamplePayment = item.lamplePayment || 0;
      const gompyoPurchase = item.gompyoPurchase || 0;
      const gompyoPayment = item.gompyoPayment || 0;

      // 회사 타입에 따른 잔액 계산
      if (companyType === "payment") {
        // 지급 회사: 구매하면 빚이 늘어나고(음수), 지급하면 빚이 줄어듦(양수)
        lampleRunningBalance =
          lampleRunningBalance - lamplePurchase + lamplePayment;
        gompyoRunningBalance =
          gompyoRunningBalance - gompyoPurchase + gompyoPayment;
      } else {
        // 수금 회사: 판매하면 채권이 늘어나고(양수), 수금하면 채권이 줄어듦(음수)
        lampleRunningBalance =
          lampleRunningBalance + lamplePurchase - lamplePayment;
        gompyoRunningBalance =
          gompyoRunningBalance + gompyoPurchase - gompyoPayment;
      }

      const totalPurchase = lamplePurchase + gompyoPurchase;
      const totalPayment = lamplePayment + gompyoPayment;
      const totalBalance = lampleRunningBalance + gompyoRunningBalance;

      result.push({
        ...item,
        year,
        companyId,
        lampleBalance: lampleRunningBalance,
        gompyoBalance: gompyoRunningBalance,
        totalPurchase: totalPurchase || null,
        totalPayment: totalPayment || null,
        totalBalance: totalBalance,
      });
    }
  }

  return result;
}

/**
 * 계산된 데이터를 원본 데이터로 변환하는 함수 (저장용)
 */
function stripCalculatedFields(
  data: FinancialDataWithCalculated[],
): FinancialData[] {
  return data.map((item) => {
    // 이월잔액인 경우 잔액 값을 구매 필드에 저장
    if (item.isCarryover) {
      return {
        id: item.id,
        yearId: item.yearId,
        month: item.month,
        isCarryover: item.isCarryover,
        lamplePurchase: item.lampleBalance || 0,
        lamplePayment: 0,
        gompyoPurchase: item.gompyoBalance || 0,
        gompyoPayment: 0,
      };
    }

    // 일반 월별 데이터는 기존 방식 유지
    return {
      id: item.id,
      yearId: item.yearId,
      month: item.month,
      isCarryover: item.isCarryover,
      lamplePurchase: item.lamplePurchase,
      lamplePayment: item.lamplePayment,
      gompyoPurchase: item.gompyoPurchase,
      gompyoPayment: item.gompyoPayment,
    };
  });
}

export default function Partner() {
  // 전역 상태
  const companies = useAtomValue(companiesAtom);
  const [selectedCompany, setSelectedCompany] = useAtom(selectedCompanyAtom);
  const [selectedYear, setSelectedYear] = useAtom(selectedYearAtom);
  const rawFinancialData = useAtomValue(financialDataAtom);
  const availableYears = useAtomValue(availableYearsAtom);
  const refresh = useAtomValue(partnerRefreshAtom);

  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  const setCompanies = useSetAtom(companiesAtom);
  const setAvailableYears = useSetAtom(availableYearsAtom);
  const setFinancialData = useSetAtom(financialDataAtom);
  const setPartnerRefresh = useSetAtom(partnerRefreshAtom);

  // 로컬 UI 상태들
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [isYearModalOpen, setIsYearModalOpen] = useState(false);
  const [isYearDeleteModalOpen, setIsYearDeleteModalOpen] = useState(false);
  const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false);
  const [isCompanyDeleteModalOpen, setIsCompanyDeleteModalOpen] =
    useState(false);
  const [saving, setSaving] = useState(false);

  const [editingCellError, setEditingCellError] = useState("");
  const [gridApi, setGridApi] = useState<GridApi | null>(null);
  const [error, setError] = useState<string | null>(null);

  // 로컬 편집 상태 (계산된 필드 포함)
  const [editingData, setEditingData] = useState<FinancialDataWithCalculated[]>(
    [],
  );
  const [financialData, setFinancialDataWithCalculated] = useState<
    FinancialDataWithCalculated[]
  >([]);

  // 재무 데이터 계산 및 설정
  useEffect(() => {
    const calculateAndSetData = async () => {
      if (!selectedCompany || !selectedYear) return;

      try {
        if (editMode) {
          // 편집 모드에서는 editingData 사용
          return;
        }

        const calculatedData = await calculateFinancialData(
          rawFinancialData,
          selectedCompany,
          selectedYear,
        );
        setFinancialDataWithCalculated(calculatedData);
      } catch (error) {
        console.error("재무 데이터 계산 실패:", error);
        setFinancialDataWithCalculated([]);
      }
    };

    calculateAndSetData();
  }, [rawFinancialData, editMode, selectedCompany, selectedYear]);

  // 편집 모드일 때는 editingData를 표시
  const displayData = editMode ? editingData : financialData;

  // 초기 데이터 로드
  useEffect(() => {
    const loadCompanies = async () => {
      try {
        setError(null);
        const companiesData = await fetchCompanies();
        setCompanies(companiesData);

        if (companiesData.length > 0) {
          const firstCompanyId = companiesData[0].id;
          setSelectedCompany(firstCompanyId);

          // 첫 번째 회사의 년도 목록 조회
          const years = await fetchAvailableYears(firstCompanyId);
          setAvailableYears(years);

          // 가장 최근 연도 선택 (없으면 현재 연도)
          if (years.length > 0) {
            setSelectedYear(years[0]);
          } else {
            setSelectedYear(new Date().getFullYear());
          }
        }
      } catch (error) {
        console.error("회사 목록 로드 실패:", error);
        setError(
          error instanceof Error
            ? error.message
            : "회사 목록을 불러오는데 실패했습니다.",
        );
      }
    };

    loadCompanies();
  }, [refresh]); // refresh 감지

  // 선택된 회사가 변경될 때 해당 회사의 연도 목록 조회
  useEffect(() => {
    const loadAvailableYears = async () => {
      if (!selectedCompany) return;

      try {
        const years = await fetchAvailableYears(selectedCompany);
        setAvailableYears(years);

        // 연도가 있으면 첫 번째 연도 선택, 없으면 현재 연도
        if (years.length > 0) {
          setSelectedYear(years[0]);
        } else {
          setSelectedYear(new Date().getFullYear());
        }
      } catch (error) {
        console.error("사용 가능한 연도 목록 조회 실패:", error);
        // 에러가 발생해도 기본 연도는 설정
        setSelectedYear(new Date().getFullYear());
      }
    };

    loadAvailableYears();
  }, [selectedCompany]);

  // 재무 데이터 로드
  useEffect(() => {
    const loadData = async () => {
      if (!selectedCompany || !selectedYear) return;

      // 선택된 연도가 사용 가능한 연도 목록에 없는 경우 처리
      if (availableYears.length > 0 && !availableYears.includes(selectedYear)) {
        setSelectedYear(availableYears[0]);
        return;
      }

      setLoading(true);
      try {
        setError(null);
        const data = await fetchFinancialData(selectedCompany, selectedYear);
        setFinancialData(data);
        // 편집 모드가 아닐 때만 편집 데이터 초기화
        if (!editMode) {
          const calculatedData = await calculateFinancialData(
            data,
            selectedCompany,
            selectedYear,
          );
          setEditingData(calculatedData);
        }
      } catch (error) {
        console.error("데이터 로드 실패:", error);
        setError(
          error instanceof Error
            ? error.message
            : "데이터를 불러오는데 실패했습니다.",
        );
        setFinancialData([]);
        setEditingData([]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [selectedCompany, selectedYear, refresh, availableYears]);

  const handleEditModeToggle = async () => {
    if (!editMode) {
      setEditMode(true);
      setEditingCellError(""); // 편집 모드 시작할 때 에러 메시지 클리어
      // 편집 모드 시작 시 현재 데이터로 편집 상태 초기화
      const calculatedData = await calculateFinancialData(
        rawFinancialData,
        selectedCompany!,
        selectedYear!,
      );
      setEditingData(calculatedData);
      return;
    }

    // 편집 중인 셀 체크
    if (gridApi) {
      const editingCells = gridApi.getEditingCells();

      if (editingCells.length > 0) {
        setEditingCellError("편집 중인 셀을 완료해주세요");
        return;
      }
    }

    setEditingCellError("");

    if (editMode) {
      setSaving(true);

      try {
        setError(null);
        // 계산된 필드를 제거하고 원본 데이터만 저장
        const dataToSave = stripCalculatedFields(editingData);
        await saveFinancialData(selectedCompany!, selectedYear!, dataToSave);
        console.log("저장 완료!");

        // 저장 후 최신 데이터를 다시 로드
        const freshData = await fetchFinancialData(
          selectedCompany!,
          selectedYear!,
        );
        setFinancialData(freshData);

        // 계산된 데이터도 업데이트
        const calculatedData = await calculateFinancialData(
          freshData,
          selectedCompany!,
          selectedYear!,
        );
        setEditingData(calculatedData);
        setFinancialDataWithCalculated(calculatedData);

        // 전역 refresh 상태 업데이트 (다른 컴포넌트에서도 새로고침 되도록)
        setPartnerRefresh((prev) => prev + 1);
      } catch (error) {
        console.error("저장 실패:", error);
        setError(
          error instanceof Error ? error.message : "저장에 실패했습니다.",
        );
        setSaving(false);
        return;
      } finally {
        setSaving(false);
      }
    }

    setEditMode(false);
  };

  const cancelEditMode = async () => {
    // 원본 데이터로 복구
    setEditMode(false);
    setShowCancelConfirm(false);
    const calculatedData = await calculateFinancialData(
      rawFinancialData,
      selectedCompany!,
      selectedYear!,
    );
    setEditingData(calculatedData);
  };

  // 편집 취소
  const handleEditCancel = () => {
    setShowCancelConfirm(true);
    setEditingCellError("");
  };

  // 년도 변경 핸들러
  const handleYearChange = (value: string | number) => {
    if (value === "add_year") {
      setIsYearModalOpen(true);
    } else {
      setSelectedYear(value as number);
    }
  };

  const handleGridReady = (api: GridApi) => {
    setGridApi(api);
  };

  // 그리드에서 데이터 변경 시 호출되는 함수
  const handleDataChange = (newData: FinancialDataWithCalculated[]) => {
    if (editMode) {
      setEditingData(newData);
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-100">
      <div className="p-4 sm:p-8">
        <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">
          거래처 관리
        </h1>

        {/* 에러 메시지 표시 */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

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
                value={selectedCompany || ""}
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
                value={selectedYear || ""}
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
          <Stack direction="row" spacing={2} alignItems="flex-start">
            {!editMode && (
              <>
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
                  disabled={loading || !selectedCompany}
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
                  disabled={
                    loading ||
                    displayData.length === 0 ||
                    saving ||
                    !selectedCompany ||
                    !selectedYear
                  }
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
              </>
            )}
            {editMode && (
              <>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={handleEditCancel}
                  disabled={saving}
                  sx={{
                    minWidth: 120,
                    fontWeight: 600,
                    borderColor: "#EF4444",
                    color: "#EF4444",
                    "&:hover": {
                      backgroundColor: "#FEF2F2",
                      borderColor: "#DC2626",
                      color: "#DC2626",
                    },
                    "&:disabled": {
                      borderColor: "#9CA3AF",
                      color: "#9CA3AF",
                    },
                  }}
                >
                  편집 취소
                </Button>
              </>
            )}
            <div className="flex flex-col">
              <Button
                variant="contained"
                color="secondary"
                onClick={handleEditModeToggle}
                disabled={loading || displayData.length === 0}
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
                {editMode ? (saving ? "저장 중..." : "편집 저장") : "편집 모드"}
              </Button>
              {editingCellError && (
                <span className="text-red-500 text-xs mt-1 whitespace-nowrap">
                  {editingCellError}
                </span>
              )}
            </div>
          </Stack>
        </Stack>

        {/* 그리드 */}
        <div className="overflow-hidden">
          <PartnerGrid
            editMode={editMode}
            companies={companies}
            selectedCompany={selectedCompany}
            selectedYear={selectedYear}
            data={displayData}
            loading={loading}
            onDataChange={handleDataChange}
            onGridReady={handleGridReady}
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
      <EditCancelConfirmModal
        open={showCancelConfirm}
        onClose={() => setShowCancelConfirm(false)}
        onConfirm={cancelEditMode}
      />
    </div>
  );
}
