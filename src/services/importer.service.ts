import { db } from "@/db";
import { importers } from "@/db/schema";
import { nanoid } from "nanoid";
import { Importer, CalculationType } from "@/types/importer";
import { eq, like } from "drizzle-orm";

export class ImporterService {
  /**
   * 새로운 수입업체를 생성합니다.
   */
  async createImporter(name: string, calculationType: CalculationType) {
    try {
      const [importer] = await db
        .insert(importers)
        .values({
          id: nanoid(),
          name,
          calculationType,
        })
        .returning();

      return {
        ...importer,
      };
    } catch (error) {
      console.error("수입업체 생성 중 오류:", error);
      throw new Error(
        `수입업체 생성 실패: ${error instanceof Error ? error.message : "알 수 없는 오류"}`,
      );
    }
  }

  /**
   * 모든 수입업체를 조회합니다.
   */
  async getAllImporters() {
    try {
      const result = await db.query.importers.findMany();
      return result.map((importer) => ({
        ...importer,
      }));
    } catch (error) {
      console.error("수입업체 조회 중 오류:", error);
      throw new Error(
        `수입업체 조회 실패: ${error instanceof Error ? error.message : "알 수 없는 오류"}`,
      );
    }
  }

  /**
   * ID로 수입업체를 조회합니다.
   */
  async getImporterById(id: string) {
    try {
      const importer = await db.query.importers.findFirst({
        where: eq(importers.id, id),
      });

      if (!importer) {
        throw new Error("수입업체를 찾을 수 없습니다.");
      }

      return {
        ...importer,
      };
    } catch (error) {
      console.error("수입업체 조회 중 오류:", error);
      throw new Error(
        `수입업체 조회 실패: ${error instanceof Error ? error.message : "알 수 없는 오류"}`,
      );
    }
  }

  /**
   * 수입업체 정보를 업데이트합니다.
   */
  async updateImporter(id: string, data: Partial<Omit<Importer, "id">>) {
    try {
      const [importer] = await db
        .update(importers)
        .set({
          ...data,
        })
        .where(eq(importers.id, id))
        .returning();

      if (!importer) {
        throw new Error("수입업체를 찾을 수 없습니다.");
      }

      return {
        ...importer,
      };
    } catch (error) {
      console.error("수입업체 업데이트 중 오류:", error);
      throw new Error(
        `수입업체 업데이트 실패: ${error instanceof Error ? error.message : "알 수 없는 오류"}`,
      );
    }
  }

  /**
   * 수입업체를 삭제합니다.
   */
  async deleteImporter(id: string) {
    try {
      const [importer] = await db
        .delete(importers)
        .where(eq(importers.id, id))
        .returning();

      if (!importer) {
        throw new Error("수입업체를 찾을 수 없습니다.");
      }

      return {
        ...importer,
      };
    } catch (error) {
      console.error("수입업체 삭제 중 오류:", error);
      throw new Error(
        `수입업체 삭제 실패: ${error instanceof Error ? error.message : "알 수 없는 오류"}`,
      );
    }
  }

  /**
   * 이름으로 수입업체를 검색합니다.
   */
  async searchImportersByName(name: string) {
    try {
      const result = await db.query.importers.findMany({
        where: like(importers.name, `%${name}%`),
      });
      return result.map((importer) => ({
        ...importer,
      }));
    } catch (error) {
      console.error("수입업체 검색 중 오류:", error);
      throw new Error(
        `수입업체 검색 실패: ${error instanceof Error ? error.message : "알 수 없는 오류"}`,
      );
    }
  }
}
