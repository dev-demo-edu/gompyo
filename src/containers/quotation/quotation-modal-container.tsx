import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import CompanyForm, {
  CompanyEditForm,
  CompanyFormValues,
} from "./company-form";
import ItemForm, { ItemEditForm, ItemFormValues } from "./item-form";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import { useState } from "react";
import { QuotationCompany, QuotationItem } from "@/services/quotation-service";

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

interface CompanyEditModalProps extends CompanyAddModalProps {
  selectedCompany: QuotationCompany;
}

export function CompanyEditModal({
  open,
  onClose,
  onSubmit,
  selectedCompany,
}: CompanyEditModalProps) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>업체 수정</DialogTitle>
      <DialogContent>
        <CompanyEditForm
          onClose={onClose}
          onSubmit={onSubmit}
          selectedCompany={selectedCompany}
        />
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

interface ItemEditModalProps extends ItemAddModalProps {
  selectedItem: QuotationItem;
}

export function ItemEditModal({
  open,
  onClose,
  onSubmit,
  selectedItem,
}: ItemEditModalProps) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>품목 수정</DialogTitle>
      <DialogContent>
        <ItemEditForm
          onClose={onClose}
          onSubmit={onSubmit}
          selectedItem={selectedItem}
        />
      </DialogContent>
    </Dialog>
  );
}

interface QuotationDocumentModalProps {
  open: boolean;
  onClose: () => void;
  onDownload: () => Promise<void> | void;
  onOpenInNewWindow: () => Promise<void> | void;
}

export function QuotationDocumentModal({
  open,
  onClose,
  onDownload,
  onOpenInNewWindow,
}: QuotationDocumentModalProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [isOpeningNewWindow, setIsOpeningNewWindow] = useState(false);

  const handleDownload = async () => {
    if (isDownloading) return;

    try {
      setIsDownloading(true);
      await onDownload();
    } finally {
      setIsDownloading(false);
    }
  };

  const handleOpenInNewWindow = async () => {
    if (isOpeningNewWindow) return;

    try {
      setIsOpeningNewWindow(true);
      await onOpenInNewWindow();
    } finally {
      setIsOpeningNewWindow(false);
    }
  };

  const isAnyActionInProgress = isDownloading || isOpeningNewWindow;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>견적서 출력</DialogTitle>
      <DialogContent sx={{ py: 3 }}>
        아래 버튼을 클릭하여 견적서를 출력할 수 있습니다.
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2, pt: 0, justifyContent: "flex-end" }}>
        <Button
          variant="outlined"
          color="primary"
          onClick={onClose}
          disabled={isAnyActionInProgress}
        >
          창 닫기
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleDownload}
          disabled={isAnyActionInProgress}
        >
          {isDownloading ? "다운로드 중..." : "다운로드"}
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleOpenInNewWindow}
          disabled={isAnyActionInProgress}
        >
          {isOpeningNewWindow ? "새창 열기 중..." : "새창에서 열기"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
