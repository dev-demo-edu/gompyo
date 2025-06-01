import DynamicForm, { DynamicFormField } from "@/components/dynamic-form";
import { z } from "zod";
import { useState } from "react";
import { QuotationItem } from "@/services/quotation-service";

// zod 스키마 정의
export const itemSchema = z.object({
  itemName: z.string().min(1, "제품명을 입력해주세요."),
  itemOrigin: z.string().min(1, "원산지를 입력해주세요."),
  itemNameEn: z.string().min(1, "제품명(영문)을 입력해주세요."),
  itemOriginEn: z.string().min(1, "원산지(영문)을 입력해주세요."),
});

// 품목 추가 폼 값 타입 (zod에서 추론)
export type ItemFormValues = z.infer<typeof itemSchema>;

// 품목 추가 폼 필드 타입
export type ItemField = DynamicFormField<ItemFormValues>;

// 품목 추가 폼 필드 정의
export const itemFields: ItemField[] = [
  {
    name: "itemName",
    label: "제품명",
    type: "text",
    required: true,
  },
  {
    name: "itemOrigin",
    label: "원산지",
    type: "text",
    required: true,
  },
  {
    name: "itemNameEn",
    label: "제품명(영문)",
    type: "text",
    required: true,
  },
  {
    name: "itemOriginEn",
    label: "원산지(영문)",
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
          itemName: error.message,
        });
      } else {
        setFieldErrors({
          itemName: "오류가 발생했습니다.",
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

interface ItemEditFormProps extends ItemFormProps {
  selectedItem: QuotationItem;
}

export function ItemEditForm({
  onClose,
  onSubmit,
  submitLabel = "수정",
  selectedItem,
}: ItemEditFormProps) {
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // selectedItem이 없으면 빈 컴포넌트 반환
  if (!selectedItem) {
    return null;
  }

  const handleSubmit = async (values: ItemFormValues) => {
    try {
      onSubmit(values);
      setFieldErrors({}); // 에러 초기화
      onClose?.();
    } catch (error) {
      if (error instanceof Error) {
        setFieldErrors({
          itemName: error.message,
        });
      } else {
        setFieldErrors({
          itemName: "오류가 발생했습니다.",
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
      initialValues={{
        itemName: selectedItem.itemName,
        itemOrigin: selectedItem.itemOrigin,
        itemNameEn: selectedItem.itemNameEn ?? "",
        itemOriginEn: selectedItem.itemOriginEn ?? "",
      }}
      fieldErrors={fieldErrors}
    />
  );
}
