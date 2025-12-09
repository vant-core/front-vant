// src/types/api.ts

/* -------------------------------------------------------
   USER / AUTH
------------------------------------------------------- */

export interface UserPayload {
  id: string;
  name: string;
  email?: string;
  phone?: string;
}

export interface RegisterDTO {
  name: string;
  email: string;
  password: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface JWTPayload {
  userId: string;
}

export interface WhatsappUserDTO {
  phone: string;
  name?: string;
}

/* -------------------------------------------------------
   CHAT / AI
------------------------------------------------------- */

export interface ChatMessageDTO {
  message: string;
  conversationId?: string | null;
}

export interface OpenAIMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface OpenAIUsage {
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
}

export interface OpenAIResponse {
  content: string;
  usage?: OpenAIUsage;
}

/**
 * 🔥 Informações do arquivo gerado
 */
export interface FileInfo {
  url?: string;
  type?: "pdf" | "docx" | "csv" | "xlsx";
  name?: string;
  fileName?: string;
  fileType?: "pdf" | "docx" | "csv" | "xlsx";
  title?: string;
  downloadUrl?: string;
}

/**
 * 🔥 Dados de ação do workspace
 */
export interface WorkspaceAction {
  action: 
    | "folder_created" 
    | "item_added" 
    | "folders_listed" 
    | "items_searched" 
    | "folder_deleted";
  folder?: Folder;
  item?: FolderItem;
  folders?: FolderWithCount[];
  items?: FolderItem[];
  count?: number;
}

/**
 * Resposta do backend em /api/ai/chat
 */
export interface ChatApiResponse {
  success: boolean;
  data: {
    conversationId: string;
    message: string;
    file?: FileInfo;
    workspace?: WorkspaceAction; // 🔥 NOVO
    usage?: OpenAIUsage;
    _links?: Record<string, any>;
  };
}

/* -------------------------------------------------------
   EVENT DATA / REGISTRATION
------------------------------------------------------- */

export interface ExtractedEventData {
  quantidade?: number | string;
  item?: string;
  produto?: string;
  categoria?: string;
  fornecedor?: string;
  valorUnitario?: number;
  valorTotal?: number;
  dataEntrega?: string;
  local?: string;
  [key: string]: any;
}

export interface EventRegistrationDTO {
  id?: string;
  userId: string;
  conversationId?: string | null;
  data: ExtractedEventData;
  createdAt?: string;
}

/* -------------------------------------------------------
   🔥 WORKSPACE TYPES
------------------------------------------------------- */

export interface Folder {
  id: string;
  userId: string;
  name: string;
  description?: string;
  icon: string;
  color: string;
  parentId?: string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface FolderItem {
  id: string;
  folderId: string;
  userId: string;
  title: string;
  content: Record<string, any>;
  itemType?: string;
  tags: string[];
  createdAt: Date | string;
  updatedAt: Date | string;
  folder?: {
    id: string;
    name: string;
    icon: string;
    color: string;
  };
}

export interface FolderWithCount extends Folder {
  itemCount: number;
  subFolders?: Array<{
    id: string;
    name: string;
    icon: string;
    color: string;
  }>;
}

export interface WorkspaceStats {
  totalFolders: number;
  totalItems: number;
  itemsByType: Array<{
    type: string;
    count: number;
  }>;
}