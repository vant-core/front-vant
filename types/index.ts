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

/* -------------------------------------------------------
   🔥 WORKSPACE ACTION (IA → FRONT)
------------------------------------------------------- */

export type WorkspaceActionType =
  | "folder_created"
  | "folder_path_created"
  | "subfolder_created"
  | "item_added"
  | "item_added_to_path"
  | "item_added_to_folderpath"
  | "folders_listed"
  | "items_searched"
  | "folder_deleted";

export interface WorkspaceAction {
  action: WorkspaceActionType;
  folder?: Folder;
  item?: FolderItem;
  folders?: FolderWithCount[];
  items?: FolderItem[];
  count?: number;
}

/* -------------------------------------------------------
   📊 REPORT DATA (NOVO)
------------------------------------------------------- */

/**
 * Dados de um relatório gerado pela IA
 */
export interface ReportData {
  html: string;
  data: {
    title: string;
    subtitle?: string;
    generatedAt: string;
    sections: ReportSection[];
    metadata?: {
      userId?: string;
      folderId?: string;
      totalItems?: number;
      dateRange?: {
        start: string;
        end: string;
      };
    };
  };
}

/**
 * Seção do relatório
 */
export interface ReportSection {
  id?: string;
  title: string;
  type: 'text' | 'table' | 'cards' | 'list' | 'chart';
  content: any;
  description?: string;
}

/**
 * Card de resumo
 */
export interface ReportCard {
  label: string;
  value: string | number;
  icon?: string;
  description?: string;
}

/**
 * Conteúdo de tabela
 */
export interface ReportTableContent {
  headers: string[];
  rows: (string | number)[][];
}

/**
 * Item de lista
 */
export interface ReportListItem {
  title: string;
  description?: string;
  tags?: string[];
  metadata?: Record<string, any>;
}

/**
 * Configuração visual do relatório
 */
export interface ReportConfig {
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  fontFamily?: string;
  logo?: string;
}

/* -------------------------------------------------------
   CHATApiResponse (ATUALIZADO COM REPORT)
------------------------------------------------------- */

export interface ChatApiResponse {
  success: boolean;
  data: {
    conversationId: string;
    message: string;
    file?: FileInfo;
    workspace?: WorkspaceAction;
    report?: ReportData; // 🔥 NOVO: dados do relatório
    usage?: OpenAIUsage;
    _links?: Record<string, any>;
  };
}

/* -------------------------------------------------------
   EVENT REGISTRATION
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

export type FolderPath = string[]; // Ex: ["Eventos", "Coca-Cola", "Financeiro"]

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

/* -------------------------------------------------------
   🔥 DTOS DO NOVO SISTEMA DE PASTAS PROFUNDAS
------------------------------------------------------- */

/**
 * Criar uma estrutura completa via path string
 * Ex: "Eventos/Coca-Cola/Financeiro"
 */
export interface CreateFolderPathDTO {
  path: string; // caminho único
  icon?: string;
  color?: string;
}

/**
 * Criar subpasta via array
 * Ex: ["Eventos", "Coca-Cola"] + name: "Financeiro"
 */
export interface CreateSubfolderDTO {
  folderPath: FolderPath;
  name: string;
  icon?: string;
  color?: string;
}

/**
 * Adicionar item usando folderPath array
 */
export interface AddItemToFolderPathDTO {
  folderPath: FolderPath;
  title: string;
  content: Record<string, any>;
  itemType?: string;
  tags?: string[];
}

/**
 * Adicionar item usando path string
 * Ex: "Eventos/Coca-Cola/Financeiro"
 */
export interface AddItemToPathDTO {
  path: string;
  title: string;
  content: Record<string, any>;
  itemType?: string;
  tags?: string[];
}

/**
 * Busca por itens profundos
 */
export interface SearchItemsDTO {
  query?: string;
  folderPath?: FolderPath;
  tags?: string[];
}

/* -------------------------------------------------------
   📊 REPORT DTOs (NOVO)
------------------------------------------------------- */

/**
 * DTO para gerar relatório
 * Usado tanto para preview quanto para PDF
 */
export interface GenerateReportDTO {
  userId?: string; // Opcional no frontend (backend pega do token)
  folderId?: string; // Se quiser filtrar por pasta específica
  title?: string; // Título customizado
  subtitle?: string;
  config?: ReportConfig; // Configurações visuais
  filters?: {
    dateFrom?: string;
    dateTo?: string;
    tags?: string[];
    itemTypes?: string[];
  };
}

/**
 * Resposta do preview do relatório
 */
export interface ReportPreviewResponse {
  success: boolean;
  html: string;
  data: {
    title: string;
    subtitle?: string;
    generatedAt: string;
    sections: ReportSection[];
    metadata?: any;
  };
  config?: ReportConfig;
}

/**
 * DTO para gerar PDF a partir de HTML customizado
 */
export interface GenerateReportFromHTMLDTO {
  html: string;
  filename?: string;
}