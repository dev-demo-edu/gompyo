"use client";

import { useState } from "react";
import LinkAddModal from "./links-modal";
import LinkList from "@/components/link-list";
import Stack from "@mui/material/Stack";
import CommonButton from "@/components/common-button";

export default function Links() {
  const [openLinkAddModal, setOpenLinkAddModal] = useState(false);
  const [editMode, setEditMode] = useState(false);

  return (
    <div className="w-full min-h-screen bg-gray-100">
      <div className="p-4 sm:p-8 pb-20 sm:pb-8">
        {" "}
        {/* 모바일에서 하단 여백 추가 */}
        <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">
          링크 관리
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
              onClick={() => setOpenLinkAddModal(true)}
              minWidth={120}
            >
              링크 추가
            </CommonButton>

            <CommonButton
              variant="secondary"
              minWidth={120}
              editMode={editMode}
              onClick={() => setEditMode((v) => !v)}
            >
              {editMode ? "편집 종료" : "편집 모드"}
            </CommonButton>
          </Stack>
        </div>
        {/* LinkList에서 links 상태와 핸들러를 모두 관리 */}
        <LinkList editMode={editMode} />
      </div>

      {/* 모바일 플로팅 버튼들 - sm 미만에서만 표시 */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-50">
        <Stack direction="row" spacing={2} className="w-full justify-center">
          <CommonButton
            variant="info"
            onClick={() => setOpenLinkAddModal(true)}
          >
            링크 추가
          </CommonButton>
          <CommonButton
            variant="secondary"
            editMode={editMode}
            onClick={() => setEditMode((v) => !v)}
          >
            {editMode ? "편집 종료" : "편집"}
          </CommonButton>
        </Stack>
      </div>

      <LinkAddModal
        open={openLinkAddModal}
        onClose={() => setOpenLinkAddModal(false)}
      />
    </div>
  );
}
