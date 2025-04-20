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
import Documents from "@/containers/detail-view/documents";
import History from "@/containers/detail-view/history";
import { HistoryData } from "@/types/history";
import { nanoid } from "nanoid";
import {
  CargoStatus,
  statusMapping,
  reverseStatusMapping,
} from "@/constants/cargo-status";
import { useRouter } from "next/navigation";

// 상태 순서 정의
const statusOrder = Object.values(CargoStatus);

export default function DetailPage() {
  const params = useParams();
  const [activeTab, setActiveTab] = useState<
    "entire" | "document" | "cargo" | "history"
  >("entire");
  const [mappedData, setMappedData] = useAtom(cargoDetailAtom);
  const { toast, ToastComponent } = useToast();
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    async function fetchCargoData() {
      try {
        if (mappedData && mappedData.cargo.id === params.cargo_id) {
          setLoading(false); // 이미 있으면 로딩 종료
          return;
        }

        await setMappedData(params.cargo_id as string);
        setLoading(false); // ✅ 데이터 불러온 후 로딩 종료
      } catch (err) {
        console.error("화물 데이터 가져오기 실패:", err);
        router.push("/404");
      }
    }

    fetchCargoData();
  }, [params.cargo_id]);

  const renderContent = () => {
    switch (activeTab) {
      case "entire":
        return <CargoDetail cargoId={params.cargo_id as string} />;
      case "document":
        return <Documents cargoId={params.cargo_id as string} />;
      case "cargo":
        return <CargoInfo cargoId={params.cargo_id as string} />;
      case "history":
        if (!mappedData) {
          return (
            <Box className="w-full h-full flex items-center justify-center">
              <Typography>데이터가 없습니다.</Typography>
            </Box>
          );
        }

        const historyData: HistoryData = {
          orderTime: mappedData.contract.contractDate || "N/A",
          paymentTime: mappedData.payment.paymentDueDate || "N/A",
          deliveryTime: mappedData.shipment.estimatedTimeDeparture || "N/A",
          completionTime: mappedData.shipment.estimatedTimeArrival || "N/A",
          historyItems: [
            {
              id: nanoid(),
              title: "화물 계약 체결",
              description: "계약이 성공적으로 체결되었습니다.",
              time: mappedData.contract.contractDate || "N/A",
              isActive: true,
              type: "contract",
            },
            {
              id: nanoid(),
              title: "결제 완료",
              description: "결제가 정상적으로 완료되었습니다.",
              time: mappedData.payment.paymentDueDate || "N/A",
              isActive: !!mappedData.payment.paymentDueDate,
              type: "payment",
            },
            {
              id: nanoid(),
              title: "화물 출발",
              description: "화물이 출발했습니다.",
              time: mappedData.shipment.estimatedTimeDeparture || "N/A",
              isActive: !!mappedData.shipment.estimatedTimeDeparture,
              type: "shipment",
            },
            {
              id: nanoid(),
              title: "화물 도착",
              description: "화물이 안전하게 도착했습니다.",
              time: mappedData.shipment.estimatedTimeArrival || "N/A",
              isActive: !!mappedData.shipment.estimatedTimeArrival,
              type: "completion",
            },
          ],
        };

        return <History data={historyData} />;
      default:
        return null;
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
    const progressWidth = (currentIndex / (totalSteps - 1)) * 100;
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
    const position = (index / (totalSteps - 1)) * 100;
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
          </Box>

          {/* 진행 상태 */}
          <Box className="w-full h-24 p-4 relative">
            <Container maxWidth="xl" className="progress-container h-full">
              <Box className="relative h-full flex items-center">
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
                    left: `calc(${getStatusPosition()})`,
                    top: "50%",
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  <Box className="w-10 h-10 bg-white rounded-full border-[3px] border-emerald-600 transition-colors duration-300" />
                </Box>
                <Typography
                  className="absolute text-sm font-normal font-['Public_Sans'] text-emerald-600 whitespace-nowrap transition-all duration-500 ease-in-out"
                  style={{
                    left: `calc(${getStatusPosition()})`,
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
                direction={{ xs: "column", sm: "row" }}
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
      )}
    </>
  );
}
