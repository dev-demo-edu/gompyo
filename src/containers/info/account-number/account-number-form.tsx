import DynamicForm, { DynamicFormField } from "@/components/dynamic-form";
import { z } from "zod";

// zod 스키마 정의
export const accountNumberSchema = z.object({
  bankName: z.string().min(1, "은행명을 입력해주세요."),
  accountNumber: z.string().min(1, "계좌번호를 입력해주세요."),
  holder: z.string().min(1, "예금주를 입력해주세요."),
});

// 계좌 추가 폼 값 타입 (zod에서 추론)
export type AccountNumberFormValues = z.infer<typeof accountNumberSchema>;

// 계좌 추가 폼 필드 타입
export type AccountNumberField = DynamicFormField<AccountNumberFormValues>;

// 계좌 추가 폼 props 타입
export interface AccountNumberFormProps {
  onSubmit: (values: AccountNumberFormValues) => void;
  submitLabel?: string;
}

// 계좌 추가 폼 필드 정의 (필요에 따라 수정)
export const accountNumberFields: AccountNumberField[] = [
  {
    name: "bankName",
    label: "은행명",
    type: "text",
    required: true,
  },
  {
    name: "accountNumber",
    label: "계좌번호",
    type: "text",
    required: true,
  },
  {
    name: "holder",
    label: "예금주",
    type: "text",
    required: true,
  },
];

// 계좌 추가 폼 컴포넌트
export default function AccountNumberForm({
  onSubmit,
  submitLabel = "저장",
}: AccountNumberFormProps) {
  return (
    <DynamicForm
      fields={accountNumberFields}
      onSubmit={onSubmit}
      submitLabel={submitLabel}
      zodSchema={accountNumberSchema}
    />
  );
}
