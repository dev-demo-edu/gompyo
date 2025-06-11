"use client";

import PlanGrid from "@/components/plan-grid";
import PlanButton from "./plan-button";
import { useAtom } from "jotai";
import { selectedCargosAtom } from "@/states/plan";
import { useEffect, useState } from "react";
import { CargoDeleteConfirmModal } from "@/containers/plan/cargo-delete-modal";
import Stack from "@mui/material/Stack";
import CommonButton from "@/components/common-button";

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
          className="w-full justify-start mb-4 sm:mb-6 md:justify-end"
        >
          <CommonButton
            variant="danger"
            onClick={() => setOpenDeleteModal(true)}
            disabled={selectedRows.length === 0}
          >
            삭제하기
          </CommonButton>
          <PlanButton />
        </Stack>
        {/* 그리드 */}
        <div className="bg-transparent rounded-lg overflow-hidden md:h-[75vh]">
          <PlanGrid />
        </div>
      </div>
      <CargoDeleteConfirmModal
        open={openDeleteModal}
        onClose={() => setOpenDeleteModal(false)}
      />
    </div>
  );
}
