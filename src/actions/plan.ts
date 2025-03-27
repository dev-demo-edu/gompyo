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
import { z } from "zod";
import { contractSchema, cargoSchema } from "@/containers/plan";

type ContractData = z.infer<typeof contractSchema>;
type CargoItem = z.infer<typeof cargoSchema>;

// TODO: 각 DB에 저장하는 함수로 분리
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
          contractParty: contractData.contractParty,
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
          estimatedTimeArrival: contractData.estimatedTimeArrival,
          estimatedTimeDeparture: contractData.estimatedTimeDeparture,
          arrivalPort: contractData.arrivalPort,
          departurePort: contractData.departurePort,
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
        const costId = nanoid();

        // 기존 품목 확인
        const existingItem = await db.query.items.findFirst({
          where: (items, { eq, and }) =>
            and(
              eq(items.itemName, cargo.itemName),
              eq(items.itemVariety, cargo.itemVariety),
              cargo.hsCode ? eq(items.hsCode, cargo.hsCode) : undefined,
              eq(items.packingUnit, cargo.packingUnit),
            ),
        });

        let itemId: string;

        if (existingItem) {
          // 기존 품목이 있는 경우 해당 ID 사용
          itemId = existingItem.id;
        } else {
          // 새로운 품목 저장
          const [newItem] = await db
            .insert(items)
            .values({
              id: nanoid(),
              itemName: cargo.itemName,
              itemVariety: cargo.itemVariety,
              originCountry: null,
              hsCode: cargo.hsCode,
              packingUnit: cargo.packingUnit,
            })
            .returning();
          itemId = newItem.id;
          console.log("새로운 품목 정보 저장 완료:", newItem);
        }

        // 화물 정보 저장
        const cargoId = nanoid();
        const supplyPrice =
          (cargo.unitPrice! * cargo.exchangeRate * cargo.contractTon) / 1000;
        const [cargoResult] = await db
          .insert(cargos)
          .values({
            id: cargoId,
            itemsId: itemId,
            shipmentId: shipmentId,
            containerCount: 1,
            contractTon: cargo.contractTon,
            progressStatus: "예정",
            sellingPrice: cargo.sellingPrice,
            margin: cargo.sellingPrice - supplyPrice,
            totalProfit:
              (cargo.sellingPrice - supplyPrice) * cargo.contractTon * 1000,
          })
          .returning();
        console.log("화물 정보 저장 완료:", cargoResult);

        // 비용 정보 저장
        const [cost] = await db
          .insert(costs)
          .values({
            id: costId,
            cargoId: cargoId,
            supplyPrice: cargo.unitPrice,
            shippingCost: cargo.shippingCost,
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
            customsTaxRate: cargo.customsTaxRate,
            customTaxAmount: cargo.customTaxAmount,
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
