"use client";

import React, { useEffect, useState, useMemo, useCallback } from "react";
import type { ColDef, DragStoppedEvent } from "ag-grid-community";
import { IPlanData } from "@/types/grid-col";
import { getPlanData } from "@/actions/plan";
import {
  getUserPlanColumnOrder,
  saveUserPlanColumnOrder,
} from "@/actions/user";
import useDragColumnChange from "@/hooks/useDragColumnChange";
import { useAtomValue } from "jotai";
import { refreshPlanAtom } from "@/states/document-state";
import {
  DEFAULT_PLAN_COLUMN,
  defaultPlanColumnOrderFields,
} from "@/constants/column";
import FilterGrid from "./filter-grid";
import { DetailButtonRenderer } from "./cell-renderers";
// 컬럼 드래그 커스텀 훅

export default function PlanGrid() {
  const [rowData, setRowData] = useState<IPlanData[]>([]);
  const [columnOrder, setColumnOrder] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 컬럼 정의
  const columnDefs = useMemo<ColDef[]>(() => {
    const orderedColumns =
      columnOrder.length > 0
        ? columnOrder
            .map((field) => {
              const col = DEFAULT_PLAN_COLUMN.find((c) => c.field === field);
              if (!col) {
                console.warn(
                  `Column ${field} not found in DEFAULT_PLAN_COLUMN`,
                );
                return null;
              }
              return col;
            })
            .filter((col): col is ColDef => col !== null)
        : DEFAULT_PLAN_COLUMN;

    return [
      ...orderedColumns,
      {
        headerName: "상세",
        field: "detail",
        cellRenderer: DetailButtonRenderer,
        sortable: false,
        filter: false,
        width: 100,
        pinned: "right",
        lockPinned: false,
      },
    ];
  }, [columnOrder]);

  // 컬럼 드래그 저장 핸들러
  const handleColumnDragSave = useCallback(async (e: DragStoppedEvent) => {
    const newColumnOrder = e.api
      .getColumnState()
      .map((c) => c.colId as string)
      .filter((colId) => colId !== "detail");

    try {
      const result = await saveUserPlanColumnOrder(newColumnOrder);
      console.log("Column order save result:", result);

      if (result.success) {
        setColumnOrder(newColumnOrder);
      }
    } catch (error) {
      console.error("컬럼 순서 저장 중 오류:", error);
    }
  }, []);

  // 컬럼 순서 리셋 핸들러
  const handleResetColumnOrder = useCallback(async () => {
    try {
      const result = await saveUserPlanColumnOrder(
        defaultPlanColumnOrderFields,
      );
      if (result.success) {
        setColumnOrder(defaultPlanColumnOrderFields);
      }
    } catch (error) {
      console.error("컬럼 순서 리셋 중 오류:", error);
    }
  }, []);

  // 드래그 이벤트 훅 생성
  const { onDragStarted, onDragStopped } =
    useDragColumnChange(handleColumnDragSave);

  // DB 데이터 로딩
  const refreshTrigger = useAtomValue(refreshPlanAtom);
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getPlanData();
        const userColumnOrder = await getUserPlanColumnOrder();
        setRowData(data);
        setColumnOrder(userColumnOrder || defaultPlanColumnOrderFields);
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
    };

    fetchData();
  }, [refreshTrigger]);

  return (
    <FilterGrid
      columnDefs={columnDefs}
      data={rowData}
      loading={loading}
      error={error}
      onDragStarted={onDragStarted}
      onDragStopped={onDragStopped}
      onResetColumnOrder={handleResetColumnOrder}
    />
  );
}
