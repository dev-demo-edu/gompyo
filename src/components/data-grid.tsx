"use client";

import { useMemo, useRef, useCallback } from "react";
import type {
  ColDef,
  DragStartedEvent,
  DragStoppedEvent,
  SelectionChangedEvent,
  GridApi,
  GridReadyEvent,
  RowDragEndEvent,
  CellClickedEvent,
  CellValueChangedEvent,
} from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { AG_GRID_LOCALE_KR } from "@ag-grid-community/locale";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import { agGridTheme } from "@/styles/theme";
import { CheckboxFilterReact } from "./custom-checkbox-filter";
ModuleRegistry.registerModules([AllCommunityModule]);

interface DataGridProps<T> {
  columnDefs: ColDef[];
  data: T[];
  loading?: boolean;
  error?: string | null;
  onDragStarted?: (event: DragStartedEvent) => void;
  onDragStopped?: (event: DragStoppedEvent) => void;
  onResetColumnOrder?: () => void;
  onSelectionChanged?: (event: SelectionChangedEvent) => void;
  pagination?: boolean;
  paginationPageSize?: number;
  onRowDragEnd?: (event: RowDragEndEvent) => void;
  onCellValueChanged?: (event: CellValueChangedEvent) => void;
  rowSelection?: "single" | "multiple";
  suppressRowClickSelection?: boolean;
}

// 추후 사용 여부에 따라서 utils로 빼기

export default function DataGrid<T>({
  columnDefs,
  data,
  loading = false,
  error = null,
  onDragStarted,
  onDragStopped,
  onSelectionChanged,
  pagination = true,
  paginationPageSize = 15,
  onRowDragEnd,
  onCellValueChanged,
  rowSelection = "multiple",
  suppressRowClickSelection = true,
}: DataGridProps<T>) {
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

  // 커스텀 필터 컴포넌트 등록
  const components = useMemo(() => {
    console.log("Registering custom filter component:", CheckboxFilterReact);
    return {
      checkboxFilter: CheckboxFilterReact,
    };
  }, []);

  // 커스텀 필터가 적용된 컬럼 정의
  const processedColumnDefs = useMemo(() => {
    const result = columnDefs.map((colDef) => {
      // 체크박스 컬럼은 필터 제외
      if (colDef.field === "checkbox") {
        return { ...colDef, filter: false };
      }

      // 명시적으로 다른 필터를 지정한 경우
      if (
        colDef.filter === false ||
        colDef.filter === "agTextColumnFilter" ||
        colDef.filter === "agNumberColumnFilter"
      ) {
        return colDef;
      }

      // 커스텀 체크박스 필터 적용
      return {
        ...colDef,
        filter: "checkboxFilter",
        floatingFilter: false,
        filterParams: {
          ...colDef.filterParams,
        },
      };
    });
    console.log("Processed column definitions:", result);
    return result;
  }, [columnDefs]);

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

  const onCellClicked = useCallback((params: CellClickedEvent) => {
    // 체크박스 컬럼에서만 선택 처리
    if (params.colDef.field === "checkbox") {
      params.node.setSelected(!params.node.isSelected());
    }
  }, []);

  // onGridReady에서 컬럼 상태 적용
  const handleGridReady = useCallback(
    (params: GridReadyEvent) => {
      gridApiRef.current = params.api;
      gridApiRef.current?.applyColumnState({
        state: columnState,
        applyOrder: true,
      });
    },
    [columnState],
  );

  if (error) {
    return (
      <div className="w-full h-full bg-white flex items-center justify-center overflow-y-auto">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="ag-theme-material w-full h-full bg-slate-50 rounded-xl overflow-hidden shadow-lg">
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
            rowData={data}
            columnDefs={processedColumnDefs}
            defaultColDef={defaultColDef}
            components={components}
            pagination={pagination}
            paginationPageSize={paginationPageSize}
            rowSelection={rowSelection}
            localeText={localeText}
            onDragStarted={onDragStarted}
            onDragStopped={onDragStopped}
            onGridReady={handleGridReady}
            onSelectionChanged={onSelectionChanged}
            rowDragManaged={true}
            animateRows={true}
            getRowId={(params) => params.data.id}
            onRowDragEnd={onRowDragEnd}
            suppressRowClickSelection={suppressRowClickSelection}
            onCellClicked={onCellClicked}
            onCellValueChanged={onCellValueChanged}
          />
        </div>
      )}
    </div>
  );
}
