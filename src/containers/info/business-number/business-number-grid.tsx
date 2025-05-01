import DataGrid from "@/components/data-grid";
import type { ColDef, SelectionChangedEvent } from "ag-grid-community";
import { useMemo, useCallback, useState, useEffect } from "react";
import { useSetAtom, useAtomValue } from "jotai";
import {
  selectedBusinessNumbersAtom,
  businessNumberRefreshAtom,
} from "@/states/business-number";

import { InferSelectModel } from "drizzle-orm";
import { businessNumbers } from "@/db/schema";
import { getBusinessNumbers } from "@/actions/info/business-number-actions";

export type BusinessNumberRow = InferSelectModel<typeof businessNumbers>;

export default function BusinessNumberGrid() {
  const [businessNumbers, setBusinessNumbers] = useState<BusinessNumberRow[]>(
    [],
  );
  const refresh = useAtomValue(businessNumberRefreshAtom);

  useEffect(() => {
    const fetchBusinessNumbers = async () => {
      const businessNumbers = await getBusinessNumbers();
      setBusinessNumbers(businessNumbers);
    };
    fetchBusinessNumbers();
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
      },
      {
        headerName: "사업자번호",
        field: "businessNumber",
        minWidth: 180,
        flex: 1,
      },
      {
        headerName: "사업자명",
        field: "businessName",
        minWidth: 120,
        flex: 1,
      },
      {
        headerName: "사업자대표자",
        field: "businessRepresentative",
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

  const setSelectedRows = useSetAtom(selectedBusinessNumbersAtom);
  const onSelectionChanged = useCallback(
    (event: SelectionChangedEvent) => {
      const selectedRows = event.api.getSelectedRows();
      setSelectedRows(selectedRows);
    },
    [setSelectedRows],
  );

  return (
    <DataGrid<BusinessNumberRow>
      columnDefs={columnDefs}
      data={businessNumbers}
      onSelectionChanged={onSelectionChanged}
    />
  );
}
