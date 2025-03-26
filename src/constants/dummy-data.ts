export interface ShipmentData {
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

export const dummyShipmentData: ShipmentData[] = [
  {
    contractNumber: "C-2024-001",
    progressStatus: "입고",
    contractDate: "2024-01-15",
    importer: "미국곡물공사",
    contractParty: "한국식품(주)",
    estimatedTimeArrival: "2024-02-20",
    arrivalPort: "부산항",
    itemName: "밀가루",
    contractTon: 500,
    unitPrice: 850000,
    totalPrice: 425000000,
    paymentMethod: "L/C",
    warehouseEntryDate: "2024-02-22",
    importCostPerKg: 950,
    supplyCostPerKg: 1100,
    totalCost: 550000000,
    totalCostPerKg: 1200,
    sellingPrice: 650000000,
    margin: 15.4,
    totalProfit: 100000000,
  },
  {
    contractNumber: "C-2024-002",
    progressStatus: "예정",
    contractDate: "2024-02-01",
    importer: "태국쌀공사",
    contractParty: "대한식품(주)",
    estimatedTimeArrival: "2024-03-15",
    arrivalPort: "인천항",
    itemName: "쌀",
    contractTon: 300,
    unitPrice: 920000,
    totalPrice: 276000000,
    paymentMethod: "T/T",
    warehouseEntryDate: "2024-03-17",
    importCostPerKg: 1050,
    supplyCostPerKg: 1200,
    totalCost: 360000000,
    totalCostPerKg: 1300,
    sellingPrice: 420000000,
    margin: 14.3,
    totalProfit: 60000000,
  },
  {
    contractNumber: "C-2024-003",
    progressStatus: "출고",
    contractDate: "2024-01-20",
    importer: "호주곡물공사",
    contractParty: "서울식품(주)",
    estimatedTimeArrival: "2024-02-25",
    arrivalPort: "평택항",
    itemName: "보리",
    contractTon: 400,
    unitPrice: 780000,
    totalPrice: 312000000,
    paymentMethod: "CAD",
    warehouseEntryDate: "2024-02-27",
    importCostPerKg: 880,
    supplyCostPerKg: 1000,
    totalCost: 400000000,
    totalCostPerKg: 1100,
    sellingPrice: 480000000,
    margin: 16.7,
    totalProfit: 80000000,
  },
  {
    contractNumber: "C-2024-004",
    progressStatus: "판매",
    contractDate: "2024-01-10",
    importer: "중국곡물공사",
    contractParty: "부산식품(주)",
    estimatedTimeArrival: "2024-02-15",
    arrivalPort: "울산항",
    itemName: "옥수수",
    contractTon: 600,
    unitPrice: 720000,
    totalPrice: 432000000,
    paymentMethod: "Usance",
    warehouseEntryDate: "2024-02-17",
    importCostPerKg: 820,
    supplyCostPerKg: 950,
    totalCost: 570000000,
    totalCostPerKg: 1050,
    sellingPrice: 660000000,
    margin: 13.6,
    totalProfit: 90000000,
  },
  {
    contractNumber: "C-2024-005",
    progressStatus: "입고",
    contractDate: "2024-02-05",
    importer: "베트남곡물공사",
    contractParty: "광주식품(주)",
    estimatedTimeArrival: "2024-03-10",
    arrivalPort: "부산항",
    itemName: "콩",
    contractTon: 350,
    unitPrice: 890000,
    totalPrice: 311500000,
    paymentMethod: "T/T",
    warehouseEntryDate: "2024-03-12",
    importCostPerKg: 980,
    supplyCostPerKg: 1150,
    totalCost: 402500000,
    totalCostPerKg: 1250,
    sellingPrice: 472500000,
    margin: 14.8,
    totalProfit: 70000000,
  },
];
