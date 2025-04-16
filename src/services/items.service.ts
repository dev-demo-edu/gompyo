import { db } from "@/db";
import { items, cargos } from "@/db/schema";
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
  private async isItemReferencedInCargo(itemId: string): Promise<boolean> {
    const cargoList = await db
      .select()
      .from(cargos)
      .where(eq(cargos.itemsId, itemId));
    return cargoList.length >= 2;
  }

  async update(itemId: string, data: Partial<NewItem>) {
    // 새로운 상품 생성
    const newItem = await this.create({
      ...data,
      id: nanoid(),
    });

    // 기존 상품이 cargo에서 참조되지 않는 경우에만 삭제
    const isReferenced = await this.isItemReferencedInCargo(itemId);
    if (!isReferenced) {
      await this.delete(itemId);
    }

    return newItem;
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
