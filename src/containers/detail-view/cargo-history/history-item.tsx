import React from "react";
import { format, parseISO } from "date-fns";
import { ko } from "date-fns/locale";
import {
  ChangeHistoryItem,
  HistoryItem,
  StatusHistoryItem,
  MultiChangeHistoryItem,
} from "./types";
import { Card, Typography, Box, Chip } from "@mui/material";
import { CalendarToday, FiberManualRecord } from "@mui/icons-material";

interface HistoryItemProps {
  item: HistoryItem;
  onClick?: (item: HistoryItem) => void;
}

export function HistoryItemCard({ item, onClick }: HistoryItemProps) {
  const formattedDate = format(parseISO(item.created_at), "yyyy.MM.dd HH:mm", {
    locale: ko,
  });

  const handleClick = () => {
    if (onClick) onClick(item);
  };

  const bgColor =
    item.type === "status"
      ? "#e8f5e9"
      : item.type === "change"
        ? "#fff8e1"
        : "#e3f2fd";
  const iconBgColor =
    item.type === "status"
      ? "#c8e6c9"
      : item.type === "change"
        ? "#ffecb3"
        : "#bbdefb";
  const iconColor =
    item.type === "status"
      ? "#43a047"
      : item.type === "change"
        ? "#f57c00"
        : "#1976d2";

  return (
    <Card
      elevation={0}
      sx={{
        position: "relative",
        display: "flex",
        alignItems: "flex-start",
        padding: 2,
        paddingTop: { xs: 2.5, sm: 2 },
        paddingLeft: { xs: 3, sm: 4.5 },
        borderRadius: 2,
        border: "1px solid #e0e0e0",
        backgroundColor: bgColor,
        cursor: "pointer",
        transition: "all 0.2s",
        "&:hover": {
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        },
      }}
      onClick={handleClick}
    >
      <Box
        sx={{
          position: "absolute",
          left: { xs: 12, sm: 16 },
          top: { xs: 16, sm: 18 },
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: 28,
            height: 28,
            borderRadius: "50%",
            backgroundColor: iconBgColor,
            color: iconColor,
            boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
          }}
        >
          <FiberManualRecord sx={{ width: 18, height: 18 }} />
        </Box>
      </Box>

      <Box
        sx={{
          flexGrow: 1,
          minWidth: 0,
          paddingLeft: { xs: 1.5, sm: 2 },
        }}
      >
        {item.type === "change" ? (
          <ChangeHistoryContent item={item as ChangeHistoryItem} />
        ) : item.type === "status" ? (
          <StatusHistoryContent item={item as StatusHistoryItem} />
        ) : (
          <MultiChangeHistoryContent item={item as MultiChangeHistoryItem} />
        )}

        <Box
          sx={{
            mt: 1,
            display: "flex",
            alignItems: "center",
            fontSize: "0.75rem",
            color: "text.secondary",
          }}
        >
          <CalendarToday sx={{ mr: 0.5, width: 12, height: 12 }} />
          <Typography variant="caption">{formattedDate}</Typography>
        </Box>
      </Box>
    </Card>
  );
}

function ChangeHistoryContent({ item }: { item: ChangeHistoryItem }) {
  return (
    <Typography variant="body2" sx={{ lineHeight: 1.5 }}>
      <Typography component="span" sx={{ fontWeight: 500 }}>
        {item.user}
      </Typography>
      <Typography component="span" sx={{ color: "text.secondary" }}>
        {" "}
        님이{" "}
      </Typography>
      <Typography component="span" sx={{ fontWeight: 500 }}>
        {item.field}
      </Typography>
      <Typography component="span" sx={{ color: "text.secondary" }}>
        을(를){" "}
      </Typography>
      <Typography
        component="span"
        sx={{
          fontWeight: 500,
          textDecoration: "line-through",
          color: "grey.500",
        }}
      >
        {item.from}
      </Typography>
      <Typography component="span" sx={{ color: "text.secondary" }}>
        {" "}
        →{" "}
      </Typography>
      <Typography component="span" sx={{ fontWeight: 500 }}>
        {item.to}
      </Typography>
      <Typography component="span" sx={{ color: "text.secondary" }}>
        으로 변경
      </Typography>
    </Typography>
  );
}

function MultiChangeHistoryContent({ item }: { item: MultiChangeHistoryItem }) {
  return (
    <>
      <Typography variant="body2" sx={{ lineHeight: 1.5, mb: 0.5 }}>
        <Typography component="span" sx={{ fontWeight: 500 }}>
          {item.user}
        </Typography>
        <Typography component="span" sx={{ color: "text.secondary" }}>
          {" "}
          님이{" "}
        </Typography>
        <Typography component="span" sx={{ fontWeight: 500 }}>
          {item.changes.length}개 항목
        </Typography>
        <Typography component="span" sx={{ color: "text.secondary" }}>
          을 동시에 변경
        </Typography>
      </Typography>

      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mt: 0.5 }}>
        {item.changes.map((change, index) => (
          <Chip
            key={index}
            label={change.field}
            size="small"
            variant="outlined"
            sx={{
              fontSize: "0.7rem",
              height: 20,
              backgroundColor: "rgba(25, 118, 210, 0.08)",
              borderColor: "rgba(25, 118, 210, 0.3)",
            }}
          />
        ))}
      </Box>
    </>
  );
}

function StatusHistoryContent({ item }: { item: StatusHistoryItem }) {
  return (
    <Typography variant="body2" sx={{ lineHeight: 1.5 }}>
      <Typography component="span" sx={{ color: "text.secondary" }}>
        화물 상태가{" "}
      </Typography>
      <Typography component="span" sx={{ fontWeight: 500 }}>
        &apos;{item.status}&apos;
      </Typography>
      <Typography component="span" sx={{ color: "text.secondary" }}>
        로 변경됨
      </Typography>
      {item.user !== "시스템 처리" && (
        <>
          <Typography component="span" sx={{ color: "text.secondary" }}>
            {" "}
            (
          </Typography>
          <Typography component="span" sx={{ fontWeight: 500 }}>
            {item.user}
          </Typography>
          <Typography component="span" sx={{ color: "text.secondary" }}>
            {" "}
            님)
          </Typography>
        </>
      )}
    </Typography>
  );
}
