"use client";

import { Box, Container, Typography, Button, Stack } from "@mui/material";
import { useState, useEffect } from "react";
import CargoDetail from "@/containers/detail-view/entire";
import CargoInfo from "@/containers/detail-view/cargo";
import { useParams } from "next/navigation";
import { useAtom } from "jotai";
import { cargoDetailAtom } from "@/states/detail";
import { updateCargoStatusInfo } from "@/actions/detail-view/cargo";
import { useToast } from "@/hooks/use-toast";

// 화물 상태 enum 정의
export enum CargoStatus {
  REVIEW = "검토중",
  CONTRACTING = "계약중",
  BEFORE_LC = "L/C오픈전",
  BEFORE_ARRIVAL = "입항전",
  WAREHOUSE_MOVING = "창고 이동중",
  BEFORE_QUARANTINE = "검역전",
  QUARANTINING = "검역중",
  CUSTOMS_DECLARING = "세관신고중",
  BEFORE_CUSTOMS = "통관전",
  AFTER_CUSTOMS = "통관후",
  SELLING = "판매중",
}

// 영어 상태값과 한글 상태값 매핑
const statusMapping: Record<string, CargoStatus> = {
  REVIEW: CargoStatus.REVIEW,
  CONTRACTING: CargoStatus.CONTRACTING,
  BEFORE_LC: CargoStatus.BEFORE_LC,
  BEFORE_ARRIVAL: CargoStatus.BEFORE_ARRIVAL,
  WAREHOUSE_MOVING: CargoStatus.WAREHOUSE_MOVING,
  BEFORE_QUARANTINE: CargoStatus.BEFORE_QUARANTINE,
  QUARANTINING: CargoStatus.QUARANTINING,
  CUSTOMS_DECLARING: CargoStatus.CUSTOMS_DECLARING,
  BEFORE_CUSTOMS: CargoStatus.BEFORE_CUSTOMS,
  AFTER_CUSTOMS: CargoStatus.AFTER_CUSTOMS,
  SELLING: CargoStatus.SELLING,
};

// 한글 상태값과 영어 상태값 매핑 (역방향)
const reverseStatusMapping: Partial<Record<CargoStatus, string>> = {
  [CargoStatus.REVIEW]: "REVIEW",
  [CargoStatus.CONTRACTING]: "CONTRACTING",
  [CargoStatus.BEFORE_LC]: "BEFORE_LC",
  [CargoStatus.BEFORE_ARRIVAL]: "BEFORE_ARRIVAL",
  [CargoStatus.WAREHOUSE_MOVING]: "WAREHOUSE_MOVING",
  [CargoStatus.BEFORE_QUARANTINE]: "BEFORE_QUARANTINE",
  [CargoStatus.QUARANTINING]: "QUARANTINING",
  [CargoStatus.CUSTOMS_DECLARING]: "CUSTOMS_DECLARING",
  [CargoStatus.BEFORE_CUSTOMS]: "BEFORE_CUSTOMS",
  [CargoStatus.AFTER_CUSTOMS]: "AFTER_CUSTOMS",
  [CargoStatus.SELLING]: "SELLING",
};

// 상태 순서 정의
const statusOrder = Object.values(CargoStatus);

export default function DetailPage() {
  const params = useParams();
  const [activeTab, setActiveTab] = useState<
    "entire" | "document" | "cargo" | "history"
  >("entire");
  const [mappedData, setMappedData] = useAtom(cargoDetailAtom);
  const { toast, ToastComponent } = useToast();

  useEffect(() => {
    async function fetchCargoData() {
      if (mappedData) return;
      await setMappedData(params.cargo_id as string);
    }

    fetchCargoData();
  }, [params.cargo_id, mappedData, setMappedData]);

  const renderContent = () => {
    switch (activeTab) {
      case "entire":
        return <CargoDetail cargoId={params.cargo_id as string} />;
      // case "document":
      //   return (
      //     <DocumentInfo
      //       cargoId={params.cargo_id as string}
      //       cargoData={detailData}
      //     />
      //   );
      case "cargo":
        return <CargoInfo cargoId={params.cargo_id as string} />;
      // case "history":
      //   return (
      //     <HistoryInfo
      //       cargoId={params.cargo_id as string}
      //       cargoData={detailData}
      //     />
      //   );
      // default:
      //   return (
      //     <ShippingInfo
      //       cargoId={params.cargo_id as string}
      //       cargoData={detailData}
      //     />
      //   );
    }
  };

  const getProgressBarWidth = () => {
    if (!mappedData?.cargo?.progressStatus) return "0%";

    const englishStatus = mappedData.cargo.progressStatus;
    const koreanStatus = statusMapping[englishStatus];
    if (!koreanStatus) return "0%";

    const currentIndex = statusOrder.indexOf(koreanStatus);
    const totalSteps = statusOrder.length;
    // 전체 너비를 80%로 제한
    const progressWidth = (currentIndex / (totalSteps - 1)) * 96;
    return `${progressWidth}%`;
  };

  const getStatusPosition = () => {
    if (!mappedData?.cargo?.progressStatus) return "0%";

    const englishStatus = mappedData.cargo.progressStatus;
    const koreanStatus = statusMapping[englishStatus];
    if (!koreanStatus) return "0%";

    const index = statusOrder.indexOf(koreanStatus);
    const totalSteps = statusOrder.length;
    // 전체 너비를 80%로 제한하고 시작점을 10%로 설정
    const position = (index / (totalSteps - 1)) * 96;
    return `${position}%`;
  };

  const getNextStatus = (): string | null => {
    if (!mappedData?.cargo?.progressStatus) return null;

    const englishStatus = mappedData.cargo.progressStatus;
    const koreanStatus = statusMapping[englishStatus];
    if (!koreanStatus) return null;

    const currentIndex = statusOrder.indexOf(koreanStatus);
    if (currentIndex === statusOrder.length - 1) return null;

    return reverseStatusMapping[statusOrder[currentIndex + 1]] || null;
  };

  const getPreviousStatus = (): string | null => {
    if (!mappedData?.cargo?.progressStatus) return null;

    const englishStatus = mappedData.cargo.progressStatus;
    const koreanStatus = statusMapping[englishStatus];
    if (!koreanStatus) return null;

    const currentIndex = statusOrder.indexOf(koreanStatus);
    if (currentIndex === 0) return null;

    return reverseStatusMapping[statusOrder[currentIndex - 1]] || null;
  };

  const handleStatusUpdate = async (nextStatus: string | null) => {
    if (!mappedData?.cargo || !nextStatus) return;

    try {
      await updateCargoStatusInfo(params.cargo_id as string, {
        status: nextStatus,
        customsClearanceDate: mappedData.cargo.customsClearanceDate || "",
        warehouseEntryDate: mappedData.cargo.warehouseEntryDate || "",
        quarantineDate: mappedData.cargo.quarantineDate || "",
        shippingCompany: mappedData.shipment?.shippingCompany || "",
        palletOrderDate: mappedData.shipment?.palletOrderDate || "",
        palletType: mappedData.shipment?.palletType || "",
      });

      // 데이터 갱신
      await setMappedData(params.cargo_id as string);

      toast({
        title: "성공",
        description: "상태가 성공적으로 변경되었습니다.",
      });
    } catch (error) {
      console.error("상태 업데이트 중 오류 발생:", error);
      toast({
        title: "오류",
        description: "상태 변경 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    }
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
              className="absolute transition-all duration-500 ease-in-out"
              style={{
                left: `calc(${getStatusPosition()} + 16px)`,
                top: "50%",
                transform: "translate(-50%, -50%)",
              }}
            >
              <Box className="w-10 h-10 bg-white rounded-full border-[3px] border-emerald-600 transition-colors duration-300" />
            </Box>
            <Typography
              className="absolute text-sm font-normal font-['Public_Sans'] text-emerald-600 whitespace-nowrap transition-all duration-500 ease-in-out"
              style={{
                left: `calc(${getStatusPosition()} + 16px)`,
                top: "calc(50% + 20px)",
                transform: "translateX(-50%)",
              }}
            >
              {mappedData?.cargo?.progressStatus
                ? statusMapping[mappedData.cargo.progressStatus]
                : ""}
            </Typography>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="xl" className="mt-8">
        {/* 메뉴 버튼 */}
        <Box className="mb-8">
          <Stack
            direction="row"
            spacing={2}
            justifyContent="space-between"
            alignItems="center"
          >
            <Stack direction="row" spacing={2}>
              <Button
                variant="contained"
                color={activeTab === "entire" ? "primary" : "inherit"}
                onClick={() => setActiveTab("entire")}
              >
                전체정보
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
            <Stack direction="row" spacing={2}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleStatusUpdate(getPreviousStatus())}
                disabled={!getPreviousStatus()}
              >
                이전 상태로 변경
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleStatusUpdate(getNextStatus())}
                disabled={!getNextStatus()}
              >
                다음 상태로 변경
              </Button>
            </Stack>
          </Stack>
        </Box>
        {renderContent()}
        <Box className="w-[1093px] h-[50px]" />
      </Container>

      <ToastComponent />
    </div>
  );
}
