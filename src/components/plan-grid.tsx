"use client";

import { useEffect, useState, useMemo } from "react";
import type { ColDef } from "ag-grid-community";
import { IPlanData } from "@/types/grid-col";
import DataGrid, {
  dateFormatter,
  currencyFormatter,
  perKgFormatter,
  DetailButtonRenderer,
} from "./data-grid";
import { getPlanData } from "@/actions/plan";

export default function PlanGrid() {
  const [rowData, setRowData] = useState<IPlanData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 컬럼 정의
  const columnDefs = useMemo<ColDef[]>(
    () => [
      {
        field: "contractNumber",
        headerName: "계약 번호",
        width: 130,
      },
      {
        field: "progressStatus",
        headerName: "진행 상태",
        width: 100,
      },
      {
        field: "contractDate",
        headerName: "계약일자",
        valueFormatter: dateFormatter,
        width: 150,
      },
      {
        field: "importer",
        headerName: "수입처",
        width: 120,
      },
      {
        field: "contractParty",
        headerName: "계약처",
        width: 120,
      },
      {
        field: "estimatedTimeArrival",
        headerName: "ETA",
        valueFormatter: dateFormatter,
        width: 150,
      },
      {
        field: "arrivalPort",
        headerName: "도착항",
        width: 120,
      },
      {
        field: "itemName",
        headerName: "품목",
        width: 120,
      },
      {
        field: "contractTon",
        headerName: "무게",
        valueFormatter: (params) => `${params.value}톤`,
        width: 100,
      },
      {
        field: "unitPrice",
        headerName: "단가",
        valueFormatter: currencyFormatter,
        width: 130,
      },
      {
        field: "totalPrice",
        headerName: "단가 * 무게",
        valueFormatter: currencyFormatter,
        width: 150,
      },
      {
        field: "paymentMethod",
        headerName: "결제방식",
        width: 100,
      },
      {
        field: "warehouseEntryDate",
        headerName: "입고일",
        valueFormatter: dateFormatter,
        width: 150,
      },
      {
        field: "importCostPerKg",
        headerName: "수입가/kg",
        valueFormatter: perKgFormatter,
        width: 130,
      },
      {
        field: "supplyCostPerKg",
        headerName: "수급가/kg",
        valueFormatter: perKgFormatter,
        width: 130,
      },
      {
        field: "totalCost",
        headerName: "총 비용",
        valueFormatter: currencyFormatter,
        width: 150,
      },
      {
        field: "totalCostPerKg",
        headerName: "총 비용/kg",
        valueFormatter: perKgFormatter,
        width: 130,
      },
      {
        field: "sellingPrice",
        headerName: "판매가",
        valueFormatter: currencyFormatter,
        width: 130,
      },
      {
        field: "margin",
        headerName: "마진",
        valueFormatter: (params) => `${params.value}%`,
        width: 100,
      },
      {
        field: "totalProfit",
        headerName: "총 이익",
        valueFormatter: currencyFormatter,
        width: 150,
      },
      {
        headerName: "",
        field: "detail",
        cellRenderer: DetailButtonRenderer,
        sortable: false,
        filter: false,
        width: 100,
      },
    ],
    [],
  );

  // DB 데이터 로딩
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getPlanData();
        setRowData(data);
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
  }, []);

  return (
    <DataGrid
      columnDefs={columnDefs}
      data={rowData}
      loading={loading}
      error={error}
    />
  );
}
