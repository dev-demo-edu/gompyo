import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import CompanyForm, {
  CompanyEditForm,
  CompanyFormValues,
} from "./company-form";
import ItemForm, { ItemEditForm, ItemFormValues } from "./item-form";
import DialogActions from "@mui/material/DialogActions";
import { useEffect, useState } from "react";
import { QuotationCompany, QuotationItem } from "@/services/quotation-service";
import CommonButton from "@/components/common-button";
import { TextField } from "@mui/material";
import { updateQuotationCellAction } from "@/actions/quotation";

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
        <CommonButton
          variant="outline"
          onClick={onClose}
          disabled={isAnyActionInProgress}
        >
          창 닫기
        </CommonButton>

        <CommonButton
          variant="primary"
          onClick={handleDownload}
          disabled={isAnyActionInProgress}
        >
          {isDownloading ? "다운로드 중..." : "다운로드"}
        </CommonButton>

        <CommonButton
          variant="primary"
          onClick={handleOpenInNewWindow}
          disabled={isAnyActionInProgress}
        >
          {isOpeningNewWindow ? "새창 열기 중..." : "새창에서 열기"}
        </CommonButton>
      </DialogActions>
    </Dialog>
  );
}

interface PriceEditModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: (newPrice: number) => void; // 성공 시 콜백 (선택사항)
  itemName: string;
  currentPrice: number;
  // 업데이트에 필요한 정보들
  itemId: string;
  companyId: string;
  // 로컬 상태 업데이트를 위한 setter
  setPriceData: React.Dispatch<
    React.SetStateAction<Record<string, Record<string, number>>>
  >;
}

export function PriceEditModal({
  open,
  onClose,
  onSuccess,
  itemName,
  currentPrice,
  itemId,
  companyId,
  setPriceData,
}: PriceEditModalProps) {
  const [price, setPrice] = useState(currentPrice);
  const [isUpdating, setIsUpdating] = useState(false);

  // 모달이 열릴 때마다 현재 가격으로 초기화
  useEffect(() => {
    setPrice(currentPrice);
  }, [currentPrice, open]);

  const handleSubmit = async () => {
    if (isUpdating) return;

    try {
      setIsUpdating(true);

      // 로컬 상태 업데이트
      setPriceData((prev) => ({
        ...prev,
        [companyId]: {
          ...prev[companyId],
          [itemId]: price,
        },
      }));

      // 서버에 업데이트 요청
      await updateQuotationCellAction({
        itemId,
        companyId,
        value: price,
      });

      // 성공 콜백 호출 (있는 경우)
      onSuccess?.(price);

      // 모달 닫기
      onClose();
    } catch (error) {
      console.error("가격 업데이트 실패:", error);
      alert("가격 업데이트에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleClose = () => {
    if (isUpdating) return; // 업데이트 중에는 닫기 방지
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
      <DialogTitle>가격 수정</DialogTitle>
      <DialogContent>
        <div className="mb-4 text-sm text-gray-600">{itemName}</div>
        <TextField
          autoFocus
          margin="dense"
          label="가격"
          fullWidth
          variant="outlined"
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
          onKeyPress={(e) => {
            if (e.key === "Enter" && !isUpdating) {
              handleSubmit();
            }
          }}
          disabled={isUpdating}
        />
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2, pt: 0, justifyContent: "flex-end" }}>
        <CommonButton
          variant="outline"
          onClick={handleClose}
          disabled={isUpdating}
        >
          취소
        </CommonButton>
        <CommonButton
          variant="primary"
          onClick={handleSubmit}
          disabled={isUpdating}
        >
          {isUpdating ? "저장 중..." : "저장"}
        </CommonButton>
      </DialogActions>
    </Dialog>
  );
}
