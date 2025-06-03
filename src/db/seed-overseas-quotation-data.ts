/**
 * @file seed-overseas-quotation-data.ts
 * @description 해외 견적 엑셀 데이터를 기반으로 한 샘플 데이터 삽입 스크립트
 *
 * 이 파일은 해외 견적서의 품목(원산지) × 해외회사 형태의 엑셀 데이터를
 * 관계형 데이터베이스에 정규화하여 저장하는 샘플 데이터를 생성합니다.
 *
 * 주요 기능:
 * 1. 해외 회사 데이터 삽입 (quotationCompanies) - foreign 타입
 * 2. 품목 데이터 삽입 (quotationItems) - 품목명과 원산지 조합
 * 3. 회사-품목 관계 데이터 삽입 (quotationCompaniesItems) - 실제 가격 정보
 *
 * 사용법:
 * pnpm tsx src/db/seed-overseas-quotation-data.ts
 */

import { db } from "./index";
import {
  quotationCompanies,
  quotationItems,
  quotationCompaniesItems,
} from "./schema";
import { nanoid } from "nanoid";
import { eq, and } from "drizzle-orm";

async function seedOverseasQuotationData() {
  console.log("🌱 해외 견적 데이터 시딩 시작...");

  try {
    // 1. 해외 회사 데이터 정의 (실제 엑셀 헤더 기반)
    const companiesData = [
      { name: "하아팜", type: "arrival" },
      { name: "랑카", type: "arrival" },
    ];

    // 2. 품목 데이터 정의 (실제 엑셀 행 기반)
    const itemsData = [
      {
        name: "브라운렌틸",
        origin: "카나다",
        nameEn: "Brown Lentil",
        originEn: "Canada",
      },
      {
        name: "브라운렌틸",
        origin: "미국",
        nameEn: "Brown Lentil",
        originEn: "USA",
      },
      {
        name: "브라운렌틸",
        origin: "호주",
        nameEn: "Brown Lentil",
        originEn: "Australia",
      },
      {
        name: "블랙렌틸",
        origin: "카나다",
        nameEn: "Black Lentil",
        originEn: "Canada",
      },
      {
        name: "블랙렌틸",
        origin: "호주",
        nameEn: "Black Lentil",
        originEn: "Australia",
      },
      {
        name: "동부콩",
        origin: "미얀마",
        nameEn: "Black Eye Bean",
        originEn: "Myanmar",
      },
      {
        name: "깐동부",
        origin: "미얀마",
        nameEn: "Peeled Black Eye Bean",
        originEn: "Myanmar",
      },
      {
        name: "검정강낭콩",
        origin: "카나다",
        nameEn: "Black Kidney Bean",
        originEn: "Canada",
      },
      {
        name: "짜나달",
        origin: "호주",
        nameEn: "Chana Dal",
        originEn: "Australia",
      },
      {
        name: "호라산밀",
        origin: "터키",
        nameEn: "Khorasan Wheat",
        originEn: "Turkey",
      },
      {
        name: "파로밀",
        origin: "터키",
        nameEn: "Farro Wheat",
        originEn: "Turkey",
      },
      {
        name: "파로밀",
        origin: "카나다",
        nameEn: "Farro Wheat",
        originEn: "Canada",
      },
      { name: "녹두", origin: "페루", nameEn: "Mung Bean", originEn: "Peru" },
      {
        name: "깐녹두",
        origin: "페루",
        nameEn: "Peeled Mung Bean",
        originEn: "Peru",
      },
      { name: "팥", origin: "페루", nameEn: "Red Bean", originEn: "Peru" },
      { name: "완두", origin: "미국", nameEn: "Green Pea", originEn: "USA" },
      {
        name: "완두",
        origin: "카나다",
        nameEn: "Green Pea",
        originEn: "Canada",
      },
      {
        name: "완두반태",
        origin: "카나다",
        nameEn: "Split Green Pea",
        originEn: "Canada",
      },
      {
        name: "루핀씨드",
        origin: "호주",
        nameEn: "Lupin Seed",
        originEn: "Australia",
      },
      {
        name: "내비빈",
        origin: "카나다",
        nameEn: "Navy Bean",
        originEn: "Canada",
      },
      { name: "귀리", origin: "카나다", nameEn: "Oat", originEn: "Canada" },
      {
        name: "Faba",
        origin: "호주",
        nameEn: "Faba Bean",
        originEn: "Australia",
      },
      {
        name: "레드강낭콩",
        origin: "미얀마",
        nameEn: "Red Kidney Bean",
        originEn: "Myanmar",
      },
      {
        name: "레드렌틸",
        origin: "카나다",
        nameEn: "Red Lentil",
        originEn: "Canada",
      },
      {
        name: "매화콩",
        origin: "중국",
        nameEn: "Plum Bean",
        originEn: "China",
      },
      {
        name: "치아씨드",
        origin: "파라과이",
        nameEn: "Chia Seed",
        originEn: "Paraguay",
      },
      { name: "기장", origin: "미국", nameEn: "Millet", originEn: "USA" },
      { name: "밀쌀", origin: "미국", nameEn: "Wheat Rice", originEn: "USA" },
      {
        name: "밀쌀",
        origin: "국내산",
        nameEn: "Wheat Rice",
        originEn: "Korea",
      },
      {
        name: "서리태",
        origin: "국내산",
        nameEn: "Black Soybean",
        originEn: "Korea",
      },
      { name: "수수", origin: "중국", nameEn: "Sorghum", originEn: "China" },
    ];

    // 3. 실제 가격 데이터 매핑 (품목-회사별)
    const priceData: Record<string, Record<string, number | null>> = {
      "브라운렌틸-카나다": {
        하아팜: 1600,
        랑카: 1550,
      },
      "브라운렌틸-미국": {
        하아팜: 1750,
        랑카: 1750,
      },
      "브라운렌틸-호주": {},
      "블랙렌틸-카나다": {
        하아팜: 1500,
        랑카: 1450,
      },
      "블랙렌틸-호주": {},
      "동부콩-미얀마": {
        하아팜: 2750,
        랑카: 2750,
      },
      "깐동부-미얀마": {
        하아팜: 2000,
        랑카: 1950,
      },
      "검정강낭콩-카나다": {
        하아팜: 2100,
        랑카: 2050,
      },
      "짜나달-호주": {
        하아팜: 2200,
        랑카: 2200,
      },
      "호라산밀-터키": {
        하아팜: 1800,
        랑카: 1750,
      },
      "파로밀-터키": {
        하아팜: 1650,
        랑카: 1550,
      },
      "파로밀-카나다": {
        하아팜: 5200,
      },
      "녹두-페루": {
        하아팜: 5500,
        랑카: 5300,
      },
      "깐녹두-페루": {
        하아팜: 3600,
        랑카: 3600,
      },
      "팥-페루": {
        하아팜: 4000,
        랑카: 3800,
      },
      "완두-미국": {
        하아팜: 3700,
        랑카: 3650,
      },
      "완두-카나다": {
        하아팜: 1300,
        랑카: 1250,
      },
      "완두반태-카나다": {
        하아팜: 1200,
        랑카: 1200,
      },
      "루핀씨드-호주": {
        하아팜: 1400,
        랑카: 1350,
      },
      "내비빈-카나다": {
        하아팜: 3800,
      },
      "귀리-카나다": {
        하아팜: 2200,
        랑카: 2200,
      },
      "Faba-호주": {
        하아팜: 1050,
        랑카: 1000,
      },
      "레드강낭콩-미얀마": {
        하아팜: 300,
        랑카: 300,
      },
      "레드렌틸-카나다": {
        하아팜: 2600,
        랑카: 2550,
      },
      "매화콩-중국": {
        하아팜: 1750,
        랑카: 1750,
      },
      "치아씨드-파라과이": {
        하아팜: 4000,
        랑카: 3800,
      },
      "기장-미국": {
        하아팜: 5000,
        랑카: 5000,
      },
      "밀쌀-미국": {
        하아팜: 1250,
        랑카: 1200,
      },
      "밀쌀-국내산": {
        하아팜: 1350,
      },
      "서리태-국내산": {
        하아팜: 1600,
      },
      "수수-중국": {
        하아팜: 9500,
      },
    };

    // 4. 해외 회사 데이터 삽입
    console.log("📊 해외 회사 데이터 삽입 중...");
    const insertedCompanies: { id: string; name: string; type: string }[] = [];

    for (const company of companiesData) {
      const companyId = nanoid();
      await db.insert(quotationCompanies).values({
        id: companyId,
        companyName: company.name,
        companyType: "foreign", // 해외 회사로 설정
        priceType: company.type as "arrival" | "loading",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      insertedCompanies.push({
        id: companyId,
        name: company.name,
        type: company.type,
      });
    }

    // 5. 품목 데이터 삽입 (기존에 없는 품목만)
    console.log("📦 품목 데이터 확인 및 삽입 중...");
    const insertedItems: { id: string; key: string }[] = [];

    for (const item of itemsData) {
      const itemKey = `${item.name}-${item.origin}`;

      // 기존에 동일한 품목이 있는지 확인
      const existingItems = await db
        .select()
        .from(quotationItems)
        .where(
          and(
            eq(quotationItems.itemName, item.name),
            eq(quotationItems.itemOrigin, item.origin),
          ),
        );

      let itemId: string;

      if (existingItems.length > 0) {
        // 기존 품목이 있으면 해당 ID 사용
        itemId = existingItems[0].id;
        console.log(`📦 기존 품목 사용: ${itemKey}`);
      } else {
        // 새로운 품목 삽입
        itemId = nanoid();
        await db.insert(quotationItems).values({
          id: itemId,
          itemName: item.name,
          itemOrigin: item.origin,
          itemNameEn: item.nameEn,
          itemOriginEn: item.originEn,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
        console.log(`📦 새 품목 생성: ${itemKey}`);
      }

      insertedItems.push({
        id: itemId,
        key: itemKey,
      });
    }

    // 6. 회사-품목 관계 데이터 삽입
    console.log("🔗 해외 회사-품목 관계 데이터 삽입 중...");
    let relationCount = 0;

    for (const item of insertedItems) {
      const itemPrices = priceData[item.key] || {};

      for (const company of insertedCompanies) {
        const price = itemPrices[company.name] || null;

        await db.insert(quotationCompaniesItems).values({
          id: nanoid(),
          companyId: company.id,
          itemId: item.id,
          value: price,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });

        relationCount++;
      }
    }

    console.log("✅ 해외 견적 데이터 시딩 완료!");
    console.log(`📊 해외 회사: ${companiesData.length}개`);
    console.log(`📦 품목: ${itemsData.length}개`);
    console.log(`🔗 관계: ${relationCount}개`);

    // 가격이 있는 관계 수 계산
    const priceCount = Object.values(priceData).reduce((total, prices) => {
      return total + Object.keys(prices).length;
    }, 0);
    console.log(`💰 실제 가격 데이터: ${priceCount}개`);
  } catch (error) {
    console.error("❌ 시딩 중 오류 발생:", error);
    throw error;
  }
}

// 스크립트 직접 실행
seedOverseasQuotationData()
  .then(() => {
    console.log("🎉 해외 견적 데이터 시딩 완료!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("💥 해외 견적 데이터 시딩 실패:", error);
    process.exit(1);
  });

export { seedOverseasQuotationData };
