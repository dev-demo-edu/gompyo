"use server";

import { db } from "@/db";
import { cargos, contracts, items, shipments } from "@/db/schema";
import { BarDataItem } from "@/types/dashboard-data";
import { eq, like, sum } from "drizzle-orm";

export async function searchBarChartDataGroupingByCompany(
  year: string,
  month: string,
): Promise<BarDataItem[]> {
  try {
    const chartDataList = await db
      .select({
        value: sum(cargos.contractTon),
        category: shipments.shippingCompany,
      })
      .from(cargos)
      .leftJoin(shipments, eq(cargos.shipmentId, shipments.id))
      .leftJoin(contracts, eq(shipments.contractId, contracts.id))
      .where(like(contracts.contractDate, `%${year}-${month}%`))
      .groupBy(shipments.shippingCompany);

    return chartDataList;
  } catch (error) {
    console.error("Error searching chartData by name:", error);
    throw error;
  }
}

export async function searchBarChartDataGroupingByItems(
  year: string,
  month: string,
): Promise<BarDataItem[]> {
  try {
    const chartDataList = await db
      .select({
        value: sum(cargos.contractTon),
        category: items.itemName,
      })
      .from(cargos)
      .leftJoin(items, eq(cargos.itemsId, items.id))
      .leftJoin(shipments, eq(cargos.shipmentId, shipments.id))
      .leftJoin(contracts, eq(shipments.contractId, contracts.id))
      .where(like(contracts.contractDate, `%${year}-${month}%`))
      .groupBy(items.id);

    return chartDataList;
  } catch (error) {
    console.error("Error searching chartData by name:", error);
    throw error;
  }
}
