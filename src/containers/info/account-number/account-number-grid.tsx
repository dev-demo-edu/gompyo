import type { ColDef, SelectionChangedEvent } from "ag-grid-community";
import { useMemo, useCallback, useState, useEffect } from "react";
import { useSetAtom, useAtomValue } from "jotai";
import {
  selectedAccountNumbersAtom,
  accountNumberRefreshAtom,
} from "@/states/account-number";
import { dateFormatter } from "@/utils/formatter";

import { InferSelectModel } from "drizzle-orm";
import { accountNumbers } from "@/db/schema";
import { getAccountNumbers } from "@/actions/info/account-number-actions";
import FilterGrid from "@/components/filter-grid";

export type AccountNumberRow = InferSelectModel<typeof accountNumbers>;

export default function AccountNumberGrid() {
  const [accountNumbers, setAccountNumbers] = useState<AccountNumberRow[]>([]);
  const refresh = useAtomValue(accountNumberRefreshAtom);

  useEffect(() => {
    const fetchAccountNumbers = async () => {
      const accountNumbers = await getAccountNumbers();
      setAccountNumbers(accountNumbers);
    };
    fetchAccountNumbers();
  }, [refresh]);

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
        field: "checkbox",
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
        valueFormatter: dateFormatter,
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
    <FilterGrid<AccountNumberRow>
      columnDefs={columnDefs}
      data={accountNumbers}
      onSelectionChanged={onSelectionChanged}
      searchDateField="createdAt"
    />
  );
}
