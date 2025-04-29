"use client";

import AccountNumberGrid from "./account-number-grid";
import { useAtomValue } from "jotai";
import { selectedAccountNumbersAtom } from "@/states/account-number";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";

export default function AccountNumber() {
  const selectedRows = useAtomValue(selectedAccountNumbersAtom);
  return (
    <div className="w-full min-h-screen bg-gray-100">
      <div className="p-4 sm:p-8">
        <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">
          계좌 정보
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
            disabled={selectedRows.length === 0}
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
        </Stack>
        {/* 그리드 */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <AccountNumberGrid />
        </div>
      </div>
    </div>
  );
}
