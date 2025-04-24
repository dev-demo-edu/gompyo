"use client";

import React, { useEffect, useState, useMemo, useCallback } from "react";
import type { ColDef, DragStoppedEvent } from "ag-grid-community";
import { IPlanData } from "@/types/grid-col";
import DataGrid, { DetailButtonRenderer } from "./data-grid";
import { getPlanData } from "@/actions/plan";
import {
  dateFormatter,
  currencyFormatter,
  perKgFormatter,
} from "../utils/formatter";
import { getUserColumnOrder, saveUserColumnOrder } from "@/actions/user";
import useDragColumnChange from "@/hooks/useDragColumnChange";
import { useAtomValue } from "jotai";
import { refreshPlanAtom } from "@/states/document-state";

// 컬럼 드래그 커스텀 훅

export default function PlanGrid() {
  const [rowData, setRowData] = useState<IPlanData[]>([]);
  const [columnOrder, setColumnOrder] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const baseColumnDefs = useMemo<Record<string, ColDef>>(
    () => ({
      contractNumber: {
        field: "contractNumber",
        headerName: "계약 번호",
        width: 130,
      },
      progressStatus: {
        field: "progressStatus",
        headerName: "진행 상태",
        width: 100,
      },
      contractDate: {
        field: "contractDate",
        headerName: "계약일자",
        valueFormatter: dateFormatter,
        width: 150,
      },
      importer: {
        field: "importer",
        headerName: "수입회사",
        width: 120,
      },
      exporter: {
        field: "exporter",
        headerName: "공급업체",
        width: 120,
      },
      estimatedTimeArrival: {
        field: "estimatedTimeArrival",
        headerName: "ETA",
        valueFormatter: dateFormatter,
        width: 150,
      },
      arrivalPort: {
        field: "arrivalPort",
        headerName: "도착항",
        width: 120,
      },
      itemName: {
        field: "itemName",
        headerName: "품목",
        width: 150,
      },
      contractTon: {
        field: "contractTon",
        headerName: "무게",
        valueFormatter: (params) => `${params.value}톤`,
        width: 100,
      },
      unitPrice: {
        field: "unitPrice",
        headerName: "단가",
        valueFormatter: currencyFormatter,
        width: 130,
      },
      totalPrice: {
        field: "totalPrice",
        headerName: "단가 * 무게",
        valueFormatter: currencyFormatter,
        width: 150,
      },
      paymentMethod: {
        field: "paymentMethod",
        headerName: "결제방식",
        width: 100,
      },
      warehouseEntryDate: {
        field: "warehouseEntryDate",
        headerName: "입고일",
        valueFormatter: dateFormatter,
        width: 150,
      },
      importCostPerKg: {
        field: "importCostPerKg",
        headerName: "수입가/kg",
        valueFormatter: perKgFormatter,
        width: 130,
      },
      supplyCostPerKg: {
        field: "supplyCostPerKg",
        headerName: "수급가/kg",
        valueFormatter: perKgFormatter,
        width: 130,
      },
      totalCost: {
        field: "totalCost",
        headerName: "총 비용",
        valueFormatter: currencyFormatter,
        width: 150,
      },
      totalCostPerKg: {
        field: "totalCostPerKg",
        headerName: "총 비용/kg",
        valueFormatter: perKgFormatter,
        width: 130,
      },
      sellingPrice: {
        field: "sellingPrice",
        headerName: "판매가",
        valueFormatter: currencyFormatter,
        width: 130,
      },
      margin: {
        field: "margin",
        headerName: "마진",
        valueFormatter: currencyFormatter,
        width: 100,
      },
      totalProfit: {
        field: "totalProfit",
        headerName: "총 이익",
        valueFormatter: currencyFormatter,
        width: 150,
      },
      detail: {
        headerName: "상세",
        field: "detail",
        cellRenderer: DetailButtonRenderer,
        sortable: false,
        filter: false,
        width: 100,
        pinned: "right",
        lockPinned: false,
      },
    }),
    [],
  );

  // 컬럼 순서에 따라 정렬된 컬럼 정의
  const columnDefs = useMemo<ColDef[]>(() => {
    const orderedColumns = columnOrder.map((field) => baseColumnDefs[field]);

    return [...orderedColumns, baseColumnDefs.detail];
  }, [baseColumnDefs, columnOrder]);

  // 컬럼 드래그 저장 핸들러
  const handleColumnDragSave = useCallback(async (e: DragStoppedEvent) => {
    const newColumnOrder = e.api
      .getColumnState()
      .map((c) => c.colId as string)
      .filter((colId) => colId !== "detail");

    try {
      const result = await saveUserColumnOrder(newColumnOrder);
      console.log("Column order save result:", result);

      if (result.success) {
        setColumnOrder(newColumnOrder);
      }
    } catch (error) {
      console.error("컬럼 순서 저장 중 오류:", error);
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
        const userColumnOrder = await getUserColumnOrder();
        setRowData(data);
        setColumnOrder(userColumnOrder || []);
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
    <DataGrid
      columnDefs={columnDefs}
      data={rowData}
      loading={loading}
      error={error}
      onDragStarted={onDragStarted}
      onDragStopped={onDragStopped}
    />
  );
}
