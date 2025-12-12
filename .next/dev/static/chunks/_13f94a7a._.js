(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/services/api.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "addItemToFolderPath",
    ()=>addItemToFolderPath,
    "addItemToPath",
    ()=>addItemToPath,
    "chatWithAI",
    ()=>chatWithAI,
    "createFolderPath",
    ()=>createFolderPath,
    "createSubfolder",
    ()=>createSubfolder,
    "default",
    ()=>__TURBOPACK__default__export__,
    "deleteFolder",
    ()=>deleteFolder,
    "deleteItem",
    ()=>deleteItem,
    "downloadFile",
    ()=>downloadFile,
    "downloadPDFFromHTML",
    ()=>downloadPDFFromHTML,
    "downloadReportPDF",
    ()=>downloadReportPDF,
    "generatePDFFromHTML",
    ()=>generatePDFFromHTML,
    "generateReportPDF",
    ()=>generateReportPDF,
    "generateReportPreview",
    ()=>generateReportPreview,
    "getFolder",
    ()=>getFolder,
    "getFolders",
    ()=>getFolders,
    "getItem",
    ()=>getItem,
    "getItems",
    ()=>getItems,
    "getWorkspaceStats",
    ()=>getWorkspaceStats,
    "login",
    ()=>login,
    "register",
    ()=>register,
    "saveEventRegistration",
    ()=>saveEventRegistration,
    "searchItems",
    ()=>searchItems
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/axios/lib/axios.js [app-client] (ecmascript)");
;
const isLocalhost = ("TURBOPACK compile-time value", "object") !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
const apiBaseURL = isLocalhost ? 'http://localhost:3000' : 'https://back-end-ypsc.onrender.com';
const api = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].create({
    baseURL: apiBaseURL,
    withCredentials: true
});
api.interceptors.request.use((config)=>{
    const token = localStorage.getItem('token');
    if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});
const login = async (payload)=>{
    const { data } = await api.post('/api/auth/login', payload);
    return data;
};
const register = async (payload)=>{
    const { data } = await api.post('/api/auth/register', payload);
    return data;
};
const chatWithAI = async (payload)=>{
    const { data } = await api.post('/api/ai/chat', payload);
    return data;
};
const saveEventRegistration = async (payload)=>{
    const { data } = await api.post('/api/events/registration', payload);
    return data;
};
const downloadFile = async (fileName)=>{
    const response = await api.get(`/api/files/download/${fileName}`, {
        responseType: 'blob'
    });
    return response.data;
};
const getFolders = async ()=>{
    const { data } = await api.get('/api/workspace/folders');
    return data.data.folders;
};
const getFolder = async (id)=>{
    const { data } = await api.get(`/api/workspace/folders/${id}`);
    return data.data.folder;
};
const getItems = async (filters)=>{
    const params = new URLSearchParams();
    if (filters?.folderId) params.append('folderId', filters.folderId);
    if (filters?.itemType) params.append('itemType', filters.itemType);
    if (filters?.search) params.append('search', filters.search);
    const { data } = await api.get(`/api/workspace/items?${params.toString()}`);
    return data.data.items;
};
const getItem = async (id)=>{
    const { data } = await api.get(`/api/workspace/items/${id}`);
    return data.data.item;
};
const deleteFolder = async (id)=>{
    await api.delete(`/api/workspace/folders/${id}`);
};
const deleteItem = async (id)=>{
    await api.delete(`/api/workspace/items/${id}`);
};
const getWorkspaceStats = async ()=>{
    const { data } = await api.get('/api/workspace/stats');
    return data.data;
};
const createFolderPath = async (payload)=>{
    const { data } = await api.post('/api/workspace/folder-path', payload);
    return data;
};
const createSubfolder = async (payload)=>{
    const { data } = await api.post('/api/workspace/subfolder', payload);
    return data;
};
const addItemToFolderPath = async (payload)=>{
    const { data } = await api.post('/api/workspace/add-item-folderpath', payload);
    return data;
};
const addItemToPath = async (payload)=>{
    const { data } = await api.post('/api/workspace/add-item-path', payload);
    return data;
};
const searchItems = async (payload)=>{
    const { data } = await api.post('/api/workspace/search', payload);
    return data.data;
};
const generateReportPreview = async (payload)=>{
    const { data } = await api.post('/api/reports/preview', payload);
    return data;
};
const generateReportPDF = async (payload)=>{
    const response = await api.post('/api/reports/generate-pdf', payload, {
        responseType: 'blob'
    });
    return response.data;
};
const generatePDFFromHTML = async (payload)=>{
    const response = await api.post('/api/reports/generate-from-html', payload, {
        responseType: 'blob'
    });
    return response.data;
};
const downloadReportPDF = async (payload, filename)=>{
    try {
        const blob = await generateReportPDF(payload);
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', filename || `relatorio_${Date.now()}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
    } catch (error) {
        console.error('❌ Erro ao baixar PDF:', error);
        throw error;
    }
};
const downloadPDFFromHTML = async (html, filename)=>{
    try {
        const blob = await generatePDFFromHTML({
            html
        });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', filename || `relatorio_${Date.now()}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
    } catch (error) {
        console.error('❌ Erro ao baixar PDF:', error);
        throw error;
    }
};
const __TURBOPACK__default__export__ = api;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/context/apiContext.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// src/contexts/ApiContext.tsx
__turbopack_context__.s([
    "ApiProvider",
    ()=>ApiProvider,
    "useApi",
    ()=>useApi
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$services$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/services/api.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
"use client";
;
;
const ApiContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(undefined);
function ApiProvider({ children }) {
    _s();
    const [token, setTokenState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    // Carrega token salvo no localStorage ao iniciar
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ApiProvider.useEffect": ()=>{
            if ("TURBOPACK compile-time truthy", 1) {
                const stored = localStorage.getItem("token");
                if (stored) {
                    setTokenState(stored);
                    __TURBOPACK__imported__module__$5b$project$5d2f$services$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].defaults.headers.common.Authorization = `Bearer ${stored}`;
                }
            }
        }
    }["ApiProvider.useEffect"], []);
    // Define token corretamente e joga no axios
    const setToken = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ApiProvider.useCallback[setToken]": (t)=>{
            setTokenState(t);
            if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
            ;
            if (t) {
                localStorage.setItem("token", t);
                __TURBOPACK__imported__module__$5b$project$5d2f$services$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].defaults.headers.common.Authorization = `Bearer ${t}`;
            } else {
                localStorage.removeItem("token");
                delete __TURBOPACK__imported__module__$5b$project$5d2f$services$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].defaults.headers.common.Authorization;
            }
        }
    }["ApiProvider.useCallback[setToken]"], []);
    // LOGIN
    const login = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ApiProvider.useCallback[login]": async (payload)=>{
            const res = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$services$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["login"])(payload);
            const token = res?.token || res?.accessToken || res?.data?.token || res?.data?.accessToken;
            if (token) {
                setToken(token);
            }
            return res;
        }
    }["ApiProvider.useCallback[login]"], [
        setToken
    ]);
    // REGISTER
    const register = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ApiProvider.useCallback[register]": async (payload)=>{
            return await (0, __TURBOPACK__imported__module__$5b$project$5d2f$services$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["register"])(payload);
        }
    }["ApiProvider.useCallback[register]"], []);
    // CHAT
    const chat = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ApiProvider.useCallback[chat]": async (payload)=>{
            const res = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$services$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["chatWithAI"])(payload);
            return res;
        }
    }["ApiProvider.useCallback[chat]"], []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ApiContext.Provider, {
        value: {
            token,
            setToken,
            chat,
            login,
            register
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/context/apiContext.tsx",
        lineNumber: 89,
        columnNumber: 5
    }, this);
}
_s(ApiProvider, "327/jCtyO3lWg9OE8j58gxBlFa0=");
_c = ApiProvider;
const useApi = ()=>{
    _s1();
    const ctx = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(ApiContext);
    if (!ctx) throw new Error("useApi deve ser usado dentro de ApiProvider");
    return ctx;
};
_s1(useApi, "/dMy7t63NXD4eYACoT93CePwGrg=");
var _c;
__turbopack_context__.k.register(_c, "ApiProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=_13f94a7a._.js.map