import DynamicForm, { DynamicFormField } from "@/components/dynamic-form";
import { z } from "zod";
import { useSetAtom } from "jotai";
import { useState } from "react";
import { linkRefreshAtom } from "@/states/link";
import { addLink } from "@/actions/info/link-actions";

// zod 스키마 정의
export const linkSchema = z.object({
  linkName: z.string().min(1, "링크명을 입력해주세요."),
  linkUrl: z
    .string()
    .min(1, "링크URL을 입력해주세요.")
    .url("유효한 URL 형식이어야 합니다.")
    .refine((url) => url.startsWith("http://") || url.startsWith("https://"), {
      message: "URL은 http:// 또는 https://로 시작해야 합니다.",
    }),
});

// 링크 추가 폼 값 타입 (zod에서 추론)
export type LinkFormValues = z.infer<typeof linkSchema>;

// 링크 추가 폼 필드 타입
export type LinkField = DynamicFormField<LinkFormValues>;

// 링크 추가 폼 props 타입
export interface LinkFormProps {
  onClose?: () => void;
  submitLabel?: string;
}

// 링크 추가 폼 필드 정의 (필요에 따라 수정)
export const linkFields: LinkField[] = [
  {
    name: "linkName",
    label: "링크명",
    type: "text",
    required: true,
  },
  {
    name: "linkUrl",
    label: "링크URL",
    type: "text",
    required: true,
  },
];

// 계좌 추가 폼 컴포넌트
export default function LinkForm({
  onClose,
  submitLabel = "저장",
}: LinkFormProps) {
  const setRefresh = useSetAtom(linkRefreshAtom);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (values: LinkFormValues) => {
    try {
      //TODO: addLink 로직 수정에 따른 수정 필요
      await addLink(values.linkName, values.linkUrl, 0);
      setRefresh((prev) => prev + 1);
      setFieldErrors({}); // 에러 초기화
      onClose?.();
    } catch (error) {
      if (error instanceof Error) {
        setFieldErrors({
          linkName: error.message,
        });
      } else {
        setFieldErrors({
          links: "오류가 발생했습니다.",
        });
      }
    }
  };

  return (
    <DynamicForm
      fields={linkFields}
      onSubmit={handleSubmit}
      submitLabel={submitLabel}
      zodSchema={linkSchema}
      fieldErrors={fieldErrors}
    />
  );
}
