"use client";

import { Stack } from "@mui/material";

import { Button } from "@mui/material";
import PartnerGrid from "./partner-grid";

export default function Partner() {
  return (
    <div className="w-full min-h-screen bg-gray-100">
      <div className="p-4 sm:p-8">
        <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">
          거래처 관리
        </h1>
        <Stack
          direction="row"
          spacing={2}
          className="w-full justify-end mb-4 sm:mb-6"
        >
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
          >
            계좌 추가
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
          >
            계좌 수정
          </Button>
        </Stack>
        {/* 그리드 */}
        <div className="overflow-hidden">
          <PartnerGrid />
        </div>
      </div>
    </div>
  );
}
