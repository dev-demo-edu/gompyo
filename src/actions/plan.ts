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
  paymentsTt,
} from "@/db/schema";
import { nanoid } from "nanoid";
import { z } from "zod";
import { contractSchema, cargoSchema } from "@/containers/plan-button";
import { IPlanData } from "@/types/grid-col";
import { mapAndCalculateCargoDetails } from "@/services/cargo-calculator";
import type { CargoDetailData } from "@/types/cargo-detail";
import { ContractService } from "@/services/contract.service";
import { ShipmentService } from "@/services/shipment.service";
import { CargoService } from "@/services/cargo.service";
import { ItemService } from "@/services/item.service";
import { CostService } from "@/services/cost.service";
import { CostDetailService } from "@/services/cost-detail.service";
import { PaymentService } from "@/services/payment.service";

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

    // 결제 정보 저장 (기본값으로 T/T 결제 방식 설정)
    try {
      const paymentId = nanoid();
      const [payment] = await db
        .insert(payments)
        .values({
          id: paymentId,
          paymentDueDate: contractData.contractDate, // 계약일을 결제일로 설정
          paymentMethod: "T/T",
          contractId: contractId,
        })
        .returning();
      console.log("결제 정보 저장 완료:", payment);

      // T/T 결제 상세 정보 저장
      const [paymentTt] = await db
        .insert(paymentsTt)
        .values({
          paymentId: paymentId,
          advancePaymentDate: contractData.contractDate,
          advancePaymentRatio: 30, // 기본값 30%
          advancePaymentAmount: 0, // 나중에 계산
          remainingPaymentDate: contractData.contractDate, // 계약일로 설정
          remainingPaymentRatio: 70, // 기본값 70%
          remainingPaymentAmount: 0, // 나중에 계산
          counterpartBank: "", // 나중에 입력
        })
        .returning();
      console.log("T/T 결제 상세 정보 저장 완료:", paymentTt);
    } catch (error) {
      console.error("결제 정보 저장 중 오류:", error);
      throw new Error(
        `결제 정보 저장 실패: ${error instanceof Error ? error.message : "알 수 없는 오류"}`,
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
            progressStatus: "REVIEW",
            sellingPrice: cargo.sellingPrice,
            margin: cargo.sellingPrice - supplyPrice,
            totalProfit:
              (cargo.sellingPrice - supplyPrice) * cargo.contractTon * 1000,
            purchaseFeeRate: 0,
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

export async function getPlanData(): Promise<IPlanData[]> {
  try {
    // 서비스 인스턴스 생성
    const contractService = new ContractService();
    const shipmentService = new ShipmentService();
    const cargoService = new CargoService();
    const itemService = new ItemService();
    const costService = new CostService();
    const costDetailService = new CostDetailService();
    const paymentService = new PaymentService();

    // 각 서비스를 통해 데이터 가져오기
    const [contracts, shipments, cargos, items, costs, costDetails, payments] =
      await Promise.all([
        contractService.findAll(),
        shipmentService.findAll(),
        cargoService.findAll(),
        itemService.findAll(),
        costService.findAll(),
        costDetailService.findAll(),
        paymentService.findAll(),
      ]);

    // 데이터 매핑 및 계산
    return cargos.map((cargo) => {
      // 관련 데이터 찾기
      const shipment = shipments.find((s) => s.id === cargo.shipmentId);
      const contract = contracts.find((c) => c.id === shipment?.contractId);
      const item = items.find((i) => i.id === cargo?.itemsId);
      const cost = costs.find((c) => c.cargoId === cargo?.id);
      const costDetail = costDetails.find((cd) => cd.costId === cost?.id);
      const payment = payments.find((p) => p.contractId === contract?.id);

      // cargo-calculator를 사용하기 위한 데이터 구조로 변환
      const cargoDetailData: CargoDetailData = {
        contract: {
          id: contract?.id || "",
          contractNumber: contract?.contractNumber || "",
          contractDate: contract?.contractDate || "",
          contractParty: contract?.contractParty || "",
          importer: contract?.importer || "",
          incoterms: contract?.incoterms || "",
        },
        shipment: {
          id: shipment?.id || "",
          contractId: contract?.id || "",
          estimatedTimeDeparture: shipment?.estimatedTimeDeparture || "",
          estimatedTimeArrival: shipment?.estimatedTimeArrival || "",
          shippingCompany: shipment?.shippingCompany || "",
          departurePort: shipment?.departurePort || "",
          arrivalPort: shipment?.arrivalPort || "",
          blNumber: shipment?.blNumber || "",
          palletOrderDate: shipment?.palletOrderDate || "",
          palletType: shipment?.palletType || "",
        },
        cargo: {
          id: cargo?.id || "",
          itemsId: cargo?.itemsId || "",
          shipmentId: shipment?.id || "",
          containerCount: cargo?.containerCount || 0,
          contractTon: cargo?.contractTon || 0,
          progressStatus: cargo?.progressStatus || "예정",
          customsClearanceDate: cargo?.customsClearanceDate || "",
          quarantineDate: cargo?.quarantineDate || "",
          warehouseEntryDate: cargo?.warehouseEntryDate || "",
          sellingPrice: cargo?.sellingPrice || 0,
          margin: cargo?.margin || 0,
          totalProfit: cargo?.totalProfit || 0,
          purchaseFeeRate: cargo?.purchaseFeeRate || 0,
        },
        cost: {
          id: cost?.id || "",
          cargoId: cargo?.id || "",
          supplyPrice: cost?.supplyPrice || 0,
          shippingCost: cost?.shippingCost || 0,
          laborCost: cost?.laborCost || 0,
          transportStorageFee: cost?.transportStorageFee || 0,
          loadingUnloadingFee: cost?.loadingUnloadingFee || 0,
        },
        costDetail: {
          id: costDetail?.id || "",
          costId: cost?.id || "",
          unitPrice: costDetail?.unitPrice || 0,
          exchangeRate: costDetail?.exchangeRate || 0,
          customsTaxRate: costDetail?.customsTaxRate || 0,
          customTaxAmount: costDetail?.customTaxAmount || 0,
          customsFee: costDetail?.customsFee || 0,
          inspectionFee: costDetail?.inspectionFee || 0,
          doCharge: costDetail?.doCharge || 0,
          otherCosts: costDetail?.otherCosts || 0,
          transferFee: costDetail?.transferFee || 0,
        },
        payment: {
          id: payment?.id || "",
          contractId: contract?.id || "",
          paymentMethod: payment?.paymentMethod || "",
          paymentDueDate: payment?.paymentDueDate || "",
          advancePaymentDate: payment?.advancePaymentDate || "",
          advancePaymentRatio: payment?.advancePaymentRatio || 0,
          advancePaymentAmount: payment?.advancePaymentAmount || 0,
          remainingPaymentDate: payment?.remainingPaymentDate || "",
          remainingPaymentRatio: payment?.remainingPaymentRatio || 0,
          remainingPaymentAmount: payment?.remainingPaymentAmount || 0,
          counterpartBank: payment?.counterpartBank || "",
          paymentTerm: payment?.paymentTerm || "",
          totalContractAmount: payment?.totalContractAmount || 0,
        },
        item: {
          id: item?.id || "",
          itemName: item?.itemName || "",
          itemVariety: item?.itemVariety || "",
          packingUnit: item?.packingUnit || "",
          originCountry: item?.originCountry || "",
          hsCode: item?.hsCode || "",
        },
      };

      // cargo-calculator를 사용하여 계산된 데이터 가져오기
      const calculatedData = mapAndCalculateCargoDetails(cargoDetailData);

      return {
        id: cargo?.id || "",
        contractNumber: contract?.contractNumber || "",
        progressStatus: cargo?.progressStatus || "예정",
        contractDate: contract?.contractDate || "",
        importer: contract?.importer || "",
        contractParty: contract?.contractParty || "",
        estimatedTimeArrival: shipment?.estimatedTimeArrival || "",
        arrivalPort: shipment?.arrivalPort || "",
        itemName: item?.itemName || "",
        contractTon: cargo?.contractTon || 0,
        unitPrice: calculatedData.costDetail.unitPrice || 0,
        totalPrice: calculatedData.costDetail.totalContractPrice || 0,
        paymentMethod: payment?.paymentMethod || "",
        warehouseEntryDate: cargo?.warehouseEntryDate || "",
        importCostPerKg: calculatedData.costDetail.costPerKg || 0,
        supplyCostPerKg: calculatedData.cost.supplyPrice || 0,
        totalCost: calculatedData.cost.contractorCost || 0,
        totalCostPerKg: calculatedData.costDetail.costPerKg || 0,
        sellingPrice: calculatedData.cargo.sellingPrice || 0,
        margin: calculatedData.cargo.margin || 0,
        totalProfit: calculatedData.cargo.totalProfit || 0,
      };
    });
  } catch (error) {
    console.error("Failed to fetch plan data:", error);
    throw new Error("계획 데이터를 불러오는데 실패했습니다.");
  }
}
