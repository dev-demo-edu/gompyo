import React, { useState } from "react";
import DataGrid from "@/components/data-grid";
import { Button, Stack } from "@mui/material";
import { ICellRendererParams, SelectionChangedEvent } from "ag-grid-community";

// CustomHeaderComponent의 props 타입 정의
interface CustomHeaderProps {
  displayName: string;
}

// cellStyle의 params 타입 정의
interface CellStyleParams {
  data: {
    code: string;
  };
}

// Item 타입 정의
interface Item {
  id: string;
  code: string;
  name: string;
  origin: string;
}

// QuotationGrid props 타입 정의
interface QuotationGridProps {
  items: Item[];
  companies: string[];
  priceData: Record<string, Record<string, number>>;
  setPriceData: React.Dispatch<
    React.SetStateAction<Record<string, Record<string, number>>>
  >;
}

export default function QuotationGrid({
  items,
  companies,
  priceData,
  setPriceData,
}: QuotationGridProps) {
  // 행/열 선택 상태
  const [selectedRows, setSelectedRows] = useState<Record<string, boolean>>({});
  const [selectedColumns, setSelectedColumns] = useState<
    Record<string, boolean>
  >({});

  const formatNumber = (num: number) =>
    new Intl.NumberFormat("ko-KR").format(num);

  // 커스텀 헤더 컴포넌트 (세로줄 선택용)
  const CustomHeaderComponent = (props: CustomHeaderProps) => {
    const company = props.displayName;
    const isSelected = selectedColumns[company];

    return (
      <div
        className={`w-full h-full flex items-center justify-center cursor-pointer p-2 ${
          isSelected ? "bg-blue-200 font-bold" : "hover:bg-gray-100"
        }`}
        onClick={() => {
          setSelectedColumns((prev) => ({
            ...prev,
            [company]: !prev[company],
          }));
        }}
      >
        <span>{company}</span>
      </div>
    );
  };

  // 가격 셀 렌더러
  const PriceCellRenderer = ({ data, colDef }: ICellRendererParams) => {
    const productName = data.name; // "제품A", "제품B", "브라운렌틸"
    const company = colDef?.field; // "한가(도착)"

    // 회사 중심 데이터에서 가격 조회: priceData[회사][제품명]
    const price = company ? priceData[company]?.[productName] || 0 : 0;

    const isRowSelected = selectedRows[data.code];
    const isColumnSelected = company ? selectedColumns[company] : false;
    const isIntersection = isRowSelected && isColumnSelected;

    return (
      <div
        className={`w-full h-full flex items-center justify-center px-2 ${
          isIntersection
            ? "bg-green-200 font-bold"
            : isRowSelected
              ? "bg-blue-100"
              : isColumnSelected
                ? "bg-yellow-100"
                : ""
        }`}
      >
        <span>{price > 0 ? formatNumber(price) : ""}</span>
      </div>
    );
  };

  // 교차점 데이터 계산
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
            // 회사 중심 데이터에서 가격 조회
            const price = priceData[company]?.[product?.name || ""] || 0;

            if (price > 0) {
              // 가격이 있는 경우만 추가
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

  // 컬럼 정의
  const columnDefs = [
    {
      headerName: "제품명",
      field: "name",
      pinned: "left" as const,
      width: 120,
      checkboxSelection: true, // 가로줄 선택
      cellStyle: (params: CellStyleParams) => ({
        backgroundColor: selectedRows[params.data.code] ? "#DBEAFE" : "#f8f9fa",
      }),
      sortable: false,
    },
    {
      headerName: "원산지",
      field: "origin",
      pinned: "left" as const,
      width: 80,
      cellStyle: (params: CellStyleParams) => ({
        backgroundColor: selectedRows[params.data.code] ? "#DBEAFE" : "#f8f9fa",
      }),
      sortable: false,
    },
    ...companies.map((company) => ({
      headerName: company,
      field: company,
      headerComponent: CustomHeaderComponent, // 세로줄 선택용 커스텀 헤더
      flex: 1,
      width: 100,
      cellRenderer: PriceCellRenderer,
      editable: true,
      valueSetter: (params: { data: { name: string }; newValue: string }) => {
        const productName = params.data.name;
        const newValue = parseInt(params.newValue || "0");

        setPriceData((prev) => ({
          ...prev,
          [company]: {
            ...prev[company],
            [productName]: newValue,
          },
        }));

        return true;
      },
      cellStyle: (params: CellStyleParams) => {
        const isRowSelected = selectedRows[params.data.code];
        const isColumnSelected = selectedColumns[company];
        const isIntersection = isRowSelected && isColumnSelected;

        return {
          backgroundColor: isIntersection
            ? "#BBF7D0"
            : isRowSelected
              ? "#DBEAFE"
              : isColumnSelected
                ? "#FEF3C7"
                : "#ffffff",
        };
      },
      sortable: false,
    })),
  ];

  // 행 데이터
  const rowData = items.map((item) => {
    const row: Record<string, string | number> = { ...item };
    companies.forEach((company) => {
      row[company] = priceData[company]?.[item.name] || 0;
    });
    return row;
  });

  // 선택 이벤트 처리
  const handleSelectionChanged = (event: SelectionChangedEvent) => {
    const selectedNodes = event.api.getSelectedNodes();
    const newSelectedRows: Record<string, boolean> = {};
    selectedNodes.forEach((node) => {
      newSelectedRows[node.data.code] = true;
    });
    setSelectedRows(newSelectedRows);
  };

  return (
    <div className="w-full">
      <Stack direction="row" spacing={2} className="w-full justify-end mb-4">
        <Button
          variant="contained"
          disabled={getIntersectionItems().length === 0}
          onClick={() => {
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
          }}
          sx={{
            backgroundColor: "#6366F1",
            "&:hover": { backgroundColor: "#4F46E5" },
          }}
        >
          견적서 작성 ({getIntersectionItems().length})
        </Button>
      </Stack>

      <div className="w-full h-[600px]">
        <DataGrid
          columnDefs={columnDefs}
          data={rowData}
          pagination={false}
          loading={false}
          onSelectionChanged={handleSelectionChanged}
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
  );
}
