import { db } from "@/db";
import { costDetails } from "@/db/schema";
import { eq } from "drizzle-orm";

export type CostDetail = typeof costDetails.$inferSelect;
export type NewCostDetail = typeof costDetails.$inferInsert;

export class CostDetailService {
  // Create
  async create(data: NewCostDetail) {
    const [costDetail] = await db.insert(costDetails).values(data).returning();
    return costDetail;
  }

  // Read
  async findById(id: string) {
    const [costDetail] = await db
      .select()
      .from(costDetails)
      .where(eq(costDetails.id, id));
    return costDetail;
  }

  async findAll() {
    return await db.select().from(costDetails);
  }

  async findByCostId(costId: string) {
    return await db
      .select()
      .from(costDetails)
      .where(eq(costDetails.costId, costId));
  }

  // Update
  async update(id: string, data: Partial<NewCostDetail>) {
    const [costDetail] = await db
      .update(costDetails)
      .set(data)
      .where(eq(costDetails.id, id))
      .returning();
    return costDetail;
  }

  // Delete
  async delete(id: string) {
    const [costDetail] = await db
      .delete(costDetails)
      .where(eq(costDetails.id, id))
      .returning();
    return costDetail;
  }

  async deleteByCostId(costId: string) {
    const costDetails = await this.findByCostId(costId);
    await Promise.all(costDetails.map((detail) => this.delete(detail.id)));
  }
}
