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

export async function getCashflowById(id: string) {
  const result = await db.select().from(cashflows).where(eq(cashflows.id, id));
  return result[0];
}

export async function getCompanyList() {
  const result = await db.select().from(companies).orderBy(asc(companies.name));
  return result;
}

type CashflowFormValues = Omit<
  Cashflow,
  "id" | "createdAt" | "updatedAt" | "priority"
>;

export async function getNewPriority(cashflow: CashflowFormValues) {
  const sameDateRows = await db
    .select()
    .from(cashflows)
    .where(
      and(
        eq(cashflows.date, cashflow.date),
        eq(cashflows.type, cashflow.type),
        eq(cashflows.companyId, cashflow.companyId),
      ),
    );
  let newPriority: number | null = null;
  newPriority = sameDateRows.length + 1;
  return newPriority;
}

export async function addCashflow(cashflow: CashflowFormValues) {
  // 해당 날짜의 row 모두 조회
  const newPriority = await getNewPriority(cashflow);
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
  await reorderAllCashflowPriorities();
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

/**
 * 특정 날짜(date)에 해당하는 cashflow들의 priority를 1부터 재정렬합니다.
 */
export async function reorderCashflowPrioritiesByDate(
  cashflow: CashflowFormValues,
) {
  const rows = await db
    .select()
    .from(cashflows)
    .where(
      and(
        eq(cashflows.date, cashflow.date),
        eq(cashflows.type, cashflow.type),
        eq(cashflows.companyId, cashflow.companyId),
      ),
    )
    .orderBy(asc(cashflows.priority));
  for (let i = 0; i < rows.length; i++) {
    await db
      .update(cashflows)
      .set({ priority: i + 1 })
      .where(eq(cashflows.id, rows[i].id));
  }
}

export async function reorderAllCashflowPriorities() {
  // 모든 company, type, date 조합 조회
  const allRows = await db.select().from(cashflows);
  const groupMap = new Map<string, Cashflow[]>();

  for (const row of allRows) {
    const key = `${row.companyId}_${row.type}_${row.date}`;
    if (!groupMap.has(key)) groupMap.set(key, []);
    groupMap.get(key)!.push(row);
  }

  for (const group of groupMap.values()) {
    // priority 오름차순 정렬
    group.sort((a, b) => (a.priority ?? 0) - (b.priority ?? 0));
    for (let i = 0; i < group.length; i++) {
      await db
        .update(cashflows)
        .set({ priority: i + 1 })
        .where(eq(cashflows.id, group[i].id));
    }
  }
}

export async function updateCashflow(cashflow: CashflowFormValues, id: string) {
  // 기존 cashflow의 날짜, 타입, priority 조회
  const oldCashflow = await getCashflowById(id);

  // type/date가 바뀌었는지 체크
  const isTypeChanged = oldCashflow?.type !== cashflow.type;
  const isDateChanged = oldCashflow?.date !== cashflow.date;

  // priority 결정
  let newPriority = oldCashflow?.priority;
  if (isTypeChanged || isDateChanged) {
    newPriority = await getNewPriority(cashflow);
  }

  // cashflow 업데이트
  await db
    .update(cashflows)
    .set({
      ...cashflow,
      priority: newPriority,
      updatedAt: new Date().toISOString(),
    })
    .where(eq(cashflows.id, id));

  // type 또는 date가 바뀌었을 때만 우선순위 재정렬
  if (oldCashflow && (isTypeChanged || isDateChanged)) {
    await reorderCashflowPrioritiesByDate(oldCashflow);
    await reorderCashflowPrioritiesByDate(cashflow);
  }

  return await db
    .select()
    .from(cashflows)
    .where(eq(cashflows.id, id))
    .then((rows) => rows[0]);
}
