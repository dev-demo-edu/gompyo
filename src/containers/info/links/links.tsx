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
      <div className="p-4 sm:p-8">
        <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">
          링크 관리
        </h1>
        <Stack
          direction="row"
          spacing={2}
          className="w-full justify-end mb-4 sm:mb-6"
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
        {/* LinkList에서 links 상태와 핸들러를 모두 관리 */}
        <LinkList editMode={editMode} />
      </div>
      <LinkAddModal
        open={openLinkAddModal}
        onClose={() => setOpenLinkAddModal(false)}
      />
    </div>
  );
}
