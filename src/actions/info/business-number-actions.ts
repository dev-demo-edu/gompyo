"use server";

import {
  BusinessNumberService,
  BusinessNumberInput,
} from "@/services/business-number-service";
import { nanoid } from "nanoid";

export async function deleteBusinessNumbers(ids: string[]) {
  await BusinessNumberService.deleteMany(ids);
}

export type AddBusinessNumberInput = Omit<
  BusinessNumberInput,
  "id" | "createdAt" | "updatedAt"
>;

export async function addBusinessNumber(input: AddBusinessNumberInput) {
  const businessNumber = input.businessNumber.replace(/-/g, "");

  const existingBusinessNumber =
    await BusinessNumberService.getByBusinessNumber(businessNumber);
  if (existingBusinessNumber) {
    throw new Error("이미 존재하는 사업자번호입니다.");
  }

  input.businessNumber = businessNumber;

  const newBusinessNumber: BusinessNumberInput = {
    id: nanoid(),
    ...input,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  await BusinessNumberService.create(newBusinessNumber);
}

export async function getBusinessNumbers() {
  const businessNumbers = await BusinessNumberService.getAll();
  return businessNumbers;
}

export type UpdateBusinessNumberInput = Omit<
  BusinessNumberInput,
  "createdAt" | "updatedAt"
>;

export async function updateBusinessNumber(input: UpdateBusinessNumberInput) {
  await BusinessNumberService.update(input.id, {
    ...input,
    updatedAt: new Date().toISOString(),
  });
}
