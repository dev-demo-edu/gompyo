import { db } from "@/db";
import { accountNumbers } from "@/db/schema";
import { eq, inArray } from "drizzle-orm";

export type AccountNumberInput = typeof accountNumbers.$inferInsert;

export class AccountNumberService {
  // 계좌 추가
  static async create(input: AccountNumberInput) {
    await db.insert(accountNumbers).values(input);
  }

  // 전체 계좌 조회
  static async getAll() {
    return db.select().from(accountNumbers);
  }

  // 단일 계좌 조회
  static async getById(id: string) {
    return db
      .select()
      .from(accountNumbers)
      .where(eq(accountNumbers.id, id))
      .get();
  }

  // 계좌 번호 조회
  static async getByAccountNumber(accountNumber: string) {
    return db
      .select()
      .from(accountNumbers)
      .where(eq(accountNumbers.accountNumber, accountNumber))
      .get();
  }

  // 계좌 수정
  static async update(id: string, input: Partial<AccountNumberInput>) {
    await db.update(accountNumbers).set(input).where(eq(accountNumbers.id, id));
  }

  // 계좌 삭제 (단일)
  static async delete(id: string) {
    await db.delete(accountNumbers).where(eq(accountNumbers.id, id));
  }

  // 계좌 삭제 (여러 개)
  static async deleteMany(ids: string[]) {
    if (ids.length === 0) return;
    await db.delete(accountNumbers).where(inArray(accountNumbers.id, ids));
  }
}
