/**
 * @file seed-grid-data.ts
 * @description 엑셀형 그리드 데이터를 위한 샘플 데이터 삽입 스크립트
 *
 * 이 파일은 회사(컬럼) × 품목(행) 형태의 엑셀 데이터를
 * 관계형 데이터베이스에 정규화하여 저장하는 샘플 데이터를 생성합니다.
 *
 * 주요 기능:
 * 1. 회사 데이터 삽입 (gridCompanies)
 * 2. 품목 데이터 삽입 (gridItems)
 * 3. 회사-품목 관계 데이터 삽입 (gridCompanyItems)
 *
 * 사용법:
 * pnpm tsx src/db/seed-grid-data.ts
 */

import { db } from "./index";
import { partners, quotationItems, partnersItems } from "./schema";
import { nanoid } from "nanoid";

async function seedGridData() {
  console.log("🌱 그리드 데이터 시딩 시작...");

  try {
    // 1. 회사 데이터 삽입
    const companies = [
      { id: nanoid(), name: "삼성전자" },
      { id: nanoid(), name: "LG전자" },
      { id: nanoid(), name: "현대자동차" },
      { id: nanoid(), name: "SK하이닉스" },
      { id: nanoid(), name: "NAVER" },
    ];

    console.log("📊 회사 데이터 삽입 중...");
    for (const company of companies) {
      await db.insert(partners).values({
        id: company.id,
        companyName: company.name,
        companyType: "domestic",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }

    // 2. 품목 데이터 삽입
    const items = [
      {
        id: nanoid(),
        name: "스마트폰",
        origin: "한국",
        nameEn: "Smartphone",
        originEn: "Korea",
      },
      {
        id: nanoid(),
        name: "노트북",
        origin: "한국",
        nameEn: "Notebook",
        originEn: "Korea",
      },
      {
        id: nanoid(),
        name: "태블릿",
        origin: "한국",
        nameEn: "Tablet",
        originEn: "Korea",
      },
      {
        id: nanoid(),
        name: "스마트워치",
        origin: "한국",
        nameEn: "Smartwatch",
        originEn: "Korea",
      },
      {
        id: nanoid(),
        name: "이어폰",
        origin: "한국",
        nameEn: "Earphone",
        originEn: "Korea",
      },
      {
        id: nanoid(),
        name: "모니터",
        origin: "한국",
        nameEn: "Monitor",
        originEn: "Korea",
      },
      {
        id: nanoid(),
        name: "키보드",
        origin: "한국",
        nameEn: "Keyboard",
        originEn: "Korea",
      },
    ];

    console.log("📦 품목 데이터 삽입 중...");
    for (const item of items) {
      await db.insert(quotationItems).values({
        id: item.id,
        itemName: item.name,
        itemOrigin: item.origin,
        itemNameEn: item.nameEn,
        itemOriginEn: item.originEn,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }

    // 3. 회사-품목 관계 데이터 삽입 (랜덤 값)
    console.log("🔗 회사-품목 관계 데이터 삽입 중...");
    for (const company of companies) {
      for (const item of items) {
        // 모든 조합에 대해 랜덤 값 생성 (일부는 null로 설정)
        const shouldHaveValue = Math.random() > 0.3; // 70% 확률로 값 존재
        const value = shouldHaveValue
          ? Math.round((Math.random() * 1000 + 100) * 100) / 100 // 100-1100 사이의 값
          : null;

        await db.insert(partnersItems).values({
          id: nanoid(),
          companyId: company.id,
          itemId: item.id,
          value: value,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      }
    }

    console.log("✅ 그리드 데이터 시딩 완료!");
    console.log(`📊 회사: ${companies.length}개`);
    console.log(`📦 품목: ${items.length}개`);
    console.log(`🔗 관계: ${companies.length * items.length}개`);
  } catch (error) {
    console.error("❌ 시딩 중 오류 발생:", error);
    throw error;
  }
}

// 스크립트 직접 실행 시
if (require.main === module) {
  seedGridData()
    .then(() => {
      console.log("🎉 시딩 완료!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("💥 시딩 실패:", error);
      process.exit(1);
    });
}

export { seedGridData };
