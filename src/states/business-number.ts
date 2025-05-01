import { atom } from "jotai";
import { InferSelectModel } from "drizzle-orm";
import { businessNumbers } from "@/db/schema";

export type BusinessNumberRow = InferSelectModel<typeof businessNumbers>;

// 선택된 사업자등록번호 목록을 관리하는 atom
export const selectedBusinessNumbersAtom = atom<BusinessNumberRow[]>([]);

// 사업자등록번호 목록 새로고침을 위한 atom
export const businessNumberRefreshAtom = atom<number>(0);
