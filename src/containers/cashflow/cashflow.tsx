"use client";

import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import CashflowGrid from "./cashflow-grid";
import { useEffect, useState } from "react";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import {
  companyListAtom,
  selectedCompanyIdAtom,
  selectedExpenseRowsAtom,
  selectedIncomeRowsAtom,
  cashflowRefreshAtom,
  editModeAtom,
} from "@/states/cashflow-state";
import {
  deleteCashflows,
  getCompanyList,
  updateCompanyBalance,
} from "@/actions/cashflow";
import CashflowAddModal, {
  CashflowBalanceModal,
  CashflowDeleteConfirmModal,
} from "./cashflow-modal";
import { calculateCashflowAmountByType } from "@/utils/cashflow";
import Tabs from "@mui/material/Tabs";
import { Tab } from "@mui/material";

export default function CashflowContainer() {
  const [openCashflowAddModal, setOpenCashflowAddModal] = useState(false);
  const [openCashflowBalanceModal, setOpenCashflowBalanceModal] =
    useState(false);
  const [openCashflowDeleteConfirmModal, setOpenCashflowDeleteConfirmModal] =
    useState(false);
  const [companyList, setCompanyList] = useAtom(companyListAtom);
  const [selectedCompanyId, setSelectedCompanyId] = useAtom(
    selectedCompanyIdAtom,
  );
  const selectedIncomeRows = useAtomValue(selectedIncomeRowsAtom);
  const selectedExpenseRows = useAtomValue(selectedExpenseRowsAtom);
  const setCashflowRefresh = useSetAtom(cashflowRefreshAtom);
  const fetchCompanyList = async () => {
    const companies = await getCompanyList();
    setCompanyList(companies);
    setSelectedCompanyId(companies[0].id);
  };
  const [editMode, setEditMode] = useAtom(editModeAtom);

  useEffect(() => {
    fetchCompanyList();
  }, [setCompanyList]);

  async function handleUpdateCompanyBalance() {
    await updateCompanyBalance(
      calculateCashflowAmountByType(
        selectedIncomeRows.filter((row) => row.id !== "balance-row"),
        selectedExpenseRows,
      ) +
        (companyList.find((company) => company.id === selectedCompanyId)
          ?.companyBalance ?? 0),
      selectedCompanyId,
    );
    await deleteCashflows(selectedIncomeRows.map((row) => row.id));
    await deleteCashflows(selectedExpenseRows.map((row) => row.id));
    setCashflowRefresh((prev) => prev + 1);
    fetchCompanyList();
  }

  return (
    <div className="w-full min-h-screen bg-gray-100">
      <div className="p-4 sm:p-8">
        <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">
          수금 지출 관리
        </h1>

        <Stack direction="row" spacing={2}>
          <div
            className="flex flex-row justify-between items-end flex-shrink-0"
            style={{ minHeight: 24 }}
          >
            <Tabs
              value={selectedCompanyId}
              onChange={(_, value) => setSelectedCompanyId(value)}
              scrollButtons="auto"
            >
              {companyList.map((company) => (
                <Tab key={company.id} label={company.name} value={company.id} />
              ))}
            </Tabs>
          </div>
          <Stack
            direction="row"
            spacing={2}
            className="w-full justify-end mb-4 sm:mb-6"
          >
            {/* TODO: 버튼 스타일 통일하기 */}
            <Button
              variant="contained"
              color="primary"
              sx={{
                minWidth: 120,
                minHeight: 44,
                maxHeight: 44,
                fontWeight: 600,
                fontSize: 16,
                lineHeight: 1.5,
                py: 0,
                backgroundColor: "#22C55E",
                "&:hover": { backgroundColor: "#16A34A" },
                boxShadow: "none",
                alignSelf: "flex-end",
              }}
              onClick={() => setOpenCashflowBalanceModal(true)}
            >
              잔액 설정
            </Button>
            <Button
              variant="contained"
              color="primary"
              disabled={
                selectedIncomeRows.length === 0 &&
                selectedExpenseRows.length === 0
              }
              sx={{
                minWidth: 120,
                minHeight: 44,
                maxHeight: 44,
                fontWeight: 600,
                fontSize: 16,
                lineHeight: 1.5,
                py: 0,
                backgroundColor: "#22C55E",
                "&:hover": { backgroundColor: "#16A34A" },
                boxShadow: "none",
                alignSelf: "flex-end",
              }}
              onClick={() => setOpenCashflowDeleteConfirmModal(true)}
            >
              선택 목록 삭제
            </Button>
            <Button
              variant="contained"
              color="primary"
              disabled={
                selectedIncomeRows.length === 0 &&
                selectedExpenseRows.length === 0
              }
              sx={{
                minWidth: 120,
                minHeight: 44,
                maxHeight: 44,
                fontWeight: 600,
                fontSize: 16,
                lineHeight: 1.5,
                py: 0,
                backgroundColor: "#22C55E",
                "&:hover": { backgroundColor: "#16A34A" },
                boxShadow: "none",
                alignSelf: "flex-end",
              }}
              onClick={handleUpdateCompanyBalance}
            >
              선택 목록 반영
            </Button>
            <Button
              className="px-4 py-2 bg-primary-main text-white rounded-lg hover:bg-primary-dark transition-colors"
              variant="contained"
              color="primary"
              sx={{
                minWidth: 120,
                minHeight: 44,
                maxHeight: 44,
                fontWeight: 600,
                fontSize: 16,
                lineHeight: 1.5,
                py: 0,
                backgroundColor: "#22C55E",
                "&:hover": { backgroundColor: "#16A34A" },
                boxShadow: "none",
                alignSelf: "flex-end",
              }}
              onClick={() => setOpenCashflowAddModal(true)}
            >
              목록 추가
            </Button>
            <Button
              variant="contained"
              color="secondary"
              sx={{
                minWidth: 120,
                minHeight: 44,
                maxHeight: 44,
                fontWeight: 600,
                fontSize: 16,
                lineHeight: 1.5,
                py: 0,
                backgroundColor: editMode ? "#f3f4f6" : "#64748b",
                color: editMode ? "#374151" : "#fff",
                "&:hover": {
                  backgroundColor: editMode ? "#e5e7eb" : "#475569",
                },
                boxShadow: "none",
                border: editMode ? "1px solid #cbd5e1" : "none",
                alignSelf: "flex-end",
              }}
              onClick={() => setEditMode((v) => !v)}
            >
              {editMode ? "편집 종료" : "편집 모드"}
            </Button>
          </Stack>
        </Stack>
        <CashflowGrid />
      </div>
      <CashflowAddModal
        open={openCashflowAddModal}
        onClose={() => setOpenCashflowAddModal(false)}
      />
      <CashflowBalanceModal
        open={openCashflowBalanceModal}
        onClose={() => setOpenCashflowBalanceModal(false)}
      />
      <CashflowDeleteConfirmModal
        open={openCashflowDeleteConfirmModal}
        onClose={() => setOpenCashflowDeleteConfirmModal(false)}
      />
    </div>
  );
}
