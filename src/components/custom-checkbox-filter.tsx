"use client";

import React, {
  forwardRef,
  useImperativeHandle,
  useState,
  useMemo,
  useEffect,
  useCallback,
} from "react";
import { IFilterComp, IFilterParams } from "ag-grid-community";

interface CustomCheckboxFilterParams extends IFilterParams {
  values?: string[];
}

interface FilterModel {
  filterType: "set";
  values: string[];
}

export const CustomCheckboxFilter = forwardRef<
  IFilterComp,
  CustomCheckboxFilterParams
>((props, ref) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedValues, setSelectedValues] = useState<string[]>([]);
  const [allUniqueValues, setAllUniqueValues] = useState<string[]>([]);

  // 필터 UI DOM 요소에 대한 ref
  const filterElementRef = React.useRef<HTMLDivElement>(null);

  // 필터 변경 알림 함수
  const notifyFilterChanged = useCallback(() => {
    console.log(`🔔 [${props.colDef.field}] 필터 변경 알림 시도`);

    // 여러 방법으로 시도
    try {
      // 방법 1: ag-grid API를 통해 필터 변경 알림
      if (props.api && typeof props.api.onFilterChanged === "function") {
        props.api.onFilterChanged();
        console.log(
          `✅ [${props.colDef.field}] api.onFilterChanged() 호출 성공`,
        );
      } else {
        console.log(`❌ [${props.colDef.field}] api.onFilterChanged() 없음`);
      }

      // 방법 2: filterChangedCallback 시도
      if (
        props.filterChangedCallback &&
        typeof props.filterChangedCallback === "function"
      ) {
        props.filterChangedCallback();
        console.log(
          `✅ [${props.colDef.field}] filterChangedCallback() 호출 성공`,
        );
      } else {
        console.log(`❌ [${props.colDef.field}] filterChangedCallback() 없음`);
      }
    } catch (error) {
      console.error(`🚨 [${props.colDef.field}] 필터 알림 오류:`, error);
    }
  }, [props.api, props.filterChangedCallback, props.colDef.field]);

  // ag-grid에서 모든 행의 데이터를 가져와서 고유값 추출
  useEffect(() => {
    const uniqueValues = new Set<string>();

    console.log(`🔍 [${props.colDef.field}] 필터 초기화 시작`);

    // props.values가 있으면 사용, 없으면 데이터에서 추출
    if (props.values) {
      props.values.forEach((val) => uniqueValues.add(val));
      console.log(`📋 [${props.colDef.field}] 수동 설정된 값들:`, props.values);
    } else {
      // ag-grid에서 모든 데이터 가져오기
      props.api.forEachNode((node) => {
        if (node.data) {
          const value = node.data[props.colDef.field!];
          const stringValue =
            value === null || value === undefined ? "(빈 값)" : String(value);
          uniqueValues.add(stringValue);
          console.log(
            `📊 [${props.colDef.field}] 데이터 값:`,
            value,
            `(타입: ${typeof value})`,
          );
        }
      });
    }

    const sortedValues = Array.from(uniqueValues).sort();
    console.log(`✅ [${props.colDef.field}] 최종 고유값들:`, sortedValues);

    setAllUniqueValues(sortedValues);
    setSelectedValues(sortedValues); // 초기에는 모든 값 선택
  }, [props.api, props.colDef.field, props.values]);

  // 검색어로 필터링된 옵션들
  const filteredOptions = useMemo(() => {
    return allUniqueValues.filter((option) =>
      option.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [allUniqueValues, searchTerm]);

  // ag-grid 필터 인터페이스 구현
  useImperativeHandle(ref, () => ({
    // 필터 UI DOM 요소 반환
    getGui: () => {
      return filterElementRef.current!;
    },

    // 현재 필터가 활성화되어 있는지
    isFilterActive: () => {
      const active =
        selectedValues.length > 0 &&
        selectedValues.length < allUniqueValues.length;
      console.log(
        `🔥 [${props.colDef.field}] 필터 활성화 여부:`,
        active,
        `(선택: ${selectedValues.length}/${allUniqueValues.length})`,
      );
      return active;
    },

    // 행이 필터를 통과하는지 확인
    doesFilterPass: (params) => {
      const value = params.data[props.colDef.field!];
      const stringValue =
        value === null || value === undefined ? "(빈 값)" : String(value);
      const passes = selectedValues.includes(stringValue);
      console.log(
        `🚦 [${props.colDef.field}] 필터 통과 체크:`,
        stringValue,
        "→",
        passes ? "✅통과" : "❌차단",
      );
      return passes;
    },

    // 필터 모델 가져오기
    getModel: () => {
      if (
        selectedValues.length === 0 ||
        selectedValues.length === allUniqueValues.length
      ) {
        return null;
      }
      return {
        filterType: "set",
        values: selectedValues,
      } as FilterModel;
    },

    // 필터 모델 설정
    setModel: (model: FilterModel | null) => {
      if (model && model.values) {
        setSelectedValues(model.values);
      } else {
        setSelectedValues(allUniqueValues);
      }
    },

    // 필터 UI 새로고침 시 호출
    refresh: () => true,

    // 필터 파괴 시 호출
    destroy: () => {},
  }));

  const handleSelectAll = () => {
    const newSelected =
      selectedValues.length === allUniqueValues.length
        ? []
        : [...allUniqueValues];
    setSelectedValues(newSelected);
    console.log(
      `🎯 [${props.colDef.field}] 전체 선택/해제:`,
      newSelected.length === 0 ? "모두 해제" : "모두 선택",
    );

    // ag-grid에 필터 변경 알림
    setTimeout(() => {
      notifyFilterChanged();
    }, 0);
  };

  const handleOptionToggle = (option: string) => {
    let newSelectedValues: string[];

    if (selectedValues.includes(option)) {
      newSelectedValues = selectedValues.filter((item) => item !== option);
      console.log(`➖ [${props.colDef.field}] 옵션 해제:`, option);
    } else {
      newSelectedValues = [...selectedValues, option];
      console.log(`➕ [${props.colDef.field}] 옵션 선택:`, option);
    }

    setSelectedValues(newSelectedValues);
    console.log(
      `📝 [${props.colDef.field}] 현재 선택된 값들:`,
      newSelectedValues,
    );

    // ag-grid에 필터 변경 알림
    setTimeout(() => {
      notifyFilterChanged();
    }, 0);
  };

  const allSelected = selectedValues.length === allUniqueValues.length;
  const someSelected =
    selectedValues.length > 0 && selectedValues.length < allUniqueValues.length;

  return (
    <div
      ref={filterElementRef}
      className="ag-filter-body"
      style={{ width: "250px", padding: "10px" }}
    >
      {/* 검색 입력 */}
      <div style={{ marginBottom: "10px" }}>
        <input
          type="text"
          placeholder="검색..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: "100%",
            padding: "6px",
            border: "1px solid #ccc",
            borderRadius: "4px",
            fontSize: "12px",
          }}
        />
      </div>

      {/* Select All 체크박스 */}
      <div
        style={{
          marginBottom: "8px",
          borderBottom: "1px solid #eee",
          paddingBottom: "8px",
        }}
      >
        <label
          style={{
            display: "flex",
            alignItems: "center",
            cursor: "pointer",
            fontSize: "12px",
          }}
        >
          <input
            type="checkbox"
            checked={allSelected}
            ref={(input) => {
              if (input) input.indeterminate = someSelected;
            }}
            onChange={handleSelectAll}
            style={{ marginRight: "6px" }}
          />
          <strong>전체 선택</strong>
        </label>
      </div>

      {/* 옵션 리스트 */}
      <div style={{ maxHeight: "200px", overflowY: "auto" }}>
        {filteredOptions.map((option) => (
          <div key={option} style={{ marginBottom: "4px" }}>
            <label
              style={{
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
                fontSize: "12px",
              }}
            >
              <input
                type="checkbox"
                checked={selectedValues.includes(option)}
                onChange={() => handleOptionToggle(option)}
                style={{ marginRight: "6px" }}
              />
              <span>{option}</span>
            </label>
          </div>
        ))}
      </div>

      {filteredOptions.length === 0 && (
        <div
          style={{
            textAlign: "center",
            color: "#999",
            fontSize: "12px",
            padding: "10px",
          }}
        >
          검색 결과가 없습니다
        </div>
      )}
    </div>
  );
});

CustomCheckboxFilter.displayName = "CustomCheckboxFilter";
