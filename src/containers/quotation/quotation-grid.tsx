import React from "react";
import DataGrid from "@/components/data-grid";
import {
  ICellRendererParams,
  SelectionChangedEvent,
  CellValueChangedEvent,
} from "ag-grid-community";
import { ColumnCompany } from "./quotation";
import { QuotationCompany } from "@/services/quotation-service";

// CustomHeaderComponent의 props 타입 정의 (이제 품목 선택용)
interface CustomHeaderProps {
  displayName: string;
  selectedColumns: Record<string, boolean>;
  setSelectedColumns: React.Dispatch<
    React.SetStateAction<Record<string, boolean>>
  >;
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
  selectedRows: Record<string, boolean>; // 이제 회사 선택 상태
  setSelectedRows: React.Dispatch<
    React.SetStateAction<Record<string, boolean>>
  >;
  selectedColumns: Record<string, boolean>; // 견적서용 품목 선택 상태
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
  // 컬럼 관리용 선택 상태 추가
  selectedColumnsForManagement?: Record<string, boolean>;
  setSelectedColumnsForManagement?: React.Dispatch<
    React.SetStateAction<Record<string, boolean>>
  >;
}

export default function QuotationGrid({
  items,
  companies,
  priceData,
  setSelectedRows,
  selectedColumns,
  setSelectedColumns,
  formatNumber,
  onCompanySelect,
  onItemsSelect,
  onCellValueChanged,
  selectedColumnsForManagement,
  setSelectedColumnsForManagement,
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

  // 커스텀 헤더 컴포넌트 (견적서용 선택 + 컬럼 관리용 선택 로직 분리)
  const CustomHeaderComponent = (props: CustomHeaderProps) => {
    const itemDisplayName = props.displayName;
    // item.id를 가져오기 위해 items 배열에서 찾기
    const item = items.find(
      (i) => `${i.name} (${i.origin})` === itemDisplayName,
    );
    const itemId = item?.id || itemDisplayName;
    const isQuotationSelected = props.selectedColumns[itemId]; // 견적서용 선택 상태
    const isManagementSelected =
      selectedColumnsForManagement?.[itemId] || false; // 컬럼 관리용 선택 상태

    return (
      <div
        className={`w-full h-full flex items-center justify-start cursor-pointer px-[24px] ${
          isManagementSelected ? "bg-blue-200 font-bold" : ""
        }`}
        onClick={() => {
          // 견적서용 다중 선택 로직 (시각적 표시 없음)
          const newQuotationSelection = {
            ...props.selectedColumns,
            [itemId]: !isQuotationSelected,
          };
          setSelectedColumns(newQuotationSelection);

          // 선택된 품목들을 부모로 전달 (견적서용)
          const selectedItemIds = Object.keys(newQuotationSelection).filter(
            (key) => newQuotationSelection[key],
          );
          onItemsSelect(selectedItemIds);

          // 컬럼 관리용 다중 선택 로직 (파란색 하이라이팅)
          if (setSelectedColumnsForManagement) {
            const newManagementSelection = {
              ...selectedColumnsForManagement,
              [itemId]: !isManagementSelected,
            };
            setSelectedColumnsForManagement(newManagementSelection);
          }
        }}
      >
        <span>{itemDisplayName}</span>
      </div>
    );
  };

  // 가격 셀 렌더러
  const PriceCellRenderer = ({ data, colDef }: ICellRendererParams) => {
    if (!data) return null; // data가 없으면 렌더링하지 않음
    const companyId = data.id; // 이제 data는 회사 정보
    const itemField = colDef?.field;

    // itemField에서 실제 item을 찾기
    const item = items.find((i) => i.id === itemField);
    const itemName = item?.name || "";

    const price = priceData[companyId]?.[itemName] || 0;

    return (
      <div className="w-full h-full flex items-center justify-start">
        <span>{price > 0 ? formatNumber(price) : ""}</span>
      </div>
    );
  };

  // 컬럼 정의 (이제 회사가 행이므로 품목들이 컬럼이 됨)
  const columnDefs = [
    {
      headerName: "",
      checkboxSelection: true,
      minWidth: 50,
      flex: 1,
      headerCheckboxSelection: false, // 헤더 체크박스 제거 (단일 선택이므로)
      filter: false,
      pinned: "left" as const,
      lockPinned: true,
      width: 70,
      field: "checkbox",
    },
    {
      headerName: "업체명",
      field: "companyColumnName",
      pinned: "left" as const,
      width: getOptimalColumnWidth(
        [...companies.map((company) => company.companyColumnName), "업체명"],
        120,
        250,
      ),
      sortable: false,
    },
    ...items.map((item) => ({
      headerName: `${item.name} (${item.origin})`,
      headerClass: "item-header", // 클래스 변경
      field: item.id,
      headerComponent: (props: CustomHeaderProps) =>
        CustomHeaderComponent({
          ...props,
          displayName: `${item.name} (${item.origin})`,
          selectedColumns,
          setSelectedColumns,
        }),
      minWidth: 100,
      width: calculateColumnWidth(`${item.name} (${item.origin})`),
      cellRenderer: PriceCellRenderer,
      editable: true,
      sortable: false,
    })),
  ];

  // 행 데이터 (이제 회사들이 행이 됨)
  const rowData = companies.map((company) => {
    const row: Record<string, string | number> = {
      id: company.id,
      companyColumnName: company.companyColumnName,
    };
    items.forEach((item) => {
      row[item.id] = priceData[company.id]?.[item.name] || 0;
    });
    return row;
  });

  // 선택 이벤트 처리 (이제 회사 선택 - 단일 선택 모드)
  const handleSelectionChanged = (event: SelectionChangedEvent) => {
    const selectedNodes = event.api.getSelectedNodes();

    if (selectedNodes.length === 1) {
      // 단일 선택
      const selectedCompanyId = selectedNodes[0].data.id;
      const newSelectedRows: Record<string, boolean> = {
        [selectedCompanyId]: true,
      };
      setSelectedRows(newSelectedRows);

      // 선택된 회사의 가격이 있는 모든 품목들을 자동으로 선택
      const companyPriceData = priceData[selectedCompanyId] || {};
      const availableItemIds: string[] = [];

      items.forEach((item) => {
        const price = companyPriceData[item.name];
        if (price && price > 0) {
          availableItemIds.push(item.id);
        }
      });

      // 가격이 있는 품목들을 선택 상태로 설정
      const newSelectedColumns: Record<string, boolean> = {};
      availableItemIds.forEach((itemId) => {
        newSelectedColumns[itemId] = true;
      });
      setSelectedColumns(newSelectedColumns);

      // 선택된 회사를 부모로 전달
      const selectedCompany = companies.find((c) => c.id === selectedCompanyId);
      onCompanySelect(selectedCompany || null);

      // 선택된 품목들을 부모로 전달
      onItemsSelect(availableItemIds);
    } else {
      // 선택 해제
      setSelectedRows({});
      setSelectedColumns({}); // 품목 선택도 모두 해제
      onCompanySelect(null);
      onItemsSelect([]);
    }
  };

  return (
    <div className="w-full h-full">
      <div className="w-full h-full">
        <style jsx>{`
          div :global(.ag-header-cell.item-header) {
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
          rowSelection="single"
        />
      </div>
    </div>
  );
}
