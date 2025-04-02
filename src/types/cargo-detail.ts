type Contract = {
  id: string;
  contractNumber: string | null;
  contractDate: string | null;
  contractParty: string | null;
  importer: string | null;
  incoterms: string | null;
};

type Payment = {
  id: string;
  paymentDueDate: string | null;
  paymentMethod: string;
  contractId: string;
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
  costId: string;
};

type ContractAmount = {
  id: string;
  supplyPrice: number | null;
  shippingCost: number | null;
  laborCost: number | null;
  transportStorageFee: number | null;
  loadingUnloadingFee: number | null;
  cargoId: string;
};

type Expense = {
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
  margin: number | null;
  totalProfit: number | null;
};

export type CargoDetailData = {
  contract: Contract;
  payment: Payment;
  costDetail: CostDetail;
  cost: ContractAmount;
  cargo: Expense;
  shipment: Shipment;
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
