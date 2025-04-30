"use server";

import {
  AccountNumberService,
  AccountNumberInput,
} from "@/services/account-number.service";
import { nanoid } from "nanoid";

export async function deleteAccountNumbers(ids: string[]) {
  await AccountNumberService.deleteMany(ids);
}

export type AddAccountNumberInput = Omit<AccountNumberInput, "id">;

export async function addAccountNumber(input: AddAccountNumberInput) {
  const accountNumber = input.accountNumber.replace(/-/g, "");

  const existingAccount =
    await AccountNumberService.getByAccountNumber(accountNumber);
  if (existingAccount) {
    throw new Error("이미 존재하는 계좌번호입니다.");
  }

  input.accountNumber = accountNumber;

  const newAccount: AccountNumberInput = {
    id: nanoid(),
    ...input,
  };
  await AccountNumberService.create(newAccount);
}

export async function getAccountNumbers() {
  const accountNumbers = await AccountNumberService.getAll();
  return accountNumbers;
}
