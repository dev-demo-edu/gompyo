"use server";

import { ImporterService } from "@/services/importer.service";
import { Importer, CalculationType } from "@/types/importer";

/**
 * 모든 수입업체 목록을 가져옵니다.
 */
export async function getAllImporters(): Promise<Importer[]> {
  try {
    const importers = await ImporterService.getAllImporters();
    return importers.map((importer) => ({
      ...importer,
      calculationType: importer.calculationType as CalculationType,
    }));
  } catch (error) {
    console.error("수입업체 목록 조회 오류:", error);
    return [];
  }
}

/**
 * 입력한 이름으로 수입업체를 검색합니다.
 */
export async function searchImportersByName(name: string): Promise<Importer[]> {
  try {
    const importers = await ImporterService.searchImportersByName(name);
    return importers.map((importer) => ({
      ...importer,
      calculationType: importer.calculationType as CalculationType,
    }));
  } catch (error) {
    console.error("수입업체 검색 오류:", error);
    return [];
  }
}

/**
 * 새로운 수입업체를 생성합니다.
 */
export async function createImporter(
  name: string,
  calculationType: CalculationType = CalculationType.STANDARD,
): Promise<Importer | null> {
  try {
    const importer = await ImporterService.createImporter(
      name,
      calculationType,
    );
    if (!importer) return null;

    return {
      ...importer,
      calculationType: importer.calculationType as CalculationType,
    };
  } catch (error) {
    console.error("수입업체 생성 오류:", error);
    return null;
  }
}

/**
 * 수입업체 정보를 업데이트합니다.
 */
export async function updateImporter(
  id: string,
  data: Partial<Omit<Importer, "id">>,
): Promise<Importer | null> {
  try {
    const importer = await ImporterService.updateImporter(id, data);
    if (!importer) return null;

    return {
      ...importer,
      calculationType: importer.calculationType as CalculationType,
    };
  } catch (error) {
    console.error("수입업체 업데이트 오류:", error);
    return null;
  }
}

/**
 * 수입업체를 삭제합니다.
 */
export async function deleteImporter(id: string): Promise<boolean> {
  try {
    const result = await ImporterService.deleteImporter(id);
    return !!result;
  } catch (error) {
    console.error("수입업체 삭제 오류:", error);
    return false;
  }
}
