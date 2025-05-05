"use client";

// import { useState } from "react";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import CashflowGrid from "./cashflow-grid";
// import Box from "@mui/material/Box";

export default function Links() {
  // const [openLinkAddModal, setOpenLinkAddModal] = useState(false);
  // const [editMode, setEditMode] = useState(false);

  return (
    <div className="w-full min-h-screen bg-gray-100">
      <div className="p-4 sm:p-8">
        <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">
          수금 지출 관리
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
            // onClick={() => setOpenLinkAddModal(true)}
          >
            선택 목록 삭제
          </Button>
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
            // onClick={() => setOpenLinkAddModal(true)}
          >
            선택 목록 반영
          </Button>
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
            // onClick={() => setOpenLinkAddModal(true)}
          >
            목록 추가
          </Button>
        </Stack>
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <CashflowGrid />
        </div>
      </div>
      {/* <LinkAddModal
        open={openLinkAddModal}
        onClose={() => setOpenLinkAddModal(false)}
      /> */}
    </div>
  );
}
