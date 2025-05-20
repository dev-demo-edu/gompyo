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
      usanceInterest: number;
      gompyoLaborCost: number;
      gompyoTransportStorageFee: number;
      gompyoLoadingUnloadingFee: number;
    },
  ): {
    supplyPrice: number;
    contractorProfit: number;
    totalCost: number;
    margin: number;
    totalProfit: number;
    totalCostPerKg: number;
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
      usanceInterest: number;
      gompyoLaborCost: number;
      gompyoTransportStorageFee: number;
      gompyoLoadingUnloadingFee: number;
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
      data.loadingUnloadingFee +
      data.gompyoLaborCost +
      data.gompyoTransportStorageFee +
      data.gompyoLoadingUnloadingFee;

    const margin = data.sellingPrice - totalCost / data.contractTon / 1000;

    const totalProfit = margin * data.contractTon * 1000;

    const totalCostPerKg = totalCost / data.contractTon / 1000;

    return {
      supplyPrice,
      contractorProfit,
      totalCost,
      margin,
      totalProfit,
      totalCostPerKg,
    };
  }
}

export class DnbCalculationStrategy implements CalculationStrategy {
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
      usanceInterest: number;
      gompyoLaborCost: number;
      gompyoTransportStorageFee: number;
      gompyoLoadingUnloadingFee: number;
    },
  ) {
    const supplyPrice =
      ((baseValues.contractorCostAmount +
        data.shippingCost +
        data.laborCost +
        data.transportStorageFee +
        data.loadingUnloadingFee +
        data.usanceInterest) /
        data.contractTon /
        1000) *
      (1 + data.purchaseFeeRate / 100);

    const contractorProfit =
      (supplyPrice - baseValues.contractorCost) * data.contractTon * 1000;

    const totalCost =
      supplyPrice * data.contractTon * 1000 +
      data.gompyoLaborCost +
      data.gompyoLoadingUnloadingFee +
      data.gompyoTransportStorageFee;

    const margin = data.sellingPrice - totalCost / data.contractTon / 1000;

    const totalProfit = margin * data.contractTon * 1000;

    const totalCostPerKg = totalCost / data.contractTon / 1000;

    return {
      supplyPrice,
      contractorProfit,
      totalCost,
      margin,
      totalProfit,
      totalCostPerKg,
    };
  }
}

export class NamhaeCalculationStrategy implements CalculationStrategy {
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
      usanceInterest: number;
      gompyoLaborCost: number;
      gompyoTransportStorageFee: number;
      gompyoLoadingUnloadingFee: number;
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
      data.loadingUnloadingFee +
      data.gompyoLaborCost +
      data.gompyoTransportStorageFee +
      data.gompyoLoadingUnloadingFee;

    const margin = data.sellingPrice - totalCost / data.contractTon / 1000;

    const totalProfit = margin * data.contractTon * 1000;

    const totalCostPerKg = totalCost / data.contractTon / 1000;

    return {
      supplyPrice,
      contractorProfit,
      totalCost,
      margin,
      totalProfit,
      totalCostPerKg,
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
      case CalculationType.DNB:
        return new DnbCalculationStrategy();
      case CalculationType.NAMHAE:
        return new NamhaeCalculationStrategy();
      default:
        return new StandardCalculationStrategy();
    }
  }
}
