"use server";

import { db } from "@/db";
import { cashflows, companies } from "@/db/schema";
import { asc, eq, inArray, and } from "drizzle-orm";
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

type CashflowFormValues = Omit<
  Cashflow,
  "id" | "createdAt" | "updatedAt" | "priority"
>;

export async function addCashflow(cashflow: CashflowFormValues) {
  // 해당 날짜의 row 모두 조회
  const sameDateRows = await db
    .select()
    .from(cashflows)
    .where(
      and(eq(cashflows.date, cashflow.date), eq(cashflows.type, cashflow.type)),
    );
  let newPriority: number | null = null;
  if (sameDateRows.length === 0) {
    newPriority = null;
  } else if (sameDateRows.length === 1) {
    // 기존 row priority를 1로 업데이트
    await db
      .update(cashflows)
      .set({ priority: 1 })
      .where(eq(cashflows.id, sameDateRows[0].id));
    newPriority = 2;
  } else {
    newPriority = sameDateRows.length + 1;
  }
  const result = await db.insert(cashflows).values({
    ...cashflow,
    id: nanoid(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    priority: newPriority,
  });
  return result;
}

export async function deleteCashflows(ids: string[]) {
  const result = await db.delete(cashflows).where(inArray(cashflows.id, ids));
  return result;
}

export async function updateCashflowPriorities(updated: Cashflow[]) {
  for (const c of updated) {
    await db
      .update(cashflows)
      .set({ priority: c.priority })
      .where(eq(cashflows.id, c.id));
  }
}

export async function updateCompanyBalance(amount: number, companyId: string) {
  const result = await db
    .update(companies)
    .set({
      companyBalance: amount,
    })
    .where(eq(companies.id, companyId));
  return result;
}
