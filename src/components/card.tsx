// PlanMobileCard.tsx
import React from "react";
import CommonButton from "./common-button";
import Link from "next/link";

interface PlanMobileCardProps {
  id: string;
  contractNo: string;
  importer: string;
  contractDate: string;
  item: string;
}

export default function PlanMobileCard({
  id,
  contractNo,
  importer,
  contractDate,
  item,
}: PlanMobileCardProps) {
  return (
    <div className="rounded-xl border border-gray-300 bg-white p-4 mb-3 shadow-sm flex flex-col">
      <div className="font-semibold text-gray-800 mb-1">
        계약번호: {contractNo}
      </div>
      <div className="flex justify-between">
        <div className="flex flex-col">
          <div className="text-sm text-gray-600 ">수입회사: {importer}</div>
          <div className="text-sm text-gray-600 ">계약일자: {contractDate}</div>
          <div className="text-sm text-gray-600 ">품목명: {item}</div>
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
