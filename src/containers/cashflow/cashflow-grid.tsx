import DataGrid from "@/components/data-grid";
// import type { ColDef, SelectionChangedEvent } from "ag-grid-community";
import type { ColDef } from "ag-grid-community";
// import { useMemo, useCallback, useState, useEffect } from "react";
import { useMemo } from "react";
// import { useSetAtom, useAtomValue } from "jotai";
// import {
//   selectedAccountNumbersAtom,
//   accountNumberRefreshAtom,
// } from "@/states/account-number";

import { InferSelectModel } from "drizzle-orm";
import { accountNumbers } from "@/db/schema";
// import { getAccountNumbers } from "@/actions/info/account-number-actions";
import Grid from "@mui/material/Grid";

// 현금 흐름 목 데이터 타입 정의
export interface CashflowItem {
  id: string;
  date: string;
  company: string;
  amount: number;
  type: "income" | "expense"; // 수입 또는 지출
  createdAt: string;
  updatedAt: string;
}

// 목 데이터 생성 함수
export const getMockCashflowData = (): CashflowItem[] => {
  return [
    {
      id: "1",
      date: "2023-05-01",
      company: "(주)한국무역",
      amount: 5000000,
      type: "income",
      createdAt: "2023-05-01T09:00:00Z",
      updatedAt: "2023-05-01T09:00:00Z",
    },
    {
      id: "2",
      date: "2023-05-10",
      company: "해운물류(주)",
      amount: -1500000,
      type: "expense",
      createdAt: "2023-05-10T14:30:00Z",
      updatedAt: "2023-05-10T14:30:00Z",
    },
    {
      id: "3",
      date: "2023-05-15",
      company: "세관",
      amount: -800000,
      type: "expense",
      createdAt: "2023-05-15T11:20:00Z",
      updatedAt: "2023-05-15T11:20:00Z",
    },
    {
      id: "4",
      date: "2023-05-25",
      company: "(주)대한유통",
      amount: 8000000,
      type: "income",
      createdAt: "2023-05-25T16:45:00Z",
      updatedAt: "2023-05-25T16:45:00Z",
    },
  ];
};

export type AccountNumberRow = InferSelectModel<typeof accountNumbers>;

export default function CashflowGrid() {
  const cashflowsData = getMockCashflowData();
  // const refresh = useAtomValue(accountNumberRefreshAtom);

  // useEffect(() => {
  //   const fetchAccountNumbers = async () => {
  //     const accountNumbers = await getAccountNumbers();
  //     setAccountNumbers(accountNumbers);
  //   };
  //   fetchAccountNumbers();
  // }, [refresh]);

  // 컬럼 정의
  const columnDefs = useMemo<ColDef[]>(
    () => [
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
      },
      {
        headerName: "날짜",
        field: "date",
        minWidth: 180,
        flex: 1,
      },
      {
        headerName: "업체",
        field: "company",
        minWidth: 120,
        flex: 1,
      },
      {
        headerName: "금액",
        field: "amount",
        minWidth: 120,
        flex: 1,
      },
      {
        headerName: "합계",
        field: "total",
        minWidth: 120,
        flex: 1,
      },
      {
        headerName: "우선순위",
        field: "priority",
        minWidth: 120,
        flex: 1,
      },
    ],
    [],
  );

  // const setSelectedRows = useSetAtom(selectedAccountNumbersAtom);
  // const onSelectionChanged = useCallback(
  //   (event: SelectionChangedEvent) => {
  //     const selectedRows = event.api.getSelectedRows();
  //     setSelectedRows(selectedRows);
  //   },
  //   [setSelectedRows],
  // );

  return (
    <div className="flex flex-col md:flex-row w-full h-[800px] bg-slate-50 rounded-xl overflow-hidden shadow-lg p-6 gap-6">
      <Grid container spacing={2} className="w-full h-[800px]">
        <Grid item xs={12} md={6} className="h-full">
          <div className="scale-[0.8] origin-top-left w-[125%] h-[125%]">
            <DataGrid<CashflowItem>
              columnDefs={columnDefs}
              data={cashflowsData}
              // onSelectionChanged={onSelectionChanged}
            />
          </div>
        </Grid>
        <Grid item xs={12} md={6} className="h-full">
          <div className="scale-[0.8] origin-top-left w-[125%] h-[125%]">
            <DataGrid<CashflowItem>
              columnDefs={columnDefs}
              data={cashflowsData}
              // onSelectionChanged={onSelectionChanged}
            />
          </div>
        </Grid>
      </Grid>
    </div>
  );
}
