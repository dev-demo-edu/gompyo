"use server";
import { CargoService } from "@/services/cargo.service";
const cargoService = new CargoService();

import { getCargoDetail } from "./common";

export async function updateCargoItemInfo(
  cargoId: string,
  data: Record<string, string>,
) {
  try {
    const cargo = await cargoService.findById(cargoId);
    if (!cargo) {
      throw new Error("화물 정보를 찾을 수 없습니다.");
    }

    await cargoService.update(cargoId, {
      itemsId: data.itemName,
    });

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
