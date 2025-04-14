import type { CargoDetailData } from "@/types/cargo-detail";

// TODO: 계산 로직 자세하게 구현하는것 추가 및 수정 필요
type MappedContract = {
  contractNumber: string;
  contractDate: string;
  contractor: string;
  importer: string;
  departurePort: string;
  arrivalPort: string;
  etd: string;
  eta: string;
  blNumber: string;
};

type MappedPayment = {
  paymentMethod: string;
  depositDate: string;
  balanceDate: string;
  depositRatio: number;
  balanceRatio: number;
  depositAmount: number;
  balanceAmount: number;
};

type MappedCostDetail = {
  unitPrice: number;
  totalContractPrice: number;
  exchangeRate: number;
  costPerKg: number;
  tariffRate: number;
  transferFee: number;
  customsFee: number;
  inspectionFee: number;
  doCharge: number;
  otherCosts: number;
  purchaseFeeRate: number;
};

type MappedContractAmount = {
  contractorCost: number;
  SupplyPrice: number;
  contractorProfit: number;
  shippingCost: number;
  laborCost: number;
  transportStorageFee: number;
  loadingUnloadingFee: number;
};

type MappedExpense = {
  totalCost: number;
  sellingPrice: number;
  margin: number;
  totalProfit: number;
};

type MappedCargoDetailData = {
  contract: MappedContract;
  payment: MappedPayment;
  costDetail: MappedCostDetail;
  cost: MappedContractAmount;
  cargo: MappedExpense;
};

export function mapAndCalculateCargoDetails(
  data: CargoDetailData,
): MappedCargoDetailData {
  return {
    contract: mapContract(data.contract, data.shipment),
    payment: mapPayment(data.payment),
    costDetail: mapAndCalculateCostDetail(data.costDetail),
    cost: mapAndCalculateContractAmount(data.cost),
    cargo: mapAndCalculateExpense(data.cargo),
  };
}

function mapContract(
  contract: CargoDetailData["contract"],
  shipment: CargoDetailData["shipment"],
): MappedContract {
  return {
    contractNumber: contract.contractNumber || "",
    contractDate: contract.contractDate || "",
    contractor: contract.contractParty || "",
    importer: contract.importer || "",
    departurePort: shipment.departurePort || "",
    arrivalPort: shipment.arrivalPort || "",
    etd: shipment.estimatedTimeDeparture || "",
    eta: shipment.estimatedTimeArrival || "",
    blNumber: shipment.blNumber || "",
  };
}

function mapPayment(payment: CargoDetailData["payment"]): MappedPayment {
  return {
    paymentMethod: payment.paymentMethod,
    depositDate: payment.paymentDueDate || "",
    balanceDate: payment.paymentDueDate || "", // TODO: 실제 잔금일 계산
    depositRatio: 0.3, // TODO: paymentTt에서 가져오기
    balanceRatio: 0.7, // TODO: paymentTt에서 가져오기
    depositAmount: 0, // TODO: 실제 계산
    balanceAmount: 0, // TODO: 실제 계산
  };
}

function mapAndCalculateCostDetail(
  costDetail: CargoDetailData["costDetail"],
): MappedCostDetail {
  const unitPrice = costDetail.unitPrice || 0;
  const exchangeRate = costDetail.exchangeRate || 0;
  const totalContractPrice = unitPrice * exchangeRate;
  const customsTaxRate = costDetail.customsTaxRate || 0;
  const costPerKg = (unitPrice * exchangeRate) / 1000;
  const customsFee = costDetail.customsFee || 0;
  const inspectionFee = costDetail.inspectionFee || 0;
  const doCharge = costDetail.doCharge || 0;
  const otherCosts = costDetail.otherCosts || 0;

  // TODO: 실제 계산 로직 구현
  return {
    unitPrice,
    totalContractPrice,
    exchangeRate,
    costPerKg,
    tariffRate: customsTaxRate,
    transferFee: 0, // TODO: 실제 계산
    customsFee,
    inspectionFee,
    doCharge,
    otherCosts,
    purchaseFeeRate: 0, // TODO: 실제 계산
  };
}

function mapAndCalculateContractAmount(
  cost: CargoDetailData["cost"],
): MappedContractAmount {
  const supplyPrice = cost.supplyPrice || 0;
  const shippingCost = cost.shippingCost || 0;
  const laborCost = cost.laborCost || 0;
  const transportStorageFee = cost.transportStorageFee || 0;
  const loadingUnloadingFee = cost.loadingUnloadingFee || 0;

  // TODO: 실제 계산 로직 구현
  return {
    contractorCost: supplyPrice,
    SupplyPrice: supplyPrice,
    contractorProfit: 0, // TODO: 실제 계산
    shippingCost,
    laborCost,
    transportStorageFee,
    loadingUnloadingFee,
  };
}

function mapAndCalculateExpense(
  cargo: CargoDetailData["cargo"],
): MappedExpense {
  const sellingPrice = cargo.sellingPrice || 0;
  const margin = cargo.margin || 0;
  const totalProfit = cargo.totalProfit || 0;

  // TODO: 실제 계산 로직 구현
  return {
    totalCost: sellingPrice - margin,
    sellingPrice,
    margin,
    totalProfit,
  };
}
