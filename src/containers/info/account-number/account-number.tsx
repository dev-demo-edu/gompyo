"use client";

import AccountNumberGrid from "./account-number-grid";
import { useAtomValue, useSetAtom } from "jotai";
import { selectedAccountNumbersAtom } from "@/states/account-number";
import Stack from "@mui/material/Stack";
import { useState, useEffect } from "react";
import AccountNumberAddModal, {
  AccountNumberEditModal,
} from "./account-number-modal-container";
import { AccountNumberDeleteConfirmModal } from "./account-number-modal-container";
import CommonButton from "@/components/common-button";

export default function AccountNumber() {
  const selectedRows = useAtomValue(selectedAccountNumbersAtom);
  const setSelectedRows = useSetAtom(selectedAccountNumbersAtom);
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
          계좌 정보
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
              계좌 추가
            </CommonButton>
            <CommonButton
              variant="primary"
              disabled={selectedRows.length !== 1}
              onClick={(e) => {
                (e.currentTarget as HTMLButtonElement).blur();
                setOpenEditModal(true);
              }}
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
          <AccountNumberGrid />
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
            계좌 추가
          </CommonButton>
          <CommonButton
            variant="primary"
            disabled={selectedRows.length !== 1}
            onClick={(e) => {
              (e.currentTarget as HTMLButtonElement).blur();
              setOpenEditModal(true);
            }}
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

      <AccountNumberAddModal
        open={openAddModal}
        onClose={() => setOpenAddModal(false)}
      />
      <AccountNumberDeleteConfirmModal
        open={openDeleteModal}
        onClose={() => setOpenDeleteModal(false)}
      />
      <AccountNumberEditModal
        open={openEditModal}
        onClose={() => setOpenEditModal(false)}
      />
    </div>
  );
}
