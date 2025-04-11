"use client";
import {
  Box,
  Paper,
  Typography,
  TextField,
  IconButton,
  FormControl,
  Autocomplete,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import { Edit, Save, Close } from "@mui/icons-material";
import { useState, useEffect } from "react";
import { FieldValue, FieldValueType } from "@/constants/entire";
import { useAtom } from "jotai";
import { cancelEditAtom } from "@/states/detail";

interface FieldConfig {
  name: string;
  label: string;
  placeholder?: string;
  gridSize?: number;
  hasEditButton?: boolean;
  type?: "text" | "select" | "number" | "date";
  options?: { value: string; label: string }[];
  valueType: FieldValueType;
  disabled?: boolean;
  endAdornment?: string;
}

interface DetailFormProps {
  title: string;
  fields: FieldConfig[];
  // 필드 이름을 키로 하고, 해당하는 값 타입을 가지는 레코드
  data?: Partial<Record<string, FieldValue>>;
  onSave?: (data: Record<string, FieldValue>) => void;
  className?: string;
}

export default function DetailForm({
  title,
  fields,
  data = {},
  onSave,
  className = "",
}: DetailFormProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Record<string, string | null>>(
    Object.entries(data).reduce(
      (acc, [key, value]) => {
        acc[key] = value?.toString() ?? null;
        return acc;
      },
      {} as Record<string, string | null>,
    ),
  );
  const [, cancelEdit] = useAtom(cancelEditAtom);

  useEffect(() => {
    setFormData(
      Object.entries(data).reduce(
        (acc, [key, value]) => {
          acc[key] = value?.toString() ?? null;
          return acc;
        },
        {} as Record<string, string | null>,
      ),
    );
  }, [data]);

  const handleEdit = () => {
    setIsEditing(true);
  };

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
        return value;
    }
  };

  const handleSave = () => {
    if (onSave) {
      // 각 필드의 타입에 맞게 데이터 변환
      const convertedData = fields.reduce(
        (acc, field) => {
          const value = formData[field.name];
          acc[field.name] = convertValue(value, field.valueType);
          return acc;
        },
        {} as Record<string, FieldValue>,
      );

      onSave(convertedData);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    cancelEdit();
    setIsEditing(false);
  };

  const handleTextChange =
    (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = event.target.value || null;
      setFormData((prev) => ({
        ...prev,
        [field]: newValue,
      }));
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
              setFormData((prev) => ({
                ...prev,
                [field.name]:
                  typeof newValue === "string"
                    ? newValue
                    : newValue?.value || null,
              }));
            }}
            onInputChange={(_, newInputValue) => {
              setFormData((prev) => ({
                ...prev,
                [field.name]: newInputValue,
              }));
            }}
            disabled={!isEditing || field.disabled}
            renderInput={(params) => (
              <TextField
                {...params}
                label={field.label}
                sx={{
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "rgba(145, 158, 171, 0.2)",
                  },
                }}
              />
            )}
            renderOption={(props, option) => (
              <li {...props}>
                {typeof option === "string" ? option : option.label}
              </li>
            )}
          />
        </FormControl>
      );
    }

    const textFieldProps = {
      fullWidth: true,
      label: field.label,
      variant: "outlined" as const,
      placeholder: field.placeholder || "입력해주세요.",
      className: "bg-background-paper",
      disabled: !isEditing || field.disabled,
      value: formData[field.name] ?? "",
      type: field.type,
      onChange: handleTextChange(field.name),
      sx: {
        "& .MuiOutlinedInput-root": {
          "& fieldset": {
            borderColor: "rgba(145, 158, 171, 0.2)",
          },
        },
      },
      InputLabelProps: field.type === "date" ? { shrink: true } : undefined,
    };
    return <TextField {...textFieldProps} />;
  };

  return (
    <Paper
      className={`bg-background-paper rounded-2xl shadow-[0px_12px_24px_-4px_rgba(145,158,171,0.12)] shadow-[0px_0px_2px_0px_rgba(145,158,171,0.20)] inline-flex flex-col justify-start items-end ${className}`}
    >
      {/* 헤더 */}
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

      {/* 폼 컨텐츠 */}
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
