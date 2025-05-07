"use client";

import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import CashflowGrid from "./cashflow-grid";
// import Box from "@mui/material/Box";
import { useEffect, useState } from "react";
import { useSetAtom } from "jotai";
import {
  companyListAtom,
  selectedCompanyIdAtom,
} from "@/states/cashflow-state";
import { getCompanyList } from "@/actions/cashflow";
import CashflowAddModal, { CashflowDeleteConfirmModal } from "./cashflow-modal";

export default function CashflowContainer() {
  const [openCashflowAddModal, setOpenCashflowAddModal] = useState(false);
  const [openCashflowDeleteConfirmModal, setOpenCashflowDeleteConfirmModal] =
    useState(false);
  const setCompanyList = useSetAtom(companyListAtom);
  const setSelectedCompanyId = useSetAtom(selectedCompanyIdAtom);

  useEffect(() => {
    const fetchCompanyList = async () => {
      const companies = await getCompanyList();
      setCompanyList(companies);
      setSelectedCompanyId(companies[0].id);
    };
    fetchCompanyList();
  }, [setCompanyList]);

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
            onClick={() => setOpenCashflowDeleteConfirmModal(true)}
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
            onClick={() => setOpenCashflowAddModal(true)}
          >
            목록 추가
          </Button>
        </Stack>
        <CashflowGrid />
      </div>
      <CashflowAddModal
        open={openCashflowAddModal}
        onClose={() => setOpenCashflowAddModal(false)}
      />
      <CashflowDeleteConfirmModal
        open={openCashflowDeleteConfirmModal}
        onClose={() => setOpenCashflowDeleteConfirmModal(false)}
      />
    </div>
  );
}
