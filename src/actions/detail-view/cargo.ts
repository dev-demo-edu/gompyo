"use server";

import { CargoService } from "@/services/cargo.service";
import { ShipmentService } from "@/services/shipment.service";
import { ItemsService } from "@/services/items.service";
import { getUser } from "@/actions/user";
import { statusMapping } from "@/constants/cargo-status";

const cargoService = new CargoService();
const shipmentService = new ShipmentService();
const itemsService = new ItemsService();

import { getCargoDetail } from "./common";
import { addStatusLog } from "./history";

export async function updateCargoItemInfo(
  cargoId: string,
  data: Record<string, string>,
) {
  try {
    const cargo = await cargoService.findById(cargoId);
    if (!cargo) {
      throw new Error("화물 정보를 찾을 수 없습니다.");
    }

    const item = await itemsService.findOrCreate({
      itemName: data.itemName,
      itemVariety: data.itemVariety,
      originCountry: data.originCountry,
      hsCode: data.hsCode,
      packingUnit: data.packingUnit,
    });

    if (!cargo.itemsId || cargo.itemsId !== item.id) {
      await cargoService.update(cargoId, {
        itemsId: item.id,
      });
    }

    return await getCargoDetail(cargoId);
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

    // cargo 테이블 업데이트
    await cargoService.update(cargoId, {
      containerCount: data.containerCount
        ? parseInt(data.containerCount)
        : null,
      contractTon: data.contractTonnage
        ? parseFloat(data.contractTonnage)
        : null,
    });

    // items 테이블 업데이트

    return await getCargoDetail(cargoId);
  } catch (error) {
    console.error("포장 정보 업데이트 중 오류 발생:", error);
    throw error;
  }
}

export async function updateCargoStatusInfo(
  cargoId: string,
  data: Record<string, string>,
) {
  try {
    const cargo = await cargoService.findById(cargoId);
    if (!cargo) {
      throw new Error("화물 정보를 찾을 수 없습니다.");
    }

    const currentUser = await getUser();
    await addStatusLog({
      targetId: cargoId,
      user: currentUser?.name || "",
      status: statusMapping[data.status as keyof typeof statusMapping],
    });

    // cargo 테이블 업데이트
    await cargoService.update(cargoId, {
      customsClearanceDate: data.customsClearanceDate || null,
      warehouseEntryDate: data.warehouseEntryDate || null,
      quarantineDate: data.quarantineDate || null,
      progressStatus: data.status,
    });

    // shipment 테이블 업데이트
    if (cargo.shipmentId) {
      await shipmentService.update(cargo.shipmentId, {
        shippingCompany: data.shippingCompany,
        palletOrderDate: data.palletOrderDate || null,
        palletType: data.palletType,
      });
    }

    return await getCargoDetail(cargoId);
  } catch (error) {
    console.error("상태 정보 업데이트 중 오류 발생:", error);
    throw error;
  }
}
