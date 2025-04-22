"use server";

import { ContractService } from "@/services/contract.service";
import { ShipmentService } from "@/services/shipment.service";
import { CargoService } from "@/services/cargo.service";
import { ItemService } from "@/services/item.service";
import { CostService } from "@/services/cost.service";
import { CostDetailService } from "@/services/cost-detail.service";
import { PaymentService } from "@/services/payment.service";
import { IShipmentData } from "@/types/grid-col";
import { mapAndCalculateCargoDetails } from "@/services/cargo-calculator";
import { ImporterService } from "@/services/importer.service";
import type { CargoDetailData } from "@/types/cargo-detail";
import { CalculationType } from "@/types/importer";

export async function getShipmentData(): Promise<IShipmentData[]> {
  try {
    // 서비스 인스턴스 생성
    const contractService = new ContractService();
    const shipmentService = new ShipmentService();
    const cargoService = new CargoService();
    const itemService = new ItemService();
    const costService = new CostService();
    const costDetailService = new CostDetailService();
    const paymentService = new PaymentService();
    const importerService = new ImporterService();
    // 각 서비스를 통해 데이터 가져오기
    const [
      contracts,
      shipments,
      cargos,
      items,
      costs,
      costDetails,
      payments,
      importers,
    ] = await Promise.all([
      contractService.findAll(),
      shipmentService.findAll(),
      cargoService.findAll(),
      itemService.findAll(),
      costService.findAll(),
      costDetailService.findAll(),
      paymentService.findAll(),
      importerService.getAllImporters(),
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
      const importer = importers.find((i) => i.id === contract?.importerId);

      // cargo-calculator를 사용하기 위한 데이터 구조로 변환
      const cargoDetailData: CargoDetailData = {
        contract: {
          id: contract?.id || "",
          contractNumber: contract?.contractNumber || "",
          contractDate: contract?.contractDate || "",
          exporter: contract?.exporter || "",
          importerId: contract?.importerId || "",
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
          sellingPriceWholesale: cargo?.sellingPriceWholesale || 0,
          sellingPriceRetail: cargo?.sellingPriceRetail || 0,
        },
        cost: {
          id: cost?.id || "",
          cargoId: cargo?.id || "",
          supplyPrice: cost?.supplyPrice || 0,
          shippingCost: cost?.shippingCost || 0,
          laborCost: cost?.laborCost || 0,
          transportStorageFee: cost?.transportStorageFee || 0,
          loadingUnloadingFee: cost?.loadingUnloadingFee || 0,
          usanceInterest: cost?.usanceInterest || 0,
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
        importer: {
          id: importer?.id || "",
          importerName: importer?.importerName || "",
          calculationType:
            (importer?.calculationType as CalculationType) ||
            CalculationType.STANDARD,
        },
      };

      // cargo-calculator를 사용하여 계산된 데이터 가져오기
      const calculatedData = mapAndCalculateCargoDetails(cargoDetailData);

      return {
        id: cargo?.id || "",
        contractNumber: contract?.contractNumber || "",
        progressStatus: cargo?.progressStatus || "예정",
        contractDate: contract?.contractDate || "",
        importer: importer?.importerName || "",
        productName: item?.itemVariety || "",
        itemName: item?.itemName || "",
        weight: cargo?.contractTon || 0,
        containerCount: cargo?.containerCount || 0,
        packagingUnit: item?.packingUnit || "",
        unitPrice: calculatedData.costDetail.unitPrice || 0,
        totalPrice: calculatedData.costDetail.totalContractPrice || 0,
        supplyPrice: calculatedData.cost.supplyPrice || 0,
        sellingPrice: calculatedData.cargo.sellingPrice || 0,
        paymentMethod: payment?.paymentMethod || "",
        hsCode: item?.hsCode || "",
        blNumber: shipment?.blNumber || "",
        departurePort: shipment?.departurePort || "",
        etd: shipment?.estimatedTimeDeparture || "",
        arrivalPort: shipment?.arrivalPort || "",
        eta: shipment?.estimatedTimeArrival || "",
        exporter: contract?.exporter || "",
        customsDate: cargo?.customsClearanceDate || "",
        packingUnit: item?.packingUnit || "",
      };
    });
  } catch (error) {
    console.error("선적 데이터 조회 중 오류:", error);
    throw new Error(
      `선적 데이터 조회 실패: ${error instanceof Error ? error.message : "알 수 없는 오류"}`,
    );
  }
}
