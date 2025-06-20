import DynamicForm, { DynamicFormField } from "@/components/dynamic-form";
import { z } from "zod";
import { addCashflow } from "@/actions/cashflow";
import { useAtom, useSetAtom } from "jotai";
import {
  cashflowRefreshAtom,
  selectedCompanyIdAtom,
} from "@/states/cashflow-state";
import { useState } from "react";
import { oneDecimalPositiveZod } from "@/utils/custom-zod";
// zod 스키마 정의
export const cashflowSchema = z.object({
  date: z.string().min(1, "날짜를 입력해주세요."),
  counterparty: z.string().min(1, "업체를 입력해주세요."),
  amount: oneDecimalPositiveZod,
  type: z.string(),
});

// 계좌 추가 폼 값 타입 (zod에서 추론)
export type CashflowFormValues = Omit<
  z.infer<typeof cashflowSchema>,
  "amount"
> & {
  amount: string;
};

// 계좌 추가 폼 필드 타입
export type CashflowField = DynamicFormField<CashflowFormValues>;

// 계좌 추가 폼 props 타입
export interface CashflowFormProps {
  onClose?: () => void;
  submitLabel?: string;
}

// 계좌 추가 폼 필드 정의 (필요에 따라 수정)
export const cashflowFields: CashflowField[] = [
  {
    name: "type",
    label: "타입",
    type: "select",
    required: true,
    options: [
      { label: "수금", value: "income" },
      { label: "지출", value: "expense" },
    ],
  },
  {
    name: "date",
    label: "날짜",
    type: "date",
    required: true,
  },
  {
    name: "counterparty",
    label: "업체",
    type: "text",
    required: true,
  },
  {
    name: "amount",
    label: "금액",
    type: "text",
    required: true,
    endAdornment: "백만원",
  },
];

// 계좌 추가 폼 컴포넌트
export default function CashflowForm({
  onClose,
  submitLabel = "저장",
}: CashflowFormProps) {
  const setRefresh = useSetAtom(cashflowRefreshAtom);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [companyId] = useAtom(selectedCompanyIdAtom);

  const handleSubmit = async (values: z.infer<typeof cashflowSchema>) => {
    try {
      await addCashflow({
        ...values,
        amount: Number(values.amount),
        companyId: companyId,
        isApproved: false,
      });
      setRefresh((prev) => prev + 1);
      setFieldErrors({}); // 에러 초기화
      onClose?.();
    } catch (error) {
      if (error instanceof Error) {
        setFieldErrors({
          accountNumber: error.message,
        });
      } else {
        setFieldErrors({
          accountNumber: "오류가 발생했습니다.",
        });
      }
    }
  };

  return (
    <DynamicForm<CashflowFormValues, z.infer<typeof cashflowSchema>>
      fields={cashflowFields}
      onSubmit={handleSubmit}
      submitLabel={submitLabel}
      zodSchema={cashflowSchema}
      fieldErrors={fieldErrors}
    />
  );
}
