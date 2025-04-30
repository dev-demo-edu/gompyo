import DynamicForm, { DynamicFormField } from "@/components/dynamic-form";
import { z } from "zod";
import { addAccountNumber } from "@/actions/info/account-number-actions";
import { useSetAtom } from "jotai";
import { accountNumberRefreshAtom } from "@/states/account-number";

// zod 스키마 정의
export const accountNumberSchema = z.object({
  bankName: z.string().min(1, "은행명을 입력해주세요."),
  accountNumber: z.string().min(1, "계좌번호를 입력해주세요."),
  owner: z.string().min(1, "예금주를 입력해주세요."),
});

// 계좌 추가 폼 값 타입 (zod에서 추론)
export type AccountNumberFormValues = z.infer<typeof accountNumberSchema>;

// 계좌 추가 폼 필드 타입
export type AccountNumberField = DynamicFormField<AccountNumberFormValues>;

// 계좌 추가 폼 props 타입
export interface AccountNumberFormProps {
  submitLabel?: string;
  onSubmit?: () => void;
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
    name: "owner",
    label: "예금주",
    type: "text",
    required: true,
  },
];

// 계좌 추가 폼 컴포넌트
export default function AccountNumberForm({
  submitLabel = "저장",
  onSubmit,
}: AccountNumberFormProps) {
  const setRefresh = useSetAtom(accountNumberRefreshAtom);

  const handleSubmit = async (values: AccountNumberFormValues) => {
    await addAccountNumber({ ...values, createdAt: new Date().toISOString() });
    setRefresh((prev) => prev + 1);
    onSubmit?.();
  };

  return (
    <DynamicForm
      fields={accountNumberFields}
      onSubmit={handleSubmit}
      submitLabel={submitLabel}
      zodSchema={accountNumberSchema}
    />
  );
}
