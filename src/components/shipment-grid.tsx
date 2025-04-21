"use client";

import { useEffect, useState, useMemo } from "react";
import type { ColDef } from "ag-grid-community";
import { IShipmentData } from "@/types/grid-col";
import DataGrid, { DetailButtonRenderer } from "./data-grid";
import { dateFormatter, currencyFormatter } from "@/utils/formatter";
import { getShipmentData } from "@/actions/shipment";

export default function ShipmentGrid() {
  const [rowData, setRowData] = useState<IShipmentData[]>([]);
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
        headerName: "수입회사",
        width: 120,
      },
      {
        field: "productName",
        headerName: "제품명",
        width: 150,
      },
      {
        field: "itemName",
        headerName: "품목",
        width: 120,
      },
      {
        field: "weight",
        headerName: "무게",
        valueFormatter: (params) => `${params.value}톤`,
        width: 100,
      },
      {
        field: "containerCount",
        headerName: "컨테이너 개수",
        width: 120,
      },
      {
        field: "packingUnit",
        headerName: "포장 단위",
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
        field: "supplyPrice",
        headerName: "수급가",
        valueFormatter: currencyFormatter,
        width: 130,
      },
      {
        field: "sellingPrice",
        headerName: "판매가",
        valueFormatter: currencyFormatter,
        width: 130,
      },
      {
        field: "paymentMethod",
        headerName: "결제방식",
        width: 100,
      },
      {
        field: "hsCode",
        headerName: "HS CODE",
        width: 120,
      },
      {
        field: "blNumber",
        headerName: "BL no.",
        width: 120,
      },
      {
        field: "departurePort",
        headerName: "port(출발항)",
        width: 120,
      },
      {
        field: "etd",
        headerName: "ETD",
        valueFormatter: dateFormatter,
        width: 150,
      },
      {
        field: "arrivalPort",
        headerName: "port(도착항)",
        width: 120,
      },
      {
        field: "eta",
        headerName: "ETA",
        valueFormatter: dateFormatter,
        width: 150,
      },
      {
        field: "exporter",
        headerName: "공급업체",
        width: 120,
      },
      {
        field: "customsDate",
        headerName: "통관일자",
        valueFormatter: dateFormatter,
        width: 150,
      },
      {
        headerName: "상세",
        field: "detail",
        cellRenderer: DetailButtonRenderer,
        sortable: false,
        filter: false,
        width: 100,
        pinned: "right",
      },
    ],
    [],
  );

  // DB 데이터 로딩
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getShipmentData();
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
