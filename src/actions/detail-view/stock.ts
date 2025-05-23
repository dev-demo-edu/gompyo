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
  cleared?: number,
  uncleared?: number,
) {
  // 기존 값 조회
  const stock = await db.query.stocks.findFirst({
    where: eq(stocks.cargoId, cargoId),
  });
  if (!stock) throw new Error("재고 정보 없음");

  const updateData: Record<string, number | string> = {
    updatedAt: new Date().toISOString(),
  };
  if (cleared !== undefined) updateData[`${company}Cleared`] = cleared;
  if (uncleared !== undefined) updateData[`${company}Uncleared`] = uncleared;

  await db.update(stocks).set(updateData).where(eq(stocks.cargoId, cargoId));
}

export async function addUnclearedStockNumber(
  cargoId: string,
  company: string,
  uncleared: number,
) {
  const stock = await db.query.stocks.findFirst({
    where: eq(stocks.cargoId, cargoId),
  });
  if (!stock) throw new Error("재고 정보 없음");

  // keyof typeof stock을 활용해 타입 안전하게 접근
  const key = `${company}Uncleared` as keyof typeof stock;
  const current = stock[key] as number;

  const updateData: Record<string, number | string> = {
    [key]: current + uncleared,
    updatedAt: new Date().toISOString(),
  };
  await db.update(stocks).set(updateData).where(eq(stocks.cargoId, cargoId));
}

export async function switchImporter(
  cargoId: string,
  oldImporter: string,
  newImporter: string,
) {
  const stock = await db.query.stocks.findFirst({
    where: eq(stocks.cargoId, cargoId),
  });
  if (!stock) throw new Error("재고 정보 없음");

  const oldImporterCode = importerNameToCode(oldImporter);
  const newImporterCode = importerNameToCode(newImporter);

  // key를 명확히 지정하여 타입 안전하게 접근
  const oldUnclearedKey = `${oldImporterCode}Uncleared` as keyof typeof stock;
  const newUnclearedKey = `${newImporterCode}Uncleared` as keyof typeof stock;
  const oldClearedKey = `${oldImporterCode}Cleared` as keyof typeof stock;
  const newClearedKey = `${newImporterCode}Cleared` as keyof typeof stock;

  const updateData: Record<string, number | string> = {
    updatedAt: new Date().toISOString(),
  };
  updateData[oldUnclearedKey] = stock[newUnclearedKey] as number;
  updateData[newUnclearedKey] = stock[oldUnclearedKey] as number;
  updateData[oldClearedKey] = stock[newClearedKey] as number;
  updateData[newClearedKey] = stock[oldClearedKey] as number;

  await db.update(stocks).set(updateData).where(eq(stocks.cargoId, cargoId));
}

function importerNameToCode(importerName: string) {
  if (importerName === "DNB") return "dnb";
  if (importerName === "남해") return "namhae";
  if (importerName === "인터리빙") return "interliving";
  if (importerName === "곰표") return "gompyo";
  if (importerName === "램플러스") return "ramplus";
}
