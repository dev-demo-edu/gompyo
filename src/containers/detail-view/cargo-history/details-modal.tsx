import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  Divider,
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { format, parseISO } from "date-fns";
import { ko } from "date-fns/locale";
import {
  HistoryItem,
  ChangeHistoryItem,
  StatusHistoryItem,
  MultiChangeHistoryItem,
} from "./types";

interface DetailsModalProps {
  item: HistoryItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DetailsModal({ item, open, onOpenChange }: DetailsModalProps) {
  if (!item) return null;

  const formattedDate = format(
    parseISO(item.created_at),
    "yyyy년 MM월 dd일 HH시 mm분",
    { locale: ko },
  );
  const isChangeType = item.type === "change";
  const isMultiChangeType = item.type === "multi-change";

  const handleClose = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {isChangeType
          ? "변경 이력 상세"
          : isMultiChangeType
            ? "다중 변경 이력 상세"
            : "상태 변경 상세"}
      </DialogTitle>
      <DialogContent>
        <DialogContentText style={{ marginBottom: "16px" }}>
          {formattedDate}에 기록된 이력입니다.
        </DialogContentText>

        <div style={{ padding: "16px 0" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 2fr",
              gap: "8px",
              marginBottom: "8px",
            }}
          >
            <span style={{ color: "#6c757d" }}>작업자</span>
            <span style={{ fontWeight: 500 }}>{item.user}</span>
          </div>

          {isChangeType && (
            <>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 2fr",
                  gap: "8px",
                  marginBottom: "8px",
                }}
              >
                <span style={{ color: "#6c757d" }}>변경 필드</span>
                <span style={{ fontWeight: 500 }}>
                  {(item as ChangeHistoryItem).field}
                </span>
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 2fr",
                  gap: "8px",
                  marginBottom: "8px",
                }}
              >
                <span style={{ color: "#6c757d" }}>변경 전</span>
                <span style={{ fontWeight: 500, color: "#dc3545" }}>
                  {(item as ChangeHistoryItem).from}
                </span>
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 2fr",
                  gap: "8px",
                  marginBottom: "8px",
                }}
              >
                <span style={{ color: "#6c757d" }}>변경 후</span>
                <span style={{ fontWeight: 500, color: "#198754" }}>
                  {(item as ChangeHistoryItem).to}
                </span>
              </div>
            </>
          )}

          {!isChangeType && !isMultiChangeType && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 2fr",
                gap: "8px",
                marginBottom: "8px",
              }}
            >
              <span style={{ color: "#6c757d" }}>변경된 상태</span>
              <span style={{ fontWeight: 500 }}>
                {(item as StatusHistoryItem).status}
              </span>
            </div>
          )}

          {isMultiChangeType && (
            <>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 2fr",
                  gap: "8px",
                  marginBottom: "8px",
                }}
              >
                <span style={{ color: "#6c757d" }}>변경된 항목 수</span>
                <span style={{ fontWeight: 500 }}>
                  {(item as MultiChangeHistoryItem).changes.length}개
                </span>
              </div>

              <Box sx={{ mt: 2, mb: 1 }}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 1 }}
                >
                  변경 상세 내역
                </Typography>
                <List disablePadding>
                  {(item as MultiChangeHistoryItem).changes.map(
                    (change, index) => (
                      <ListItem
                        key={index}
                        sx={{
                          py: 1,
                          px: 2,
                          mb: 1,
                          backgroundColor: "rgba(0, 0, 0, 0.02)",
                          borderRadius: 1,
                        }}
                      >
                        <ListItemText
                          primary={
                            <Typography variant="body2" fontWeight={500}>
                              {change.field}
                            </Typography>
                          }
                          secondary={
                            <Box sx={{ mt: 0.5 }}>
                              <Typography
                                variant="body2"
                                component="span"
                                sx={{
                                  display: "block",
                                  color: "error.main",
                                  textDecoration: "line-through",
                                }}
                              >
                                {change.from}
                              </Typography>
                              <Typography
                                variant="body2"
                                component="span"
                                sx={{
                                  display: "block",
                                  color: "success.main",
                                }}
                              >
                                {change.to}
                              </Typography>
                            </Box>
                          }
                        />
                      </ListItem>
                    ),
                  )}
                </List>
              </Box>
            </>
          )}

          <Divider style={{ margin: "16px 0" }} />

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 2fr",
              gap: "8px",
              marginBottom: "8px",
            }}
          >
            <span style={{ color: "#6c757d" }}>기록 시간</span>
            <span style={{ fontWeight: 500 }}>{formattedDate}</span>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 2fr",
              gap: "8px",
              marginBottom: "8px",
            }}
          >
            <span style={{ color: "#6c757d" }}>기록 유형</span>
            <span style={{ fontWeight: 500 }}>
              {isChangeType
                ? "변경 이력"
                : isMultiChangeType
                  ? "다중 변경 이력"
                  : "상태 변경"}
            </span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
