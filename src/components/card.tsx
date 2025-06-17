import React, { useState, useRef, useEffect } from "react";
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

  // 📌 순서 조정 관련 선택적 props 추가
  showOrderControls?: boolean;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  canMoveUp?: boolean;
  canMoveDown?: boolean;
}

export default function CommonCard<T extends SelectableItem>({
  title,
  fields,
  isSelected,
  onSelect,
  rowData,
  detailHref,
  detailButtonText = "상세보기",
  showOrderControls = false,
  onMoveUp,
  onMoveDown,
  canMoveUp = true,
  canMoveDown = true,
}: CommonCardProps<T>) {
  const [showOrderMenu, setShowOrderMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // 메뉴 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowOrderMenu(false);
      }
    };

    if (showOrderMenu) {
      document.addEventListener("mousedown", handleClickOutside);
      // 3초 후 자동으로 닫기
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showOrderMenu]);

  const handleCardClick = (e: React.MouseEvent) => {
    // 상세보기 버튼이나 순서 조정 관련 요소 클릭은 제외
    if (
      (e.target as HTMLElement).closest("a") ||
      (e.target as HTMLElement).closest(".order-controls")
    ) {
      return;
    }
    onSelect(rowData);
  };

  const handleHamburgerClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowOrderMenu(!showOrderMenu);
  };

  const handleMoveUp = (e: React.MouseEvent) => {
    e.stopPropagation();
    onMoveUp?.();
    setShowOrderMenu(false);
  };

  const handleMoveDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    onMoveDown?.();
    setShowOrderMenu(false);
  };

  return (
    <div
      className={`rounded-xl border p-4 mb-3 shadow-sm flex flex-col cursor-pointer transition-all duration-200 relative ${
        isSelected
          ? "border-[#22C55E] bg-[#22C55E]/10"
          : "border-gray-300 bg-white hover:border-gray-400"
      }`}
      onClick={handleCardClick}
    >
      {/* 체크박스와 제목, 햄버거 메뉴 */}
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center">
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

        {/* 📌 햄버거 메뉴 버튼 */}
        {showOrderControls && (
          <div className="order-controls relative" ref={menuRef}>
            <button
              onClick={handleHamburgerClick}
              className="p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
              title="순서 조정"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="5" r="1"></circle>
                <circle cx="12" cy="12" r="1"></circle>
                <circle cx="12" cy="19" r="1"></circle>
              </svg>
            </button>

            {/* 📌 순서 조정 메뉴 */}
            {showOrderMenu && (
              <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[130px]">
                <button
                  onClick={handleMoveUp}
                  disabled={!canMoveUp}
                  className={`w-full px-4 py-3 text-left text-sm border-b border-gray-100 flex items-center gap-2 transition-colors ${
                    canMoveUp
                      ? "text-gray-700 hover:bg-gray-50 active:bg-gray-100"
                      : "text-gray-300 cursor-not-allowed"
                  }`}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="18,15 12,9 6,15"></polyline>
                  </svg>
                  위로 이동
                </button>
                <button
                  onClick={handleMoveDown}
                  disabled={!canMoveDown}
                  className={`w-full px-4 py-3 text-left text-sm flex items-center gap-2 transition-colors ${
                    canMoveDown
                      ? "text-gray-700 hover:bg-gray-50 active:bg-gray-100"
                      : "text-gray-300 cursor-not-allowed"
                  }`}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="6,9 12,15 18,9"></polyline>
                  </svg>
                  아래로 이동
                </button>
              </div>
            )}
          </div>
        )}
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
