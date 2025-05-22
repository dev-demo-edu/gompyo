"use client";

import { useEffect, useState } from "react";
import DataGrid from "@/components/data-grid";
import { Box, CircularProgress } from "@mui/material";
import { CellValueChangedEvent } from "ag-grid-community";
import { getStock } from "@/actions/detail-view/stock";
import type { Stock } from "@/actions/detail-view/stock";
import { cargoDetailAtom } from "@/states/detail";
import { useAtomValue } from "jotai";
import { CalculatedCargoDetailData } from "@/services/cargo-calculator";

interface StockProps {
  cargoId: string;
}

// // 행(가로): 각 재고/판매량
// const rowLabels = [
//   { id: "dnb", name: "디앤비 재고" },
//   { id: "namhae", name: "남해 재고" },
//   { id: "interliving", name: "인터리빙 재고" },
//   { id: "gompyo", name: "곰표 재고" },
//   { id: "rample", name: "램플 재고" },
//   { id: "sales", name: "판매량" },
// ];

// 열(세로): 통관/미통관
const columnDefs = [
  {
    field: "name",
    headerName: "",
    editable: false,
    flex: 1,
    minWidth: 120,
    pinned: "left" as const,
  },
  {
    field: "cleared",
    headerName: "통관재고",
    editable: true,
    type: "number",
    flex: 1,
    minWidth: 120,
    cellEditorPopup: false,
  },
  {
    field: "uncleared",
    headerName: "미통관재고",
    editable: true,
    type: "number",
    flex: 1,
    minWidth: 120,
    cellEditorPopup: false,
  },
];

interface StockRows {
  id: string;
  name: string;
  cleared: number;
  uncleared: number;
}

// 목업 데이터 (pivot 형태)
const initialRows: StockRows[] = [
  { id: "dnb", name: "디앤비 재고", cleared: 120, uncleared: 50 },
  { id: "namhae", name: "남해 재고", cleared: 80, uncleared: 20 },
  { id: "interliving", name: "인터리빙 재고", cleared: 45, uncleared: 10 },
  { id: "gompyo", name: "곰표 재고", cleared: 60, uncleared: 15 },
  { id: "rample", name: "램플 재고", cleared: 30, uncleared: 5 },
  { id: "sales", name: "판매량", cleared: 200, uncleared: 40 },
];

export default function Stock({ cargoId }: StockProps) {
  const [editedRows, setEditedRows] = useState(initialRows);
  const [loading, setLoading] = useState(false);
  const cargoData = useAtomValue(cargoDetailAtom);

  useEffect(() => {
    const fetchStock = async () => {
      try {
        setLoading(true);
        const stockValue = await getStock(cargoId);
        const rows = stockValue ? stockConvertToRows(stockValue) : [];
        rows.push(getSalesRow(cargoData, rows));
        setEditedRows(rows);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching stock:", error);
        setLoading(false);
      }
    };
    fetchStock();
  }, []);

  // ag-grid의 onCellValueChanged 핸들러
  const handleCellValueChanged = (params: CellValueChangedEvent) => {
    const { id } = params.data;
    const field = params.colDef.field;
    let value = params.newValue;
    // 숫자 validation (name 필드는 제외)
    if (field === "name") return;
    if (value === "" || value === null) value = 0;
    if (isNaN(Number(value))) {
      params.node.setDataValue(field as string, params.oldValue);
      return;
    }
    setEditedRows((prev) =>
      prev.map((row) =>
        row.id === id ? { ...row, [field as string]: Number(value) } : row,
      ),
    );
  };

  return loading ? (
    <Box className="w-full h-full flex items-center justify-center">
      <CircularProgress />
    </Box>
  ) : (
    <Box>
      <Box
        sx={{
          width: "50%",
          height: `${56 + 56 * editedRows.length}px`,
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "flex-start",
        }}
      >
        <DataGrid
          columnDefs={columnDefs}
          data={editedRows}
          loading={false}
          error={null}
          pagination={false}
          onCellValueChanged={handleCellValueChanged}
        />
      </Box>
    </Box>
  );
}

function stockConvertToRows(stock: Stock) {
  return [
    {
      id: "dnb",
      name: "디앤비 재고",
      cleared: stock.dnbCleared ?? 0,
      uncleared: stock.dnbUncleared ?? 0,
    },
    {
      id: "namhae",
      name: "남해 재고",
      cleared: stock.namhaeCleared ?? 0,
      uncleared: stock.namhaeUncleared ?? 0,
    },
    {
      id: "interliving",
      name: "인터리빙 재고",
      cleared: stock.interlivingCleared ?? 0,
      uncleared: stock.interlivingUncleared ?? 0,
    },
    {
      id: "gompyo",
      name: "곰표 재고",
      cleared: stock.gompyoCleared ?? 0,
      uncleared: stock.gompyoUncleared ?? 0,
    },
    {
      id: "rample",
      name: "램플 재고",
      cleared: stock.ramplusCleared ?? 0,
      uncleared: stock.ramplusUncleared ?? 0,
    },
  ];
}

function getSales(
  cargoData: CalculatedCargoDetailData | null,
  stockRows: StockRows[],
) {
  if (!cargoData) return 0;
  // 전체 재고 합계 구하기 (cleared + uncleared)
  const totalStock = stockRows.reduce(
    (sum, row) => sum + (row.cleared ?? 0) + (row.uncleared ?? 0),
    0,
  );
  // 판매량 계산: 계약톤 - 전체 재고
  const sales = (cargoData.cargo.contractTon ?? 0) - totalStock;
  return sales;
}

function getSalesRow(
  cargoData: CalculatedCargoDetailData | null,
  stockRows: StockRows[],
): StockRows {
  const sales = getSales(cargoData, stockRows);
  return {
    id: "sales",
    name: "판매량",
    cleared: sales,
    uncleared: 0,
  };
}
