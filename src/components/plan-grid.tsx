"use client";

import React, { useEffect, useState, useMemo, useCallback } from "react";
import type {
  ColDef,
  DragStoppedEvent,
  SelectionChangedEvent,
} from "ag-grid-community";
import { IPlanData } from "@/types/grid-col";
import { getPlanData } from "@/actions/plan";
import {
  getUserPlanColumnOrder,
  saveUserPlanColumnOrder,
} from "@/actions/user";
import useDragColumnChange from "@/hooks/useDragColumnChange";
import { useAtomValue, useAtom } from "jotai";
import { cargoRefreshAtom, selectedPlanRowsAtom } from "@/states/plan";
import {
  DEFAULT_PLAN_COLUMN,
  defaultPlanColumnOrderFields,
} from "@/constants/column";
import FilterGrid from "./filter-grid";
import { DetailButtonRenderer } from "./cell-renderers";
import { ColumnOrder } from "@/actions/user";
import { useMediaQuery } from "@mui/material";
import CommonCard from "./card";

export default function PlanGrid() {
  const [rowData, setRowData] = useState<IPlanData[]>([]);
  const [columnOrder, setColumnOrder] = useState<ColumnOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isMobile = useMediaQuery("(max-width: 767px)");

  // 선택된 행 관리
  const [selectedRows, setSelectedRows] = useAtom(selectedPlanRowsAtom);

  // 컬럼 정의
  const columnDefs = useMemo<ColDef[]>(() => {
    const orderedColumns =
      columnOrder.length > 0
        ? columnOrder
            .map(({ field, width }) => {
              const col = DEFAULT_PLAN_COLUMN.find((c) => c.field === field);
              if (!col) {
                console.warn(
                  `Column ${field} not found in DEFAULT_PLAN_COLUMN`,
                );
                return null;
              }
              col.width = width;
              return col;
            })
            .filter((col): col is ColDef => col !== null)
        : DEFAULT_PLAN_COLUMN;

    return [
      {
        headerName: "",
        checkboxSelection: true,
        minWidth: 50,
        flex: 1,
        headerCheckboxSelection: true,
        filter: false,
        pinned: "left",
        lockPinned: true,
        width: 70,
        field: "checkbox",
      },
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
      .filter((c) => c.colId !== "detail")
      .map((c) => ({
        field: c.colId as string,
        width: c.width,
      })) as ColumnOrder[];

    try {
      const result = await saveUserPlanColumnOrder(newColumnOrder);

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
  const refreshTrigger = useAtomValue(cargoRefreshAtom);
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getPlanData();
        console.log("data", data);
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

  // 데스크톱 그리드 선택 변경 핸들러
  const onSelectionChanged = useCallback(
    (event: SelectionChangedEvent) => {
      const selectedRows = event.api.getSelectedRows();
      setSelectedRows(selectedRows);
    },
    [setSelectedRows],
  );

  // 모바일 카드 선택 핸들러
  const handleMobileCardSelect = useCallback(
    (rowData: IPlanData) => {
      setSelectedRows((prev) => {
        const isSelected = prev.some((item) => item.id === rowData.id);
        if (isSelected) {
          // 선택 해제
          return prev.filter((item) => item.id !== rowData.id);
        } else {
          // 선택 추가 - IPlanData를 CargoRow 타입으로 캐스팅
          return [...prev, rowData as IPlanData];
        }
      });
    },
    [setSelectedRows],
  );

  // 모바일에서 카드가 선택되었는지 확인
  const isCardSelected = useCallback(
    (cardId: string) => {
      return selectedRows.some((item) => item.id === cardId);
    },
    [selectedRows],
  );

  return isMobile ? (
    <div className="flex flex-col gap-1">
      {rowData.map((row) => (
        <CommonCard
          key={row.id}
          id={row.id}
          title={`계약번호: ${row.contractNumber}`}
          fields={[
            { label: "수입회사", value: row.importer },
            { label: "계약일자", value: row.contractDate },
            { label: "품목명", value: row.itemName },
          ]}
          isSelected={isCardSelected(row.id)}
          onSelect={handleMobileCardSelect}
          rowData={row}
          detailHref={`/detail/${row.id}`}
        />
      ))}
    </div>
  ) : (
    <FilterGrid
      columnDefs={columnDefs}
      data={rowData}
      loading={loading}
      error={error}
      onDragStarted={onDragStarted}
      onDragStopped={onDragStopped}
      onResetColumnOrder={handleResetColumnOrder}
      searchDateField="contractDate"
      onSelectionChanged={onSelectionChanged}
    />
  );
}
