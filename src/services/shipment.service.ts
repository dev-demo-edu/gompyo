import { db } from "@/db";
import { shipments } from "@/db/schema";
import { eq } from "drizzle-orm";
import { CargoService } from "./cargo.service";

export type Shipment = typeof shipments.$inferSelect;
export type NewShipment = typeof shipments.$inferInsert;

export class ShipmentService {
  private cargoService: CargoService;

  constructor() {
    this.cargoService = new CargoService();
  }

  // Create
  async create(data: NewShipment) {
    const [shipment] = await db.insert(shipments).values(data).returning();
    return shipment;
  }

  // Read
  async findById(id: string) {
    const [shipment] = await db
      .select()
      .from(shipments)
      .where(eq(shipments.id, id));
    return shipment;
  }

  async findAll() {
    return await db.select().from(shipments);
  }

  async findByContractId(contractId: string) {
    return await db
      .select()
      .from(shipments)
      .where(eq(shipments.contractId, contractId));
  }

  // Update
  async update(id: string, data: Partial<NewShipment>) {
    const [shipment] = await db
      .update(shipments)
      .set(data)
      .where(eq(shipments.id, id))
      .returning();
    return shipment;
  }

  // Delete
  async delete(id: string) {
    // 선적 삭제 시 관련된 화물들도 함께 삭제
    const cargos = await this.cargoService.findByShipmentId(id);
    await Promise.all(
      cargos.map((cargo) => this.cargoService.delete(cargo.id)),
    );

    const [shipment] = await db
      .delete(shipments)
      .where(eq(shipments.id, id))
      .returning();
    return shipment;
  }
}
