"use server";

import { db } from "@/db";
import { items } from "@/db/schema";
import { like } from "drizzle-orm";

interface SearchItem {
  id: string;
  itemName: string | null;
  itemVariety: string | null;
  hsCode?: string | null;
  packingUnit?: string | null;
}

export async function searchItemsByName(
  itemName: string,
): Promise<SearchItem[]> {
  try {
    // 아이템 이름으로 검색
    const itemsList = await db
      .select({
        id: items.id,
        itemName: items.itemName,
        itemVariety: items.itemVariety,
        hsCode: items.hsCode,
        packingUnit: items.packingUnit,
      })
      .from(items)
      .where(like(items.itemName, "%" + itemName + "%"));

    return itemsList;
  } catch (error) {
    console.error("Error searching items by name:", error);
    throw error;
  }
}
