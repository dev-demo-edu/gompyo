import React, { useEffect, useState, useMemo, useCallback } from "react";
import DataGrid from "@/components/data-grid";
import {
  ICellRendererParams,
  SelectionChangedEvent,
  CellValueChangedEvent,
  DragStoppedEvent,
} from "ag-grid-community";
import { ColumnCompany } from "./quotation";
import { QuotationCompany } from "@/services/quotation-service";
import {
  getUserQuotationColumnOrder,
  saveUserQuotationColumnOrder,
  ColumnOrder,
} from "@/actions/user";
import useDragColumnChange from "@/hooks/useDragColumnChange";
import { defaultQuotationColumnOrderFields } from "@/constants/column";

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
  // 컬럼 순서 변경 콜백 추가
  onColumnOrderChange?: (newOrder: ColumnOrder[]) => void;
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
  onColumnOrderChange,
}: QuotationGridProps) {
  const [columnOrder, setColumnOrder] = useState<ColumnOrder[]>([]);

  // 컬럼 순서 로딩
  useEffect(() => {
    const loadColumnOrder = async () => {
      try {
        const userColumnOrder = await getUserQuotationColumnOrder();
        setColumnOrder(userColumnOrder || defaultQuotationColumnOrderFields);
      } catch (error) {
        console.error("컬럼 순서 로딩 오류:", error);
        setColumnOrder(defaultQuotationColumnOrderFields);
      }
    };
    loadColumnOrder();
  }, []);

  // 새 품목 추가 시 컬럼 순서 자동 업데이트
  useEffect(() => {
    if (items.length > 0 && columnOrder.length > 0) {
      const currentItemIds = items.map((item) => item.id);
      const orderItemIds = columnOrder
        .filter((col) => col.field !== "companyColumnName")
        .map((col) => col.field);

      // 새로 추가된 품목들 찾기
      const newItemIds = currentItemIds.filter(
        (id) => !orderItemIds.includes(id),
      );
      // 삭제된 품목들 찾기
      const deletedItemIds = orderItemIds.filter(
        (id) => !currentItemIds.includes(id),
      );

      let shouldUpdate = false;
      let newColumnOrder = [...columnOrder];

      // 새 품목 추가
      if (newItemIds.length > 0) {
        newColumnOrder = [
          ...newColumnOrder,
          ...newItemIds.map((itemId) => ({
            field: itemId,
            width: 150,
          })),
        ];
        shouldUpdate = true;
        console.log(`새 품목 ${newItemIds.length}개가 컬럼 순서에 추가됩니다.`);
      }

      // 삭제된 품목 제거
      if (deletedItemIds.length > 0) {
        newColumnOrder = newColumnOrder.filter(
          (col) =>
            col.field === "companyColumnName" ||
            !deletedItemIds.includes(col.field),
        );
        shouldUpdate = true;
        console.log(
          `삭제된 품목 ${deletedItemIds.length}개가 컬럼 순서에서 제거됩니다.`,
        );
      }

      // 변경사항이 있으면 서버에 저장
      if (shouldUpdate) {
        saveUserQuotationColumnOrder(newColumnOrder)
          .then((result) => {
            if (result.success) {
              setColumnOrder(newColumnOrder);
              // 부모 컴포넌트에 컬럼 순서 변경 알림
              onColumnOrderChange?.(newColumnOrder);
              console.log("컬럼 순서가 업데이트되었습니다.");
            }
          })
          .catch((error) => {
            console.error("컬럼 순서 업데이트 오류:", error);
          });
      }
    }
  }, [items, columnOrder]);

  // 컬럼 드래그 저장 핸들러
  const handleColumnDragSave = useCallback(async (e: DragStoppedEvent) => {
    const newColumnOrder = e.api
      .getColumnState()
      .filter((c) => c.colId !== "checkbox")
      .map((c) => ({
        field: c.colId as string,
        width: c.width || 100,
      })) as ColumnOrder[];

    try {
      const result = await saveUserQuotationColumnOrder(newColumnOrder);
      if (result.success) {
        setColumnOrder(newColumnOrder);
        // 부모 컴포넌트에 컬럼 순서 변경 알림
        onColumnOrderChange?.(newColumnOrder);
      }
    } catch (error) {
      console.error("컬럼 순서 저장 중 오류:", error);
    }
  }, []);

  // 드래그 이벤트 훅 생성
  const { onDragStarted, onDragStopped } =
    useDragColumnChange(handleColumnDragSave);

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

  // 가격 셀 렌더러 (useMemo 전에 정의)
  const PriceCellRenderer = ({ data, colDef }: ICellRendererParams) => {
    if (!data) return null; // data가 없으면 렌더링하지 않음
    const companyId = data.id; // 이제 data는 회사 정보
    const itemId = colDef?.field;

    // itemId를 직접 키로 사용하도록 변경
    const price = priceData[companyId]?.[itemId || ""] || 0;

    return (
      <div className="w-full h-full flex items-center justify-start">
        <span>{price > 0 ? formatNumber(price) : ""}</span>
      </div>
    );
  };

  // 커스텀 헤더 컴포넌트 (useMemo 전에 정의)
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

  // 컬럼 정의 with 순서 적용
  const columnDefs = useMemo(() => {
    // 기본 컬럼들
    const baseColumns = [
      {
        headerName: "",
        checkboxSelection: true,
        minWidth: 50,
        flex: 1,
        headerCheckboxSelection: false,
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
        width:
          columnOrder.find((col) => col.field === "companyColumnName")?.width ||
          getOptimalColumnWidth(
            [
              ...companies.map((company) => company.companyColumnName),
              "업체명",
            ],
            120,
            250,
          ),
        sortable: false,
      },
    ];

    // 품목 컬럼들을 컬럼 순서에 따라 정렬
    const itemColumns = items.map((item) => ({
      headerName: `${item.name} (${item.origin})`,
      headerClass: "item-header",
      field: item.id,
      headerComponent: (props: CustomHeaderProps) =>
        CustomHeaderComponent({
          ...props,
          displayName: `${item.name} (${item.origin})`,
          selectedColumns,
          setSelectedColumns,
        }),
      minWidth: 100,
      width:
        columnOrder.find((col) => col.field === item.id)?.width ||
        calculateColumnWidth(`${item.name} (${item.origin})`),
      cellRenderer: PriceCellRenderer,
      editable: true,
      sortable: false,
    }));

    // 컬럼 순서가 있으면 그에 따라 정렬, 없으면 원래 순서 유지
    const orderedItemColumns =
      columnOrder.length > 1
        ? columnOrder
            .filter((col) => col.field !== "companyColumnName")
            .map((orderCol) =>
              itemColumns.find((itemCol) => itemCol.field === orderCol.field),
            )
            .filter((col): col is NonNullable<typeof col> => col !== undefined)
            .concat(
              itemColumns.filter(
                (itemCol) =>
                  !columnOrder.some(
                    (orderCol) => orderCol.field === itemCol.field,
                  ),
              ),
            )
        : itemColumns;

    return [...baseColumns, ...orderedItemColumns];
  }, [columnOrder, items, companies, selectedColumns, setSelectedColumns]);

  // 행 데이터 (이제 회사들이 행이 됨)
  const rowData = companies.map((company) => {
    const row: Record<string, string | number> = {
      id: company.id,
      companyColumnName: company.companyColumnName,
    };
    items.forEach((item) => {
      // itemId를 직접 키로 사용하도록 변경
      row[item.id] = priceData[company.id]?.[item.id] || 0;
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
        // itemId를 직접 키로 사용하도록 변경
        const price = companyPriceData[item.id];
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
    <div className="w-full h-[600px] lg:h-full">
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
          onDragStarted={onDragStarted}
          onDragStopped={onDragStopped}
          rowSelection="single"
        />
      </div>
    </div>
  );
}
