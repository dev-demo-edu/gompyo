import React from "react";
import DataGrid from "@/components/data-grid";
import {
  ICellRendererParams,
  SelectionChangedEvent,
  CellValueChangedEvent,
} from "ag-grid-community";
import { ColumnCompany } from "./quotation";
import { QuotationCompany } from "@/services/quotation-service";

// CustomHeaderComponent의 props 타입 정의
interface CustomHeaderProps {
  displayName: string;
  selectedColumns: Record<string, boolean>;
  setSelectedColumns: React.Dispatch<
    React.SetStateAction<Record<string, boolean>>
  >;
}

// cellStyle의 params 타입 정의
interface CellStyleParams {
  data: {
    id: string;
  };
}

// Item 타입 정의
interface Item {
  id: string;
  name: string;
  origin: string;
}

// QuotationGrid props 타입 정의
interface QuotationGridProps {
  items: Item[];
  companies: ColumnCompany[];
  priceData: Record<string, Record<string, number>>;
  selectedRows: Record<string, boolean>;
  setSelectedRows: React.Dispatch<
    React.SetStateAction<Record<string, boolean>>
  >;
  selectedColumns: Record<string, boolean>;
  setSelectedColumns: React.Dispatch<
    React.SetStateAction<Record<string, boolean>>
  >;
  getIntersectionItems: () => Array<{
    productCode: string;
    productName: string;
    company: string;
    price: number;
    origin: string;
  }>;
  formatNumber: (num: number) => string;
  onCompanySelect: (company: QuotationCompany | null) => void;
  onItemsSelect: (itemIds: string[]) => void;
  onCellValueChanged?: (event: CellValueChangedEvent) => void;
}

export default function QuotationGrid({
  items,
  companies,
  priceData,
  selectedRows,
  setSelectedRows,
  selectedColumns,
  setSelectedColumns,
  formatNumber,
  onCompanySelect,
  onItemsSelect,
  onCellValueChanged,
}: QuotationGridProps) {
  // 텍스트 길이에 따른 컬럼 너비 계산 함수
  const calculateColumnWidth = (
    text: string,
    minWidth = 100,
    maxWidth = 250,
  ) => {
    // 한글은 영문보다 넓으므로 가중치 적용
    const koreanCharCount = (text.match(/[가-힣]/g) || []).length;
    const otherCharCount = text.length - koreanCharCount;

    // 한글 1글자 ≈ 16px, 영문/숫자 1글자 ≈ 8px, 패딩 40px
    const estimatedWidth = koreanCharCount * 16 + otherCharCount * 8 + 40;

    // 최소/최대 너비 제한
    return Math.max(minWidth, Math.min(maxWidth, estimatedWidth));
  };

  // 컬럼별 최적 너비 계산
  const getOptimalColumnWidth = (
    texts: string[],
    minWidth = 100,
    maxWidth = 250,
  ) => {
    const maxWidth_calculated = Math.max(
      ...texts.map((text) => calculateColumnWidth(text, 0, Infinity)),
    );
    return Math.max(minWidth, Math.min(maxWidth, maxWidth_calculated));
  };

  // 커스텀 헤더 컴포넌트 (세로줄 선택용)
  const CustomHeaderComponent = (props: CustomHeaderProps) => {
    const companyName = props.displayName;
    // company.id를 가져오기 위해 companies 배열에서 찾기
    const company = companies.find((c) => c.companyColumnName === companyName);
    const companyId = company?.id || companyName;
    const isSelected = props.selectedColumns[companyId];

    return (
      <div
        className={`w-full h-full flex items-center justify-start cursor-pointer px-[24px] ${
          isSelected ? "bg-blue-200 font-bold" : ""
        }`}
        onClick={() => {
          const newSelection = { [companyId]: !isSelected };
          setSelectedColumns(newSelection);

          // 선택된 업체를 부모로 전달
          const selectedCompanyId = Object.keys(newSelection).find(
            (key) => newSelection[key],
          );
          const selectedCompanyObj = selectedCompanyId
            ? companies.find((c) => c.id === selectedCompanyId)
            : null;
          onCompanySelect(selectedCompanyObj || null);
        }}
      >
        <span>{companyName}</span>
      </div>
    );
  };

  // 가격 셀 렌더러
  const PriceCellRenderer = ({ data, colDef }: ICellRendererParams) => {
    if (!data) return null; // data가 없으면 렌더링하지 않음
    const productName = data.name;
    const companyId = colDef?.field;
    const price = companyId ? priceData[companyId]?.[productName] || 0 : 0;
    const isRowSelected = selectedRows[data.id];
    const isColumnSelected = companyId ? selectedColumns[companyId] : false;
    const isIntersection = isRowSelected && isColumnSelected;

    return (
      <div
        className={`w-full h-full flex items-center justify-start ${
          isIntersection
            ? "bg-green-200 font-bold"
            : isRowSelected
              ? "bg-blue-100"
              : ""
        }`}
      >
        <span>{price > 0 ? formatNumber(price) : ""}</span>
      </div>
    );
  };

  // 컬럼 정의
  const columnDefs = [
    {
      headerName: "",
      checkboxSelection: true,
      minWidth: 50,
      flex: 1,
      headerCheckboxSelection: true,
      filter: false,
      pinned: "left" as const,
      lockPinned: true,
      width: 70,
      field: "checkbox",
    },
    {
      headerName: "제품명",
      field: "name",
      pinned: "left" as const,
      width: getOptimalColumnWidth(
        [...items.map((item) => item.name), "제품명"],
        80,
        200,
      ),

      cellStyle: (params: CellStyleParams) => ({
        backgroundColor: selectedRows[params.data.id] ? "#DBEAFE" : "#f8f9fa",
      }),
      sortable: false,
    },
    {
      headerName: "원산지",
      field: "origin",
      pinned: "left" as const,
      width: getOptimalColumnWidth(
        [...items.map((item) => item.origin), "원산지"],
        60,
        120,
      ),
      cellStyle: (params: CellStyleParams) => ({
        backgroundColor: selectedRows[params.data.id] ? "#DBEAFE" : "#f8f9fa",
      }),
      sortable: false,
    },
    ...companies.map((company) => ({
      headerName: company.companyColumnName,
      headerClass: "company-header", // ← 클래스 추가
      field: company.id,
      headerComponent: (props: CustomHeaderProps) =>
        CustomHeaderComponent({
          ...props,
          displayName: company.companyColumnName,
          selectedColumns,
          setSelectedColumns,
        }),
      // flex: 1,
      minWidth: 100,
      width: calculateColumnWidth(company.companyColumnName),
      cellRenderer: PriceCellRenderer,
      editable: true,
      cellStyle: (params: CellStyleParams) => {
        const isRowSelected = selectedRows[params.data.id];
        const isColumnSelected = selectedColumns[company.id];
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
      row[company.id] = priceData[company.id]?.[item.name] || 0;
    });
    return row;
  });

  // 선택 이벤트 처리
  const handleSelectionChanged = (event: SelectionChangedEvent) => {
    const selectedNodes = event.api.getSelectedNodes();
    const newSelectedRows: Record<string, boolean> = {};
    selectedNodes.forEach((node) => {
      newSelectedRows[node.data.id] = true;
    });
    setSelectedRows(newSelectedRows);
    const selectedItemIds = selectedNodes.map((node) => node.data.id);
    onItemsSelect(selectedItemIds);
  };

  return (
    <div className="w-full">
      <div className="w-full h-[600px]">
        <style jsx>{`
          div :global(.ag-header-cell.company-header) {
            padding: 0 !important;
          }
        `}</style>
        <DataGrid
          columnDefs={columnDefs}
          data={rowData}
          pagination={false}
          loading={false}
          onSelectionChanged={handleSelectionChanged}
          onCellValueChanged={onCellValueChanged}
        />
      </div>
    </div>
  );
}
