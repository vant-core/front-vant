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
  WorkspaceStats,
  CreateFolderPathDTO,
  CreateSubfolderDTO,
  AddItemToFolderPathDTO,
  AddItemToPathDTO,
  SearchItemsDTO,
  GenerateReportDTO,
  ReportPreviewResponse,
  GenerateReportFromHTMLDTO
} from '../types/index';

const isLocalhost =
  typeof window !== 'undefined' &&
  (window.location.hostname === 'localhost' ||
   window.location.hostname === '127.0.0.1');

const apiBaseURL = isLocalhost
  ? 'http://localhost:3000'
  : 'https://back-end-ypsc.onrender.com';

const api = axios.create({
  baseURL: apiBaseURL,
  withCredentials: true,
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/* ---------------------------------------------------------
   AUTH
--------------------------------------------------------- */
export const login = async (payload: LoginDTO) => {
  const { data } = await api.post('/api/auth/login', payload);
  return data;
};

export const register = async (payload: RegisterDTO) => {
  const { data } = await api.post('/api/auth/register', payload);
  return data;
};

/* ---------------------------------------------------------
   CHAT
--------------------------------------------------------- */
export const chatWithAI = async (
  payload: ChatMessageDTO
): Promise<ChatApiResponse> => {
  const { data } = await api.post<ChatApiResponse>('/api/ai/chat', payload);
  return data;
};

/* ---------------------------------------------------------
   EVENT REGISTRATION
--------------------------------------------------------- */
export const saveEventRegistration = async (
  payload: EventRegistrationDTO
) => {
  const { data } = await api.post('/api/events/registration', payload);
  return data;
};

/* ---------------------------------------------------------
   FILES
--------------------------------------------------------- */
export const downloadFile = async (fileName: string): Promise<Blob> => {
  const response = await api.get(`/api/files/download/${fileName}`, {
    responseType: 'blob'
  });
  return response.data;
};

/* ---------------------------------------------------------
   WORKSPACE (Hierárquico Profundo)
--------------------------------------------------------- */

export const getFolders = async (): Promise<FolderWithCount[]> => {
  const { data } = await api.get('/api/workspace/folders');
  return data.data.folders;
};

export const getFolder = async (id: string): Promise<Folder> => {
  const { data } = await api.get(`/api/workspace/folders/${id}`);
  return data.data.folder;
};

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

export const getItem = async (id: string): Promise<FolderItem> => {
  const { data } = await api.get(`/api/workspace/items/${id}`);
  return data.data.item;
};

export const deleteFolder = async (id: string): Promise<void> => {
  await api.delete(`/api/workspace/folders/${id}`);
};

export const deleteItem = async (id: string): Promise<void> => {
  await api.delete(`/api/workspace/items/${id}`);
};

export const getWorkspaceStats = async (): Promise<WorkspaceStats> => {
  const { data } = await api.get('/api/workspace/stats');
  return data.data;
};

/* ---------------------------------------------------------
   Caminhos Profundos
--------------------------------------------------------- */

export const createFolderPath = async (payload: CreateFolderPathDTO) => {
  const { data } = await api.post('/api/workspace/folder-path', payload);
  return data;
};

export const createSubfolder = async (payload: CreateSubfolderDTO) => {
  const { data } = await api.post('/api/workspace/subfolder', payload);
  return data;
};

export const addItemToFolderPath = async (
  payload: AddItemToFolderPathDTO
) => {
  const { data } = await api.post('/api/workspace/add-item-folderpath', payload);
  return data;
};

export const addItemToPath = async (
  payload: AddItemToPathDTO
) => {
  const { data } = await api.post('/api/workspace/add-item-path', payload);
  return data;
};

export const searchItems = async (
  payload: SearchItemsDTO
) => {
  const { data } = await api.post('/api/workspace/search', payload);
  return data.data;
};

/* ---------------------------------------------------------
   📊 REPORTS (NOVO)
--------------------------------------------------------- */

/**
 * Gera preview HTML do relatório
 * Usado quando a IA chama a função generate_report
 */
export const generateReportPreview = async (
  payload: GenerateReportDTO
): Promise<ReportPreviewResponse> => {
  const { data } = await api.post('/api/reports/preview', payload);
  return data;
};

/**
 * Gera e baixa PDF do relatório a partir dos dados do workspace
 */
export const generateReportPDF = async (
  payload: GenerateReportDTO
): Promise<Blob> => {
  const response = await api.post('/api/reports/generate-pdf', payload, {
    responseType: 'blob'
  });
  return response.data;
};

/**
 * Gera PDF a partir de HTML customizado (já renderizado)
 * Útil quando já temos o HTML do relatório e queremos gerar PDF
 */
export const generatePDFFromHTML = async (
  payload: GenerateReportFromHTMLDTO
): Promise<Blob> => {
  const response = await api.post('/api/reports/generate-from-html', payload, {
    responseType: 'blob'
  });
  return response.data;
};

/**
 * Helper: Baixa o PDF gerado
 */
export const downloadReportPDF = async (
  payload: GenerateReportDTO,
  filename?: string
) => {
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

/**
 * Helper: Baixa PDF a partir do HTML
 */
export const downloadPDFFromHTML = async (
  html: string,
  filename?: string
) => {
  try {
    const blob = await generatePDFFromHTML({ html });
    
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

export default api;