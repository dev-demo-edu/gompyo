import { db } from "@/db";
import { documents } from "@/db/schema";
import { eq } from "drizzle-orm";

export type Document = typeof documents.$inferSelect;
export type NewDocument = typeof documents.$inferInsert;

export class DocumentService {
  // Create
  async create(data: NewDocument) {
    const [document] = await db.insert(documents).values(data).returning();
    return document;
  }

  // Read
  async findById(id: string) {
    const [document] = await db
      .select()
      .from(documents)
      .where(eq(documents.id, id));
    return document;
  }

  async findAll() {
    return await db.select().from(documents);
  }

  async findByRelatedId(relatedId: string) {
    return await db
      .select()
      .from(documents)
      .where(eq(documents.relatedId, relatedId));
  }

  // Update
  async update(id: string, data: Partial<NewDocument>) {
    const [document] = await db
      .update(documents)
      .set(data)
      .where(eq(documents.id, id))
      .returning();
    return document;
  }

  // Delete
  async delete(id: string) {
    const [document] = await db
      .delete(documents)
      .where(eq(documents.id, id))
      .returning();
    return document;
  }
}
