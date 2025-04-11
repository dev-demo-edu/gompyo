// 필드 타입 정의
export type InputFieldType = "text" | "select" | "number" | "date";

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

export const contractFields: BaseField[] = [
  { name: "contractNumber", label: "계약 번호", valueType: "string" },
  {
    name: "contractDate",
    label: "계약 일자",
    valueType: "string",
    type: "date",
  },
  {
    name: "contractor",
    label: "계약처",
    valueType: "string",
    type: "select",
    options: [], // 동적으로 채워질 예정
  },
  { name: "importer", label: "수입처", valueType: "string" },
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

export const paymentFields: BaseField[] = [
  {
    name: "paymentMethod",
    label: "결제 방식",
    valueType: "string",
    type: "select",
    options: [
      { value: "1", label: "T/T" },
      { value: "2", label: "CAD" },
      { value: "3", label: "L/C at sight" },
      { value: "4", label: "Payment Usance" },
    ],
  },
  {
    name: "depositDate",
    label: "선급금 날짜",
    gridSize: 6,
    valueType: "string",
    type: "date",
  },
  {
    name: "balanceDate",
    label: "잔금 날짜",
    gridSize: 6,
    valueType: "string",
    type: "date",
  },
  {
    name: "depositRatio",
    label: "선급금 비율",
    gridSize: 6,
    valueType: "number",
  },
  {
    name: "balanceRatio",
    label: "잔금 비율",
    gridSize: 6,
    valueType: "number",
  },
  {
    name: "depositAmount",
    label: "선급금 금액",
    gridSize: 6,
    valueType: "number",
  },
  {
    name: "balanceAmount",
    label: "잔금 금액",
    gridSize: 6,
    valueType: "number",
  },
];

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
    label: "계약처 원가",
    valueType: "number",
    disabled: true,
  },
  {
    name: "supplyPrice",
    label: "계약처 수급가",
    valueType: "number",
    disabled: true,
  },
  {
    name: "contractorProfit",
    label: "계약처 이익",
    valueType: "number",
    disabled: true,
  },
  { name: "shippingCost", label: "배송비", valueType: "number" },
  { name: "laborCost", label: "작업료", valueType: "number" },
  { name: "transportStorageFee", label: "운송/보관료", valueType: "number" },
  { name: "loadingUnloadingFee", label: "상하차 비용", valueType: "number" },
];

export const expenseFields: BaseField[] = [
  { name: "totalCost", label: "총비용", valueType: "number", disabled: true },
  { name: "sellingPrice", label: "판매가", valueType: "number" },
  { name: "margin", label: "마진", valueType: "number", disabled: true },
  { name: "totalProfit", label: "총이익", valueType: "number", disabled: true },
];
