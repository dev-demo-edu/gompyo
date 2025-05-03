"use client";

import { useState } from "react";
import LinkAddModal from "./links-modal";
import LinkList from "@/components/link-list";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";

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
          {/* TODO: 버튼 스타일 통일하기 */}
          <Button
            variant="contained"
            color="primary"
            sx={{
              minWidth: 120,
              minHeight: 44,
              fontWeight: 600,
              fontSize: 16,
              lineHeight: 1.5,
              py: 0,
              backgroundColor: "#22C55E",
              "&:hover": { backgroundColor: "#16A34A" },
              boxShadow: "none",
            }}
            onClick={() => setOpenLinkAddModal(true)}
          >
            링크 추가
          </Button>
          <Button
            variant="contained"
            color="secondary"
            sx={{
              minWidth: 120,
              minHeight: 44,
              fontWeight: 600,
              fontSize: 16,
              lineHeight: 1.5,
              py: 0,
              backgroundColor: editMode ? "#f3f4f6" : "#64748b",
              color: editMode ? "#374151" : "#fff",
              "&:hover": { backgroundColor: editMode ? "#e5e7eb" : "#475569" },
              boxShadow: "none",
              border: editMode ? "1px solid #cbd5e1" : "none",
            }}
            onClick={() => setEditMode((v) => !v)}
          >
            {editMode ? "편집 종료" : "편집 모드"}
          </Button>
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
