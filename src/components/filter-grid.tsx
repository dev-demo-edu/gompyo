"use client";

import { useState, useMemo } from "react";
import type {
  ColDef,
  DragStartedEvent,
  DragStoppedEvent,
  SelectionChangedEvent,
} from "ag-grid-community";
import {
  AllCommunityModule,
  ModuleRegistry,
  ICellRendererParams,
} from "ag-grid-community";
import {
  FilterList as FilterListIcon,
  RestartAlt as RestartAltIcon,
} from "@mui/icons-material";
import Link from "next/link";
import DataGrid from "./data-grid";
ModuleRegistry.registerModules([AllCommunityModule]);

// 상세 페이지 이동 버튼 렌더러
export const DetailButtonRenderer = (params: ICellRendererParams) => {
  return (
    <div className="flex justify-center items-center h-full">
      <Link
        href={`/detail/${params.data.id}`}
        className="inline-block px-4 py-1.5 bg-[#22C55E] text-white rounded-lg hover:bg-[#16A34A] transition-colors text-sm font-medium text-center"
      >
        상세보기
      </Link>
    </div>
  );
};

interface DataGridProps<T> {
  columnDefs: ColDef[];
  data: T[];
  loading?: boolean;
  error?: string | null;
  onDragStarted?: (event: DragStartedEvent) => void;
  onDragStopped?: (event: DragStoppedEvent) => void;
  onResetColumnOrder?: () => void;
  onSelectionChanged?: (event: SelectionChangedEvent) => void;
}

export default function FilterGrid<T>({
  columnDefs,
  data = [],
  loading = false,
  error = null,
  onDragStarted,
  onDragStopped,
  onResetColumnOrder,
  onSelectionChanged,
}: DataGridProps<T>) {
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

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
        className={`relative transition-all duration-300 p-6 space-y-6
        ${showFilter ? "block" : "hidden md:block"}
        ${isCollapsed ? "w-12 bg-slate-50" : "w-full md:w-80 bg-white rounded-xl shadow-sm"}
        md:shrink-0 overflow-hidden`}
      >
        {/* 접기/펼치기 토글 버튼 */}
        <button
          onClick={() => setIsCollapsed((prev) => !prev)}
          className="absolute right-2 top-2 w-8 h-8 bg-gray-200 text-gray-600 rounded-full shadow-md hover:bg-gray-300 transition z-10 hidden md:block"
        >
          {isCollapsed ? ">" : "<"}
        </button>
        {/* 내용 */}
        {!isCollapsed && (
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-4">필터</h2>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  검색어
                </label>
                <input
                  type="text"
                  placeholder="검색어를 입력하세요"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  조회 기간
                </label>
                <input
                  type="date"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 mb-3"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
                <input
                  type="date"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
              {onResetColumnOrder && (
                <button
                  onClick={onResetColumnOrder}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <RestartAltIcon className="w-5 h-5" />
                  <span>컬럼 순서 초기화</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
      {/* 그리드 */}
      <div className="flex-1 bg-white rounded-xl shadow-sm overflow-hidden min-h-[400px]">
        <DataGrid
          columnDefs={columnDefs}
          data={filteredData}
          loading={loading}
          error={error}
          onDragStarted={onDragStarted}
          onDragStopped={onDragStopped}
          onSelectionChanged={onSelectionChanged}
        />
      </div>
    </div>
  );
}
