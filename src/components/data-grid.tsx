"use client";

import { useState, useMemo } from "react";
import type { ColDef, ValueFormatterParams } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { AG_GRID_LOCALE_KR } from "@ag-grid-community/locale";
import {
  AllCommunityModule,
  ModuleRegistry,
  themeMaterial,
} from "ag-grid-community";
import { FilterList as FilterListIcon } from "@mui/icons-material";

// Register AG-Grid Modules
ModuleRegistry.registerModules([AllCommunityModule]);

// 날짜 포맷터
export const dateFormatter = (params: ValueFormatterParams): string => {
  return params.value
    ? new Date(params.value).toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";
};

// 숫자 포맷터 (원화)
export const currencyFormatter = (params: ValueFormatterParams): string => {
  return params.value
    ? new Intl.NumberFormat("ko-KR", {
        style: "currency",
        currency: "KRW",
      }).format(params.value)
    : "";
};

// 숫자 포맷터 (kg당)
export const perKgFormatter = (params: ValueFormatterParams): string => {
  return params.value
    ? new Intl.NumberFormat("ko-KR", {
        style: "currency",
        currency: "KRW",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(params.value) + "/kg"
    : "";
};

interface DataGridProps<T> {
  columnDefs: ColDef[];
  data: T[];
  loading?: boolean;
  error?: string | null;
}

export default function DataGrid<T>({
  columnDefs,
  data,
  loading = false,
  error = null,
}: DataGridProps<T>) {
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [showFilter, setShowFilter] = useState(false);

  // 기본 컬럼 설정
  const defaultColDef = useMemo(
    () => ({
      sortable: true,
      resizable: true,
      minWidth: 100,
      filter: true,
    }),
    [],
  );

  const localeText = useMemo(() => AG_GRID_LOCALE_KR, []);

  // 검색어와 날짜로 데이터 필터링
  const filteredData = useMemo(() => {
    return data.filter((row) => {
      const matchesSearch =
        !searchTerm ||
        columnDefs.some((col) => {
          const field = col.field;
          if (!field) return false;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const value = (row as any)[field];
          return (
            value &&
            value.toString().toLowerCase().includes(searchTerm.toLowerCase())
          );
        });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const contractDate = new Date((row as any).contractDate);
      const isWithinDateRange =
        (!startDate || contractDate >= new Date(startDate)) &&
        (!endDate || contractDate <= new Date(endDate));

      return matchesSearch && isWithinDateRange;
    });
  }, [data, searchTerm, startDate, endDate, columnDefs]);

  if (error) {
    return (
      <div className="w-full h-[800px] bg-white flex items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row w-full h-[800px] bg-slate-50 rounded-xl overflow-hidden shadow-lg p-6 gap-6">
      {/* 필터 토글 버튼 (모바일) */}
      <button
        onClick={() => setShowFilter(!showFilter)}
        className="md:hidden flex items-center justify-center gap-2 mb-4 px-4 py-2 bg-white rounded-lg shadow-sm text-gray-700 hover:bg-gray-50 transition-colors"
      >
        <FilterListIcon className="w-5 h-5" />
        <span>필터 {showFilter ? "숨기기" : "보기"}</span>
      </button>

      {/* 필터 패널 */}
      <div
        className={`bg-white rounded-xl shadow-sm p-6 space-y-6 ${showFilter ? "block" : "hidden md:block"} w-full md:w-80 md:shrink-0`}
      >
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

      {/* 그리드 */}
      <div className="flex-1 bg-white rounded-xl shadow-sm overflow-hidden min-h-[400px]">
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
              theme={themeMaterial}
              rowData={filteredData}
              columnDefs={columnDefs}
              defaultColDef={defaultColDef}
              pagination={true}
              paginationPageSize={15}
              rowSelection="multiple"
              localeText={localeText}
            />
          </div>
        )}
      </div>
    </div>
  );
}
