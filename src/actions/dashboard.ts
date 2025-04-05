"use server";

import { db } from "@/db";
import {
  cargos,
  contracts,
  costDetails,
  costs,
  items,
  shipments,
} from "@/db/schema";
import { BarDataItem } from "@/types/dashboard-data";
import { eq, like, sum, sql } from "drizzle-orm";

export async function searchBarChartDataGroupingByItems(
  year: string,
  month: string,
  chartType: string,
): Promise<BarDataItem[]> {
  try {
    let chartDataList;
    if (chartType === "톤") {
      chartDataList = await db
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
    } else if (chartType === "달러") {
      chartDataList = await db
        .select({
          value: sql<number>`SUM(${costDetails.unitPrice} * ${cargos.contractTon} * 1000)`,
          category: items.itemName,
        })
        .from(cargos)
        .leftJoin(items, eq(cargos.itemsId, items.id))
        .leftJoin(shipments, eq(cargos.shipmentId, shipments.id))
        .leftJoin(contracts, eq(shipments.contractId, contracts.id))
        .leftJoin(costs, eq(cargos.id, costs.cargoId))
        .leftJoin(costDetails, eq(costs.id, costDetails.costId))
        .where(like(contracts.contractDate, `%${year}-${month}%`))
        .groupBy(items.id);
    } else if (chartType === "원") {
      chartDataList = await db
        .select({
          value: sql<number>`SUM(${costDetails.unitPrice} * ${cargos.contractTon} * 1000)`,
          category: items.itemName,
        })
        .from(cargos)
        .leftJoin(items, eq(cargos.itemsId, items.id))
        .leftJoin(shipments, eq(cargos.shipmentId, shipments.id))
        .leftJoin(contracts, eq(shipments.contractId, contracts.id))
        .leftJoin(costs, eq(cargos.id, costs.cargoId))
        .leftJoin(costDetails, eq(costs.id, costDetails.costId))
        .where(like(contracts.contractDate, `%${year}-${month}%`))
        .groupBy(items.id);
    }

    return chartDataList;
  } catch (error) {
    console.error("Error searching chartData by name:", error);
    throw error;
  }
}

export async function searchBarChartDataGroupingByContractParty(
  year: string,
  month: string,
  chartType: string,
): Promise<BarDataItem[]> {
  try {
    let chartDataList;
    if (chartType === "톤") {
      chartDataList = await db
        .select({
          value: sum(cargos.contractTon),
          category: contracts.contractParty,
        })
        .from(cargos)
        .leftJoin(shipments, eq(cargos.shipmentId, shipments.id))
        .leftJoin(contracts, eq(shipments.contractId, contracts.id))
        .where(like(contracts.contractDate, `%${year}-${month}%`))
        .groupBy(contracts.contractParty);
    } else if (chartType === "달러") {
      chartDataList = await db
        .select({
          value: sql<number>`SUM(${costDetails.unitPrice} * ${cargos.contractTon} * 1000)`,
          category: contracts.contractParty,
        })
        .from(cargos)
        .leftJoin(shipments, eq(cargos.shipmentId, shipments.id))
        .leftJoin(contracts, eq(shipments.contractId, contracts.id))
        .leftJoin(costs, eq(cargos.id, costs.cargoId))
        .leftJoin(costDetails, eq(costs.id, costDetails.costId))
        .where(like(contracts.contractDate, `%${year}-${month}%`))
        .groupBy(contracts.contractParty);
    } else if (chartType === "원") {
      chartDataList = await db
        .select({
          value: sql<number>`SUM(${costDetails.unitPrice} * ${cargos.contractTon} * 1000)`,
          category: contracts.contractParty,
        })
        .from(cargos)
        .leftJoin(shipments, eq(cargos.shipmentId, shipments.id))
        .leftJoin(contracts, eq(shipments.contractId, contracts.id))
        .leftJoin(costs, eq(cargos.id, costs.cargoId))
        .leftJoin(costDetails, eq(costs.id, costDetails.costId))
        .where(like(contracts.contractDate, `%${year}-${month}%`))
        .groupBy(contracts.contractParty);
    }

    return chartDataList;
  } catch (error) {
    console.error("Error searching chartData by name:", error);
    throw error;
  }
}

export async function searchBarChartDataGroupingByImporter(
  year: string,
  month: string,
  chartType: string,
): Promise<BarDataItem[]> {
  try {
    let chartDataList;
    if (chartType === "톤") {
      chartDataList = await db
        .select({
          value: sum(cargos.contractTon),
          category: contracts.importer,
        })
        .from(cargos)
        .leftJoin(shipments, eq(cargos.shipmentId, shipments.id))
        .leftJoin(contracts, eq(shipments.contractId, contracts.id))
        .where(like(contracts.contractDate, `%${year}-${month}%`))
        .groupBy(contracts.importer);
    } else if (chartType === "달러") {
      chartDataList = await db
        .select({
          value: sql<number>`SUM(${costDetails.unitPrice} * ${cargos.contractTon} * 1000)`,
          category: contracts.importer,
        })
        .from(cargos)
        .leftJoin(shipments, eq(cargos.shipmentId, shipments.id))
        .leftJoin(contracts, eq(shipments.contractId, contracts.id))
        .leftJoin(costs, eq(cargos.id, costs.cargoId))
        .leftJoin(costDetails, eq(costs.id, costDetails.costId))
        .where(like(contracts.contractDate, `%${year}-${month}%`))
        .groupBy(contracts.importer);
    } else if (chartType === "원") {
      chartDataList = await db
        .select({
          value: sql<number>`SUM(${costDetails.unitPrice} * ${cargos.contractTon} * 1000)`,
          category: contracts.importer,
        })
        .from(cargos)
        .leftJoin(shipments, eq(cargos.shipmentId, shipments.id))
        .leftJoin(contracts, eq(shipments.contractId, contracts.id))
        .leftJoin(costs, eq(cargos.id, costs.cargoId))
        .leftJoin(costDetails, eq(costs.id, costDetails.costId))
        .where(like(contracts.contractDate, `%${year}-${month}%`))
        .groupBy(contracts.importer);
    }

    return chartDataList;
  } catch (error) {
    console.error("Error searching chartData by name:", error);
    throw error;
  }
}
