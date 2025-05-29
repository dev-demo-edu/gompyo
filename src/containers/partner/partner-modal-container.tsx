import { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

interface YearAddModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (year: number) => void;
  existingYears: number[];
}

interface CompanyAddModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (company: { name: string; type: "payment" | "collection" }) => void;
}

interface DeleteModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

interface YearDeleteWarningModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  companyName: string;
  year: number;
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

export function YearDeleteWarningModal({
  open,
  onClose,
  onConfirm,
  companyName,
  year,
}: YearDeleteWarningModalProps) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ color: "#EF4444", fontWeight: 600 }}>
        ⚠️ 회사 삭제 경고
      </DialogTitle>
      <DialogContent sx={{ py: 3 }}>
        <div style={{ lineHeight: 1.6 }}>
          <p style={{ marginBottom: "12px", fontSize: "16px" }}>
            <strong>{year}년</strong>이 <strong>`{companyName}`</strong> 회사의
            마지막 연도입니다.
          </p>
          <p
            style={{ marginBottom: "12px", color: "#EF4444", fontWeight: 500 }}
          >
            연도를 삭제하면 해당 회사까지 함께 삭제됩니다.
          </p>
          <p style={{ color: "#6B7280" }}>정말로 계속하시겠습니까?</p>
        </div>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2, pt: 0, justifyContent: "flex-end" }}>
        <Button variant="outlined" color="primary" onClick={onClose}>
          취소
        </Button>
        <Button
          variant="contained"
          sx={{
            backgroundColor: "#EF4444",
            "&:hover": {
              backgroundColor: "#DC2626",
            },
          }}
          onClick={onConfirm}
        >
          회사까지 삭제
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export function CompanyDeleteModal({
  open,
  onClose,
  onConfirm,
  companyName,
}: Omit<DeleteModalProps, "title" | "message"> & { companyName: string }) {
  return (
    <DeleteConfirmModal
      open={open}
      onClose={onClose}
      onConfirm={onConfirm}
      title="회사 삭제 확인"
      message={`정말로 "${companyName}" 회사를 삭제하시겠습니까?`}
    />
  );
}

export function CompanyAddModal({
  open,
  onClose,
  onSubmit,
}: CompanyAddModalProps) {
  const [companyName, setCompanyName] = useState("");
  const [companyType, setCompanyType] = useState<"payment" | "collection">(
    "payment",
  );

  const handleClose = () => {
    setCompanyName("");
    setCompanyType("payment");
    onClose();
  };

  const handleSubmit = () => {
    if (!companyName.trim()) {
      alert("회사명을 입력해주세요.");
      return;
    }

    onSubmit({ name: companyName.trim(), type: companyType });
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
      <DialogTitle>회사 추가</DialogTitle>
      <DialogContent sx={{ py: 3 }}>
        <TextField
          autoFocus
          margin="dense"
          label="회사명"
          fullWidth
          variant="outlined"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          placeholder="예: 새로운회사"
          sx={{ mb: 2 }}
        />
        <FormControl fullWidth variant="outlined">
          <InputLabel>회사 타입</InputLabel>
          <Select
            value={companyType}
            label="회사 타입"
            onChange={(e) =>
              setCompanyType(e.target.value as "payment" | "collection")
            }
          >
            <MenuItem value="payment">지급회사</MenuItem>
            <MenuItem value="collection">수금회사</MenuItem>
          </Select>
        </FormControl>
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

export function YearAddModal({
  open,
  onClose,
  onSubmit,
  existingYears,
}: YearAddModalProps) {
  const [newYear, setNewYear] = useState("");

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

  const handleClose = () => {
    setNewYear("");
    onClose();
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
