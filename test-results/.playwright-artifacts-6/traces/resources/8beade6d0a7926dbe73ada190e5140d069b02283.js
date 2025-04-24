(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push(["static/chunks/src_927e6ba9._.js", {

"[project]/src/actions/plan.ts [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
/* __next_internal_action_entry_do_not_use__ {"00cb4ae7d2c159f343dcda59a19523dfed986f7e9a":"getPlanData","607022290fe3b30c43e81cfbc1ebc4263e3dca4b6e":"createPlan"} */ __turbopack_context__.s({
    "createPlan": (()=>createPlan),
    "getPlanData": (()=>getPlanData)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$2$2e$3_$40$babel$2b$core$40$7$2e$26$2e$10_$40$playwright$2b$test$40$1$2e$52$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_react_1935877c0ecb1aedd58e0f42e11d35bb$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.2.3_@babel+core@7.26.10_@playwright+test@1.52.0_babel-plugin-macros@3.1.0_react_1935877c0ecb1aedd58e0f42e11d35bb/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-client-wrapper.js [app-client] (ecmascript)");
;
var createPlan = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$2$2e$3_$40$babel$2b$core$40$7$2e$26$2e$10_$40$playwright$2b$test$40$1$2e$52$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_react_1935877c0ecb1aedd58e0f42e11d35bb$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createServerReference"])("607022290fe3b30c43e81cfbc1ebc4263e3dca4b6e", __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$2$2e$3_$40$babel$2b$core$40$7$2e$26$2e$10_$40$playwright$2b$test$40$1$2e$52$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_react_1935877c0ecb1aedd58e0f42e11d35bb$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["callServer"], void 0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$2$2e$3_$40$babel$2b$core$40$7$2e$26$2e$10_$40$playwright$2b$test$40$1$2e$52$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_react_1935877c0ecb1aedd58e0f42e11d35bb$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["findSourceMapURL"], "createPlan");
var getPlanData = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$2$2e$3_$40$babel$2b$core$40$7$2e$26$2e$10_$40$playwright$2b$test$40$1$2e$52$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_react_1935877c0ecb1aedd58e0f42e11d35bb$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createServerReference"])("00cb4ae7d2c159f343dcda59a19523dfed986f7e9a", __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$2$2e$3_$40$babel$2b$core$40$7$2e$26$2e$10_$40$playwright$2b$test$40$1$2e$52$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_react_1935877c0ecb1aedd58e0f42e11d35bb$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["callServer"], void 0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$2$2e$3_$40$babel$2b$core$40$7$2e$26$2e$10_$40$playwright$2b$test$40$1$2e$52$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_react_1935877c0ecb1aedd58e0f42e11d35bb$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["findSourceMapURL"], "getPlanData");
}}),
"[project]/src/containers/dashboard.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>Dashboard)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$2$2e$3_$40$babel$2b$core$40$7$2e$26$2e$10_$40$playwright$2b$test$40$1$2e$52$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_react_1935877c0ecb1aedd58e0f42e11d35bb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.2.3_@babel+core@7.26.10_@playwright+test@1.52.0_babel-plugin-macros@3.1.0_react_1935877c0ecb1aedd58e0f42e11d35bb/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$2$2e$3_$40$babel$2b$core$40$7$2e$26$2e$10_$40$playwright$2b$test$40$1$2e$52$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_react_1935877c0ecb1aedd58e0f42e11d35bb$2f$node_modules$2f$next$2f$dist$2f$shared$2f$lib$2f$app$2d$dynamic$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.2.3_@babel+core@7.26.10_@playwright+test@1.52.0_babel-plugin-macros@3.1.0_react_1935877c0ecb1aedd58e0f42e11d35bb/node_modules/next/dist/shared/lib/app-dynamic.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$5$2e$15$2e$5_$40$emotion$2b$react$40$11$2e$11$2e$3_$40$types$2b$react$40$19$2e$0$2e$12_react$40$19$2e$0$2e$0_$5f40$emotion_abf8eafde06bcf767007edbb0b0e9788$2f$node_modules$2f40$mui$2f$material$2f$Button$2f$Button$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Button$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@mui+material@5.15.5_@emotion+react@11.11.3_@types+react@19.0.12_react@19.0.0__@emotion_abf8eafde06bcf767007edbb0b0e9788/node_modules/@mui/material/Button/Button.js [app-client] (ecmascript) <export default as Button>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$5$2e$15$2e$5_$40$emotion$2b$react$40$11$2e$11$2e$3_$40$types$2b$react$40$19$2e$0$2e$12_react$40$19$2e$0$2e$0_$5f40$emotion_abf8eafde06bcf767007edbb0b0e9788$2f$node_modules$2f40$mui$2f$material$2f$TextField$2f$TextField$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TextField$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@mui+material@5.15.5_@emotion+react@11.11.3_@types+react@19.0.12_react@19.0.0__@emotion_abf8eafde06bcf767007edbb0b0e9788/node_modules/@mui/material/TextField/TextField.js [app-client] (ecmascript) <export default as TextField>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$5$2e$15$2e$5_$40$emotion$2b$react$40$11$2e$11$2e$3_$40$types$2b$react$40$19$2e$0$2e$12_react$40$19$2e$0$2e$0_$5f40$emotion_abf8eafde06bcf767007edbb0b0e9788$2f$node_modules$2f40$mui$2f$material$2f$Card$2f$Card$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Card$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@mui+material@5.15.5_@emotion+react@11.11.3_@types+react@19.0.12_react@19.0.0__@emotion_abf8eafde06bcf767007edbb0b0e9788/node_modules/@mui/material/Card/Card.js [app-client] (ecmascript) <export default as Card>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$5$2e$15$2e$5_$40$emotion$2b$react$40$11$2e$11$2e$3_$40$types$2b$react$40$19$2e$0$2e$12_react$40$19$2e$0$2e$0_$5f40$emotion_abf8eafde06bcf767007edbb0b0e9788$2f$node_modules$2f40$mui$2f$material$2f$Stack$2f$Stack$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Stack$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@mui+material@5.15.5_@emotion+react@11.11.3_@types+react@19.0.12_react@19.0.0__@emotion_abf8eafde06bcf767007edbb0b0e9788/node_modules/@mui/material/Stack/Stack.js [app-client] (ecmascript) <export default as Stack>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$5$2e$15$2e$5_$40$emotion$2b$react$40$11$2e$11$2e$3_$40$types$2b$react$40$19$2e$0$2e$12_react$40$19$2e$0$2e$0_$5f40$emotion_abf8eafde06bcf767007edbb0b0e9788$2f$node_modules$2f40$mui$2f$material$2f$Typography$2f$Typography$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Typography$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@mui+material@5.15.5_@emotion+react@11.11.3_@types+react@19.0.12_react@19.0.0__@emotion_abf8eafde06bcf767007edbb0b0e9788/node_modules/@mui/material/Typography/Typography.js [app-client] (ecmascript) <export default as Typography>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$5$2e$15$2e$5_$40$emotion$2b$react$40$11$2e$11$2e$3_$40$types$2b$react$40$19$2e$0$2e$12_react$40$19$2e$0$2e$0_$5f40$emotion_abf8eafde06bcf767007edbb0b0e9788$2f$node_modules$2f40$mui$2f$material$2f$Select$2f$Select$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Select$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@mui+material@5.15.5_@emotion+react@11.11.3_@types+react@19.0.12_react@19.0.0__@emotion_abf8eafde06bcf767007edbb0b0e9788/node_modules/@mui/material/Select/Select.js [app-client] (ecmascript) <export default as Select>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$5$2e$15$2e$5_$40$emotion$2b$react$40$11$2e$11$2e$3_$40$types$2b$react$40$19$2e$0$2e$12_react$40$19$2e$0$2e$0_$5f40$emotion_abf8eafde06bcf767007edbb0b0e9788$2f$node_modules$2f40$mui$2f$material$2f$MenuItem$2f$MenuItem$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MenuItem$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@mui+material@5.15.5_@emotion+react@11.11.3_@types+react@19.0.12_react@19.0.0__@emotion_abf8eafde06bcf767007edbb0b0e9788/node_modules/@mui/material/MenuItem/MenuItem.js [app-client] (ecmascript) <export default as MenuItem>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$5$2e$15$2e$5_$40$emotion$2b$react$40$11$2e$11$2e$3_$40$types$2b$react$40$19$2e$0$2e$12_react$40$19$2e$0$2e$0_$5f40$emotion_abf8eafde06bcf767007edbb0b0e9788$2f$node_modules$2f40$mui$2f$material$2f$FormControl$2f$FormControl$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FormControl$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@mui+material@5.15.5_@emotion+react@11.11.3_@types+react@19.0.12_react@19.0.0__@emotion_abf8eafde06bcf767007edbb0b0e9788/node_modules/@mui/material/FormControl/FormControl.js [app-client] (ecmascript) <export default as FormControl>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$5$2e$15$2e$5_$40$emotion$2b$react$40$11$2e$11$2e$3_$40$types$2b$react$40$19$2e$0$2e$12_react$40$19$2e$0$2e$0_$5f40$emotion_abf8eafde06bcf767007edbb0b0e9788$2f$node_modules$2f40$mui$2f$material$2f$InputLabel$2f$InputLabel$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__InputLabel$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@mui+material@5.15.5_@emotion+react@11.11.3_@types+react@19.0.12_react@19.0.0__@emotion_abf8eafde06bcf767007edbb0b0e9788/node_modules/@mui/material/InputLabel/InputLabel.js [app-client] (ecmascript) <export default as InputLabel>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$2$2e$3_$40$babel$2b$core$40$7$2e$26$2e$10_$40$playwright$2b$test$40$1$2e$52$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_react_1935877c0ecb1aedd58e0f42e11d35bb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.2.3_@babel+core@7.26.10_@playwright+test@1.52.0_babel-plugin-macros@3.1.0_react_1935877c0ecb1aedd58e0f42e11d35bb/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$actions$2f$plan$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/actions/plan.ts [app-client] (ecmascript)");
;
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
const ApexChart = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$2$2e$3_$40$babel$2b$core$40$7$2e$26$2e$10_$40$playwright$2b$test$40$1$2e$52$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_react_1935877c0ecb1aedd58e0f42e11d35bb$2f$node_modules$2f$next$2f$dist$2f$shared$2f$lib$2f$app$2d$dynamic$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(()=>__turbopack_context__.r("[project]/node_modules/.pnpm/react-apexcharts@1.7.0_apexcharts@4.5.0_react@19.0.0/node_modules/react-apexcharts/dist/react-apexcharts.min.js [app-client] (ecmascript, next/dynamic entry, async loader)")(__turbopack_context__.i), {
    loadableGenerated: {
        modules: [
            "[project]/node_modules/.pnpm/react-apexcharts@1.7.0_apexcharts@4.5.0_react@19.0.0/node_modules/react-apexcharts/dist/react-apexcharts.min.js [app-client] (ecmascript, next/dynamic entry)"
        ]
    },
    ssr: false
});
_c = ApexChart;
;
;
function BarChart({ propName, propData, propUnit }) {
    const series = [
        {
            name: propName,
            data: propData?.map((item)=>item.value) ?? []
        }
    ];
    const categories = propData?.map((item)=>item.category) ?? [];
    const options = {
        chart: {
            type: "bar",
            height: 350
        },
        colors: [
            "#43BD9D"
        ],
        plotOptions: {
            bar: {
                horizontal: false,
                columnWidth: "50%"
            }
        },
        dataLabels: {
            enabled: false
        },
        stroke: {
            show: true,
            width: 2,
            colors: [
                "transparent"
            ]
        },
        xaxis: {
            categories: categories
        },
        yaxis: {
            title: {
                text: propUnit
            }
        },
        fill: {
            opacity: 1
        },
        tooltip: {
            y: {
                formatter: (val)=>`${val.toLocaleString()}`
            }
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$2$2e$3_$40$babel$2b$core$40$7$2e$26$2e$10_$40$playwright$2b$test$40$1$2e$52$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_react_1935877c0ecb1aedd58e0f42e11d35bb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        id: "chart",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$2$2e$3_$40$babel$2b$core$40$7$2e$26$2e$10_$40$playwright$2b$test$40$1$2e$52$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_react_1935877c0ecb1aedd58e0f42e11d35bb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ApexChart, {
            options: options,
            series: series,
            type: "bar",
            height: 350
        }, void 0, false, {
            fileName: "[project]/src/containers/dashboard.tsx",
            lineNumber: 80,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/containers/dashboard.tsx",
        lineNumber: 79,
        columnNumber: 5
    }, this);
}
_c1 = BarChart;
function Dashboard() {
    _s();
    const [filters, setFilters] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$2$2e$3_$40$babel$2b$core$40$7$2e$26$2e$10_$40$playwright$2b$test$40$1$2e$52$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_react_1935877c0ecb1aedd58e0f42e11d35bb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        importer: "전체보기",
        exporter: "전체보기",
        item: "전체보기",
        exchangeRate: 1400
    });
    const [chartData, setChartData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$2$2e$3_$40$babel$2b$core$40$7$2e$26$2e$10_$40$playwright$2b$test$40$1$2e$52$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_react_1935877c0ecb1aedd58e0f42e11d35bb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        tonnage: [],
        dollar: [],
        won: []
    });
    const [totalData, setTotalData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$2$2e$3_$40$babel$2b$core$40$7$2e$26$2e$10_$40$playwright$2b$test$40$1$2e$52$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_react_1935877c0ecb1aedd58e0f42e11d35bb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [selectOptions, setSelectOptions] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$2$2e$3_$40$babel$2b$core$40$7$2e$26$2e$10_$40$playwright$2b$test$40$1$2e$52$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_react_1935877c0ecb1aedd58e0f42e11d35bb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        importer: [
            "전체보기"
        ],
        exporter: [
            "전체보기"
        ],
        item: [
            "전체보기"
        ]
    });
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$2$2e$3_$40$babel$2b$core$40$7$2e$26$2e$10_$40$playwright$2b$test$40$1$2e$52$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_react_1935877c0ecb1aedd58e0f42e11d35bb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Dashboard.useEffect": ()=>{
            const fetchData = {
                "Dashboard.useEffect.fetchData": async ()=>{
                    try {
                        const fetchedTotalData = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$actions$2f$plan$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getPlanData"])();
                        setTotalData(fetchedTotalData);
                        // 옵션 자동 생성
                        setSelectOptions({
                            exporter: [
                                "전체보기",
                                ...new Set(fetchedTotalData.map({
                                    "Dashboard.useEffect.fetchData": (data)=>data.exporter
                                }["Dashboard.useEffect.fetchData"]))
                            ],
                            importer: [
                                "전체보기",
                                ...new Set(fetchedTotalData.map({
                                    "Dashboard.useEffect.fetchData": (data)=>data.importer
                                }["Dashboard.useEffect.fetchData"]))
                            ],
                            item: [
                                "전체보기",
                                ...new Set(fetchedTotalData.map({
                                    "Dashboard.useEffect.fetchData": (data)=>data.itemName
                                }["Dashboard.useEffect.fetchData"]))
                            ]
                        });
                        // 초기 데이터로 차트 로드
                        filterData(fetchedTotalData);
                    } catch (error) {
                        console.error("Error fetching plan data:", error);
                    }
                }
            }["Dashboard.useEffect.fetchData"];
            fetchData();
        }
    }["Dashboard.useEffect"], []);
    // 필터 변경 핸들러
    const handleFilterChange = (key, value)=>{
        setFilters((prev)=>({
                ...prev,
                [key]: value
            }));
    };
    // 데이터 필터링 함수
    const filterData = (data = totalData)=>{
        const { exporter, importer, item, exchangeRate } = filters;
        // 날짜 기준 최근 3개월 데이터 필터링
        const monthNames = [
            "3개월 전",
            "2개월 전",
            "1개월 전"
        ];
        const aggregateMonthlyData = (getValue)=>{
            return [
                2,
                1,
                0
            ].map((monthsAgo, index)=>{
                // 특정 월의 시작과 끝 계산
                const now = new Date(2025, 3, 1); // 데이터의 최신 날짜 기준
                const targetMonth = new Date(now.getFullYear(), now.getMonth() - monthsAgo, 1);
                const nextMonth = new Date(now.getFullYear(), now.getMonth() - monthsAgo + 1, 1);
                // 해당 월의 데이터 필터링 및 집계
                const monthData = data.filter((monthItem)=>{
                    const itemDate = new Date(monthItem.contractDate);
                    return itemDate >= targetMonth && itemDate < nextMonth && (exporter === "전체보기" || monthItem.exporter === exporter) && (importer === "전체보기" || monthItem.importer === importer) && (item === "전체보기" || monthItem.itemName === item);
                });
                return {
                    category: monthNames[index],
                    value: monthData.reduce((sum, item)=>sum + getValue(item), 0)
                };
            });
        };
        // 차트 데이터 업데이트
        setChartData({
            tonnage: aggregateMonthlyData((item)=>item.contractTon),
            dollar: aggregateMonthlyData((item)=>item.totalPrice),
            won: aggregateMonthlyData((item)=>item.totalPrice * (exchangeRate || 1400))
        });
    };
    const chartDataTypes = [
        {
            label: "톤수",
            unit: "TON (톤)"
        },
        {
            label: "달러가격",
            unit: "DOLLAR (달러)"
        },
        {
            label: "원가격",
            unit: "WON (원)"
        }
    ];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$2$2e$3_$40$babel$2b$core$40$7$2e$26$2e$10_$40$playwright$2b$test$40$1$2e$52$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_react_1935877c0ecb1aedd58e0f42e11d35bb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$5$2e$15$2e$5_$40$emotion$2b$react$40$11$2e$11$2e$3_$40$types$2b$react$40$19$2e$0$2e$12_react$40$19$2e$0$2e$0_$5f40$emotion_abf8eafde06bcf767007edbb0b0e9788$2f$node_modules$2f40$mui$2f$material$2f$Stack$2f$Stack$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Stack$3e$__["Stack"], {
        sx: {
            width: "100%",
            height: "100%",
            padding: 10,
            "@media (max-width: 600px)": {
                padding: 3
            }
        },
        spacing: 2,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$2$2e$3_$40$babel$2b$core$40$7$2e$26$2e$10_$40$playwright$2b$test$40$1$2e$52$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_react_1935877c0ecb1aedd58e0f42e11d35bb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$5$2e$15$2e$5_$40$emotion$2b$react$40$11$2e$11$2e$3_$40$types$2b$react$40$19$2e$0$2e$12_react$40$19$2e$0$2e$0_$5f40$emotion_abf8eafde06bcf767007edbb0b0e9788$2f$node_modules$2f40$mui$2f$material$2f$Typography$2f$Typography$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Typography$3e$__["Typography"], {
                variant: "h4",
                sx: {
                    marginBottom: 10
                },
                children: "대시보드"
            }, void 0, false, {
                fileName: "[project]/src/containers/dashboard.tsx",
                lineNumber: 214,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$2$2e$3_$40$babel$2b$core$40$7$2e$26$2e$10_$40$playwright$2b$test$40$1$2e$52$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_react_1935877c0ecb1aedd58e0f42e11d35bb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                className: "font-bold w-[50%]",
                children: "검색"
            }, void 0, false, {
                fileName: "[project]/src/containers/dashboard.tsx",
                lineNumber: 217,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$2$2e$3_$40$babel$2b$core$40$7$2e$26$2e$10_$40$playwright$2b$test$40$1$2e$52$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_react_1935877c0ecb1aedd58e0f42e11d35bb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$5$2e$15$2e$5_$40$emotion$2b$react$40$11$2e$11$2e$3_$40$types$2b$react$40$19$2e$0$2e$12_react$40$19$2e$0$2e$0_$5f40$emotion_abf8eafde06bcf767007edbb0b0e9788$2f$node_modules$2f40$mui$2f$material$2f$Stack$2f$Stack$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Stack$3e$__["Stack"], {
                direction: {
                    xs: "column",
                    md: "row"
                },
                spacing: 2,
                className: "w-full md:w-[100%]",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$2$2e$3_$40$babel$2b$core$40$7$2e$26$2e$10_$40$playwright$2b$test$40$1$2e$52$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_react_1935877c0ecb1aedd58e0f42e11d35bb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$5$2e$15$2e$5_$40$emotion$2b$react$40$11$2e$11$2e$3_$40$types$2b$react$40$19$2e$0$2e$12_react$40$19$2e$0$2e$0_$5f40$emotion_abf8eafde06bcf767007edbb0b0e9788$2f$node_modules$2f40$mui$2f$material$2f$FormControl$2f$FormControl$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FormControl$3e$__["FormControl"], {
                        fullWidth: true,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$2$2e$3_$40$babel$2b$core$40$7$2e$26$2e$10_$40$playwright$2b$test$40$1$2e$52$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_react_1935877c0ecb1aedd58e0f42e11d35bb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$5$2e$15$2e$5_$40$emotion$2b$react$40$11$2e$11$2e$3_$40$types$2b$react$40$19$2e$0$2e$12_react$40$19$2e$0$2e$0_$5f40$emotion_abf8eafde06bcf767007edbb0b0e9788$2f$node_modules$2f40$mui$2f$material$2f$InputLabel$2f$InputLabel$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__InputLabel$3e$__["InputLabel"], {
                                children: "수입회사"
                            }, void 0, false, {
                                fileName: "[project]/src/containers/dashboard.tsx",
                                lineNumber: 225,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$2$2e$3_$40$babel$2b$core$40$7$2e$26$2e$10_$40$playwright$2b$test$40$1$2e$52$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_react_1935877c0ecb1aedd58e0f42e11d35bb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$5$2e$15$2e$5_$40$emotion$2b$react$40$11$2e$11$2e$3_$40$types$2b$react$40$19$2e$0$2e$12_react$40$19$2e$0$2e$0_$5f40$emotion_abf8eafde06bcf767007edbb0b0e9788$2f$node_modules$2f40$mui$2f$material$2f$Select$2f$Select$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Select$3e$__["Select"], {
                                value: filters.importer,
                                label: "수입회사",
                                onChange: (e)=>handleFilterChange("importer", e.target.value),
                                children: selectOptions.importer.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$2$2e$3_$40$babel$2b$core$40$7$2e$26$2e$10_$40$playwright$2b$test$40$1$2e$52$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_react_1935877c0ecb1aedd58e0f42e11d35bb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$5$2e$15$2e$5_$40$emotion$2b$react$40$11$2e$11$2e$3_$40$types$2b$react$40$19$2e$0$2e$12_react$40$19$2e$0$2e$0_$5f40$emotion_abf8eafde06bcf767007edbb0b0e9788$2f$node_modules$2f40$mui$2f$material$2f$MenuItem$2f$MenuItem$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MenuItem$3e$__["MenuItem"], {
                                        value: item,
                                        children: item
                                    }, item, false, {
                                        fileName: "[project]/src/containers/dashboard.tsx",
                                        lineNumber: 232,
                                        columnNumber: 15
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/src/containers/dashboard.tsx",
                                lineNumber: 226,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/containers/dashboard.tsx",
                        lineNumber: 224,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$2$2e$3_$40$babel$2b$core$40$7$2e$26$2e$10_$40$playwright$2b$test$40$1$2e$52$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_react_1935877c0ecb1aedd58e0f42e11d35bb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$5$2e$15$2e$5_$40$emotion$2b$react$40$11$2e$11$2e$3_$40$types$2b$react$40$19$2e$0$2e$12_react$40$19$2e$0$2e$0_$5f40$emotion_abf8eafde06bcf767007edbb0b0e9788$2f$node_modules$2f40$mui$2f$material$2f$FormControl$2f$FormControl$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FormControl$3e$__["FormControl"], {
                        fullWidth: true,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$2$2e$3_$40$babel$2b$core$40$7$2e$26$2e$10_$40$playwright$2b$test$40$1$2e$52$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_react_1935877c0ecb1aedd58e0f42e11d35bb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$5$2e$15$2e$5_$40$emotion$2b$react$40$11$2e$11$2e$3_$40$types$2b$react$40$19$2e$0$2e$12_react$40$19$2e$0$2e$0_$5f40$emotion_abf8eafde06bcf767007edbb0b0e9788$2f$node_modules$2f40$mui$2f$material$2f$InputLabel$2f$InputLabel$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__InputLabel$3e$__["InputLabel"], {
                                children: "공급처"
                            }, void 0, false, {
                                fileName: "[project]/src/containers/dashboard.tsx",
                                lineNumber: 241,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$2$2e$3_$40$babel$2b$core$40$7$2e$26$2e$10_$40$playwright$2b$test$40$1$2e$52$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_react_1935877c0ecb1aedd58e0f42e11d35bb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$5$2e$15$2e$5_$40$emotion$2b$react$40$11$2e$11$2e$3_$40$types$2b$react$40$19$2e$0$2e$12_react$40$19$2e$0$2e$0_$5f40$emotion_abf8eafde06bcf767007edbb0b0e9788$2f$node_modules$2f40$mui$2f$material$2f$Select$2f$Select$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Select$3e$__["Select"], {
                                value: filters.exporter,
                                label: "공급처",
                                onChange: (e)=>handleFilterChange("exporter", e.target.value),
                                children: selectOptions.exporter.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$2$2e$3_$40$babel$2b$core$40$7$2e$26$2e$10_$40$playwright$2b$test$40$1$2e$52$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_react_1935877c0ecb1aedd58e0f42e11d35bb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$5$2e$15$2e$5_$40$emotion$2b$react$40$11$2e$11$2e$3_$40$types$2b$react$40$19$2e$0$2e$12_react$40$19$2e$0$2e$0_$5f40$emotion_abf8eafde06bcf767007edbb0b0e9788$2f$node_modules$2f40$mui$2f$material$2f$MenuItem$2f$MenuItem$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MenuItem$3e$__["MenuItem"], {
                                        value: item,
                                        children: item
                                    }, item, false, {
                                        fileName: "[project]/src/containers/dashboard.tsx",
                                        lineNumber: 248,
                                        columnNumber: 15
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/src/containers/dashboard.tsx",
                                lineNumber: 242,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/containers/dashboard.tsx",
                        lineNumber: 240,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$2$2e$3_$40$babel$2b$core$40$7$2e$26$2e$10_$40$playwright$2b$test$40$1$2e$52$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_react_1935877c0ecb1aedd58e0f42e11d35bb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$5$2e$15$2e$5_$40$emotion$2b$react$40$11$2e$11$2e$3_$40$types$2b$react$40$19$2e$0$2e$12_react$40$19$2e$0$2e$0_$5f40$emotion_abf8eafde06bcf767007edbb0b0e9788$2f$node_modules$2f40$mui$2f$material$2f$FormControl$2f$FormControl$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FormControl$3e$__["FormControl"], {
                        fullWidth: true,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$2$2e$3_$40$babel$2b$core$40$7$2e$26$2e$10_$40$playwright$2b$test$40$1$2e$52$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_react_1935877c0ecb1aedd58e0f42e11d35bb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$5$2e$15$2e$5_$40$emotion$2b$react$40$11$2e$11$2e$3_$40$types$2b$react$40$19$2e$0$2e$12_react$40$19$2e$0$2e$0_$5f40$emotion_abf8eafde06bcf767007edbb0b0e9788$2f$node_modules$2f40$mui$2f$material$2f$InputLabel$2f$InputLabel$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__InputLabel$3e$__["InputLabel"], {
                                children: "품목"
                            }, void 0, false, {
                                fileName: "[project]/src/containers/dashboard.tsx",
                                lineNumber: 257,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$2$2e$3_$40$babel$2b$core$40$7$2e$26$2e$10_$40$playwright$2b$test$40$1$2e$52$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_react_1935877c0ecb1aedd58e0f42e11d35bb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$5$2e$15$2e$5_$40$emotion$2b$react$40$11$2e$11$2e$3_$40$types$2b$react$40$19$2e$0$2e$12_react$40$19$2e$0$2e$0_$5f40$emotion_abf8eafde06bcf767007edbb0b0e9788$2f$node_modules$2f40$mui$2f$material$2f$Select$2f$Select$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Select$3e$__["Select"], {
                                value: filters.item,
                                label: "품목",
                                onChange: (e)=>handleFilterChange("item", e.target.value),
                                children: selectOptions.item.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$2$2e$3_$40$babel$2b$core$40$7$2e$26$2e$10_$40$playwright$2b$test$40$1$2e$52$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_react_1935877c0ecb1aedd58e0f42e11d35bb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$5$2e$15$2e$5_$40$emotion$2b$react$40$11$2e$11$2e$3_$40$types$2b$react$40$19$2e$0$2e$12_react$40$19$2e$0$2e$0_$5f40$emotion_abf8eafde06bcf767007edbb0b0e9788$2f$node_modules$2f40$mui$2f$material$2f$MenuItem$2f$MenuItem$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MenuItem$3e$__["MenuItem"], {
                                        value: item,
                                        children: item
                                    }, item, false, {
                                        fileName: "[project]/src/containers/dashboard.tsx",
                                        lineNumber: 264,
                                        columnNumber: 15
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/src/containers/dashboard.tsx",
                                lineNumber: 258,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/containers/dashboard.tsx",
                        lineNumber: 256,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$2$2e$3_$40$babel$2b$core$40$7$2e$26$2e$10_$40$playwright$2b$test$40$1$2e$52$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_react_1935877c0ecb1aedd58e0f42e11d35bb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$5$2e$15$2e$5_$40$emotion$2b$react$40$11$2e$11$2e$3_$40$types$2b$react$40$19$2e$0$2e$12_react$40$19$2e$0$2e$0_$5f40$emotion_abf8eafde06bcf767007edbb0b0e9788$2f$node_modules$2f40$mui$2f$material$2f$TextField$2f$TextField$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TextField$3e$__["TextField"], {
                        label: "환율 입력",
                        type: "number",
                        value: filters.exchangeRate ?? "",
                        onChange: (e)=>handleFilterChange("exchangeRate", Number(e.target.value)),
                        className: "w-full"
                    }, void 0, false, {
                        fileName: "[project]/src/containers/dashboard.tsx",
                        lineNumber: 272,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$2$2e$3_$40$babel$2b$core$40$7$2e$26$2e$10_$40$playwright$2b$test$40$1$2e$52$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_react_1935877c0ecb1aedd58e0f42e11d35bb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$5$2e$15$2e$5_$40$emotion$2b$react$40$11$2e$11$2e$3_$40$types$2b$react$40$19$2e$0$2e$12_react$40$19$2e$0$2e$0_$5f40$emotion_abf8eafde06bcf767007edbb0b0e9788$2f$node_modules$2f40$mui$2f$material$2f$Button$2f$Button$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Button$3e$__["Button"], {
                        className: "w-[50%] flex items-center p-2",
                        variant: "contained",
                        onClick: ()=>filterData(),
                        children: "적용하기"
                    }, void 0, false, {
                        fileName: "[project]/src/containers/dashboard.tsx",
                        lineNumber: 282,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/containers/dashboard.tsx",
                lineNumber: 218,
                columnNumber: 7
            }, this),
            [
                {
                    title: "톤 통계",
                    type: "tonnage",
                    index: 0
                },
                {
                    title: "달러가격 통계",
                    type: "dollar",
                    index: 1
                },
                {
                    title: "원가격 통계",
                    type: "won",
                    index: 2
                }
            ].map(({ title, type, index })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$2$2e$3_$40$babel$2b$core$40$7$2e$26$2e$10_$40$playwright$2b$test$40$1$2e$52$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_react_1935877c0ecb1aedd58e0f42e11d35bb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$5$2e$15$2e$5_$40$emotion$2b$react$40$11$2e$11$2e$3_$40$types$2b$react$40$19$2e$0$2e$12_react$40$19$2e$0$2e$0_$5f40$emotion_abf8eafde06bcf767007edbb0b0e9788$2f$node_modules$2f40$mui$2f$material$2f$Card$2f$Card$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Card$3e$__["Card"], {
                    sx: {
                        width: "100%",
                        height: "100%",
                        padding: 5
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$2$2e$3_$40$babel$2b$core$40$7$2e$26$2e$10_$40$playwright$2b$test$40$1$2e$52$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_react_1935877c0ecb1aedd58e0f42e11d35bb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mui$2b$material$40$5$2e$15$2e$5_$40$emotion$2b$react$40$11$2e$11$2e$3_$40$types$2b$react$40$19$2e$0$2e$12_react$40$19$2e$0$2e$0_$5f40$emotion_abf8eafde06bcf767007edbb0b0e9788$2f$node_modules$2f40$mui$2f$material$2f$Typography$2f$Typography$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Typography$3e$__["Typography"], {
                            variant: "h4",
                            sx: {
                                marginBottom: 2
                            },
                            children: title
                        }, void 0, false, {
                            fileName: "[project]/src/containers/dashboard.tsx",
                            lineNumber: 297,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$2$2e$3_$40$babel$2b$core$40$7$2e$26$2e$10_$40$playwright$2b$test$40$1$2e$52$2e$0_babel$2d$plugin$2d$macros$40$3$2e$1$2e$0_react_1935877c0ecb1aedd58e0f42e11d35bb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(BarChart, {
                            propName: chartDataTypes[index].label,
                            propData: chartData[type],
                            propUnit: chartDataTypes[index].unit
                        }, void 0, false, {
                            fileName: "[project]/src/containers/dashboard.tsx",
                            lineNumber: 300,
                            columnNumber: 11
                        }, this)
                    ]
                }, type, true, {
                    fileName: "[project]/src/containers/dashboard.tsx",
                    lineNumber: 296,
                    columnNumber: 9
                }, this))
        ]
    }, void 0, true, {
        fileName: "[project]/src/containers/dashboard.tsx",
        lineNumber: 203,
        columnNumber: 5
    }, this);
}
_s(Dashboard, "6oUbeAUAdzY1Ba5GPvITyppwMss=");
_c2 = Dashboard;
var _c, _c1, _c2;
__turbopack_context__.k.register(_c, "ApexChart");
__turbopack_context__.k.register(_c1, "BarChart");
__turbopack_context__.k.register(_c2, "Dashboard");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
}]);

//# sourceMappingURL=src_927e6ba9._.js.map
