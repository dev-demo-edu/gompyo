import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import * as schema from "./schema";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";

const sqlite = new Database(process.cwd() + "/sqlite.db");
const db = drizzle(sqlite, { schema });

async function main() {
  try {
    await migrate(db, { migrationsFolder: "./drizzle" });
    console.log("Migration completed successfully");
  } catch (error) {
    console.error("Migration failed:", error);
  } finally {
    sqlite.close();
  }
}

main();
