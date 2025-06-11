import { useState } from "react";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import {
  companiesAtom,
  selectedCompanyAtom,
  availableYearsAtom,
  selectedYearAtom,
  partnerRefreshAtom,
} from "@/states/partner";
import {
  companyAddFields,
  CompanyAddFormValues,
  companyAddSchema,
  yearAddFields,
  YearAddFormValues,
  yearAddSchema,
} from "./partner-form";
import DynamicForm from "@/components/dynamic-form";
import {
  createCompany,
  deleteCompany,
  addYear,
  deleteYear,
} from "@/actions/partner";

// 기본 삭제 확인 모달
function DeleteConfirmModal({
  open,
  onClose,
  onConfirm,
  title,
  message,
  loading = false,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  loading?: boolean;
}) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent sx={{ py: 3 }}>{message}</DialogContent>
      <DialogActions sx={{ px: 3, pb: 2, pt: 0, justifyContent: "flex-end" }}>
        <Button
          variant="outlined"
          color="primary"
          onClick={onClose}
          disabled={loading}
        >
          취소
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={onConfirm}
          disabled={loading}
        >
          {loading ? "처리 중..." : "삭제"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// 회사 추가 모달 - 로직을 내부에서 처리
export function CompanyAddModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const setPartnerRefresh = useSetAtom(partnerRefreshAtom);

  const handleClose = () => {
    setFieldErrors({});
    onClose();
  };

  const handleSubmit = async (values: CompanyAddFormValues) => {
    setLoading(true);
    try {
      await createCompany(values.name, values.type);
      setPartnerRefresh((prev) => prev + 1);
      handleClose();
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "회사 추가 중 오류가 발생했습니다.";

      setFieldErrors({
        name: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
      <DialogTitle>회사 추가</DialogTitle>
      <DialogContent sx={{ py: 3 }}>
        <DynamicForm
          fields={companyAddFields}
          onSubmit={handleSubmit}
          onCancel={handleClose}
          submitLabel={loading ? "추가 중..." : "추가"}
          zodSchema={companyAddSchema}
          fieldErrors={fieldErrors}
        />
      </DialogContent>
    </Dialog>
  );
}

// 회사 삭제 모달 - 로직을 내부에서 처리
export function CompanyDeleteModal({
  open,
  onClose,
  companyName,
}: {
  open: boolean;
  onClose: () => void;
  companyName: string;
}) {
  const [loading, setLoading] = useState(false);
  const selectedCompany = useAtomValue(selectedCompanyAtom);
  const setPartnerRefresh = useSetAtom(partnerRefreshAtom);

  const handleConfirm = async () => {
    if (!selectedCompany) return;

    setLoading(true);
    try {
      await deleteCompany(selectedCompany);
      setPartnerRefresh((prev) => prev + 1);
      onClose();
    } catch (error) {
      console.error("회사 삭제 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DeleteConfirmModal
      open={open}
      onClose={onClose}
      onConfirm={handleConfirm}
      title="회사 삭제 확인"
      message={`정말로 "${companyName}" 회사를 삭제하시겠습니까? 관련된 모든 재무 데이터도 함께 삭제됩니다.`}
      loading={loading}
    />
  );
}

// 년도 추가 모달 - 로직을 내부에서 처리
export function YearAddModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const availableYears = useAtomValue(availableYearsAtom);
  const selectedCompany = useAtomValue(selectedCompanyAtom);
  const setPartnerRefresh = useSetAtom(partnerRefreshAtom);

  const handleClose = () => {
    setFieldErrors({});
    onClose();
  };

  const handleSubmit = async (values: YearAddFormValues) => {
    if (!selectedCompany) {
      setFieldErrors({ year: "회사를 먼저 선택해주세요." });
      return;
    }

    const yearNumber = parseInt(values.year);

    // 중복 검사
    if (availableYears.includes(yearNumber)) {
      setFieldErrors({ year: "이미 존재하는 연도입니다." });
      return;
    }

    setLoading(true);
    try {
      await addYear(selectedCompany, yearNumber);
      setPartnerRefresh((prev) => prev + 1);
      handleClose();
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "연도 추가 중 오류가 발생했습니다.";

      setFieldErrors({
        year: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
      <DialogTitle>연도 추가</DialogTitle>
      <DialogContent sx={{ py: 3 }}>
        <DynamicForm
          fields={yearAddFields}
          onSubmit={handleSubmit}
          onCancel={handleClose}
          submitLabel={loading ? "추가 중..." : "추가"}
          zodSchema={yearAddSchema}
          fieldErrors={fieldErrors}
        />
      </DialogContent>
    </Dialog>
  );
}

// 년도 삭제 모달 - 로직을 내부에서 처리
export function YearDeleteModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [availableYears, setAvailableYears] = useAtom(availableYearsAtom);
  const [selectedYear, setSelectedYear] = useAtom(selectedYearAtom);
  const selectedCompany = useAtomValue(selectedCompanyAtom);
  const companies = useAtomValue(companiesAtom);
  const setPartnerRefresh = useSetAtom(partnerRefreshAtom);

  // 경고 모달 상태
  const [showWarning, setShowWarning] = useState(false);

  const handleConfirm = async () => {
    if (!selectedCompany || !selectedYear) return;

    try {
      // 마지막 년도인지 체크
      if (availableYears.length === 1) {
        setShowWarning(true);
        return;
      }

      // 일반 년도 삭제
      setLoading(true);
      await deleteYear(selectedCompany, selectedYear);

      // 삭제 성공 후 즉시 상태 업데이트
      const updatedYears = availableYears.filter(
        (year) => year !== selectedYear,
      );
      setAvailableYears(updatedYears);

      // 새로운 연도 선택 (가장 최근 연도)
      if (updatedYears.length > 0) {
        setSelectedYear(updatedYears[0]);
      }

      setPartnerRefresh((prev) => prev + 1);
      onClose();
    } catch (error) {
      console.error("년도 삭제 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleWarningConfirm = async () => {
    if (!selectedCompany) return;

    setLoading(true);
    try {
      // 회사까지 삭제
      await deleteCompany(selectedCompany);
      setPartnerRefresh((prev) => prev + 1);
      setShowWarning(false);
      onClose();
    } catch (error) {
      console.error("회사 삭제 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  // 경고 모달이 열려있으면 경고 모달 표시
  if (showWarning) {
    const companyName =
      companies.find((c) => c.id === selectedCompany)?.name || "";

    return (
      <Dialog
        open={open}
        onClose={() => setShowWarning(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ color: "#EF4444", fontWeight: 600 }}>
          ⚠️ 회사 삭제 경고
        </DialogTitle>
        <DialogContent sx={{ py: 3 }}>
          <div style={{ lineHeight: 1.6 }}>
            <p style={{ marginBottom: "12px", fontSize: "16px" }}>
              <strong>{selectedYear}년</strong>이{" "}
              <strong>`{companyName}`</strong> 회사의 마지막 연도입니다.
            </p>
            <p
              style={{
                marginBottom: "12px",
                color: "#EF4444",
                fontWeight: 500,
              }}
            >
              연도를 삭제하면 해당 회사까지 함께 삭제됩니다.
            </p>
            <p style={{ color: "#6B7280" }}>정말로 계속하시겠습니까?</p>
          </div>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, pt: 0, justifyContent: "flex-end" }}>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => setShowWarning(false)}
            disabled={loading}
          >
            취소
          </Button>
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#EF4444",
              "&:hover": { backgroundColor: "#DC2626" },
            }}
            onClick={handleWarningConfirm}
            disabled={loading}
          >
            {loading ? "삭제 중..." : "회사까지 삭제"}
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  // 일반 삭제 확인 모달
  return (
    <DeleteConfirmModal
      open={open}
      onClose={onClose}
      onConfirm={handleConfirm}
      title="연도 삭제 확인"
      message={`정말로 ${selectedYear}년 데이터를 삭제하시겠습니까?`}
      loading={loading}
    />
  );
}

// EditCancelConfirmModal 추가
export function EditCancelConfirmModal({
  open,
  onClose,
  onConfirm,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ fontWeight: 600 }}>편집 취소 확인</DialogTitle>

      <DialogContent sx={{ py: 3 }}>
        <p style={{ marginBottom: "8px", color: "#374151" }}>
          편집한 모든 변경사항이 저장되지 않습니다.
        </p>
        <p style={{ color: "#6B7280" }}>정말로 편집을 취소하시겠습니까?</p>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2, pt: 0 }}>
        <Button onClick={onClose} variant="outlined" color="primary">
          계속 편집
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          sx={{
            backgroundColor: "#EF4444",
            "&:hover": { backgroundColor: "#DC2626" },
          }}
        >
          취소하고 나가기
        </Button>
      </DialogActions>
    </Dialog>
  );
}
