"use client";

import BusinessNumberGrid from "./business-number-grid";
import { useAtomValue } from "jotai";
import { selectedBusinessNumbersAtom } from "@/states/business-number";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { useState } from "react";
import BusinessNumberAddModal from "./business-number-modal";
import { BusinessNumberDeleteConfirmModal } from "./business-number-modal";

export default function BusinessNumber() {
  const selectedRows = useAtomValue(selectedBusinessNumbersAtom);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  return (
    <div className="w-full min-h-screen bg-gray-100">
      <div className="p-4 sm:p-8">
        <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">
          사업자 번호 정보
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
            onClick={() => setOpenDeleteModal(true)}
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
            onClick={() => setOpenAddModal(true)}
          >
            사업자 번호 추가
          </Button>
        </Stack>
        {/* 그리드 */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <BusinessNumberGrid />
        </div>
        <BusinessNumberAddModal
          open={openAddModal}
          onClose={() => setOpenAddModal(false)}
        />
        <BusinessNumberDeleteConfirmModal
          open={openDeleteModal}
          onClose={() => setOpenDeleteModal(false)}
        />
      </div>
    </div>
  );
}
