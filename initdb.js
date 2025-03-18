import Database from 'better-sqlite3';
const db = new Database('gompyo.db');

// 테이블 생성 함수
const initDB = () => {
    try {
        // 트랜잭션 시작
        db.exec('BEGIN TRANSACTION');

        // payments 테이블 생성
        db.exec(`CREATE TABLE IF NOT EXISTS payments (
            id TEXT PRIMARY KEY,
            payment_due_date DATE,
            payment_method TEXT NOT NULL CHECK (payment_method IN ('T/T', 'CAD', 'L/C', 'Usance')),
            contract_id INTEGER NOT NULL
        )`);

        // payments_tt 테이블 생성
        db.exec(`CREATE TABLE payments_tt (
            payment_id TEXT PRIMARY KEY,
            advance_payment_date DATE,
            advance_payment_ratio REAL,
            advance_payment_amount REAL,
            remaining_payment_date DATE,
            remaining_payment_ratio REAL,
            remaining_payment_amount REAL,
            counterpart_bank TEXT,
            FOREIGN KEY (payment_id) REFERENCES payments(id) ON DELETE CASCADE
        );`);

        // cost_details 테이블 생성
        db.exec(`CREATE TABLE IF NOT EXISTS cost_details (
            id TEXT PRIMARY KEY,
            unit_price DECIMAL(15,2),
            exchange_rate DECIMAL(15,2),
            customs_tax_rate DECIMAL(15,2),
            custom_tax_amount DECIMAL(15,2),
            customs_fee DECIMAL(15,2),
            inspection_fee DECIMAL(15,2),
            do_charge DECIMAL(15,2),
            other_costs DECIMAL(15,2),
            cost_id TEXT NOT NULL
        )`);

        // contracts 테이블 생성
        db.exec(`CREATE TABLE IF NOT EXISTS contracts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            contract_number TEXT,
            contract_date DATE,
            contract_party TEXT,
            importer TEXT,
            incoterms TEXT
        )`);

        // items 테이블 생성
        db.exec(`CREATE TABLE IF NOT EXISTS items (
            id TEXT PRIMARY KEY,
            item_name TEXT,
            item_variety TEXT,
            origin_country TEXT,
            hs_code TEXT,
            packing_unit TEXT
        )`);

        // costs 테이블 생성
        db.exec(`CREATE TABLE IF NOT EXISTS costs (
            id TEXT PRIMARY KEY,
            supply_price DECIMAL(15,2),
            shipping_cost DECIMAL(15,2),
            labor_cost DECIMAL(15,2),
            transport_storage_fee DECIMAL(15,2),
            loading_unloading_fee DECIMAL(15,2),
            cargo_id TEXT NOT NULL
        )`);

        // payments_usance 테이블 생성
        db.exec(`CREATE TABLE payments_usance (
            payment_id TEXT PRIMARY KEY,
            payment_term TEXT,
            contact_exchange_rate TEXT,
            FOREIGN KEY (payment_id) REFERENCES payments(id) ON DELETE CASCADE
        );`);

        // users 테이블 생성
        db.exec(`CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY,
            email TEXT,
            password TEXT
        )`);

        // shipments 테이블 생성
        db.exec(`CREATE TABLE IF NOT EXISTS shipments (
            id TEXT PRIMARY KEY,
            contract_id INTEGER NOT NULL,
            estimated_time_arrival DATE,
            estimated_time_departure DATE,
            arrival_port TEXT,
            shipping_company TEXT,
            departure_port TEXT,
            bl_number TEXT,
            pallet_order_date DATE,
            pallet_type TEXT
        )`);

        // cargos 테이블 생성
        db.exec(`CREATE TABLE IF NOT EXISTS cargos (
            id TEXT PRIMARY KEY,
            items_id INTEGER NOT NULL,
            shipment_id INTEGER NOT NULL,
            container_count INTEGER,
            contract_ton INTEGER,
            customs_clearance_date DATE,
            quarantine_date DATE,
            warehouse_entry_date DATE,
            progress_status TEXT CHECK (progress_status IN ('예정')),
            selling_price DECIMAL(15,2),
            margin DECIMAL(15,2),
            total_profit DECIMAL(15,2)
        )`);

        // 트랜잭션 커밋
        db.exec('COMMIT');
        console.log("✅ All tables have been created successfully.");
    } catch (error) {
        // 에러 발생 시 롤백
        db.exec('ROLLBACK');
        console.error("❌ Error creating tables:", error);
    } finally {
        db.close();
        console.log("🔌 SQLite database connection closed.");
    }
};

// 초기화 실행
initDB();
