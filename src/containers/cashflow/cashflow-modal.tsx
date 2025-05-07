import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import CashflowForm from "./cashflow-form";
import { deleteBusinessNumbers } from "@/actions/info/business-number-actions";
import {
  selectedBusinessNumbersAtom,
  businessNumberRefreshAtom,
} from "@/states/business-number";
import { useAtomValue, useSetAtom } from "jotai";

interface CashflowAddModalProps {
  open: boolean;
  onClose: () => void;
}

export default function CashflowAddModal({
  open,
  onClose,
}: CashflowAddModalProps) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>목록 추가</DialogTitle>
      <DialogContent>
        <CashflowForm onClose={onClose} />
      </DialogContent>
    </Dialog>
  );
}

// 계좌 삭제 확인 모달 컴포넌트
interface CashflowDeleteConfirmModalProps {
  open: boolean;
  onClose: () => void;
}

export function CashflowDeleteConfirmModal({
  open,
  onClose,
}: CashflowDeleteConfirmModalProps) {
  const selectedRows = useAtomValue(selectedBusinessNumbersAtom);
  const setRefresh = useSetAtom(businessNumberRefreshAtom);

  async function onConfirm() {
    await deleteBusinessNumbers(selectedRows.map((row) => row.id));
    setRefresh((prev) => prev + 1);
    onClose();
  }
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>내역 삭제 확인</DialogTitle>
      <DialogContent sx={{ py: 3 }}>
        정말로 선택한 내역을 삭제하시겠습니까?
      </DialogContent>
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
