import { CargoDetailData } from "@/types/cargo-detail";
import {
  contracts,
  payments,
  costDetails,
  costs,
  cargos,
  items,
  shipments,
} from "@/db/schema";
import {
  CalculationStrategy,
  CalculationStrategyFactory,
} from "./calculation-strategies";

// DB 스키마를 기반으로 계산된 값을 포함하는 타입들
export type CalculatedContract = typeof contracts.$inferSelect & {
  departurePort: string;
  arrivalPort: string;
  estimatedTimeDeparture: string;
  estimatedTimeArrival: string;
  blNumber: string;
};

export type CalculatedPayment = typeof payments.$inferSelect & {
  advancePaymentDate: string | null;
  advancePaymentRatio: number | null;
  advancePaymentAmount: number | null;
  remainingPaymentDate: string | null;
  remainingPaymentRatio: number | null;
  remainingPaymentAmount: number | null;
  counterpartBank: string | null;
  paymentTerm: string | null;
  totalContractAmount: number;
};

export type CalculatedCostDetail = typeof costDetails.$inferSelect & {
  totalContractPrice: number;
  costPerKg: number;
};

export type CalculatedCost = typeof costs.$inferSelect & {
  contractorCost: number;
  contractorProfit: number;
  usanceInterest: number;
};

export type CalculatedCargo = typeof cargos.$inferSelect & {
  totalCost: number;
};

export type CalculatedItem = typeof items.$inferSelect;

export type CalculatedShipment = typeof shipments.$inferSelect;

export type CalculatedCargoDetailData = {
  contract: CalculatedContract;
  payment: CalculatedPayment;
  costDetail: CalculatedCostDetail;
  cost: CalculatedCost;
  cargo: CalculatedCargo;
  item: CalculatedItem;
  shipment: CalculatedShipment;
};

export class CargoCalculator {
  private data: CargoDetailData;
  private calculatedValues: {
    supplyPrice: number;
    margin: number;
    totalProfit: number;
    totalContractPrice: number;
    costPerKg: number;
    contractorCost: number;
    contractorProfit: number;
    totalCost: number;
  };
  private calculationStrategy: CalculationStrategy;

  constructor(data: CargoDetailData) {
    this.data = data;
    this.calculationStrategy = CalculationStrategyFactory.createStrategy(
      data.importer,
    );
    this.calculatedValues = this.calculateValues();
  }

  private calculateValues() {
    const unitPrice = this.data.costDetail.unitPrice || 0;
    const exchangeRate = this.data.costDetail.exchangeRate || 0;
    const contractTon = this.data.cargo.contractTon || 0;
    const sellingPrice = this.data.cargo.sellingPrice || 0;
    const purchaseFeeRate = this.data.cargo.purchaseFeeRate || 0;

    // 기본 값 계산 (회사 로직에 영향받지 않는 값들)
    const totalContractPrice = Math.floor(
      unitPrice * exchangeRate * contractTon,
    );
    const costPerKg = (unitPrice * exchangeRate) / 1000;

    const contractorCostAmount =
      totalContractPrice +
      (this.data.costDetail.customTaxAmount || 0) +
      (this.data.costDetail.transferFee || 0) +
      (this.data.costDetail.customsFee || 0) +
      (this.data.costDetail.inspectionFee || 0) +
      (this.data.costDetail.doCharge || 0) +
      (this.data.costDetail.otherCosts || 0);
    const contractorCost = contractorCostAmount / contractTon / 1000;

    // 회사별 계산 로직 적용
    const calculated = this.calculationStrategy.calculate(
      {
        contractorCostAmount,
        costPerKg,
        totalContractPrice,
        contractorCost,
      },
      {
        contractTon,
        sellingPrice,
        purchaseFeeRate,
        shippingCost: this.data.cost.shippingCost || 0,
        laborCost: this.data.cost.laborCost || 0,
        transportStorageFee: this.data.cost.transportStorageFee || 0,
        loadingUnloadingFee: this.data.cost.loadingUnloadingFee || 0,
      },
    );

    return {
      supplyPrice: calculated.supplyPrice,
      margin: calculated.margin,
      totalProfit: calculated.totalProfit,
      totalContractPrice,
      costPerKg,
      contractorCost,
      contractorProfit: calculated.contractorProfit,
      totalCost: calculated.totalCost,
    };
  }

  private mapItem(item: CargoDetailData["item"]): CalculatedItem {
    return {
      id: item.id,
      itemName: item.itemName || "",
      itemVariety: item.itemVariety || "",
      originCountry: item.originCountry || "",
      hsCode: item.hsCode || "",
      packingUnit: item.packingUnit || "",
    };
  }

  private mapShipment(
    shipment: CargoDetailData["shipment"],
  ): CalculatedShipment {
    return {
      id: shipment.id,
      estimatedTimeArrival: shipment.estimatedTimeArrival || "",
      estimatedTimeDeparture: shipment.estimatedTimeDeparture || "",
      arrivalPort: shipment.arrivalPort || "",
      departurePort: shipment.departurePort || "",
      blNumber: shipment.blNumber || "",
      palletOrderDate: shipment.palletOrderDate || "",
      palletType: shipment.palletType || "",
      shippingCompany: shipment.shippingCompany || "",
      contractId: shipment.contractId || "",
    };
  }

  private mapContract(
    contract: CargoDetailData["contract"],
    shipment: CargoDetailData["shipment"],
  ): CalculatedContract {
    return {
      id: contract.id,
      incoterms: contract.incoterms || "",
      contractNumber: contract.contractNumber || "",
      contractDate: contract.contractDate || "",
      contractParty: contract.contractParty || "",
      importerId: contract.importerId || "",
      departurePort: shipment.departurePort || "",
      arrivalPort: shipment.arrivalPort || "",
      estimatedTimeDeparture: shipment.estimatedTimeDeparture || "",
      estimatedTimeArrival: shipment.estimatedTimeArrival || "",
      blNumber: shipment.blNumber || "",
    };
  }

  private mapPayment(payment: CargoDetailData["payment"]): CalculatedPayment {
    return {
      id: payment.id,
      paymentDueDate: payment.paymentDueDate || "",
      paymentMethod: payment.paymentMethod || "",
      contractId: payment.contractId,
      // T/T 관련 필드
      advancePaymentDate: payment.advancePaymentDate || "",
      advancePaymentRatio: payment.advancePaymentRatio || 0,
      advancePaymentAmount: payment.advancePaymentAmount || 0,
      remainingPaymentDate: payment.remainingPaymentDate || "",
      remainingPaymentRatio: payment.remainingPaymentRatio || 0,
      remainingPaymentAmount: payment.remainingPaymentAmount || 0,
      counterpartBank: payment.counterpartBank || "",
      // Usance 관련 필드
      paymentTerm: payment.paymentTerm || "",
      totalContractAmount: this.calculatedValues.totalContractPrice,
    };
  }

  private mapAndCalculateCostDetail(
    costDetail: CargoDetailData["costDetail"],
  ): CalculatedCostDetail {
    return {
      id: costDetail.id,
      unitPrice: costDetail.unitPrice || 0,
      totalContractPrice: this.calculatedValues.totalContractPrice,
      exchangeRate: costDetail.exchangeRate || 0,
      costPerKg: this.calculatedValues.costPerKg,
      costId: costDetail.costId,
      customTaxAmount: costDetail.customTaxAmount || 0,
      customsTaxRate: costDetail.customsTaxRate || 0,
      customsFee: costDetail.customsFee || 0,
      inspectionFee: costDetail.inspectionFee || 0,
      doCharge: costDetail.doCharge || 0,
      otherCosts: costDetail.otherCosts || 0,
      transferFee: costDetail.transferFee || 0,
    };
  }

  private mapAndCalculateContractAmount(
    cargo: CargoDetailData["cargo"],
    cost: CargoDetailData["cost"],
  ): CalculatedCost {
    return {
      id: cost.id,
      cargoId: cost.cargoId,
      contractorCost: this.calculatedValues.contractorCost,
      supplyPrice: this.calculatedValues.supplyPrice,
      contractorProfit: this.calculatedValues.contractorProfit,
      shippingCost: cost.shippingCost || 0,
      laborCost: cost.laborCost || 0,
      transportStorageFee: cost.transportStorageFee || 0,
      loadingUnloadingFee: cost.loadingUnloadingFee || 0,
      usanceInterest: cost.usanceInterest || 0,
    };
  }

  private mapAndCalculateExpense(
    cargo: CargoDetailData["cargo"],
  ): CalculatedCargo {
    return {
      id: cargo.id,
      itemsId: cargo.itemsId,
      shipmentId: cargo.shipmentId,
      containerCount: cargo.containerCount,
      contractTon: cargo.contractTon,
      customsClearanceDate: cargo.customsClearanceDate,
      quarantineDate: cargo.quarantineDate,
      warehouseEntryDate: cargo.warehouseEntryDate,
      progressStatus: cargo.progressStatus,
      totalCost: this.calculatedValues.totalCost,
      sellingPrice: cargo.sellingPrice || 0,
      sellingPriceWholesale: cargo.sellingPriceWholesale || 0,
      sellingPriceRetail: cargo.sellingPriceRetail || 0,
      margin: this.calculatedValues.margin,
      totalProfit: this.calculatedValues.totalProfit,
      purchaseFeeRate: cargo.purchaseFeeRate,
    };
  }

  public calculate(): CalculatedCargoDetailData {
    return {
      contract: this.mapContract(this.data.contract, this.data.shipment),
      payment: this.mapPayment(this.data.payment),
      costDetail: this.mapAndCalculateCostDetail(this.data.costDetail),
      cost: this.mapAndCalculateContractAmount(this.data.cargo, this.data.cost),
      cargo: this.mapAndCalculateExpense(this.data.cargo),
      item: this.mapItem(this.data.item),
      shipment: this.mapShipment(this.data.shipment),
    };
  }
}

// mapAndCalculateCargoDetails 함수 수정
export function mapAndCalculateCargoDetails(
  data: CargoDetailData,
): CalculatedCargoDetailData {
  const calculator = new CargoCalculator(data);
  return calculator.calculate();
}
