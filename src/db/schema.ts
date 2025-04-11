import {
  sqliteTable,
  text,
  integer,
  real,
  check,
} from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";
import { relations } from "drizzle-orm";

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

// Payments TT table
export const paymentsTt = sqliteTable("payments_tt", {
  paymentId: text("payment_id")
    .primaryKey()
    .references(() => payments.id, { onDelete: "cascade" }),
  advancePaymentDate: text("advance_payment_date"),
  advancePaymentRatio: real("advance_payment_ratio"),
  advancePaymentAmount: real("advance_payment_amount"),
  remainingPaymentDate: text("remaining_payment_date"),
  remainingPaymentRatio: real("remaining_payment_ratio"),
  remainingPaymentAmount: real("remaining_payment_amount"),
  counterpartBank: text("counterpart_bank"),
});

// PaymentsTt relations
export const paymentsTtRelations = relations(paymentsTt, ({ one }) => ({
  payment: one(payments, {
    fields: [paymentsTt.paymentId],
    references: [payments.id],
  }),
}));

// Payments Usance table
export const paymentsUsance = sqliteTable("payments_usance", {
  paymentId: text("payment_id")
    .primaryKey()
    .references(() => payments.id, { onDelete: "cascade" }),
  paymentTerm: text("payment_term"),
  contractExchangeRate: text("contact_exchange_rate"), // Fixed typo from original schema
});

// PaymentsUsance relations
export const paymentsUsanceRelations = relations(paymentsUsance, ({ one }) => ({
  payment: one(payments, {
    fields: [paymentsUsance.paymentId],
    references: [payments.id],
  }),
}));

// Cost Details table
export const costDetails = sqliteTable("cost_details", {
  id: text("id").primaryKey(),
  unitPrice: real("unit_price"),
  exchangeRate: real("exchange_rate"),
  customsTaxRate: real("customs_tax_rate"),
  customTaxAmount: real("custom_tax_amount"),
  customsFee: real("customs_fee"),
  inspectionFee: real("inspection_fee"),
  doCharge: real("do_charge"),
  otherCosts: real("other_costs"),
  transferFee: real("transfer_fee"),
  costId: text("cost_id").notNull(),
});

// CostDetails relations
export const costDetailsRelations = relations(costDetails, ({ one }) => ({
  cost: one(costs, {
    fields: [costDetails.costId],
    references: [costs.id],
  }),
}));

// Contracts table
export const contracts = sqliteTable("contracts", {
  id: text("id").primaryKey(),
  contractNumber: text("contract_number"),
  contractDate: text("contract_date"),
  contractParty: text("contract_party"),
  importer: text("importer"),
  incoterms: text("incoterms"),
});

// Contracts relations
export const contractsRelations = relations(contracts, ({ many }) => ({
  payments: many(payments),
  shipments: many(shipments),
  documents: many(documents),
}));

// Items table
export const items = sqliteTable("items", {
  id: text("id").primaryKey(),
  itemName: text("item_name"),
  itemVariety: text("item_variety"),
  originCountry: text("origin_country"),
  hsCode: text("hs_code"),
  packingUnit: text("packing_unit"),
});

// Items relations
export const itemsRelations = relations(items, ({ many }) => ({
  cargos: many(cargos),
}));

// Costs table
export const costs = sqliteTable("costs", {
  id: text("id").primaryKey(),
  supplyPrice: real("supply_price"),
  shippingCost: real("shipping_cost"),
  laborCost: real("labor_cost"),
  transportStorageFee: real("transport_storage_fee"),
  loadingUnloadingFee: real("loading_unloading_fee"),
  cargoId: text("cargo_id").notNull(),
});

// Costs relations
export const costsRelations = relations(costs, ({ one, many }) => ({
  cargo: one(cargos, {
    fields: [costs.cargoId],
    references: [cargos.id],
  }),
  costDetails: many(costDetails),
}));

// Users table
export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  email: text("email"),
  password: text("password"),
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
});

// Shipments relations
export const shipmentsRelations = relations(shipments, ({ one, many }) => ({
  contract: one(contracts, {
    fields: [shipments.contractId],
    references: [contracts.id],
  }),
  cargos: many(cargos),
  documents: many(documents),
}));

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
    margin: real("margin"),
    totalProfit: real("total_profit"),
    purchaseFeeRate: real("purchase_fee_rate"),
  },
  (table) => [
    check(
      "progress_status_check",
      sql`${table.progressStatus} IN ('예정', '입고', '출고', '판매')`,
    ),
  ],
);

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
