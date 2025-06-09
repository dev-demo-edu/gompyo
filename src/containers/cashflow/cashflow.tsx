"use client";

import Stack from "@mui/material/Stack";
import CashflowGrid from "./cashflow-grid";
import { useEffect, useState } from "react";
import { useAtom, useAtomValue } from "jotai";
import {
  companyListAtom,
  selectedCompanyIdAtom,
  selectedExpenseRowsAtom,
  selectedIncomeRowsAtom,
  // cashflowRefreshAtom,
  editModeAtom,
} from "@/states/cashflow-state";
import {
  // deleteCashflows,
  getCompanyList,
  // updateCompanyBalance,
} from "@/actions/cashflow";
import CashflowAddModal, {
  CashflowBalanceModal,
  CashflowDeleteConfirmModal,
  CashflowEditModal,
} from "./cashflow-modal";
// import { calculateCashflowAmountByType } from "@/utils/cashflow";
import Tabs from "@mui/material/Tabs";
import { Tab } from "@mui/material";
import CommonButton from "@/components/common-button";

export default function CashflowContainer() {
  const [openCashflowAddModal, setOpenCashflowAddModal] = useState(false);
  const [openCashflowBalanceModal, setOpenCashflowBalanceModal] =
    useState(false);
  const [openCashflowDeleteConfirmModal, setOpenCashflowDeleteConfirmModal] =
    useState(false);
  const [openCashflowEditModal, setOpenCashflowEditModal] = useState(false);
  const [companyList, setCompanyList] = useAtom(companyListAtom);
  const [selectedCompanyId, setSelectedCompanyId] = useAtom(
    selectedCompanyIdAtom,
  );
  const selectedIncomeRows = useAtomValue(selectedIncomeRowsAtom);
  const selectedExpenseRows = useAtomValue(selectedExpenseRowsAtom);
  // const setCashflowRefresh = useSetAtom(cashflowRefreshAtom);
  const fetchCompanyList = async () => {
    const companies = await getCompanyList();
    setCompanyList(companies);
    setSelectedCompanyId(
      selectedCompanyId === "" ? companies[0].id : selectedCompanyId,
    );
  };
  const [editMode, setEditMode] = useAtom(editModeAtom);

  useEffect(() => {
    fetchCompanyList();
  }, [setCompanyList]);

  // async function handleUpdateCompanyBalance() {
  //   await updateCompanyBalance(
  //     calculateCashflowAmountByType(
  //       selectedIncomeRows.filter((row) => row.id !== "balance-row"),
  //       selectedExpenseRows,
  //     ) +
  //       (companyList.find((company) => company.id === selectedCompanyId)
  //         ?.companyBalance ?? 0),
  //     selectedCompanyId,
  //   );
  //   await deleteCashflows(selectedIncomeRows.map((row) => row.id));
  //   await deleteCashflows(selectedExpenseRows.map((row) => row.id));
  //   setCashflowRefresh((prev) => prev + 1);
  //   fetchCompanyList();
  // }

  return (
    <div className="w-full min-h-screen bg-gray-100">
      <div className="p-4 sm:p-8">
        <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">
          수금 지출 관리
        </h1>

        <Stack direction={{ xs: "column", lg: "row" }} spacing={2}>
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
            sx={{
              justifyContent: { sm: "flex-start", lg: "flex-end" },
              overflowX: "scroll",
              width: "100%",
              minWidth: 0,
            }}
            className="w-full justify-start mb-4 sm:mb-6 mt-4"
          >
            {/* TODO: 버튼 스타일 통일하기 */}
            <CommonButton
              variant="info"
              onClick={(e) => {
                (e.currentTarget as HTMLButtonElement).blur();
                setOpenCashflowAddModal(true);
              }}
            >
              목록 추가
            </CommonButton>
            <CommonButton
              variant="primary"
              onClick={(e) => {
                (e.currentTarget as HTMLButtonElement).blur();
                setOpenCashflowBalanceModal(true);
              }}
            >
              잔액 설정
            </CommonButton>
            <CommonButton
              variant="primary"
              disabled={
                !(
                  selectedIncomeRows.length === 1 &&
                  selectedExpenseRows.length === 0
                ) &&
                !(
                  selectedIncomeRows.length === 0 &&
                  selectedExpenseRows.length === 1
                )
              }
              onClick={(e) => {
                (e.currentTarget as HTMLButtonElement).blur();
                setOpenCashflowEditModal(true);
              }}
            >
              선택 목록 수정
            </CommonButton>
            <CommonButton
              variant="danger"
              disabled={
                selectedIncomeRows.length === 0 &&
                selectedExpenseRows.length === 0
              }
              onClick={(e) => {
                (e.currentTarget as HTMLButtonElement).blur();
                setOpenCashflowDeleteConfirmModal(true);
              }}
            >
              선택 목록 삭제
            </CommonButton>

            {/* <Button
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
              onClick={(e) => {
                (e.currentTarget as HTMLButtonElement).blur();
                handleUpdateCompanyBalance();
              }}
            >
              선택 목록 반영
            </Button> */}

            <CommonButton
              variant="secondary"
              editMode={editMode}
              onClick={(e) => {
                (e.currentTarget as HTMLButtonElement).blur();
                setEditMode((v) => !v);
              }}
            >
              {editMode ? "편집 종료" : "편집 모드"}
            </CommonButton>
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
      <CashflowEditModal
        open={openCashflowEditModal}
        onClose={() => setOpenCashflowEditModal(false)}
      />
    </div>
  );
}
