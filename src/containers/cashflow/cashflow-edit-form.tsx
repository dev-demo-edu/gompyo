import DynamicForm, { DynamicFormField } from "@/components/dynamic-form";
import { z } from "zod";
import { updateCashflow, Cashflow } from "@/actions/cashflow";
import { useAtom, useSetAtom, useAtomValue } from "jotai";
import {
  cashflowRefreshAtom,
  selectedCompanyIdAtom,
  selectedIncomeRowsAtom,
  selectedExpenseRowsAtom,
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
export interface CashflowEditFormProps {
  onClose?: () => void;
  submitLabel?: string;
}

// 계좌 추가 폼 필드 정의 (필요에 따라 수정)
const cashflowFields: CashflowField[] = [
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

export default function CashflowEditForm({
  onClose,
  submitLabel = "수정",
}: CashflowEditFormProps) {
  const setRefresh = useSetAtom(cashflowRefreshAtom);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [companyId] = useAtom(selectedCompanyIdAtom);
  // jotai atom에서 직접 선택된 row를 읽어옴
  const selectedIncomeRows = useAtomValue(selectedIncomeRowsAtom);
  const selectedExpenseRows = useAtomValue(selectedExpenseRowsAtom);
  const selectedCashflow: Cashflow | undefined =
    selectedIncomeRows.length === 1
      ? selectedIncomeRows[0]
      : selectedExpenseRows.length === 1
        ? selectedExpenseRows[0]
        : undefined;

  const handleSubmit = async (values: z.infer<typeof cashflowSchema>) => {
    if (!selectedCashflow) {
      setFieldErrors({
        accountNumber: "수정할 내역이 선택되지 않았습니다.",
      });
      return;
    }

    try {
      await updateCashflow(
        {
          ...values,
          amount: Number(values.amount),
          companyId,
        },
        selectedCashflow.id,
      );
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

  if (!selectedCashflow) {
    return <div>수정할 내역을 선택해주세요.</div>;
  }

  return (
    <DynamicForm<CashflowFormValues, z.infer<typeof cashflowSchema>>
      fields={cashflowFields}
      onSubmit={handleSubmit}
      submitLabel={submitLabel}
      zodSchema={cashflowSchema}
      fieldErrors={fieldErrors}
      initialValues={{
        type: selectedCashflow.type,
        date: selectedCashflow.date,
        counterparty: selectedCashflow.counterparty,
        amount: String(selectedCashflow.amount),
      }}
    />
  );
}
