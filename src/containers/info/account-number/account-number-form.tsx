import DynamicForm, { DynamicFormField } from "@/components/dynamic-form";
import { z } from "zod";
import { addAccountNumber } from "@/actions/info/account-number-actions";
import { useAtomValue, useSetAtom } from "jotai";
import { accountNumberRefreshAtom } from "@/states/account-number";
import { useState } from "react";
import { updateAccountNumber } from "@/actions/info/account-number-actions";
import { selectedAccountNumbersAtom } from "@/states/account-number";

// zod 스키마 정의
export const accountNumberSchema = z.object({
  bankName: z.string().min(1, "은행명을 입력해주세요."),
  accountNumber: z
    .string()
    .min(1, "계좌번호를 입력해주세요.")
    .regex(/^[0-9-]+$/, "숫자와 하이픈(-)만 입력 가능합니다."),
  owner: z.string().min(1, "예금주를 입력해주세요."),
});

// 계좌 추가 폼 값 타입 (zod에서 추론)
export type AccountNumberFormValues = z.infer<typeof accountNumberSchema>;

// 계좌 추가 폼 필드 타입
export type AccountNumberField = DynamicFormField<AccountNumberFormValues>;

// 계좌 추가 폼 필드 정의 (필요에 따라 수정)
export const accountNumberFields: AccountNumberField[] = [
  {
    name: "accountNumber",
    label: "계좌번호",
    type: "text",
    required: true,
  },
  {
    name: "bankName",
    label: "은행명",
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

// 계좌 추가 폼 props 타입
export interface AccountNumberAddFormProps {
  onClose?: () => void;
  submitLabel?: string;
}

// 계좌 추가 폼 컴포넌트
export default function AccountNumberAddForm({
  onClose,
  submitLabel = "저장",
}: AccountNumberAddFormProps) {
  const setRefresh = useSetAtom(accountNumberRefreshAtom);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (values: AccountNumberFormValues) => {
    try {
      await addAccountNumber(values);
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
    <DynamicForm
      fields={accountNumberFields}
      onSubmit={handleSubmit}
      submitLabel={submitLabel}
      zodSchema={accountNumberSchema}
      fieldErrors={fieldErrors}
    />
  );
}

export function AccountNumberEditForm({
  onClose,
  submitLabel = "수정",
}: AccountNumberAddFormProps) {
  const setRefresh = useSetAtom(accountNumberRefreshAtom);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const selectedAccountNumbers = useAtomValue(selectedAccountNumbersAtom);

  const handleSubmit = async (values: z.infer<typeof accountNumberSchema>) => {
    if (!selectedAccountNumbers) {
      setFieldErrors({
        accountNumber: "수정할 내역이 선택되지 않았습니다.",
      });
      return;
    }

    try {
      await updateAccountNumber({
        ...values,
        id: selectedAccountNumbers[0].id,
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
    <DynamicForm
      fields={accountNumberFields}
      onSubmit={handleSubmit}
      submitLabel={submitLabel}
      zodSchema={accountNumberSchema}
      fieldErrors={fieldErrors}
      initialValues={{
        accountNumber: selectedAccountNumbers[0].accountNumber,
        bankName: selectedAccountNumbers[0].bankName,
        owner: selectedAccountNumbers[0].owner,
      }}
    />
  );
}
