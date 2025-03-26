"use server";

import { db } from "@/db";
import {
  contracts,
  shipments,
  cargos,
  items,
  costs,
  costDetails,
} from "@/db/schema";
import { nanoid } from "nanoid";
import { ContractData, CargoItem } from "@/types/plan";

export async function createPlan(
  contractData: ContractData,
  cargoItems: CargoItem[],
) {
  try {
    console.log("계약 정보 저장 시작:", contractData);
    console.log("화물 정보 저장 시작:", cargoItems);

    // 각 항목별 ID 생성
    const contractId = nanoid();
    const shipmentId = nanoid();

    // 계약 정보 저장
    try {
      const [contract] = await db
        .insert(contracts)
        .values({
          id: contractId,
          contractNumber: contractData.contractNumber,
          contractDate: contractData.contractDate,
          contractParty: contractData.supplier,
          importer: contractData.importer,
          incoterms: contractData.incoterms,
        })
        .returning();
      console.log("계약 정보 저장 완료:", contract);
    } catch (error) {
      console.error("계약 정보 저장 중 오류:", error);
      throw new Error(
        `계약 정보 저장 실패: ${error instanceof Error ? error.message : "알 수 없는 오류"}`,
      );
    }

    // 선적 정보 저장
    try {
      const [shipment] = await db
        .insert(shipments)
        .values({
          id: shipmentId,
          contractId: contractId,
          estimatedTimeArrival: contractData.eta,
          estimatedTimeDeparture: contractData.etd,
          arrivalPort: contractData.arrivalPort,
          departurePort: contractData.departurePort,
          shippingCompany: contractData.vessel,
          blNumber: contractData.blNumber,
          palletType: contractData.containerType,
        })
        .returning();
      console.log("선적 정보 저장 완료:", shipment);
    } catch (error) {
      console.error("선적 정보 저장 중 오류:", error);
      throw new Error(
        `선적 정보 저장 실패: ${error instanceof Error ? error.message : "알 수 없는 오류"}`,
      );
    }

    // 화물 정보 저장
    for (const cargo of cargoItems) {
      try {
        const itemId = nanoid();
        const costId = nanoid();

        // 품목 정보 저장
        const [item] = await db
          .insert(items)
          .values({
            id: itemId,
            itemName: cargo.item,
            itemVariety: cargo.variety,
            originCountry: cargo.originCountry,
            hsCode: cargo.hsCode,
            packingUnit: cargo.packagingUnit,
          })
          .returning();
        console.log("품목 정보 저장 완료:", item);

        // 화물 정보 저장
        const [cargoResult] = await db
          .insert(cargos)
          .values({
            id: nanoid(),
            itemsId: itemId,
            shipmentId: shipmentId,
            containerCount: cargo.containerCount,
            contractTon: cargo.contractTonnage,
            progressStatus: "예정",
            sellingPrice: cargo.sellingPrice,
            margin: 0,
            totalProfit: 0,
          })
          .returning();
        console.log("화물 정보 저장 완료:", cargoResult);

        // 비용 정보 저장
        const [cost] = await db
          .insert(costs)
          .values({
            id: costId,
            cargoId: costId,
            supplyPrice: cargo.unitPrice,
            shippingCost: 0,
            laborCost: 0,
            transportStorageFee: 0,
            loadingUnloadingFee: 0,
          })
          .returning();
        console.log("비용 정보 저장 완료:", cost);

        // 비용 상세 정보 저장
        const [costDetail] = await db
          .insert(costDetails)
          .values({
            id: nanoid(),
            costId: costId,
            unitPrice: cargo.unitPrice,
            exchangeRate: cargo.exchangeRate,
            customsTaxRate: cargo.tariffRate,
            customTaxAmount: 0,
            customsFee: cargo.customsFee,
            inspectionFee: cargo.inspectionFee,
            doCharge: 0,
            otherCosts: cargo.otherCosts,
          })
          .returning();
        console.log("비용 상세 정보 저장 완료:", costDetail);
      } catch (error) {
        console.error("화물 정보 저장 중 오류:", error);
        throw new Error(
          `화물 정보 저장 실패: ${error instanceof Error ? error.message : "알 수 없는 오류"}`,
        );
      }
    }

    return { success: true, message: "계획이 성공적으로 저장되었습니다." };
  } catch (error) {
    console.error("계획 저장 중 오류 발생:", error);
    if (error instanceof Error) {
      console.error("오류 상세:", {
        message: error.message,
        stack: error.stack,
        name: error.name,
      });
    }
    return {
      success: false,
      message: `계획 저장 중 오류가 발생했습니다: ${error instanceof Error ? error.message : "알 수 없는 오류"}`,
    };
  }
}
