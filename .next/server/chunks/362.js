"use strict";exports.id=362,exports.ids=[362],exports.modules={9037:(e,t,l)=>{l.d(t,{A:()=>d});var a=l(11432),s=l(11417),r=l(26093),i=l(38762),n=l(98194),o=l(29871);class c extends s.Component{constructor(e){super(e),this.uniqueValues=[],this.selectedValues=new Set}init(e){console.log("CheckboxFilter init called",e),this.params=e,this.extractUniqueValues(),this.createGui()}extractUniqueValues(){console.log("Extracting unique values for field:",this.params.colDef.field);let e=[];this.params.api.forEachNode(t=>{if(t.data&&null!=t.data[this.params.colDef.field]){let l;try{l=this.params.getValue(t)}catch(e){console.warn("getValue failed, using direct access:",e),l=t.data[this.params.colDef.field]}null==l&&(l=t.data[this.params.colDef.field]),e.push(String(l||""))}}),this.uniqueValues=[...new Set(e)].sort(),this.selectedValues=new Set(this.uniqueValues),console.log("Unique values:",this.uniqueValues),console.log("Selected values:",Array.from(this.selectedValues))}createGui(){this.eGui=document.createElement("div"),this.eGui.className="custom-checkbox-filter",this.eGui.innerHTML=`
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
    `,this.addStyles();let e=this.eGui.querySelector("#selectAll"),t=this.eGui.querySelector("#deselectAll");e&&e.addEventListener("click",()=>this.selectAll()),t&&t.addEventListener("click",()=>this.deselectAll()),this.createCheckboxes()}addStyles(){let e=document.createElement("style");e.textContent=`
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
    `,document.querySelector("#custom-checkbox-filter-styles")||(e.id="custom-checkbox-filter-styles",document.head.appendChild(e))}createCheckboxes(){console.log("Creating checkboxes for values:",this.uniqueValues);let e=this.eGui.querySelector("#checkboxContainer");if(!e){console.error("Checkbox container not found!");return}if(e.innerHTML="",0===this.uniqueValues.length){e.innerHTML=`
        <div class="empty-state">
          <span class="empty-state-icon">📋</span>
          데이터가 없습니다
        </div>
      `;return}this.uniqueValues.forEach(t=>{let l=document.createElement("div");l.className="checkbox-item";let a=document.createElement("input");a.type="checkbox",a.className="checkbox-input",a.id=`checkbox-${t}-${this.params.colDef.field}`,a.checked=this.selectedValues.has(t),a.addEventListener("change",e=>{this.handleCheckboxChange(t,e.target.checked)});let s=document.createElement("label");s.className="checkbox-label",s.htmlFor=a.id,s.textContent=t,l.appendChild(a),l.appendChild(s),e.appendChild(l)})}handleCheckboxChange(e,t){t?this.selectedValues.add(e):this.selectedValues.delete(e),setTimeout(()=>{this.params.filterChangedCallback()},0)}selectAll(){this.selectedValues=new Set(this.uniqueValues),this.updateCheckboxes(),setTimeout(()=>{this.params.filterChangedCallback()},0)}deselectAll(){this.selectedValues=new Set,this.updateCheckboxes(),setTimeout(()=>{this.params.filterChangedCallback()},0)}updateCheckboxes(){let e=this.eGui.querySelector("#checkboxContainer");e&&this.uniqueValues.forEach(t=>{let l=e.querySelector(`#checkbox-${t}-${this.params.colDef.field}`);l&&(l.checked=this.selectedValues.has(t))})}getGui(){return this.eGui}isFilterActive(){return this.selectedValues.size<this.uniqueValues.length}doesFilterPass(e){if(this.selectedValues.size===this.uniqueValues.length)return!0;let t=String(e.data[this.params.colDef.field]||"");return this.selectedValues.has(t)}getModel(){return this.selectedValues.size===this.uniqueValues.length?null:{selectedValues:Array.from(this.selectedValues)}}setModel(e){e&&e.selectedValues?this.selectedValues=new Set(e.selectedValues):this.selectedValues=new Set(this.uniqueValues),this.eGui&&this.updateCheckboxes()}afterGuiAttached(){}onNewRowsLoaded(){this.extractUniqueValues(),this.eGui&&this.createCheckboxes()}destroy(){}render(){return null}}function d({columnDefs:e,data:t,loading:l=!1,error:n=null,onDragStarted:d,onDragStopped:u,onSelectionChanged:h,pagination:m=!0,paginationPageSize:f=15,onRowDragEnd:p,onCellValueChanged:x}){let g=(0,s.useRef)(null),b=(0,s.useMemo)(()=>({sortable:!0,resizable:!0,minWidth:100,filter:!0,lockPinned:!0}),[]),k=(0,s.useMemo)(()=>(console.log("Registering custom filter component:",c),{checkboxFilter:c}),[]),v=(0,s.useMemo)(()=>{let t=e.map(e=>"checkbox"===e.field?{...e,filter:!1}:!1===e.filter||"agTextColumnFilter"===e.filter||"agNumberColumnFilter"===e.filter?e:{...e,filter:"checkboxFilter",floatingFilter:!1,filterParams:{...e.filterParams}});return console.log("Processed column definitions:",t),t},[e]),w=(0,s.useMemo)(()=>e.filter(e=>e.field).map(e=>({colId:e.field,pinned:e.pinned,flex:e.flex,width:e.width,lockPinned:e.lockPinned})),[e]),y=(0,s.useMemo)(()=>i.z0,[]),C=(0,s.useCallback)(e=>{"checkbox"===e.colDef.field&&e.node.setSelected(!e.node.isSelected())},[]),S=(0,s.useCallback)(e=>{g.current=e.api,g.current?.applyColumnState({state:w,applyOrder:!0})},[w]);return n?(0,a.jsx)("div",{className:"w-full h-[800px] bg-white flex items-center justify-center overflow-y-auto",children:(0,a.jsx)("p",{className:"text-red-500",children:n})}):(0,a.jsx)("div",{className:"ag-theme-material w-full h-full bg-slate-50 rounded-xl overflow-hidden shadow-lg",children:l?(0,a.jsx)("div",{className:"w-full h-full flex items-center justify-center",children:(0,a.jsxs)("div",{className:"flex items-center space-x-3",children:[(0,a.jsx)("div",{className:"w-3 h-3 bg-[#22C55E] rounded-full animate-bounce"}),(0,a.jsx)("div",{className:"w-3 h-3 bg-[#22C55E] rounded-full animate-bounce",style:{animationDelay:"0.1s"}}),(0,a.jsx)("div",{className:"w-3 h-3 bg-[#22C55E] rounded-full animate-bounce",style:{animationDelay:"0.2s"}})]})}):(0,a.jsx)("div",{className:"w-full h-full",children:(0,a.jsx)(r.W6,{theme:o.g,rowData:t,columnDefs:v,defaultColDef:b,components:k,pagination:m,paginationPageSize:f,rowSelection:"multiple",localeText:y,onDragStarted:d,onDragStopped:u,onGridReady:S,onSelectionChanged:h,rowDragManaged:!0,animateRows:!0,getRowId:e=>e.data.id,onRowDragEnd:p,suppressRowClickSelection:!0,onCellClicked:C,onCellValueChanged:x})})})}n.syG.registerModules([n.JKr])},29732:(e,t,l)=>{l.d(t,{A:()=>m});var a=l(11432),s=l(11417),r=l(98194),i=l(34105);let n=(0,i.A)((0,a.jsx)("path",{d:"M10 18h4v-2h-4zM3 6v2h18V6zm3 7h12v-2H6z"}),"FilterList"),o=(0,i.A)((0,a.jsx)("path",{d:"M10 6 8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"}),"ChevronRight"),c=(0,i.A)((0,a.jsx)("path",{d:"M15.41 7.41 14 6l-6 6 6 6 1.41-1.41L10.83 12z"}),"ChevronLeft"),d=(0,i.A)((0,a.jsx)("path",{d:"M12 5V2L8 6l4 4V7c3.31 0 6 2.69 6 6 0 2.97-2.17 5.43-5 5.91v2.02c3.95-.49 7-3.85 7-7.93 0-4.42-3.58-8-8-8m-6 8c0-1.65.67-3.15 1.76-4.24L6.34 7.34C4.9 8.79 4 10.79 4 13c0 4.08 3.05 7.44 7 7.93v-2.02c-2.83-.48-5-2.94-5-5.91"}),"RestartAlt");l(71251);var u=l(9037);function h(e){return new Date(e).toISOString().slice(0,10)}function m({columnDefs:e,data:t=[],loading:l=!1,error:r=null,onDragStarted:i,onDragStopped:m,onResetColumnOrder:f,onSelectionChanged:p,searchDateField:x}){let[g,b]=(0,s.useState)(""),[k,v]=(0,s.useState)(""),[w,y]=(0,s.useState)(""),[C,S]=(0,s.useState)(!1),[N,j]=(0,s.useState)(!0),V=(0,s.useMemo)(()=>t.filter(t=>{let l=!g||e.some(e=>{let l=e.field;if(!l)return!1;let a=t[l];return a&&a.toString().toLowerCase().includes(g.toLowerCase())});if(x){let e=h(t[x]),a=k?h(k):null,s=w?h(w):null;if(a&&s)return l&&e>=a&&e<=s;if(a)return l&&e>=a;if(s)return l&&e<=s}return l}),[t,g,k,w,e,x]);return(0,a.jsxs)("div",{className:"flex flex-col md:flex-row w-full h-[800px] bg-transparent rounded-xl overflow-hidden shadow-lg  gap-6",children:[(0,a.jsxs)("button",{onClick:()=>S(!C),className:"md:hidden flex items-center justify-center gap-2 mb-4 px-4 py-2 bg-white rounded-lg shadow-sm text-gray-700 hover:bg-gray-100 transition-colors",children:[(0,a.jsx)(n,{className:"w-5 h-5"}),(0,a.jsxs)("span",{children:["필터 ",C?"숨기기":"보기"]})]}),(0,a.jsxs)("div",{className:`relative transition-all duration-300 p-6 space-y-6
        ${C?"block":"hidden md:block"}
        ${N?"w-12 bg-transparent":"w-full md:w-80 bg-white rounded-xl shadow-sm"}
        md:shrink-0 overflow-hidden`,children:[(0,a.jsx)("button",{onClick:()=>j(e=>!e),className:"absolute right-2 top-2 w-8 h-8 bg-white text-gray-600 rounded-full shadow-md hover:bg-gray-300 transition z-10 hidden md:block",children:N?(0,a.jsx)(o,{}):(0,a.jsx)(c,{})}),!N&&(0,a.jsxs)("div",{children:[(0,a.jsx)("h2",{className:"text-lg font-semibold text-gray-800 mb-4",children:"필터"}),(0,a.jsxs)("div",{className:"space-y-5",children:[(0,a.jsxs)("div",{children:[(0,a.jsx)("label",{className:"block text-sm font-medium text-gray-600 mb-2",children:"검색어"}),(0,a.jsx)("input",{type:"text",placeholder:"검색어를 입력하세요",className:"w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200",value:g,onChange:e=>b(e.target.value)})]}),(0,a.jsxs)("div",{className:"space-y-4",children:[(0,a.jsx)("label",{className:"block text-sm font-medium text-gray-600 mb-2",children:"조회 기간"}),(0,a.jsx)("input",{type:"date",className:"w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 mb-3",value:k,onChange:e=>v(e.target.value)}),(0,a.jsx)("input",{type:"date",className:"w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200",value:w,onChange:e=>y(e.target.value)})]}),f&&(0,a.jsxs)("button",{onClick:f,className:"w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors",children:[(0,a.jsx)(d,{className:"w-5 h-5"}),(0,a.jsx)("span",{children:"컬럼 순서 초기화"})]})]})]})]}),(0,a.jsx)("div",{className:"flex-1 bg-white rounded-xl shadow-sm overflow-hidden min-h-[400px]",children:(0,a.jsx)(u.A,{columnDefs:e,data:V,loading:l,error:r,onDragStarted:i,onDragStopped:m,onSelectionChanged:p,pagination:!1})})]})}r.syG.registerModules([r.JKr])},42623:(e,t,l)=>{l.d(t,{Kg:()=>o,eg:()=>n,f3:()=>i,gt:()=>r,sg:()=>s,ye:()=>a});let a=e=>e.value?new Intl.NumberFormat("ko-KR",{style:"currency",currency:"KRW"}).format(e.value):"",s=e=>{if(null===e.value||void 0===e.value||""===e.value)return"";let t=Number(e.value);if(isNaN(t))return"";let l=!Number.isInteger(t);return new Intl.NumberFormat("en-US",{style:"currency",currency:"USD",minimumFractionDigits:2*!!l,maximumFractionDigits:2*!!l}).format(t)},r=e=>e.value?new Intl.NumberFormat("ko-KR",{style:"currency",currency:"KRW",minimumFractionDigits:0,maximumFractionDigits:0}).format(e.value)+"/kg":"",i=e=>e.value?new Date(e.value).toLocaleDateString("ko-KR",{month:"long",day:"numeric",weekday:"short"}):"",n=e=>{if(null===e.value||void 0===e.value||""===e.value)return"";let t=Number(e.value);if(isNaN(t))return"";let l=Number(t.toFixed(1));return Number.isInteger(l)?l.toString():l.toFixed(1)},o=e=>{if(!e.value)return"";let t=new Date(e.value),l=t.getFullYear(),a=String(t.getMonth()+1).padStart(2,"0"),s=String(t.getDate()).padStart(2,"0");return`${l}/${a}/${s}`}}};
