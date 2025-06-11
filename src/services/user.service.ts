import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export class UserService {
  // 사용자 찾기
  async findByEmail(id: string) {
    const [user] = await db.select().from(users).where(eq(users.email, id));
    return user;
  }

  async findById(id: string) {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  // 사용자 칼럼순서 가져오기
  async getPlanColumnOrder(id: string) {
    const user = await this.findById(id);
    return user.planColumnOrder ? JSON.parse(user.planColumnOrder) : null;
  }

  async getShipmentColumnOrder(id: string) {
    const user = await this.findById(id);
    return user.shipmentColumnOrder
      ? JSON.parse(user.shipmentColumnOrder)
      : null;
  }

  async getQuotationColumnOrder(id: string) {
    const user = await this.findById(id);
    return user.quotationColumnOrder
      ? JSON.parse(user.quotationColumnOrder)
      : null;
  }

  // 사용자의 컬럼 순서 업데이트
  async updatePlanColumnOrder(id: string, columnOrder: string) {
    const [user] = await db
      .update(users)
      .set({ planColumnOrder: columnOrder })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  async updateShipmentColumnOrder(id: string, columnOrder: string) {
    const [user] = await db
      .update(users)
      .set({ shipmentColumnOrder: columnOrder })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  async updateQuotationColumnOrder(id: string, columnOrder: string) {
    const [user] = await db
      .update(users)
      .set({ quotationColumnOrder: columnOrder })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  // 새 사용자 생성 (후에 필요하시면 업데이트하세여)
  async create(data: NewUser) {
    const [user] = await db.insert(users).values(data).returning();
    return user;
  }

  // 사용자 삭제
  async delete(id: string) {
    await db.delete(users).where(eq(users.id, id));
    return true;
  }
}
