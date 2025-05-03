import { db } from "@/db";
import { links } from "@/db/schema";
import { eq, asc } from "drizzle-orm";
import { nanoid } from "nanoid";

export interface Link {
  id: string;
  title: string;
  url: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

// 링크 추가
export class LinkService {
  static async create(
    title: string,
    url: string,
    order: number,
  ): Promise<Link> {
    const now = new Date().toISOString();
    const id = nanoid();
    await db.insert(links).values({
      id,
      title,
      url,
      order,
      createdAt: now,
      updatedAt: now,
    });
    return { id, title, url, order, createdAt: now, updatedAt: now };
  }

  // 전체 링크 조회 (order 순)
  static async getAll(): Promise<Link[]> {
    return await db.select().from(links).orderBy(asc(links.order));
  }

  // 링크 정보 수정
  static async update(
    id: string,
    data: Partial<Omit<Link, "id" | "createdAt">>,
  ): Promise<void> {
    await db
      .update(links)
      .set({ ...data, updatedAt: new Date().toISOString() })
      .where(eq(links.id, id));
  }

  // 링크 삭제
  static async delete(id: string): Promise<void> {
    await db.delete(links).where(eq(links.id, id));
  }

  // 링크 순서 일괄 변경
  static async reorder(
    orderedLinks: { id: string; order: number }[],
  ): Promise<void> {
    const now = new Date().toISOString();
    for (const { id, order } of orderedLinks) {
      await db
        .update(links)
        .set({ order, updatedAt: now })
        .where(eq(links.id, id));
    }
  }
}
