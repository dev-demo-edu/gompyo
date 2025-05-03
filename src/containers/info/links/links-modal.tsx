import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import LinkForm from "./links-form";

interface LinkAddModalProps {
  open: boolean;
  onClose: () => void;
}

export default function LinkAddModal({ open, onClose }: LinkAddModalProps) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>링크 추가</DialogTitle>
      <DialogContent>
        <LinkForm onClose={onClose} />
      </DialogContent>
    </Dialog>
  );
}
