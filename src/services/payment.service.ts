import { db } from "@/db";
import { payments, paymentsTt, paymentsUsance } from "@/db/schema";
import { eq } from "drizzle-orm";

export type Payment = typeof payments.$inferSelect;
export type NewPayment = typeof payments.$inferInsert;
export type PaymentTt = typeof paymentsTt.$inferSelect;
export type NewPaymentTt = typeof paymentsTt.$inferInsert;
export type PaymentUsance = typeof paymentsUsance.$inferSelect;
export type NewPaymentUsance = typeof paymentsUsance.$inferInsert;

export class PaymentService {
  // Create
  async create(data: NewPayment) {
    const [payment] = await db.insert(payments).values(data).returning();
    return payment;
  }

  async createTt(data: NewPaymentTt) {
    const [paymentTt] = await db.insert(paymentsTt).values(data).returning();
    return paymentTt;
  }

  async createUsance(data: NewPaymentUsance) {
    const [paymentUsance] = await db
      .insert(paymentsUsance)
      .values(data)
      .returning();
    return paymentUsance;
  }

  // Read
  async findById(id: string) {
    const [payment] = await db
      .select()
      .from(payments)
      .where(eq(payments.id, id));
    return payment;
  }

  async findTtByPaymentId(paymentId: string) {
    const [paymentTt] = await db
      .select()
      .from(paymentsTt)
      .where(eq(paymentsTt.paymentId, paymentId));
    return paymentTt;
  }

  async findUsanceByPaymentId(paymentId: string) {
    const [paymentUsance] = await db
      .select()
      .from(paymentsUsance)
      .where(eq(paymentsUsance.paymentId, paymentId));
    return paymentUsance;
  }

  async findAll() {
    return await db.select().from(payments);
  }

  async findByContractId(contractId: number) {
    const [payment] = await db
      .select()
      .from(payments)
      .where(eq(payments.contractId, contractId));
    return payment;
  }

  // Update
  async update(id: string, data: Partial<NewPayment>) {
    const [payment] = await db
      .update(payments)
      .set(data)
      .where(eq(payments.id, id))
      .returning();
    return payment;
  }

  async updateTt(paymentId: string, data: Partial<NewPaymentTt>) {
    const [paymentTt] = await db
      .update(paymentsTt)
      .set(data)
      .where(eq(paymentsTt.paymentId, paymentId))
      .returning();
    return paymentTt;
  }

  async updateUsance(paymentId: string, data: Partial<NewPaymentUsance>) {
    const [paymentUsance] = await db
      .update(paymentsUsance)
      .set(data)
      .where(eq(paymentsUsance.paymentId, paymentId))
      .returning();
    return paymentUsance;
  }

  // Delete
  async delete(id: string) {
    const [payment] = await db
      .delete(payments)
      .where(eq(payments.id, id))
      .returning();
    return payment;
  }

  async deleteTt(paymentId: string) {
    const [paymentTt] = await db
      .delete(paymentsTt)
      .where(eq(paymentsTt.paymentId, paymentId))
      .returning();
    return paymentTt;
  }

  async deleteUsance(paymentId: string) {
    const [paymentUsance] = await db
      .delete(paymentsUsance)
      .where(eq(paymentsUsance.paymentId, paymentId))
      .returning();
    return paymentUsance;
  }
}
