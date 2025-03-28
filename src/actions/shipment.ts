"use server";

import { db } from "@/db";
import {
  contracts,
  shipments,
  cargos,
  items,
  costs,
  costDetails,
  payments,
} from "@/db/schema";
import { eq } from "drizzle-orm";
import { IShipmentData } from "@/constants/dummy-data";

export async function getShipmentData(): Promise<IShipmentData[]> {
  try {
    // 모든 선적 정보를 가져옵니다.
    const result = await db
      .select({
        // 계약 정보
        contractNumber: contracts.contractNumber,
        contractDate: contracts.contractDate,
        contractParty: contracts.contractParty,
        importer: contracts.importer,
        // 선적 정보
        blNumber: shipments.blNumber,
        departurePort: shipments.departurePort,
        arrivalPort: shipments.arrivalPort,
        estimatedTimeArrival: shipments.estimatedTimeArrival,
        estimatedTimeDeparture: shipments.estimatedTimeDeparture,
        // 화물 정보
        progressStatus: cargos.progressStatus,
        contractTon: cargos.contractTon,
        containerCount: cargos.containerCount,
        customsClearanceDate: cargos.customsClearanceDate,
        sellingPrice: cargos.sellingPrice,
        // 아이템 정보
        itemName: items.itemName,
        hsCode: items.hsCode,
        packingUnit: items.packingUnit,
        // 비용 정보
        supplyPrice: costs.supplyPrice,
        // 비용 상세 정보
        unitPrice: costDetails.unitPrice,
        // 결제 정보
        paymentMethod: payments.paymentMethod,
      })
      .from(contracts)
      .leftJoin(shipments, eq(shipments.contractId, contracts.id))
      .leftJoin(cargos, eq(cargos.shipmentId, shipments.id))
      .leftJoin(items, eq(cargos.itemsId, items.id))
      .leftJoin(costs, eq(costs.cargoId, cargos.id))
      .leftJoin(costDetails, eq(costDetails.costId, costs.id))
      .leftJoin(payments, eq(payments.contractId, contracts.id));

    // 데이터 가공
    return result.map((row) => {
      // 단가 * 무게 계산
      const totalPrice = (row.unitPrice || 0) * (row.contractTon || 0);

      return {
        contractNumber: row.contractNumber || "",
        progressStatus: row.progressStatus || "예정",
        contractDate: row.contractDate || "",
        importer: row.importer || "",
        productName: "", // 현재 DB 스키마에는 없는 필드
        itemName: row.itemName || "",
        weight: row.contractTon || 0,
        containerCount: row.containerCount || 0,
        packagingUnit: row.packingUnit || "",
        unitPrice: row.unitPrice || 0,
        totalPrice: totalPrice,
        supplyPrice: row.supplyPrice || 0,
        sellingPrice: row.sellingPrice || 0,
        paymentMethod: row.paymentMethod || "",
        hsCode: row.hsCode || "",
        blNumber: row.blNumber || "",
        departurePort: row.departurePort || "",
        etd: row.estimatedTimeDeparture || "",
        arrivalPort: row.arrivalPort || "",
        eta: row.estimatedTimeArrival || "",
        contractParty: row.contractParty || "",
        customsDate: row.customsClearanceDate || "",
      };
    });
  } catch (error) {
    console.error("Failed to fetch shipment data:", error);
    throw new Error("선적 데이터를 불러오는데 실패했습니다.");
  }
}
