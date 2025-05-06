"use server";

import { db } from "@/db";
import { cashflows } from "@/db/schema";
import { desc } from "drizzle-orm";

export async function getCashflowList() {
  const result = await db
    .select()
    .from(cashflows)
    .orderBy(desc(cashflows.date));
  return result;
}
