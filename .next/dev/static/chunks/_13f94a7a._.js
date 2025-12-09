(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/services/api.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// src/services/api.ts
__turbopack_context__.s([
    "chatWithAI",
    ()=>chatWithAI,
    "default",
    ()=>__TURBOPACK__default__export__,
    "login",
    ()=>login,
    "register",
    ()=>register,
    "saveEventRegistration",
    ()=>saveEventRegistration
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/axios/lib/axios.js [app-client] (ecmascript)");
;
const api = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].create({
    baseURL: 'http://localhost:3000',
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
    try {
        const { data } = await api.post('/api/auth/login', payload);
        return data;
    } catch (error) {
        console.error('LOGIN ERROR:', error?.message, error?.response?.status, error?.response?.data);
        throw error;
    }
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
    const [token, setTokenState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        "ApiProvider.useState": ()=>{
            if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
            ;
            return localStorage.getItem("token");
        }
    }["ApiProvider.useState"]);
    const setToken = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ApiProvider.useCallback[setToken]": (t)=>{
            setTokenState(t);
            if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
            ;
            if (t) localStorage.setItem("token", t);
            else localStorage.removeItem("token");
        }
    }["ApiProvider.useCallback[setToken]"], []);
    const login = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ApiProvider.useCallback[login]": async (payload)=>{
            const data = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$services$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["login"])(payload);
            console.log("LOGIN RESPONSE FRONT:", data);
            // AJUSTE AQUI se seu backend usa outro formato
            // Exemplos de caminhos comuns:
            // { token: "..." }
            // { accessToken: "..." }
            // { success: true, data: { token: "..." } }
            const token = data.token || data.accessToken || data?.data?.token || data?.data?.accessToken;
            if (token) {
                setToken(token);
            } else {
                console.warn("Nenhum token encontrado na resposta de login. Ajuste o caminho do token no ApiContext.");
            }
            return data;
        }
    }["ApiProvider.useCallback[login]"], [
        setToken
    ]);
    const register = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ApiProvider.useCallback[register]": async (payload)=>{
            const data = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$services$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["register"])(payload);
            return data;
        }
    }["ApiProvider.useCallback[register]"], []);
    const chat = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ApiProvider.useCallback[chat]": async (payload)=>{
            const resp = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$services$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["chatWithAI"])(payload);
            return resp;
        }
    }["ApiProvider.useCallback[chat]"], []);
    // Sempre que o token muda, atualiza o header default do axios
    if (token) {
        __TURBOPACK__imported__module__$5b$project$5d2f$services$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].defaults.headers.common.Authorization = `Bearer ${token}`;
    } else {
        delete __TURBOPACK__imported__module__$5b$project$5d2f$services$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].defaults.headers.common.Authorization;
    }
    const value = {
        token,
        setToken,
        chat,
        login,
        register
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ApiContext.Provider, {
        value: value,
        children: children
    }, void 0, false, {
        fileName: "[project]/context/apiContext.tsx",
        lineNumber: 94,
        columnNumber: 10
    }, this);
}
_s(ApiProvider, "Zl7qxjRHuKezwPdT4sTzIyKHEp8=");
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