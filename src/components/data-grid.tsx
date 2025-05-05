"use client";

import { useMemo, useRef, useCallback } from "react";
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
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import { agGridTheme } from "@/styles/theme";
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
}

export default function DataGrid<T>({
  columnDefs,
  data,
  loading = false,
  error = null,
  onDragStarted,
  onDragStopped,
  onSelectionChanged,
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
      <div className="w-full h-[800px] bg-white flex items-center justify-center overflow-y-auto">
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
  );
}
