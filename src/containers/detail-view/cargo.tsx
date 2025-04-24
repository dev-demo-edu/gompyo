"use client";

import DetailForm from "@/components/detail-form";
import {
  itemFields,
  packagingFields,
  statusFields,
  PackagingData,
  StatusData,
  remarkField,
} from "@/constants/cargo";
import { useAtom } from "jotai";
import { useToast } from "@/hooks/use-toast";
import {
  cargoDetailAtom,
  cargoLoadingAtom,
  updateCargoAtom,
} from "@/states/detail";
import { Box, CircularProgress } from "@mui/material";
import { FieldValue } from "@/constants/entire";
import { CalculatedCargoDetailData } from "@/services/cargo-calculator";

interface CargoProps {
  cargoId: string;
}

// mappedData의 값을 변환하는 함수
const transformDataForForm = (
  data: Record<string, FieldValue>,
): Record<string, FieldValue> => {
  if (!data) return {};

  return Object.entries(data).reduce(
    (acc, [key, value]) => {
      if (value === null || value === undefined) {
        acc[key] = "";
      } else {
        acc[key] = value as FieldValue;
      }
      return acc;
    },
    {} as Record<string, FieldValue>,
  );
};

// 포장 정보 데이터를 변환하는 함수
const transformPackagingData = (
  itemData: CalculatedCargoDetailData["item"],
  cargoData: CalculatedCargoDetailData["cargo"],
): PackagingData => {
  return {
    packingUnit: itemData?.packingUnit || null,
    contractTon: cargoData?.contractTon || null,
    containerCount: cargoData?.containerCount || null,
  };
};

const transformStatusData = (
  cargoData: CalculatedCargoDetailData["cargo"],
  shipmentData: CalculatedCargoDetailData["shipment"],
): StatusData => {
  return {
    palletOrderDate: shipmentData?.palletOrderDate || null,
    palletType: shipmentData?.palletType || null,
    shippingCompany: shipmentData?.shippingCompany || null,
    customsClearanceDate: cargoData?.customsClearanceDate || null,
    warehouseEntryDate: cargoData?.warehouseEntryDate || null,
    quarantineDate: cargoData?.quarantineDate || null,
  };
};

export default function Cargo({ cargoId }: CargoProps) {
  const [mappedData] = useAtom(cargoDetailAtom);
  const [loading] = useAtom(cargoLoadingAtom);
  const [, updateCargo] = useAtom(updateCargoAtom);
  const { toast, ToastComponent } = useToast();

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

  // 각 영역에 맞는 데이터 변환
  const itemData = transformDataForForm(mappedData.item);
  // 포장 정보는 items와 cargo 데이터를 모두 포함
  const packagingData = transformDataForForm(
    transformPackagingData(mappedData.item, mappedData.cargo),
  );
  const statusData = transformDataForForm(
    transformStatusData(mappedData.cargo, mappedData.shipment),
  );
  // 비고 데이터 변환
  const remarkData = { remark: mappedData.cargo?.remark || "" };

  return (
    <>
      <div className="flex flex-col gap-6">
        <DetailForm
          title="상품 정보"
          fields={itemFields}
          data={itemData}
          onSave={(formData) => handleDataUpdate(formData)}
        />
        <DetailForm
          title="포장 정보"
          fields={packagingFields}
          data={packagingData}
          onSave={(formData) => handleDataUpdate(formData)}
        />
        <DetailForm
          title="상태 정보"
          fields={statusFields}
          data={statusData}
          onSave={(formData) => handleDataUpdate(formData)}
        />
        <DetailForm
          title="비고"
          fields={[remarkField]}
          data={remarkData}
          onSave={(formData) => handleDataUpdate(formData)}
        />
      </div>
      <ToastComponent />
    </>
  );
}
