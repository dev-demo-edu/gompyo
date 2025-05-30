export const contractsSeed = [
  {
    id: "contract_custom_1",
    contractNumber: "34125",
    exporter: "SF",
    importerId: "importer_dnb",
    contractDate: "2025-03-01",
    incoterms: "FOB",
  },
  {
    id: "contract_custom_2",
    contractNumber: "84858",
    exporter: "ARG",
    importerId: "importer_namhae",
    contractDate: "2025-01-01",
    incoterms: "FOB",
  },
  {
    id: "contract_custom_3",
    contractNumber: "1040752",
    exporter: "CGI",
    importerId: "importer_namhae",
    contractDate: "2024-03-01",
    incoterms: "FOB",
  },
];

export const itemsSeed = [
  {
    id: "item_custom_1",
    itemName: "CHICKPEAS 9MM",
    itemVariety: "",
    originCountry: "",
    hsCode: "",
    packingUnit: "25kg bag",
  },
  {
    id: "item_custom_2",
    itemName: "CRIMSON 25KG",
    itemVariety: "",
    originCountry: "",
    hsCode: "",
    packingUnit: "25kg bag",
  },
  {
    id: "item_custom_3",
    itemName: "GREEN PEA",
    itemVariety: "",
    originCountry: "",
    hsCode: "",
    packingUnit: "1.2ton bag",
  },
];

export const shipmentsSeed = [
  {
    id: "shipment_custom_1",
    contractId: "contract_custom_1",
    estimatedTimeArrival: "2025-03-25 00:00:00",
    estimatedTimeDeparture: "",
    arrivalPort: "",
    shippingCompany: "",
    departurePort: "",
    blNumber: "",
    palletOrderDate: "",
    palletType: "",
  },
  {
    id: "shipment_custom_2",
    contractId: "contract_custom_2",
    estimatedTimeArrival: "2025-01-23 00:00:00",
    estimatedTimeDeparture: "",
    arrivalPort: "",
    shippingCompany: "",
    departurePort: "",
    blNumber: "",
    palletOrderDate: "",
    palletType: "",
  },
  {
    id: "shipment_custom_3",
    contractId: "contract_custom_3",
    estimatedTimeArrival: "2024-03-06 00:00:00",
    estimatedTimeDeparture: "",
    arrivalPort: "",
    shippingCompany: "",
    departurePort: "",
    blNumber: "",
    palletOrderDate: "",
    palletType: "",
  },
];

export const cargosSeed = [
  {
    id: "cargo_custom_1",
    itemsId: "item_custom_1",
    shipmentId: "shipment_custom_1",
    contractTon: 48.0,
    sellingPrice: 1500,
    containerCount: null,
    customsClearanceDate: "",
    quarantineDate: "",
    warehouseEntryDate: "",
    progressStatus: "AFTER_CUSTOMS",
    margin: 1489,
    totalProfit: 71448000,
    purchaseFeeRate: 6,
  },
  {
    id: "cargo_custom_2",
    itemsId: "item_custom_2",
    shipmentId: "shipment_custom_2",
    contractTon: 72.0,
    sellingPrice: 1400,
    containerCount: null,
    customsClearanceDate: "",
    quarantineDate: "",
    warehouseEntryDate: "",
    progressStatus: "AFTER_CUSTOMS",
    margin: 111,
    totalProfit: 7961200,
    purchaseFeeRate: 5.9,
  },
  {
    id: "cargo_custom_3",
    itemsId: "item_custom_3",
    shipmentId: "shipment_custom_3",
    contractTon: 47.15,
    sellingPrice: 1200,
    containerCount: null,
    customsClearanceDate: "",
    quarantineDate: "",
    warehouseEntryDate: "",
    progressStatus: "AFTER_CUSTOMS",
    margin: 90,
    totalProfit: 4229195,
    purchaseFeeRate: 6,
  },
];

export const costsSeed = [
  {
    id: "cost_custom_1",
    cargoId: "cargo_custom_1",
    supplyPrice: 0,
    shippingCost: 1440000,
    laborCost: 1440000,
    transportStorageFee: 1440000,
    loadingUnloadingFee: 0,
  },
  {
    id: "cost_custom_2",
    cargoId: "cargo_custom_2",
    supplyPrice: 0,
    shippingCost: 2160000,
    laborCost: 2160000,
    transportStorageFee: 2160000,
    loadingUnloadingFee: 0,
  },
  {
    id: "cost_custom_3",
    cargoId: "cargo_custom_3",
    supplyPrice: 0,
    shippingCost: 1414500,
    laborCost: 1414500,
    transportStorageFee: 1414500,
    loadingUnloadingFee: 0,
  },
];

export const costDetailsSeed = [
  {
    id: "detail_custom_1",
    costId: "cost_custom_1",
    unitPrice: 910,
    exchangeRate: 1450.0,
    customsTaxRate: 0,
    customTaxAmount: 0.0,
    customsFee: 0,
    inspectionFee: 0,
    doCharge: 0,
    otherCosts: null,
    transferFee: 0,
  },
  {
    id: "detail_custom_2",
    costId: "cost_custom_2",
    unitPrice: 765,
    exchangeRate: 1435.0,
    customsTaxRate: 0,
    customTaxAmount: 0.0,
    customsFee: 100000.0,
    inspectionFee: 110000.0,
    doCharge: 2125000,
    otherCosts: null,
    transferFee: 150000.0,
  },
  {
    id: "detail_custom_3",
    costId: "cost_custom_3",
    unitPrice: 705,
    exchangeRate: 1340.0,
    customsTaxRate: 0,
    customTaxAmount: 0.0,
    customsFee: 70000.0,
    inspectionFee: 110000.0,
    doCharge: 550000.0,
    otherCosts: null,
    transferFee: 100000.0,
  },
];

export const paymentsSeed = [
  {
    id: "payment_custom_1",
    contractId: "contract_custom_1",
    paymentDueDate: "2025-03-25",
    paymentMethod: "L/C",
  },
  {
    id: "payment_custom_2",
    contractId: "contract_custom_2",
    paymentDueDate: "2025-01-23",
    paymentMethod: "CAD",
  },
  {
    id: "payment_custom_3",
    contractId: "contract_custom_3",
    paymentDueDate: "2024-03-06",
    paymentMethod: "T/T",
  },
];

export const paymentsTtSeed = [
  {
    paymentId: "payment_custom_1",
    advancePaymentDate: "",
    remainingPaymentDate: "2025-03-25",
    advancePaymentRatio: 30.0,
    remainingPaymentRatio: 70.0,
    advancePaymentAmount: null,
    remainingPaymentAmount: null,
    counterpartBank: "",
  },
  {
    paymentId: "payment_custom_2",
    advancePaymentDate: "",
    remainingPaymentDate: "2025-01-23",
    advancePaymentRatio: 30.0,
    remainingPaymentRatio: 70.0,
    advancePaymentAmount: null,
    remainingPaymentAmount: null,
    counterpartBank: "",
  },
  {
    paymentId: "payment_custom_3",
    advancePaymentDate: "",
    remainingPaymentDate: "2024-03-06",
    advancePaymentRatio: 30.0,
    remainingPaymentRatio: 70.0,
    advancePaymentAmount: null,
    remainingPaymentAmount: null,
    counterpartBank: "",
  },
];

export const importersSeed = [
  {
    id: "importer_namhae",
    importerName: "남해",
    calculationType: "NAMHAE",
  },
  {
    id: "importer_dnb",
    importerName: "DNB",
    calculationType: "DNB",
  },
  {
    id: "importer_standard",
    importerName: "Standard",
    calculationType: "STANDARD",
  },
];

export const companiesSeed = [
  {
    id: "com-1",
    name: "곰표",
    companyBalance: 20,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "com-2",
    name: "램플러스",
    companyBalance: 20,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "com-3",
    name: "인우",
    companyBalance: 20,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const cashflowsSeed = [
  {
    id: "1",
    date: "2025-04-24",
    companyId: "com-1",
    counterparty: "디앤비",
    amount: 50,
    type: "expense",
    priority: 3,
    createdAt: "2025-04-24T09:00:00Z",
    updatedAt: "2025-04-24T09:00:00Z",
  },
  {
    id: "2",
    date: "2025-04-25",
    companyId: "com-1",
    counterparty: "디앤비",
    amount: 50,
    type: "expense",
    priority: null,
    createdAt: "2025-04-25T09:00:00Z",
    updatedAt: "2025-04-25T09:00:00Z",
  },
  {
    id: "3",
    date: "2025-04-28",
    companyId: "com-1",
    counterparty: "최재원",
    amount: 3,
    type: "expense",
    priority: 2,
    createdAt: "2025-04-28T09:00:00Z",
    updatedAt: "2025-04-28T09:00:00Z",
  },
  {
    id: "4",
    date: "2025-04-30",
    companyId: "com-1",
    counterparty: "디앤비",
    amount: 100,
    type: "expense",
    priority: null,
    createdAt: "2025-04-30T09:00:00Z",
    updatedAt: "2025-04-30T09:00:00Z",
  },
  {
    id: "5",
    date: "2025-04-30",
    companyId: "com-1",
    counterparty: "남해",
    amount: 150,
    type: "expense",
    priority: null,
    createdAt: "2025-04-30T09:00:00Z",
    updatedAt: "2025-04-30T09:00:00Z",
  },
  {
    id: "6",
    date: "2025-04-30",
    companyId: "com-1",
    counterparty: "디앤비",
    amount: 100,
    type: "expense",
    priority: null,
    createdAt: "2025-04-30T09:00:00Z",
    updatedAt: "2025-04-30T09:00:00Z",
  },
  {
    id: "7",
    date: "2025-05-10",
    companyId: "com-1",
    counterparty: "남해",
    amount: 200,
    type: "expense",
    priority: 1,
    createdAt: "2025-05-10T09:00:00Z",
    updatedAt: "2025-05-10T09:00:00Z",
  },
  {
    id: "8",
    date: "2025-04-25",
    companyId: "com-1",
    counterparty: "한끼",
    amount: 5,
    type: "income",
    priority: null,
    createdAt: "2025-04-25T09:00:00Z",
    updatedAt: "2025-04-25T09:00:00Z",
  },
  {
    id: "9",
    date: "2025-04-28",
    companyId: "com-1",
    counterparty: "대한",
    amount: 20,
    type: "income",
    priority: null,
    createdAt: "2025-04-28T09:00:00Z",
    updatedAt: "2025-04-28T09:00:00Z",
  },
  {
    id: "10",
    date: "2025-04-30",
    companyId: "com-1",
    counterparty: "천일",
    amount: 35,
    type: "income",
    priority: null,
    createdAt: "2025-04-30T09:00:00Z",
    updatedAt: "2025-04-30T09:00:00Z",
  },
  {
    id: "11",
    date: "2025-04-30",
    companyId: "com-1",
    counterparty: "박인터",
    amount: 10,
    type: "income",
    priority: null,
    createdAt: "2025-04-30T09:00:00Z",
    updatedAt: "2025-04-30T09:00:00Z",
  },
  {
    id: "12",
    date: "2025-04-30",
    companyId: "com-1",
    counterparty: "기타",
    amount: 113,
    type: "income",
    priority: null,
    createdAt: "2025-04-30T09:00:00Z",
    updatedAt: "2025-04-30T09:00:00Z",
  },
  {
    id: "13",
    date: "2025-04-30",
    companyId: "com-1",
    counterparty: "램플",
    amount: 160,
    type: "income",
    priority: null,
    createdAt: "2025-04-30T09:00:00Z",
    updatedAt: "2025-04-30T09:00:00Z",
  },
];
