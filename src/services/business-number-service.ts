import { db } from "@/db";
import { businessNumbers } from "@/db/schema";
import { eq, inArray } from "drizzle-orm";

export type BusinessNumberInput = typeof businessNumbers.$inferInsert;

export class BusinessNumberService {
  // 사업자 추가
  static async create(input: BusinessNumberInput) {
    await db.insert(businessNumbers).values(input);
  }

  // 전체 계좌 조회
  static async getAll() {
    return db.select().from(businessNumbers);
  }

  // 단일 계좌 조회
  static async getById(id: string) {
    return db
      .select()
      .from(businessNumbers)
      .where(eq(businessNumbers.id, id))
      .get();
  }

  // 계좌 번호 조회
  static async getByBusinessNumber(businessNumber: string) {
    return db
      .select()
      .from(businessNumbers)
      .where(eq(businessNumbers.businessNumber, businessNumber))
      .get();
  }

  // 사업자 수정
  static async update(id: string, input: Partial<BusinessNumberInput>) {
    await db
      .update(businessNumbers)
      .set(input)
      .where(eq(businessNumbers.id, id));
  }

  // 계좌 삭제 (단일)
  static async delete(id: string) {
    await db.delete(businessNumbers).where(eq(businessNumbers.id, id));
  }

  // 계좌 삭제 (여러 개)
  static async deleteMany(ids: string[]) {
    if (ids.length === 0) return;
    await db.delete(businessNumbers).where(inArray(businessNumbers.id, ids));
  }
}
