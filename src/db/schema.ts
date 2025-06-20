import {
  sqliteTable,
  text,
  integer,
  real,
  check,
} from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";
import { relations } from "drizzle-orm";
import {
  defaultPlanColumnOrderFields,
  defaultShipmentColumnOrderFields,
  defaultQuotationColumnOrderFields,
} from "@/constants/column";

// Importers table
export const importers = sqliteTable("importers", {
  id: text("id").primaryKey(),
  importerName: text("importer_name").notNull(),
  importerCode: text("importer_code"),
  calculationType: text("calculation_type").notNull(),
});

// Payments table
export const payments = sqliteTable(
  "payments",
  {
    id: text("id").primaryKey(),
    paymentDueDate: text("payment_due_date"), // SQLite stores DATE as TEXT
    paymentMethod: text("payment_method").notNull(),
    contractId: text("contract_id").notNull(),
  },
  (table) => [
    check(
      "payment_type_check",
      sql`${table.paymentMethod} IN ('T/T', 'CAD', 'L/C', 'Usance')`,
    ),
  ],
);

// Payments TT table
export const paymentsTt = sqliteTable("payments_tt", {
  paymentId: text("payment_id")
    .primaryKey()
    .references(() => payments.id, { onDelete: "cascade" }),
  advancePaymentDate: text("advance_payment_date"),
  advancePaymentRatio: real("advance_payment_ratio"),
  remainingPaymentDate: text("remaining_payment_date"),
  remainingPaymentRatio: real("remaining_payment_ratio"),
  counterpartBank: text("counterpart_bank"),
});

// Payments Usance table
export const paymentsUsance = sqliteTable("payments_usance", {
  paymentId: text("payment_id")
    .primaryKey()
    .references(() => payments.id, { onDelete: "cascade" }),
  paymentTerm: text("payment_term"),
  contractExchangeRate: text("contact_exchange_rate"), // Fixed typo from original schema
});

// Cost Details table
export const costDetails = sqliteTable("cost_details", {
  id: text("id").primaryKey(),
  unitPrice: real("unit_price"),
  exchangeRate: real("exchange_rate"),
  customsTaxRate: real("customs_tax_rate"),
  // customTaxAmount: real("custom_tax_amount"),
  customsFee: real("customs_fee"),
  inspectionFee: real("inspection_fee"),
  doCharge: real("do_charge"),
  otherCosts: real("other_costs"),
  transferFee: real("transfer_fee"),
  costId: text("cost_id").notNull(),
});

// Contracts table
export const contracts = sqliteTable("contracts", {
  id: text("id").primaryKey(),
  contractNumber: text("contract_number"),
  contractDate: text("contract_date"),
  exporter: text("exporter"),
  importerId: text("importer_id").references(() => importers.id),
  incoterms: text("incoterms"),
  createdAt: text("created_at"),
  updatedAt: text("updated_at"),
});

// Items table
export const items = sqliteTable("items", {
  id: text("id").primaryKey(),
  itemName: text("item_name"),
  itemVariety: text("item_variety"),
  originCountry: text("origin_country"),
  hsCode: text("hs_code"),
  packingUnit: text("packing_unit"),
});

// Costs table
export const costs = sqliteTable("costs", {
  id: text("id").primaryKey(),
  supplyPrice: real("supply_price"),
  shippingCost: real("shipping_cost"),
  laborCost: real("labor_cost"),
  transportStorageFee: real("transport_storage_fee"),
  loadingUnloadingFee: real("loading_unloading_fee"),
  usanceInterest: real("usance_interest"),
  cargoId: text("cargo_id").notNull(),
  gompyoLaborCost: real("gompyo_labor_cost"),
  gompyoTransportStorageFee: real("gompyo_transport_storage_fee"),
  gompyoLoadingUnloadingFee: real("gompyo_loading_unloading_fee"),
});

// Users table
export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  email: text("email"),
  password: text("password"),
  name: text("name"),
  planColumnOrder: text("plan_column_order").default(
    JSON.stringify(defaultPlanColumnOrderFields),
  ),
  shipmentColumnOrder: text("shipment_column_order").default(
    JSON.stringify(defaultShipmentColumnOrderFields),
  ),
  quotationColumnOrder: text("quotation_column_order").default(
    JSON.stringify(defaultQuotationColumnOrderFields),
  ),
});

// Shipments table
export const shipments = sqliteTable("shipments", {
  id: text("id").primaryKey(),
  contractId: text("contract_id").notNull(),
  estimatedTimeArrival: text("estimated_time_arrival"),
  estimatedTimeDeparture: text("estimated_time_departure"),
  arrivalPort: text("arrival_port"),
  shippingCompany: text("shipping_company"),
  departurePort: text("departure_port"),
  blNumber: text("bl_number"),
  palletOrderDate: text("pallet_order_date"),
  palletType: text("pallet_type"),
  createdAt: text("created_at"),
  updatedAt: text("updated_at"),
});

// Cargos table
export const cargos = sqliteTable(
  "cargos",
  {
    id: text("id").primaryKey(),
    itemsId: text("items_id").notNull(),
    shipmentId: text("shipment_id").notNull(),
    containerCount: integer("container_count"),
    contractTon: integer("contract_ton"),
    customsClearanceDate: text("customs_clearance_date"),
    quarantineDate: text("quarantine_date"),
    warehouseEntryDate: text("warehouse_entry_date"),
    progressStatus: text("progress_status"),
    sellingPrice: real("selling_price"),
    sellingPriceWholesale: real("selling_price_wholesale"),
    sellingPriceRetail: real("selling_price_retail"),
    margin: real("margin"),
    totalProfit: real("total_profit"),
    purchaseFeeRate: real("purchase_fee_rate"),
    remark: text("remark"),
    createdAt: text("created_at"),
    updatedAt: text("updated_at"),
  },
  (table) => [
    check(
      "progress_status_check",
      sql`${table.progressStatus} IN ('REVIEW', 'CONTRACTING', 'BEFORE_LC', 'BEFORE_ARRIVAL', 'WAREHOUSE_MOVING', 'BEFORE_QUARANTINE', 'QUARANTINING', 'CUSTOMS_DECLARING', 'DONE_ARRIVAL', 'AFTER_CUSTOMS', 'SELLING', 'SOLD_DONE')`,
    ),
  ],
);

// Documents table
export const documents = sqliteTable("documents", {
  id: text("id").primaryKey(),
  documentName: text("document_name").notNull(),
  documentType: text("document_type").notNull(),
  s3Url: text("s3_url").notNull(),
  uploadDate: text("upload_date").notNull(),
  relatedId: text("related_id").notNull(),
  documentCategory: text("document_category").notNull(),
});

// History logs table
export const historyLogs = sqliteTable("history_logs", {
  id: text("id").primaryKey(),
  targetType: text("target_type"),
  targetId: text("target_id"),
  type: text("type"), // "change" | "status"
  user: text("user"),
  changes: text("changes"), // ← 단일이든 다중이든 여기만 씀
  status: text("status"), // ← 상태 변화일 경우만 사용
  createdAt: text("created_at"),
});

// Account Number table
export const accountNumbers = sqliteTable("account_numbers", {
  id: text("id").primaryKey(),
  accountNumber: text("account_number").notNull(),
  bankName: text("bank_name").notNull(),
  owner: text("owner").notNull(),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at"),
});

// Business Numbers table
export const businessNumbers = sqliteTable("business_numbers", {
  id: text("id").primaryKey(),
  businessNumber: text("business_number").notNull(),
  businessName: text("business_name").notNull(),
  businessRepresentative: text("business_representative").notNull(),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at"),
});

// Links table
export const links = sqliteTable("links", {
  id: text("id").primaryKey(), // UUID 등 고유값
  title: text("title").notNull(), // 링크 제목
  url: text("url").notNull(), // 링크 URL
  thumbnail: text("thumbnail"), // 썸네일 URL
  order: integer("order").notNull(), // 정렬 순서(작은 값이 먼저)
  createdAt: text("created_at").notNull(), // 생성일(ISO string)
  updatedAt: text("updated_at").notNull(), // 수정일(ISO string)
});

// Importers relations
export const importersRelations = relations(importers, ({ many }) => ({
  contracts: many(contracts),
}));

// Payments relations
export const paymentsRelations = relations(payments, ({ one }) => ({
  contract: one(contracts, {
    fields: [payments.contractId],
    references: [contracts.id],
  }),
  paymentsTt: one(paymentsTt, {
    fields: [payments.id],
    references: [paymentsTt.paymentId],
  }),
  paymentsUsance: one(paymentsUsance, {
    fields: [payments.id],
    references: [paymentsUsance.paymentId],
  }),
}));

// PaymentsTt relations
export const paymentsTtRelations = relations(paymentsTt, ({ one }) => ({
  payment: one(payments, {
    fields: [paymentsTt.paymentId],
    references: [payments.id],
  }),
}));

// PaymentsUsance relations
export const paymentsUsanceRelations = relations(paymentsUsance, ({ one }) => ({
  payment: one(payments, {
    fields: [paymentsUsance.paymentId],
    references: [payments.id],
  }),
}));

// CostDetails relations
export const costDetailsRelations = relations(costDetails, ({ one }) => ({
  cost: one(costs, {
    fields: [costDetails.costId],
    references: [costs.id],
  }),
}));

// Contracts relations
export const contractsRelations = relations(contracts, ({ many, one }) => ({
  payments: many(payments),
  shipments: many(shipments),
  documents: many(documents),
  importer: one(importers, {
    fields: [contracts.importerId],
    references: [importers.id],
  }),
}));

// Items relations
export const itemsRelations = relations(items, ({ many }) => ({
  cargos: many(cargos),
}));

// Costs relations
export const costsRelations = relations(costs, ({ one, many }) => ({
  cargo: one(cargos, {
    fields: [costs.cargoId],
    references: [cargos.id],
  }),
  costDetails: many(costDetails),
}));

// Shipments relations
export const shipmentsRelations = relations(shipments, ({ one, many }) => ({
  contract: one(contracts, {
    fields: [shipments.contractId],
    references: [contracts.id],
  }),
  cargos: many(cargos),
  documents: many(documents),
}));

// Cargos relations
export const cargosRelations = relations(cargos, ({ one, many }) => ({
  item: one(items, {
    fields: [cargos.itemsId],
    references: [items.id],
  }),
  shipment: one(shipments, {
    fields: [cargos.shipmentId],
    references: [shipments.id],
  }),
  costs: many(costs),
}));

// Documents relations
export const documentsRelations = relations(documents, ({ one }) => ({
  contract: one(contracts, {
    fields: [documents.relatedId],
    references: [contracts.id],
    relationName: "contract_documents",
  }),
  shipment: one(shipments, {
    fields: [documents.relatedId],
    references: [shipments.id],
    relationName: "shipment_documents",
  }),
}));

// History logs relations
export const historyLogsRelations = relations(historyLogs, ({}) => ({
  // 여기서는 특별한 관계 설정이 필요 없음 (targetType과 targetId로 동적 참조)
}));

export const cashflows = sqliteTable(
  "cashflows",
  {
    id: text("id").primaryKey(),
    date: text("date").notNull(), // ISO string 등으로 저장
    companyId: text("company_id").notNull(),
    counterparty: text("counterparty").notNull(),
    amount: real("amount").notNull(),
    type: text("type").notNull(), // income | expense
    priority: integer("priority"),
    isApproved: integer("is_approved", { mode: "boolean" }).default(false),
    createdAt: text("created_at").notNull(),
    updatedAt: text("updated_at").notNull(),
  },
  (table) => [
    check("cashflow_type_check", sql`${table.type} IN ('income', 'expense')`),
  ],
);

export const companies = sqliteTable("companies", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  companyBalance: real("company_balance").notNull(),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export const cashflowsRelations = relations(cashflows, ({ one }) => ({
  company: one(companies, {
    fields: [cashflows.companyId],
    references: [companies.id],
  }),
}));

export const companiesRelations = relations(companies, ({ many }) => ({
  cashflows: many(cashflows),
}));

// Stock(재고/판매량) 테이블
export const stocks = sqliteTable("stocks", {
  id: text("id").primaryKey(),
  cargoId: text("cargo_id")
    .notNull()
    .references(() => cargos.id, { onDelete: "cascade" }),
  // 각 회사별 통관재고
  dnbCleared: integer("dnb_cleared").notNull().default(0),
  namhaeCleared: integer("namhae_cleared").notNull().default(0),
  interlivingCleared: integer("interliving_cleared").notNull().default(0),
  gompyoCleared: integer("gompyo_cleared").notNull().default(0),
  ramplusCleared: integer("ramplus_cleared").notNull().default(0),
  // 각 회사별 미통관재고
  dnbUncleared: integer("dnb_uncleared").notNull().default(0),
  namhaeUncleared: integer("namhae_uncleared").notNull().default(0),
  interlivingUncleared: integer("interliving_uncleared").notNull().default(0),
  gompyoUncleared: integer("gompyo_uncleared").notNull().default(0),
  ramplusUncleared: integer("ramplus_uncleared").notNull().default(0),
  // sales 관련
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

// Stock 테이블 관계
export const stocksRelations = relations(stocks, ({ one }) => ({
  cargo: one(cargos, {
    fields: [stocks.cargoId],
    references: [cargos.id],
  }),
}));

// Partner Companies table (거래처 관리용)
export const partnerCompanies = sqliteTable(
  "partner_companies",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    type: text("type").notNull(), // payment | collection
    createdAt: text("created_at").notNull(),
    updatedAt: text("updated_at").notNull(),
  },
  (table) => [
    check(
      "partner_company_type_check",
      sql`${table.type} IN ('payment', 'collection')`,
    ),
  ],
);

// Company Years table (회사별 연도 관리)
export const companyYears = sqliteTable("company_years", {
  id: text("id").primaryKey(),
  companyId: text("company_id")
    .notNull()
    .references(() => partnerCompanies.id, { onDelete: "cascade" }),
  year: integer("year").notNull(),
  // 연초 이월 잔액 (전년도 12월 말 잔액)
  lampleOpeningBalance: real("lample_opening_balance").default(0),
  gompyoOpeningBalance: real("gompyo_opening_balance").default(0),
  // 연말 잔액 (계산된 값, 다음 연도 이월잔액이 됨)
  lampleClosingBalance: real("lample_closing_balance").default(0),
  gompyoClosingBalance: real("gompyo_closing_balance").default(0),
  // 연도별 상태 관리
  isActive: integer("is_active", { mode: "boolean" }).default(true),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

// Financial Data table (재무 데이터)
export const financialData = sqliteTable("financial_data", {
  id: text("id").primaryKey(),
  yearId: text("year_id")
    .notNull()
    .references(() => companyYears.id, { onDelete: "cascade" }),
  month: text("month").notNull(), // "이월잔액", "1월", "2월", ... "12월"
  isCarryover: integer("is_carryover", { mode: "boolean" }).default(false),
  lamplePurchase: real("lample_purchase"),
  lamplePayment: real("lample_payment"),
  gompyoPurchase: real("gompyo_purchase"),
  gompyoPayment: real("gompyo_payment"),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

// Company Years relations
export const companyYearsRelations = relations(
  companyYears,
  ({ one, many }) => ({
    company: one(partnerCompanies, {
      fields: [companyYears.companyId],
      references: [partnerCompanies.id],
    }),
    financialData: many(financialData),
  }),
);

// Partner Companies relations
export const partnerCompaniesRelations = relations(
  partnerCompanies,
  ({ many }) => ({
    companyYears: many(companyYears),
  }),
);

// Financial Data relations
export const financialDataRelations = relations(financialData, ({ one }) => ({
  companyYear: one(companyYears, {
    fields: [financialData.yearId],
    references: [companyYears.id],
  }),
}));

// Partners table (견적 컬럼용 회사 테이블)
export const quotationCompanies = sqliteTable(
  "quotation_companies",
  {
    id: text("id").primaryKey(),
    companyName: text("company_name").notNull(),
    companyType: text("company_type").notNull(),
    priceType: text("price_type").notNull(),
    createdAt: text("created_at").notNull(),
    updatedAt: text("updated_at").notNull(),
  },
  (table) => [
    check(
      "company_type_check",
      sql`${table.companyType} IN ('domestic', 'foreign')`,
    ),
    check(
      "price_type_check",
      sql`${table.priceType} IN ('arrival', 'loading')`,
    ),
  ],
);

// Quotation Items table (견적 행용 품목 테이블)
export const quotationItems = sqliteTable("quotation_items", {
  id: text("id").primaryKey(),
  itemName: text("item_name").notNull(),
  itemOrigin: text("item_origin").notNull(),
  itemNameEn: text("item_name_en"),
  itemOriginEn: text("item_origin_en"),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export const quotationCompaniesItems = sqliteTable(
  "quotation_companies_items",
  {
    id: text("id").primaryKey(),
    companyId: text("company_id")
      .notNull()
      .references(() => quotationCompanies.id, { onDelete: "cascade" }),
    itemId: text("item_id")
      .notNull()
      .references(() => quotationItems.id, { onDelete: "cascade" }),
    value: real("value"),
    createdAt: text("created_at").notNull(),
    updatedAt: text("updated_at").notNull(),
  },
);

export const quotationCompaniesRelations = relations(
  quotationCompanies,
  ({ many }) => ({
    quotationCompaniesItems: many(quotationCompaniesItems),
  }),
);

export const quotationItemsRelations = relations(
  quotationItems,
  ({ many }) => ({
    quotationCompaniesItems: many(quotationCompaniesItems),
  }),
);

export const quotationCompaniesItemsRelations = relations(
  quotationCompaniesItems,
  ({ one }) => ({
    company: one(quotationCompanies, {
      fields: [quotationCompaniesItems.companyId],
      references: [quotationCompanies.id],
    }),
    item: one(quotationItems, {
      fields: [quotationCompaniesItems.itemId],
      references: [quotationItems.id],
    }),
  }),
);
