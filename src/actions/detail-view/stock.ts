"use server";

import { db } from "@/db";
import { stocks } from "@/db/schema";
import { eq, InferSelectModel } from "drizzle-orm";
import { nanoid } from "nanoid";

export type Stock = InferSelectModel<typeof stocks>;

export async function getStock(cargoId: string) {
  const stock = await db.query.stocks.findFirst({
    where: eq(stocks.cargoId, cargoId),
  });
  return stock;
}

export async function createStock(
  cargoId: string,
  company: string,
  uncleared: number,
) {
  // 모든 회사 재고 0, 해당 회사만 uncleared 세팅
  const base: Record<string, number> = {
    dnbCleared: 0,
    namhaeCleared: 0,
    interlivingCleared: 0,
    gompyoCleared: 0,
    ramplusCleared: 0,
    dnbUncleared: 0,
    namhaeUncleared: 0,
    interlivingUncleared: 0,
    gompyoUncleared: 0,
    ramplusUncleared: 0,
  };
  base[`${company}Uncleared`] = uncleared;

  await db.insert(stocks).values({
    id: nanoid(),
    cargoId,
    ...base,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
}

// 특정 회사 재고만 업데이트하는 헬퍼 함수
export async function updateStock(
  cargoId: string,
  company: string,
  cleared: number,
  uncleared: number,
) {
  const updateData = {
    [`${company}Cleared`]: cleared,
    [`${company}Uncleared`]: uncleared,
    updatedAt: new Date().toISOString(),
  };

  await db.update(stocks).set(updateData).where(eq(stocks.cargoId, cargoId));
}
