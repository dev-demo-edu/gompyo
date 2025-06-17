"use strict";exports.id=37,exports.ids=[37],exports.modules={9037:(e,t,l)=>{l.d(t,{A:()=>d});var s=l(11432),a=l(11417),i=l(26093),r=l(38762),o=l(98194),n=l(29871);class c extends a.Component{constructor(e){super(e),this.uniqueValues=[],this.selectedValues=new Set,this.searchTerm="",this.filteredValues=[]}createSafeId(e){return e.replace(/[^a-zA-Z0-9-_]/g,"_")}init(e){console.log("CheckboxFilter init called",e),this.params=e,this.extractUniqueValues(),this.createGui()}extractUniqueValues(){console.log("Extracting unique values for field:",this.params.colDef.field);let e=[];this.params.api.forEachNode(t=>{if(t.data&&null!=t.data[this.params.colDef.field]){let l;try{l=this.params.getValue(t)}catch(e){console.warn("getValue failed, using direct access:",e),l=t.data[this.params.colDef.field]}null==l&&(l=t.data[this.params.colDef.field]),e.push(String(l||""))}}),this.uniqueValues=[...new Set(e)].sort(),this.filteredValues=[...this.uniqueValues],this.selectedValues=new Set(this.uniqueValues),console.log("Unique values:",this.uniqueValues),console.log("Selected values:",Array.from(this.selectedValues))}createGui(){this.eGui=document.createElement("div"),this.eGui.className="custom-checkbox-filter",this.eGui.innerHTML=`
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
    `,this.addStyles();let e=this.eGui.querySelector("#selectAll"),t=this.eGui.querySelector("#deselectAll"),l=this.eGui.querySelector("#searchInput"),s=this.eGui.querySelector("#clearSearch");e&&e.addEventListener("click",()=>this.selectAll()),t&&t.addEventListener("click",()=>this.deselectAll()),l&&(l.addEventListener("input",e=>this.handleSearch(e.target.value)),l.addEventListener("keydown",e=>{"Escape"===e.key&&this.clearSearch()})),s&&s.addEventListener("click",()=>this.clearSearch()),this.createCheckboxes(),this.updateSelectedCount(),this.updateButtonStates()}addStyles(){let e=document.createElement("style");e.textContent=`
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
    `,document.querySelector("#custom-checkbox-filter-styles")||(e.id="custom-checkbox-filter-styles",document.head.appendChild(e))}handleSearch(e){this.searchTerm=e.toLowerCase();let t=this.eGui.querySelector("#clearSearch");t&&(t.style.display=e?"block":"none"),e?this.filteredValues=this.uniqueValues.filter(e=>e.toLowerCase().includes(this.searchTerm)):this.filteredValues=[...this.uniqueValues],this.createCheckboxes(),this.updateButtonStates()}clearSearch(){let e=this.eGui.querySelector("#searchInput");e&&(e.value="",this.handleSearch(""))}updateSelectedCount(){let e=this.eGui.querySelector("#selectedCount");if(e){let t=this.selectedValues.size,l=this.uniqueValues.length;e.textContent=`${t}/${l}개 선택됨`}}createCheckboxes(){console.log("Creating checkboxes for values:",this.filteredValues);let e=this.eGui.querySelector("#checkboxContainer");if(!e){console.error("Checkbox container not found!");return}if(e.innerHTML="",0===this.filteredValues.length){e.innerHTML=`
        <div class="empty-state">
          <span class="empty-state-icon">🔍</span>
          ${this.searchTerm?"검색 결과가 없습니다":"데이터가 없습니다"}
        </div>
      `;return}this.filteredValues.forEach(t=>{let l=document.createElement("div");l.className="checkbox-item";let s=document.createElement("input");s.type="checkbox",s.className="checkbox-input",s.id=`checkbox-${this.createSafeId(t)}-${this.createSafeId(this.params.colDef.field)}`,s.checked=this.selectedValues.has(t),s.setAttribute("data-value",t),s.addEventListener("change",e=>{this.handleCheckboxChange(t,e.target.checked)});let a=document.createElement("label");a.className="checkbox-label",a.htmlFor=s.id,a.textContent=t,l.appendChild(s),l.appendChild(a),e.appendChild(l)})}handleCheckboxChange(e,t){t?this.selectedValues.add(e):this.selectedValues.delete(e),this.updateSelectedCount(),setTimeout(()=>{this.params.filterChangedCallback()},0)}selectAll(){0!==this.filteredValues.length&&(this.searchTerm?this.filteredValues.forEach(e=>this.selectedValues.add(e)):this.selectedValues=new Set(this.uniqueValues),this.updateCheckboxes(),this.updateSelectedCount(),setTimeout(()=>{this.params.filterChangedCallback()},0))}deselectAll(){0!==this.filteredValues.length&&(this.searchTerm?this.filteredValues.forEach(e=>this.selectedValues.delete(e)):this.selectedValues=new Set,this.updateCheckboxes(),this.updateSelectedCount(),setTimeout(()=>{this.params.filterChangedCallback()},0))}updateCheckboxes(){let e=this.eGui.querySelector("#checkboxContainer");e&&this.filteredValues.forEach(t=>{let l=`checkbox-${this.createSafeId(t)}-${this.createSafeId(this.params.colDef.field)}`,s=e.querySelector(`#${l}`);s&&(s.checked=this.selectedValues.has(t))})}updateButtonStates(){let e=this.eGui.querySelector("#selectAll"),t=this.eGui.querySelector("#deselectAll");if(e&&t){let l=0===this.filteredValues.length;e.disabled=l,t.disabled=l,l?(e.style.opacity="0.5",e.style.cursor="not-allowed",t.style.opacity="0.5",t.style.cursor="not-allowed"):(e.style.opacity="1",e.style.cursor="pointer",t.style.opacity="1",t.style.cursor="pointer")}}getGui(){return this.eGui}isFilterActive(){return this.selectedValues.size<this.uniqueValues.length}doesFilterPass(e){if(this.selectedValues.size===this.uniqueValues.length)return!0;let t=String(e.data[this.params.colDef.field]||"");return this.selectedValues.has(t)}getModel(){return this.selectedValues.size===this.uniqueValues.length?null:{selectedValues:Array.from(this.selectedValues)}}setModel(e){e&&e.selectedValues?this.selectedValues=new Set(e.selectedValues):this.selectedValues=new Set(this.uniqueValues),this.eGui&&this.updateCheckboxes()}afterGuiAttached(){}onNewRowsLoaded(){this.extractUniqueValues(),this.eGui&&(this.clearSearch(),this.createCheckboxes(),this.updateSelectedCount(),this.updateButtonStates())}destroy(){}render(){return null}}function d({columnDefs:e,data:t,loading:l=!1,error:o=null,onDragStarted:d,onDragStopped:u,onSelectionChanged:h,pagination:p=!0,paginationPageSize:f=15,onRowDragEnd:b,onCellValueChanged:x,onGridReady:m,rowSelection:g="multiple",suppressRowClickSelection:k=!0}){let y=(0,a.useRef)(null),w=(0,a.useMemo)(()=>({sortable:!0,resizable:!0,minWidth:100,filter:!0,lockPinned:!0}),[]),S=(0,a.useMemo)(()=>(console.log("Registering custom filter component:",c),{checkboxFilter:c}),[]),C=(0,a.useMemo)(()=>{let t=e.map(e=>"checkbox"===e.field?{...e,filter:!1}:!1===e.filter||"agTextColumnFilter"===e.filter||"agNumberColumnFilter"===e.filter?e:{...e,filter:"checkboxFilter",floatingFilter:!1,filterParams:{...e.filterParams}});return console.log("Processed column definitions:",t),t},[e]),v=(0,a.useMemo)(()=>e.filter(e=>e.field).map(e=>({colId:e.field,pinned:e.pinned,flex:e.flex,width:e.width,lockPinned:e.lockPinned})),[e]),V=(0,a.useMemo)(()=>r.z0,[]),q=(0,a.useCallback)(e=>{"checkbox"===e.colDef.field&&e.node.setSelected(!e.node.isSelected())},[]),E=(0,a.useCallback)(e=>{y.current=e.api,y.current?.applyColumnState({state:v,applyOrder:!0}),m&&m(e.api)},[v,m]);return o?(0,s.jsx)("div",{className:"w-full h-[800px] md:h-full bg-white flex items-center justify-center overflow-y-auto",children:(0,s.jsx)("p",{className:"text-red-500",children:o})}):(0,s.jsx)("div",{className:"ag-theme-material w-full h-full bg-slate-50 rounded-xl overflow-hidden shadow-lg",children:l?(0,s.jsx)("div",{className:"w-full h-full flex items-center justify-center",children:(0,s.jsxs)("div",{className:"flex items-center space-x-3",children:[(0,s.jsx)("div",{className:"w-3 h-3 bg-[#22C55E] rounded-full animate-bounce"}),(0,s.jsx)("div",{className:"w-3 h-3 bg-[#22C55E] rounded-full animate-bounce",style:{animationDelay:"0.1s"}}),(0,s.jsx)("div",{className:"w-3 h-3 bg-[#22C55E] rounded-full animate-bounce",style:{animationDelay:"0.2s"}})]})}):(0,s.jsx)("div",{className:"w-full h-full",children:(0,s.jsx)(i.W6,{theme:n.g,rowData:t,columnDefs:C,defaultColDef:w,components:S,pagination:p,paginationPageSize:f,rowSelection:g,localeText:V,onDragStarted:d,onDragStopped:u,onGridReady:E,onSelectionChanged:h,rowDragManaged:!0,animateRows:!0,getRowId:e=>e.data.id,onRowDragEnd:b,suppressRowClickSelection:k,onCellClicked:q,onCellValueChanged:x})})})}o.syG.registerModules([o.JKr])}};
