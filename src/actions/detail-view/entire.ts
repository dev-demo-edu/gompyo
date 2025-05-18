"use server";
import { CargoService } from "@/services/cargo.service";
import { ShipmentService } from "@/services/shipment.service";
import { nanoid } from "nanoid";
import { FieldValue } from "@/constants/entire";

const cargoService = new CargoService();
const shipmentService = new ShipmentService();

import { getCargoDetail } from "./common";

export async function createNewShipmentAndUpdateCargo(
  cargoId: string,
  data: Record<string, FieldValue>,
  option?: "all" | "single",
) {
  try {
    const cargo = await cargoService.findById(cargoId);
    if (!cargo) {
      throw new Error("화물 정보를 찾을 수 없습니다.");
    }

    // B/L 번호가 변경되었고, 특정 화물만 업데이트하는 경우
    if (data.blNumber && option === "single") {
      const shipment = await shipmentService.findById(cargo.shipmentId);
      if (!shipment) {
        throw new Error("선적 정보를 찾을 수 없습니다.");
      }

      // B/L 번호가 실제로 변경되었는지 확인
      if (data.blNumber !== shipment.blNumber) {
        // 새로운 Shipment 생성
        const newShipment = await shipmentService.create({
          id: nanoid(),
          blNumber: String(data.blNumber),
          contractId: shipment.contractId,
          estimatedTimeArrival: shipment.estimatedTimeArrival,
          estimatedTimeDeparture: shipment.estimatedTimeDeparture,
          arrivalPort: shipment.arrivalPort,
          shippingCompany: shipment.shippingCompany,
          departurePort: shipment.departurePort,
          palletOrderDate: shipment.palletOrderDate,
          palletType: shipment.palletType,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        } as const);

        return newShipment;
      }
    }
    return null;
  } catch (error) {
    console.error("상품 정보 업데이트 중 오류 발생:", error);
    throw error;
  }
}

export async function updateCargoPackagingInfo(
  cargoId: string,
  data: Record<string, string>,
) {
  try {
    const cargo = await cargoService.findById(cargoId);
    if (!cargo) {
      throw new Error("화물 정보를 찾을 수 없습니다.");
    }

    await cargoService.update(cargoId, {
      containerCount: data.containerCount
        ? parseInt(data.containerCount)
        : null,
      contractTon: data.contractTonnage
        ? parseFloat(data.contractTonnage)
        : null,
    });

    return await getCargoDetail(cargoId);
  } catch (error) {
    console.error("포장 정보 업데이트 중 오류 발생:", error);
    throw error;
  }
}
