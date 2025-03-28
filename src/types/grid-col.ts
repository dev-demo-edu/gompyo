export interface IShipmentData {
  contractNumber: string;
  progressStatus: string;
  contractDate: string;
  importer: string;
  productName: string;
  itemName: string;
  weight: number;
  containerCount: number;
  packagingUnit: string;
  unitPrice: number;
  totalPrice: number;
  supplyPrice: number;
  sellingPrice: number;
  paymentMethod: string;
  hsCode: string;
  blNumber: string;
  departurePort: string;
  etd: string;
  arrivalPort: string;
  eta: string;
  contractParty: string;
  customsDate: string;
}

export interface IPlanData {
  contractNumber: string;
  progressStatus: string;
  contractDate: string;
  importer: string;
  contractParty: string;
  estimatedTimeArrival: string;
  arrivalPort: string;
  itemName: string;
  contractTon: number;
  unitPrice: number;
  totalPrice: number;
  paymentMethod: string;
  warehouseEntryDate: string;
  importCostPerKg: number;
  supplyCostPerKg: number;
  totalCost: number;
  totalCostPerKg: number;
  sellingPrice: number;
  margin: number;
  totalProfit: number;
}
