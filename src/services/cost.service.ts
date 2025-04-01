import { db } from "@/db";
import { costs } from "@/db/schema";
import { eq } from "drizzle-orm";
import { CostDetailService } from "./cost-detail.service";

export type Cost = typeof costs.$inferSelect;
export type NewCost = typeof costs.$inferInsert;

export class CostService {
  private costDetailService: CostDetailService;

  constructor() {
    this.costDetailService = new CostDetailService();
  }

  // Create
  async create(data: NewCost) {
    const [cost] = await db.insert(costs).values(data).returning();
    return cost;
  }

  // Read
  async findById(id: string) {
    const [cost] = await db.select().from(costs).where(eq(costs.id, id));
    return cost;
  }

  async findAll() {
    return await db.select().from(costs);
  }

  async findByCargoId(cargoId: string) {
    const [cost] = await db
      .select()
      .from(costs)
      .where(eq(costs.cargoId, cargoId));
    return cost;
  }

  // Update
  async update(id: string, data: Partial<NewCost>) {
    const [cost] = await db
      .update(costs)
      .set(data)
      .where(eq(costs.id, id))
      .returning();
    return cost;
  }

  // Delete
  async delete(id: string) {
    // 비용 상세 정보도 함께 삭제
    await this.costDetailService.deleteByCostId(id);

    const [cost] = await db.delete(costs).where(eq(costs.id, id)).returning();
    return cost;
  }
}
