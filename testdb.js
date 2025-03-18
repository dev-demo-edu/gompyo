import Database from 'better-sqlite3';

const db = new Database('gompyo.db');

// 📌 모든 테이블의 데이터를 조회하는 함수
const fetchAllData = () => {
    try {
        console.log("\n🔍 Fetching data from all tables...\n");

        const tables = ["payments", "payments_tt", "payments_usance", "contracts", "items", "costs", "users", "shipments", "cargos"];

        tables.forEach(table => {
            const stmt = db.prepare(`SELECT * FROM ${table}`);
            const rows = stmt.all();
            console.log(`📌 ${table} Table Data:`);
            console.table(rows);
        });

    } catch (error) {
        console.error("❌ Error fetching data:", error);
    }
};

// 📌 테스트 데이터 삽입 함수
const insertTestData = () => {
    try {
        db.exec('BEGIN TRANSACTION');

        console.log("\n🚀 Inserting test data...\n");

        // ✅ `payments` 테이블 데이터 삽입
        const insertPayment = db.prepare(`
            INSERT INTO payments (id, payment_due_date, payment_method, contract_id)
            VALUES (?, ?, ?, ?)
        `);
        insertPayment.run("pay_001", "2024-04-01", "T/T", 123);
        insertPayment.run("pay_002", "2024-05-10", "Usance", 124);

        // ✅ `payments_tt` 테이블 데이터 삽입 (T/T 방식)
        const insertPaymentTT = db.prepare(`
            INSERT INTO payments_tt (payment_id, advance_payment_date, advance_payment_ratio, advance_payment_amount, remaining_payment_date, remaining_payment_ratio, remaining_payment_amount, counterpart_bank)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `);
        insertPaymentTT.run("pay_001", "2024-03-01", 30.00, 5000.00, "2024-06-01", 70.00, 12000.00, "Bank of America");

        // ✅ `payments_usance` 테이블 데이터 삽입 (Usance 방식)
        const insertPaymentUsance = db.prepare(`
            INSERT INTO payments_usance (payment_id, payment_term, contact_exchange_rate)
            VALUES (?, ?, ?)
        `);
        insertPaymentUsance.run("pay_002", "90 Days", 1350.25);

        db.exec('COMMIT');
        console.log("✅ Test data inserted successfully!");

    } catch (error) {
        db.exec('ROLLBACK');
        console.error("❌ Error inserting test data:", error);
    }
};

// 📌 실행 흐름
insertTestData();  // 테스트 데이터 삽입
fetchAllData();  // 데이터 조회

db.close();
console.log("🔌 SQLite database connection closed.");
