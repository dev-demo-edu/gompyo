"use client";
import { Box, CircularProgress } from "@mui/material";
import DetailForm from "@/components/detail-form";
import { FieldValue } from "@/constants/entire";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAtom, useSetAtom } from "jotai";
import {
  cargoDetailAtom,
  cargoLoadingAtom,
  cargoErrorAtom,
  updateCargoAtom,
} from "@/states/detail";
import {
  contractFields,
  paymentFields,
  costFields,
  contractAmountFields,
  expenseFields,
} from "@/constants/entire";

interface EntireViewProps {
  cargoId: string;
}

export default function EntireView({ cargoId }: EntireViewProps) {
  const [mappedData, setMappedData] = useAtom(cargoDetailAtom);
  const [loading, setLoading] = useAtom(cargoLoadingAtom);
  const setError = useSetAtom(cargoErrorAtom);
  const [, updateCargo] = useAtom(updateCargoAtom);
  const { toast, ToastComponent } = useToast();

  useEffect(() => {
    async function fetchData() {
      if (mappedData) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        await setMappedData(cargoId);
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
    console.log(mappedData);
  }, [cargoId, mappedData, setMappedData, setLoading, setError]);

  const handleDataUpdate = async (formData: Record<string, FieldValue>) => {
    if (!mappedData) return;

    try {
      await updateCargo({
        formData,
        cargoId,
      });

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

  if (!mappedData) {
    return <div></div>;
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
          onSave={(formData) => handleDataUpdate(formData)}
        />

        {/* 결제 정보 */}
        <DetailForm
          title="결제 정보"
          fields={paymentFields}
          className="w-full"
          data={mappedData.payment}
          onSave={(formData) => handleDataUpdate(formData)}
        />

        {/* 원가 정보 */}
        <DetailForm
          title="원가 정보"
          fields={costFields}
          className="w-full md:w-[calc(50%-12px)]"
          data={{
            ...mappedData.costDetail,
            purchaseFeeRate: mappedData.cargo.purchaseFeeRate,
          }}
          onSave={(formData) => handleDataUpdate(formData)}
        />

        {/* 계약처 금액 정보 */}
        <DetailForm
          title="계약처 금액 정보"
          fields={contractAmountFields}
          className="w-full md:w-[calc(50%-12px)]"
          data={mappedData.cost}
          onSave={(formData) => handleDataUpdate(formData)}
        />

        {/* 비용 정보 */}
        <DetailForm
          title="비용 정보"
          fields={expenseFields}
          className="w-full"
          data={mappedData.cargo}
          onSave={(formData) => handleDataUpdate(formData)}
        />
      </Box>
    </>
  );
}
