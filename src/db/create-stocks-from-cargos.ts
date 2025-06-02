/**
 * @file create-stocks-from-cargos.ts
 * @description 현재 DB의 모든 cargo들을 읽어서 새로운 stock을 생성하는 스크립트
 *
 * 이 스크립트는 기존 cargo 데이터를 기반으로 stock 테이블에 데이터를 생성합니다.
 * 각 cargo의 importer 정보를 기반으로 해당 회사의 미통관 재고로 설정됩니다.
 *
 * 주요 기능:
 * 1. 기존 cargo 데이터 조회 (importer 정보 포함)
 * 2. stock이 없는 cargo들 필터링
 * 3. importer 이름 기반으로 회사별 미통관 재고 설정
 * 4. 배치로 stock 데이터 생성
 *
 * 사용법:
 * pnpm tsx src/db/create-stocks-from-cargos.ts
 */

import { db } from "./index";
import { cargos, stocks } from "./schema";
import { nanoid } from "nanoid";
import { notExists, eq } from "drizzle-orm";

/**
 * importer 이름을 기반으로 회사 타입을 결정하는 함수
 */
function getCompanyTypeFromImporterName(importerName: string): string {
  const name = importerName.toLowerCase();

  if (name.includes("dnb")) return "dnb";
  if (name.includes("namhae") || name.includes("남해")) return "namhae";
  if (name.includes("interliving")) return "interliving";
  if (name.includes("gompyo") || name.includes("곰표")) return "gompyo";
  if (name.includes("ramplus")) return "ramplus";

  // 기본값으로 gompyo 반환
  console.warn(`⚠️ 알 수 없는 importer: ${importerName}, gompyo로 기본 설정`);
  return "gompyo";
}

/**
 * 회사 타입에 따라 stock 객체를 생성하는 함수
 */
function createStockObject(companyType: string, contractTon: number) {
  const baseStock = {
    dnbCleared: 0,
    namhaeCleared: 0,
    interlivingCleared: 0,
    gompyoCleared: 0,
    ramplusCleared: 0,
    dnbUncleared: 0,
    namhaeUncleared: 0,
    interlivingUncleared: 0,
    gompyoUncleared: 0,
    ramplusUncleared: 0,
  };

  // 해당 회사의 미통관 재고에 contractTon 설정
  switch (companyType) {
    case "dnb":
      baseStock.dnbUncleared = contractTon;
      break;
    case "namhae":
      baseStock.namhaeUncleared = contractTon;
      break;
    case "interliving":
      baseStock.interlivingUncleared = contractTon;
      break;
    case "gompyo":
      baseStock.gompyoUncleared = contractTon;
      break;
    case "ramplus":
      baseStock.ramplusUncleared = contractTon;
      break;
    default:
      baseStock.gompyoUncleared = contractTon;
  }

  return baseStock;
}

async function createStocksFromCargos() {
  console.log("🏗️ 기존 cargo들로부터 stock 생성 시작...");

  try {
    // 1. stock이 없는 cargo들을 조회 (importer 정보 포함)
    console.log("📋 stock이 없는 cargo들 조회 중...");

    const cargosWithoutStock = await db.query.cargos.findMany({
      where: notExists(
        db.select().from(stocks).where(eq(stocks.cargoId, cargos.id)),
      ),
      with: {
        shipment: {
          with: {
            contract: {
              with: {
                importer: true,
              },
            },
          },
        },
      },
    });

    console.log(
      `📊 stock이 없는 cargo ${cargosWithoutStock.length}개를 발견했습니다.`,
    );

    if (cargosWithoutStock.length === 0) {
      console.log("✅ 모든 cargo에 이미 stock이 존재합니다.");
      return;
    }

    // 2. stock 데이터 준비
    console.log("🔧 stock 데이터 준비 중...");
    const stocksToCreate = [];
    let skippedCount = 0;

    for (const cargo of cargosWithoutStock) {
      const importer = cargo.shipment?.contract?.importer;

      if (!importer) {
        console.warn(
          `⚠️ Cargo ${cargo.id}에 대한 importer 정보를 찾을 수 없습니다. 건너뜁니다.`,
        );
        skippedCount++;
        continue;
      }

      const companyType = getCompanyTypeFromImporterName(importer.importerName);
      const contractTon = cargo.contractTon || 0;
      const stockData = createStockObject(companyType, contractTon);

      stocksToCreate.push({
        id: nanoid(),
        cargoId: cargo.id,
        ...stockData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      console.log(
        `📦 Cargo ${cargo.id} -> ${importer.importerName} (${companyType}): ${contractTon}톤`,
      );
    }

    // 3. 배치로 stock 생성
    if (stocksToCreate.length > 0) {
      console.log(`💾 ${stocksToCreate.length}개의 stock 데이터 삽입 중...`);

      // 배치 크기를 제한하여 메모리 효율성 향상
      const batchSize = 100;
      for (let i = 0; i < stocksToCreate.length; i += batchSize) {
        const batch = stocksToCreate.slice(i, i + batchSize);
        await db.insert(stocks).values(batch);
        console.log(`   📝 ${i + batch.length}/${stocksToCreate.length} 완료`);
      }
    }

    // 4. 결과 요약
    console.log("\n📊 작업 완료 요약:");
    console.log(`✅ 성공적으로 생성된 stock: ${stocksToCreate.length}개`);
    console.log(`⚠️ 건너뛴 cargo (importer 정보 없음): ${skippedCount}개`);
    console.log(`📋 총 처리된 cargo: ${cargosWithoutStock.length}개`);

    // 5. 회사별 통계
    const companyStats: Record<string, { count: number; totalTon: number }> =
      {};

    for (const stock of stocksToCreate) {
      const companies = ["dnb", "namhae", "interliving", "gompyo", "ramplus"];

      for (const company of companies) {
        const unclearedKey = `${company}Uncleared` as keyof typeof stock;
        const unclearedValue = stock[unclearedKey] as number;

        if (unclearedValue > 0) {
          if (!companyStats[company]) {
            companyStats[company] = { count: 0, totalTon: 0 };
          }
          companyStats[company].count++;
          companyStats[company].totalTon += unclearedValue;
        }
      }
    }

    console.log("\n🏢 회사별 생성된 stock 통계:");
    for (const [company, stats] of Object.entries(companyStats)) {
      console.log(
        `   ${company}: ${stats.count}개 cargo, 총 ${stats.totalTon}톤`,
      );
    }

    console.log("\n🎉 stock 생성 작업이 완료되었습니다!");
  } catch (error) {
    console.error("❌ stock 생성 중 오류 발생:", error);
    throw error;
  }
}

// 스크립트 실행
// if (require.main === module) {
createStocksFromCargos()
  .then(() => {
    console.log("✨ 스크립트 실행 완료");
    process.exit(0);
  })
  .catch((error) => {
    console.error("💥 스크립트 실행 실패:", error);
    process.exit(1);
  });
// }

export { createStocksFromCargos };
