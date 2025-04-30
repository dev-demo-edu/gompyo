"use client";

import AccountNumberGrid from "./account-number-grid";
import { useAtomValue } from "jotai";
import { selectedAccountNumbersAtom } from "@/states/account-number";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { useState } from "react";
import AccountNumberModalContainer from "./account-number-modal-container";
import { AccountNumberDeleteConfirmModal } from "./account-number-modal-container";

export default function AccountNumber() {
  const selectedRows = useAtomValue(selectedAccountNumbersAtom);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  const handleOpenAddModal = () => setOpenAddModal(true);
  const handleCloseAddModal = () => setOpenAddModal(false);
  // 실제 저장 로직은 추후 구현
  const handleAddAccountNumber = () => {
    // const handleAddAccountNumber = (values: Record<string, string>) => {
    setOpenAddModal(false);
  };

  const handleOpenDeleteModal = () => setOpenDeleteModal(true);
  const handleCloseDeleteModal = () => setOpenDeleteModal(false);
  const handleDeleteAccountNumbers = () => {
    // 실제 삭제 로직 구현 필요
    setOpenDeleteModal(false);
  };

  return (
    <div className="w-full min-h-screen bg-gray-100">
      <div className="p-4 sm:p-8">
        <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">
          계좌 정보
        </h1>
        <Stack
          direction="row"
          spacing={2}
          className="w-full justify-end mb-4 sm:mb-6"
        >
          <Button
            variant="contained"
            color="primary"
            disabled={selectedRows.length === 0}
            sx={{
              minWidth: 120,
              fontWeight: 600,
              backgroundColor: "#22C55E",
              "&:hover": {
                backgroundColor: "#16A34A",
              },
              boxShadow: "none",
            }}
            onClick={handleOpenDeleteModal}
          >
            선택 삭제
          </Button>
          <Button
            variant="contained"
            color="primary"
            sx={{
              minWidth: 120,
              fontWeight: 600,
              backgroundColor: "#22C55E",
              "&:hover": {
                backgroundColor: "#16A34A",
              },
              boxShadow: "none",
            }}
            onClick={handleOpenAddModal}
          >
            계좌 추가
          </Button>
        </Stack>
        {/* 그리드 */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <AccountNumberGrid />
        </div>
        <AccountNumberModalContainer
          open={openAddModal}
          onClose={handleCloseAddModal}
          onSubmit={handleAddAccountNumber}
        />
        <AccountNumberDeleteConfirmModal
          open={openDeleteModal}
          onClose={handleCloseDeleteModal}
          onConfirm={handleDeleteAccountNumbers}
        />
      </div>
    </div>
  );
}
