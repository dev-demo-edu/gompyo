/**
 * @file link-actions.ts
 * @description 링크 관련 서버 액션 (CRUD 및 순서 변경)
 *
 * - createLinkAction: 링크 추가
 * - getLinksAction: 전체 링크 조회
 * - updateLinkAction: 링크 정보 수정
 * - deleteLinkAction: 링크 삭제
 * - reorderLinksAction: 링크 순서 일괄 변경
 */

"use server";

//TODO: 액션들 수정 필요
import { Link, LinkService } from "@/services/link.service";

// 링크 추가 액션
export async function addLink(
  title: string,
  url: string,
  order: number,
): Promise<Link> {
  return await LinkService.create(title, url, order);
}

// 전체 링크 조회 액션
export async function getLinks(): Promise<Link[]> {
  return await LinkService.getAll();
}

// 링크 정보 수정 액션
export async function updateLink(
  id: string,
  data: Partial<Omit<Link, "id" | "createdAt">>,
): Promise<void> {
  await LinkService.update(id, data);
}

// 링크 삭제 액션
export async function deleteLink(id: string): Promise<void> {
  await LinkService.delete(id);
}

// 링크 순서 일괄 변경 액션
export async function reorderLinks(
  orderedLinks: { id: string; order: number }[],
): Promise<void> {
  await LinkService.reorder(orderedLinks);
}
