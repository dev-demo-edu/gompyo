"use server";

import { CargoService } from "@/services/cargo.service";
import { ContractService } from "@/services/contract.service";
import { PaymentService } from "@/services/payment.service";
import { ShipmentService } from "@/services/shipment.service";
import { CargoDetailData, Importer } from "@/types/cargo-detail";
import { CostDetailService } from "@/services/cost-detail.service";
import { CostService } from "@/services/cost.service";
import { ItemsService } from "@/services/items.service";
import { ImporterService } from "@/services/importer.service";
import { CalculatedPayment } from "@/services/cargo-calculator";

const cargoService = new CargoService();
const shipmentService = new ShipmentService();
const contractService = new ContractService();
const paymentService = new PaymentService();
const costService = new CostService();
const costDetailService = new CostDetailService();
const itemsService = new ItemsService();
const importerService = new ImporterService();

export async function getCargoDetail(
  cargoId: string,
): Promise<CargoDetailData> {
  try {
    // cargoId로 cargo 정보 조회
    const cargo = await cargoService.findById(cargoId);
    if (!cargo) {
      throw new Error("화물 정보를 찾을 수 없습니다.");
    }

    // shipmentId로 shipment 정보 조회
    const shipment = await shipmentService.findById(cargo.shipmentId);
    if (!shipment) {
      throw new Error("선적 정보를 찾을 수 없습니다.");
    }

    // contractId로 계약 정보 조회
    const contract = await contractService.findById(shipment.contractId);
    if (!contract) {
      throw new Error("계약 정보를 찾을 수 없습니다.");
    }

    // contract.id로 결제 정보 조회
    const payment = await paymentService.findByContractId(contract.id);
    if (!payment) {
      throw new Error("결제 정보를 찾을 수 없습니다.");
    }

    // cargoId로 원가 정보 조회
    const cost = await costService.findByCargoId(cargoId);
    if (!cost) {
      throw new Error("원가 정보를 찾을 수 없습니다.");
    }

    const costDetail = await costDetailService.findByCostId(cost.id);
    if (!costDetail) {
      throw new Error("세부 가격 정보를 찾을 수 없습니다.");
    }

    const item = await itemsService.findById(cargo.itemsId);
    if (!item) {
      throw new Error("상품 정보를 찾을 수 없습니다.");
    }

    const importer = await importerService.getImporterById(
      contract.importerId || "",
    );
    if (!importer) {
      throw new Error("수입사 정보를 찾을 수 없습니다.");
    }

    return {
      importer: importer as Importer,
      contract,
      payment,
      cost,
      costDetail,
      cargo,
      shipment,
      item,
    };
  } catch (error) {
    console.error("화물 상세 정보 조회 중 오류 발생:", error);
    throw error;
  }
}

export async function updateCargoDetail(
  cargoId: string,
  updateData: Partial<CargoDetailData> & { option?: "all" | "single" },
) {
  try {
    // 계약 정보 업데이트
    if (updateData.contract) {
      await contractService.update(updateData.contract.id, updateData.contract);
    }

    // 결제 정보 업데이트
    if (updateData.payment) {
      await paymentService.update(
        updateData.payment.id,
        updateData.payment as CalculatedPayment,
      );
    }

    // 원가 상세 정보 업데이트
    if (updateData.costDetail) {
      await costDetailService.update(
        updateData.costDetail.id,
        updateData.costDetail,
      );
    }

    // 원가 정보 업데이트
    if (updateData.cost) {
      await costService.update(updateData.cost.id, updateData.cost);
    }

    // 화물 정보 업데이트
    if (updateData.cargo) {
      await cargoService.update(updateData.cargo.id, updateData.cargo);
    }

    // 선적 정보 업데이트
    if (updateData.shipment) {
      await shipmentService.update(updateData.shipment.id, updateData.shipment);
    }

    // 상품 정보 업데이트
    // TODO: 상품정보가 달라졌을시 모든 상품정보를 업데이트 해야하는건지 새롭게 해야하는건지 처리 필요
    if (updateData.item) {
      const newItem = await itemsService.update(
        updateData.item.id,
        updateData.item,
      );
      await cargoService.update(cargoId, {
        itemsId: newItem.id,
      });
    }

    // 수입업체 정보 업데이트
    if (updateData.importer) {
      const importer = await importerService.updateImporter(
        updateData.importer.id,
        updateData.importer,
      );
      console.log("importer", importer);
      await contractService.update(updateData?.contract?.id || "", {
        importerId: importer.id,
      });
    }

    // 업데이트된 전체 데이터 반환
    return await getCargoDetail(cargoId);
  } catch (error) {
    console.error("화물 상세 정보 업데이트 중 오류 발생:", error);
    throw error;
  }
}
