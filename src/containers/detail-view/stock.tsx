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
import { useToast } from "@/hooks/use-toast";

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

export default function Stock({ cargoId }: StockProps) {
  const [editedRows, setEditedRows] = useState<StockRows[]>([]);
  const [loading, setLoading] = useState(false);
  const cargoData = useAtomValue(cargoDetailAtom);
  const { toast, ToastComponent } = useToast();

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
  const handleCellValueChanged = async (params: CellValueChangedEvent) => {
    const { id } = params.data;
    const field = params.colDef.field;
    let value = params.newValue;

    if (field === "name") return;
    if (value === "" || value === null) value = 0;
    if (isNaN(Number(value))) {
      params.node.setDataValue(field as string, params.oldValue);
      return;
    }

    // 현재 행의 cleared/uncleared 값을 가져옴
    const prevRow = editedRows.find((row) => row.id === id);
    if (!prevRow) return;

    // 새 값 적용 (field를 string으로 명시)
    const newRow = { ...prevRow, [field as string]: Number(value) };

    // optimistic update
    setEditedRows((prev) => {
      // 판매량 행 제외한 나머지 행만 추출
      const rowsWithoutSales = prev
        .map((row) => (row.id === id ? newRow : row))
        .filter((row) => row.id !== "sales");
      // 판매량 행 새로 계산해서 추가
      return [...rowsWithoutSales, getSalesRow(cargoData, rowsWithoutSales)];
    });

    try {
      // 서버에 업데이트
      await import("@/actions/detail-view/stock").then(({ updateStock }) =>
        updateStock(
          cargoId,
          id, // 회사명
          newRow.cleared,
          newRow.uncleared,
        ),
      );
      // 성공 시 추가 동작 필요시 작성
      toast({
        title: "성공",
        description: "상태가 성공적으로 변경되었습니다.",
      });
    } catch (error) {
      // 실패 시 롤백
      setEditedRows((prev) => {
        const rowsWithoutSales = prev
          .map((row) => (row.id === id ? prevRow : row))
          .filter((row) => row.id !== "sales");
        return [...rowsWithoutSales, getSalesRow(cargoData, rowsWithoutSales)];
      });
      params.node.setDataValue(field as string, params.oldValue);
      console.error("상태 업데이트 중 오류 발생:", error);
      toast({
        title: "오류",
        description: "상태 변경 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    }
  };

  return loading ? (
    <Box className="w-full h-full flex items-center justify-center">
      <CircularProgress />
    </Box>
  ) : (
    <Box>
      <Box
        sx={{
          width: "100%",
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
      <ToastComponent />
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
