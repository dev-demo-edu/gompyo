"use server";

import { db } from "@/db";
import { items } from "@/db/schema";
import { Item } from "@/services/item.service";
import { eq, like } from "drizzle-orm";

export async function searchItemsByName(itemName: string): Promise<[string]> {
  try {
	// 아이템 이름으로 검색
	const itemsList = await db
		.select({itemName: items.itemName})
	  .from(items)
	  .where(like(items.itemName, "%" + itemName + "%"));

	  return itemsList;
  } catch (error) {
	console.error("Error searching items by name:", error);
	throw error;
  }
}