"use client";

import PlanGrid from "@/components/plan-grid";
import PlanButton from "./plan-button";
import Button from "@mui/material/Button";
import { useAtom } from "jotai";
import { selectedCargosAtom } from "@/states/plan";
import { useEffect, useState } from "react";
import { PlanDeleteConfirmModal } from "./plan-modal";
import Stack from "@mui/material/Stack";

export default function Plan() {
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedRows, setSelectedRows] = useAtom(selectedCargosAtom);

  useEffect(() => {
    // 페이지 진입 시 선택된 행 초기화
    setSelectedRows([]);
    //TODO: SelectedRows 초기화 때문에 어색한 버튼 색깔 변경이 있는데 나중에 loading 변수 처리하기
  }, []); // 빈 의존성 배열로 컴포넌트 마운트 시에만 실행

  return (
    <div className="w-full min-h-screen bg-gray-100">
      <div className="p-4 sm:p-8">
        <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">
          계획 현황
        </h1>
        <Stack
          direction="row"
          spacing={2}
          className="w-full justify-end mb-4 sm:mb-6"
        >
          <Button
            variant="contained"
            onClick={() => setOpenDeleteModal(true)}
            disabled={selectedRows.length === 0}
            className="px-4 py-2 bg-primary-main text-white rounded-lg hover:bg-primary-dark transition-colors"
          >
            삭제하기
          </Button>
          <PlanButton />
        </Stack>
        {/* 그리드 */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <PlanGrid />
        </div>
      </div>
      <PlanDeleteConfirmModal
        open={openDeleteModal}
        onClose={() => setOpenDeleteModal(false)}
      />
    </div>
  );
}
