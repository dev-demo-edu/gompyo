import { db } from "@/db";
import { accountNumber } from "@/db/schema";
import { eq, inArray } from "drizzle-orm";

export type AccountNumberInput = typeof accountNumber.$inferInsert;

export class AccountNumberService {
  // 계좌 추가
  static async create(input: AccountNumberInput) {
    await db.insert(accountNumber).values(input);
  }

  // 전체 계좌 조회
  static async getAll() {
    return db.select().from(accountNumber);
  }

  // 단일 계좌 조회
  static async getById(id: string) {
    return db
      .select()
      .from(accountNumber)
      .where(eq(accountNumber.id, id))
      .get();
  }

  // 계좌 수정
  static async update(id: string, input: Partial<AccountNumberInput>) {
    await db.update(accountNumber).set(input).where(eq(accountNumber.id, id));
  }

  // 계좌 삭제 (단일)
  static async delete(id: string) {
    await db.delete(accountNumber).where(eq(accountNumber.id, id));
  }

  // 계좌 삭제 (여러 개)
  static async deleteMany(ids: string[]) {
    if (ids.length === 0) return;
    await db.delete(accountNumber).where(inArray(accountNumber.id, ids));
  }
}
