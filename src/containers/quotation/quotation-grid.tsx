import React from "react";
import DataGrid from "@/components/data-grid";
import { ICellRendererParams, SelectionChangedEvent } from "ag-grid-community";

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
}

export default function QuotationGrid({
  items,
  companies,
  priceData,
  setPriceData,
  selectedRows,
  setSelectedRows,
  selectedColumns,
  setSelectedColumns,
  formatNumber,
}: QuotationGridProps) {
  // 커스텀 헤더 컴포넌트 (세로줄 선택용)
  const CustomHeaderComponent = (props: CustomHeaderProps) => {
    const company = props.displayName;
    const isSelected = props.selectedColumns[company];

    return (
      <div
        className={`w-full h-full flex items-center justify-center cursor-pointer p-2 ${
          isSelected ? "bg-blue-200 font-bold" : "hover:bg-gray-100"
        }`}
        onClick={() => {
          props.setSelectedColumns({
            [company]: !isSelected,
          });
        }}
      >
        <span>{company}</span>
      </div>
    );
  };

  // 가격 셀 렌더러
  const PriceCellRenderer = ({ data, colDef }: ICellRendererParams) => {
    if (!data) return null; // data가 없으면 렌더링하지 않음
    const productName = data.name;
    const company = colDef?.field;
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

  // 컬럼 정의
  const columnDefs = [
    {
      headerName: "제품명",
      field: "name",
      pinned: "left" as const,
      width: 120,
      checkboxSelection: true,
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
      headerComponent: (props: CustomHeaderProps) =>
        CustomHeaderComponent({
          ...props,
          selectedColumns,
          setSelectedColumns,
        }),
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
      <div className="w-full h-[600px]">
        <DataGrid
          columnDefs={columnDefs}
          data={rowData}
          pagination={false}
          loading={false}
          onSelectionChanged={handleSelectionChanged}
        />
      </div>
    </div>
  );
}
