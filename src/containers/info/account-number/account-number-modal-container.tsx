import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import AccountNumberForm from "./account-number-form";
import { deleteAccountNumbers } from "@/actions/info/account-number-actions";
import {
  selectedAccountNumbersAtom,
  accountNumberRefreshAtom,
} from "@/states/account-number";
import { useAtomValue, useSetAtom } from "jotai";

interface AccountNumberAddModalProps {
  open: boolean;
  onClose: () => void;
}

export default function AccountNumberAddModal({
  open,
  onClose,
}: AccountNumberAddModalProps) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>계좌 추가</DialogTitle>
      <DialogContent>
        <AccountNumberForm onClose={onClose} />
      </DialogContent>
    </Dialog>
  );
}

// 계좌 삭제 확인 모달 컴포넌트
interface AccountNumberDeleteConfirmModalProps {
  open: boolean;
  onClose: () => void;
}

export function AccountNumberDeleteConfirmModal({
  open,
  onClose,
}: AccountNumberDeleteConfirmModalProps) {
  const selectedRows = useAtomValue(selectedAccountNumbersAtom);
  const setRefresh = useSetAtom(accountNumberRefreshAtom);

  async function onConfirm() {
    await deleteAccountNumbers(selectedRows.map((row) => row.id));
    setRefresh((prev) => prev + 1);
    onClose();
  }
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>계좌 삭제 확인</DialogTitle>
      <DialogContent sx={{ py: 3 }}>
        정말로 선택한 계좌를 삭제하시겠습니까?
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2, pt: 0, justifyContent: "flex-end" }}>
        <Button variant="outlined" color="primary">
          취소
        </Button>
        <Button variant="contained" color="primary" onClick={onConfirm}>
          삭제
        </Button>
      </DialogActions>
    </Dialog>
  );
}
