import { CalculationType } from "./importer";

type Contract = {
  id: string;
  contractNumber: string | null;
  contractDate: string | null;
  exporter: string | null;
  importerId: string | null;
  incoterms: string | null;
};

type Payment = {
  id: string;
  paymentDueDate: string | null;
  paymentMethod: string;
  contractId: string;
  advancePaymentDate: string | null;
  advancePaymentRatio: number | null;
  advancePaymentAmount: number | null;
  remainingPaymentDate: string | null;
  remainingPaymentRatio: number | null;
  remainingPaymentAmount: number | null;
  counterpartBank: string | null;
  paymentTerm: string | null;
  // contractExchangeRate: string | null;
  totalContractAmount: number | null;
};

type CostDetail = {
  id: string;
  unitPrice: number | null;
  exchangeRate: number | null;
  customsTaxRate: number | null;
  customTaxAmount: number | null;
  customsFee: number | null;
  inspectionFee: number | null;
  doCharge: number | null;
  otherCosts: number | null;
  transferFee: number | null;
  costId: string;
};

type ContractAmount = {
  id: string;
  supplyPrice: number | null;
  shippingCost: number | null;
  laborCost: number | null;
  transportStorageFee: number | null;
  loadingUnloadingFee: number | null;
  usanceInterest: number | null;
  cargoId: string;
};

type Cargo = {
  id: string;
  itemsId: string;
  shipmentId: string;
  containerCount: number | null;
  contractTon: number | null;
  customsClearanceDate: string | null;
  quarantineDate: string | null;
  warehouseEntryDate: string | null;
  progressStatus: string | null;
  sellingPrice: number | null;
  sellingPriceWholesale: number | null;
  sellingPriceRetail: number | null;
  margin: number | null;
  totalProfit: number | null;
  purchaseFeeRate: number | null;
};

export type CargoDetailData = {
  importer: Importer;
  contract: Contract;
  payment: Payment;
  costDetail: CostDetail;
  cost: ContractAmount;
  cargo: Cargo;
  shipment: Shipment;
  item: Item;
};

export type Shipment = {
  id: string;
  contractId: string;
  estimatedTimeArrival: string | null;
  estimatedTimeDeparture: string | null;
  arrivalPort: string | null;
  shippingCompany: string | null;
  departurePort: string | null;
  blNumber: string | null;
  palletOrderDate: string | null;
  palletType: string | null;
};

export type Item = {
  id: string;
  itemName: string | null;
  itemVariety: string | null;
  originCountry: string | null;
  hsCode: string | null;
  packingUnit: string | null;
};

export type Importer = {
  id: string;
  importerName: string;
  calculationType: CalculationType;
};
