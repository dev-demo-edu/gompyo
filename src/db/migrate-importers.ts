import Database from "better-sqlite3";
import { nanoid } from "nanoid";
import { CalculationType } from "@/types/importer";
import path from "path";

// SQLite 데이터베이스 파일 경로
const dbPath = path.join(process.cwd(), "drizzle", "database.sqlite");
const db = new Database(dbPath);

interface Contract {
  id: string;
  importer: string | null;
}

/**
 * 수동 마이그레이션 실행
 */
async function migrateImporters() {
  console.log("수입업체 마이그레이션 시작...");

  try {
    // 1. 기존 contracts 테이블에서 importer 데이터 가져오기
    const contracts = db
      .prepare("SELECT id, importer FROM contracts")
      .all() as Contract[];
    console.log(`${contracts.length}개의 계약 데이터를 찾았습니다.`);

    // 2. importers 테이블 생성
    db.exec(`
      CREATE TABLE IF NOT EXISTS "importers" (
        "id" text PRIMARY KEY NOT NULL,
        "name" text NOT NULL,
        "calculation_type" text NOT NULL
      )
    `);
    console.log("importers 테이블 생성 완료");

    // 3. 고유한 importer 값 추출 및 importers 테이블에 데이터 삽입
    const uniqueImporters = new Set<string>();
    contracts.forEach((contract) => {
      if (contract.importer) {
        uniqueImporters.add(contract.importer);
      }
    });

    const importerMap = new Map<string, string>(); // importer 이름 -> ID 매핑
    console.log(`${uniqueImporters.size}개의 고유한 수입업체를 찾았습니다.`);

    // 4. 각 고유한 importer에 대해 importers 테이블에 레코드 추가
    const insertImporter = db.prepare(
      "INSERT INTO importers (id, name, calculation_type) VALUES (?, ?, ?)",
    );

    uniqueImporters.forEach((importerName) => {
      const importerId = nanoid();
      insertImporter.run(importerId, importerName, CalculationType.STANDARD);
      importerMap.set(importerName, importerId);
    });
    console.log("importers 테이블에 데이터 삽입 완료");

    // 5. contracts 테이블에 importer_id 필드 추가
    db.exec(`
      ALTER TABLE contracts ADD COLUMN importer_id text
    `);
    console.log("contracts 테이블에 importer_id 컬럼 추가 완료");

    // 6. contracts 테이블의 importer_id 필드 업데이트
    const updateContract = db.prepare(
      "UPDATE contracts SET importer_id = ? WHERE id = ?",
    );

    contracts.forEach((contract) => {
      if (contract.importer && importerMap.has(contract.importer)) {
        updateContract.run(importerMap.get(contract.importer), contract.id);
      }
    });
    console.log("contracts 테이블의 importer_id 필드 업데이트 완료");

    // 7. 불필요한 importer 필드는 나중에 제거하거나 놔둘 수 있음
    // db.exec("ALTER TABLE contracts DROP COLUMN importer");

    console.log("수입업체 마이그레이션 완료!");
  } catch (error) {
    console.error("마이그레이션 에러:", error);
  } finally {
    db.close();
  }
}

migrateImporters();
