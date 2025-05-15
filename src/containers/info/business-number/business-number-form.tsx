import DynamicForm, { DynamicFormField } from "@/components/dynamic-form";
import { z } from "zod";
import { useAtomValue, useSetAtom } from "jotai";
import { useState } from "react";
import {
  businessNumberRefreshAtom,
  selectedBusinessNumbersAtom,
} from "@/states/business-number";
import {
  addBusinessNumber,
  updateBusinessNumber,
} from "@/actions/info/business-number-actions";

// zod 스키마 정의
export const businessNumberSchema = z.object({
  businessNumber: z.string().min(1, "사업자번호를 입력해주세요."),
  businessName: z.string().min(1, "사업자명을 입력해주세요."),
  businessRepresentative: z.string().min(1, "사업자대표자를 입력해주세요."),
});

// 계좌 추가 폼 값 타입 (zod에서 추론)
export type BusinessNumberFormValues = z.infer<typeof businessNumberSchema>;

// 계좌 추가 폼 필드 타입
export type BusinessNumberField = DynamicFormField<BusinessNumberFormValues>;

// 계좌 추가 폼 props 타입
export interface BusinessNumberFormProps {
  onClose?: () => void;
  submitLabel?: string;
}

// 계좌 추가 폼 필드 정의 (필요에 따라 수정)
export const businessNumberFields: BusinessNumberField[] = [
  {
    name: "businessNumber",
    label: "사업자번호",
    type: "text",
    required: true,
  },
  {
    name: "businessName",
    label: "사업자명",
    type: "text",
    required: true,
  },
  {
    name: "businessRepresentative",
    label: "사업자대표자",
    type: "text",
    required: true,
  },
];

// 계좌 추가 폼 컴포넌트
export default function BusinessNumberForm({
  onClose,
  submitLabel = "저장",
}: BusinessNumberFormProps) {
  const setRefresh = useSetAtom(businessNumberRefreshAtom);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (values: BusinessNumberFormValues) => {
    try {
      await addBusinessNumber(values);
      setRefresh((prev) => prev + 1);
      setFieldErrors({}); // 에러 초기화
      onClose?.();
    } catch (error) {
      if (error instanceof Error) {
        setFieldErrors({
          businessNumber: error.message,
        });
      } else {
        setFieldErrors({
          businessNumber: "오류가 발생했습니다.",
        });
      }
    }
  };

  return (
    <DynamicForm
      fields={businessNumberFields}
      onSubmit={handleSubmit}
      submitLabel={submitLabel}
      zodSchema={businessNumberSchema}
      fieldErrors={fieldErrors}
    />
  );
}

export function BusinessNumberEditForm({
  onClose,
  submitLabel = "수정",
}: BusinessNumberFormProps) {
  const setRefresh = useSetAtom(businessNumberRefreshAtom);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const selectedBusinessNumbers = useAtomValue(selectedBusinessNumbersAtom);

  const handleSubmit = async (values: BusinessNumberFormValues) => {
    if (!selectedBusinessNumbers) {
      setFieldErrors({
        businessNumber: "수정할 내역이 선택되지 않았습니다.",
      });
      return;
    }

    try {
      await updateBusinessNumber({
        ...values,
        id: selectedBusinessNumbers[0].id,
      });
      setRefresh((prev) => prev + 1);
      setFieldErrors({}); // 에러 초기화
      onClose?.();
    } catch (error) {
      if (error instanceof Error) {
        setFieldErrors({
          businessNumber: error.message,
        });
      } else {
        setFieldErrors({
          businessNumber: "오류가 발생했습니다.",
        });
      }
    }
  };

  return (
    <DynamicForm
      fields={businessNumberFields}
      onSubmit={handleSubmit}
      submitLabel={submitLabel}
      zodSchema={businessNumberSchema}
      fieldErrors={fieldErrors}
      initialValues={{
        businessNumber: selectedBusinessNumbers[0].businessNumber,
        businessName: selectedBusinessNumbers[0].businessName,
        businessRepresentative:
          selectedBusinessNumbers[0].businessRepresentative,
      }}
    />
  );
}
