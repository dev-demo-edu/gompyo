import { Importer } from "@/types/importer";

// 필드 타입 정의
export type InputFieldType = "text" | "select" | "number" | "date" | "textarea";

// 가능한 값 타입들을 정의
export type FieldValueType = "string" | "number" | "date";

// null을 허용하는 필드값 타입
export type FieldValue = string | number | Date | null;

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

// 수입회사 옵션을 설정하는 함수
export const setImporterOptions = (importers: Importer[]) => {
  return importers.map((importer) => ({
    value: importer.importerName,
    label: importer.importerName,
  }));
};

// contractFields를 생성하는 함수
export const createContractFields = (importers: Importer[]): BaseField[] => [
  { name: "contractNumber", label: "계약 번호", valueType: "string" },
  {
    name: "contractDate",
    label: "계약 일자",
    valueType: "string",
    type: "date",
  },
  {
    name: "importerName",
    label: "수입회사",
    valueType: "string",
    type: "select",
    options: setImporterOptions(importers),
  },
  { name: "exporter", label: "공급업체", valueType: "string" },
  { name: "incoterms", label: "인코텀즈", valueType: "string" },
  { name: "departurePort", label: "출발항", gridSize: 6, valueType: "string" },
  { name: "arrivalPort", label: "도착항", gridSize: 6, valueType: "string" },
  {
    name: "estimatedTimeDeparture",
    label: "ETD",
    gridSize: 6,
    valueType: "string",
    type: "date",
  },
  {
    name: "estimatedTimeArrival",
    label: "ETA",
    gridSize: 6,
    valueType: "string",
    type: "date",
  },
  { name: "blNumber", label: "B/L 번호", valueType: "string" },
];

// 결제 방식 매핑 상수
export const PAYMENT_METHOD_DISPLAY = {
  "T/T": "T/T",
  CAD: "CAD",
  "L/C": "L/C at sight",
  Usance: "Payment Usance",
} as const;

// 기본 결제 필드 정의
export const paymentFields: BaseField[] = [
  {
    name: "paymentMethod",
    label: "결제 방식",
    valueType: "string",
    type: "select",
    options: [
      { value: "T/T", label: "T/T" },
      { value: "CAD", label: "CAD" },
      { value: "L/C", label: "L/C at sight" },
      { value: "Usance", label: "Payment Usance" },
    ],
  },
];

// 결제 방식별 필드 정의
export const paymentMethodFields: Record<string, BaseField[]> = {
  "T/T": [
    // T/T
    {
      name: "exchangeRate",
      label: "환율",
      valueType: "number",
    },
    {
      name: "counterpartBank",
      label: "상대방 은행",
      valueType: "string",
    },
    {
      name: "advancePaymentDate",
      label: "선급금 날짜",
      gridSize: 6,
      valueType: "string",
      type: "date",
    },
    {
      name: "remainingPaymentDate",
      label: "잔금 날짜",
      gridSize: 6,
      valueType: "string",
      type: "date",
    },
    {
      name: "advancePaymentRatio",
      label: "선급금 비율",
      gridSize: 6,
      valueType: "number",
    },
    {
      name: "remainingPaymentRatio",
      label: "잔금 비율",
      gridSize: 6,
      valueType: "number",
    },
    {
      name: "advancePaymentAmount",
      label: "선급금 금액",
      gridSize: 6,
      valueType: "number",
      disabled: true,
    },
    {
      name: "remainingPaymentAmount",
      label: "잔금 금액",
      gridSize: 6,
      valueType: "number",
      disabled: true,
    },
  ],
  CAD: [
    // CAD
    {
      name: "exchangeRate",
      label: "환율",
      valueType: "number",
    },
    {
      name: "paymentDueDate",
      label: "대금 결제일",
      valueType: "string",
      type: "date",
    },
  ],
  "L/C": [
    // L/C
    {
      name: "exchangeRate",
      label: "환율",
      valueType: "number",
    },
    {
      name: "paymentDueDate",
      label: "대금 결제일",
      valueType: "string",
      type: "date",
    },
  ],
  Usance: [
    // Usance
    {
      name: "paymentTerm",
      label: "결제 기간",
      valueType: "string",
    },
    {
      name: "exchangeRate",
      label: "환율",
      valueType: "number",
    },
    {
      name: "paymentDueDate",
      label: "대금 결제일",
      valueType: "string",
      type: "date",
    },
  ],
};

export const costFields: BaseField[] = [
  { name: "unitPrice", label: "단가 MT / $", valueType: "number" },
  {
    name: "totalContractPrice",
    label: "총 계약가",
    valueType: "number",
    disabled: true,
  },
  {
    name: "exchangeRate",
    label: "환율",
    valueType: "number",
  },
  {
    name: "costPerKg",
    label: "원가 Kg / ₩",
    valueType: "number",
    disabled: true,
  },
  {
    name: "customsTaxRate",
    label: "관세율",
    valueType: "number",
    endAdornment: "%",
  },
  {
    name: "customTaxAmount",
    label: "관세액",
    valueType: "number",
    disabled: true,
  },
  { name: "transferFee", label: "송금수수료", valueType: "number" },
  { name: "customsFee", label: "관세수수료", valueType: "number" },
  { name: "inspectionFee", label: "검사료", valueType: "number" },
  { name: "doCharge", label: "D/O Charge", valueType: "number" },
  { name: "otherCosts", label: "기타비용", valueType: "number" },
  { name: "purchaseFeeRate", label: "매입 수수료율", valueType: "number" },
];

export const contractAmountFields: BaseField[] = [
  {
    name: "contractorCost",
    label: "수입회사 원가",
    valueType: "number",
    disabled: true,
  },
  {
    name: "supplyPrice",
    label: "수입회사 수급가",
    valueType: "number",
    disabled: true,
  },
  {
    name: "contractorProfit",
    label: "수입회사 이익",
    valueType: "number",
    disabled: true,
  },
  { name: "shippingCost", label: "배송비", valueType: "number" },
  { name: "laborCost", label: "작업료", valueType: "number" },
  { name: "transportStorageFee", label: "운송/보관료", valueType: "number" },
  { name: "loadingUnloadingFee", label: "상하차 비용", valueType: "number" },
  { name: "usanceInterest", label: "Usance 이자(환차손)", valueType: "number" },
];

export const expenseFields: BaseField[] = [
  { name: "totalCost", label: "총비용", valueType: "number", disabled: true },
  { name: "sellingPrice", label: "판매가(총판)", valueType: "number" },
  { name: "sellingPriceWholesale", label: "판매가(도매)", valueType: "number" },
  { name: "sellingPriceRetail", label: "판매가(소매)", valueType: "number" },
  { name: "margin", label: "마진", valueType: "number", disabled: true },
  { name: "totalProfit", label: "총이익", valueType: "number", disabled: true },
];
