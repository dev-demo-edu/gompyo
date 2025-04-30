import DataGrid from "@/components/data-grid";
import type { ColDef, SelectionChangedEvent } from "ag-grid-community";
import { useMemo, useCallback } from "react";
import { useSetAtom } from "jotai";
import { selectedAccountNumbersAtom } from "@/states/account-number";

import { InferSelectModel } from "drizzle-orm";
import { accountNumber } from "@/db/schema";

export type AccountNumberRow = InferSelectModel<typeof accountNumber>;

// 임시 데이터
const mockData: AccountNumberRow[] = [
  {
    id: "1",
    accountNumber: "123-456-789012",
    bankName: "국민은행",
    owner: "홍길동",
    createdAt: "2024-06-01",
  },
  {
    id: "2",
    accountNumber: "987-654-321098",
    bankName: "신한은행",
    owner: "김철수",
    createdAt: "2024-05-20",
  },
  {
    id: "3",
    accountNumber: "111-222-333444",
    bankName: "우리은행",
    owner: "이영희",
    createdAt: "2024-04-15",
  },
];

export default function AccountNumberGrid() {
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
        headerName: "계좌번호",
        field: "accountNumber",
        minWidth: 180,
        flex: 1,
      },
      {
        headerName: "은행명",
        field: "bankName",
        minWidth: 120,
        flex: 1,
      },
      {
        headerName: "예금주",
        field: "owner",
        minWidth: 120,
        flex: 1,
      },
      {
        headerName: "등록일",
        field: "createdAt",
        minWidth: 120,
        flex: 1,
      },
    ],
    [],
  );

  const setSelectedRows = useSetAtom(selectedAccountNumbersAtom);
  const onSelectionChanged = useCallback(
    (event: SelectionChangedEvent) => {
      const selectedRows = event.api.getSelectedRows();
      setSelectedRows(selectedRows);
    },
    [setSelectedRows],
  );

  return (
    <DataGrid<AccountNumberRow>
      columnDefs={columnDefs}
      data={mockData}
      onSelectionChanged={onSelectionChanged}
    />
  );
}
