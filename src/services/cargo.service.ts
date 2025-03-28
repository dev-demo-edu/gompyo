import { db } from "@/db";
import { cargos } from "@/db/schema";
import { eq } from "drizzle-orm";

export type Cargo = typeof cargos.$inferSelect;
export type NewCargo = typeof cargos.$inferInsert;

export class CargoService {
  // Create
  async create(data: NewCargo) {
    const [cargo] = await db.insert(cargos).values(data).returning();
    return cargo;
  }

  // Read
  async findById(id: string) {
    const [cargo] = await db.select().from(cargos).where(eq(cargos.id, id));
    return cargo;
  }

  async findAll() {
    return await db.select().from(cargos);
  }

  async findByShipmentId(shipmentId: string) {
    return await db
      .select()
      .from(cargos)
      .where(eq(cargos.shipmentId, shipmentId));
  }

  // Update
  async update(id: string, data: Partial<NewCargo>) {
    const [cargo] = await db
      .update(cargos)
      .set(data)
      .where(eq(cargos.id, id))
      .returning();
    return cargo;
  }

  // Delete
  async delete(id: string) {
    const [cargo] = await db
      .delete(cargos)
      .where(eq(cargos.id, id))
      .returning();
    return cargo;
  }
}
