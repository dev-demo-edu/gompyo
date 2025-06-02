(()=>{var e={};e.id=884,e.ids=[884],e.modules={3295:e=>{"use strict";e.exports=require("next/dist/server/app-render/after-task-async-storage.external.js")},3814:(e,t,a)=>{"use strict";a.r(t),a.d(t,{"003a3fcd93b09c7d4d5916de8b32dc274ca38d5936":()=>u,"00475400abf1030f4fb42cd476838e3bfe26e9575f":()=>d,"005ee17e17057c82c2cee8c9e0e52c16b4d9064567":()=>g,"4020a0eb192e1e303aed69c281cc5f68a46ea32b38":()=>x,"4025f9be5a06ab47708f7f08256546c7ba143aa9d4":()=>h,"40498375e6fe632d4efc7107c83ad9ef4ada7778b6":()=>m,"405470c648defd4816fe7ed26ab84ea8d3d8a0dd5a":()=>c,"409d09bb265b0148e1b0d556f61d2572e429fd0863":()=>f,"40bc1f4cd6969e4c7a0d7beace64a197e803791c74":()=>p,"608131b08c4b49f8eb10bde6ce04186795f73ee76e":()=>b,"60d1a6bc85cbb1fb21e185207274eb051051407ed5":()=>w});var r=a(17464);a(55414);var n=a(13913),l=a(8613),s=a(18591),i=a(98149),o=a(26763);async function d(){return await n.db.select().from(l.cashflows).orderBy((0,s.Y)(l.cashflows.date),(0,s.Y)(l.cashflows.priority))}async function c(e){return(await n.db.select().from(l.cashflows).where((0,i.eq)(l.cashflows.id,e)))[0]}async function u(){return await n.db.select().from(l.companies).orderBy((0,s.Y)(l.companies.name))}async function f(e){let t=await n.db.select().from(l.cashflows).where((0,i.Uo)((0,i.eq)(l.cashflows.date,e.date),(0,i.eq)(l.cashflows.type,e.type),(0,i.eq)(l.cashflows.companyId,e.companyId))),a=null;return t.length+1}async function h(e){let t=await f(e);return await n.db.insert(l.cashflows).values({...e,id:(0,o.Ak)(),createdAt:new Date().toISOString(),updatedAt:new Date().toISOString(),priority:t})}async function p(e){let t=await n.db.delete(l.cashflows).where((0,i.RV)(l.cashflows.id,e));return await g(),t}async function m(e){for(let t of e)await n.db.update(l.cashflows).set({priority:t.priority}).where((0,i.eq)(l.cashflows.id,t.id))}async function b(e,t){return await n.db.update(l.companies).set({companyBalance:e}).where((0,i.eq)(l.companies.id,t))}async function x(e){let t=await n.db.select().from(l.cashflows).where((0,i.Uo)((0,i.eq)(l.cashflows.date,e.date),(0,i.eq)(l.cashflows.type,e.type),(0,i.eq)(l.cashflows.companyId,e.companyId))).orderBy((0,s.Y)(l.cashflows.priority));for(let e=0;e<t.length;e++)await n.db.update(l.cashflows).set({priority:e+1}).where((0,i.eq)(l.cashflows.id,t[e].id))}async function g(){let e=await n.db.select().from(l.cashflows),t=new Map;for(let a of e){let e=`${a.companyId}_${a.type}_${a.date}`;t.has(e)||t.set(e,[]),t.get(e).push(a)}for(let e of t.values()){e.sort((e,t)=>(e.priority??0)-(t.priority??0));for(let t=0;t<e.length;t++)await n.db.update(l.cashflows).set({priority:t+1}).where((0,i.eq)(l.cashflows.id,e[t].id))}}async function w(e,t){let a=await c(t),r=a?.type!==e.type,s=a?.date!==e.date,o=a?.priority;return(r||s)&&(o=await f(e)),await n.db.update(l.cashflows).set({...e,priority:o,updatedAt:new Date().toISOString()}).where((0,i.eq)(l.cashflows.id,t)),a&&(r||s)&&(await x(a),await x(e)),await n.db.select().from(l.cashflows).where((0,i.eq)(l.cashflows.id,t)).then(e=>e[0])}(0,a(1634).D)([d,c,u,f,h,p,m,b,x,g,w]),(0,r.A)(d,"00475400abf1030f4fb42cd476838e3bfe26e9575f",null),(0,r.A)(c,"405470c648defd4816fe7ed26ab84ea8d3d8a0dd5a",null),(0,r.A)(u,"003a3fcd93b09c7d4d5916de8b32dc274ca38d5936",null),(0,r.A)(f,"409d09bb265b0148e1b0d556f61d2572e429fd0863",null),(0,r.A)(h,"4025f9be5a06ab47708f7f08256546c7ba143aa9d4",null),(0,r.A)(p,"40bc1f4cd6969e4c7a0d7beace64a197e803791c74",null),(0,r.A)(m,"40498375e6fe632d4efc7107c83ad9ef4ada7778b6",null),(0,r.A)(b,"608131b08c4b49f8eb10bde6ce04186795f73ee76e",null),(0,r.A)(x,"4020a0eb192e1e303aed69c281cc5f68a46ea32b38",null),(0,r.A)(g,"005ee17e17057c82c2cee8c9e0e52c16b4d9064567",null),(0,r.A)(w,"60d1a6bc85cbb1fb21e185207274eb051051407ed5",null)},9037:(e,t,a)=>{"use strict";a.d(t,{A:()=>c});var r=a(11432),n=a(11417),l=a(26093),s=a(38762),i=a(98194),o=a(29871);class d extends n.Component{constructor(e){super(e),this.uniqueValues=[],this.selectedValues=new Set}init(e){console.log("CheckboxFilter init called",e),this.params=e,this.extractUniqueValues(),this.createGui()}extractUniqueValues(){console.log("Extracting unique values for field:",this.params.colDef.field);let e=[];this.params.api.forEachNode(t=>{if(t.data&&null!=t.data[this.params.colDef.field]){let a;try{a=this.params.getValue(t)}catch(e){console.warn("getValue failed, using direct access:",e),a=t.data[this.params.colDef.field]}null==a&&(a=t.data[this.params.colDef.field]),e.push(String(a||""))}}),this.uniqueValues=[...new Set(e)].sort(),this.selectedValues=new Set(this.uniqueValues),console.log("Unique values:",this.uniqueValues),console.log("Selected values:",Array.from(this.selectedValues))}createGui(){this.eGui=document.createElement("div"),this.eGui.className="custom-checkbox-filter",this.eGui.innerHTML=`
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
      `;return}this.uniqueValues.forEach(t=>{let a=document.createElement("div");a.className="checkbox-item";let r=document.createElement("input");r.type="checkbox",r.className="checkbox-input",r.id=`checkbox-${t}-${this.params.colDef.field}`,r.checked=this.selectedValues.has(t),r.addEventListener("change",e=>{this.handleCheckboxChange(t,e.target.checked)});let n=document.createElement("label");n.className="checkbox-label",n.htmlFor=r.id,n.textContent=t,a.appendChild(r),a.appendChild(n),e.appendChild(a)})}handleCheckboxChange(e,t){t?this.selectedValues.add(e):this.selectedValues.delete(e),setTimeout(()=>{this.params.filterChangedCallback()},0)}selectAll(){this.selectedValues=new Set(this.uniqueValues),this.updateCheckboxes(),setTimeout(()=>{this.params.filterChangedCallback()},0)}deselectAll(){this.selectedValues=new Set,this.updateCheckboxes(),setTimeout(()=>{this.params.filterChangedCallback()},0)}updateCheckboxes(){let e=this.eGui.querySelector("#checkboxContainer");e&&this.uniqueValues.forEach(t=>{let a=e.querySelector(`#checkbox-${t}-${this.params.colDef.field}`);a&&(a.checked=this.selectedValues.has(t))})}getGui(){return this.eGui}isFilterActive(){return this.selectedValues.size<this.uniqueValues.length}doesFilterPass(e){if(this.selectedValues.size===this.uniqueValues.length)return!0;let t=String(e.data[this.params.colDef.field]||"");return this.selectedValues.has(t)}getModel(){return this.selectedValues.size===this.uniqueValues.length?null:{selectedValues:Array.from(this.selectedValues)}}setModel(e){e&&e.selectedValues?this.selectedValues=new Set(e.selectedValues):this.selectedValues=new Set(this.uniqueValues),this.eGui&&this.updateCheckboxes()}afterGuiAttached(){}onNewRowsLoaded(){this.extractUniqueValues(),this.eGui&&this.createCheckboxes()}destroy(){}render(){return null}}function c({columnDefs:e,data:t,loading:a=!1,error:i=null,onDragStarted:c,onDragStopped:u,onSelectionChanged:f,pagination:h=!0,paginationPageSize:p=15,onRowDragEnd:m,onCellValueChanged:b}){let x=(0,n.useRef)(null),g=(0,n.useMemo)(()=>({sortable:!0,resizable:!0,minWidth:100,filter:!0,lockPinned:!0}),[]),w=(0,n.useMemo)(()=>(console.log("Registering custom filter component:",d),{checkboxFilter:d}),[]),y=(0,n.useMemo)(()=>{let t=e.map(e=>"checkbox"===e.field?{...e,filter:!1}:!1===e.filter||"agTextColumnFilter"===e.filter||"agNumberColumnFilter"===e.filter?e:{...e,filter:"checkboxFilter",floatingFilter:!1,filterParams:{...e.filterParams}});return console.log("Processed column definitions:",t),t},[e]),v=(0,n.useMemo)(()=>e.filter(e=>e.field).map(e=>({colId:e.field,pinned:e.pinned,flex:e.flex,width:e.width,lockPinned:e.lockPinned})),[e]),k=(0,n.useMemo)(()=>s.z0,[]),C=(0,n.useCallback)(e=>{"checkbox"===e.colDef.field&&e.node.setSelected(!e.node.isSelected())},[]),S=(0,n.useCallback)(e=>{x.current=e.api,x.current?.applyColumnState({state:v,applyOrder:!0})},[v]);return i?(0,r.jsx)("div",{className:"w-full h-[800px] bg-white flex items-center justify-center overflow-y-auto",children:(0,r.jsx)("p",{className:"text-red-500",children:i})}):(0,r.jsx)("div",{className:"ag-theme-material w-full h-full bg-slate-50 rounded-xl overflow-hidden shadow-lg",children:a?(0,r.jsx)("div",{className:"w-full h-full flex items-center justify-center",children:(0,r.jsxs)("div",{className:"flex items-center space-x-3",children:[(0,r.jsx)("div",{className:"w-3 h-3 bg-[#22C55E] rounded-full animate-bounce"}),(0,r.jsx)("div",{className:"w-3 h-3 bg-[#22C55E] rounded-full animate-bounce",style:{animationDelay:"0.1s"}}),(0,r.jsx)("div",{className:"w-3 h-3 bg-[#22C55E] rounded-full animate-bounce",style:{animationDelay:"0.2s"}})]})}):(0,r.jsx)("div",{className:"w-full h-full",children:(0,r.jsx)(l.W6,{theme:o.g,rowData:t,columnDefs:y,defaultColDef:g,components:w,pagination:h,paginationPageSize:p,rowSelection:"multiple",localeText:k,onDragStarted:c,onDragStopped:u,onGridReady:S,onSelectionChanged:f,rowDragManaged:!0,animateRows:!0,getRowId:e=>e.data.id,onRowDragEnd:m,suppressRowClickSelection:!0,onCellClicked:C,onCellValueChanged:b})})})}i.syG.registerModules([i.JKr])},9367:(e,t,a)=>{"use strict";a.d(t,{default:()=>r});let r=(0,a(73602).registerClientReference)(function(){throw Error("Attempted to call the default export of \"/Users/kang-yean-woo/gompyo/src/containers/cashflow/cashflow.tsx\" from the server, but it's on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.")},"/Users/kang-yean-woo/gompyo/src/containers/cashflow/cashflow.tsx","default")},10846:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},19121:e=>{"use strict";e.exports=require("next/dist/server/app-render/action-async-storage.external.js")},29294:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-async-storage.external.js")},33873:e=>{"use strict";e.exports=require("path")},35647:(e,t,a)=>{"use strict";a.d(t,{default:()=>Q});var r=a(11432),n=a(25867),l=a(82423),s=a(9037),i=a(11417),o=a(32246),d=a(90714);let c=(0,d.eU)([]),u=(0,d.eU)(""),f=(0,d.eU)(e=>{let t=e(c),a=e(u);return t.filter(e=>e.companyId===a)}),h=(0,d.eU)(0),p=(0,d.eU)([]),m=(0,d.eU)([]),b=(0,d.eU)([]),x=(0,d.eU)(e=>{let t=e(u),a=e(p).find(e=>e.id===t);return a?.companyBalance??0}),g=(0,d.eU)(null,(e,t,a)=>{let r=e(u);t(p,e=>e.map(e=>e.id===r?{...e,companyBalance:a}:e))}),w=(0,d.eU)(!1);var y=a(84245),v=a(63016);let k=(0,v.createServerReference)("40498375e6fe632d4efc7107c83ad9ef4ada7778b6",v.callServer,void 0,v.findSourceMapURL,"updateCashflowPriorities");v.callServer,v.findSourceMapURL;var C=a(42623);function S(e,t){let a=t;return e.map(e=>(a+=e.amount,{...e,company:e.counterparty,total:a}))}function j(){let e=(0,o.md)(f);(0,o.md)(h);let t=(0,o.Xr)(c),a=(0,o.Xr)(m),n=(0,o.Xr)(b),l=(0,o.md)(x),d=(0,o.md)(w);(0,i.useRef)(null);let[u,p]=(0,i.useState)(!1),g=async a=>{let r=a.node.data.type,n=a.node.data.date,l=[];a.api.forEachNodeAfterFilterAndSort(e=>{let t=e.data;t.type===r&&t.date===n&&l.push(t)});let s=l.map((e,t)=>({...e,priority:l.length>1?t+1:null}));t([...e.filter(e=>e.date!==n||e.type!==r),...s].sort((e,t)=>"balance-row"===e.id?-1:"balance-row"===t.id?1:e.date.localeCompare(t.date))),await k(s)},v=async a=>{let r=[];a.api.forEachNodeAfterFilterAndSort(e=>{r.push(e.data)});let n={};r.forEach(e=>{let t=`${e.date}-${e.type}`;n[t]||(n[t]=[]),n[t].push(e)});let l=[];Object.values(n).forEach(e=>{let t=e.map((t,a)=>({...t,priority:e.length>1?a+1:null}));l.push(...t)}),t(e.filter(e=>!l.some(t=>t.id===e.id)).concat(l).sort((e,t)=>"balance-row"===e.id?-1:"balance-row"===t.id?1:e.date.localeCompare(t.date))),await k(l)},j=[{headerName:"",field:"dragHandle",width:70,minWidth:70,pinned:"left",lockPinned:!0,suppressMovable:!0,filter:!1,sortable:!1,rowDrag:e=>"balance-row"!==e.data.id,cellRenderer:()=>"",hide:!d,suppressHeaderMenuButton:!0},{headerName:"",checkboxSelection:e=>"balance-row"!==e.data.id,field:"checkbox",minWidth:50,flex:1,headerCheckboxSelection:!0,filter:!1,pinned:"left",lockPinned:!0,width:70,hide:d,suppressHeaderMenuButton:!0},{headerName:"날짜",field:"date",minWidth:150,flex:1,filter:!1,sortable:!1,valueFormatter:C.f3,suppressHeaderMenuButton:!0},{headerName:"업체",field:"company",minWidth:120,flex:1,filter:!1,sortable:!1,suppressHeaderMenuButton:!0},{headerName:"금액",field:"amount",minWidth:120,flex:1,filter:!1,sortable:!1,valueFormatter:C.eg,suppressHeaderMenuButton:!0},{headerName:"합계",field:"total",minWidth:120,flex:1,filter:!1,sortable:!1,valueFormatter:C.eg,suppressHeaderMenuButton:!0},{headerName:"우선순위",field:"priority",minWidth:120,flex:1,filter:!1,sortable:!1,cellRenderer:e=>{let{date:t,type:a}=e.data,r=[];return e.api.forEachNode(e=>{e.data&&"balance-row"!==e.data.id&&r.push(e.data)}),r.filter(e=>e.date===t&&e.type===a).length>1?e.value:""},suppressHeaderMenuButton:!0}],A=(0,i.useMemo)(()=>S(e.filter(e=>"expense"===e.type),0),[e]),N={id:"balance-row",date:"",companyId:"balance-row",amount:l,priority:null,type:"income",counterparty:"잔액",createdAt:"",updatedAt:""},q=(0,i.useMemo)(()=>S([N,...e].filter(e=>"income"===e.type),0),[e,l]);return(0,r.jsx)("div",{className:"h-[90vh] flex flex-col overflow-hidden ",children:(0,r.jsxs)("div",{className:"flex flex-col md:flex-row w-full flex-1 gap-x-6 h-full",children:[(0,r.jsxs)("div",{className:"w-full h-full flex flex-col overflow-hidden",children:[(0,r.jsx)("div",{className:"flex flex-row justify-between h-[44px]",children:(0,r.jsx)(y.A,{className:"p-2",variant:"h6",children:"지출"})}),(0,r.jsx)("div",{style:{height:"100%",width:"100%"},children:(0,r.jsx)(s.A,{columnDefs:j,data:A,onSelectionChanged:e=>{a(e.api.getSelectedRows().filter(e=>"balance-row"!==e.id))},onRowDragEnd:g,onDragStopped:v,pagination:!1,loading:u})})]}),(0,r.jsxs)("div",{className:"w-full h-full flex flex-col",children:[(0,r.jsxs)("div",{className:"flex flex-row justify-between h-[44px]",children:[(0,r.jsx)(y.A,{className:"p-2",variant:"h6",children:"수금"}),(0,r.jsx)("div",{className:"flex flex-row justify-between",children:(0,r.jsx)(y.A,{className:"text-right font-extralight text-gray-500 pb-2 ",sx:{fontSize:"12px",verticalAlign:"bottom",display:"flex",alignItems:"flex-end"},children:"* 금액 단위: 100만원"})})]}),(0,r.jsx)("div",{style:{height:"100%",width:"100%"},children:(0,r.jsx)(s.A,{columnDefs:j,data:q,onSelectionChanged:e=>{n(e.api.getSelectedRows().filter(e=>"balance-row"!==e.id))},onRowDragEnd:g,onDragStopped:v,pagination:!1,loading:u})})]})]})})}v.callServer,v.findSourceMapURL;var A=a(82472),N=a(20245),q=a(2494),z=a(74247),E=a(14368),V=a(68634);let R=(0,v.createServerReference)("4025f9be5a06ab47708f7f08256546c7ba143aa9d4",v.callServer,void 0,v.findSourceMapURL,"addCashflow"),D=V.z.string().superRefine((e,t)=>{let a=/^-?\d+(\.\d)?$/;if(isNaN(Number(e))){t.addIssue({code:V.z.ZodIssueCode.custom,message:"유효한 숫자여야 합니다."});return}if(/^-?\d+\.\d{2,}$/.test(e)){t.addIssue({code:V.z.ZodIssueCode.custom,message:"숫자는 소수점 한 자리까지만 입력 가능합니다."});return}if(/^[-+]?\d*(\.\d+)?([eE].+)?$/.test(e)&&!a.test(e)||!a.test(e)){t.addIssue({code:V.z.ZodIssueCode.custom,message:"유효한 숫자여야 합니다."});return}}).transform(e=>parseFloat(e)),I=V.z.string().superRefine((e,t)=>{let a=!isNaN(Number(e)),r=/^-?\d+(\.\d)?$/;if(!a){t.addIssue({code:V.z.ZodIssueCode.custom,message:"유효한 숫자여야 합니다."});return}if(0>parseFloat(e)){t.addIssue({code:V.z.ZodIssueCode.custom,message:"0 이상의 숫자만 입력 가능합니다."});return}if(/^-?\d+\.\d{2,}$/.test(e)){t.addIssue({code:V.z.ZodIssueCode.custom,message:"숫자는 소수점 한 자리까지만 입력 가능합니다."});return}if(/^[-+]?\d*(\.\d+)?([eE].+)?$/.test(e)&&!r.test(e)||!r.test(e)){t.addIssue({code:V.z.ZodIssueCode.custom,message:"유효한 숫자여야 합니다."});return}}).transform(e=>parseFloat(e)),M=V.z.object({date:V.z.string().min(1,"날짜를 입력해주세요."),counterparty:V.z.string().min(1,"업체를 입력해주세요."),amount:I,type:V.z.string()}),U=[{name:"type",label:"타입",type:"select",required:!0,options:[{label:"수금",value:"income"},{label:"지출",value:"expense"}]},{name:"date",label:"날짜",type:"date",required:!0},{name:"counterparty",label:"업체",type:"text",required:!0},{name:"amount",label:"금액",type:"text",required:!0,endAdornment:"백만원"}];function W({onClose:e,submitLabel:t="저장"}){let a=(0,o.Xr)(h),[n,l]=(0,i.useState)({}),[s]=(0,o.fp)(u),d=async t=>{try{await R({...t,amount:Number(t.amount),companyId:s}),a(e=>e+1),l({}),e?.()}catch(e){e instanceof Error?l({accountNumber:e.message}):l({accountNumber:"오류가 발생했습니다."})}};return(0,r.jsx)(E.A,{fields:U,onSubmit:d,submitLabel:t,zodSchema:M,fieldErrors:n})}let F=(0,v.createServerReference)("40bc1f4cd6969e4c7a0d7beace64a197e803791c74",v.callServer,void 0,v.findSourceMapURL,"deleteCashflows"),P=(0,v.createServerReference)("608131b08c4b49f8eb10bde6ce04186795f73ee76e",v.callServer,void 0,v.findSourceMapURL,"updateCompanyBalance"),H=V.z.object({companyBalance:D}),B=[{name:"companyBalance",label:"잔액",type:"text",required:!0,defaultValue:"0",endAdornment:"백만원"}];function G({onClose:e,submitLabel:t="설정"}){let a=(0,o.Xr)(h),[n,l]=(0,i.useState)({}),[s]=(0,o.fp)(u),[d]=(0,o.fp)(x),c=(0,o.Xr)(g),f=async t=>{try{await P(Number(t.companyBalance),s),c(Number(t.companyBalance)),a(e=>e+1),l({}),e?.()}catch(e){e instanceof Error?l({accountNumber:e.message}):l({accountNumber:"오류가 발생했습니다."})}};return(0,r.jsx)(E.A,{fields:B,onSubmit:f,submitLabel:t,zodSchema:H,fieldErrors:n,initialValues:{companyBalance:d.toString()}})}let L=(0,v.createServerReference)("60d1a6bc85cbb1fb21e185207274eb051051407ed5",v.callServer,void 0,v.findSourceMapURL,"updateCashflow"),$=V.z.object({date:V.z.string().min(1,"날짜를 입력해주세요."),counterparty:V.z.string().min(1,"업체를 입력해주세요."),amount:I,type:V.z.string()}),_=[{name:"type",label:"타입",type:"select",required:!0,options:[{label:"수금",value:"income"},{label:"지출",value:"expense"}]},{name:"date",label:"날짜",type:"date",required:!0},{name:"counterparty",label:"업체",type:"text",required:!0},{name:"amount",label:"금액",type:"text",required:!0,endAdornment:"백만원"}];function T({onClose:e,submitLabel:t="수정"}){let a=(0,o.Xr)(h),[n,l]=(0,i.useState)({}),[s]=(0,o.fp)(u),d=(0,o.md)(b),c=(0,o.md)(m),f=1===d.length?d[0]:1===c.length?c[0]:void 0,p=async t=>{if(!f){l({accountNumber:"수정할 내역이 선택되지 않았습니다."});return}try{await L({...t,amount:Number(t.amount),companyId:s},f.id),a(e=>e+1),l({}),e?.()}catch(e){e instanceof Error?l({accountNumber:e.message}):l({accountNumber:"오류가 발생했습니다."})}};return f?(0,r.jsx)(E.A,{fields:_,onSubmit:p,submitLabel:t,zodSchema:$,fieldErrors:n,initialValues:{type:f.type,date:f.date,counterparty:f.counterparty,amount:String(f.amount)}}):(0,r.jsx)("div",{children:"수정할 내역을 선택해주세요."})}function X({open:e,onClose:t}){return(0,r.jsxs)(A.A,{open:e,onClose:t,maxWidth:"xs",fullWidth:!0,children:[(0,r.jsx)(N.A,{children:"목록 추가"}),(0,r.jsx)(q.A,{children:(0,r.jsx)(W,{onClose:t})})]})}function K({open:e,onClose:t}){let a=(0,o.md)(m),l=(0,o.md)(b),s=(0,o.Xr)(h);async function i(){await F(a.map(e=>e.id)),await F(l.map(e=>e.id)),s(e=>e+1),t()}return(0,r.jsxs)(A.A,{open:e,onClose:t,maxWidth:"xs",fullWidth:!0,children:[(0,r.jsx)(N.A,{children:"내역 삭제 확인"}),(0,r.jsx)(q.A,{sx:{py:3},children:"정말로 선택한 내역을 삭제하시겠습니까?"}),(0,r.jsxs)(z.A,{sx:{px:3,pb:2,pt:0,justifyContent:"flex-end"},children:[(0,r.jsx)(n.A,{variant:"outlined",color:"primary",onClick:t,children:"취소"}),(0,r.jsx)(n.A,{variant:"contained",color:"primary",onClick:i,children:"삭제"})]})]})}function Y({open:e,onClose:t}){return(0,r.jsxs)(A.A,{open:e,onClose:t,maxWidth:"xs",fullWidth:!0,children:[(0,r.jsx)(N.A,{children:"잔액 설정"}),(0,r.jsx)(q.A,{children:(0,r.jsx)(G,{onClose:t})})]})}function Z({open:e,onClose:t}){return(0,r.jsxs)(A.A,{open:e,onClose:t,maxWidth:"xs",fullWidth:!0,children:[(0,r.jsx)(N.A,{children:"내역 수정"}),(0,r.jsx)(q.A,{children:(0,r.jsx)(T,{onClose:t})})]})}var O=a(68792),J=a(1816);function Q(){let[e,t]=(0,i.useState)(!1),[a,s]=(0,i.useState)(!1),[d,c]=(0,i.useState)(!1),[f,h]=(0,i.useState)(!1),[x,g]=(0,o.fp)(p),[y,v]=(0,o.fp)(u),k=(0,o.md)(b),C=(0,o.md)(m),[S,A]=(0,o.fp)(w);return(0,r.jsxs)("div",{className:"w-full min-h-screen bg-gray-100",children:[(0,r.jsxs)("div",{className:"p-4 sm:p-8",children:[(0,r.jsx)("h1",{className:"text-xl sm:text-2xl font-bold mb-4 sm:mb-6",children:"수금 지출 관리"}),(0,r.jsxs)(l.A,{direction:{xs:"column",lg:"row"},spacing:2,children:[(0,r.jsx)("div",{className:"flex flex-row justify-between items-end flex-shrink-0",style:{minHeight:24},children:(0,r.jsx)(O.A,{value:y,onChange:(e,t)=>v(t),scrollButtons:"auto",children:x.map(e=>(0,r.jsx)(J.A,{label:e.name,value:e.id},e.id))})}),(0,r.jsxs)(l.A,{direction:"row",spacing:2,sx:{justifyContent:{sm:"flex-start",lg:"flex-end"},overflowX:"scroll",width:"100%",minWidth:0},className:"w-full justify-start mb-4 sm:mb-6 mt-4",children:[(0,r.jsx)(n.A,{variant:"contained",color:"primary",sx:{minWidth:120,minHeight:44,maxHeight:44,fontWeight:600,fontSize:16,lineHeight:1.5,py:0,backgroundColor:"#22C55E","&:hover":{backgroundColor:"#16A34A"},boxShadow:"none",alignSelf:"flex-end"},onClick:e=>{e.currentTarget.blur(),s(!0)},children:"잔액 설정"}),(0,r.jsx)(n.A,{variant:"contained",color:"primary",disabled:0===k.length&&0===C.length,sx:{minWidth:120,minHeight:44,maxHeight:44,fontWeight:600,fontSize:16,lineHeight:1.5,py:0,whiteSpace:"nowrap",backgroundColor:"#22C55E","&:hover":{backgroundColor:"#16A34A"},boxShadow:"none",alignSelf:"flex-end"},onClick:e=>{e.currentTarget.blur(),c(!0)},children:"선택 목록 삭제"}),(0,r.jsx)(n.A,{variant:"contained",color:"primary",disabled:(1!==k.length||0!==C.length)&&(0!==k.length||1!==C.length),sx:{minWidth:120,minHeight:44,maxHeight:44,fontWeight:600,fontSize:16,lineHeight:1.5,py:0,whiteSpace:"nowrap",backgroundColor:"#22C55E","&:hover":{backgroundColor:"#16A34A"},boxShadow:"none",alignSelf:"flex-end"},onClick:e=>{e.currentTarget.blur(),h(!0)},children:"선택 목록 수정"}),(0,r.jsx)(n.A,{className:"px-4 py-2 bg-primary-main text-white rounded-lg hover:bg-primary-dark transition-colors",variant:"contained",color:"primary",sx:{minWidth:120,minHeight:44,maxHeight:44,fontWeight:600,fontSize:16,lineHeight:1.5,py:0,backgroundColor:"#22C55E","&:hover":{backgroundColor:"#16A34A"},boxShadow:"none",alignSelf:"flex-end"},onClick:e=>{e.currentTarget.blur(),t(!0)},children:"목록 추가"}),(0,r.jsx)(n.A,{variant:"contained",color:"secondary",sx:{minWidth:120,minHeight:44,maxHeight:44,fontWeight:600,fontSize:16,lineHeight:1.5,py:0,backgroundColor:S?"#f3f4f6":"#64748b",color:S?"#374151":"#fff","&:hover":{backgroundColor:S?"#e5e7eb":"#475569"},boxShadow:"none",border:S?"1px solid #cbd5e1":"none",alignSelf:"flex-end"},onClick:e=>{e.currentTarget.blur(),A(e=>!e)},children:S?"편집 종료":"편집 모드"})]})]}),(0,r.jsx)(j,{})]}),(0,r.jsx)(X,{open:e,onClose:()=>t(!1)}),(0,r.jsx)(Y,{open:a,onClose:()=>s(!1)}),(0,r.jsx)(K,{open:d,onClose:()=>c(!1)}),(0,r.jsx)(Z,{open:f,onClose:()=>h(!1)})]})}},42623:(e,t,a)=>{"use strict";a.d(t,{Kg:()=>o,eg:()=>i,f3:()=>s,gt:()=>l,sg:()=>n,ye:()=>r});let r=e=>e.value?new Intl.NumberFormat("ko-KR",{style:"currency",currency:"KRW"}).format(e.value):"",n=e=>{if(null===e.value||void 0===e.value||""===e.value)return"";let t=Number(e.value);if(isNaN(t))return"";let a=!Number.isInteger(t);return new Intl.NumberFormat("en-US",{style:"currency",currency:"USD",minimumFractionDigits:2*!!a,maximumFractionDigits:2*!!a}).format(t)},l=e=>e.value?new Intl.NumberFormat("ko-KR",{style:"currency",currency:"KRW",minimumFractionDigits:0,maximumFractionDigits:0}).format(e.value)+"/kg":"",s=e=>e.value?new Date(e.value).toLocaleDateString("ko-KR",{month:"long",day:"numeric",weekday:"short"}):"",i=e=>{if(null===e.value||void 0===e.value||""===e.value)return"";let t=Number(e.value);if(isNaN(t))return"";let a=Number(t.toFixed(1));return Number.isInteger(a)?a.toString():a.toFixed(1)},o=e=>{if(!e.value)return"";let t=new Date(e.value),a=t.getFullYear(),r=String(t.getMonth()+1).padStart(2,"0"),n=String(t.getDate()).padStart(2,"0");return`${a}/${r}/${n}`}},45786:(e,t,a)=>{"use strict";a.r(t),a.d(t,{default:()=>l});var r=a(10674),n=a(9367);function l(){return(0,r.jsx)(n.default,{})}},53686:(e,t,a)=>{Promise.resolve().then(a.bind(a,9367))},63033:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-unit-async-storage.external.js")},71227:(e,t,a)=>{"use strict";a.r(t),a.d(t,{GlobalError:()=>s.a,__next_app__:()=>u,pages:()=>c,routeModule:()=>f,tree:()=>d});var r=a(65282),n=a(20277),l=a(47757),s=a.n(l),i=a(96002),o={};for(let e in i)0>["default","tree","pages","GlobalError","__next_app__","routeModule"].indexOf(e)&&(o[e]=()=>i[e]);a.d(t,o);let d={children:["",{children:["cashflow",{children:["__PAGE__",{},{page:[()=>Promise.resolve().then(a.bind(a,45786)),"/Users/kang-yean-woo/gompyo/src/app/cashflow/page.tsx"]}]},{metadata:{icon:[async e=>(await Promise.resolve().then(a.bind(a,34421))).default(e)],apple:[],openGraph:[],twitter:[],manifest:void 0}}]},{layout:[()=>Promise.resolve().then(a.bind(a,98445)),"/Users/kang-yean-woo/gompyo/src/app/layout.tsx"],"not-found":[()=>Promise.resolve().then(a.bind(a,24327)),"/Users/kang-yean-woo/gompyo/src/app/not-found.tsx"],forbidden:[()=>Promise.resolve().then(a.t.bind(a,68366,23)),"next/dist/client/components/forbidden-error"],unauthorized:[()=>Promise.resolve().then(a.t.bind(a,75895,23)),"next/dist/client/components/unauthorized-error"],metadata:{icon:[async e=>(await Promise.resolve().then(a.bind(a,34421))).default(e)],apple:[],openGraph:[],twitter:[],manifest:void 0}}]}.children,c=["/Users/kang-yean-woo/gompyo/src/app/cashflow/page.tsx"],u={require:a,loadChunk:()=>Promise.resolve()},f=new r.AppPageRouteModule({definition:{kind:n.RouteKind.APP_PAGE,page:"/cashflow/page",pathname:"/cashflow",bundlePath:"",filename:"",appPaths:[]},userland:{loaderTree:d}})},77598:e=>{"use strict";e.exports=require("node:crypto")},79551:e=>{"use strict";e.exports=require("url")},87550:e=>{"use strict";e.exports=require("better-sqlite3")},93598:(e,t,a)=>{Promise.resolve().then(a.bind(a,35647))}};var t=require("../../webpack-runtime.js");t.C(e);var a=e=>t(t.s=e),r=t.X(0,[883,873,91,36,335,560,293,246,289,547,913,368],()=>a(71227));module.exports=r})();
