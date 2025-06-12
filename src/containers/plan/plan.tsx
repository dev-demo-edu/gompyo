"use client";

import PlanGrid from "@/components/plan-grid";
import PlanButton from "./plan-button";
import { useAtom } from "jotai";
import { selectedPlanRowsAtom } from "@/states/plan";
import { useEffect, useState } from "react";
import { CargoDeleteConfirmModal } from "@/containers/plan/cargo-delete-modal";
import Stack from "@mui/material/Stack";
import CommonButton from "@/components/common-button";

export default function Plan() {
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedRows, setSelectedRows] = useAtom(selectedPlanRowsAtom);

  useEffect(() => {
    // 페이지 진입 시 선택된 행 초기화
    setSelectedRows([]);
    //TODO: SelectedRows 초기화 때문에 어색한 버튼 색깔 변경이 있는데 나중에 loading 변수 처리하기
  }, []); // 빈 의존성 배열로 컴포넌트 마운트 시에만 실행

  return (
    <div className="w-full min-h-screen bg-gray-100">
      <div className="p-4 sm:p-8 pb-20 sm:pb-8">
        {" "}
        {/* 모바일에서 하단 여백 추가 */}
        <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">
          계획 현황
        </h1>
        {/* 데스크톱 버튼들 - sm 이상에서만 표시 */}
        <div className="hidden sm:block">
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
        </div>
        {/* 그리드 */}
        <div className="bg-transparent rounded-lg overflow-hidden">
          <PlanGrid />
        </div>
      </div>

      {/* 모바일 플로팅 버튼들 - sm 미만에서만 표시 */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-50">
        <Stack direction="row" spacing={2} className="w-full justify-center">
          <CommonButton
            variant="danger"
            onClick={() => setOpenDeleteModal(true)}
            disabled={selectedRows.length === 0}
          >
            삭제하기
          </CommonButton>
          <PlanButton />
        </Stack>
      </div>

      <CargoDeleteConfirmModal
        open={openDeleteModal}
        onClose={() => setOpenDeleteModal(false)}
      />
    </div>
  );
}
