"use server";

import { db } from "@/db";
import { cashflows, companies } from "@/db/schema";
import { asc, inArray } from "drizzle-orm";
import { InferSelectModel } from "drizzle-orm";
import { nanoid } from "nanoid";
export type Cashflow = InferSelectModel<typeof cashflows>;

export async function getCashflowList() {
  const result = await db
    .select()
    .from(cashflows)
    .orderBy(asc(cashflows.date), asc(cashflows.priority));
  return result;
}

export async function getCompanyList() {
  const result = await db.select().from(companies).orderBy(asc(companies.name));
  return result;
}

type CashflowFormValues = Omit<Cashflow, "id" | "createdAt" | "updatedAt">;

export async function addCashflow(cashflow: CashflowFormValues) {
  const result = await db.insert(cashflows).values({
    ...cashflow,
    id: nanoid(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
  return result;
}

export async function deleteCashflows(ids: string[]) {
  const result = await db.delete(cashflows).where(inArray(cashflows.id, ids));
  return result;
}
