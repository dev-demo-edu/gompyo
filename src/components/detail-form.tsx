"use client";
import {
  Box,
  Paper,
  Typography,
  TextField,
  IconButton,
  Grid,
} from "@mui/material";
import { Edit, Save } from "@mui/icons-material";
import { useState } from "react";

interface DetailFormProps {
  title: string;
}

export default function DetailForm({ title }: DetailFormProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    contractNumber: "",
    contractDate: "",
    contractor: "",
    importer: "",
    departurePort: "",
    arrivalPort: "",
    etd: "",
    eta: "",
    blNumber: "",
  });

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    // TODO: API 호출하여 데이터 저장
    console.log("저장할 데이터:", formData);
    setIsEditing(false);
  };

  const handleChange =
    (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({
        ...prev,
        [field]: event.target.value,
      }));
    };

  return (
    <Paper className="w-full bg-background-paper rounded-2xl shadow-[0px_12px_24px_-4px_rgba(145,158,171,0.12)] shadow-[0px_0px_2px_0px_rgba(145,158,171,0.20)]">
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
      <Box className="self-stretch p-6 flex flex-col gap-6">
        {/* 계약 번호 */}
        <TextField
          fullWidth
          label="계약 번호"
          variant="outlined"
          placeholder="입력해주세요."
          className="bg-background-paper"
          disabled={!isEditing}
          value={formData.contractNumber}
          onChange={handleChange("contractNumber")}
          sx={{
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "rgba(145, 158, 171, 0.2)",
              },
            },
          }}
        />

        {/* 계약 일자 */}
        <TextField
          fullWidth
          label="계약 일자"
          variant="outlined"
          placeholder="입력해주세요."
          className="bg-background-paper"
          disabled={!isEditing}
          value={formData.contractDate}
          onChange={handleChange("contractDate")}
          sx={{
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "rgba(145, 158, 171, 0.2)",
              },
            },
          }}
        />

        {/* 계약자 */}
        <TextField
          fullWidth
          label="계약자"
          variant="outlined"
          placeholder="입력해주세요."
          className="bg-background-paper"
          disabled={!isEditing}
          value={formData.contractor}
          onChange={handleChange("contractor")}
          InputProps={{
            endAdornment: (
              <IconButton>
                <Edit className="text-text-secondary" />
              </IconButton>
            ),
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "rgba(145, 158, 171, 0.2)",
              },
            },
          }}
        />

        {/* 수입처 */}
        <TextField
          fullWidth
          label="수입처"
          variant="outlined"
          placeholder="입력해주세요."
          className="bg-background-paper"
          disabled={!isEditing}
          value={formData.importer}
          onChange={handleChange("importer")}
          sx={{
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "rgba(145, 158, 171, 0.2)",
              },
            },
          }}
        />

        {/* 출발항, 도착항 */}
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="출발항"
              variant="outlined"
              placeholder="입력해주세요."
              className="bg-background-paper"
              disabled={!isEditing}
              value={formData.departurePort}
              onChange={handleChange("departurePort")}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "rgba(145, 158, 171, 0.2)",
                  },
                },
              }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="도착항"
              variant="outlined"
              placeholder="입력해주세요."
              className="bg-background-paper"
              disabled={!isEditing}
              value={formData.arrivalPort}
              onChange={handleChange("arrivalPort")}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "rgba(145, 158, 171, 0.2)",
                  },
                },
              }}
            />
          </Grid>
        </Grid>

        {/* ETD, ETA */}
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="ETD"
              variant="outlined"
              placeholder="입력해주세요."
              className="bg-background-paper"
              disabled={!isEditing}
              value={formData.etd}
              onChange={handleChange("etd")}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "rgba(145, 158, 171, 0.2)",
                  },
                },
              }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="ETA"
              variant="outlined"
              placeholder="입력해주세요."
              className="bg-background-paper"
              disabled={!isEditing}
              value={formData.eta}
              onChange={handleChange("eta")}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "rgba(145, 158, 171, 0.2)",
                  },
                },
              }}
            />
          </Grid>
        </Grid>

        {/* B/L 번호 */}
        <TextField
          fullWidth
          label="B/L 번호"
          variant="outlined"
          placeholder="입력해주세요."
          className="bg-background-paper"
          disabled={!isEditing}
          value={formData.blNumber}
          onChange={handleChange("blNumber")}
          sx={{
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "rgba(145, 158, 171, 0.2)",
              },
            },
          }}
        />
      </Box>
    </Paper>
  );
}
