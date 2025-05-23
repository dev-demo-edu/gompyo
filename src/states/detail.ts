"use client";

import { atom } from "jotai";
import { CargoDetailData, Shipment } from "@/types/cargo-detail";
import { FieldValue } from "@/constants/entire";
import {
  getCargoDetail,
  updateCargoDetail,
} from "@/actions/detail-view/common";
import { mapAndCalculateCargoDetails } from "@/services/cargo-calculator";
import { createNewShipmentAndUpdateCargo } from "@/actions/detail-view/entire";
import {
  addUnclearedStockNumber,
  switchImporter,
} from "@/actions/detail-view/stock";
// 원본 데이터는 private atom으로 관리
const privateCargoDetailAtom = atom<CargoDetailData | null>(null);

// 편집 시작 시점의 데이터를 저장하는 atom
const originalDataBeforeEditAtom = atom<CargoDetailData | null>(null);

// 외부에서는 mapped data만 접근 가능하도록 설정
export const cargoDetailAtom = atom(
  // getter
  (get) => {
    const data = get(privateCargoDetailAtom);
    return data ? mapAndCalculateCargoDetails(data) : null;
  },
  // setter
  async (get, set, cargoId: string) => {
    try {
      const data = await getCargoDetail(cargoId);
      set(privateCargoDetailAtom, data);
    } catch (error) {
      console.error("화물 정보 조회 중 오류 발생:", error);
      throw error;
    }
  },
);

// 로딩 상태
export const cargoLoadingAtom = atom<boolean>(false);

// 에러 상태
export const cargoErrorAtom = atom<string | null>(null);

// 편집 시작 함수
export const startEditAtom = atom(null, (get, set) => {
  const currentData = get(privateCargoDetailAtom);
  if (currentData) {
    set(originalDataBeforeEditAtom, JSON.parse(JSON.stringify(currentData)));
  }
});

// 취소 함수
export const cancelEditAtom = atom(null, (get, set) => {
  const originalData = get(originalDataBeforeEditAtom);
  if (originalData) {
    set(privateCargoDetailAtom, originalData);
    set(originalDataBeforeEditAtom, null);
  }
});

// 업데이트 함수
export const updateCargoAtom = atom(
  null,
  async (
    get,
    set,
    update: {
      formData: Record<string, FieldValue>;
      cargoId: string;
      option?: "all" | "single";
    },
  ) => {
    const { formData, cargoId, option } = update;
    const originalData = get(privateCargoDetailAtom);

    if (!originalData) return;

    try {
      const updateData: Partial<CargoDetailData> = {};

      // 일반적인 업데이트
      updateData.cargo = { ...originalData.cargo, ...formData };
      updateData.costDetail = { ...originalData.costDetail, ...formData };
      updateData.cost = { ...originalData.cost, ...formData };
      updateData.payment = { ...originalData.payment, ...formData };
      updateData.contract = { ...originalData.contract, ...formData };
      updateData.item = { ...originalData.item, ...formData };
      updateData.importer = { ...originalData.importer, ...formData };

      // B/L 번호가 변경되었고, 특정 화물만 업데이트하는 경우
      if (
        formData.blNumber &&
        option === "single" &&
        formData.blNumber !== originalData.shipment.blNumber
      ) {
        // 서버 액션을 통해 업데이트
        const newShipment = await createNewShipmentAndUpdateCargo(
          cargoId,
          formData,
          option,
        );
        updateData.shipment = { ...newShipment } as Shipment;
        if (newShipment) {
          updateData.cargo.shipmentId = newShipment.id;
        }
      } else {
        updateData.shipment = { ...originalData.shipment, ...formData };
      }

      if (
        updateData.importer.importerName !== originalData.importer.importerName
      ) {
        switchImporter(
          cargoId,
          originalData.importer.importerName,
          updateData.importer.importerName,
        );
      }
      if (updateData.cargo.contractTon !== originalData.cargo.contractTon) {
        updateData.cargo.containerCount = Math.ceil(
          Number(updateData.cargo.contractTon) / 24,
        );
        await addUnclearedStockNumber(
          cargoId,
          updateData.importer.importerCode,
          Number(updateData.cargo.contractTon) -
            Number(originalData.cargo.contractTon),
        );
      }

      // 서버 업데이트
      const updatedData = await updateCargoDetail(cargoId, updateData);
      set(privateCargoDetailAtom, updatedData);
    } catch (error) {
      throw error;
    }
  },
);
