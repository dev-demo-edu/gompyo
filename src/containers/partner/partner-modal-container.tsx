import { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

interface YearAddModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (year: number) => void;
  existingYears: number[];
}

interface DeleteModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

function DeleteConfirmModal({
  open,
  onClose,
  onConfirm,
  title,
  message,
}: DeleteModalProps) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent sx={{ py: 3 }}>{message}</DialogContent>
      <DialogActions sx={{ px: 3, pb: 2, pt: 0, justifyContent: "flex-end" }}>
        <Button variant="outlined" color="primary" onClick={onClose}>
          취소
        </Button>
        <Button variant="contained" color="primary" onClick={onConfirm}>
          삭제
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export function YearDeleteModal({
  open,
  onClose,
  onConfirm,
  year,
}: Omit<DeleteModalProps, "title" | "message"> & { year: number }) {
  return (
    <DeleteConfirmModal
      open={open}
      onClose={onClose}
      onConfirm={onConfirm}
      title="연도 삭제 확인"
      message={`정말로 ${year}년 데이터를 삭제하시겠습니까?`}
    />
  );
}

export default function YearAddModal({
  open,
  onClose,
  onSubmit,
  existingYears,
}: YearAddModalProps) {
  const [newYear, setNewYear] = useState("");

  const handleClose = () => {
    setNewYear("");
    onClose();
  };

  const handleSubmit = () => {
    const yearNumber = parseInt(newYear);

    if (isNaN(yearNumber)) {
      alert("올바른 연도를 입력해주세요.");
      return;
    }

    if (yearNumber < 1900 || yearNumber > 2100) {
      alert("1900~2100 사이의 연도를 입력해주세요.");
      return;
    }

    if (existingYears.includes(yearNumber)) {
      alert("이미 존재하는 연도입니다.");
      return;
    }

    onSubmit(yearNumber);
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
      <DialogTitle>연도 추가</DialogTitle>
      <DialogContent sx={{ py: 3 }}>
        <TextField
          autoFocus
          margin="dense"
          label="연도"
          type="number"
          fullWidth
          variant="outlined"
          value={newYear}
          onChange={(e) => setNewYear(e.target.value)}
          placeholder="예: 2027"
          inputProps={{
            min: 1900,
            max: 2100,
          }}
        />
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2, pt: 0, justifyContent: "flex-end" }}>
        <Button variant="outlined" color="primary" onClick={handleClose}>
          취소
        </Button>
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          추가
        </Button>
      </DialogActions>
    </Dialog>
  );
}
