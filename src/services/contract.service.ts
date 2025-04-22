import { db } from "@/db";
import { contracts } from "@/db/schema";
import { eq } from "drizzle-orm";

export type Contract = typeof contracts.$inferSelect;
export type NewContract = typeof contracts.$inferInsert;

export class ContractService {
  // Create
  async create(data: NewContract) {
    const [contract] = await db.insert(contracts).values(data).returning();
    return contract;
  }

  // Read
  async findById(id: string) {
    const [contract] = await db
      .select()
      .from(contracts)
      .where(eq(contracts.id, id));
    return contract;
  }

  async findAll() {
    return await db.select().from(contracts);
  }

  async findByImporterId(importerId: string) {
    return await db
      .select()
      .from(contracts)
      .where(eq(contracts.importerId, importerId));
  }

  // Update
  async update(id: string, data: Partial<NewContract>) {
    const [contract] = await db
      .update(contracts)
      .set(data)
      .where(eq(contracts.id, id))
      .returning();
    return contract;
  }

  // Delete
  async delete(id: string) {
    const [contract] = await db
      .delete(contracts)
      .where(eq(contracts.id, id))
      .returning();
    return contract;
  }
}
