import {
  dateFormatter,
  currencyFormatter,
  perKgFormatter,
} from "../utils/formatter";
import { ColDef } from "ag-grid-community";

export const DEFAULT_PLAN_COLUMN: ColDef[] = [
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
    field: "exporter",
    headerName: "공급업체",
    width: 120,
  },
  {
    field: "importer",
    headerName: "수입회사",
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
    valueFormatter: currencyFormatter,
    width: 100,
  },
  {
    field: "totalProfit",
    headerName: "총 이익",
    valueFormatter: currencyFormatter,
    width: 150,
  },
];

export const DEFAULT_SHIPMENT_COLUMN: ColDef[] = [
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
];

export const defaultPlanColumnOrderFields: string[] = DEFAULT_PLAN_COLUMN.map(
  (col) => col.field as string,
);

export const defaultShipmentColumnOrderFields: string[] =
  DEFAULT_SHIPMENT_COLUMN.map((col) => col.field as string);
