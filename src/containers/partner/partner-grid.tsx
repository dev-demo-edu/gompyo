import { useMemo } from "react";
import {
  CellClassParams,
  CellValueChangedEvent,
  ColDef,
  NewValueParams,
  ValueFormatterParams,
} from "ag-grid-community";
import DataGrid from "@/components/data-grid";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  CircularProgress,
} from "@mui/material";

interface FinancialData {
  id: string;
  month: string;
  lamplePurchase: number | null;
  lamplePayment: number | null;
  lampleBalance: number | null;
  gomyoPurchase: number | null;
  gomyoPayment: number | null;
  gomyoBalance: number | null;
  totalPurchase: number | null;
  totalPayment: number | null;
  totalBalance: number | null;
}

interface PartnerGridProps {
  selectedYear: number;
  onYearChange: (year: number) => void;
  data: FinancialData[];
  loading?: boolean;
  onDataChange: (data: FinancialData[]) => void;
}

// 숫자 포맷팅 함수
const formatNumber = (value: number | null | undefined): string => {
  if (value === null || value === undefined) return "";
  return new Intl.NumberFormat("ko-KR").format(value);
};

// 숫자 파싱 함수 (편집시 사용)
const parseNumber = (value: string): number | null => {
  if (!value || value.trim() === "") return null;
  const numericValue = value.replace(/,/g, "");
  const parsed = parseFloat(numericValue);
  return isNaN(parsed) ? null : parsed;
};

export default function PartnerGrid({
  selectedYear,
  onYearChange,
  data,
  loading = false,
  onDataChange,
}: PartnerGridProps) {
  const availableYears = [2023, 2024, 2025, 2026];

  const columnDefs: ColDef[] = useMemo(
    () => [
      {
        headerName: "월",
        headerClass: "text-center",
        field: "month",
        pinned: "left",
        filter: false,
        sortable: false,
        width: 120,
        editable: false,
        cellStyle: { fontWeight: "bold" },
      },
      {
        headerName: "램플",
        headerClass: "text-center",
        children: [
          {
            headerName: "구매",
            field: "lamplePurchase",
            minWidth: 120,
            flex: 1,
            editable: true,
            valueFormatter: (params: ValueFormatterParams) =>
              formatNumber(params.value),
            valueSetter: (params: NewValueParams) => {
              const newValue = parseNumber(params.newValue);
              params.data.lamplePurchase = newValue;
              // 전체 구매 금액 재계산
              params.data.totalPurchase =
                (newValue || 0) + (params.data.gomyoPurchase || 0);
              return true;
            },
          },
          {
            headerName: "지급",
            field: "lamplePayment",
            minWidth: 120,
            flex: 1,
            editable: true,
            valueFormatter: (params: ValueFormatterParams) =>
              formatNumber(params.value),
            valueSetter: (params: NewValueParams) => {
              const newValue = parseNumber(params.newValue);
              params.data.lamplePayment = newValue;
              // 전체 지급 금액 재계산
              params.data.totalPayment =
                (newValue || 0) + (params.data.gomyoPayment || 0);
              return true;
            },
          },
          {
            headerName: "잔액",
            field: "lampleBalance",
            minWidth: 120,
            flex: 1,
            editable: true,
            valueFormatter: (params: ValueFormatterParams) =>
              formatNumber(params.value),
            valueSetter: (params: NewValueParams): boolean => {
              const newValue = parseNumber(params.newValue);
              params.data.lampleBalance = newValue;
              // 전체 잔액 재계산
              params.data.totalBalance =
                (newValue || 0) + (params.data.gomyoBalance || 0);
              return true;
            },
            cellStyle: (params: CellClassParams) => {
              if (params.value < 0) {
                return { color: "red" };
              }
              return null;
            },
          },
        ],
      },
      {
        headerName: "곰표",
        headerClass: "text-center",
        children: [
          {
            headerName: "구매",
            field: "gomyoPurchase",
            minWidth: 120,
            flex: 1,
            editable: true,
            valueFormatter: (params: ValueFormatterParams) =>
              formatNumber(params.value),
            valueSetter: (params: NewValueParams) => {
              const newValue = parseNumber(params.newValue);
              params.data.gomyoPurchase = newValue;
              // 전체 구매 금액 재계산
              params.data.totalPurchase =
                (params.data.lamplePurchase || 0) + (newValue || 0);
              return true;
            },
          },
          {
            headerName: "지급",
            field: "gomyoPayment",
            minWidth: 120,
            flex: 1,
            editable: true,
            valueFormatter: (params: ValueFormatterParams) =>
              formatNumber(params.value),
            valueSetter: (params: NewValueParams) => {
              const newValue = parseNumber(params.newValue);
              params.data.gomyoPayment = newValue;
              // 전체 지급 금액 재계산
              params.data.totalPayment =
                (params.data.lamplePayment || 0) + (newValue || 0);
              return true;
            },
          },
          {
            headerName: "잔액",
            field: "gomyoBalance",
            minWidth: 120,
            flex: 1,
            editable: true,
            valueFormatter: (params: ValueFormatterParams) =>
              formatNumber(params.value),
            valueSetter: (params: NewValueParams) => {
              const newValue = parseNumber(params.newValue);
              params.data.gomyoBalance = newValue;
              // 전체 잔액 재계산
              params.data.totalBalance =
                (params.data.lampleBalance || 0) + (newValue || 0);
              return true;
            },
            cellStyle: (params: CellClassParams) => {
              if (params.value < 0) {
                return { color: "red" };
              }
              return null;
            },
          },
        ],
      },
      {
        headerName: "전체",
        headerClass: "text-center",
        children: [
          {
            headerName: "구매",
            field: "totalPurchase",
            minWidth: 120,
            flex: 1,
            editable: false, // 계산 필드이므로 직접 편집 불가
            valueFormatter: (params: ValueFormatterParams) =>
              formatNumber(params.value),
            cellStyle: { backgroundColor: "#F3F4F6" }, // 계산 필드 표시
          },
          {
            headerName: "지급",
            field: "totalPayment",
            minWidth: 120,
            flex: 1,
            editable: false, // 계산 필드이므로 직접 편집 불가
            valueFormatter: (params: ValueFormatterParams) =>
              formatNumber(params.value),
            cellStyle: { backgroundColor: "#F3F4F6" }, // 계산 필드 표시
          },
          {
            headerName: "잔액",
            field: "totalBalance",
            minWidth: 120,
            flex: 1,
            editable: false, // 계산 필드이므로 직접 편집 불가
            valueFormatter: (params: ValueFormatterParams) =>
              formatNumber(params.value),
            cellStyle: (params: CellClassParams) => {
              const baseStyle = { backgroundColor: "#F3F4F6" };
              if (params.value < 0) {
                return { ...baseStyle, color: "red" };
              }
              return baseStyle;
            },
          },
        ],
      },
    ],
    [],
  );

  const handleCellValueChanged = (event: CellValueChangedEvent) => {
    console.log("Cell value changed:", event);

    // 수정된 데이터를 상위 컴포넌트로 전달
    const updatedData = data.map((item) =>
      item.id === event.data.id ? { ...event.data } : item,
    );
    onDataChange(updatedData);
  };

  return (
    <div className="space-y-4">
      {/* 년도 선택 */}
      <div className="flex justify-start">
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>년도</InputLabel>
          <Select
            value={selectedYear}
            label="년도"
            onChange={(e) => onYearChange(e.target.value as number)}
            disabled={loading}
          >
            {availableYears.map((year) => (
              <MenuItem key={year} value={year}>
                {year}년
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>

      {/* 그리드 */}
      <div className="w-full h-[600px]">
        {loading ? (
          <div className="w-full h-full bg-gray-50 border border-gray-300 rounded-lg flex items-center justify-center">
            <div className="flex flex-col items-center space-y-4">
              <CircularProgress size={40} />
              <p className="text-gray-500">데이터를 불러오는 중...</p>
            </div>
          </div>
        ) : data.length > 0 ? (
          <DataGrid
            columnDefs={columnDefs}
            data={data}
            pagination={false}
            onCellValueChanged={handleCellValueChanged}
          />
        ) : (
          <div className="w-full h-full bg-gray-50 border border-gray-300 rounded-lg flex items-center justify-center">
            <p className="text-gray-500">{selectedYear}년 데이터가 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  );
}
