import React from "react";
import { Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import CommonCard from "@/components/card";
import { ColumnCompany } from "./quotation";
import { QuotationItem } from "@/services/quotation-service";

interface QuotationMobileViewProps {
  companies: ColumnCompany[];
  items: QuotationItem[];
  priceData: Record<string, Record<string, number>>;
  selectedCompany: ColumnCompany | null;
  selectedColumns: Record<string, boolean>;
  onCompanySelect: (company: ColumnCompany) => void;
  onItemSelect: (itemId: string) => void;
  formatNumber: (num: number) => string;
}

export default function QuotationMobileView({
  companies,
  items,
  priceData,
  selectedCompany,
  selectedColumns,
  onCompanySelect,
  onItemSelect,
  formatNumber,
}: QuotationMobileViewProps) {
  return (
    <div className="flex flex-col gap-3 mt-[30px]">
      {/* 회사 선택 드롭다운 */}
      <FormControl fullWidth>
        <InputLabel>업체를 선택하세요</InputLabel>
        <Select
          value={selectedCompany?.id || ""}
          onChange={(e) => {
            const company = companies.find((c) => c.id === e.target.value);
            if (company) onCompanySelect(company);
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
                onSelect={() => onItemSelect(item.id)}
                rowData={item}
              />
            );
          })}
        </>
      )}
    </div>
  );
}
