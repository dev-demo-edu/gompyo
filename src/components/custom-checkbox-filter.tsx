import { Component } from "react";

// AG Grid 관련 타입 정의
interface GridApi {
  forEachNode: (callback: (node: RowNode) => void) => void;
}

interface RowNode {
  data: Record<string, unknown>;
}

interface ColDef {
  field: string;
  [key: string]: unknown;
}

interface Column {
  [key: string]: unknown;
}

interface Context {
  [key: string]: unknown;
}

interface IFilterParams {
  api: GridApi;
  column: Column;
  colDef: ColDef;
  filterChangedCallback: (
    additionalEventAttributes?: Record<string, unknown>,
  ) => void;
  filterModifiedCallback?: () => void;
  getValue: (rowNode: RowNode) => unknown;
  doesRowPassOtherFilter: (rowNode: RowNode) => boolean;
  context: Context;
}

interface IDoesFilterPassParams {
  node: RowNode;
  data: Record<string, unknown>;
}

interface FilterModel {
  selectedValues: string[];
}

export class CheckboxFilterReact extends Component {
  private params!: IFilterParams;
  private eGui!: HTMLDivElement;
  private uniqueValues: string[] = [];
  private selectedValues: Set<string> = new Set();

  constructor(props: Record<string, unknown>) {
    super(props);
  }

  init(params: IFilterParams): void {
    console.log("CheckboxFilter init called", params);
    this.params = params;
    this.extractUniqueValues();
    this.createGui();
  }

  private extractUniqueValues(): void {
    console.log(
      "Extracting unique values for field:",
      this.params.colDef.field,
    );
    const rowData: string[] = [];

    this.params.api.forEachNode((node: RowNode) => {
      if (node.data && node.data[this.params.colDef.field] != null) {
        let value: unknown;
        try {
          value = this.params.getValue(node);
        } catch (error) {
          console.warn("getValue failed, using direct access:", error);
          value = node.data[this.params.colDef.field];
        }
        if (value == null) {
          value = node.data[this.params.colDef.field];
        }
        rowData.push(String(value || ""));
      }
    });

    this.uniqueValues = [...new Set(rowData)].sort();
    this.selectedValues = new Set(this.uniqueValues);
    console.log("Unique values:", this.uniqueValues);
    console.log("Selected values:", Array.from(this.selectedValues));
  }

  private createGui(): void {
    this.eGui = document.createElement("div");
    this.eGui.className = "custom-checkbox-filter";

    this.eGui.innerHTML = `
      <div class="filter-container">
        <div class="filter-header">
          <button class="filter-btn select-all-btn" id="selectAll">
            <span class="btn-icon">✓</span>
            전체 선택
          </button>
          <button class="filter-btn deselect-all-btn" id="deselectAll">
            <span class="btn-icon">✕</span>
            전체 해제
          </button>
        </div>
        <div class="filter-content" id="filterContent">
          <div class="checkbox-container" id="checkboxContainer"></div>
        </div>
      </div>
    `;

    // 스타일 추가
    this.addStyles();

    // 이벤트 리스너 추가
    const selectAllBtn = this.eGui.querySelector("#selectAll");
    const deselectAllBtn = this.eGui.querySelector("#deselectAll");

    if (selectAllBtn) {
      selectAllBtn.addEventListener("click", () => this.selectAll());
    }
    if (deselectAllBtn) {
      deselectAllBtn.addEventListener("click", () => this.deselectAll());
    }

    this.createCheckboxes();
  }

  private addStyles(): void {
    const style = document.createElement("style");
    style.textContent = `
      .custom-checkbox-filter {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      }

      .filter-container {
        background: white;
        border: 1px solid #e5e7eb;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        min-width: 240px;
        max-width: 300px;
        overflow: hidden;
      }

      .filter-header {
        padding: 16px;
        border-bottom: 1px solid #f3f4f6;
        display: flex;
        gap: 8px;
        background: #fafafa;
      }

      .filter-btn {
        flex: 1;
        padding: 8px 12px;
        font-size: 13px;
        font-weight: 500;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.2s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 4px;
      }

      .select-all-btn {
        background: #22c55e;
        color: white;
      }

      .select-all-btn:hover {
        background: #16a34a;
        transform: translateY(-1px);
      }

      .deselect-all-btn {
        background: #f3f4f6;
        color: #374151;
        border: 1px solid #d1d5db;
      }

      .deselect-all-btn:hover {
        background: #e5e7eb;
        transform: translateY(-1px);
      }

      .btn-icon {
        font-size: 12px;
        font-weight: bold;
      }

      .filter-content {
        max-height: 200px;
        overflow-y: auto;
        padding: 8px;
      }

      .filter-content::-webkit-scrollbar {
        width: 8px;
      }

      .filter-content::-webkit-scrollbar-track {
        background: #f1f1f1;
        border-radius: 4px;
      }

      .filter-content::-webkit-scrollbar-thumb {
        background: #22c55e;
        border-radius: 4px;
      }

      .filter-content::-webkit-scrollbar-thumb:hover {
        background: #16a34a;
      }

      .checkbox-container {
        display: flex;
        flex-direction: column;
        gap: 4px;
      }

      .checkbox-item {
        display: flex;
        align-items: center;
        padding: 8px 12px;
        border-radius: 6px;
        cursor: pointer;
        transition: background-color 0.2s ease;
      }

      .checkbox-item:hover {
        background-color: #f0fdf4;
      }

      .checkbox-input {
        appearance: none;
        -webkit-appearance: none;
        -moz-appearance: none;
        margin: 0;
        margin-right: 12px;
        width: 20px;
        height: 20px;
        border: 2px solid #374151;
        border-radius: 4px;
        cursor: pointer;
        position: relative;
        background-color: white;
        transition: all 0.2s ease;
        flex-shrink: 0;
      }

      .checkbox-input:checked {
        background-color: #22C55E;
        border-color: #22C55E;
        background-image: url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3cpath stroke='white' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round' d='m13.854 3.646-7.5 7.5a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6 10.293l7.146-7.147a.5.5 0 0 1 .708.708z'/%3e%3c/svg%3e");
        background-size: 12px 12px;
        background-position: center;
        background-repeat: no-repeat;
      }

      .checkbox-label {
        font-size: 14px;
        color: #374151;
        cursor: pointer;
        user-select: none;
        flex: 1;
        line-height: 1.4;
      }

      .empty-state {
        padding: 20px;
        text-align: center;
        color: #9ca3af;
        font-size: 14px;
        font-style: italic;
      }

      .empty-state-icon {
        font-size: 24px;
        margin-bottom: 8px;
        display: block;
      }
    `;

    if (!document.querySelector("#custom-checkbox-filter-styles")) {
      style.id = "custom-checkbox-filter-styles";
      document.head.appendChild(style);
    }
  }

  private createCheckboxes(): void {
    console.log("Creating checkboxes for values:", this.uniqueValues);

    const container = this.eGui.querySelector("#checkboxContainer");
    if (!container) {
      console.error("Checkbox container not found!");
      return;
    }

    container.innerHTML = "";

    if (this.uniqueValues.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <span class="empty-state-icon">📋</span>
          데이터가 없습니다
        </div>
      `;
      return;
    }

    this.uniqueValues.forEach((value) => {
      const checkboxItem = document.createElement("div");
      checkboxItem.className = "checkbox-item";

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.className = "checkbox-input";
      checkbox.id = `checkbox-${value}-${this.params.colDef.field}`;
      checkbox.checked = this.selectedValues.has(value);

      checkbox.addEventListener("change", (e) => {
        this.handleCheckboxChange(
          value,
          (e.target as HTMLInputElement).checked,
        );
      });

      const label = document.createElement("label");
      label.className = "checkbox-label";
      label.htmlFor = checkbox.id;
      label.textContent = value;

      checkboxItem.appendChild(checkbox);
      checkboxItem.appendChild(label);
      container.appendChild(checkboxItem);
    });
  }

  private handleCheckboxChange(value: string, checked: boolean): void {
    if (checked) {
      this.selectedValues.add(value);
    } else {
      this.selectedValues.delete(value);
    }

    // 필터 변경 콜백 호출
    setTimeout(() => {
      this.params.filterChangedCallback();
    }, 0);
  }

  private selectAll(): void {
    this.selectedValues = new Set(this.uniqueValues);
    this.updateCheckboxes();
    setTimeout(() => {
      this.params.filterChangedCallback();
    }, 0);
  }

  private deselectAll(): void {
    this.selectedValues = new Set();
    this.updateCheckboxes();
    setTimeout(() => {
      this.params.filterChangedCallback();
    }, 0);
  }

  private updateCheckboxes(): void {
    const container = this.eGui.querySelector("#checkboxContainer");
    if (!container) return;

    this.uniqueValues.forEach((value) => {
      const checkbox = container.querySelector(
        `#checkbox-${value}-${this.params.colDef.field}`,
      ) as HTMLInputElement;
      if (checkbox) {
        checkbox.checked = this.selectedValues.has(value);
      }
    });
  }

  getGui(): HTMLElement {
    return this.eGui;
  }

  isFilterActive(): boolean {
    return this.selectedValues.size < this.uniqueValues.length;
  }

  doesFilterPass(params: IDoesFilterPassParams): boolean {
    if (this.selectedValues.size === this.uniqueValues.length) return true;
    const value = String(params.data[this.params.colDef.field] || "");
    return this.selectedValues.has(value);
  }

  getModel(): FilterModel | null {
    if (this.selectedValues.size === this.uniqueValues.length) return null;
    return { selectedValues: Array.from(this.selectedValues) };
  }

  setModel(model: FilterModel | null): void {
    if (model && model.selectedValues) {
      this.selectedValues = new Set(model.selectedValues);
    } else {
      this.selectedValues = new Set(this.uniqueValues);
    }
    if (this.eGui) {
      this.updateCheckboxes();
    }
  }

  afterGuiAttached(): void {}

  onNewRowsLoaded(): void {
    this.extractUniqueValues();
    if (this.eGui) {
      this.createCheckboxes();
    }
  }

  destroy(): void {
    // 스타일 정리는 하지 않음 (다른 필터에서도 사용할 수 있음)
  }

  render() {
    return null;
  }
}
