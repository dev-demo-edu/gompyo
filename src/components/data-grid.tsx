"use client";

import { useState, useMemo, useRef, useCallback } from "react";
import type {
  ColDef,
  DragStartedEvent,
  DragStoppedEvent,
  SelectionChangedEvent,
  GridApi,
  GridReadyEvent,
} from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { AG_GRID_LOCALE_KR } from "@ag-grid-community/locale";
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
import { agGridTheme } from "@/styles/theme";
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
  searchDateField?: keyof T & string;
}

export default function DataGrid<T>({
  columnDefs,
  data,
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
  const [isCollapsed, setIsCollapsed] = useState(false);

  // ref 준비
  const gridApiRef = useRef<GridApi | null>(null);

  // 기본 컬럼 설정
  const defaultColDef = useMemo(
    () => ({
      sortable: true,
      resizable: true,
      minWidth: 100,
      filter: true,
      lockPinned: true,
    }),
    [],
  );

  // 컬럼 상태 생성
  const columnState = useMemo(
    () =>
      columnDefs
        .filter((col) => col.field)
        .map((col) => ({
          colId: col.field as string,
          pinned: col.pinned,
          flex: col.flex,
          width: col.width,
          lockPinned: col.lockPinned,
        })),
    [columnDefs],
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
          const value = row[field as keyof T];
          return (
            value &&
            value.toString().toLowerCase().includes(searchTerm.toLowerCase())
          );
        });

      if (searchDateField) {
        const searchDate = new Date(
          row[searchDateField] as string | number | Date,
        );
        const isWithinDateRange =
          (!startDate || searchDate >= new Date(startDate)) &&
          (!endDate || searchDate <= new Date(endDate));
        return matchesSearch && isWithinDateRange;
      }

      return matchesSearch;
    });
  }, [data, searchTerm, startDate, endDate, columnDefs, searchDateField]);

  // onGridReady에서 컬럼 상태 적용
  const handleGridReady = useCallback(
    (params: GridReadyEvent) => {
      gridApiRef.current = params.api;

      // localStorage 등에서 복구할 수도 있음
      gridApiRef.current?.applyColumnState({
        state: columnState,
        applyOrder: true,
      });
    },
    [columnState],
  );

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
              {searchDateField && (
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
              )}
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
        {loading ? (
          <div className="w-full h-full flex items-center justify-center">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-[#22C55E] rounded-full animate-bounce"></div>
              <div
                className="w-3 h-3 bg-[#22C55E] rounded-full animate-bounce"
                style={{ animationDelay: "0.1s" }}
              ></div>
              <div
                className="w-3 h-3 bg-[#22C55E] rounded-full animate-bounce"
                style={{ animationDelay: "0.2s" }}
              ></div>
            </div>
          </div>
        ) : (
          <div className="w-full h-full">
            <AgGridReact
              theme={agGridTheme}
              rowData={filteredData}
              columnDefs={columnDefs}
              defaultColDef={defaultColDef}
              pagination={true}
              paginationPageSize={15}
              rowSelection="multiple"
              localeText={localeText}
              onDragStarted={onDragStarted}
              onDragStopped={onDragStopped}
              onGridReady={handleGridReady}
              onSelectionChanged={onSelectionChanged}
            />
          </div>
        )}
      </div>
    </div>
  );
}
