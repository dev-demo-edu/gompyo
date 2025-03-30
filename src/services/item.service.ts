import { db } from "@/db";
import { items } from "@/db/schema";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";

export type Item = typeof items.$inferSelect;
export type NewItem = typeof items.$inferInsert;

export class ItemService {
  // Create
  async create(data: Omit<NewItem, "id">) {
    const id = nanoid();
    const [item] = await db
      .insert(items)
      .values({ ...data, id })
      .returning();
    return item;
  }

  // Read
  async findById(id: string) {
    const [item] = await db.select().from(items).where(eq(items.id, id));
    return item;
  }
	
	async searchItems(itemName: string) {
		const itemsList = await db
			.select()
			.from(items)
			.where(eq(items.itemName, itemName));
		return itemsList;
	}

  async findAll() {
    return await db.select().from(items);
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
}
