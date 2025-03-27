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
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

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

  // 검색어와 날짜로 데이터 필터링
  const filteredData = useMemo(() => {
    return rowData.filter((row) => {
      const matchesSearch =
        !searchTerm ||
        Object.values(row).some(
          (value) =>
            value &&
            value.toString().toLowerCase().includes(searchTerm.toLowerCase()),
        );

      const contractDate = new Date(row.contractDate);
      const isWithinDateRange =
        (!startDate || contractDate >= new Date(startDate)) &&
        (!endDate || contractDate <= new Date(endDate));

      return matchesSearch && isWithinDateRange;
    });
  }, [rowData, searchTerm, startDate, endDate]);

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
    <div className="flex w-full h-[800px] bg-slate-50 rounded-xl overflow-hidden shadow-lg p-6 gap-6">
      {/* 왼쪽 필터 패널 */}
      <div className="w-80 shrink-0">
        <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-4">필터</h2>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  검색어
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="검색어를 입력하세요"
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                    <svg
                      className="w-5 h-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  조회 기간
                </label>
                <div>
                  <input
                    type="date"
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 mb-3"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-200"></div>
                    </div>
                    <div className="relative flex justify-center">
                      <span className="px-2 bg-white text-sm text-gray-500">
                        부터
                      </span>
                    </div>
                  </div>
                  <input
                    type="date"
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 mt-3"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 오른쪽 그리드 */}
      <div className="flex-1 bg-white rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="w-full h-full flex items-center justify-center">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"></div>
              <div
                className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"
                style={{ animationDelay: "0.1s" }}
              ></div>
              <div
                className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"
                style={{ animationDelay: "0.2s" }}
              ></div>
            </div>
          </div>
        ) : (
          <div className="w-full h-full">
            <AgGridReact
              rowData={filteredData}
              columnDefs={columnDefs}
              defaultColDef={defaultColDef}
              pagination={true}
              paginationPageSize={15}
              rowSelection="multiple"
              className="ag-theme-alpine"
            />
          </div>
        )}
      </div>
    </div>
  );
}
