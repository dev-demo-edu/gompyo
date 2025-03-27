"use server";

import { db } from "@/db/index";
import { like, or } from "drizzle-orm";
import { items } from "@/db/schema";

export async function searchItems(query: string) {
  if (!query || query.length < 2) {
    return { items: [] };
  }

  try {
    const searchPattern = `%${query}%`;
    const result = await db
      .select({
        id: items.id,
        itemName: items.itemName,
        itemVariety: items.itemVariety,
        hsCode: items.hsCode,
        packingUnit: items.packingUnit,
      })
      .from(items)
      .where(
        or(
          like(items.itemName, searchPattern),
          like(items.itemVariety, searchPattern),
        ),
      )
      .limit(10);

    return { items: result };
  } catch (error) {
    console.error("아이템 검색 중 오류 발생:", error);
    return { items: [], error: "검색 중 오류가 발생했습니다." };
  }
}
