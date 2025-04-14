"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { UserService } from "../services/user.service";

const userService = new UserService();

export async function loginUser(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  try {
    const user = await userService.findByEmail(email);
    if (!user || user.password !== password) {
      return { error: "이메일 또는 비밀번호가 올바르지 않습니다." };
    }

    // 쿠키에 사용자 ID 저장
    const cookieStore = await cookies();
    cookieStore.set({
      name: "userId",
      value: user.id,
      httpOnly: true,
      secure: true,
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return { success: true };
  } catch (error) {
    console.error("Login error:", error);
    return { error: "로그인 중 오류가 발생했습니다." };
  }
}

export async function logoutUser() {
  const cookieStore = await cookies();
  cookieStore.delete("userId");
  redirect("/login");
}

export async function getUser() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("userId")?.value;

  if (!userId) {
    return null;
  }

  return userService.findById(userId);
}

export async function getUserColumnOrder() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("userId")?.value;

  if (!userId) {
    return [];
  }

  const columnOrder = await userService.getColumnOrder(userId);
  return columnOrder;
}

export async function saveUserColumnOrder(columnOrder: string[]) {
  const cookieStore = await cookies();
  const userId = cookieStore.get("userId")?.value;

  if (!userId) {
    return { error: "로그인이 필요합니다." };
  }

  try {
    await userService.updateColumnOrder(userId, JSON.stringify(columnOrder));
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("컬럼 순서 저장 오류:", error);
    return { error: "컬럼 순서를 저장하는 중 오류가 발생했습니다." };
  }
}
