export interface IShipmentData {
  contractNumber: string;
  progressStatus: string;
  contractDate: string;
  importer: string;
  productName: string;
  itemName: string;
  weight: number;
  containerCount: number;
  packingUnit: string;
  unitPrice: number;
  totalPrice: number;
  totalPriceUsd: number; // 새로운 달러 단위 총액
  supplyPrice: number;
  sellingPrice: number;
  paymentMethod: string;
  hsCode: string;
  blNumber: string;
  departurePort: string;
  etd: string;
  arrivalPort: string;
  eta: string;
  exporter: string;
  customsDate: string;
}

export interface IPlanData {
  id: string;
  contractNumber: string;
  progressStatus: string;
  contractDate: string;
  importer: string;
  exporter: string;
  estimatedTimeArrival: string;
  arrivalPort: string;
  itemName: string;
  contractTon: number;
  unitPrice: number;
  totalPrice: number;
  totalPriceUsd: number; // 새로운 달러 단위 총액
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
