import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import CompanyForm, { CompanyFormValues } from "./company-form";
import ItemForm, { ItemFormValues } from "./item-form";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";

interface CompanyAddModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: CompanyFormValues) => void;
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

export function CompanyDeleteModal({
  open,
  onClose,
  onConfirm,
}: Omit<DeleteModalProps, "title" | "message">) {
  return (
    <DeleteConfirmModal
      open={open}
      onClose={onClose}
      onConfirm={onConfirm}
      title="업체 삭제 확인"
      message="정말로 선택한 업체를 삭제하시겠습니까?"
    />
  );
}

export function ItemDeleteModal({
  open,
  onClose,
  onConfirm,
}: Omit<DeleteModalProps, "title" | "message">) {
  return (
    <DeleteConfirmModal
      open={open}
      onClose={onClose}
      onConfirm={onConfirm}
      title="품목 삭제 확인"
      message="정말로 선택한 품목을 삭제하시겠습니까?"
    />
  );
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

interface QuotationDocumentModalProps {
  open: boolean;
  onClose: () => void;
  onDownload: () => void;
  onOpenInNewWindow: () => void;
}

export function QuotationDocumentModal({
  open,
  onClose,
  onDownload,
  onOpenInNewWindow,
}: QuotationDocumentModalProps) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>견적서 출력</DialogTitle>
      <DialogContent sx={{ py: 3 }}>
        아래 버튼을 클릭하여 견적서를 출력할 수 있습니다.
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2, pt: 0, justifyContent: "flex-end" }}>
        <Button variant="outlined" color="primary" onClick={onClose}>
          창 닫기
        </Button>
        <Button variant="contained" color="primary" onClick={onDownload}>
          다운로드
        </Button>
        <Button variant="contained" color="primary" onClick={onOpenInNewWindow}>
          새창에서 열기
        </Button>
      </DialogActions>
    </Dialog>
  );
}
