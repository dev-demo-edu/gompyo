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
      const key = `documents/${category}/${relatedId}/${Date.now()}-${file.name}`;

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

    // S3 URL에서 key 추출
    // URL 형식: https://bucket-name.s3.region.amazonaws.com/documents/category/id/timestamp-filename
    const urlParts = document.s3Url.split("/");
    // 도메인 이후부터 key로 사용
    const s3Key = urlParts.slice(3).join("/");

    console.log("삭제할 S3 키:", s3Key);
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

export async function getSignedDownloadUrl(documentId: string) {
  try {
    const [document] = await documentService.getDocumentById(documentId);
    if (!document) {
      return { success: false, error: "문서를 찾을 수 없습니다." };
    }

    const s3Key = `documents/${document.documentCategory}/${document.relatedId}/${document.s3Url.split("/").pop()}`;
    const signedUrl = await documentService.getSignedUrl(s3Key);
    return { success: true, url: signedUrl };
  } catch (error) {
    console.error("다운로드 URL 생성 중 오류 발생:", error);
    return { success: false, error: "다운로드 URL 생성에 실패했습니다." };
  }
}

// presigned URL 요청 서버 액션
export async function getUploadPresignedUrl(
  fileName: string,
  fileType: string,
  relatedId: string,
  category: "contract" | "shipment",
) {
  try {
    const key = `documents/${category}/${relatedId}/${Date.now()}-${fileName}`;
    const url = await documentService.getUploadPresignedUrl(key, fileType);

    return {
      success: true,
      url,
      key,
      fileUrl: `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`,
    };
  } catch (error) {
    console.error("Presigned URL 생성 중 오류:", error);
    return { success: false, error: "Presigned URL 생성에 실패했습니다." };
  }
}

// 문서 메타데이터 저장 서버 액션
export async function saveDocument(documentData: {
  name: string;
  type: string;
  url: string;
  relatedId: string;
  category: "contract" | "shipment";
}) {
  try {
    await documentService.saveDocument(documentData);
    revalidatePath(`/detail/${documentData.relatedId}`);
    return { success: true };
  } catch (error) {
    console.error("문서 정보 저장 중 오류:", error);
    return { success: false, error: "문서 정보 저장에 실패했습니다." };
  }
}
