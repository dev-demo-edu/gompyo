"use server";

import { db } from "@/db";
import { cashflows, companies } from "@/db/schema";
import { asc, desc } from "drizzle-orm";

export async function getCashflowList() {
  const result = await db
    .select()
    .from(cashflows)
    .orderBy(desc(cashflows.date));
  return result;
}

export async function getCompanyList() {
  const result = await db.select().from(companies).orderBy(asc(companies.name));
  return result;
}
