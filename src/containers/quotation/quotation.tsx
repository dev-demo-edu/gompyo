"use client";
import { useState } from "react";
import QuotationGrid from "./quotation-grid";
import { CompanyAddModal, ItemAddModal } from "./quotation-modal-container";
import { CompanyFormValues } from "./company-form";
import { ItemFormValues } from "./item-form";
import { Button, Stack } from "@mui/material";

export default function QuotationContainer() {
  // 모달 상태 관리
  const [companyModalOpen, setCompanyModalOpen] = useState(false);
  const [itemModalOpen, setItemModalOpen] = useState(false);

  // 선택 상태 관리 (QuotationGrid에서 상위로 이동)
  const [selectedRows, setSelectedRows] = useState<Record<string, boolean>>({});
  const [selectedColumns, setSelectedColumns] = useState<
    Record<string, boolean>
  >({});

  // 데이터 상태 관리
  const [items, setItems] = useState([
    { id: "1001", code: "1001", name: "제품A", origin: "카나다" },
    { id: "1002", code: "1002", name: "제품B", origin: "미국" },
    { id: "1005", code: "1004", name: "브라운렌틸1", origin: "카나다" },
  ]);

  const [companies, setCompanies] = useState([
    "한가(도착)",
    "온씨(도착)",
    "수입(도착)",
    "한라농협물산1",
  ]);

  const [priceData, setPriceData] = useState<
    Record<string, Record<string, number>>
  >({
    "한가(도착)": {
      제품A: 1600,
      제품B: 1700,
      브라운렌틸: 1500,
    },
    "온씨(도착)": {
      제품A: 1550,
      제품B: 1650,
      브라운렌틸: 1450,
    },
    "수입(도착)": {
      제품B: 1600,
      브라운렌틸: 1450,
    },
    한라농협물산: {
      제품A: 1550,
      제품B: 1650,
      브라운렌틸: 1450,
    },
  });

  // 숫자 포맷팅 함수
  const formatNumber = (num: number) =>
    new Intl.NumberFormat("ko-KR").format(num);

  // 교차점 데이터 계산 (QuotationGrid에서 상위로 이동)
  const getIntersectionItems = () => {
    const intersectionItems: Array<{
      productCode: string;
      productName: string;
      company: string;
      price: number;
      origin: string;
    }> = [];

    Object.entries(selectedRows).forEach(([productCode, isRowSelected]) => {
      if (isRowSelected) {
        Object.entries(selectedColumns).forEach(([company, isColSelected]) => {
          if (isColSelected) {
            const product = items.find((item) => item.code === productCode);
            const price = priceData[company]?.[product?.name || ""] || 0;

            if (price > 0) {
              intersectionItems.push({
                productCode,
                productName: product?.name || "",
                origin: product?.origin || "",
                company,
                price,
              });
            }
          }
        });
      }
    });
    return intersectionItems;
  };

  // 견적서 작성 핸들러
  const handleQuotationCreate = () => {
    const intersectionItems = getIntersectionItems();
    console.log("=== 견적서 작성 데이터 ===");
    console.log("선택된 행(제품):", selectedRows);
    console.log("선택된 열(회사):", selectedColumns);
    console.log("교차점 데이터:", intersectionItems);
    console.log("총 견적 항목 수:", intersectionItems.length);

    intersectionItems.forEach((item, index) => {
      console.log(
        `${index + 1}. ${item.company}에서 ${item.productName}: ${item.price.toLocaleString()}원`,
      );
    });

    alert(
      `${intersectionItems.length}개 항목으로 견적서 작성\n콘솔을 확인해주세요!`,
    );
  };

  // 업체 추가 핸들러
  const handleAddCompany = (values: CompanyFormValues) => {
    const newCompany = values.name;

    // 중복 체크
    if (companies.includes(newCompany)) {
      throw new Error("이미 존재하는 업체명입니다.");
    }

    setCompanies((prev) => [...prev, newCompany]);
    setPriceData((prev) => ({
      ...prev,
      [newCompany]: {}, // 새 업체는 빈 가격 데이터로 시작
    }));
  };

  // 품목 추가 핸들러
  const handleAddItem = (values: ItemFormValues) => {
    // 중복 체크 (코드 기준)
    if (items.some((item) => item.code === values.code)) {
      throw new Error("이미 존재하는 품목 코드입니다.");
    }

    const newItem = {
      id: values.code,
      code: values.code,
      name: values.name,
      origin: values.origin,
    };

    setItems((prev) => [...prev, newItem]);
  };

  return (
    <div className="w-full min-h-screen bg-gray-100">
      <div className="p-4 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 gap-4">
          <h1 className="text-xl sm:text-2xl font-bold">견적서 작성</h1>

          {/* 모든 버튼들을 한 줄에 배치 */}
          <Stack direction="row" spacing={2}>
            <Button
              variant="contained"
              onClick={() => setCompanyModalOpen(true)}
              sx={{
                backgroundColor: "#22C55E",
                "&:hover": { backgroundColor: "#16A34A" },
                fontWeight: 600,
                boxShadow: "none",
              }}
            >
              업체 추가
            </Button>
            <Button
              variant="contained"
              onClick={() => setItemModalOpen(true)}
              sx={{
                backgroundColor: "#3B82F6",
                "&:hover": { backgroundColor: "#2563EB" },
                fontWeight: 600,
                boxShadow: "none",
              }}
            >
              품목 추가
            </Button>
            <Button
              variant="contained"
              disabled={getIntersectionItems().length === 0}
              onClick={handleQuotationCreate}
              sx={{
                backgroundColor: "#6366F1",
                "&:hover": { backgroundColor: "#4F46E5" },
                fontWeight: 600,
                boxShadow: "none",
              }}
            >
              견적서 작성 ({getIntersectionItems().length})
            </Button>
          </Stack>
        </div>

        {/* 그리드 */}
        <div className="overflow-hidden">
          <QuotationGrid
            items={items}
            companies={companies}
            priceData={priceData}
            setPriceData={setPriceData}
            selectedRows={selectedRows}
            setSelectedRows={setSelectedRows}
            selectedColumns={selectedColumns}
            setSelectedColumns={setSelectedColumns}
            getIntersectionItems={getIntersectionItems}
            formatNumber={formatNumber}
          />
        </div>

        {/* 선택된 교차점 표시 */}
        {getIntersectionItems().length > 0 && (
          <div className="mt-4 p-3 bg-green-50 rounded-lg">
            <p className="text-sm text-green-800 font-semibold">
              선택된 견적 항목: {getIntersectionItems().length}개
            </p>
            <div className="text-xs text-green-700 mt-1">
              {getIntersectionItems().map((item, idx) => (
                <span key={idx}>
                  {item.company}에서 {item.productName} (
                  {formatNumber(item.price)}원)
                  {idx < getIntersectionItems().length - 1 ? ", " : ""}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 모달들 */}
      <CompanyAddModal
        open={companyModalOpen}
        onClose={() => setCompanyModalOpen(false)}
        onSubmit={handleAddCompany}
      />

      <ItemAddModal
        open={itemModalOpen}
        onClose={() => setItemModalOpen(false)}
        onSubmit={handleAddItem}
      />
    </div>
  );
}
