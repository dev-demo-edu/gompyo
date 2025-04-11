import { db } from "@/db";
import { items } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { nanoid } from "nanoid";

export type Item = typeof items.$inferSelect;
export type NewItem = typeof items.$inferInsert;

export class ItemsService {
  // Create
  async create(data: NewItem) {
    const [item] = await db.insert(items).values(data).returning();
    return item;
  }

  // Read
  async findById(id: string) {
    const [item] = await db.select().from(items).where(eq(items.id, id));
    return item;
  }

  async findAll() {
    return await db.select().from(items);
  }

  async findByItemInfo(data: {
    itemName: string;
    itemVariety: string;
    originCountry: string;
    hsCode: string;
    packingUnit: string;
  }) {
    const [item] = await db
      .select()
      .from(items)
      .where(
        and(
          eq(items.itemName, data.itemName),
          eq(items.itemVariety, data.itemVariety),
          eq(items.originCountry, data.originCountry),
          eq(items.hsCode, data.hsCode),
          eq(items.packingUnit, data.packingUnit),
        ),
      );
    return item;
  }

  // Update
  async update(id: string, data: Partial<NewItem>) {
    const [item] = await db
      .update(items)
      .set(data)
      .where(eq(items.id, id))
      .returning();
    return item;
  }

  // Delete
  async delete(id: string) {
    const [item] = await db.delete(items).where(eq(items.id, id)).returning();
    return item;
  }

  // Find or Create
  async findOrCreate(data: {
    itemName: string;
    itemVariety: string;
    originCountry: string;
    hsCode: string;
    packingUnit: string;
  }): Promise<Item> {
    const existingItem = await this.findByItemInfo(data);
    if (existingItem) {
      return existingItem;
    }

    return await this.create({
      ...data,
      id: nanoid(),
    });
  }
}
