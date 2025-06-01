/**
 * @file seed-grid-data.ts
 * @description 엑셀형 그리드 데이터를 위한 샘플 데이터 삽입 스크립트
 *
 * 이 파일은 회사(컬럼) × 품목(행) 형태의 엑셀 데이터를
 * 관계형 데이터베이스에 정규화하여 저장하는 샘플 데이터를 생성합니다.
 *
 * 주요 기능:
 * 1. 회사 데이터 삽입 (gridCompanies) - 국내/해외 회사
 * 2. 품목 데이터 삽입 (gridItems)
 * 3. 회사-품목 관계 데이터 삽입 (gridCompanyItems) - arrival/loading 타입
 *
 * 사용법:
 * pnpm tsx src/db/seed-grid-data.ts
 */

import { db } from "./index";
import {
  quotationCompanies,
  quotationItems,
  quotationCompaniesItems,
} from "./schema";
import { nanoid } from "nanoid";

async function seedGridData() {
  console.log("🌱 그리드 데이터 시딩 시작...");

  try {
    // 1. 회사 데이터 삽입 (국내 + 해외)
    const domesticCompanies = [
      { id: nanoid(), name: "삼성전자", type: "domestic" as const },
      { id: nanoid(), name: "LG전자", type: "domestic" as const },
      { id: nanoid(), name: "현대자동차", type: "domestic" as const },
      { id: nanoid(), name: "SK하이닉스", type: "domestic" as const },
      { id: nanoid(), name: "NAVER", type: "domestic" as const },
    ];

    const overseasCompanies = [
      { id: nanoid(), name: "Apple Inc.", type: "foreign" as const },
      { id: nanoid(), name: "Microsoft Corp.", type: "foreign" as const },
      { id: nanoid(), name: "Google LLC", type: "foreign" as const },
      { id: nanoid(), name: "Amazon.com Inc.", type: "foreign" as const },
      { id: nanoid(), name: "Tesla Inc.", type: "foreign" as const },
      { id: nanoid(), name: "Sony Corporation", type: "foreign" as const },
      { id: nanoid(), name: "Toyota Motor Corp.", type: "foreign" as const },
    ];

    const allCompanies = [...domesticCompanies, ...overseasCompanies];

    console.log("📊 회사 데이터 삽입 중...");
    for (const company of allCompanies) {
      // arrival과 loading 타입 모두 생성
      const priceTypes = ["arrival", "loading"] as const;

      for (const priceType of priceTypes) {
        await db.insert(quotationCompanies).values({
          id: nanoid(),
          companyName: company.name,
          companyType: company.type,
          priceType: priceType,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      }
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
      {
        id: nanoid(),
        name: "마우스",
        origin: "중국",
        nameEn: "Mouse",
        originEn: "China",
      },
      {
        id: nanoid(),
        name: "스피커",
        origin: "독일",
        nameEn: "Speaker",
        originEn: "Germany",
      },
      {
        id: nanoid(),
        name: "웹캠",
        origin: "일본",
        nameEn: "Webcam",
        originEn: "Japan",
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

    // 3. 실제 삽입된 회사 데이터 조회 (arrival/loading 타입별로 생성되었으므로)
    const insertedCompanies = await db.select().from(quotationCompanies);

    // 4. 회사-품목 관계 데이터 삽입 (랜덤 값)
    console.log("🔗 회사-품목 관계 데이터 삽입 중...");
    for (const company of insertedCompanies) {
      for (const item of items) {
        // 모든 조합에 대해 랜덤 값 생성 (일부는 null로 설정)
        const shouldHaveValue = Math.random() > 0.25; // 75% 확률로 값 존재

        let value = null;
        if (shouldHaveValue) {
          // priceType에 따라 다른 가격 범위 설정
          if (company.priceType === "arrival") {
            // 도착도: 상대적으로 높은 가격 (운송비 포함)
            value = Math.round((Math.random() * 1200 + 200) * 100) / 100; // 200-1400 사이
          } else {
            // 상차도: 상대적으로 낮은 가격 (운송비 미포함)
            value = Math.round((Math.random() * 800 + 100) * 100) / 100; // 100-900 사이
          }
        }

        await db.insert(quotationCompaniesItems).values({
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
    console.log(
      `📊 회사: ${allCompanies.length}개 (국내: ${domesticCompanies.length}개, 해외: ${overseasCompanies.length}개)`,
    );
    console.log(
      `📊 회사 레코드: ${insertedCompanies.length}개 (arrival/loading 타입별)`,
    );
    console.log(`📦 품목: ${items.length}개`);
    console.log(`🔗 관계: ${insertedCompanies.length * items.length}개`);
  } catch (error) {
    console.error("❌ 시딩 중 오류 발생:", error);
    throw error;
  }
}

// 스크립트 직접 실행
seedGridData()
  .then(() => {
    console.log("🎉 시딩 완료!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("💥 시딩 실패:", error);
    process.exit(1);
  });

export { seedGridData };
