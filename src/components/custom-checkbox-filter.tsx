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
  private searchTerm: string = "";
  private filteredValues: string[] = [];

  constructor(props: Record<string, unknown>) {
    super(props);
  }

  // Helper function to create safe CSS selector IDs
  private createSafeId(value: string): string {
    // Replace special characters with underscores
    return value.replace(/[^a-zA-Z0-9-_]/g, "_");
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
    this.filteredValues = [...this.uniqueValues];
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
          <div class="action-buttons">
            <button class="filter-btn select-all-btn" id="selectAll">
              <span class="btn-icon">✓</span>
              전체 선택
            </button>
            <button class="filter-btn deselect-all-btn" id="deselectAll">
              <span class="btn-icon">✕</span>
              전체 해제
            </button>
          </div>
          <div class="selected-count" id="selectedCount">
            0개 선택됨
          </div>
          <div class="search-container">
            <input
              type="text"
              class="search-input"
              id="searchInput"
              placeholder="검색..."
              autocomplete="off"
            />
            <button class="clear-search-btn" id="clearSearch" style="display: none;">
              <span class="btn-icon">✕</span>
            </button>
          </div>
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
    const searchInput = this.eGui.querySelector(
      "#searchInput",
    ) as HTMLInputElement;
    const clearSearchBtn = this.eGui.querySelector("#clearSearch");

    if (selectAllBtn) {
      selectAllBtn.addEventListener("click", () => this.selectAll());
    }
    if (deselectAllBtn) {
      deselectAllBtn.addEventListener("click", () => this.deselectAll());
    }
    if (searchInput) {
      searchInput.addEventListener("input", (e) =>
        this.handleSearch((e.target as HTMLInputElement).value),
      );
      searchInput.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
          this.clearSearch();
        }
      });
    }
    if (clearSearchBtn) {
      clearSearchBtn.addEventListener("click", () => this.clearSearch());
    }

    this.createCheckboxes();
    this.updateSelectedCount();
    this.updateButtonStates();
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
        flex-direction: column;
        gap: 12px;
        background: #fafafa;
      }

      .search-container {
        position: relative;
        width: 100%;
      }

      .search-input {
        width: 100%;
        padding: 8px 36px 8px 12px;
        font-size: 14px;
        border: 1px solid #d1d5db;
        border-radius: 8px;
        outline: none;
        transition: all 0.2s ease;
      }

      .search-input:focus {
        border-color: #22c55e;
        box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.1);
      }

      .clear-search-btn {
        position: absolute;
        right: 8px;
        top: 50%;
        transform: translateY(-50%);
        background: none;
        border: none;
        padding: 4px;
        cursor: pointer;
        color: #6b7280;
        transition: color 0.2s ease;
      }

      .clear-search-btn:hover {
        color: #374151;
      }

      .selected-count {
        font-size: 13px;
        color: #6b7280;
        font-weight: 500;
        text-align: center;
      }

      .action-buttons {
        display: flex;
        gap: 8px;
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

      .filter-btn:disabled {
        opacity: 0.5 !important;
        cursor: not-allowed !important;
        transform: none !important;
      }

      .filter-btn:disabled:hover {
        background-color: inherit !important;
        transform: none !important;
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

  private handleSearch(term: string): void {
    this.searchTerm = term.toLowerCase();
    const clearBtn = this.eGui.querySelector("#clearSearch") as HTMLElement;

    if (clearBtn) {
      clearBtn.style.display = term ? "block" : "none";
    }

    if (term) {
      this.filteredValues = this.uniqueValues.filter((value) =>
        value.toLowerCase().includes(this.searchTerm),
      );
    } else {
      this.filteredValues = [...this.uniqueValues];
    }

    this.createCheckboxes();
    this.updateButtonStates();
  }

  private clearSearch(): void {
    const searchInput = this.eGui.querySelector(
      "#searchInput",
    ) as HTMLInputElement;
    if (searchInput) {
      searchInput.value = "";
      this.handleSearch("");
    }
  }

  private updateSelectedCount(): void {
    const countElement = this.eGui.querySelector("#selectedCount");
    if (countElement) {
      const count = this.selectedValues.size;
      const total = this.uniqueValues.length;
      countElement.textContent = `${count}/${total}개 선택됨`;
    }
  }

  private createCheckboxes(): void {
    console.log("Creating checkboxes for values:", this.filteredValues);

    const container = this.eGui.querySelector("#checkboxContainer");
    if (!container) {
      console.error("Checkbox container not found!");
      return;
    }

    container.innerHTML = "";

    if (this.filteredValues.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <span class="empty-state-icon">🔍</span>
          ${this.searchTerm ? "검색 결과가 없습니다" : "데이터가 없습니다"}
        </div>
      `;
      return;
    }

    this.filteredValues.forEach((value) => {
      const checkboxItem = document.createElement("div");
      checkboxItem.className = "checkbox-item";

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.className = "checkbox-input";
      checkbox.id = `checkbox-${this.createSafeId(value)}-${this.createSafeId(this.params.colDef.field)}`;
      checkbox.checked = this.selectedValues.has(value);
      checkbox.setAttribute("data-value", value); // Store original value

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

    this.updateSelectedCount();

    // 필터 변경 콜백 호출
    setTimeout(() => {
      this.params.filterChangedCallback();
    }, 0);
  }

  private selectAll(): void {
    // Don't do anything if no filtered values
    if (this.filteredValues.length === 0) return;

    // Select only filtered values when search is active
    if (this.searchTerm) {
      this.filteredValues.forEach((value) => this.selectedValues.add(value));
    } else {
      this.selectedValues = new Set(this.uniqueValues);
    }
    this.updateCheckboxes();
    this.updateSelectedCount();
    setTimeout(() => {
      this.params.filterChangedCallback();
    }, 0);
  }

  private deselectAll(): void {
    // Don't do anything if no filtered values
    if (this.filteredValues.length === 0) return;

    // Deselect only filtered values when search is active
    if (this.searchTerm) {
      this.filteredValues.forEach((value) => this.selectedValues.delete(value));
    } else {
      this.selectedValues = new Set();
    }
    this.updateCheckboxes();
    this.updateSelectedCount();
    setTimeout(() => {
      this.params.filterChangedCallback();
    }, 0);
  }

  private updateCheckboxes(): void {
    const container = this.eGui.querySelector("#checkboxContainer");
    if (!container) return;

    // Update checkboxes for filtered values
    this.filteredValues.forEach((value) => {
      const safeId = `checkbox-${this.createSafeId(value)}-${this.createSafeId(this.params.colDef.field)}`;
      const checkbox = container.querySelector(
        `#${safeId}`,
      ) as HTMLInputElement;
      if (checkbox) {
        checkbox.checked = this.selectedValues.has(value);
      }
    });
  }

  private updateButtonStates(): void {
    const selectAllBtn = this.eGui.querySelector(
      "#selectAll",
    ) as HTMLButtonElement;
    const deselectAllBtn = this.eGui.querySelector(
      "#deselectAll",
    ) as HTMLButtonElement;

    if (selectAllBtn && deselectAllBtn) {
      const isDisabled = this.filteredValues.length === 0;
      selectAllBtn.disabled = isDisabled;
      deselectAllBtn.disabled = isDisabled;

      // Update button styles when disabled
      if (isDisabled) {
        selectAllBtn.style.opacity = "0.5";
        selectAllBtn.style.cursor = "not-allowed";
        deselectAllBtn.style.opacity = "0.5";
        deselectAllBtn.style.cursor = "not-allowed";
      } else {
        selectAllBtn.style.opacity = "1";
        selectAllBtn.style.cursor = "pointer";
        deselectAllBtn.style.opacity = "1";
        deselectAllBtn.style.cursor = "pointer";
      }
    }
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
      this.clearSearch();
      this.createCheckboxes();
      this.updateSelectedCount();
      this.updateButtonStates();
    }
  }

  destroy(): void {
    // 스타일 정리는 하지 않음 (다른 필터에서도 사용할 수 있음)
  }

  render() {
    return null;
  }
}
