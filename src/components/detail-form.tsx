"use client";
import {
  Box,
  Paper,
  Typography,
  TextField,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  SelectChangeEvent,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import { Edit, Save } from "@mui/icons-material";
import { useState, useEffect } from "react";

interface FieldConfig {
  name: string;
  label: string;
  placeholder?: string;
  gridSize?: number;
  hasEditButton?: boolean;
  type?: "text" | "select";
  options?: { value: string; label: string }[];
}

interface DetailFormProps {
  title: string;
  fields: FieldConfig[];
  data?: Record<string, string>;
  onSave?: (data: Record<string, string>) => void;
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
  const [formData, setFormData] = useState<Record<string, string>>(
    Object.entries(data).reduce(
      (acc, [key, value]) => {
        acc[key] = value?.toString() || "";
        return acc;
      },
      {} as Record<string, string>,
    ),
  );

  useEffect(() => {
    setFormData(
      Object.entries(data).reduce(
        (acc, [key, value]) => {
          acc[key] = value?.toString() || "";
          return acc;
        },
        {} as Record<string, string>,
      ),
    );
  }, [data]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    if (onSave) {
      onSave(formData);
    }
    setIsEditing(false);
  };

  const handleTextChange =
    (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = event.target.value;
      setFormData((prev) => ({
        ...prev,
        [field]: newValue,
      }));
    };

  const handleSelectChange =
    (field: string) => (event: SelectChangeEvent<string>) => {
      const newValue = event.target.value;
      setFormData((prev) => ({
        ...prev,
        [field]: newValue,
      }));
    };

  const renderField = (field: FieldConfig) => {
    if (field.type === "select" && field.options) {
      return (
        <FormControl fullWidth disabled={!isEditing}>
          <InputLabel>{field.label}</InputLabel>
          <Select
            label={field.label}
            value={formData[field.name] || ""}
            onChange={handleSelectChange(field.name)}
            disabled={!isEditing}
            sx={{
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "rgba(145, 158, 171, 0.2)",
              },
            }}
          >
            {field.options.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      );
    }

    const textFieldProps = {
      fullWidth: true,
      label: field.label,
      variant: "outlined" as const,
      placeholder: field.placeholder || "입력해주세요.",
      className: "bg-background-paper",
      disabled: !isEditing,
      value: formData[field.name] || "",
      onChange: handleTextChange(field.name),
      sx: {
        "& .MuiOutlinedInput-root": {
          "& fieldset": {
            borderColor: "rgba(145, 158, 171, 0.2)",
          },
        },
      },
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
            <IconButton onClick={handleSave} color="primary">
              <Save />
            </IconButton>
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
