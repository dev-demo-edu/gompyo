import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import * as schema from "./schema";
import path from "path";

// SQLite 데이터베이스 파일 경로를 drizzle.config.ts와 일치시킴
const dbPath = path.join(process.cwd(), "drizzle", "database.sqlite");
const sqlite = new Database(dbPath);
export const db = drizzle(sqlite, { schema });
