import DynamicForm, { DynamicFormField } from "@/components/dynamic-form";
import { z } from "zod";
import { updateCompanyBalance } from "@/actions/cashflow";
import { useAtom, useSetAtom } from "jotai";
import {
  cashflowRefreshAtom,
  companyBalanceAtom,
  selectedCompanyIdAtom,
  setCompanyBalanceAtom,
} from "@/states/cashflow-state";
import { useState } from "react";

// zod 스키마 정의
export const cashflowBalanceSchema = z.object({
  companyBalance: z.number().int({
    message: "정수를 입력해주세요",
  }),
});

// 계좌 추가 폼 값 타입 (zod에서 추론)
export type CashflowBalanceFormValues = z.infer<typeof cashflowBalanceSchema>;

// 계좌 추가 폼 필드 타입
export type CashflowBalanceField = DynamicFormField<CashflowBalanceFormValues>;

// 계좌 추가 폼 props 타입
export interface CashflowBalanceFormProps {
  onClose?: () => void;
  submitLabel?: string;
}

// 계좌 추가 폼 필드 정의 (필요에 따라 수정)
export const cashflowBalanceFields: CashflowBalanceField[] = [
  {
    name: "companyBalance",
    label: "잔액",
    type: "number",
    required: true,
    defaultValue: 0,
    endAdornment: "백만원",
  },
];

// 계좌 추가 폼 컴포넌트
export default function CashflowBalanceForm({
  onClose,
  submitLabel = "설정",
}: CashflowBalanceFormProps) {
  const setRefresh = useSetAtom(cashflowRefreshAtom);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [companyId] = useAtom(selectedCompanyIdAtom);
  const [companyBalance] = useAtom(companyBalanceAtom);
  const setCompanyBalance = useSetAtom(setCompanyBalanceAtom);

  const handleSubmit = async (values: CashflowBalanceFormValues) => {
    try {
      await updateCompanyBalance(values.companyBalance, companyId);
      setCompanyBalance(values.companyBalance);
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

  cashflowBalanceFields[0].defaultValue = companyBalance;

  return (
    <DynamicForm
      fields={cashflowBalanceFields}
      onSubmit={handleSubmit}
      submitLabel={submitLabel}
      zodSchema={cashflowBalanceSchema}
      fieldErrors={fieldErrors}
    />
  );
}
