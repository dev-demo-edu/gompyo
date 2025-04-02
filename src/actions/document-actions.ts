"use server";

import { revalidatePath } from "next/cache";
import { DocumentService } from "@/services/document-service";

const documentService = new DocumentService();

export async function uploadDocuments(
  formData: FormData,
  relatedId: string,
  category: "contract" | "shipment",
) {
  try {
    const files = formData.getAll("files") as File[];

    // 파일 유효성 검사
    if (files.length === 0) {
      return { success: false, error: "업로드할 파일을 선택해주세요." };
    }

    // 파일 크기 및 타입 검사
    for (const file of files) {
      if (file.size > 10 * 1024 * 1024) {
        // 10MB 제한
        return {
          success: false,
          error: "파일 크기는 10MB를 초과할 수 없습니다.",
        };
      }
      // 필요한 추가 유효성 검사...
    }

    const uploadPromises = files.map(async (file) => {
      const key = `documents/${relatedId}/${category}/${Date.now()}-${file.name}`;

      await documentService.uploadToS3(file, key);

      await documentService.saveDocument({
        name: file.name,
        type: file.type,
        url: `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`,
        relatedId,
        category,
      });
    });

    await Promise.all(uploadPromises);
    revalidatePath(`/detail/${relatedId}`);

    const documents = await documentService.getDocuments(relatedId, category);
    return { success: true, documents };
  } catch (error) {
    console.error("문서 업로드 중 오류 발생:", error);
    return { success: false, error: "문서 업로드에 실패했습니다." };
  }
}

export async function deleteDocument(documentId: string, relatedId: string) {
  try {
    const [document] = await documentService.getDocumentById(documentId);
    if (!document) {
      return { success: false, error: "문서를 찾을 수 없습니다." };
    }

    const s3Key = document.s3Url.split(".com/")[1];
    await documentService.deleteFromS3(s3Key);
    await documentService.deleteDocument(documentId);

    revalidatePath(`/detail/${relatedId}`);
    return { success: true };
  } catch (error) {
    console.error("문서 삭제 중 오류 발생:", error);
    return { success: false, error: "문서 삭제에 실패했습니다." };
  }
}

export async function getDocuments(
  relatedId: string,
  category: "contract" | "shipment",
) {
  try {
    const docs = await documentService.getDocuments(relatedId, category);
    return { success: true, documents: docs };
  } catch (error) {
    console.error("문서 목록 조회 중 오류 발생:", error);
    return { success: false, error: "문서 목록 조회에 실패했습니다." };
  }
}
