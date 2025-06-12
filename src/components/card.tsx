// PlanMobileCard.tsx
import React from "react";
import CommonButton from "./common-button";
import Link from "next/link";
import { IPlanData } from "@/types/grid-col";

interface PlanMobileCardProps {
  id: string;
  contractNo: string;
  importer: string;
  contractDate: string;
  item: string;
  isSelected: boolean;
  onSelect: (rowData: IPlanData) => void;
  rowData: IPlanData;
}

export default function PlanMobileCard({
  id,
  contractNo,
  importer,
  contractDate,
  item,
  isSelected,
  onSelect,
  rowData,
}: PlanMobileCardProps) {
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
      {/* 체크박스와 계약번호 */}
      <div className="flex items-center mb-1">
        <input
          type="checkbox"
          hidden={true}
          checked={isSelected}
          onChange={() => onSelect(rowData)}
          className="mr-3 h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
          onClick={(e) => e.stopPropagation()}
        />
        <div className="font-semibold text-gray-800">
          계약번호: {contractNo}
        </div>
      </div>

      <div className="flex justify-between">
        <div className="flex flex-col">
          <div className="text-sm text-gray-600">수입회사: {importer}</div>
          <div className="text-sm text-gray-600">계약일자: {contractDate}</div>
          <div className="text-sm text-gray-600">품목명: {item}</div>
        </div>
        <div className="flex justify-end items-end">
          <Link href={`/detail/${id}`}>
            <CommonButton variant="primary">상세보기</CommonButton>
          </Link>
        </div>
      </div>
    </div>
  );
}
