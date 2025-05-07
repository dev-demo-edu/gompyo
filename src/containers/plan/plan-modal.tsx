import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import { deletePlans } from "@/actions/plan";
import { useAtomValue, useSetAtom } from "jotai";
import { cargoRefreshAtom, selectedCargosAtom } from "@/states/plan";

// 계획 삭제 확인 모달 컴포넌트
interface PlanDeleteConfirmModalProps {
  open: boolean;
  onClose: () => void;
}

export function PlanDeleteConfirmModal({
  open,
  onClose,
}: PlanDeleteConfirmModalProps) {
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
