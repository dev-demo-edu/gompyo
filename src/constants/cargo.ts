import { InputFieldType, FieldValueType } from "./entire";

interface Option {
  value: string;
  label: string;
}

interface BaseField {
  name: string;
  label: string;
  gridSize?: number;
  hasEditButton?: boolean;
  valueType: FieldValueType;
  type?: InputFieldType;
  options?: Option[];
  disabled?: boolean;
  endAdornment?: string;
}

// 포장 정보를 위한 타입 정의
export interface PackagingData {
  // items 테이블에서 가져오는 데이터
  packingUnit: string | null;
  // cargo 테이블에서 가져오는 데이터
  contractTon: number | null;
  containerCount: number | null;
  [key: string]: string | number | null;
}

export interface StatusData {
  // shipment 테이블에서 가져오는 데이터
  palletOrderDate: string | null;
  palletType: string | null;
  shippingCompany: string | null;
  // cargo 테이블에서 가져오는 데이터
  customsClearanceDate: string | null;
  warehouseEntryDate: string | null;
  quarantineDate: string | null;
  [key: string]: string | null;
}

export const itemFields: BaseField[] = [
  {
    name: "itemName",
    label: "품목명",
    gridSize: 6,
    valueType: "string",
  },
  {
    name: "itemVariety",
    label: "품종",
    gridSize: 6,
    valueType: "string",
  },
  {
    name: "originCountry",
    label: "원산지",
    gridSize: 12,
    valueType: "string",
  },
  {
    name: "hsCode",
    label: "HS Code",
    gridSize: 12,
    valueType: "string",
  },
];

export const packagingFields: BaseField[] = [
  {
    name: "packingUnit",
    label: "포장 단위",
    gridSize: 12,
    type: "select" as const,
    valueType: "string",
    options: [
      { value: "25kg-bag", label: "25kg 백" },
      { value: "1.2ton-bag", label: "1.2톤 백" },
    ],
  },
  {
    name: "contractTon",
    label: "계약 톤수",
    gridSize: 12,
    endAdornment: "톤",
    valueType: "number",
    type: "number",
  },
  {
    name: "containerCount",
    label: "컨테이너 개수",
    gridSize: 12,
    endAdornment: "개",
    valueType: "number",
    type: "number",
  },
];

export const statusFields: BaseField[] = [
  {
    name: "shippingCompany",
    label: "선사",
    gridSize: 12,
    valueType: "string",
  },
  {
    name: "customsClearanceDate",
    label: "통관일",
    gridSize: 12,
    valueType: "string",
    type: "date",
  },
  {
    name: "warehouseEntryDate",
    label: "입고일",
    gridSize: 12,
    valueType: "string",
    type: "date",
  },
  {
    name: "quarantineDate",
    label: "검역일",
    gridSize: 12,
    valueType: "string",
    type: "date",
  },
  {
    name: "palletOrderDate",
    label: "파레트 주문일",
    gridSize: 12,
    valueType: "string",
    type: "date",
  },
  {
    name: "palletType",
    label: "파레트 종류",
    gridSize: 12,
    valueType: "string",
  },
];
