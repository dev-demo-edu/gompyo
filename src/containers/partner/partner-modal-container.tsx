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
  type Company,
  financialDataAtom,
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

// 기본 삭제 확인 모달
function DeleteConfirmModal({
  open,
  onClose,
  onConfirm,
  title,
  message,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}) {
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

// 회사 추가 모달 - 로직을 내부에서 처리
export function CompanyAddModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const [companies, setCompanies] = useAtom(companiesAtom);
  const setSelectedCompany = useSetAtom(selectedCompanyAtom);

  const handleClose = () => {
    setFieldErrors({});
    onClose();
  };

  const handleSubmit = async (values: CompanyAddFormValues) => {
    try {
      if (companies.some((c) => c.name === values.name)) {
        setFieldErrors({ name: "이미 존재하는 회사명입니다." });
        return;
      }

      // 서버 액션 호출 (현재는 목업)
      // await createPartnerCompany({ name: values.name, type: values.type });
      console.log("createPartnerCompany 호출:", {
        values,
      });

      // 새 회사 추가
      /* 서버액션 완성 시 newCompany = 서버액션함수({
          name: values.name,
          type: values.type,
        }) */

      // 서버액션 완성 시 삭제 - 임시 데이터
      const newCompany: Company = {
        id: `temp_${Date.now()}`,
        name: values.name,
        type: values.type,
      };

      setCompanies([...companies, newCompany]);
      setSelectedCompany(newCompany.id);

      handleClose();
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "회사 추가 중 오류가 발생했습니다.";

      setFieldErrors({
        name: errorMessage,
      });
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
          submitLabel="추가"
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
  const [companies, setCompanies] = useAtom(companiesAtom);
  const [selectedCompany, setSelectedCompany] = useAtom(selectedCompanyAtom);

  const setFinancialData = useSetAtom(financialDataAtom);
  const setAvailableYears = useSetAtom(availableYearsAtom);

  const handleConfirm = async () => {
    try {
      // 서버 액션 호출 (현재는 목업)
      // await deletePartnerCompany(selectedCompany);
      console.log("deletePartnerCompany 호출:", selectedCompany);

      const updatedCompanies = companies.filter(
        (c) => c.id !== selectedCompany,
      );
      setCompanies(updatedCompanies);

      if (updatedCompanies.length > 0) {
        setSelectedCompany(updatedCompanies[0].id);
      } else {
        setSelectedCompany("");
        setFinancialData([]);
        setAvailableYears([]);
      }

      onClose();
    } catch (error) {
      console.error("회사 삭제 실패:", error);
    }
  };

  return (
    <DeleteConfirmModal
      open={open}
      onClose={onClose}
      onConfirm={handleConfirm}
      title="회사 삭제 확인"
      message={`정말로 "${companyName}" 회사를 삭제하시겠습니까?`}
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
  const [availableYears, setAvailableYears] = useAtom(availableYearsAtom);
  const setSelectedYear = useSetAtom(selectedYearAtom);
  const selectedCompany = useAtomValue(selectedCompanyAtom);

  const handleClose = () => {
    setFieldErrors({});
    onClose();
  };

  const handleSubmit = async (values: YearAddFormValues) => {
    const yearNumber = parseInt(values.year);

    // 중복 검사
    if (availableYears.includes(yearNumber)) {
      setFieldErrors({ year: "이미 존재하는 연도입니다." });
      return;
    }

    try {
      // 서버 액션 호출 (현재는 목업)
      // await createFinancialYear(selectedCompany, yearNumber);
      console.log("createFinancialYear 호출:", selectedCompany, yearNumber);

      const updatedYears = [...availableYears, yearNumber].sort(
        (a, b) => a - b,
      );
      setAvailableYears(updatedYears);
      setSelectedYear(yearNumber);

      handleClose();
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "연도 추가 중 오류가 발생했습니다.";

      setFieldErrors({
        year: errorMessage,
      });
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
          submitLabel="추가"
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
  const [availableYears, setAvailableYears] = useAtom(availableYearsAtom);
  const [selectedYear, setSelectedYear] = useAtom(selectedYearAtom);
  const selectedCompany = useAtomValue(selectedCompanyAtom);
  const companies = useAtomValue(companiesAtom);
  const setCompanies = useSetAtom(companiesAtom);
  const setSelectedCompany = useSetAtom(selectedCompanyAtom);
  const setFinancialData = useSetAtom(financialDataAtom);

  // 경고 모달 상태
  const [showWarning, setShowWarning] = useState(false);

  const handleConfirm = async () => {
    try {
      // 마지막 년도인지 체크
      if (availableYears.length === 1) {
        setShowWarning(true);
        return;
      }

      // 일반 년도 삭제
      // await deleteFinancialYear(selectedCompany, selectedYear);
      console.log("deleteFinancialYear 호출:", selectedCompany, selectedYear);

      const updatedYears = availableYears.filter((y) => y !== selectedYear);
      setAvailableYears(updatedYears);
      setSelectedYear(updatedYears[updatedYears.length - 1]);
      setFinancialData([]);

      onClose();
    } catch (error) {
      console.error("년도 삭제 실패:", error);
    }
  };

  const handleWarningConfirm = async () => {
    try {
      // 회사까지 삭제
      // await deleteCompanyWithAllYears(selectedCompany);
      console.log("deleteCompanyWithAllYears 호출:", selectedCompany);

      const updatedCompanies = companies.filter(
        (c) => c.id !== selectedCompany,
      );
      setCompanies(updatedCompanies);

      if (updatedCompanies.length > 0) {
        setSelectedCompany(updatedCompanies[0].id);
      } else {
        setSelectedCompany("");
        setFinancialData([]);
        setAvailableYears([]);
      }

      setShowWarning(false);
      onClose();
    } catch (error) {
      console.error("회사 삭제 실패:", error);
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
          >
            회사까지 삭제
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
    />
  );
}

// EditCancelConfirmModal 추가
export function EditCancelConfirmModal({
  open,
  onClose,
  onConfirm,
  changedCount,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  changedCount: number;
}) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ fontWeight: 600 }}>편집 취소 확인</DialogTitle>

      <DialogContent sx={{ py: 3 }}>
        <p style={{ marginBottom: "8px", color: "#374151" }}>
          변경된 <strong>{changedCount}개 항목</strong>이 저장되지 않습니다.
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
