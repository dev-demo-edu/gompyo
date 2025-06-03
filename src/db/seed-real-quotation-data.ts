/**
 * @file seed-real-quotation-data.ts
 * @description 실제 견적 엑셀 데이터를 기반으로 한 샘플 데이터 삽입 스크립트
 *
 * 이 파일은 실제 견적서의 품목(원산지) × 회사(도착/상차) 형태의 엑셀 데이터를
 * 관계형 데이터베이스에 정규화하여 저장하는 샘플 데이터를 생성합니다.
 *
 * 주요 기능:
 * 1. 회사 데이터 삽입 (quotationCompanies) - 도착/상차 타입별
 * 2. 품목 데이터 삽입 (quotationItems) - 품목명과 원산지 조합
 * 3. 회사-품목 관계 데이터 삽입 (quotationCompaniesItems) - 실제 가격 정보
 *
 * 사용법:
 * pnpm tsx src/db/seed-real-quotation-data.ts
 */

import { db } from "./index";
import {
  quotationCompanies,
  quotationItems,
  quotationCompaniesItems,
} from "./schema";
import { nanoid } from "nanoid";

async function seedRealQuotationData() {
  console.log("🌱 실제 견적 데이터 시딩 시작...");

  try {
    // 1. 회사 데이터 정의 (실제 엑셀 헤더 기반)
    const companiesData = [
      { name: "한끼", type: "arrival" },
      { name: "온새", type: "arrival" },
      { name: "수인", type: "arrival" },
      { name: "라이스그린", type: "arrival" },
      { name: "현대", type: "arrival" },
      { name: "대한", type: "arrival" },
      { name: "김포", type: "arrival" },
      { name: "햇살", type: "arrival" },
      { name: "현경택", type: "loading" }, // 상차
      { name: "혜안", type: "arrival" },
      { name: "태평", type: "arrival" },
      { name: "티엘", type: "arrival" },
      { name: "바우와우", type: "arrival" },
      { name: "나무", type: "arrival" },
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
      { name: "홍밀", origin: "미국", nameEn: "Red Wheat", originEn: "USA" },
    ];

    // 3. 실제 가격 데이터 매핑 (품목-회사별)
    const priceData: Record<string, Record<string, number | null>> = {
      "브라운렌틸-카나다": {
        한끼: 1600,
        온새: 1550,
        수인: 1500,
        라이스그린: 1550,
        현대: 1500,
        대한: 1600,
        김포: 1500,
        햇살: 1550,
        현경택: 1500,
        혜안: 1550,
        태평: 1600,
        티엘: 1550,
        나무: 1800,
      },
      "브라운렌틸-미국": {
        한끼: 1750,
        라이스그린: 1650,
        현대: 1750,
      },
      "브라운렌틸-호주": {},
      "블랙렌틸-카나다": {
        한끼: 2750,
        온새: 2750,
        수인: 2750,
        라이스그린: 2730,
        현대: 2750,
        대한: 2750,
        김포: 2700,
        햇살: 2750,
        현경택: 2750,
        혜안: 2750,
        태평: 2800,
        티엘: 2750,
        나무: 3100,
      },
      "블랙렌틸-호주": {},
      "동부콩-미얀마": {
        한끼: 2000,
        온새: 1950,
        수인: 2000,
        현대: 2000,
        대한: 2000,
        김포: 2100,
        햇살: 2050,
        현경택: 2050,
        혜안: 2100,
        태평: 2000,
      },
      "깐동부-미얀마": {
        한끼: 2100,
        온새: 2050,
        수인: 2050,
        현대: 2100,
        대한: 2050,
        김포: 2100,
        햇살: 2050,
        현경택: 2050,
        혜안: 2100,
        태평: 2050,
      },
      "검정강낭콩-카나다": {
        한끼: 2200,
        온새: 2200,
        수인: 2100,
        라이스그린: 2100,
        현대: 2100,
        대한: 2200,
        김포: 2100,
        햇살: 2200,
        현경택: 2100,
        혜안: 2100,
        태평: 2300,
        티엘: 2100,
        나무: 2300,
      },
      "짜나달-호주": {
        한끼: 1800,
        온새: 1750,
        라이스그린: 1750,
        현대: 1750,
        대한: 1750,
        김포: 1750,
        현경택: 1750,
        혜안: 1850,
        태평: 1750,
        티엘: 1800,
        나무: 2000,
      },
      "호라산밀-터키": {
        한끼: 1650,
        온새: 1550,
        수인: 1600,
        현대: 1550,
        대한: 1600,
        김포: 1500,
        햇살: 1600,
        현경택: 1500,
        혜안: 1550,
        태평: 1650,
        티엘: 1550,
        나무: 1800,
      },
      "파로밀-터키": {
        한끼: 4700,
        수인: 4800,
        라이스그린: 4500,
        현대: 4200,
        대한: 4900,
        김포: 4200,
        햇살: 4800,
        현경택: 4600,
        혜안: 4900,
        태평: 4900,
        티엘: 4600,
        나무: 5200,
      },
      "파로밀-카나다": {
        한끼: 5400,
        온새: 5300,
        현대: 5300,
        김포: 4900,
        햇살: 5000,
        현경택: 5200,
        혜안: 5500,
        태평: 5000,
      },
      "녹두-페루": {
        한끼: 3600,
        온새: 3600,
        현대: 3600,
        김포: 3600,
        햇살: 3600,
        현경택: 3600,
        혜안: 3800,
        나무: 4100,
      },
      "깐녹두-페루": {
        한끼: 4000,
        온새: 4000,
        김포: 4000,
        햇살: 3800,
        현경택: 3800,
        혜안: 4200,
        나무: 4300,
      },
      "팥-페루": {
        한끼: 3700,
        온새: 3700,
        수인: 3500,
        현대: 3500,
        대한: 3700,
        햇살: 3700,
        현경택: 3700,
        혜안: 3600,
        태평: 3800,
        티엘: 3700,
      },
      "완두-미국": {
        한끼: 1300,
        온새: 1250,
        수인: 1200,
        라이스그린: 1200,
        김포: 1250,
        현경택: 1250,
        혜안: 1250,
      },
      "완두-카나다": {
        한끼: 1250,
        온새: 1200,
        라이스그린: 1200,
        현대: 1250,
        김포: 1200,
        햇살: 1250,
        혜안: 1300,
        태평: 1200,
        티엘: 1200,
      },
      "완두반태-카나다": {
        한끼: 1400,
        온새: 1350,
        라이스그린: 1350,
        현대: 1350,
        대한: 1400,
        김포: 1350,
        현경택: 1350,
        혜안: 1350,
        태평: 1450,
        티엘: 1350,
      },
      "루핀씨드-호주": {
        한끼: 3800,
        온새: 3800,
        수인: 3900,
        라이스그린: 3500,
        현대: 3500,
        햇살: 42000,
        현경택: 3500,
        혜안: 3500,
        태평: 3600,
        티엘: 3500,
        나무: 4800,
      },
      "내비빈-카나다": {
        한끼: 2200,
        온새: 2200,
        수인: 2200,
        라이스그린: 2200,
        현대: 2100,
        대한: 2200,
        김포: 2100,
        햇살: 2100,
        현경택: 2200,
        혜안: 2200,
        태평: 2300,
        티엘: 2100,
      },
      "귀리-카나다": {
        한끼: 1050,
        온새: 920,
        수인: 1050,
        라이스그린: 980,
        현대: 920,
        대한: 1010,
        김포: 970,
        햇살: 1050,
        현경택: 1050,
        혜안: 1050,
        태평: 1050,
        티엘: 980,
        바우와우: 1050,
      },
      "Faba-호주": {
        한끼: 300,
        온새: 300,
        라이스그린: 300,
        현대: 300,
        대한: 300,
        김포: 300,
        햇살: 300,
        현경택: 300,
        태평: 300,
        티엘: 300,
      },
      "레드강낭콩-미얀마": {
        한끼: 2600,
        온새: 2550,
        수인: 2500,
        라이스그린: 2600,
        현대: 2600,
        대한: 2650,
        김포: 2500,
        햇살: 2600,
        현경택: 2650,
        혜안: 2500,
        태평: 2700,
        티엘: 2600,
        나무: 3000,
      },
      "레드렌틸-카나다": {
        한끼: 1750,
        온새: 1750,
        수인: 1750,
        라이스그린: 1750,
        현대: 1750,
        대한: 1750,
        김포: 1750,
        햇살: 1750,
        현경택: 1750,
        혜안: 1750,
        태평: 1850,
        티엘: 1750,
        나무: 1850,
      },
      "매화콩-중국": {
        한끼: 4000,
        온새: 3800,
      },
      "치아씨드-파라과이": {
        한끼: 5000,
        온새: 5000,
        수인: 4500,
        라이스그린: 4000,
        현대: 4000,
        햇살: 5000,
        현경택: 5000,
        혜안: 4300,
        태평: 5000,
        티엘: 4800,
        나무: 5200,
      },
      "기장-미국": {
        한끼: 1200,
        온새: 1150,
        수인: 1200,
        라이스그린: 1200,
        대한: 1300,
        김포: 1250,
        햇살: 1200,
        현경택: 1300,
        혜안: 1200,
        태평: 1350,
        티엘: 1250,
        나무: 1400,
      },
      "밀쌀-미국": {
        한끼: 900,
        온새: 750,
        라이스그린: 800,
        대한: 800,
        김포: 780,
        현경택: 800,
        혜안: 800,
        태평: 900,
        티엘: 800,
        바우와우: 800,
      },
      "밀쌀-국내산": {
        한끼: 1600,
        온새: 1450,
        현경택: 1600,
        혜안: 1600,
      },
      "서리태-국내산": {
        한끼: 9500,
        태평: 9500,
      },
      "수수-중국": {
        한끼: 1700,
      },
      "홍밀-미국": {
        라이스그린: 820,
        대한: 750,
        햇살: 850,
        현경택: 750,
        혜안: 800,
      },
    };

    // 4. 회사 데이터 삽입
    console.log("📊 회사 데이터 삽입 중...");
    const insertedCompanies: { id: string; name: string; type: string }[] = [];

    for (const company of companiesData) {
      const companyId = nanoid();
      await db.insert(quotationCompanies).values({
        id: companyId,
        companyName: company.name,
        companyType: "domestic", // 모든 회사를 국내로 설정
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

    // 5. 품목 데이터 삽입
    console.log("📦 품목 데이터 삽입 중...");
    const insertedItems: { id: string; key: string }[] = [];

    for (const item of itemsData) {
      const itemId = nanoid();
      const itemKey = `${item.name}-${item.origin}`;

      await db.insert(quotationItems).values({
        id: itemId,
        itemName: item.name,
        itemOrigin: item.origin,
        itemNameEn: item.nameEn,
        itemOriginEn: item.originEn,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      insertedItems.push({
        id: itemId,
        key: itemKey,
      });
    }

    // 6. 회사-품목 관계 데이터 삽입
    console.log("🔗 회사-품목 관계 데이터 삽입 중...");
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

    console.log("✅ 실제 견적 데이터 시딩 완료!");
    console.log(`📊 회사: ${companiesData.length}개`);
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
seedRealQuotationData()
  .then(() => {
    console.log("🎉 실제 견적 데이터 시딩 완료!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("💥 실제 견적 데이터 시딩 실패:", error);
    process.exit(1);
  });

export { seedRealQuotationData };
