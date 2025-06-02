import { useState } from "react";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import {
  companiesAtom,
  selectedCompanyAtom,
  availableYearsAtom,
  selectedYearAtom,
  type Company,
  financialDataAtom,
} from "@/states/partner";

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
  const [companyName, setCompanyName] = useState("");
  const [companyType, setCompanyType] = useState<"payment" | "collection">(
    "payment",
  );

  const [companies, setCompanies] = useAtom(companiesAtom);
  const setSelectedCompany = useSetAtom(selectedCompanyAtom);

  const handleClose = () => {
    setCompanyName("");
    setCompanyType("payment");
    onClose();
  };

  const handleSubmit = async () => {
    if (!companyName.trim()) {
      alert("회사명을 입력해주세요.");
      return;
    }

    try {
      // 서버 액션 호출 (현재는 목업)
      // await createPartnerCompany({ name: companyName.trim(), type: companyType });
      console.log("createPartnerCompany 호출:", {
        name: companyName.trim(),
        type: companyType,
      });

      // 새 회사 추가
      /* 서버액션 완성 시 newCompany = 서버액션함수({
          name: companyName.trim(),
          type: companyType,
        }) */

      // 서버액션 완성 시 삭제 - 임시 데이터
      const newCompany: Company = {
        id: `temp_${Date.now()}`,
        name: companyName.trim(),
        type: companyType,
      };

      setCompanies([...companies, newCompany]);
      setSelectedCompany(newCompany.id); // 새 회사를 자동 선택

      handleClose();
    } catch (error) {
      console.error("회사 추가 실패:", error);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
      <DialogTitle>회사 추가</DialogTitle>
      <DialogContent sx={{ py: 3 }}>
        <TextField
          autoFocus
          margin="dense"
          label="회사명"
          fullWidth
          variant="outlined"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          placeholder="예: 새로운회사"
          sx={{ mb: 2 }}
        />
        <FormControl fullWidth variant="outlined">
          <InputLabel>회사 타입</InputLabel>
          <Select
            value={companyType}
            label="회사 타입"
            onChange={(e) =>
              setCompanyType(e.target.value as "payment" | "collection")
            }
          >
            <MenuItem value="payment">지급회사</MenuItem>
            <MenuItem value="collection">수금회사</MenuItem>
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2, pt: 0, justifyContent: "flex-end" }}>
        <Button variant="outlined" color="primary" onClick={handleClose}>
          취소
        </Button>
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          추가
        </Button>
      </DialogActions>
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
  const [newYear, setNewYear] = useState("");

  const [availableYears, setAvailableYears] = useAtom(availableYearsAtom);
  const setSelectedYear = useSetAtom(selectedYearAtom);
  const selectedCompany = useAtomValue(selectedCompanyAtom);

  const handleClose = () => {
    setNewYear("");
    onClose();
  };

  const handleSubmit = async () => {
    const yearNumber = parseInt(newYear);

    if (isNaN(yearNumber)) {
      alert("올바른 연도를 입력해주세요.");
      return;
    }

    if (yearNumber < 1900 || yearNumber > 2100) {
      alert("1900~2100 사이의 연도를 입력해주세요.");
      return;
    }

    if (availableYears.includes(yearNumber)) {
      alert("이미 존재하는 연도입니다.");
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
    } catch (error) {
      console.error("연도 추가 실패:", error);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
      <DialogTitle>연도 추가</DialogTitle>
      <DialogContent sx={{ py: 3 }}>
        <TextField
          autoFocus
          margin="dense"
          label="연도"
          type="number"
          fullWidth
          variant="outlined"
          value={newYear}
          onChange={(e) => setNewYear(e.target.value)}
          placeholder="예: 2027"
          inputProps={{
            min: 1900,
            max: 2100,
          }}
        />
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2, pt: 0, justifyContent: "flex-end" }}>
        <Button variant="outlined" color="primary" onClick={handleClose}>
          취소
        </Button>
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          추가
        </Button>
      </DialogActions>
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
