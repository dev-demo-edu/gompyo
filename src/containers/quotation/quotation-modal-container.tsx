import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import CompanyForm, { CompanyFormValues } from "./company-form";
import ItemForm, { ItemFormValues } from "./item-form";

interface CompanyAddModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: CompanyFormValues) => void;
}

export function CompanyAddModal({
  open,
  onClose,
  onSubmit,
}: CompanyAddModalProps) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>업체 추가</DialogTitle>
      <DialogContent>
        <CompanyForm onClose={onClose} onSubmit={onSubmit} />
      </DialogContent>
    </Dialog>
  );
}

interface ItemAddModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: ItemFormValues) => void;
}

export function ItemAddModal({ open, onClose, onSubmit }: ItemAddModalProps) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>품목 추가</DialogTitle>
      <DialogContent>
        <ItemForm onClose={onClose} onSubmit={onSubmit} />
      </DialogContent>
    </Dialog>
  );
}
