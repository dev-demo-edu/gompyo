import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { db } from "@/db";
import { documents } from "@/db/schema";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";

export type Document = typeof documents.$inferSelect;
export type NewDocument = typeof documents.$inferInsert;

export class DocumentService {
  private s3Client: S3Client;
  private BUCKET_NAME: string;

  constructor() {
    this.s3Client = new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      },
    });
    this.BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME!;
  }

  async uploadToS3(file: File, key: string) {
    const command = new PutObjectCommand({
      Bucket: this.BUCKET_NAME,
      Key: key,
      ContentType: file.type,
      Body: Buffer.from(await file.arrayBuffer()),
    });
    return this.s3Client.send(command);
  }

  async deleteFromS3(key: string) {
    const command = new DeleteObjectCommand({
      Bucket: this.BUCKET_NAME,
      Key: key,
    });
    return this.s3Client.send(command);
  }

  async saveDocument(documentData: {
    name: string;
    type: string;
    url: string;
    relatedId: string;
    category: "contract" | "shipment";
  }) {
    return db.insert(documents).values({
      id: nanoid(),
      documentName: documentData.name,
      documentType: documentData.type,
      s3Url: documentData.url,
      uploadDate: new Date().toISOString(),
      relatedId: documentData.relatedId,
      documentCategory: documentData.category,
    });
  }

  async getDocuments(relatedId: string, category: "contract" | "shipment") {
    return db.query.documents.findMany({
      where: (documents, { and, eq }) =>
        and(
          eq(documents.relatedId, relatedId),
          eq(documents.documentCategory, category),
        ),
      orderBy: (documents, { desc }) => [desc(documents.uploadDate)],
    });
  }

  async deleteDocument(documentId: string) {
    return db.delete(documents).where(eq(documents.id, documentId));
  }

  async getDocumentById(documentId: string) {
    return db.select().from(documents).where(eq(documents.id, documentId));
  }

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
