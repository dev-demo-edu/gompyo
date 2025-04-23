import React from "react";
import { format, isToday, isYesterday, parseISO } from "date-fns";
import { ko } from "date-fns/locale";
import { Box, Typography, Divider } from "@mui/material";

interface DateGroupProps {
  date: string;
}

export function DateGroup({ date }: DateGroupProps) {
  const dateObj = parseISO(date);

  let displayDate = format(dateObj, "yyyy년 MM월 dd일", { locale: ko });

  if (isToday(dateObj)) {
    displayDate = "오늘";
  } else if (isYesterday(dateObj)) {
    displayDate = "어제";
  }

  return (
    <Box sx={{ display: "flex", alignItems: "center", py: 1.5 }}>
      <Divider sx={{ flexGrow: 1 }} />
      <Typography
        variant="body2"
        sx={{
          px: 2,
          fontWeight: 500,
          color: "text.secondary",
        }}
      >
        {displayDate}
      </Typography>
      <Divider sx={{ flexGrow: 1 }} />
    </Box>
  );
}
