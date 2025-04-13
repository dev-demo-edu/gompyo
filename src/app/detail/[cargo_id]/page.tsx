"use client";

import { Box, Container, Typography, Button, Stack } from "@mui/material";
import { useState, useEffect } from "react";
import CargoDetail from "@/containers/detail-view/cargo-detail";
import Documents from "@/containers/detail-view/documents";
import { useParams } from "next/navigation";
import { getCargoDetail } from "@/actions/cargo-detail";
import { CargoDetailData } from "@/types/cargo-detail";

const statusOrder = ["예정", "입고", "출고", "판매"]; // TODO: 상태 순서 수정 추가 필요

export default function DetailPage() {
  const params = useParams();
  const [activeTab, setActiveTab] = useState<
    "entire" | "document" | "cargo" | "history"
  >("entire");
  const [currentStatus, setCurrentStatus] = useState<string>("예정");
  const [cargoData, setCargoData] = useState<CargoDetailData | null>(null);

  useEffect(() => {
    async function fetchCargoData() {
      try {
        const cargoDetail = await getCargoDetail(params.cargo_id as string);
        setCargoData(cargoDetail);
        setCurrentStatus(cargoDetail.cargo.progressStatus || "예정");
      } catch (error) {
        console.error("화물 정보 조회 중 오류 발생:", error);
      }
    }

    fetchCargoData();
  }, [params.cargo_id]);

  const renderContent = () => {
    switch (activeTab) {
      case "entire":
        return (
          <CargoDetail
            cargoId={params.cargo_id as string}
            cargoData={cargoData}
          />
        );
      case "document":
        return (
          <Documents
            cargoId={params.cargo_id as string}
            cargoData={cargoData}
          />
        );
      // TODO: 구현 필요
      // case "cargo":
      //   return <CargoInfo cargoId={cargo_id} cargoData={cargoData} />;
      // case "history":
      //   return <HistoryInfo cargoId={cargo_id} cargoData={cargoData} />;
      // default:
      //   return <ShippingInfo cargoId={cargo_id} cargoData={cargoData} />;
    }
  };

  const getProgressBarWidth = () => {
    const currentIndex = statusOrder.indexOf(currentStatus);
    const totalSteps = statusOrder.length;
    const progressWidth = (currentIndex / (totalSteps - 1)) * 100;
    return `${progressWidth}%`;
  };

  const getStatusPosition = (status: string) => {
    const index = statusOrder.indexOf(status);
    const totalSteps = statusOrder.length;
    const position = (index / (totalSteps - 1)) * 100;
    return `${position}%`;
  };

  return (
    <div className="min-h-screen bg-background-paper">
      {/* 헤더 */}
      <Box className="w-full h-16 px-10 bg-background-default flex justify-between items-center">
        <Typography
          variant="h4"
          className="text-success-darker font-bold font-['Public_Sans']"
        >
          상세보기
        </Typography>
      </Box>

      {/* 진행 상태 */}
      <Box className="w-full h-24 relative">
        <Container maxWidth="xl" className="progress-container h-full">
          <Box className="relative h-full flex items-center px-4">
            {/* 프로그레스 바 배경 */}
            <Box className="w-full h-2.5 bg-gray-200 rounded-2xl" />

            {/* 프로그레스 바 진행 상태 */}
            <Box
              className="absolute h-2.5 bg-green-200 rounded-2xl transition-all duration-500"
              style={{ width: getProgressBarWidth() }}
            />

            {/* 현재 상태 표시 */}
            <Box
              className="absolute"
              style={{
                left: `calc(${getStatusPosition(currentStatus)} + 16px)`,
                top: "50%",
                transform: "translate(-50%, -50%)",
              }}
            >
              <Box className="w-10 h-10 bg-white rounded-full border-[3px] border-emerald-600 transition-colors duration-300" />
            </Box>
            <Typography
              className="absolute text-sm font-normal font-['Public_Sans'] text-emerald-600 whitespace-nowrap"
              style={{
                left: `calc(${getStatusPosition(currentStatus)} + 16px)`,
                top: "calc(50% + 20px)",
                transform: "translateX(-50%)",
              }}
            >
              {currentStatus}
            </Typography>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="xl" className="mt-8">
        {/* 메뉴 버튼 */}
        <Box className="mb-8">
          <Stack direction="row" spacing={2}>
            <Button
              variant="contained"
              color={activeTab === "entire" ? "primary" : "inherit"}
              onClick={() => setActiveTab("entire")}
            >
              선적정보
            </Button>
            <Button
              variant="contained"
              color={activeTab === "document" ? "primary" : "inherit"}
              onClick={() => setActiveTab("document")}
            >
              서류정보
            </Button>
            <Button
              variant="contained"
              color={activeTab === "cargo" ? "primary" : "inherit"}
              onClick={() => setActiveTab("cargo")}
            >
              화물 정보
            </Button>
            <Button
              variant="contained"
              color={activeTab === "history" ? "primary" : "inherit"}
              onClick={() => setActiveTab("history")}
            >
              히스토리
            </Button>
          </Stack>
        </Box>
        {renderContent()}
        <Box className="w-[1093px] h-[50px]" />
      </Container>
    </div>
  );
}
