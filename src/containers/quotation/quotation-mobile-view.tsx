import React, { useCallback } from "react";
import {
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Stack,
} from "@mui/material";
import CommonCard from "@/components/card";
import CommonButton from "@/components/common-button";
import { ColumnCompany } from "./quotation";
import { QuotationItem } from "@/services/quotation-service";

interface QuotationMobileViewProps {
  companies: ColumnCompany[];
  items: QuotationItem[];
  priceData: Record<string, Record<string, number>>;
  formatNumber: (num: number) => string;
  getIntersectionItems: () => Array<{
    productCode: string;
    productName: string;
    company: string;
    priceType: string;
    price: number;
    origin: string;
    originEn: string;
    productNameEn: string;
  }>;
  // 모바일 상태들
  selectedCompany: ColumnCompany | null;
  selectedColumns: Record<string, boolean>;
  selectedColumnsForManagement: Record<string, boolean>;
  onCompanySelect: (company: ColumnCompany) => void;
  onItemSelect: (itemId: string) => void;
  // 모달 열기 핸들러들
  onCompanyModalOpen: () => void;
  onItemModalOpen: () => void;
  onCompanyEditModalOpen: () => void;
  onItemEditModalOpen: () => void;
  onCompanyDeleteModalOpen: () => void;
  onItemDeleteModalOpen: () => void;
  onQuotationDocumentModalOpen: () => void;
  onPriceEditModalOpen: (itemData: {
    itemId: string;
    itemName: string;
    currentPrice: number;
  }) => void;
}

export default function QuotationMobileView({
  companies,
  items,
  priceData,
  formatNumber,
  getIntersectionItems,
  selectedCompany,
  selectedColumns,
  selectedColumnsForManagement,
  onCompanySelect,
  onItemSelect,
  onCompanyModalOpen,
  onItemModalOpen,
  onCompanyEditModalOpen,
  onItemEditModalOpen,
  onCompanyDeleteModalOpen,
  onItemDeleteModalOpen,
  onQuotationDocumentModalOpen,
  onPriceEditModalOpen,
}: QuotationMobileViewProps) {
  // 모바일 회사 선택 핸들러
  const handleCompanySelect = useCallback(
    (company: ColumnCompany) => {
      onCompanySelect(company);
    },
    [onCompanySelect],
  );

  // 모바일 품목 선택 핸들러
  const handleItemSelect = useCallback(
    (itemId: string) => {
      onItemSelect(itemId);
    },
    [onItemSelect],
  );

  // 가격 수정 모달 열기 핸들러
  const handleOpenPriceEditModal = useCallback(() => {
    const selectedItemIds = Object.keys(selectedColumns).filter(
      (k) => selectedColumns[k],
    );
    const itemId = selectedItemIds[0];
    const item = items.find((i) => i.id === itemId);
    const currentPrice = priceData[selectedCompany!.id]?.[itemId] || 0;

    onPriceEditModalOpen({
      itemId,
      itemName: `${item?.itemName} (${item?.itemOrigin})`,
      currentPrice,
    });
  }, [
    selectedColumns,
    items,
    priceData,
    selectedCompany,
    onPriceEditModalOpen,
  ]);

  // 모바일용 교차점 항목들 계산
  const mobileIntersectionItems = getIntersectionItems();

  return (
    <div className="flex flex-col gap-3 mt-[30px]">
      {/* 회사 선택 드롭다운 */}
      <FormControl fullWidth>
        <InputLabel>업체를 선택하세요</InputLabel>
        <Select
          value={selectedCompany?.id || ""}
          onChange={(e) => {
            const company = companies.find((c) => c.id === e.target.value);
            if (company) handleCompanySelect(company);
          }}
          label="업체를 선택하세요"
        >
          {companies.map((company) => (
            <MenuItem key={company.id} value={company.id}>
              {company.companyColumnName}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* 품목 카드 리스트 */}
      {selectedCompany && (
        <>
          <div className="text-lg font-semibold text-gray-800 mt-4 mb-2">
            품목을 선택하세요
          </div>

          {items.map((item) => {
            const price = priceData[selectedCompany.id]?.[item.id] || 0;
            const isSelected = selectedColumns[item.id] || false;

            return (
              <CommonCard
                key={item.id}
                id={item.id}
                title={`${item.itemName} (${item.itemOrigin})`}
                fields={[
                  {
                    label: "가격",
                    value: price > 0 ? `${formatNumber(price)}원` : "-",
                  },
                ]}
                isSelected={isSelected}
                onSelect={() => handleItemSelect(item.id)}
                rowData={item}
              />
            );
          })}
        </>
      )}

      {/* 선택된 교차점 표시 */}
      {mobileIntersectionItems.length > 0 && (
        <div className="mt-4 p-3 bg-green-50 rounded-lg">
          <p className="text-sm text-green-800 font-semibold">
            선택된 견적 항목: {mobileIntersectionItems.length}개
          </p>
          <div className="text-xs text-green-700 mt-1">
            {mobileIntersectionItems.map((item, idx) => (
              <span key={idx}>
                {item.company}에서 {item.productName} (
                {formatNumber(item.price)}원)
                {idx < mobileIntersectionItems.length - 1 ? ", " : ""}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* 모바일 플로팅 버튼들 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-50 overflow-x-auto">
        <Stack direction="row" spacing={2} sx={{ minWidth: "max-content" }}>
          <CommonButton
            variant="info"
            onClick={onCompanyModalOpen}
            className="whitespace-nowrap"
          >
            업체 추가
          </CommonButton>
          <CommonButton
            variant="info"
            onClick={onItemModalOpen}
            className="whitespace-nowrap"
          >
            품목 추가
          </CommonButton>
          <CommonButton
            variant="primary"
            onClick={onCompanyEditModalOpen}
            disabled={!selectedCompany}
            className="whitespace-nowrap"
          >
            업체 수정
          </CommonButton>
          <CommonButton
            variant="primary"
            onClick={onItemEditModalOpen}
            disabled={
              Object.keys(selectedColumnsForManagement).filter(
                (key) => selectedColumnsForManagement[key],
              ).length !== 1
            }
            className="whitespace-nowrap"
          >
            품목 수정
          </CommonButton>
          <CommonButton
            variant="primary"
            onClick={handleOpenPriceEditModal}
            disabled={
              !selectedCompany ||
              Object.keys(selectedColumns).filter((k) => selectedColumns[k])
                .length !== 1
            }
            className="whitespace-nowrap"
          >
            가격 수정
          </CommonButton>
          <CommonButton
            variant="danger"
            onClick={onCompanyDeleteModalOpen}
            disabled={!selectedCompany}
            className="whitespace-nowrap"
          >
            업체 삭제
          </CommonButton>
          <CommonButton
            variant="danger"
            onClick={onItemDeleteModalOpen}
            disabled={
              Object.keys(selectedColumnsForManagement).filter(
                (key) => selectedColumnsForManagement[key],
              ).length === 0
            }
            className="whitespace-nowrap"
          >
            품목 삭제
          </CommonButton>
          <CommonButton
            variant="special"
            onClick={onQuotationDocumentModalOpen}
            disabled={mobileIntersectionItems.length === 0}
            className="whitespace-nowrap"
          >
            견적서 ({mobileIntersectionItems.length})
          </CommonButton>
        </Stack>
      </div>
    </div>
  );
}
