"use client";

import BusinessNumberGrid from "./business-number-grid";
import { useAtomValue, useSetAtom } from "jotai";
import { selectedBusinessNumbersAtom } from "@/states/business-number";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { useState, useEffect } from "react";
import BusinessNumberAddModal, {
  BusinessNumberEditModal,
} from "./business-number-modal";
import { BusinessNumberDeleteConfirmModal } from "./business-number-modal";

export default function BusinessNumber() {
  const selectedRows = useAtomValue(selectedBusinessNumbersAtom);
  const setSelectedRows = useSetAtom(selectedBusinessNumbersAtom);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);

  useEffect(() => {
    // 페이지 진입 시 선택된 행 초기화
    setSelectedRows([]);
    //TODO: SelectedRows 초기화 때문에 어색한 버튼 색깔 변경이 있는데 나중에 loading 변수 처리하기
  }, []); // 빈 의존성 배열로 컴포넌트 마운트 시에만 실행

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
              backgroundColor: "#EF4444",
              "&:hover": {
                backgroundColor: "#DC2626",
              },
              boxShadow: "none",
            }}
            onClick={(e) => {
              (e.currentTarget as HTMLButtonElement).blur();
              setOpenDeleteModal(true);
            }}
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
            onClick={(e) => {
              (e.currentTarget as HTMLButtonElement).blur();
              setOpenAddModal(true);
            }}
          >
            사업자 번호 추가
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
            onClick={(e) => {
              (e.currentTarget as HTMLButtonElement).blur();
              setOpenEditModal(true);
            }}
            disabled={selectedRows.length !== 1}
          >
            계좌 수정
          </Button>
        </Stack>
        {/* 그리드 */}
        <div className="overflow-hidden">
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
        <BusinessNumberEditModal
          open={openEditModal}
          onClose={() => setOpenEditModal(false)}
        />
      </div>
    </div>
  );
}
