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
  InputAdornment,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { ZodType, ZodError, ZodTypeDef } from "zod";

// 필드 값 타입
export type FieldValue = string | number | boolean | Array<unknown>;

// 커스텀 렌더 프롭스 타입
type CustomRenderProps<TInput, K extends keyof TInput> = {
  value: TInput[K];
  onChange: (value: TInput[K]) => void;
  error?: string;
};

// 필드 타입 정의 (array 타입의 경우 내부 필드 타입도 제네릭으로 받음)
export type DynamicFormField<
  TInput extends Record<string, FieldValue>,
  AInput extends Record<string, FieldValue> = TInput,
> = {
  name: keyof TInput & string;
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
  defaultValue?: TInput[keyof TInput];
  options?: Array<{ label: string; value: string }>; // select용
  fields?: Array<DynamicFormField<AInput>>; // array용 (내부 타입 A)
  render?: (props: CustomRenderProps<TInput, keyof TInput>) => React.ReactNode; // custom용
  helperText?: string;
  endAdornment?: string;
};

export type DynamicFormStep<TInput extends Record<string, FieldValue>> = {
  label: string;
  fields: DynamicFormField<TInput>[];
};

export type DynamicFormProps<
  TInput extends Record<string, FieldValue>,
  TOutput,
> = {
  zodSchema: ZodType<TOutput, ZodTypeDef, TInput>;
  steps?: DynamicFormStep<TInput>[];
  fields?: DynamicFormField<TInput>[];
  onSubmit: (values: TOutput) => Promise<void>;
  submitLabel?: string;
  zodSchemas?: ZodType<TOutput, ZodTypeDef, TInput>[]; // 멀티 스텝 (optional)
  onCancel?: () => void;
  fieldErrors?: Record<string, string>; // 추가: 외부에서 전달받은 필드별 에러
  initialValues?: Partial<TInput>; // 추가: 외부에서 전달받는 초기값
};

function getInitialValues<TInput extends Record<string, FieldValue>>(
  fields: Array<DynamicFormField<TInput>>,
): TInput {
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
  }, {} as TInput);
}

// 배열 필드 내부 항목 렌더링 함수 분리
function renderArrayFieldItem<AInput extends Record<string, FieldValue>>({
  field,
  item,
  onChange,
  errors,
}: {
  field: DynamicFormField<AInput, AInput>;
  item: AInput;
  onChange: (name: keyof AInput, value: AInput[keyof AInput]) => void;
  errors: Partial<Record<keyof AInput, string>>;
}) {
  return (
    <Stack spacing={1} mt={1}>
      {field.fields?.map((f) => {
        const value = item[f.name as keyof AInput];
        return (
          <React.Fragment key={f.name}>
            {(() => {
              switch (f.type) {
                case "text":
                case "number":
                case "date":
                  return (
                    <TextField
                      label={f.label}
                      name={f.name}
                      type={f.type === "number" ? "number" : f.type}
                      value={value}
                      onChange={(e) =>
                        onChange(
                          f.name as keyof AInput,
                          f.type === "number"
                            ? (Number(e.target.value) as AInput[keyof AInput])
                            : (e.target.value as AInput[keyof AInput]),
                        )
                      }
                      fullWidth
                      error={!!errors[f.name]}
                      helperText={errors[f.name] || f.helperText}
                      InputLabelProps={
                        f.type === "date" ? { shrink: true } : undefined
                      }
                      InputProps={
                        f.endAdornment
                          ? {
                              endAdornment: (
                                <InputAdornment
                                  sx={{
                                    color: "inherit",
                                    "& .MuiTypography-root": {
                                      color: "inherit",
                                    },
                                  }}
                                  position="end"
                                >
                                  {f.endAdornment}
                                </InputAdornment>
                              ),
                            }
                          : undefined
                      }
                      sx={{ mb: 1 }}
                    />
                  );
                case "select":
                  return (
                    <FormControl
                      fullWidth
                      error={!!errors[f.name]}
                      sx={{ mb: 1 }}
                    >
                      <InputLabel>{f.label}</InputLabel>
                      <Select
                        value={value}
                        label={f.label}
                        onChange={(e) =>
                          onChange(
                            f.name as keyof AInput,
                            e.target.value as AInput[keyof AInput],
                          )
                        }
                      >
                        {f.options?.map((opt) => (
                          <MenuItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </MenuItem>
                        ))}
                      </Select>
                      {errors[f.name] && (
                        <Typography color="error" variant="caption">
                          {errors[f.name]}
                        </Typography>
                      )}
                    </FormControl>
                  );
                case "custom":
                  return f.render
                    ? f.render({
                        value,
                        onChange: (v) =>
                          onChange(
                            f.name as keyof AInput,
                            v as AInput[keyof AInput],
                          ),
                        error: errors[f.name],
                      })
                    : null;
                default:
                  return null;
              }
            })()}
          </React.Fragment>
        );
      })}
    </Stack>
  );
}

export default function DynamicForm<
  TInput extends Record<string, FieldValue>,
  TOutput,
>({
  zodSchema,
  steps,
  fields,
  onSubmit,
  submitLabel = "저장",
  zodSchemas,
  onCancel,
  fieldErrors = {},
  initialValues = {},
}: DynamicFormProps<TInput, TOutput>) {
  const isMultiStep = !!steps;
  const [stepIdx, setStepIdx] = useState(0);
  const stepFields = isMultiStep ? steps![stepIdx].fields : fields!;
  const [form, setForm] = useState<TInput>(
    isMultiStep
      ? {
          ...steps!.reduce<TInput>(
            (acc, s) => ({ ...acc, ...getInitialValues(s.fields) }),
            {} as TInput,
          ),
          ...initialValues,
        }
      : {
          ...getInitialValues(fields!),
          ...initialValues,
        },
  );
  const [errors, setErrors] = useState<Partial<Record<keyof TInput, string>>>(
    {},
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 필드 값 변경 핸들러 (타입 안전)
  const handleChange = <K extends keyof TInput>(name: K, value: TInput[K]) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // 배열 필드 추가/삭제 (타입 안전)
  const handleArrayAdd = <
    K extends keyof TInput,
    AInput extends Record<string, FieldValue> = TInput[K] &
      Record<string, FieldValue>,
  >(
    field: DynamicFormField<TInput, AInput>,
  ) => {
    setForm((prev) => ({
      ...prev,
      [field.name]: [
        ...(Array.isArray(prev[field.name])
          ? (prev[field.name] as AInput[])
          : []),
        getInitialValues(field.fields as Array<DynamicFormField<AInput>>),
      ],
    }));
  };

  const handleArrayRemove = <
    K extends keyof TInput,
    AInput extends Record<string, FieldValue> = TInput[K] &
      Record<string, FieldValue>,
  >(
    field: DynamicFormField<TInput, AInput>,
    idx: number,
  ) => {
    setForm((prev) => ({
      ...prev,
      [field.name]: Array.isArray(prev[field.name])
        ? (prev[field.name] as AInput[]).filter((_, i) => i !== idx)
        : [],
    }));
  };

  const handleArrayItemChange = <AInput extends Record<string, FieldValue>>(
    field: DynamicFormField<AInput, AInput>,
    idx: number,
    name: keyof AInput,
    value: AInput[keyof AInput],
  ) => {
    setForm((prev) => ({
      ...prev,
      [field.name]: Array.isArray(prev[field.name])
        ? (prev[field.name] as AInput[]).map((item, i) =>
            i === idx ? { ...item, [name]: value } : item,
          )
        : [],
    }));
  };

  // zod 에러를 errors 객체로 변환
  const zodErrorToErrors = (
    zodError: ZodError,
  ): Partial<Record<keyof TInput, string>> => {
    const result: Partial<Record<keyof TInput, string>> = {};
    zodError.errors.forEach((err) => {
      const path = err.path[0] as keyof TInput;
      result[path] = err.message;
    });
    return result;
  };

  // 제출
  const handleSubmit = async (e: React.FormEvent) => {
    if (isSubmitting) return;
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
    setIsSubmitting(true);
    try {
      if (isMultiStep && stepIdx < steps!.length - 1) {
        setStepIdx((prev) => prev + 1);
      } else {
        await onSubmit(form as unknown as TOutput);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // 필드 렌더링
  const renderField = <
    K extends keyof TInput,
    AInput extends Record<string, FieldValue> = TInput[K] &
      Record<string, FieldValue>,
  >(
    field: DynamicFormField<TInput, AInput>,
    value: TInput[K],
    onChange: (v: TInput[K]) => void,
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
                  ? (Number(e.target.value) as TInput[K])
                  : (e.target.value as TInput[K]),
              )
            }
            fullWidth
            error={!!fieldError}
            helperText={fieldError || field.helperText}
            InputLabelProps={
              field.type === "date" ? { shrink: true } : undefined
            }
            InputProps={
              field.endAdornment
                ? {
                    endAdornment: (
                      <InputAdornment
                        sx={{
                          color: "inherit",
                          "& .MuiTypography-root": {
                            color: "inherit",
                          },
                        }}
                        position="end"
                      >
                        {field.endAdornment}
                      </InputAdornment>
                    ),
                  }
                : undefined
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
              onChange={(e) => onChange(e.target.value as TInput[K])}
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
        const arrayValue = value as AInput[];
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
            {(Array.isArray(arrayValue) ? arrayValue : []).map((item, i) => (
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
                {renderArrayFieldItem<AInput>({
                  field: field as unknown as DynamicFormField<AInput, AInput>,
                  item: item as AInput,
                  onChange: (name, v) =>
                    handleArrayItemChange(
                      field as unknown as DynamicFormField<AInput, AInput>,
                      i,
                      name,
                      v,
                    ),
                  errors: {}, // 배열 내부의 에러 처리는 필요시 확장 가능
                })}
              </Box>
            ))}
          </Box>
        );
      case "custom":
        return field.render
          ? field.render({
              value,
              onChange: onChange as (value: TInput[keyof TInput]) => void,
              error: fieldError,
            })
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
          disabled={isSubmitting}
        >
          {isMultiStep && stepIdx < steps!.length - 1 ? "다음" : submitLabel}
        </Button>
      </Box>
    </form>
  );
}
