// src/services/api.ts
import axios from 'axios';
import {
  ChatMessageDTO,
  ChatApiResponse,
  LoginDTO,
  RegisterDTO,
  EventRegistrationDTO,
  Folder,
  FolderItem,
  FolderWithCount,
  WorkspaceStats
} from '../types/index';

const api = axios.create({
  baseURL: 'http://localhost:3000',
  withCredentials: true
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/* --------- AUTH --------- */

export const login = async (payload: LoginDTO) => {
  try {
    const { data } = await api.post('/api/auth/login', payload);
    return data;
  } catch (error: any) {
    console.error('LOGIN ERROR:', error?.message, error?.response?.status, error?.response?.data);
    throw error;
  }
};

export const register = async (payload: RegisterDTO) => {
  const { data } = await api.post('/api/auth/register', payload);
  return data;
};

/* --------- CHAT / AI --------- */

export const chatWithAI = async (
  payload: ChatMessageDTO
): Promise<ChatApiResponse> => {
  const { data } = await api.post<ChatApiResponse>('/api/ai/chat', payload);
  return data;
};

/* --------- EVENT REGISTRATION --------- */

export const saveEventRegistration = async (
  payload: EventRegistrationDTO
) => {
  const { data } = await api.post('/api/events/registration', payload);
  return data;
};

/* --------- FILE DOWNLOAD --------- */

export const downloadFile = async (fileName: string): Promise<Blob> => {
  const response = await api.get(`/api/files/download/${fileName}`, {
    responseType: 'blob'
  });
  return response.data;
};

/* --------- 🔥 WORKSPACE API --------- */

/**
 * Lista todas as pastas do usuário
 */
export const getFolders = async (): Promise<FolderWithCount[]> => {
  const { data } = await api.get('/api/workspace/folders');
  return data.data.folders;
};

/**
 * Busca uma pasta específica com seus items
 */
export const getFolder = async (id: string): Promise<Folder> => {
  const { data } = await api.get(`/api/workspace/folders/${id}`);
  return data.data.folder;
};

/**
 * Lista todos os items (com filtros opcionais)
 */
export const getItems = async (filters?: {
  folderId?: string;
  itemType?: string;
  search?: string;
}): Promise<FolderItem[]> => {
  const params = new URLSearchParams();
  if (filters?.folderId) params.append('folderId', filters.folderId);
  if (filters?.itemType) params.append('itemType', filters.itemType);
  if (filters?.search) params.append('search', filters.search);

  const { data } = await api.get(`/api/workspace/items?${params.toString()}`);
  return data.data.items;
};

/**
 * Busca um item específico
 */
export const getItem = async (id: string): Promise<FolderItem> => {
  const { data } = await api.get(`/api/workspace/items/${id}`);
  return data.data.item;
};

/**
 * Deleta uma pasta (e seus items)
 */
export const deleteFolder = async (id: string): Promise<void> => {
  await api.delete(`/api/workspace/folders/${id}`);
};

/**
 * Deleta um item específico
 */
export const deleteItem = async (id: string): Promise<void> => {
  await api.delete(`/api/workspace/items/${id}`);
};

/**
 * Busca estatísticas do workspace
 */
export const getWorkspaceStats = async (): Promise<WorkspaceStats> => {
  const { data } = await api.get('/api/workspace/stats');
  return data.data;
};

export default api;