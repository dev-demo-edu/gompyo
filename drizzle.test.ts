import { drizzle } from "drizzle-orm/better-sqlite3";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import Database from "better-sqlite3";
import fs from "fs";
import path from "path";
import { nanoid } from "nanoid";
import { sql } from "drizzle-orm";

// Import all schema entities
import {
  payments,
  paymentsTt,
  paymentsUsance,
  contracts,
  shipments,
  cargos,
  items,
  costs,
  costDetails,
  users,
} from "./src/db/schema";

// Test database configuration
const DB_PATH = path.resolve("./gompyo-db.sqlite");
const DB_DIR = path.dirname(DB_PATH);

// Ensure the database directory exists
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
  console.log(`Created database directory: ${DB_DIR}`);
}

// Setup database connection for testing
const sqlite = new Database(DB_PATH);
const db = drizzle(sqlite);

// Test function
async function runTests() {
  console.log("🧪 Running database schema tests...");

  try {
    // Clean up previous test data if exists
    console.log("🧹 Cleaning up previous test data...");
    cleanupDatabase();

    // Create test tables
    console.log("🔧 Creating test tables...");
    createTestTables();

    // Test contract creation
    console.log("\n📝 Testing contract creation...");
    const contractId = await testCreateContract();

    // Test payment creation with T/T method
    console.log("\n💰 Testing T/T payment creation...");
    const ttPaymentId = await testCreateTTPayment(contractId);

    // Test payment creation with Usance method
    console.log("\n💳 Testing Usance payment creation...");
    const usancePaymentId = await testCreateUsancePayment(contractId);

    // Test shipment creation
    console.log("\n🚢 Testing shipment creation...");
    const shipmentId = await testCreateShipment(contractId);

    // Test item creation
    console.log("\n📦 Testing item creation...");
    const itemId = await testCreateItem();

    // Test cargo creation
    console.log("\n🏭 Testing cargo creation...");
    const cargoId = await testCreateCargo(shipmentId, itemId);

    // Test cost creation
    console.log("\n💲 Testing cost creation...");
    await testCreateCost(cargoId);

    // Test relationship queries
    console.log("\n🔄 Testing relationship queries...");
    await testRelationships(contractId, ttPaymentId, usancePaymentId);

    console.log("\n✅ All tests passed successfully!");
  } catch (error) {
    console.error("\n❌ Test failed:", error);
  } finally {
    // Cleanup database
    cleanupDatabase();
    sqlite.close();
    console.log("\n🔌 Database connection closed.");
  }
}

// Helper functions for tests
function cleanupDatabase() {
  // Drop tables in reverse order of dependency
  sqlite.exec("DROP TABLE IF EXISTS cost_details");
  sqlite.exec("DROP TABLE IF EXISTS costs");
  sqlite.exec("DROP TABLE IF EXISTS cargos");
  sqlite.exec("DROP TABLE IF EXISTS items");
  sqlite.exec("DROP TABLE IF EXISTS payments_usance");
  sqlite.exec("DROP TABLE IF EXISTS payments_tt");
  sqlite.exec("DROP TABLE IF EXISTS payments");
  sqlite.exec("DROP TABLE IF EXISTS shipments");
  sqlite.exec("DROP TABLE IF EXISTS contracts");
  sqlite.exec("DROP TABLE IF EXISTS users");
}

// Create test tables - this is the key function that was missing implementation
function createTestTables() {
  try {
    // Create tables based on the schema
    sqlite.exec(`
      -- Contracts table
      CREATE TABLE contracts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        contract_number TEXT,
        contract_date TEXT,
        contract_party TEXT,
        importer TEXT,
        incoterms TEXT
      );

      -- Payments table
      CREATE TABLE payments (
        id TEXT PRIMARY KEY,
        payment_due_date TEXT,
        payment_method TEXT NOT NULL CHECK (payment_method IN ('T/T', 'CAD', 'L/C', 'Usance')),
        contract_id INTEGER NOT NULL
      );

      -- Payments TT table
      CREATE TABLE payments_tt (
        payment_id TEXT PRIMARY KEY,
        advance_payment_date TEXT,
        advance_payment_ratio REAL,
        advance_payment_amount REAL,
        remaining_payment_date TEXT,
        remaining_payment_ratio REAL,
        remaining_payment_amount REAL,
        counterpart_bank TEXT,
        FOREIGN KEY (payment_id) REFERENCES payments(id) ON DELETE CASCADE
      );

      -- Payments Usance table
      CREATE TABLE payments_usance (
        payment_id TEXT PRIMARY KEY,
        payment_term TEXT,
        contact_exchange_rate TEXT,
        FOREIGN KEY (payment_id) REFERENCES payments(id) ON DELETE CASCADE
      );

      -- Items table
      CREATE TABLE items (
        id TEXT PRIMARY KEY,
        item_name TEXT,
        item_variety TEXT,
        origin_country TEXT,
        hs_code TEXT,
        packing_unit TEXT
      );

      -- Shipments table
      CREATE TABLE shipments (
        id TEXT PRIMARY KEY,
        contract_id INTEGER NOT NULL,
        estimated_time_arrival TEXT,
        estimated_time_departure TEXT,
        arrival_port TEXT,
        shipping_company TEXT,
        departure_port TEXT,
        bl_number TEXT,
        pallet_order_date TEXT,
        pallet_type TEXT
      );

      -- Cargos table
      CREATE TABLE cargos (
        id TEXT PRIMARY KEY,
        items_id TEXT NOT NULL,
        shipment_id TEXT NOT NULL,
        container_count INTEGER,
        contract_ton INTEGER,
        customs_clearance_date TEXT,
        quarantine_date TEXT,
        warehouse_entry_date TEXT,
        progress_status TEXT CHECK (progress_status IN ('예정', '입고', '출고', '판매')),
        selling_price REAL,
        margin REAL,
        total_profit REAL
      );

      -- Costs table
      CREATE TABLE costs (
        id TEXT PRIMARY KEY,
        supply_price REAL,
        shipping_cost REAL,
        labor_cost REAL,
        transport_storage_fee REAL,
        loading_unloading_fee REAL,
        cargo_id TEXT NOT NULL
      );

      -- Cost Details table
      CREATE TABLE cost_details (
        id TEXT PRIMARY KEY,
        unit_price REAL,
        exchange_rate REAL,
        customs_tax_rate REAL,
        custom_tax_amount REAL,
        customs_fee REAL,
        inspection_fee REAL,
        do_charge REAL,
        other_costs REAL,
        cost_id TEXT NOT NULL
      );

      -- Users table
      CREATE TABLE users (
        id TEXT PRIMARY KEY,
        email TEXT,
        password TEXT
      );
    `);
    console.log("✅ Tables created successfully");
  } catch (error) {
    console.error("❌ Error creating tables:", error);
    throw new Error(`Failed to create tables: ${error.message}`);
  }
}

async function testCreateContract() {
  const contractId = 1; // Auto-increment will handle this

  db.insert(contracts)
    .values({
      contractNumber: "C-2025-001",
      contractDate: new Date().toISOString().split("T")[0],
      contractParty: "Test Supplier Co.",
      importer: "Gompyo Imports",
      incoterms: "FOB",
    })
    .run();

  const result = db.select().from(contracts).all();
  console.log(`Created contract: ${JSON.stringify(result[0])}`);

  return contractId;
}

async function testCreateTTPayment(contractId) {
  const paymentId = nanoid();

  // Insert into the payments table first
  db.insert(payments)
    .values({
      id: paymentId,
      paymentDueDate: new Date().toISOString().split("T")[0],
      paymentMethod: "T/T",
      contractId: contractId,
    })
    .run();

  // Then insert into the payments_tt table
  db.insert(paymentsTt)
    .values({
      paymentId: paymentId,
      advancePaymentDate: new Date().toISOString().split("T")[0],
      advancePaymentRatio: 0.3,
      advancePaymentAmount: 30000,
      remainingPaymentDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      remainingPaymentRatio: 0.7,
      remainingPaymentAmount: 70000,
      counterpartBank: "Test Bank Co.",
    })
    .run();

  const result = db
    .select()
    .from(payments)
    .where(sql`${payments.id} = ${paymentId}`)
    .all();

  console.log(`Created T/T payment: ${JSON.stringify(result[0])}`);

  return paymentId;
}

async function testCreateUsancePayment(contractId) {
  const paymentId = nanoid();

  // Insert into the payments table first
  db.insert(payments)
    .values({
      id: paymentId,
      paymentDueDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      paymentMethod: "Usance",
      contractId: contractId,
    })
    .run();

  // Then insert into the payments_usance table
  db.insert(paymentsUsance)
    .values({
      paymentId: paymentId,
      paymentTerm: "60 days",
      contractExchangeRate: "1350 KRW/USD",
    })
    .run();

  const result = db
    .select()
    .from(payments)
    .where(sql`${payments.id} = ${paymentId}`)
    .all();

  console.log(`Created Usance payment: ${JSON.stringify(result[0])}`);

  return paymentId;
}

async function testCreateShipment(contractId) {
  const shipmentId = nanoid();

  db.insert(shipments)
    .values({
      id: shipmentId,
      contractId: contractId,
      estimatedTimeArrival: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      estimatedTimeDeparture: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      arrivalPort: "Busan",
      shippingCompany: "Ocean Shipping Co.",
      departurePort: "Shanghai",
      blNumber: "BL-2025-001",
      palletOrderDate: new Date().toISOString().split("T")[0],
      palletType: "Wood",
    })
    .run();

  const result = db
    .select()
    .from(shipments)
    .where(sql`${shipments.id} = ${shipmentId}`)
    .all();

  console.log(`Created shipment: ${JSON.stringify(result[0])}`);

  return shipmentId;
}

async function testCreateItem() {
  const itemId = nanoid();

  db.insert(items)
    .values({
      id: itemId,
      itemName: "Rice",
      itemVariety: "Jasmine",
      originCountry: "Thailand",
      hsCode: "1006.30",
      packingUnit: "25kg bag",
    })
    .run();

  const result = db
    .select()
    .from(items)
    .where(sql`${items.id} = ${itemId}`)
    .all();

  console.log(`Created item: ${JSON.stringify(result[0])}`);

  return itemId;
}

async function testCreateCargo(shipmentId, itemId) {
  const cargoId = nanoid();

  db.insert(cargos)
    .values({
      id: cargoId,
      itemsId: itemId,
      shipmentId: shipmentId,
      containerCount: 2,
      contractTon: 50,
      customsClearanceDate: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      quarantineDate: new Date(Date.now() + 36 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      warehouseEntryDate: new Date(Date.now() + 40 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      progressStatus: "예정",
      sellingPrice: 120000,
      margin: 0.15,
      totalProfit: 18000,
    })
    .run();

  const result = db
    .select()
    .from(cargos)
    .where(sql`${cargos.id} = ${cargoId}`)
    .all();

  console.log(`Created cargo: ${JSON.stringify(result[0])}`);

  return cargoId;
}

async function testCreateCost(cargoId) {
  const costId = nanoid();

  db.insert(costs)
    .values({
      id: costId,
      supplyPrice: 85000,
      shippingCost: 10000,
      laborCost: 5000,
      transportStorageFee: 2000,
      loadingUnloadingFee: 3000,
      cargoId: cargoId,
    })
    .run();

  // Create cost details
  const costDetailId = nanoid();
  db.insert(costDetails)
    .values({
      id: costDetailId,
      unitPrice: 1700,
      exchangeRate: 1350.5,
      customsTaxRate: 0.08,
      customTaxAmount: 6800,
      customsFee: 500,
      inspectionFee: 300,
      doCharge: 200,
      otherCosts: 1000,
      costId: costId,
    })
    .run();

  const costResult = db
    .select()
    .from(costs)
    .where(sql`${costs.id} = ${costId}`)
    .all();

  console.log(`Created cost: ${JSON.stringify(costResult[0])}`);

  return costId;
}

async function testRelationships(contractId, ttPaymentId, usancePaymentId) {
  // Test contract -> payments relationship
  const contractPayments = db
    .select()
    .from(contracts)
    .innerJoin(payments, sql`${contracts.id} = ${payments.contractId}`)
    .where(sql`${contracts.id} = ${contractId}`)
    .all();

  console.log(
    `Contract payments: Found ${contractPayments.length} payments for contract ${contractId}`,
  );

  // Test TT payment relationship
  const ttPaymentDetails = db
    .select()
    .from(payments)
    .innerJoin(paymentsTt, sql`${payments.id} = ${paymentsTt.paymentId}`)
    .where(sql`${payments.id} = ${ttPaymentId}`)
    .all();

  console.log(
    `T/T payment details: ${ttPaymentDetails.length > 0 ? "✅ Found" : "❌ Not found"}`,
  );

  // Test Usance payment relationship
  const usancePaymentDetails = db
    .select()
    .from(payments)
    .innerJoin(
      paymentsUsance,
      sql`${payments.id} = ${paymentsUsance.paymentId}`,
    )
    .where(sql`${payments.id} = ${usancePaymentId}`)
    .all();

  console.log(
    `Usance payment details: ${usancePaymentDetails.length > 0 ? "✅ Found" : "❌ Not found"}`,
  );
}

// Run tests
runTests();
