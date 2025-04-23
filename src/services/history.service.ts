import { db } from "@/db";
import { historyLogs } from "@/db/schema";
import { eq, and, desc } from "drizzle-orm";
import { nanoid } from "nanoid";
import { HistoryItem } from "@/containers/detail-view/cargo-history/types";

export type HistoryLog = typeof historyLogs.$inferSelect;
export type NewHistoryLog = typeof historyLogs.$inferInsert;

export type HistoryChangeItem = {
  field: string;
  from: string;
  to: string;
};

export class HistoryService {
  /**
   * 변경 로그 추가
   */
  async addChangeLog(params: {
    targetType: string;
    targetId: string;
    user: string;
    changes: Array<{
      field: string;
      from: string | null;
      to: string | null;
    }>;
  }): Promise<HistoryLog> {
    const { targetType, targetId, user, changes } = params;

    const [log] = await db
      .insert(historyLogs)
      .values({
        id: nanoid(),
        targetType,
        targetId,
        type: changes.length > 1 ? "multi-change" : "change",
        user,
        changes: JSON.stringify(changes),
        createdAt: new Date().toISOString(),
      })
      .returning();

    return log;
  }

  /**
   * 상태 변경 로그 추가
   */
  async addStatusLog(params: {
    targetType: string;
    targetId: string;
    user: string;
    status: string;
  }): Promise<HistoryLog> {
    const { targetType, targetId, user, status } = params;

    const [log] = await db
      .insert(historyLogs)
      .values({
        id: nanoid(),
        targetType,
        targetId,
        type: "status",
        user,
        status,
        createdAt: new Date().toISOString(),
      })
      .returning();

    return log;
  }

  /**
   * 대상에 대한 모든 로그 조회
   */
  async findByTarget(
    targetType: string,
    targetId: string,
  ): Promise<HistoryItem[]> {
    const logs = await db
      .select()
      .from(historyLogs)
      .where(
        and(
          eq(historyLogs.targetType, targetType),
          eq(historyLogs.targetId, targetId),
        ),
      )
      .orderBy(desc(historyLogs.createdAt));

    return logs.map((log) => this.formatLogForResponse(log));
  }

  /**
   * 특정 타입의 로그 조회
   */
  async findByType(
    targetType: string,
    targetId: string,
    type: "change" | "status",
  ): Promise<HistoryItem[]> {
    const logs = await db
      .select()
      .from(historyLogs)
      .where(
        and(
          eq(historyLogs.targetType, targetType),
          eq(historyLogs.targetId, targetId),
          eq(historyLogs.type, type),
        ),
      )
      .orderBy(desc(historyLogs.createdAt));

    return logs.map((log) => this.formatLogForResponse(log));
  }

  /**
   * 로그 데이터를 응답 형식으로 변환
   */
  private formatLogForResponse(log: HistoryLog): HistoryItem {
    if (log.type === "change") {
      const changes = JSON.parse(log.changes || "[]");
      const firstChange = changes[0] || {};
      return {
        type: "change",
        user: log.user || "",
        created_at: log.createdAt || "",
        field: firstChange.field,
        from: firstChange.from,
        to: firstChange.to,
      };
    } else if (log.type === "multi-change") {
      const changes = JSON.parse(log.changes || "[]");
      return {
        type: "multi-change",
        user: log.user || "",
        created_at: log.createdAt || "",
        changes: changes.map(
          (change: { field: string; from: string; to: string }) => ({
            field: change.field,
            from: change.from,
            to: change.to,
          }),
        ),
      };
    } else {
      return {
        type: "status",
        user: log.user || "",
        created_at: log.createdAt || "",
        status: log.status || "",
      };
    }
  }

  /**
   * 로그 삭제
   */
  async delete(id: string): Promise<HistoryLog> {
    const [log] = await db
      .delete(historyLogs)
      .where(eq(historyLogs.id, id))
      .returning();

    return log;
  }

  /**
   * 특정 대상의 모든 로그 삭제
   */
  async deleteAllForTarget(
    targetType: string,
    targetId: string,
  ): Promise<void> {
    await db
      .delete(historyLogs)
      .where(
        and(
          eq(historyLogs.targetType, targetType),
          eq(historyLogs.targetId, targetId),
        ),
      );
  }
}
