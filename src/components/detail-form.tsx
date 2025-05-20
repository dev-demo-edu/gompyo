"use client";
import {
  Box,
  Paper,
  Typography,
  TextField,
  IconButton,
  FormControl,
  Autocomplete,
  InputAdornment,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import { Edit, Save, Close } from "@mui/icons-material";
import { useState, useEffect } from "react";
import { z } from "zod";
import {
  FieldValue,
  FieldValueType,
  formatNumberWithCommas,
  formatKRWAmount,
} from "@/constants/entire";
import { useAtom } from "jotai";
import { cancelEditAtom, cargoDetailAtom } from "@/states/detail";
import { addChangeLog } from "@/actions/detail-view/history";
import { userAtom } from "@/states/user";

interface FieldConfig {
  name: string;
  label: string;
  placeholder?: string;
  gridSize?: number;
  hasEditButton?: boolean;
  type?: "text" | "select" | "number" | "date" | "textarea";
  options?: { value: string; label: string }[];
  valueType: FieldValueType;
  disabled?: boolean;
  endAdornment?: string;
  removeDecimal?: boolean; // 👈 간단하게 소수점 제거 여부만
}

interface DetailFormProps {
  title: string;
  fields: FieldConfig[];
  data?: Partial<Record<string, FieldValue>>;
  onSave?: (data: Record<string, FieldValue>) => void;
  onFieldChange?: (fieldName: string, value: FieldValueType) => void;
  className?: string;
}

export default function DetailForm({
  title,
  fields,
  data = {},
  onSave,
  onFieldChange,
  className = "",
}: DetailFormProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Record<string, string | null>>({});
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [, cancelEdit] = useAtom(cancelEditAtom);
  const [currentUser] = useAtom(userAtom);
  const [cargoData] = useAtom(cargoDetailAtom);

  useEffect(() => {
    const initialData = Object.entries(data).reduce(
      (acc, [key, value]) => {
        acc[key] = value?.toString() ?? null;
        return acc;
      },
      {} as Record<string, string | null>,
    );
    setFormData(initialData);
  }, [data]);

  const handleEdit = () => setIsEditing(true);

  const convertValue = (
    value: string | null,
    valueType: FieldValueType,
  ): FieldValue => {
    if (value === null) return null;
    switch (valueType) {
      case "number":
        return value === "" ? null : Number(value);
      case "date":
        return value === "" ? null : value;
      case "string":
      default:
        return value;
    }
  };

  // Zod 스키마 동적 생성
  const generateZodSchemaFromFields = (fields: FieldConfig[]) => {
    const requiredFieldNames = [
      "계약 번호",
      "계약 일자",
      "공급 업체",
      "수입처",
      "품목",
      "품종",
      "포장단위",
    ];

    const shape: Record<string, z.ZodTypeAny> = {};
    fields.forEach((field) => {
      let schema: z.ZodTypeAny;

      switch (field.valueType) {
        case "number":
          schema = z.string({
            message: "숫자를 입력해주세요",
          });
          break;
        case "date":
          schema = z.coerce
            .string()
            .min(1, "날짜를 선택해주세요.")
            .default(new Date().toISOString().split("T")[0]);
          break;
        case "string":
        default:
          schema = z.string({
            message: "값을 입력해주세요",
          });
          break;
      }

      if (!requiredFieldNames.includes(field.label)) {
        schema = schema.optional();
      }
      shape[field.name] = schema;
    });
    return z.object(shape);
  };

  // 변경사항 추적 함수
  const trackChanges = async (
    oldData: Record<string, FieldValue>,
    newData: Record<string, FieldValue>,
  ) => {
    const changes: Array<{ field: string; from: string; to: string }> = [];

    fields.forEach((field) => {
      const oldValue = oldData[field.name];
      const newValue = newData[field.name];

      if (oldValue !== newValue?.toString()) {
        changes.push({
          field: field.label,
          from: oldValue?.toString() ?? "",
          to: newValue?.toString() ?? "",
        });
      }
    });

    // 변경사항이 있는 경우에만 히스토리 기록
    if (changes.length > 0) {
      console.log("changes", changes);
      console.log("currentUser", currentUser);
      await addChangeLog({
        targetId: cargoData?.cargo.id || "",
        user: currentUser?.name || "",
        changes,
      });
    }
  };

  const handleSave = async () => {
    const schema = generateZodSchemaFromFields(fields);
    const parsed = schema.safeParse(formData);

    if (!parsed.success) {
      const errors: Record<string, string> = {};
      parsed.error.errors.forEach((err) => {
        if (err.path[0]) {
          errors[err.path[0] as string] = err.message;
        }
      });
      setFormErrors(errors);
      return;
    }

    setFormErrors({}); // 유효성 오류 초기화

    if (onSave) {
      const convertedData = fields.reduce(
        (acc, field) => {
          const value = formData[field.name];
          acc[field.name] = convertValue(value, field.valueType);
          return acc;
        },
        {} as Record<string, FieldValue>,
      );
      const oldData = Object.entries(data).reduce(
        (acc, [key, value]) => {
          acc[key] = value?.toString() ?? null;
          return acc;
        },
        {} as Record<string, string | null>,
      );

      // 변경사항 추적
      await trackChanges(oldData, convertedData);

      onSave(convertedData);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    const initialData = Object.entries(data).reduce(
      (acc, [key, value]) => {
        acc[key] = value?.toString() ?? null;
        return acc;
      },
      {} as Record<string, string | null>,
    );
    setFormData(initialData);
    setFormErrors({});
    setIsEditing(false);
    cancelEdit();
  };

  const handleTextChange =
    (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
      let newValue = event.target.value || null;

      // 숫자 필드의 경우 콤마 제거
      const fieldConfig = fields.find((f) => f.name === field);
      if (fieldConfig?.valueType === "number" && newValue) {
        newValue = newValue.replace(/[^0-9.-]/g, "");
      }

      setFormData((prev) => ({
        ...prev,
        [field]: newValue,
      }));
      if (onFieldChange) {
        onFieldChange(field, newValue as FieldValueType);
      }
    };

  const renderField = (field: FieldConfig) => {
    if (field.type === "select" && field.options) {
      return (
        <FormControl fullWidth disabled={!isEditing || field.disabled}>
          <Autocomplete
            freeSolo
            options={field.options}
            getOptionLabel={(option) =>
              typeof option === "string" ? option : option.label
            }
            value={
              field.options.find((opt) => opt.value === formData[field.name]) ||
              formData[field.name] ||
              null
            }
            onChange={(_, newValue) => {
              const value =
                typeof newValue === "string"
                  ? newValue
                  : newValue?.value || null;
              setFormData((prev) => ({
                ...prev,
                [field.name]: value,
              }));
              if (onFieldChange) {
                onFieldChange(field.name, value as FieldValueType);
              }
            }}
            onInputChange={(_, newInputValue) => {
              setFormData((prev) => ({
                ...prev,
                [field.name]: newInputValue,
              }));
              if (onFieldChange) {
                onFieldChange(field.name, newInputValue as FieldValueType);
              }
            }}
            disabled={!isEditing || field.disabled}
            renderInput={(params) => (
              <TextField
                {...params}
                label={field.label}
                error={!!formErrors[field.name]}
                helperText={formErrors[field.name]}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "rgba(145, 158, 171, 0.2)",
                    },
                    "&.Mui-disabled": {
                      backgroundColor: "rgba(0, 0, 0, 0.02)",
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "rgba(0, 0, 0, 0.3)",
                        borderWidth: "1px",
                      },
                      "& .MuiInputBase-input": {
                        color: "rgba(0, 0, 0, 0.6)",
                        WebkitTextFillColor: "rgba(0, 0, 0, 0.6)",
                      },
                    },
                  },
                }}
              />
            )}
            renderOption={(props, option) => {
              const { key, ...rest } =
                props as React.HTMLAttributes<HTMLLIElement> & {
                  key: React.Key;
                };
              return (
                <li key={key} {...rest}>
                  {typeof option === "string" ? option : option.label}
                </li>
              );
            }}
          />
        </FormControl>
      );
    }

    // 표시할 값 계산 (편집 모드가 아닐 때만 포맷팅 적용)
    let displayValue = formData[field.name] ?? "";

    if (!isEditing && field.valueType === "number" && displayValue) {
      if (field.removeDecimal) {
        // 원화 금액: 소수점 제거 + 콤마
        displayValue = formatKRWAmount(displayValue);
      } else {
        // 일반 숫자: 소수점 유지 + 콤마
        displayValue = formatNumberWithCommas(displayValue);
      }
    }

    const textFieldProps = {
      fullWidth: true,
      label: field.label,
      variant: "outlined" as const,
      placeholder: field.placeholder || "입력해주세요.",
      className: "bg-background-paper",
      disabled: !isEditing || field.disabled,
      value: displayValue,
      type: field.type === "textarea" ? undefined : field.type,
      onChange: handleTextChange(field.name),
      error: !!formErrors[field.name],
      helperText: formErrors[field.name],
      sx: {
        "& .MuiOutlinedInput-root": {
          "& fieldset": {
            borderColor: "rgba(145, 158, 171, 0.2)",
          },
          "&.Mui-disabled": {
            backgroundColor: "rgba(0, 0, 0, 0.02)",
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "rgba(0, 0, 0, 0.3)",
              borderWidth: "1px",
            },
            "& .MuiInputBase-input": {
              color: "rgba(0, 0, 0, 0.6)",
              WebkitTextFillColor: "rgba(0, 0, 0, 0.6)",
            },
          },
        },
      },
      InputLabelProps: field.type === "date" ? { shrink: true } : undefined,
      InputProps: field.endAdornment
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
        : undefined,
      multiline: field.type === "textarea",
      rows: field.type === "textarea" ? 4 : undefined,
    };

    return <TextField {...textFieldProps} />;
  };

  return (
    <Paper
      className={`bg-background-paper rounded-2xl shadow-[0px_12px_24px_-4px_rgba(145,158,171,0.12)] shadow-[0px_0px_2px_0px_rgba(145,158,171,0.20)] inline-flex flex-col justify-start items-end ${className}`}
    >
      <Box className="self-stretch pl-6 pr-4 py-6 border-b border-[rgba(145,158,171,0.2)] flex justify-between items-center">
        <Typography variant="h6" className="text-text-primary font-semibold">
          {title}
        </Typography>
        <Box>
          {isEditing ? (
            <>
              <IconButton onClick={handleSave} color="primary">
                <Save />
              </IconButton>
              <IconButton onClick={handleCancel} color="primary">
                <Close />
              </IconButton>
            </>
          ) : (
            <IconButton onClick={handleEdit}>
              <Edit className="text-action-disabled opacity-80" />
            </IconButton>
          )}
        </Box>
      </Box>

      <Box className="self-stretch p-6">
        <Grid container spacing={3}>
          {fields.map((field) => (
            <Grid item xs={field.gridSize || 12} key={field.name}>
              {renderField(field)}
            </Grid>
          ))}
        </Grid>
      </Box>
    </Paper>
  );
}
