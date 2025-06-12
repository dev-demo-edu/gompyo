"use client";

import { CargoDeleteConfirmModal } from "@/containers/shipment/cargo-delete-modal";
import ShipmentGrid from "@/components/shipment-grid";
import { selectedCargosAtom } from "@/states/shipment";
import Stack from "@mui/material/Stack";
import { useAtomValue } from "jotai";
import { useState } from "react";
import CommonButton from "@/components/common-button";

export default function Shipment() {
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const selectedRows = useAtomValue(selectedCargosAtom);

  return (
    <div className="w-full min-h-screen bg-gray-100">
      <div className="p-4 sm:p-8 pb-20 sm:pb-8">
        {" "}
        {/* 모바일에서 하단 여백 추가 */}
        <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">
          선적 현황
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
          </Stack>
        </div>
        {/* 그리드 */}
        <div className="overflow-hidden">
          <ShipmentGrid />
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
        </Stack>
      </div>

      <CargoDeleteConfirmModal
        open={openDeleteModal}
        onClose={() => setOpenDeleteModal(false)}
      />
    </div>
  );
}
