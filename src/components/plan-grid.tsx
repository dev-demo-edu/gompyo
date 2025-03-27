"use client";

import { useEffect, useState, useMemo } from "react";
import type { ColDef, ValueFormatterParams } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import type { IPlanData } from "@/constants/dummy-data";
import { dummyPlanData } from "@/constants/dummy-data";

// Register AG-Grid Modules
ModuleRegistry.registerModules([AllCommunityModule]);

// 날짜 포맷터
const dateFormatter = (params: ValueFormatterParams): string => {
  return params.value
    ? new Date(params.value).toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";
};

// 숫자 포맷터 (원화)
const currencyFormatter = (params: ValueFormatterParams): string => {
  return params.value
    ? new Intl.NumberFormat("ko-KR", {
        style: "currency",
        currency: "KRW",
      }).format(params.value)
    : "";
};

// 숫자 포맷터 (kg당)
const perKgFormatter = (params: ValueFormatterParams): string => {
  return params.value
    ? new Intl.NumberFormat("ko-KR", {
        style: "currency",
        currency: "KRW",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(params.value) + "/kg"
    : "";
};

export default function PlanGrid() {
  const [rowData, setRowData] = useState<IPlanData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 컬럼 정의
  const [columnDefs] = useState<ColDef[]>([
    {
      field: "contractNumber",
      headerName: "계약 번호",
      width: 130,
    },
    {
      field: "progressStatus",
      headerName: "진행 상태",
      width: 100,
    },
    {
      field: "contractDate",
      headerName: "계약일자",
      valueFormatter: dateFormatter,
      width: 150,
    },
    {
      field: "importer",
      headerName: "수입처",
      width: 120,
    },
    {
      field: "contractParty",
      headerName: "계약처",
      width: 120,
    },
    {
      field: "estimatedTimeArrival",
      headerName: "ETA",
      valueFormatter: dateFormatter,
      width: 150,
    },
    {
      field: "arrivalPort",
      headerName: "도착항",
      width: 120,
    },
    {
      field: "itemName",
      headerName: "품목",
      width: 120,
    },
    {
      field: "contractTon",
      headerName: "무게",
      valueFormatter: (params) => `${params.value}톤`,
      width: 100,
    },
    {
      field: "unitPrice",
      headerName: "단가",
      valueFormatter: currencyFormatter,
      width: 130,
    },
    {
      field: "totalPrice",
      headerName: "단가 * 무게",
      valueFormatter: currencyFormatter,
      width: 150,
    },
    {
      field: "paymentMethod",
      headerName: "결제방식",
      width: 100,
    },
    {
      field: "warehouseEntryDate",
      headerName: "입고일",
      valueFormatter: dateFormatter,
      width: 150,
    },
    {
      field: "importCostPerKg",
      headerName: "수입가/kg",
      valueFormatter: perKgFormatter,
      width: 130,
    },
    {
      field: "supplyCostPerKg",
      headerName: "수급가/kg",
      valueFormatter: perKgFormatter,
      width: 130,
    },
    {
      field: "totalCost",
      headerName: "총 비용",
      valueFormatter: currencyFormatter,
      width: 150,
    },
    {
      field: "totalCostPerKg",
      headerName: "총 비용/kg",
      valueFormatter: perKgFormatter,
      width: 130,
    },
    {
      field: "sellingPrice",
      headerName: "판매가",
      valueFormatter: currencyFormatter,
      width: 130,
    },
    {
      field: "margin",
      headerName: "마진",
      valueFormatter: (params) => `${params.value}%`,
      width: 100,
    },
    {
      field: "totalProfit",
      headerName: "총 이익",
      valueFormatter: currencyFormatter,
      width: 150,
    },
  ]);

  // 기본 컬럼 설정
  const defaultColDef = useMemo(
    () => ({
      sortable: true,
      filter: true,
      resizable: true,
    }),
    [],
  );

  // 더미 데이터 로딩
  useEffect(() => {
    try {
      setLoading(true);
      // 실제 API 호출 대신 더미 데이터 사용
      setRowData(dummyPlanData);
      setError(null);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "데이터를 불러오는데 실패했습니다.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  if (error) {
    return (
      <div className="w-full h-[800px] bg-white flex items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="w-full h-[800px] bg-white">
      {loading ? (
        <div className="w-full h-full flex items-center justify-center">
          <p>데이터를 불러오는 중...</p>
        </div>
      ) : (
        <AgGridReact
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          pagination={true}
          paginationPageSize={15}
          rowSelection="multiple"
          suppressRowClickSelection={true}
          className="ag-theme-alpine"
        />
      )}
    </div>
  );
}
