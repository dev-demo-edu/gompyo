import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";

import CashflowForm from "./cashflow-form";
import { useAtomValue, useSetAtom } from "jotai";
import {
  cashflowRefreshAtom,
  selectedExpenseRowsAtom,
  selectedIncomeRowsAtom,
} from "@/states/cashflow-state";
import { deleteCashflows } from "@/actions/cashflow";
import CashflowBalanceForm from "./balance-form";
import CashflowEditForm from "./cashflow-edit-form";
import CommonButton from "@/components/common-button";

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
  const selectedExpenseRows = useAtomValue(selectedExpenseRowsAtom);
  const selectedIncomeRows = useAtomValue(selectedIncomeRowsAtom);
  const setRefresh = useSetAtom(cashflowRefreshAtom);

  async function onConfirm() {
    await deleteCashflows(selectedExpenseRows.map((row) => row.id));
    await deleteCashflows(selectedIncomeRows.map((row) => row.id));
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
        <CommonButton variant="outline" onClick={onClose}>
          취소
        </CommonButton>
        <CommonButton variant="danger" onClick={onConfirm}>
          삭제
        </CommonButton>
      </DialogActions>
    </Dialog>
  );
}

interface CashflowBalanceModalProps {
  open: boolean;
  onClose: () => void;
}

export function CashflowBalanceModal({
  open,
  onClose,
}: CashflowBalanceModalProps) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>잔액 설정</DialogTitle>
      <DialogContent>
        <CashflowBalanceForm onClose={onClose} />
      </DialogContent>
    </Dialog>
  );
}

interface CashflowEditModalProps {
  open: boolean;
  onClose: () => void;
}

export function CashflowEditModal({ open, onClose }: CashflowEditModalProps) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>내역 수정</DialogTitle>
      <DialogContent>
        <CashflowEditForm onClose={onClose} />
      </DialogContent>
    </Dialog>
  );
}
