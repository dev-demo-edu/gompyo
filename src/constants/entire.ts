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
  removeDecimal?: boolean;
}

// 금액에 콤마 추가하는 함수
export const formatNumberWithCommas = (
  value: string | number | null | undefined,
): string => {
  if (value === null || value === undefined || value === "") return "";
  // 숫자가 아닌 문자 제거
  const numericString = String(value).replace(/[^0-9.-]/g, "");
  // 숫자로 변환
  const number = parseFloat(numericString);
  if (isNaN(number)) return "";
  // 콤마 추가
  return new Intl.NumberFormat("ko-KR").format(number);
};

// 원화 금액용 포맷터 (소수점 제거 + 콤마)
export const formatKRWAmount = (
  value: string | number | null | undefined,
): string => {
  if (value === null || value === undefined || value === "") return "";
  const numericString = String(value).replace(/[^0-9.-]/g, "");
  const number = parseFloat(numericString);
  if (isNaN(number)) return "";
  // 소수점 제거 후 콤마 추가
  return new Intl.NumberFormat("ko-KR").format(Math.floor(number));
};

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
  {
    name: "contractTon",
    label: "계약 톤수",
    valueType: "string",
    type: "number",
    endAdornment: "톤",
  },
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
      endAdornment: "₩/USD",
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
      endAdornment: "%",
    },
    {
      name: "remainingPaymentRatio",
      label: "잔금 비율",
      gridSize: 6,
      valueType: "number",
      endAdornment: "%",
    },
    {
      name: "advancePaymentAmount",
      label: "선급금 금액",
      gridSize: 6,
      valueType: "number",
      disabled: true,
      endAdornment: "₩",
      removeDecimal: true,
    },
    {
      name: "remainingPaymentAmount",
      label: "잔금 금액",
      gridSize: 6,
      valueType: "number",
      disabled: true,
      endAdornment: "₩",
      removeDecimal: true,
    },
  ],
  CAD: [
    // CAD
    {
      name: "exchangeRate",
      label: "환율",
      valueType: "number",
      endAdornment: "₩/USD",
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
      endAdornment: "₩/USD",
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
      endAdornment: "일",
    },
    {
      name: "exchangeRate",
      label: "환율",
      valueType: "number",
      endAdornment: "₩/USD",
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
  {
    name: "unitPrice",
    label: "단가",
    valueType: "number",
    endAdornment: "MT/USD",
    removeDecimal: true,
  },
  {
    name: "totalContractPrice",
    label: "총 계약가",
    valueType: "number",
    endAdornment: "₩",
    disabled: true,
    removeDecimal: true,
  },
  {
    name: "exchangeRate",
    label: "환율",
    valueType: "number",
    endAdornment: "₩/USD",
    removeDecimal: true,
  },
  {
    name: "costPerKg",
    label: "원가",
    valueType: "number",
    endAdornment: "₩/Kg",
    disabled: true,
    removeDecimal: true,
  },
  {
    name: "customsTaxRate",
    label: "관세율",
    valueType: "number",
    endAdornment: "%",
    removeDecimal: true,
  },
  {
    name: "customTaxAmount",
    label: "관세액",
    valueType: "number",
    disabled: true,
    endAdornment: "₩",
    removeDecimal: true,
  },
  {
    name: "transferFee",
    label: "송금수수료",
    valueType: "number",
    endAdornment: "₩",
    removeDecimal: true,
  },
  {
    name: "customsFee",
    label: "관세수수료",
    valueType: "number",
    endAdornment: "₩",
    removeDecimal: true,
  },
  {
    name: "inspectionFee",
    label: "검사료",
    valueType: "number",
    endAdornment: "₩",
    removeDecimal: true,
  },
  {
    name: "doCharge",
    label: "D/O Charge",
    valueType: "number",
    endAdornment: "₩",
    removeDecimal: true,
  },
  {
    name: "otherCosts",
    label: "기타비용",
    valueType: "number",
    endAdornment: "₩",
    removeDecimal: true,
  },
  {
    name: "purchaseFeeRate",
    label: "매입 수수료율",
    valueType: "number",
    type: "text",
    endAdornment: "%",
    removeDecimal: true,
  },
];

export const contractAmountFields: BaseField[] = [
  {
    name: "contractorCost",
    label: "수입회사 원가",
    valueType: "number",
    disabled: true,
    removeDecimal: true,
    endAdornment: "₩/Kg",
  },
  {
    name: "supplyPrice",
    label: "수입회사 수급가",
    valueType: "number",
    disabled: true,
    removeDecimal: true,
    endAdornment: "₩/Kg",
  },
  {
    name: "contractorProfit",
    label: "수입회사 이익",
    valueType: "number",
    disabled: true,
    endAdornment: "₩",
    removeDecimal: true,
  },
  {
    name: "shippingCost",
    label: "배송비",
    valueType: "number",
    endAdornment: "₩",
    removeDecimal: true,
  },
  {
    name: "laborCost",
    label: "작업료",
    valueType: "number",
    endAdornment: "₩",
    removeDecimal: true,
  },
  {
    name: "transportStorageFee",
    label: "운송/보관료",
    valueType: "number",
    endAdornment: "₩",
    removeDecimal: true,
  },
  {
    name: "loadingUnloadingFee",
    label: "상하차 비용",
    valueType: "number",
    endAdornment: "₩",
    removeDecimal: true,
  },
  {
    name: "usanceInterest",
    label: "Usance 이자(환차손)",
    valueType: "number",
    endAdornment: "₩",
    removeDecimal: true,
  },
];

export const expenseFields: BaseField[] = [
  {
    name: "totalCost",
    label: "총비용",
    valueType: "number",
    disabled: true,
    endAdornment: "₩",
    removeDecimal: true,
  },
  {
    name: "totalCostPerKg",
    label: "총비용/Kg",
    valueType: "number",
    disabled: true,
    endAdornment: "₩/Kg",
  },
  {
    name: "sellingPrice",
    label: "판매가(총판)",
    valueType: "number",
    endAdornment: "₩",
    removeDecimal: true,
  },
  {
    name: "sellingPriceWholesale",
    label: "판매가(도매)",
    valueType: "number",
    endAdornment: "₩",
    removeDecimal: true,
  },
  {
    name: "sellingPriceRetail",
    label: "판매가(소매)",
    valueType: "number",
    endAdornment: "₩",
    removeDecimal: true,
  },
  {
    name: "margin",
    label: "마진",
    valueType: "number",
    disabled: true,
    removeDecimal: true,
    endAdornment: "₩/Kg",
  },
  {
    name: "totalProfit",
    label: "총이익",
    valueType: "number",
    disabled: true,
    endAdornment: "₩",
    removeDecimal: true,
  },
];

export const gompyoCostFields: BaseField[] = [
  {
    name: "gompyoLaborCost",
    label: "곰표 작업료",
    valueType: "number",
    endAdornment: "₩",
  },
  {
    name: "gompyoTransportStorageFee",
    label: "곰표 운송/보관료",
    valueType: "number",
    endAdornment: "₩",
  },
  {
    name: "gompyoLoadingUnloadingFee",
    label: "곰표 상하차 비용",
    valueType: "number",
    endAdornment: "₩",
  },
];
