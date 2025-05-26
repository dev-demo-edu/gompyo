import DynamicForm, { DynamicFormField } from "@/components/dynamic-form";
import { z } from "zod";
import { useState } from "react";

// zod 스키마 정의
export const companySchema = z.object({
  name: z.string().min(1, "업체명을 입력해주세요."),
  description: z.string().optional(),
});

// 업체 추가 폼 값 타입 (zod에서 추론)
export type CompanyFormValues = z.infer<typeof companySchema>;

// 업체 추가 폼 필드 타입
export type CompanyField = DynamicFormField<CompanyFormValues>;

// 업체 추가 폼 필드 정의
export const companyFields: CompanyField[] = [
  {
    name: "name",
    label: "업체명",
    type: "text",
    required: true,
  },
];

// 업체 추가 폼 props 타입
export interface CompanyFormProps {
  onClose?: () => void;
  onSubmit: (values: CompanyFormValues) => void;
  submitLabel?: string;
}

// 업체 추가 폼 컴포넌트
export default function CompanyForm({
  onClose,
  onSubmit,
  submitLabel = "추가",
}: CompanyFormProps) {
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (values: CompanyFormValues) => {
    try {
      onSubmit(values);
      setFieldErrors({}); // 에러 초기화
      onClose?.();
    } catch (error) {
      if (error instanceof Error) {
        setFieldErrors({
          name: error.message,
        });
      } else {
        setFieldErrors({
          name: "오류가 발생했습니다.",
        });
      }
    }
  };

  return (
    <DynamicForm
      fields={companyFields}
      onSubmit={handleSubmit}
      submitLabel={submitLabel}
      zodSchema={companySchema}
      fieldErrors={fieldErrors}
    />
  );
}
