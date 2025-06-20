"use client";

import { Box, Container, Typography, Stack } from "@mui/material";
import { useState, useEffect, useRef, useCallback } from "react";
import CargoDetail from "@/containers/detail-view/entire";
import CargoInfo from "@/containers/detail-view/cargo";
import { useParams } from "next/navigation";
import { useAtom } from "jotai";
import { cargoDetailAtom } from "@/states/detail";
import { updateCargoStatusInfo } from "@/actions/detail-view/cargo";
import { useToast } from "@/hooks/use-toast";
import Documents from "@/containers/detail-view/documents";
import History from "@/containers/detail-view/history";
import Stock from "@/containers/detail-view/stock";
import {
  CargoStatus,
  statusMapping,
  reverseStatusMapping,
} from "@/constants/cargo-status";
import { useRouter } from "next/navigation";
import CommonButton from "@/components/common-button";

// 상태 순서 정의
const statusOrder = Object.values(CargoStatus);

export default function DetailPage() {
  const params = useParams();
  const [activeTab, setActiveTab] = useState<
    "entire" | "document" | "cargo" | "history" | "stock"
  >("entire");
  const [mappedData, setMappedData] = useAtom(cargoDetailAtom);
  const { toast, ToastComponent } = useToast();
  const [loading, setLoading] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragPosition, setDragPosition] = useState<number | null>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  const router = useRouter();

  useEffect(() => {
    async function fetchCargoData() {
      try {
        if (mappedData && mappedData.cargo.id === params.cargo_id) {
          setLoading(false);
          return;
        }

        await setMappedData(params.cargo_id as string);
        setLoading(false);
      } catch (err) {
        console.error("화물 데이터 가져오기 실패:", err);
        router.push("/404");
      }
    }

    fetchCargoData();
  }, [params.cargo_id]);

  // 편집 모드 진입 시 dragPosition을 현재 상태로 초기화
  useEffect(() => {
    if (isEditMode) {
      setDragPosition(getCurrentStatusIndex());
    }
  }, [isEditMode]);

  const renderContent = () => {
    switch (activeTab) {
      case "entire":
        return <CargoDetail cargoId={params.cargo_id as string} />;
      case "document":
        return <Documents cargoId={params.cargo_id as string} />;
      case "cargo":
        return <CargoInfo cargoId={params.cargo_id as string} />;
      case "history":
        return <History />;
      case "stock":
        return <Stock cargoId={params.cargo_id as string} />;
      default:
        return null;
    }
  };

  const getCurrentStatusIndex = () => {
    if (!mappedData?.cargo?.progressStatus) return 0;
    const englishStatus = mappedData.cargo.progressStatus;
    const koreanStatus = statusMapping[englishStatus];
    if (!koreanStatus) return 0;
    return statusOrder.indexOf(koreanStatus);
  };

  // dragPosition이 null이 아니면 dragPosition, 아니면 getCurrentStatusIndex 사용
  const getActiveStatusIndex = () =>
    dragPosition !== null ? dragPosition : getCurrentStatusIndex();

  const getProgressBarWidth = () => {
    const currentIndex = getActiveStatusIndex();
    const totalSteps = statusOrder.length;
    const progressWidth = (currentIndex / (totalSteps - 1)) * 100;
    return `${progressWidth}%`;
  };

  const getStatusPosition = () => {
    const currentIndex = getActiveStatusIndex();
    const totalSteps = statusOrder.length;
    const position = (currentIndex / (totalSteps - 1)) * 100;
    return position;
  };

  const handleStatusUpdate = async (newStatusIndex: number) => {
    if (
      !mappedData?.cargo ||
      newStatusIndex < 0 ||
      newStatusIndex >= statusOrder.length
    )
      return;

    const newStatus = reverseStatusMapping[statusOrder[newStatusIndex]];
    if (!newStatus) return;

    try {
      await updateCargoStatusInfo(params.cargo_id as string, {
        status: newStatus,
        customsClearanceDate: mappedData.cargo.customsClearanceDate || "",
        warehouseEntryDate: mappedData.cargo.warehouseEntryDate || "",
        quarantineDate: mappedData.cargo.quarantineDate || "",
        shippingCompany: mappedData.shipment?.shippingCompany || "",
        palletOrderDate: mappedData.shipment?.palletOrderDate || "",
        palletType: mappedData.shipment?.palletType || "",
      });

      await setMappedData(params.cargo_id as string);

      toast({
        title: "성공",
        description: `상태가 "${statusOrder[newStatusIndex]}"로 변경되었습니다.`,
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

  // 마우스 위치를 기반으로 가장 가까운 단계 계산
  const calculateNearestStep = (clientX: number) => {
    if (!progressBarRef.current) return 0;

    const rect = progressBarRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));

    const totalSteps = statusOrder.length;
    const stepSize = 100 / (totalSteps - 1);
    const nearestStep = Math.round(percentage / stepSize);

    return Math.max(0, Math.min(totalSteps - 1, nearestStep));
  };

  // handleDragStart, handleDragMove, handleDragEnd 모두 dragPosition만 set
  const handleDragStart = (e: React.MouseEvent) => {
    if (!isEditMode) return;
    setIsDragging(true);
    e.preventDefault();
    const nearestStep = calculateNearestStep(e.clientX);
    setDragPosition(nearestStep);
  };

  const handleDragMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging || !isEditMode) return;
      const nearestStep = calculateNearestStep(e.clientX);
      setDragPosition(nearestStep);
    },
    [isDragging, isEditMode, calculateNearestStep],
  );

  const handleDragEnd = useCallback(() => {
    if (!isDragging) return;
    setIsDragging(false);
    setDragPosition((prev) => prev); // dragPosition만 유지, 서버 반영 X
  }, [isDragging]);

  // 편집 완료 버튼 클릭 시에만 서버에 반영
  const handleEditComplete = () => {
    if (dragPosition !== null && dragPosition !== getCurrentStatusIndex()) {
      handleStatusUpdate(dragPosition);
    }
    setIsEditMode(false);
  };

  // 취소 버튼 클릭 시 dragPosition을 원래 상태로 복구
  const handleEditCancel = () => {
    setDragPosition(getCurrentStatusIndex());
    setIsEditMode(false);
  };

  // 전역 마우스 이벤트 리스너
  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleDragMove);
      document.addEventListener("mouseup", handleDragEnd);
    }

    return () => {
      document.removeEventListener("mousemove", handleDragMove);
      document.removeEventListener("mouseup", handleDragEnd);
    };
  }, [isDragging, handleDragMove, handleDragEnd]);

  return (
    <>
      {loading || !mappedData ? (
        <Box className="w-full h-screen flex justify-center items-center">
          <Typography className="ml-4 text-lg">로딩 중...</Typography>
        </Box>
      ) : (
        <div className="min-h-screen bg-background-paper">
          {/* 헤더 */}
          <Box className="w-full h-16 px-10 bg-background-default flex justify-between items-center">
            <Typography
              variant="h4"
              className="text-success-darker font-bold font-['Public_Sans']"
            >
              상세보기
            </Typography>

            {/* 편집 모드 토글 버튼 */}
          </Box>

          {/* 진행 상태 */}
          <Box className="w-full h-32 p-4 relative">
            <Container maxWidth="xl" className="progress-container h-full">
              {/* 편집 모드 안내 텍스트 */}
              {isEditMode && (
                <Typography
                  className="absolute text-xs text-gray-500 whitespace-nowrap bg-white px-2 py-1 rounded shadow-sm"
                  style={{
                    left: "50%",
                    top: 0,
                    transform: "translateX(-50%)",
                  }}
                >
                  {isDragging
                    ? "드래그 중... 잠시 멈춰서 상태를 저장하세요"
                    : "동그라미를 드래그하거나 점을 클릭하여 상태를 변경하세요"}
                </Typography>
              )}
              <Box className="relative h-full flex items-center">
                {/* 프로그레스 바 배경 */}
                <Box
                  ref={progressBarRef}
                  className={`w-full h-3 bg-gray-200 rounded-2xl ${
                    isEditMode ? "cursor-pointer" : ""
                  }`}
                  onMouseDown={handleDragStart}
                />

                {/* 프로그레스 바 진행 상태 */}
                <Box
                  className="absolute h-3 bg-gradient-to-r from-green-300 to-green-500 rounded-2xl transition-all duration-300 pointer-events-none"
                  style={{ width: getProgressBarWidth() }}
                />

                {/* 상태 포인트들 표시 (편집 모드일 때만) */}
                {isEditMode &&
                  statusOrder.map((status, index) => {
                    const position = (index / (statusOrder.length - 1)) * 100;

                    return (
                      <Box
                        key={status}
                        className={`absolute w-3 h-3 rounded-full transition-all duration-200 cursor-pointer ${
                          index <= getActiveStatusIndex()
                            ? "bg-green-600 shadow-md"
                            : "bg-gray-400"
                        } hover:scale-125`}
                        style={{
                          left: `${position}%`,
                          top: "50%",
                          transform: "translate(-50%, -50%)",
                          zIndex: 10,
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (isEditMode) {
                            setDragPosition(index);
                          }
                        }}
                      />
                    );
                  })}

                {/* 현재 상태 표시 (큰 동그라미) */}
                <Box
                  className={`absolute transition-none z-20 ${
                    isEditMode ? "cursor-grab" : ""
                  } ${isDragging ? "cursor-grabbing" : ""}`}
                  style={{
                    left: `${getStatusPosition()}%`,
                    top: "50%",
                    transform: "translate(-50%, -50%)",
                  }}
                  onMouseDown={handleDragStart}
                >
                  <Box
                    className={`w-12 h-12 bg-white rounded-full border-4 border-emerald-600 shadow-lg transition-all duration-300 ${
                      isEditMode
                        ? "hover:border-emerald-700 hover:scale-110"
                        : ""
                    } ${isDragging ? "scale-125 shadow-2xl border-emerald-800" : ""}`}
                  >
                    {/* 내부 작은 동그라미 */}
                    <Box className="w-full h-full rounded-full bg-emerald-600 opacity-20" />
                  </Box>
                </Box>

                {/* 현재 상태 텍스트 */}
                <Typography
                  className={`absolute text-sm font-semibold font-['Public_Sans'] whitespace-nowrap transition-none pointer-events-none ${
                    isDragging ? "text-emerald-800" : "text-emerald-600"
                  }`}
                  style={{
                    left: `${getStatusPosition()}%`,
                    top: "calc(50% + 35px)",
                    transform: "translateX(-50%)",
                  }}
                >
                  {statusOrder[getActiveStatusIndex()]
                    ? statusOrder[getActiveStatusIndex()]
                    : ""}
                </Typography>
              </Box>
            </Container>
          </Box>
          <Stack
            direction="row"
            spacing={2}
            sx={{
              justifyContent: "flex-end",
              paddingX: { xs: 2, md: 3 },
              marginTop: 2,
            }}
          >
            <CommonButton
              variant="secondary"
              editMode={isEditMode}
              onClick={
                isEditMode
                  ? handleEditComplete
                  : () => {
                      setIsEditMode(true);
                      setIsDragging(false);
                      setDragPosition(getCurrentStatusIndex());
                    }
              }
            >
              {isEditMode ? "편집 완료" : "편집모드"}
            </CommonButton>

            {isEditMode && (
              <CommonButton variant="outline" onClick={handleEditCancel}>
                취소
              </CommonButton>
            )}
          </Stack>

          <Container maxWidth="xl" className="mt-8">
            {/* 메뉴 버튼 */}
            <Box className="mb-8">
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={2}
                justifyContent="space-between"
                alignItems="center"
              >
                <div className="overflow-auto w-full flex flex-col gap-4">
                  <Stack
                    direction="row"
                    spacing={2}
                    sx={{
                      width: "100%",
                      justifyContent: "flex-start",
                      pb: 1,
                      overflowX: "auto",
                      flexWrap: "nowrap",
                      minWidth: "max-content",
                      "& > *": {
                        flexShrink: 0,
                      },
                    }}
                  >
                    <CommonButton
                      variant={activeTab === "entire" ? "primary" : "inherit"}
                      onClick={() => setActiveTab("entire")}
                    >
                      전체정보
                    </CommonButton>
                    <CommonButton
                      variant={activeTab === "document" ? "primary" : "inherit"}
                      onClick={() => setActiveTab("document")}
                    >
                      서류정보
                    </CommonButton>
                    <CommonButton
                      variant={activeTab === "cargo" ? "primary" : "inherit"}
                      onClick={() => setActiveTab("cargo")}
                    >
                      화물 정보
                    </CommonButton>
                    <CommonButton
                      variant={activeTab === "stock" ? "primary" : "inherit"}
                      onClick={() => setActiveTab("stock")}
                    >
                      재고 정보
                    </CommonButton>
                    <CommonButton
                      variant={activeTab === "history" ? "primary" : "inherit"}
                      onClick={() => setActiveTab("history")}
                    >
                      히스토리
                    </CommonButton>
                  </Stack>
                </div>
              </Stack>
            </Box>
            {renderContent()}
            <Box className="w-[1093px] h-[50px]" />
          </Container>

          <ToastComponent />
        </div>
      )}
    </>
  );
}
