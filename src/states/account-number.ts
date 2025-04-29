import { atom } from "jotai";
import type { AccountNumberRow } from "@/containers/info/account-number-grid";

export const selectedAccountNumbersAtom = atom<AccountNumberRow[]>([]);
