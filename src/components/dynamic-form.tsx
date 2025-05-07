import React, { useState } from "react";
import {
  Box,
  Button,
  Stack,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Typography,
  IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { ZodType, ZodError, z } from "zod";

// Zod 스키마에서 타입 자동 추론
// 사용 예시: const schema = z.object({ ... }); <DynamicForm zodSchema={schema} ... />
// T = z.infer<typeof schema>로 자동 추론됨

type InferZod<T extends ZodType> = z.infer<T>;

// 필드 값 타입
type FieldValue = string | number | boolean | Array<unknown>;

// 커스텀 렌더 프롭스 타입
type CustomRenderProps<T, K extends keyof T> = {
  value: T[K];
  onChange: (value: T[K]) => void;
  error?: string;
};

// 필드 타입 정의 (array 타입의 경우 내부 필드 타입도 제네릭으로 받음)
export type DynamicFormField<T, A = T> = {
  name: keyof T & string;
  label: string;
  type:
    | "text"
    | "number"
    | "date"
    | "select"
    | "autocomplete"
    | "array"
    | "custom";
  required?: boolean;
  defaultValue?: T[keyof T];
  options?: Array<{ label: string; value: string }>; // select용
  fields?: Array<DynamicFormField<A>>; // array용 (내부 타입 A)
  render?: (props: CustomRenderProps<T, keyof T>) => React.ReactNode; // custom용
  helperText?: string;
};

export type DynamicFormStep<T> = {
  label: string;
  fields: DynamicFormField<T>[];
};

export type DynamicFormProps<Schema extends ZodType> = {
  zodSchema: Schema;
  steps?: DynamicFormStep<InferZod<Schema>>[];
  fields?: DynamicFormField<InferZod<Schema>>[];
  onSubmit: (values: InferZod<Schema>) => void;
  submitLabel?: string;
  zodSchemas?: Schema[]; // 멀티 스텝 (optional)
  onCancel?: () => void;
  fieldErrors?: Record<string, string>; // 추가: 외부에서 전달받은 필드별 에러
};

function getInitialValues<T extends Record<string, FieldValue>>(
  fields: Array<DynamicFormField<T>>,
): T {
  return fields.reduce((obj, f) => {
    let value;
    if (f.type === "array") {
      value = f.defaultValue ?? [];
    } else if (f.type === "select" && f.options && f.options.length > 0) {
      value = f.defaultValue ?? f.options[0].value;
    } else {
      value = f.defaultValue ?? "";
    }
    return {
      ...obj,
      [f.name]: value,
    };
  }, {} as T);
}

export default function DynamicForm<Schema extends ZodType>({
  zodSchema,
  steps,
  fields,
  onSubmit,
  submitLabel = "저장",
  zodSchemas,
  onCancel,
  fieldErrors = {}, // 추가
}: DynamicFormProps<Schema>) {
  type T = InferZod<Schema>;
  const isMultiStep = !!steps;
  const [stepIdx, setStepIdx] = useState(0);
  const stepFields = isMultiStep ? steps![stepIdx].fields : fields!;
  const [form, setForm] = useState<T>(
    isMultiStep
      ? steps!.reduce<T>(
          (acc, s) => ({ ...acc, ...getInitialValues(s.fields) }),
          {} as T,
        )
      : getInitialValues(fields!),
  );
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});

  // 필드 값 변경 핸들러 (타입 안전)
  const handleChange = <K extends keyof T>(name: K, value: T[K]) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // 배열 필드 추가/삭제 (타입 안전)
  const handleArrayAdd = <K extends keyof T>(field: DynamicFormField<T>) => {
    setForm((prev) => ({
      ...prev,
      [field.name]: [
        ...(Array.isArray(prev[field.name])
          ? (prev[field.name] as Array<T[K]>)
          : []),
        getInitialValues((field.fields ?? []) as Array<DynamicFormField<T[K]>>),
      ] as T[K],
    }));
  };

  const handleArrayRemove = <K extends keyof T>(
    field: DynamicFormField<T>,
    idx: number,
  ) => {
    setForm((prev) => ({
      ...prev,
      [field.name]: (Array.isArray(prev[field.name])
        ? (prev[field.name] as Array<T[K]>).filter((_, i) => i !== idx)
        : []) as T[K],
    }));
  };

  const handleArrayItemChange = <K extends keyof T, SK extends keyof T[K]>(
    field: DynamicFormField<T>,
    idx: number,
    name: SK,
    value: T[K][SK],
  ) => {
    setForm((prev) => ({
      ...prev,
      [field.name]: (Array.isArray(prev[field.name])
        ? (prev[field.name] as Array<T[K]>).map((item, i) =>
            i === idx ? { ...item, [name]: value } : item,
          )
        : []) as T[K],
    }));
  };

  // zod 에러를 errors 객체로 변환
  const zodErrorToErrors = (
    zodError: ZodError,
  ): Partial<Record<keyof T, string>> => {
    const result: Partial<Record<keyof T, string>> = {};
    zodError.errors.forEach((err) => {
      const path = err.path[0] as keyof T;
      result[path] = err.message;
    });
    return result;
  };

  // 제출
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let result;
    if (isMultiStep && zodSchemas) {
      result = zodSchemas[stepIdx].safeParse(form);
    } else if (zodSchema) {
      result = zodSchema.safeParse(form);
    } else {
      // zod 스키마가 없으면 통과
      result = { success: true, data: form };
    }
    if (result && !result.success) {
      setErrors(zodErrorToErrors(result.error!));
      return;
    }
    setErrors({});
    if (isMultiStep && stepIdx < steps!.length - 1) {
      setStepIdx((prev) => prev + 1);
    } else {
      onSubmit(form);
    }
  };

  // 필드 렌더링
  const renderField = <K extends keyof T>(
    field: DynamicFormField<T>,
    value: T[K],
    onChange: (v: T[K]) => void,
    error?: string,
    idx?: number,
  ) => {
    // 외부 에러와 내부 에러 통합
    const fieldError = fieldErrors[field.name as string] || error;

    switch (field.type) {
      case "text":
      case "number":
      case "date":
        return (
          <TextField
            key={field.name + (idx ?? "")}
            label={field.label}
            name={field.name}
            type={field.type === "number" ? "number" : field.type}
            value={value}
            onChange={(e) =>
              onChange(
                field.type === "number"
                  ? (Number(e.target.value) as T[K])
                  : (e.target.value as T[K]),
              )
            }
            fullWidth
            error={!!fieldError}
            helperText={fieldError || field.helperText}
            InputLabelProps={
              field.type === "date" ? { shrink: true } : undefined
            }
            sx={{ mb: 1 }}
          />
        );
      case "select":
        return (
          <FormControl
            fullWidth
            error={!!fieldError}
            key={field.name + (idx ?? "")}
            sx={{ mb: 1 }}
          >
            <InputLabel>{field.label}</InputLabel>
            <Select
              value={value}
              label={field.label}
              onChange={(e) => onChange(e.target.value as T[K])}
            >
              {field.options?.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
            </Select>
            {fieldError && (
              <Typography color="error" variant="caption">
                {fieldError}
              </Typography>
            )}
          </FormControl>
        );
      case "array":
        const arrayValue = value as unknown as Array<T[K]>;
        return (
          <Box key={field.name} sx={{ mb: 2 }}>
            <Box display="flex" alignItems="center" mb={1}>
              <Typography variant="subtitle1">{field.label}</Typography>
              <IconButton
                size="small"
                onClick={() => handleArrayAdd(field)}
                sx={{ ml: 1 }}
              >
                <AddIcon fontSize="small" />
              </IconButton>
            </Box>
            {(Array.isArray(arrayValue) ? arrayValue : []).map(
              (item: T[K], i: number) => (
                <Box
                  key={i}
                  sx={{
                    border: "1px solid #eee",
                    borderRadius: 1,
                    p: 2,
                    mb: 1,
                  }}
                >
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Typography variant="body2">
                      {field.label} #{i + 1}
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={() => handleArrayRemove(field, i)}
                    >
                      <RemoveIcon fontSize="small" />
                    </IconButton>
                  </Box>
                  <Stack spacing={1} mt={1}>
                    {field.fields?.map((f) =>
                      renderField(
                        f as DynamicFormField<T[K]>,
                        (item as T[K])[f.name as keyof T[K]],
                        (v) =>
                          handleArrayItemChange(
                            field,
                            i,
                            f.name as keyof T[K],
                            v,
                          ),
                        errors[`${field.name}.${i}.${f.name}`],
                        i,
                      ),
                    )}
                  </Stack>
                </Box>
              ),
            )}
            {/* {fieldError && (
              <Typography color="error" variant="caption">
                {fieldError}
              </Typography>
            )} */}
          </Box>
        );
      case "custom":
        return field.render
          ? field.render({ value, onChange, error: fieldError })
          : null;
      default:
        return null;
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {isMultiStep && (
        <Typography variant="h6" sx={{ mb: 2 }}>
          {steps![stepIdx].label}
        </Typography>
      )}
      <Stack spacing={2} sx={{ mt: 1 }}>
        {stepFields.map((field) =>
          renderField(
            field,
            form[field.name],
            (v) => handleChange(field.name, v),
            errors[field.name],
          ),
        )}
      </Stack>
      <Box
        display="flex"
        flexDirection="row"
        justifyContent="flex-end"
        gap={2}
        mt={2}
      >
        {isMultiStep && stepIdx > 0 && (
          <Button
            variant="outlined"
            color="primary"
            onClick={() => setStepIdx((prev) => prev - 1)}
          >
            이전
          </Button>
        )}
        {typeof onCancel === "function" && (
          <Button variant="outlined" color="primary" onClick={onCancel}>
            취소
          </Button>
        )}
        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{ fontWeight: 600 }}
        >
          {isMultiStep && stepIdx < steps!.length - 1 ? "다음" : submitLabel}
        </Button>
      </Box>
    </form>
  );
}
