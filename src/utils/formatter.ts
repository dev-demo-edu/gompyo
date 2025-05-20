import { ValueFormatterParams } from "ag-grid-community";

// 날짜 포맷터
export const dateFormatter = (params: ValueFormatterParams): string => {
  return params.value
    ? new Date(params.value).toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";
};

// 숫자 포맷터 (원화)
export const currencyFormatter = (params: ValueFormatterParams): string => {
  return params.value
    ? new Intl.NumberFormat("ko-KR", {
        style: "currency",
        currency: "KRW",
      }).format(params.value)
    : "";
};

export const currencyDollarFormatter = (
  params: ValueFormatterParams,
): string => {
  // 빈값 예외처리
  if (
    params.value === null ||
    params.value === undefined ||
    params.value === ""
  )
    return "";

  const value = Number(params.value);
  if (isNaN(value)) return "";

  const hasDecimal = !Number.isInteger(value);

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: hasDecimal ? 2 : 0,
    maximumFractionDigits: hasDecimal ? 2 : 0,
  }).format(value);
};

// 숫자 포맷터 (kg당)
export const perKgFormatter = (params: ValueFormatterParams): string => {
  return params.value
    ? new Intl.NumberFormat("ko-KR", {
        style: "currency",
        currency: "KRW",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(params.value) + "/kg"
    : "";
};

// 날짜 포맷터 (월, 일, 요일)
export const weekDayFormatter = (params: ValueFormatterParams): string => {
  return params.value
    ? new Date(params.value).toLocaleDateString("ko-KR", {
        month: "long",
        day: "numeric",
        weekday: "short",
      })
    : "";
};

// 소수점 첫째자리 포맷터
export const oneDecimalFormatter = (params: ValueFormatterParams): string => {
  if (
    params.value === null ||
    params.value === undefined ||
    params.value === ""
  )
    return "";

  const rawNumber = Number(params.value);
  if (isNaN(rawNumber)) return "";

  // 소수점 첫째 자리까지 반올림한 숫자
  const rounded = Number(rawNumber.toFixed(1));

  // 반올림한 결과가 정수면 정수로 보여줌
  if (Number.isInteger(rounded)) return rounded.toString();

  // 아니면 소수점 한 자리까지 표시
  return rounded.toFixed(1);
};

// 날짜 포매터 (년/월/일)
export const dateSlashFormatter = (params: ValueFormatterParams): string => {
  if (!params.value) return "";

  const date = new Date(params.value);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}/${month}/${day}`;
};

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
