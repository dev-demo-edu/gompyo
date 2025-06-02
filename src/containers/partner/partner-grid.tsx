import { useMemo } from "react";
import {
  CellClassParams,
  CellValueChangedEvent,
  ColDef,
  NewValueParams,
  ValueFormatterParams,
} from "ag-grid-community";
import DataGrid from "@/components/data-grid";
import { CircularProgress } from "@mui/material";
import { changedDataIdsAtom } from "@/states/partner";
import { useAtom } from "jotai";

interface Company {
  id: string;
  name: string;
  type: "payment" | "collection";
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

interface PartnerGridProps {
  companies: Company[];
  selectedCompany: string;
  selectedYear: number;
  data: FinancialData[];
  loading?: boolean;
  editMode: boolean;
  onDataChange: (data: FinancialData[]) => void;
}

// 숫자 포맷팅 함수
const formatNumber = (value: number | null | undefined): string => {
  if (value === null || value === undefined) return "";
  return new Intl.NumberFormat("ko-KR").format(value);
};

// 숫자 파싱 함수 (편집시 사용)
const parseNumber = (
  value: string | number | null | undefined,
): number | null => {
  // null 또는 undefined 체크
  if (value === null || value === undefined) return null;

  // 문자열로 변환
  const stringValue = String(value);

  // 빈 문자열이거나 공백만 있는 경우
  if (!stringValue || stringValue.trim() === "") return null;

  // 쉼표 제거 후 숫자 파싱
  const numericValue = stringValue.replace(/,/g, "");
  const parsed = parseFloat(numericValue);

  return isNaN(parsed) ? null : parsed;
};

export default function PartnerGrid({
  companies,
  selectedCompany,
  selectedYear,
  data,
  loading = false,
  editMode = false,
  onDataChange,
}: PartnerGridProps) {
  const selectedCompanyInfo = companies.find(
    (company) => company.id === selectedCompany,
  );

  // 변경사항 추적 상태 추가
  const [changedDataIds, setChangedDataIds] = useAtom(changedDataIdsAtom);

  const isPayment = selectedCompanyInfo?.type === "payment";
  const purchaseOrSaleText = isPayment ? "구매" : "판매";
  const paymentOrCollectionText = isPayment ? "지급" : "수금";

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
            headerName: purchaseOrSaleText,
            field: "lamplePurchase",
            filter: false,
            sortable: false,
            minWidth: 120,
            flex: 1,
            editable: editMode,
            valueFormatter: (params: ValueFormatterParams) =>
              formatNumber(params.value),
            valueSetter: (params: NewValueParams) => {
              const newValue = parseNumber(params.newValue);
              params.data.lamplePurchase = newValue;
              // 전체 구매 금액 재계산
              params.data.totalPurchase =
                (newValue || 0) + (params.data.gompyoPurchase || 0);
              return true;
            },
          },
          {
            headerName: paymentOrCollectionText,
            field: "lamplePayment",

            filter: false,
            sortable: false,
            minWidth: 120,
            flex: 1,
            editable: editMode,
            valueFormatter: (params: ValueFormatterParams) =>
              formatNumber(params.value),
            valueSetter: (params: NewValueParams) => {
              const newValue = parseNumber(params.newValue);
              params.data.lamplePayment = newValue;
              // 전체 지급 금액 재계산
              params.data.totalPayment =
                (newValue || 0) + (params.data.gompyoPayment || 0);
              return true;
            },
          },
          {
            headerName: "잔액",
            field: "lampleBalance",
            filter: false,
            sortable: false,
            minWidth: 120,
            flex: 1,
            editable: editMode,
            valueFormatter: (params: ValueFormatterParams) =>
              formatNumber(params.value),
            valueSetter: (params: NewValueParams): boolean => {
              const newValue = parseNumber(params.newValue);
              params.data.lampleBalance = newValue;
              // 전체 잔액 재계산
              params.data.totalBalance =
                (newValue || 0) + (params.data.gompyoBalance || 0);
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
            filter: false,
            field: "gompyoPurchase",
            sortable: false,
            minWidth: 120,
            flex: 1,
            editable: editMode,
            valueFormatter: (params: ValueFormatterParams) =>
              formatNumber(params.value),
            valueSetter: (params: NewValueParams) => {
              const newValue = parseNumber(params.newValue);
              params.data.gompyoPurchase = newValue;
              // 전체 구매 금액 재계산
              params.data.totalPurchase =
                (params.data.lamplePurchase || 0) + (newValue || 0);
              return true;
            },
          },
          {
            headerName: "지급",
            filter: false,
            field: "gompyoPayment",
            sortable: false,
            minWidth: 120,
            flex: 1,
            editable: editMode,
            valueFormatter: (params: ValueFormatterParams) =>
              formatNumber(params.value),
            valueSetter: (params: NewValueParams) => {
              const newValue = parseNumber(params.newValue);
              params.data.gompyoPayment = newValue;
              // 전체 지급 금액 재계산
              params.data.totalPayment =
                (params.data.lamplePayment || 0) + (newValue || 0);
              return true;
            },
          },
          {
            headerName: "잔액",
            filter: false,
            field: "gompyoBalance",
            sortable: false,
            minWidth: 120,
            flex: 1,
            editable: editMode,
            valueFormatter: (params: ValueFormatterParams) =>
              formatNumber(params.value),
            valueSetter: (params: NewValueParams) => {
              const newValue = parseNumber(params.newValue);
              params.data.gompyoBalance = newValue;
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
            filter: false,
            sortable: false,
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
            filter: false,
            sortable: false,
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
            filter: false,
            sortable: false,
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
    [purchaseOrSaleText, paymentOrCollectionText, editMode],
  );

  const handleCellValueChanged = (event: CellValueChangedEvent) => {
    console.log("Grid: 셀 값 변경", {
      필드: event.colDef.field,
      이전값: event.oldValue,
      새값: event.newValue,
      행: event.data.month,
    });

    // 변경된 행 ID 추가
    const newChangedIds = new Set(changedDataIds);
    newChangedIds.add(event.data.id);
    setChangedDataIds(newChangedIds);

    // 수정된 데이터를 상위 컴포넌트로 전달
    const updatedData = data.map((item) =>
      item.id === event.data.id ? { ...event.data } : item,
    );
    onDataChange(updatedData);
  };

  return (
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
          editMode={editMode}
        />
      ) : (
        <div className="w-full h-full bg-gray-50 border border-gray-300 rounded-lg flex items-center justify-center">
          <p className="text-gray-500">{selectedYear}년 데이터가 없습니다.</p>
        </div>
      )}
    </div>
  );
}
