import { Importer, CalculationType } from "@/types/importer";

// 계산 로직을 위한 인터페이스
export interface CalculationStrategy {
  calculate(
    baseValues: {
      costPerKg: number;
      totalContractPrice: number;
      contractorCost: number;
      contractorCostAmount: number;
    },
    data: {
      contractTon: number;
      sellingPrice: number;
      purchaseFeeRate: number;
      shippingCost: number;
      laborCost: number;
      transportStorageFee: number;
      loadingUnloadingFee: number;
    },
  ): {
    supplyPrice: number;
    contractorProfit: number;
    totalCost: number;
    margin: number;
    totalProfit: number;
  };
}

// 기본 계산 로직
export class StandardCalculationStrategy implements CalculationStrategy {
  calculate(
    baseValues: {
      costPerKg: number;
      totalContractPrice: number;
      contractorCost: number;
      contractorCostAmount: number;
    },
    data: {
      contractTon: number;
      sellingPrice: number;
      purchaseFeeRate: number;
      shippingCost: number;
      laborCost: number;
      transportStorageFee: number;
      loadingUnloadingFee: number;
    },
  ) {
    const supplyPrice =
      baseValues.contractorCost * (1 + data.purchaseFeeRate / 100);

    const contractorProfit =
      (supplyPrice - baseValues.contractorCost) * data.contractTon * 1000;

    const totalCost =
      supplyPrice * data.contractTon * 1000 +
      data.shippingCost +
      data.laborCost +
      data.transportStorageFee +
      data.loadingUnloadingFee;

    const margin = data.sellingPrice - totalCost / data.contractTon / 1000;

    const totalProfit = margin * data.contractTon * 1000;

    return {
      supplyPrice,
      contractorProfit,
      totalCost,
      margin,
      totalProfit,
    };
  }
}

export // 계산 로직 팩토리
class CalculationStrategyFactory {
  static createStrategy(importer: Importer | null): CalculationStrategy {
    if (!importer) {
      return new StandardCalculationStrategy();
    }

    // 여기서 수입회사별 계산 로직을 선택
    switch (importer.calculationType) {
      case CalculationType.STANDARD:
        return new StandardCalculationStrategy();
      // 다른 계산 로직 추가 가능
      default:
        return new StandardCalculationStrategy();
    }
  }
}
