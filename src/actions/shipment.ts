"use server";

import { db } from "@/db";
import { IShipmentData } from "@/types/grid-col";
import { mapAndCalculateCargoDetails } from "@/services/cargo-calculator";
import type { CargoDetailData } from "@/types/cargo-detail";
import { CalculationType } from "@/types/importer";
import { statusMapping } from "@/constants/cargo-status";

export async function getShipmentData(): Promise<IShipmentData[]> {
  // 1. DB에서 findMany로 연관 데이터 한 번에 조회
  const result = await db.query.cargos.findMany({
    with: {
      item: true,
      shipment: {
        with: {
          contract: {
            with: {
              importer: true,
              payments: {
                with: {
                  paymentsTt: true,
                },
              },
            },
          },
        },
      },
      costs: {
        with: {
          costDetails: true,
        },
      },
    },
    orderBy: (cargos, { desc }) => [desc(cargos.createdAt)],
  });

  // 2. map 순회하며 CargoDetailData로 변환 및 3. 계산
  const shipmentData: IShipmentData[] = result.map((cargo) => {
    const item = cargo.item;
    const shipment = cargo.shipment;
    const contract = shipment?.contract;
    const importer = contract?.importer;
    const payment = contract?.payments?.[0];
    const paymentTt = payment?.paymentsTt;
    const cost = cargo.costs?.[0];
    const costDetail = cost?.costDetails?.[0];

    const cargoDetailData: CargoDetailData = {
      contract: {
        id: contract?.id || "",
        contractNumber: contract?.contractNumber || "",
        contractDate: contract?.contractDate || "",
        exporter: contract?.exporter || "",
        importerId: contract?.importerId || "",
        incoterms: contract?.incoterms || "",
        createdAt: contract?.createdAt || "",
        updatedAt: contract?.updatedAt || "",
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
        createdAt: shipment?.createdAt || "",
        updatedAt: shipment?.updatedAt || "",
      },
      cargo: {
        id: cargo?.id || "",
        remark: cargo?.remark || "",
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
        createdAt: cargo?.createdAt || "",
        updatedAt: cargo?.updatedAt || "",
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
        gompyoLaborCost: cost?.gompyoLaborCost || 0,
        gompyoTransportStorageFee: cost?.gompyoTransportStorageFee || 0,
        gompyoLoadingUnloadingFee: cost?.gompyoLoadingUnloadingFee || 0,
      },
      costDetail: {
        id: costDetail?.id || "",
        costId: cost?.id || "",
        unitPrice: costDetail?.unitPrice || 0,
        exchangeRate: costDetail?.exchangeRate || 0,
        customsTaxRate: costDetail?.customsTaxRate || 0,
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
        advancePaymentDate: paymentTt?.advancePaymentDate || "",
        advancePaymentRatio: paymentTt?.advancePaymentRatio || 0,
        remainingPaymentDate: paymentTt?.remainingPaymentDate || "",
        remainingPaymentRatio: paymentTt?.remainingPaymentRatio || 0,
        counterpartBank: paymentTt?.counterpartBank || "",
        paymentTerm: "",
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
        importerCode: importer?.importerCode || "gompyo",
        calculationType:
          (importer?.calculationType as CalculationType) ||
          CalculationType.STANDARD,
      },
    };

    const calculatedData = mapAndCalculateCargoDetails(cargoDetailData);

    return {
      id: cargo?.id || "",
      contractNumber: contract?.contractNumber || "",
      progressStatus:
        statusMapping[cargo?.progressStatus as keyof typeof statusMapping] ||
        "예정",
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

  return shipmentData;
}
