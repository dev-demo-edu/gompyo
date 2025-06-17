"use client";

import BusinessNumberGrid from "./business-number-grid";
import { useAtomValue, useSetAtom } from "jotai";
import { selectedBusinessNumbersAtom } from "@/states/business-number";
import Stack from "@mui/material/Stack";
import { useState, useEffect } from "react";
import BusinessNumberAddModal, {
  BusinessNumberEditModal,
} from "./business-number-modal";
import { BusinessNumberDeleteConfirmModal } from "./business-number-modal";
import CommonButton from "@/components/common-button";

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
      <div className="p-4 sm:p-8 pb-20 sm:pb-8">
        {" "}
        {/* 모바일에서 하단 여백 추가 */}
        <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">
          사업자 번호 정보
        </h1>
        {/* 데스크톱 버튼들 - sm 이상에서만 표시 */}
        <div className="hidden sm:block">
          <Stack
            direction="row"
            spacing={2}
            className="w-full justify-start mb-4 sm:mb-6 md:justify-end"
          >
            <CommonButton
              variant="info"
              onClick={(e) => {
                (e.currentTarget as HTMLButtonElement).blur();
                setOpenAddModal(true);
              }}
            >
              사업자 번호 추가
            </CommonButton>
            <CommonButton
              variant="primary"
              onClick={(e) => {
                (e.currentTarget as HTMLButtonElement).blur();
                setOpenEditModal(true);
              }}
              disabled={selectedRows.length !== 1}
            >
              계좌 수정
            </CommonButton>
            <CommonButton
              variant="danger"
              disabled={selectedRows.length === 0}
              onClick={(e) => {
                (e.currentTarget as HTMLButtonElement).blur();
                setOpenDeleteModal(true);
              }}
            >
              선택 삭제
            </CommonButton>
          </Stack>
        </div>
        {/* 그리드 */}
        <div className="overflow-auto md:h-[75vh]">
          <BusinessNumberGrid />
        </div>
      </div>

      {/* 모바일 플로팅 버튼들 - sm 미만에서만 표시 */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-50">
        <Stack direction="row" spacing={2} className="w-full justify-center">
          <CommonButton
            variant="info"
            onClick={(e) => {
              (e.currentTarget as HTMLButtonElement).blur();
              setOpenAddModal(true);
            }}
          >
            사업자 추가
          </CommonButton>
          <CommonButton
            variant="primary"
            onClick={(e) => {
              (e.currentTarget as HTMLButtonElement).blur();
              setOpenEditModal(true);
            }}
            disabled={selectedRows.length !== 1}
          >
            계좌 수정
          </CommonButton>
          <CommonButton
            variant="danger"
            disabled={selectedRows.length === 0}
            onClick={(e) => {
              (e.currentTarget as HTMLButtonElement).blur();
              setOpenDeleteModal(true);
            }}
          >
            선택 삭제
          </CommonButton>
        </Stack>
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
  );
}
