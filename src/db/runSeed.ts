import { db } from "./index.js"; // Drizzle DB 객체를 export한 곳
import {
  contracts,
  items,
  shipments,
  cargos,
  costs,
  costDetails,
  payments,
  paymentsTt,
} from "./schema.js"; // Drizzle ORM에 정의된 스키마

import {
  contractsSeed,
  itemsSeed,
  shipmentsSeed,
  cargosSeed,
  costsSeed,
  costDetailsSeed,
  paymentsSeed,
  paymentsTtSeed,
} from "./data/seed.js"; // 위에서 생성한 seed 데이터
import { users } from "./schema";
import { nanoid } from "nanoid";

async function runSeed() {
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

  console.log("🌱 user 데이터 생성 완료!");
  try {
    // 기존 데이터 삭제
    console.log("🗑️ 기존 데이터 삭제 중...");
    await db.delete(costDetails);
    await db.delete(costs);
    await db.delete(cargos);
    await db.delete(paymentsTt);
    await db.delete(payments);
    await db.delete(shipments);
    await db.delete(items);
    await db.delete(contracts);
    console.log("✅ 기존 데이터 삭제 완료");

    // 새로운 데이터 삽입
    console.log("🌱 새로운 데이터 삽입 중...");
    await db.insert(contracts).values(contractsSeed);
    await db.insert(items).values(itemsSeed);
    await db.insert(shipments).values(shipmentsSeed);
    await db.insert(payments).values(paymentsSeed);
    await db.insert(paymentsTt).values(paymentsTtSeed);
    await db.insert(cargos).values(cargosSeed);
    await db.insert(costs).values(costsSeed);
    await db.insert(costDetails).values(costDetailsSeed);
    console.log("✅ 시드 데이터 삽입 완료");
  } catch (err) {
    console.error("❌ 시드 데이터 삽입 실패:", err);
  }
}

runSeed();
