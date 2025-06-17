// partner-form-fields.ts
import { z } from "zod";
import { DynamicFormField } from "@/components/dynamic-form";

// Zod 스키마들
export const companyAddSchema = z.object({
  name: z
    .string()
    .min(1, "회사명을 입력해주세요.")
    .max(50, "회사명은 50자 이내로 입력해주세요.")
    .trim(),
  type: z.enum(["payment", "collection"], {
    errorMap: () => ({ message: "회사 타입을 선택해주세요." }),
  }),
});

export const yearAddSchema = z.object({
  year: z
    .string()
    .min(1, "연도를 입력해주세요.")
    .refine((val) => {
      const num = parseInt(val);
      return !isNaN(num);
    }, "올바른 숫자를 입력해주세요.")
    .refine((val) => {
      const num = parseInt(val);
      return num >= 1900 && num <= 2100;
    }, "1900~2100 사이의 연도를 입력해주세요."),
});

// 타입 추론
export type CompanyAddFormValues = z.infer<typeof companyAddSchema>;
export type YearAddFormValues = z.infer<typeof yearAddSchema>;

// 회사 추가 필드 정의
export const companyAddFields: DynamicFormField<CompanyAddFormValues>[] = [
  {
    name: "name",
    label: "회사명",
    type: "text",
    required: true,
  },
  {
    name: "type",
    label: "회사 타입",
    type: "select",
    required: true,
    options: [
      { label: "지급회사", value: "payment" },
      { label: "수금회사", value: "collection" },
    ],
  },
];

// 연도 추가 필드 정의
export const yearAddFields: DynamicFormField<YearAddFormValues>[] = [
  {
    name: "year",
    label: "연도",
    type: "text",
    required: true,
    helperText: "1900~2100 사이의 연도를 입력해주세요.",
  },
];
