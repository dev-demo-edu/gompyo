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
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
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

// 날짜를 'YYYY-MM-DD' 문자열로 변환하는 헬퍼 함수
function toDateString(date: string | number | Date) {
  return new Date(date).toISOString().slice(0, 10);
}

interface DataGridProps<T> {
  columnDefs: ColDef[];
  data: T[];
  loading?: boolean;
  error?: string | null;
  onDragStarted?: (event: DragStartedEvent) => void;
  onDragStopped?: (event: DragStoppedEvent) => void;
  onResetColumnOrder?: () => void;
  onSelectionChanged?: (event: SelectionChangedEvent) => void;
  searchDateField?: keyof T & string;
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
  searchDateField,
}: DataGridProps<T>) {
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(true);

  // 검색어와 날짜로 데이터 필터링
  // 검색어와 날짜로 데이터 필터링
  const filteredData = useMemo(() => {
    return data.filter((row) => {
      const matchesSearch =
        !searchTerm ||
        columnDefs.some((col) => {
          const field = col.field;
          if (!field) return false;
          const value = row[field as keyof T];
          return (
            value &&
            value.toString().toLowerCase().includes(searchTerm.toLowerCase())
          );
        });

      if (searchDateField) {
        const searchDateStr = toDateString(row[searchDateField] as Date);
        const startDateStr = startDate ? toDateString(startDate) : null;
        const endDateStr = endDate ? toDateString(endDate) : null;

        if (startDateStr && endDateStr) {
          const isWithinDateRange =
            searchDateStr >= startDateStr && searchDateStr <= endDateStr;
          return matchesSearch && isWithinDateRange;
        } else if (startDateStr) {
          const isAfterStart = searchDateStr >= startDateStr;
          return matchesSearch && isAfterStart;
        } else if (endDateStr) {
          const isBeforeEnd = searchDateStr <= endDateStr;
          return matchesSearch && isBeforeEnd;
        }
        return matchesSearch;
      }

      return matchesSearch;
    });
  }, [data, searchTerm, startDate, endDate, columnDefs, searchDateField]);

  return (
    <div className="flex flex-col md:flex-row w-full h-[800px] bg-transparent rounded-xl overflow-hidden shadow-lg  gap-6">
      {/* 필터 토글 버튼 (모바일) */}
      <button
        onClick={() => {
          const newShowFilter = !showFilter;
          setShowFilter(newShowFilter);
          // 필터를 보여줄 때는 자동으로 펼치기
          if (newShowFilter) {
            setIsCollapsed(false);
          }
        }}
        className="md:hidden flex items-center justify-center gap-2 mb-4 px-4 py-2 bg-white rounded-lg shadow-sm text-gray-700 hover:bg-gray-100 transition-colors"
      >
        <FilterListIcon className="w-5 h-5" />
        <span>필터 {showFilter ? "숨기기" : "보기"}</span>
      </button>
      {/* 필터 패널 */}
      <div
        className={`relative transition-all duration-300 p-6 space-y-6
        ${showFilter ? "block" : "hidden md:block"}
        ${isCollapsed ? "w-12 bg-transparent" : "w-full md:w-80 bg-white rounded-xl shadow-sm"}
        md:shrink-0 overflow-hidden`}
      >
        {/* 접기/펼치기 토글 버튼 */}
        <button
          onClick={() => setIsCollapsed((prev) => !prev)}
          className="absolute right-2 top-2 w-8 h-8 bg-white text-gray-600 rounded-full shadow-md hover:bg-gray-300 transition z-10 hidden md:block"
        >
          {isCollapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
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
          pagination={false}
        />
      </div>
    </div>
  );
}
