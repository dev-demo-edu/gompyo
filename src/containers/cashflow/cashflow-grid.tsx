import DataGrid from "@/components/data-grid";
import type { ColDef, SelectionChangedEvent } from "ag-grid-community";
import { useEffect, useMemo } from "react";

import { InferSelectModel } from "drizzle-orm";
import { accountNumbers } from "@/db/schema";
import { useAtomValue, useSetAtom } from "jotai";
import {
  CashflowItem,
  cashflowListAtom,
  cashflowRefreshAtom,
  companyListAtom,
  selectedCompanyFlowsAtom,
  selectedCompanyIdAtom,
  selectedExpenseRowsAtom,
  selectedIncomeRowsAtom,
} from "@/states/cashflow-state";
import Typography from "@mui/material/Typography";
import { getCashflowList } from "@/actions/cashflow";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
// import TextField from "@mui/material/TextField";
// import { Button } from "@mui/material";

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
  const selectedCompanyId = useAtomValue(selectedCompanyIdAtom);
  const selectedCompanyFlows = useAtomValue(selectedCompanyFlowsAtom);
  const refresh = useAtomValue(cashflowRefreshAtom);
  const setSelectedCompanyId = useSetAtom(selectedCompanyIdAtom);
  const setCashflowList = useSetAtom(cashflowListAtom);
  const companyList = useAtomValue(companyListAtom);
  const setSelectedExpenseRows = useSetAtom(selectedExpenseRowsAtom);
  const setSelectedIncomeRows = useSetAtom(selectedIncomeRowsAtom);

  useEffect(() => {
    const fetchCashflowList = async () => {
      const cashflows = await getCashflowList();
      setCashflowList(cashflows);
    };
    fetchCashflowList();
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
        headerName: "날짜",
        field: "date",
        minWidth: 150,
        flex: 1,
        filter: false,
        sortable: false,
        suppressMenu: true,
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
      },
      {
        headerName: "합계",
        field: "total",
        minWidth: 120,
        flex: 1,
        filter: false,
        sortable: false,
        suppressMenu: true,
      },
      {
        headerName: "우선순위",
        field: "priority",
        minWidth: 120,
        flex: 1,
        filter: false,
        sortable: false,
        suppressMenu: true,
      },
    ],
    [],
  );
  const expenseData = useMemo(() => {
    return mapCashflowWithTotal(
      selectedCompanyFlows.filter((flow) => flow.type === "expense"),
      0,
    );
  }, [selectedCompanyFlows]);

  const incomeData = useMemo(() => {
    return mapCashflowWithTotal(
      selectedCompanyFlows.filter((flow) => flow.type === "income"),
      companyList.find((company) => company.id === selectedCompanyId)
        ?.companyBalance ?? 0,
    );
  }, [selectedCompanyFlows]);

  const handleExpenseSelection = (event: SelectionChangedEvent) => {
    setSelectedExpenseRows(event.api.getSelectedRows());
  };
  const handleIncomeSelection = (event: SelectionChangedEvent) => {
    setSelectedIncomeRows(event.api.getSelectedRows());
  };

  return (
    <div className="h-[75vh] flex flex-col overflow-hidden ">
      {/* 상단 Tabs 영역: 고정 높이 */}
      <div
        className="flex flex-row justify-between items-end flex-shrink-0"
        style={{ minHeight: 48 }}
      >
        <Tabs
          value={selectedCompanyId}
          onChange={(_, value) => setSelectedCompanyId(value)}
          scrollButtons="auto"
          className="mb-4"
        >
          {companyList.map((company) => (
            <Tab key={company.id} label={company.name} value={company.id} />
          ))}
        </Tabs>
        <div className="flex flex-row">
          {/* <TextField
            label="회사 잔액"
            variant="standard"
            size="small"
            type="number"
            sx={{
              mr: 2,
              pb: 1,
              "& .MuiOutlinedInput-root": {
                borderRadius: "8px",
              },
            }}
          /> */}
          <Typography
            className="text-right font-extralight text-gray-500 align-bottom pb-2 mb-0"
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
      {/* DataGrid 영역: 남은 영역 모두 차지 */}
      <div className="flex flex-col md:flex-row w-full flex-1 gap-x-6 h-0">
        <div className="w-full h-full">
          <div className="scale-[0.8] origin-top-left w-[125%] h-[125%]">
            <DataGrid<CashflowItem>
              columnDefs={columnDefs}
              data={expenseData}
              onSelectionChanged={handleExpenseSelection}
            />
          </div>
        </div>
        <div className="w-full h-full">
          <div className="scale-[0.8] origin-top-left w-[125%] h-[125%]">
            <DataGrid<CashflowItem>
              columnDefs={columnDefs}
              data={incomeData}
              onSelectionChanged={handleIncomeSelection}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
