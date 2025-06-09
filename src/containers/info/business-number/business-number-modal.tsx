import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import BusinessNumberForm, {
  BusinessNumberEditForm,
} from "./business-number-form";
import { deleteBusinessNumbers } from "@/actions/info/business-number-actions";
import {
  selectedBusinessNumbersAtom,
  businessNumberRefreshAtom,
} from "@/states/business-number";
import { useAtomValue, useSetAtom } from "jotai";
import CommonButton from "@/components/common-button";

interface BusinessNumberAddModalProps {
  open: boolean;
  onClose: () => void;
}

export default function BusinessNumberAddModal({
  open,
  onClose,
}: BusinessNumberAddModalProps) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>사업자 번호 추가</DialogTitle>
      <DialogContent>
        <BusinessNumberForm onClose={onClose} />
      </DialogContent>
    </Dialog>
  );
}

export function BusinessNumberEditModal({
  open,
  onClose,
}: BusinessNumberAddModalProps) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>사업자 번호 수정</DialogTitle>
      <DialogContent>
        <BusinessNumberEditForm onClose={onClose} />
      </DialogContent>
    </Dialog>
  );
}

// 계좌 삭제 확인 모달 컴포넌트
interface BusinessNumberDeleteConfirmModalProps {
  open: boolean;
  onClose: () => void;
}

export function BusinessNumberDeleteConfirmModal({
  open,
  onClose,
}: BusinessNumberDeleteConfirmModalProps) {
  const selectedRows = useAtomValue(selectedBusinessNumbersAtom);
  const setRefresh = useSetAtom(businessNumberRefreshAtom);

  async function onConfirm() {
    await deleteBusinessNumbers(selectedRows.map((row) => row.id));
    setRefresh((prev) => prev + 1);
    onClose();
  }
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>계좌 삭제 확인</DialogTitle>
      <DialogContent sx={{ py: 3 }}>
        정말로 선택한 사업자 번호를 삭제하시겠습니까?
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2, pt: 0, justifyContent: "flex-end" }}>
        <CommonButton variant="outline" onClick={onClose}>
          취소
        </CommonButton>
        <CommonButton variant="outline-danger" onClick={onConfirm}>
          삭제
        </CommonButton>
      </DialogActions>
    </Dialog>
  );
}
