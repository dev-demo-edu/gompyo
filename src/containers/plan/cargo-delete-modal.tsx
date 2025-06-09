import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";

import { deletePlans } from "@/actions/plan";
import { useAtomValue, useSetAtom } from "jotai";
import { cargoRefreshAtom, selectedCargosAtom } from "@/states/plan";
import CommonButton from "@/components/common-button";

// 계획 삭제 확인 모달 컴포넌트
interface CargoDeleteConfirmModalProps {
  open: boolean;
  onClose: () => void;
}

export function CargoDeleteConfirmModal({
  open,
  onClose,
}: CargoDeleteConfirmModalProps) {
  const selectedRows = useAtomValue(selectedCargosAtom);
  const setRefresh = useSetAtom(cargoRefreshAtom);

  async function onConfirm() {
    console.log(selectedRows);
    await deletePlans(selectedRows.map((row) => row.id));
    setRefresh((prev) => prev + 1);
    onClose();
  }
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>화물 삭제 확인</DialogTitle>
      <DialogContent sx={{ py: 3 }}>
        정말로 선택한 화물을 삭제하시겠습니까?
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
