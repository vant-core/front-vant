// src/contexts/ApiContext.tsx
"use client";

import { createContext, useContext, useState, useCallback } from "react";
import api, {
  chatWithAI,
  login as apiLogin,
  register as apiRegister,
} from "../services/api";

import {
  ChatMessageDTO,
  ChatApiResponse,
  LoginDTO,
  RegisterDTO,
} from "../types/index";

interface ApiContextValue {
  token: string | null;
  setToken: (t: string | null) => void;
  chat: (payload: ChatMessageDTO) => Promise<ChatApiResponse>;
  login: (payload: LoginDTO) => Promise<any>;
  register: (payload: RegisterDTO) => Promise<any>;
}

const ApiContext = createContext<ApiContextValue | undefined>(undefined);

export function ApiProvider({ children }: { children: React.ReactNode }) {
  const [token, setTokenState] = useState<string | null>(() => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("token");
  });

  const setToken = useCallback((t: string | null) => {
    setTokenState(t);

    if (typeof window === "undefined") return;

    if (t) {
      localStorage.setItem("token", t);
      api.defaults.headers.common.Authorization = `Bearer ${t}`;
    } else {
      localStorage.removeItem("token");
      delete api.defaults.headers.common.Authorization;
    }
  }, []);

  /* --------------------------------------------------
     LOGIN
  -------------------------------------------------- */
  const login = useCallback(
    async (payload: LoginDTO) => {
      const data = await apiLogin(payload);

      // Backend geralmente retorna: { success: true, token: "..." }
      const token =
        data.token ||
        data.accessToken ||
        data?.data?.token ||
        data?.data?.accessToken;

      if (!token) {
        console.warn(
          "Nenhum token encontrado na resposta do login. Ajuste o caminho conforme o seu backend."
        );
      } else {
        setToken(token);
      }

      return data;
    },
    [setToken]
  );

  /* --------------------------------------------------
     REGISTER
  -------------------------------------------------- */
  const register = useCallback(async (payload: RegisterDTO) => {
    return await apiRegister(payload);
  }, []);

  const chat = useCallback(async (payload: ChatMessageDTO) => {
    const res = await chatWithAI(payload);

    // res = { success: true, data: {...} }
    return res as ChatApiResponse;
  }, []);

  const value: ApiContextValue = {
    token,
    setToken,
    chat,
    login,
    register,
  };

  return <ApiContext.Provider value={value}>{children}</ApiContext.Provider>;
}

export const useApi = (): ApiContextValue => {
  const ctx = useContext(ApiContext);
  if (!ctx) throw new Error("useApi deve ser usado dentro de ApiProvider");
  return ctx;
};
