"use client";

import { useEffect, useState, useMemo } from "react";
import type { ColDef, ValueFormatterParams } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import type { IShipmentData } from "@/constants/dummy-data";
import { dummyShipmentData } from "@/constants/dummy-data";

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

export default function ShipmentGrid() {
  const [rowData, setRowData] = useState<IShipmentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

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
      field: "productName",
      headerName: "제품명",
      width: 150,
    },
    {
      field: "itemName",
      headerName: "품목",
      width: 120,
    },
    {
      field: "weight",
      headerName: "무게",
      valueFormatter: (params) => `${params.value}톤`,
      width: 100,
    },
    {
      field: "containerCount",
      headerName: "컨테이너 개수",
      width: 120,
    },
    {
      field: "packagingUnit",
      headerName: "포장 단위",
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
      field: "supplyPrice",
      headerName: "수급가",
      valueFormatter: currencyFormatter,
      width: 130,
    },
    {
      field: "sellingPrice",
      headerName: "판매가",
      valueFormatter: currencyFormatter,
      width: 130,
    },
    {
      field: "paymentMethod",
      headerName: "결제방식",
      width: 100,
    },
    {
      field: "hsCode",
      headerName: "HS CODE",
      width: 120,
    },
    {
      field: "blNumber",
      headerName: "BL no.",
      width: 120,
    },
    {
      field: "departurePort",
      headerName: "port(출발항)",
      width: 120,
    },
    {
      field: "etd",
      headerName: "ETD",
      valueFormatter: dateFormatter,
      width: 150,
    },
    {
      field: "arrivalPort",
      headerName: "port(도착항)",
      width: 120,
    },
    {
      field: "eta",
      headerName: "ETA",
      valueFormatter: dateFormatter,
      width: 150,
    },
    {
      field: "contractParty",
      headerName: "계약처",
      width: 120,
    },
    {
      field: "customsDate",
      headerName: "통관일자",
      valueFormatter: dateFormatter,
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

  // 검색어로 데이터 필터링
  const filteredData = useMemo(() => {
    if (!searchTerm) return rowData;
    return rowData.filter((row) =>
      Object.values(row).some(
        (value) =>
          value &&
          value.toString().toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    );
  }, [rowData, searchTerm]);

  // 더미 데이터 로딩
  useEffect(() => {
    try {
      setLoading(true);
      setRowData(dummyShipmentData);
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
      <div className="w-full h-[800px] bg-white rounded-lg flex items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="w-full h-[800px] bg-white rounded-lg overflow-hidden">
      <div className="p-4 border-b">
        <input
          type="text"
          placeholder="검색어를 입력하세요"
          className="w-64 px-3 py-2 border rounded-lg"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      {loading ? (
        <div className="w-full h-full flex items-center justify-center">
          <p>데이터를 불러오는 중...</p>
        </div>
      ) : (
        <div className="w-full h-[calc(100%-60px)]">
          <AgGridReact
            rowData={filteredData}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            pagination={true}
            paginationPageSize={15}
            rowSelection="multiple"
            suppressRowClickSelection={true}
            className="ag-theme-alpine"
          />
        </div>
      )}
    </div>
  );
}
