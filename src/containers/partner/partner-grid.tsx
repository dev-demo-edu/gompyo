import { useMemo, useState } from "react";
import {
  CellClassParams,
  CellValueChangedEvent,
  ColDef,
  NewValueParams,
  ValueFormatterParams,
} from "ag-grid-community";
import DataGrid from "@/components/data-grid";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

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

export default function PartnerGrid() {
  const [selectedYear, setSelectedYear] = useState(2025);

  const columnDefs: ColDef[] = useMemo(
    () => [
      {
        headerName: "월",
        field: "month",
        pinned: "left",
        width: 120,
        editable: false,
        cellStyle: { fontWeight: "bold" },
      },
      {
        headerName: "램플",
        children: [
          {
            headerName: "구매",
            field: "lamplePurchase",
            width: 120,
            editable: true,
            valueFormatter: (params: ValueFormatterParams) =>
              formatNumber(params.value),
            valueSetter: (params: NewValueParams) => {
              const newValue = parseNumber(params.newValue);
              params.data.lamplePurchase = newValue;
              return true;
            },
          },
          {
            headerName: "지급",
            field: "lamplePayment",
            width: 120,
            editable: true,
            valueFormatter: (params: ValueFormatterParams) =>
              formatNumber(params.value),
            valueSetter: (params: NewValueParams) => {
              const newValue = parseNumber(params.newValue);
              params.data.lamplePayment = newValue;
              return true;
            },
          },
          {
            headerName: "잔액",
            field: "lampleBalance",
            width: 120,
            editable: true,
            valueFormatter: (params: ValueFormatterParams) =>
              formatNumber(params.value),
            valueSetter: (params: NewValueParams): boolean => {
              const newValue = parseNumber(params.newValue);
              params.data.lampleBalance = newValue;
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
        children: [
          {
            headerName: "구매",
            field: "gomyoPurchase",
            width: 120,
            editable: true,
            valueFormatter: (params) => formatNumber(params.value),
            valueSetter: (params) => {
              const newValue = parseNumber(params.newValue);
              params.data.gomyoPurchase = newValue;
              return true;
            },
          },
          {
            headerName: "지급",
            field: "gomyoPayment",
            width: 120,
            editable: true,
            valueFormatter: (params) => formatNumber(params.value),
            valueSetter: (params) => {
              const newValue = parseNumber(params.newValue);
              params.data.gomyoPayment = newValue;
              return true;
            },
          },
          {
            headerName: "잔액",
            field: "gomyoBalance",
            width: 120,
            editable: true,
            valueFormatter: (params) => formatNumber(params.value),
            valueSetter: (params) => {
              const newValue = parseNumber(params.newValue);
              params.data.gomyoBalance = newValue;
              return true;
            },
            cellStyle: (params) => {
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
        children: [
          {
            headerName: "구매",
            field: "totalPurchase",
            width: 120,
            editable: true,
            valueFormatter: (params) => formatNumber(params.value),
            valueSetter: (params) => {
              const newValue = parseNumber(params.newValue);
              params.data.totalPurchase = newValue;
              return true;
            },
          },
          {
            headerName: "지급",
            field: "totalPayment",
            width: 120,
            editable: true,
            valueFormatter: (params) => formatNumber(params.value),
            valueSetter: (params) => {
              const newValue = parseNumber(params.newValue);
              params.data.totalPayment = newValue;
              return true;
            },
          },
          {
            headerName: "잔액",
            field: "totalBalance",
            width: 120,
            editable: true,
            valueFormatter: (params) => formatNumber(params.value),
            valueSetter: (params) => {
              const newValue = parseNumber(params.newValue);
              params.data.totalBalance = newValue;
              return true;
            },
            cellStyle: (params) => {
              if (params.value < 0) {
                return { color: "red" };
              }
              return null;
            },
          },
        ],
      },
    ],
    [],
  );

  const availableYears = [2023, 2024, 2025, 2026];
  const rowData: FinancialData[] = [
    {
      id: "1",
      month: "1월",
      lamplePurchase: 1000,
      lamplePayment: 800,
      lampleBalance: 200,
      gomyoPurchase: 1200,
      gomyoPayment: 1000,
      gomyoBalance: 200,
      totalPurchase: 2200,
      totalPayment: 1800,
      totalBalance: 400,
    },
  ];
  const handleCellValueChanged = (event: CellValueChangedEvent) => {
    console.log("Cell value changed:", event);
    // 여기서 데이터 변경 처리
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
            onChange={(e) => setSelectedYear(e.target.value as number)}
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
        {/* DataGrid 컴포넌트 사용 */}
        <DataGrid
          columnDefs={columnDefs}
          data={rowData}
          pagination={false}
          onCellValueChanged={handleCellValueChanged}
        />

        <div className="w-full h-full bg-gray-50 border border-gray-300 rounded-lg flex items-center justify-center">
          <p className="text-gray-500">
            {selectedYear}년 PartnerGrid 컴포넌트 - DataGrid 연결 대기중
          </p>
        </div>
      </div>
    </div>
  );
}
