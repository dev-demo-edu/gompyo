import React from "react";
import { Modal, Box, Typography, Button } from "@mui/material";

interface BlNumberUpdateModalProps {
  open: boolean;
  onClose: () => void;
  onSelect: (option: "all" | "single") => void;
}

export const BlNumberUpdateModal: React.FC<BlNumberUpdateModalProps> = ({
  open,
  onClose,
  onSelect,
}) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="bl-number-update-modal"
      aria-describedby="bl-number-update-modal-description"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}
      >
        <Typography
          id="bl-number-update-modal"
          variant="h6"
          component="h2"
          sx={{ mb: 2 }}
        >
          B/L 번호 업데이트
        </Typography>
        <Typography id="bl-number-update-modal-description" sx={{ mb: 3 }}>
          B/L 번호를 어떻게 업데이트하시겠습니까?
        </Typography>
        <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
          <Button variant="outlined" onClick={() => onSelect("all")}>
            전체 계약 업데이트
          </Button>
          <Button variant="contained" onClick={() => onSelect("single")}>
            특정 화물 업데이트
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};
