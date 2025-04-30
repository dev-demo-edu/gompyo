import { atom } from "jotai";
import type { AccountNumberRow } from "@/containers/info/account-number/account-number-grid";

export const selectedAccountNumbersAtom = atom<AccountNumberRow[]>([]);

// 계좌 추가/삭제 트리거 atom
export const accountNumberRefreshAtom = atom(0);
