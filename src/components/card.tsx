import React from "react";
import Link from "next/link";
import CommonButton from "./common-button";

// 카드에 표시할 필드 정의
interface CardField {
  label: string;
  value: string | number;
}

// 선택 가능한 아이템의 최소 요구사항
interface SelectableItem {
  id: string;
}

interface CommonCardProps<T extends SelectableItem> {
  id: string;
  title: string; // 카드 제목 (예: "계약번호: CONTRACT-001")
  fields: CardField[]; // 표시할 필드들
  isSelected: boolean;
  onSelect: (rowData: T) => void;
  rowData: T;
  detailHref?: string; // 상세 페이지 링크 (선택사항)
  detailButtonText?: string; // 버튼 텍스트 커스텀
}

export default function CommonCard<T extends SelectableItem>({
  title,
  fields,
  isSelected,
  onSelect,
  rowData,
  detailHref,
  detailButtonText = "상세보기",
}: CommonCardProps<T>) {
  const handleCardClick = (e: React.MouseEvent) => {
    // 상세보기 버튼 클릭은 제외
    if ((e.target as HTMLElement).closest("a")) {
      return;
    }
    onSelect(rowData);
  };

  return (
    <div
      className={`rounded-xl border p-4 mb-3 shadow-sm flex flex-col cursor-pointer transition-all duration-200 ${
        isSelected
          ? "border-[#22C55E] bg-[#22C55E]/10"
          : "border-gray-300 bg-white hover:border-gray-400"
      }`}
      onClick={handleCardClick}
    >
      {/* 체크박스와 제목 */}
      <div className="flex items-center mb-1">
        <input
          type="checkbox"
          hidden={true}
          checked={isSelected}
          onChange={() => onSelect(rowData)}
          className="mr-3 h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
          onClick={(e) => e.stopPropagation()}
        />
        <div className="font-semibold text-gray-800">{title}</div>
      </div>

      <div className="flex justify-between">
        <div className="flex flex-col">
          {fields.map((field) => (
            <div key={field.label} className="text-sm text-gray-600">
              {field.label}: {field.value}
            </div>
          ))}
        </div>

        {detailHref && (
          <div className="flex justify-end items-end">
            <Link href={detailHref}>
              <CommonButton variant="primary">{detailButtonText}</CommonButton>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
