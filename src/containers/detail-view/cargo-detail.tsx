"use client";
import { Box, CircularProgress } from "@mui/material";
import DetailForm from "@/components/detail-form";
import { getCargoDetail, updateCargoDetail } from "@/actions/cargo-detail";
import { useEffect, useState } from "react";
import { CargoDetailData } from "@/types/cargo-detail";
import { mapAndCalculateCargoDetails } from "@/services/cargo-calculator";
import { useToast } from "@/hooks/use-toast";

const contractFields = [
  { name: "contractNumber", label: "계약 번호" },
  { name: "contractDate", label: "계약 일자" },
  {
    name: "contractor", // TODO: 계약처 목록 추가 필요
    label: "계약처",
    type: "select" as const,
    options: [
      { value: "1", label: "계약자1" },
      { value: "2", label: "계약자2" },
      { value: "3", label: "계약자3" },
    ],
  },
  { name: "importer", label: "수입처" },
  { name: "departurePort", label: "출발항", gridSize: 6 },
  { name: "arrivalPort", label: "도착항", gridSize: 6 },
  { name: "etd", label: "ETD", gridSize: 6 },
  { name: "eta", label: "ETA", gridSize: 6 },
  { name: "blNumber", label: "B/L 번호" },
];

const paymentFields = [
  { name: "paymentMethod", label: "결제 방식", hasEditButton: true },
  { name: "depositDate", label: "선급금 날짜", gridSize: 6 },
  { name: "balanceDate", label: "잔금 날짜", gridSize: 6 },
  { name: "depositRatio", label: "선급금 비율", gridSize: 6 },
  { name: "balanceRatio", label: "잔금 비율", gridSize: 6 },
  { name: "depositAmount", label: "선급금 금액", gridSize: 6 },
  { name: "balanceAmount", label: "잔금 금액", gridSize: 6 },
];

const costFields = [
  { name: "unitPrice", label: "단가 MT / $" },
  { name: "totalContractPrice", label: "총 계약가" },
  { name: "exchangeRate", label: "환율", hasEditButton: true },
  { name: "costPerKg", label: "원가 Kg / ₩" },
  { name: "tariffRate", label: "관세율" },
  { name: "transferFee", label: "송금수수료" },
  { name: "customsFee", label: "관세수수료" },
  { name: "inspectionFee", label: "검사료" },
  { name: "doCharge", label: "D/O Charge" },
  { name: "otherCosts", label: "기타비용" },
  { name: "purchaseFeeRate", label: "매입 수수료율" },
];

const contractAmountFields = [
  { name: "contractorCost", label: "계약처 원가" },
  { name: "SupplyPrice", label: "계약처 수급가" },
  { name: "contractorProfit", label: "계약처 이익" },
  { name: "shippingCost", label: "배송비" },
  { name: "laborCost", label: "작업료" },
  { name: "transportStorageFee", label: "운송/보관료" },
  { name: "loadingUnloadingFee", label: "상하차 비용" },
];

const expenseFields = [
  { name: "totalCost", label: "총비용" },
  { name: "sellingPrice", label: "판매가" },
  { name: "margin", label: "마진" },
  { name: "totalProfit", label: "총이익" },
];

export default function CargoDetail({
  cargoId,
  cargoData,
}: {
  cargoId: string;
  cargoData: CargoDetailData | null;
}) {
  const [data, setData] = useState<CargoDetailData | null>(cargoData);
  const [mappedData, setMappedData] = useState<ReturnType<
    typeof mapAndCalculateCargoDetails
  > | null>(cargoData ? mapAndCalculateCargoDetails(cargoData) : null);
  const [loading, setLoading] = useState(!cargoData);
  const [error, setError] = useState<string | null>(null);
  const { toast, ToastComponent } = useToast();

  useEffect(() => {
    async function fetchData() {
      if (cargoData) {
        setData(cargoData);
        setMappedData(mapAndCalculateCargoDetails(cargoData));
        setLoading(false);
        return;
      }

      try {
        const result = await getCargoDetail(cargoId);
        setData(result);
        setMappedData(mapAndCalculateCargoDetails(result));
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "데이터를 불러오는 중 오류가 발생했습니다.",
        );
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [cargoId, cargoData]);

  const handleDataUpdate = async (
    section: keyof ReturnType<typeof mapAndCalculateCargoDetails>,
    formData: Record<string, string>,
  ) => {
    if (!data || !mappedData) return;

    try {
      // 서버에 업데이트 요청
      const updateData: Partial<CargoDetailData> = {};

      // 섹션별 데이터 매핑
      switch (section) {
        case "contract":
          updateData.contract = {
            ...data.contract,
            ...formData,
          };
          break;
        case "payment":
          updateData.payment = {
            ...data.payment,
            ...formData,
          };
          break;
        case "costDetail":
          updateData.costDetail = {
            ...data.costDetail,
            ...formData,
          };
          break;
        case "cost":
          updateData.cost = {
            ...data.cost,
            ...formData,
          };
          break;
        case "cargo":
          updateData.cargo = {
            ...data.cargo,
            ...formData,
          };
          break;
      }

      // 서버 업데이트
      const updatedData = await updateCargoDetail(cargoId, updateData);
      setData(updatedData);
      setMappedData(mapAndCalculateCargoDetails(updatedData));

      toast({
        title: "성공",
        description: "데이터가 성공적으로 저장되었습니다.",
      });
    } catch (err) {
      toast({
        title: "오류",
        description:
          err instanceof Error
            ? err.message
            : "데이터 저장 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <Box className="w-full h-full flex items-center justify-center">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <div>에러: {error}</div>;
  }

  if (!mappedData) {
    return <div>데이터가 없습니다.</div>;
  }

  return (
    <>
      <ToastComponent />
      <Box className="w-full mx-auto inline-flex justify-start items-start gap-6 flex-wrap content-start">
        {/* 계약 정보 */}
        <DetailForm
          title="계약 정보"
          fields={contractFields}
          className="w-full"
          data={mappedData.contract}
          onSave={(formData) => handleDataUpdate("contract", formData)}
        />

        {/* 결제 정보 */}
        <DetailForm
          title="결제 정보"
          fields={paymentFields}
          className="w-full"
          data={mappedData.payment}
          onSave={(formData) => handleDataUpdate("payment", formData)}
        />

        {/* 원가 정보 */}
        <DetailForm
          title="원가 정보"
          fields={costFields}
          className="w-full md:w-[calc(50%-12px)]"
          data={mappedData.costDetail}
          onSave={(formData) => handleDataUpdate("costDetail", formData)}
        />

        {/* 계약처 금액 정보 */}
        <DetailForm
          title="계약처 금액 정보"
          fields={contractAmountFields}
          className="w-full md:w-[calc(50%-12px)]"
          data={mappedData.cost}
          onSave={(formData) => handleDataUpdate("cost", formData)}
        />

        {/* 비용 정보 */}
        <DetailForm
          title="비용 정보"
          fields={expenseFields}
          className="w-full"
          data={mappedData.cargo}
          onSave={(formData) => handleDataUpdate("cargo", formData)}
        />
      </Box>
    </>
  );
}
