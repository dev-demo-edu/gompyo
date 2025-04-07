// src/db/seed.ts
import { db } from "./index";
import { users } from "./schema";
import { nanoid } from "nanoid";

async function seed() {
  console.log("🌱 시드 데이터 생성 중...");

  // 기존 사용자 확인
  const existingUsers = await db.select().from(users);

  if (existingUsers.length === 0) {
    // 기본 사용자가 없는 경우 생성
    await db.insert(users).values({
      id: nanoid(),
      email: "admin@example.com",
      password: "password123",
      // columnOrder는 기본값을 사용
    });

    console.log("✅ 기본 사용자가 생성되었습니다:");
    console.log("   - 이메일: admin@example.com");
    console.log("   - 비밀번호: password123");
  } else {
    console.log("ℹ️ 기존 사용자가 있습니다. 기본 사용자를 생성하지 않습니다.");
  }

  console.log("🌱 시드 데이터 생성 완료!");
}

seed()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("시드 데이터 생성 중 오류 발생:", error);
    process.exit(1);
  });
