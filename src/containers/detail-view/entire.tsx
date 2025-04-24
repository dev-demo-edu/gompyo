"use client";
import { Box, CircularProgress } from "@mui/material";
import DetailForm from "@/components/detail-form";
import { FieldValue } from "@/constants/entire";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAtom, useSetAtom } from "jotai";
import {
  cargoDetailAtom,
  cargoLoadingAtom,
  cargoErrorAtom,
  updateCargoAtom,
} from "@/states/detail";
import {
  createContractFields,
  paymentFields,
  costFields,
  contractAmountFields,
  expenseFields,
  paymentMethodFields,
  FieldValueType,
} from "@/constants/entire";
import { BlNumberUpdateModal } from "@/components/bl-number-update-modal";
interface EntireViewProps {
  cargoId: string;
}
import { getAllImporters } from "@/actions/importer";
import { Importer } from "@/types/importer";

export default function EntireView({ cargoId }: EntireViewProps) {
  const [mappedData, setMappedData] = useAtom(cargoDetailAtom);
  const [loading, setLoading] = useAtom(cargoLoadingAtom);
  const setError = useSetAtom(cargoErrorAtom);
  const [, updateCargo] = useAtom(updateCargoAtom);
  const { toast, ToastComponent } = useToast();
  const [modalOpen, setModalOpen] = useState(false);
  const [pendingFormData, setPendingFormData] = useState<Record<
    string,
    FieldValue
  > | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<string>("");

  const [importers, setImporters] = useState<Importer[]>([]);

  useEffect(() => {
    const fetchImporters = async () => {
      const importers = await getAllImporters();
      setImporters(importers);
    };
    fetchImporters();
  }, []);

  // 결제 정보 필드 상태 관리
  const [currentPaymentFields, setCurrentPaymentFields] = useState(() => {
    console.log("Initializing currentPaymentFields");
    return paymentFields;
  });

  // mappedData가 변경될 때마다 결제 방식 설정
  useEffect(() => {
    console.log(
      "mappedData effect triggered, paymentMethod:",
      mappedData?.payment?.paymentMethod,
    );
    if (mappedData?.payment?.paymentMethod) {
      const paymentMethod = mappedData.payment.paymentMethod as string;
      setSelectedPaymentMethod(paymentMethod);
    }
  }, [mappedData?.payment?.paymentMethod]);

  // 결제 방식이 변경될 때 호출되는 함수
  const handlePaymentMethodChange = (method: string) => {
    console.log("handlePaymentMethodChange called with:", method);
    setSelectedPaymentMethod(method);

    // 결제 방식에 따른 필드 설정
    if (!method) {
      setCurrentPaymentFields(paymentFields);
      return;
    }

    // L/C at sight와 Payment Usance의 경우 실제 키 값으로 변환
    const actualMethod =
      method === "L/C at sight"
        ? "L/C"
        : method === "Payment Usance"
          ? "Usance"
          : method;

    const methodFields = paymentMethodFields[actualMethod] || [];
    setCurrentPaymentFields([...paymentFields, ...methodFields]);
  };

  // DetailForm에 전달할 데이터
  const paymentData = {
    ...mappedData?.payment,
    paymentMethod: selectedPaymentMethod || mappedData?.payment?.paymentMethod,
    exchangeRate: mappedData?.costDetail?.exchangeRate,
  };

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
  }, [cargoId, mappedData, setMappedData, setLoading, setError]);

  const handleDataUpdate = async (formData: Record<string, FieldValue>) => {
    if (!mappedData) return;

    if (formData.paymentMethod === "T/T") {
      formData.totalContractAmount =
        (mappedData.costDetail.unitPrice || 0) *
        (mappedData.costDetail.exchangeRate || 0) *
        (mappedData.cargo.contractTon || 0);
    }
    // 결제 방식에 따른 데이터 변환
    const transformedFormData = { ...formData };

    // B/L 번호 변경 여부 확인 (contract 필드에서만 확인)
    if (
      transformedFormData.blNumber &&
      transformedFormData.blNumber !== mappedData.contract.blNumber
    ) {
      setPendingFormData(transformedFormData);
      setModalOpen(true);
      return;
    }

    try {
      await updateCargo({
        formData: transformedFormData,
        cargoId,
      });

      // 데이터 갱신
      await setMappedData(cargoId);

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

  const handleModalSelect = async (option: "all" | "single") => {
    setModalOpen(false);
    if (pendingFormData) {
      try {
        await updateCargo({
          formData: pendingFormData,
          cargoId,
          option,
        });

        // 데이터 갱신
        await setMappedData(cargoId);

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
      setPendingFormData(null);
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
      <BlNumberUpdateModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSelect={handleModalSelect}
      />
      <Box className="w-full mx-auto inline-flex justify-start items-start gap-6 flex-wrap content-start">
        {/* 계약 정보 */}
        <DetailForm
          title="계약 정보"
          fields={createContractFields(importers)}
          className="w-full"
          data={mappedData.contract}
          onSave={(formData) => handleDataUpdate(formData)}
        />

        {/* 결제 정보 */}
        <DetailForm
          title="결제 정보"
          fields={currentPaymentFields}
          className="w-full"
          data={paymentData}
          onSave={(formData) => {
            handleDataUpdate(formData);
          }}
          onFieldChange={(fieldName: string, value: FieldValueType) => {
            if (fieldName === "paymentMethod") {
              handlePaymentMethodChange(value as string);
            }
          }}
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

        {/* 수입회사 금액 정보 */}
        <DetailForm
          title="수입회사 금액 정보"
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
