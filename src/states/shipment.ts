import { atom } from "jotai";
import { InferSelectModel } from "drizzle-orm";
import { cargos } from "@/db/schema";

export type CargoRow = InferSelectModel<typeof cargos>;

// 선택된 사업자등록번호 목록을 관리하는 atom
export const selectedCargosAtom = atom<CargoRow[]>([]);

// 화물 목록 새로고침을 위한 atom
export const cargoRefreshAtom = atom<number>(0);
