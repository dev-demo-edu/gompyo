"use client";

import { useState } from "react";
import DataGrid from "@/components/data-grid";
import { Box } from "@mui/material";
import { CellValueChangedEvent } from "ag-grid-community";

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

// 목업 데이터 (pivot 형태)
const initialRows = [
  { id: "dnb", name: "디앤비 재고", cleared: 120, uncleared: 50 },
  { id: "namhae", name: "남해 재고", cleared: 80, uncleared: 20 },
  { id: "interliving", name: "인터리빙 재고", cleared: 45, uncleared: 10 },
  { id: "gompyo", name: "곰표 재고", cleared: 60, uncleared: 15 },
  { id: "rample", name: "램플 재고", cleared: 30, uncleared: 5 },
  { id: "sales", name: "판매량", cleared: 200, uncleared: 40 },
];

export default function Stock({ cargoId }: StockProps) {
  //   const [rows, setRows] = useState(initialRows);
  console.log("cargoId", cargoId);
  const [editedRows, setEditedRows] = useState(initialRows);

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

  return (
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
