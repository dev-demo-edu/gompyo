export interface CargoItem {
  sku: string;
  item: string;
  variety: string;
  hsCode: string;
  contractTonnage: number;
  packagingUnit: string;
  unitPrice: number;
  exchangeRate: number;
  tariffRate: number;
  paymentMethod: string;
  remittanceFee: number;
  customsFee: number;
  inspectionFee: number;
  otherCosts: number;
  purchaseFee: number;
  sellingPrice: number;
  containerCount?: number;
  originCountry?: string;
}

export interface ContractData {
  contractNumber: string;
  contractDate: string; // YYYY-MM-DD 형식
  supplier: string;
  importer: string;
  incoterms: string;
  eta: string; // YYYY-MM-DD 형식
  etd: string; // YYYY-MM-DD 형식
  arrivalPort: string;
  departurePort: string;
  vessel: string;
  blNumber: string;
  containerType: string;
}
