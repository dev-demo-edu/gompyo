import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import * as schema from "./schema";
import path from "path";

// SQLite 데이터베이스 파일 경로를 drizzle.config.ts와 일치시킴
const dbPath = path.join(process.cwd(), "drizzle", "database.sqlite");
const sqlite = new Database(dbPath);

// WAL 모드 비활성화 - .db-wal, .db-shm 파일 생성 방지
sqlite.pragma("journal_mode = DELETE");

export const db = drizzle(sqlite, { schema });
