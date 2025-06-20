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
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-6">선적 현황</h1>
        {/* 그리드 */}
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
        <div className="overflow-auto md:h-[75vh]">
          <ShipmentGrid />
        </div>
        <CargoDeleteConfirmModal
          open={openDeleteModal}
          onClose={() => setOpenDeleteModal(false)}
        />
      </div>
    </div>
  );
}
