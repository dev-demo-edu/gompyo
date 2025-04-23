"use server";
import { HistoryService } from "@/services/history.service";

const historyService = new HistoryService();

/**
 * 변경 로그 추가
 */
export async function addChangeLog(params: {
  targetId: string;
  user: string;
  changes: { field: string; from: string | null; to: string | null }[];
}) {
  const { targetId, user, changes } = params;

  return await historyService.addChangeLog({
    targetType: "cargo",
    targetId,
    user,
    changes,
  });
}

/**
 * 상태 변경 로그 추가
 */
export async function addStatusLog(params: {
  targetId: string;
  user: string;
  status: string;
}) {
  const { targetId, user, status } = params;

  return await historyService.addStatusLog({
    targetType: "cargo",
    targetId,
    user,
    status,
  });
}

/**
 * 대상의 모든 로그 조회
 */
export async function getHistoryLogs(targetId: string) {
  return await historyService.findByTarget("cargo", targetId);
}

/**
 * 특정 타입의 로그 조회
 */
export async function getHistoryLogsByType(
  targetId: string,
  type: "change" | "status",
) {
  return await historyService.findByType("cargo", targetId, type);
}

/**
 * 로그 삭제
 */
export async function deleteHistoryLog(id: string) {
  return await historyService.delete(id);
}

/**
 * 대상의 모든 로그 삭제
 */
export async function deleteAllHistoryLogs(targetId: string) {
  return await historyService.deleteAllForTarget("cargo", targetId);
}
