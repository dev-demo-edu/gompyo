import DynamicForm, { DynamicFormField } from "@/components/dynamic-form";
import { z } from "zod";
import { useState } from "react";

// zod 스키마 정의
export const itemSchema = z.object({
  code: z.string().min(1, "품목 코드를 입력해주세요."),
  name: z.string().min(1, "제품명을 입력해주세요."),
  origin: z.string().min(1, "원산지를 입력해주세요."),
});

// 품목 추가 폼 값 타입 (zod에서 추론)
export type ItemFormValues = z.infer<typeof itemSchema>;

// 품목 추가 폼 필드 타입
export type ItemField = DynamicFormField<ItemFormValues>;

// 품목 추가 폼 필드 정의
export const itemFields: ItemField[] = [
  {
    name: "code",
    label: "품목 코드",
    type: "text",
    required: true,
  },
  {
    name: "name",
    label: "제품명",
    type: "text",
    required: true,
  },
  {
    name: "origin",
    label: "원산지",
    type: "text",
    required: true,
  },
];

// 품목 추가 폼 props 타입
export interface ItemFormProps {
  onClose?: () => void;
  onSubmit: (values: ItemFormValues) => void;
  submitLabel?: string;
}

// 품목 추가 폼 컴포넌트
export default function ItemForm({
  onClose,
  onSubmit,
  submitLabel = "추가",
}: ItemFormProps) {
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (values: ItemFormValues) => {
    try {
      onSubmit(values);
      setFieldErrors({}); // 에러 초기화
      onClose?.();
    } catch (error) {
      if (error instanceof Error) {
        setFieldErrors({
          code: error.message,
        });
      } else {
        setFieldErrors({
          code: "오류가 발생했습니다.",
        });
      }
    }
  };

  return (
    <DynamicForm
      fields={itemFields}
      onSubmit={handleSubmit}
      submitLabel={submitLabel}
      zodSchema={itemSchema}
      fieldErrors={fieldErrors}
    />
  );
}
