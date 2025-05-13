import DataGrid from "@/components/data-grid";
import type {
  ColDef,
  DragStoppedEvent,
  RowDragEndEvent,
  SelectionChangedEvent,
  ICellRendererParams,
  GridApi,
} from "ag-grid-community";
import { useEffect, useMemo, useRef } from "react";

import { InferSelectModel } from "drizzle-orm";
import { accountNumbers } from "@/db/schema";
import { useAtomValue, useSetAtom } from "jotai";
import {
  CashflowItem,
  cashflowListAtom,
  cashflowRefreshAtom,
  companyBalanceAtom,
  selectedCompanyFlowsAtom,
  selectedExpenseRowsAtom,
  selectedIncomeRowsAtom,
  editModeAtom,
} from "@/states/cashflow-state";
import Typography from "@mui/material/Typography";
import { getCashflowList, updateCashflowPriorities } from "@/actions/cashflow";
import { weekDayFormatter, oneDecimalFormatter } from "@/utils/formatter";

export function mapCashflowWithTotal<T extends CashflowItem>(
  items: T[],
  defaultAmount: number,
): (T & { total: number; company: string })[] {
  let sum = defaultAmount;
  return items.map((item) => {
    sum += item.amount;
    return {
      ...item,
      company: item.counterparty,
      total: sum,
    };
  });
}

export type AccountNumberRow = InferSelectModel<typeof accountNumbers>;

export default function CashflowGrid() {
  const selectedCompanyFlows = useAtomValue(selectedCompanyFlowsAtom);
  const refresh = useAtomValue(cashflowRefreshAtom);
  const setCashflowList = useSetAtom(cashflowListAtom);
  const setSelectedExpenseRows = useSetAtom(selectedExpenseRowsAtom);
  const setSelectedIncomeRows = useSetAtom(selectedIncomeRowsAtom);
  const companyBalance = useAtomValue(companyBalanceAtom);
  const editMode = useAtomValue(editModeAtom);
  const gridApiRef = useRef<GridApi | null>(null);

  const handleRowDragEnd = async (event: RowDragEndEvent) => {
    const type = event.node.data.type;
    const date = event.node.data.date;

    // 같은 날짜 + 같은 타입인 행들만 추출
    const reordered: CashflowItem[] = [];

    event.api.forEachNodeAfterFilterAndSort((node) => {
      const row = node.data;
      if (row.type === type && row.date === date) {
        reordered.push(row);
      }
    });

    // 순서대로 priority 재설정
    const updated = reordered.map((row, idx) => ({
      ...row,
      priority: reordered.length > 1 ? idx + 1 : null,
    }));

    // 원래 데이터에서 이 그룹 제외한 후 재결합
    const others = selectedCompanyFlows.filter(
      (row) => !(row.date === date && row.type === type),
    );
    const updatedAll = [...others, ...updated].sort((a, b) => {
      if (a.id === "balance-row") return -1;
      if (b.id === "balance-row") return 1;
      return a.date.localeCompare(b.date);
    });

    // 상태 업데이트
    setCashflowList(updatedAll);
    await updateCashflowPriorities(updated);
  };

  const handleDragStopped = async (event: DragStoppedEvent) => {
    const updatedPart: CashflowItem[] = [];

    // 현재 화면에 있는 행만 수집
    event.api.forEachNodeAfterFilterAndSort((node) => {
      updatedPart.push(node.data);
    });

    // 그룹별 priority 재계산
    const grouped: Record<string, CashflowItem[]> = {};
    updatedPart.forEach((row) => {
      const key = `${row.date}-${row.type}`;
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(row);
    });

    const rePrioritized: CashflowItem[] = [];
    Object.values(grouped).forEach((group) => {
      const updated = group.map((row, idx) => ({
        ...row,
        priority: group.length > 1 ? idx + 1 : null,
      }));
      rePrioritized.push(...updated);
    });

    // ✅ 원본 리스트에서 현재 화면에 보이지 않는 다른 타입/행은 그대로 유지
    const updatedAll = selectedCompanyFlows
      .filter((row) => !rePrioritized.some((u) => u.id === row.id))
      .concat(rePrioritized)
      .sort((a, b) => {
        if (a.id === "balance-row") return -1;
        if (b.id === "balance-row") return 1;
        return a.date.localeCompare(b.date);
      });

    setCashflowList(updatedAll);
    await updateCashflowPriorities(rePrioritized);
  };

  useEffect(() => {
    const fetchCashflowList = async () => {
      const cashflows = await getCashflowList();
      setCashflowList(cashflows);
      gridApiRef.current?.redrawRows();
    };
    fetchCashflowList();
  }, [refresh]);

  // 컬럼 정의
  const columnDefs = useMemo<ColDef[]>(
    () => [
      {
        headerName: "",
        field: "dragHandle",
        width: 70,
        minWidth: 70,
        pinned: "left",
        lockPinned: true,
        suppressMenu: true,
        suppressMovable: true,
        filter: false,
        sortable: false,
        rowDrag: (params) => {
          return params.data.id !== "balance-row";
        },
        cellRenderer: () => "",
        hide: !editMode,
      },
      {
        headerName: "",
        checkboxSelection: (params) => {
          return params.data.id !== "balance-row";
        },
        field: "checkbox",
        minWidth: 50,
        flex: 1,
        headerCheckboxSelection: true,
        filter: false,
        pinned: "left",
        lockPinned: true,
        width: 70,
        hide: editMode,
      },
      {
        headerName: "날짜",
        field: "date",
        minWidth: 150,
        flex: 1,
        filter: false,
        sortable: false,
        suppressMenu: true,
        valueFormatter: weekDayFormatter,
      },
      {
        headerName: "업체",
        field: "company",
        minWidth: 120,
        flex: 1,
        filter: false,
        sortable: false,
        suppressMenu: true,
      },
      {
        headerName: "금액",
        field: "amount",
        minWidth: 120,
        flex: 1,
        filter: false,
        sortable: false,
        suppressMenu: true,
        valueFormatter: oneDecimalFormatter,
      },
      {
        headerName: "합계",
        field: "total",
        minWidth: 120,
        flex: 1,
        filter: false,
        sortable: false,
        suppressMenu: true,
        valueFormatter: oneDecimalFormatter,
      },
      {
        headerName: "우선순위",
        field: "priority",
        minWidth: 120,
        flex: 1,
        filter: false,
        sortable: false,
        suppressMenu: true,
        cellRenderer: (params: ICellRendererParams) => {
          const { date, type } = params.data as CashflowItem;
          // DataGrid의 실제 rowData만 사용
          const allRows: CashflowItem[] = [];
          params.api.forEachNode((node) => {
            if (node.data && node.data.id !== "balance-row") {
              allRows.push(node.data as CashflowItem);
            }
          });
          const sameDateRows = allRows.filter(
            (row) => row.date === date && row.type === type,
          );
          return sameDateRows.length > 1 ? params.value : "";
        },
      },
    ],
    [editMode],
  );
  const expenseData = useMemo(() => {
    return mapCashflowWithTotal(
      selectedCompanyFlows.filter((flow) => flow.type === "expense"),
      0,
    );
  }, [selectedCompanyFlows]);

  const balanceRow: CashflowItem = {
    id: "balance-row", // string 타입이면 string, number면 0 등으로
    date: "",
    companyId: "balance-row",
    amount: companyBalance,
    priority: null,
    type: "income", // 혹은 "balance" 등 구분용
    counterparty: "잔액",
    createdAt: "",
    updatedAt: "",
  };

  const incomeData = useMemo(() => {
    const balanceAdded = [balanceRow, ...selectedCompanyFlows];
    return mapCashflowWithTotal(
      balanceAdded.filter((flow) => flow.type === "income"),
      0,
    );
  }, [selectedCompanyFlows, companyBalance]);

  const handleExpenseSelection = (event: SelectionChangedEvent) => {
    // balance-row는 선택 목록에서 제외
    const selected = event.api
      .getSelectedRows()
      .filter((row) => row.id !== "balance-row");
    setSelectedExpenseRows(selected);
  };
  const handleIncomeSelection = (event: SelectionChangedEvent) => {
    // balance-row는 선택 목록에서 제외
    const selected = event.api
      .getSelectedRows()
      .filter((row) => row.id !== "balance-row");
    setSelectedIncomeRows(selected);
  };

  return (
    <div className="h-[90vh] flex flex-col overflow-hidden ">
      <div className="flex flex-col md:flex-row w-full flex-1 gap-x-6 h-full">
        <div className="w-full h-full flex flex-col overflow-hidden">
          <div className="flex flex-row justify-between h-[44px]">
            <Typography className="p-2" variant="h6">
              지출
            </Typography>
          </div>
          <div style={{ height: "100%", width: "100%" }}>
            <DataGrid<CashflowItem>
              columnDefs={columnDefs}
              data={expenseData}
              onSelectionChanged={handleExpenseSelection}
              onRowDragEnd={handleRowDragEnd}
              onDragStopped={handleDragStopped}
              pagination={false}
            />
          </div>
        </div>
        <div className="w-full h-full flex flex-col">
          <div className="flex flex-row justify-between h-[44px]">
            <Typography className="p-2" variant="h6">
              수금
            </Typography>
            <div className="flex flex-row justify-between">
              <Typography
                className="text-right font-extralight text-gray-500 pb-2 "
                sx={{
                  fontSize: "12px",
                  verticalAlign: "bottom",
                  display: "flex",
                  alignItems: "flex-end",
                }}
              >
                * 금액 단위: 100만원
              </Typography>
            </div>
          </div>
          <div style={{ height: "100%", width: "100%" }}>
            <DataGrid<CashflowItem>
              columnDefs={columnDefs}
              data={incomeData}
              onSelectionChanged={handleIncomeSelection}
              onRowDragEnd={handleRowDragEnd}
              onDragStopped={handleDragStopped}
              pagination={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
