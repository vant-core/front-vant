// src/contexts/ApiContext.tsx
"use client";

import { createContext, useContext, useState, useCallback, useEffect } from "react";
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
  const [token, setTokenState] = useState<string | null>(null);

  // Carrega token salvo no localStorage ao iniciar
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("token");
      if (stored) {
        setTokenState(stored);
        api.defaults.headers.common.Authorization = `Bearer ${stored}`;
      }
    }
  }, []);

  // Define token corretamente e joga no axios
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

  // LOGIN
  const login = useCallback(
    async (payload: LoginDTO) => {
      const res = await apiLogin(payload);

      const token =
        res?.token ||
        res?.accessToken ||
        res?.data?.token ||
        res?.data?.accessToken;

      if (token) {
        setToken(token);
      }

      return res;
    },
    [setToken]
  );

  // REGISTER
  const register = useCallback(async (payload: RegisterDTO) => {
    return await apiRegister(payload);
  }, []);

  // CHAT
  const chat = useCallback(async (payload: ChatMessageDTO) => {
    const res = await chatWithAI(payload);
    return res as ChatApiResponse;
  }, []);

  return (
    <ApiContext.Provider
      value={{ token, setToken, chat, login, register }}
    >
      {children}
    </ApiContext.Provider>
  );
}

export const useApi = (): ApiContextValue => {
  const ctx = useContext(ApiContext);
  if (!ctx) throw new Error("useApi deve ser usado dentro de ApiProvider");
  return ctx;
};
