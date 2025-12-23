"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useApi } from "@/context/apiContext";
import type { ChatMessageDTO, FileInfo, ReportData } from "@/types/index";
import AIToolbox from "@/components/filesGenerator/AiToolbox";
import FunctionalityCards from "@/components/functionalityCard";
import { Sparkles, Send, Lightbulb, X, FileText, Eye, Download } from "lucide-react";
import { useRouter } from "next/navigation";

/* --------------------------------------------------
   TYPES
-------------------------------------------------- */
interface Message {
  id: string;
  type: "user" | "bot";
  text: string;
  timestamp: Date;
  file?: FileInfo;
  report?: ReportData;
}

/* --------------------------------------------------
   LOCAL STORAGE KEYS
-------------------------------------------------- */
const STORAGE_KEY_MESSAGES = "chat_messages";
const STORAGE_KEY_CONVERSATION = "chat_conversation_id";
const STORAGE_KEY_REPORTS = "saved_reports"; // Nova chave para relatórios

/* --------------------------------------------------
   COMPONENT
-------------------------------------------------- */
export default function ChatInterface() {
  const router = useRouter();
  const { chat } = useApi();

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | undefined>();
  const [showExamples, setShowExamples] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  /* --------------------------------------------------
     LOAD HISTORY ON MOUNT
  -------------------------------------------------- */
  useEffect(() => {
    try {
      const savedMessages = localStorage.getItem(STORAGE_KEY_MESSAGES);
      const savedConversationId = localStorage.getItem(STORAGE_KEY_CONVERSATION);

      if (savedMessages) {
        const parsed: Message[] = JSON.parse(savedMessages).map((m: any) => ({
          ...m,
          timestamp: new Date(m.timestamp)
        }));
        setMessages(parsed);
      } else {
        // Mensagem inicial padrão
        setMessages([
          {
            id: "welcome",
            type: "bot",
            text:
              "Olá! Sou sua IA especializada em eventos. 🎉\n\n" +
              "Posso te ajudar a:\n" +
              "• Organizar informações automaticamente\n" +
              "• Gerar documentos (PDF, DOCX, CSV, XLSX)\n" +
              "• Criar relatórios profissionais\n" +
              "• Gerenciar eventos e fornecedores\n\n" +
              "Clique no ícone 💡 para ver exemplos de uso!",
            timestamp: new Date()
          }
        ]);
      }

      if (savedConversationId) {
        setConversationId(savedConversationId);
      }
    } catch (err) {
      console.error("❌ Erro ao carregar histórico:", err);
    }
  }, []);

  /* --------------------------------------------------
     SAVE HISTORY
  -------------------------------------------------- */
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(STORAGE_KEY_MESSAGES, JSON.stringify(messages));
    }
  }, [messages]);

  useEffect(() => {
    if (conversationId) {
      localStorage.setItem(STORAGE_KEY_CONVERSATION, conversationId);
    }
  }, [conversationId]);

  /* --------------------------------------------------
     SAVE REPORT TO LOCAL STORAGE
  -------------------------------------------------- */
  const saveReportToStorage = (report: ReportData) => {
    try {
      // Carrega relatórios existentes
      const existingReports = localStorage.getItem(STORAGE_KEY_REPORTS);
      const reports = existingReports ? JSON.parse(existingReports) : [];

      // Cria objeto do relatório com metadados
      const reportWithMetadata = {
        id: crypto.randomUUID(),
        title: report.data?.title || "Relatório sem título",
        subtitle: report.data?.subtitle,
        html: report.html,
        data: report.data,
        createdAt: new Date().toISOString(),
        conversationId: conversationId
      };

      // Adiciona no início da lista
      reports.unshift(reportWithMetadata);

      // Limita a 50 relatórios salvos
      const limitedReports = reports.slice(0, 50);

      // Salva no localStorage
      localStorage.setItem(STORAGE_KEY_REPORTS, JSON.stringify(limitedReports));

      console.log("✅ Relatório salvo com sucesso:", reportWithMetadata.id);

      return reportWithMetadata;
    } catch (error) {
      console.error("❌ Erro ao salvar relatório:", error);
      return null;
    }
  };

  /* --------------------------------------------------
     SCROLL
  -------------------------------------------------- */
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  /* --------------------------------------------------
     SEND MESSAGE
  -------------------------------------------------- */
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      type: "user",
      text: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);
    setShowExamples(false);

    try {
      const payload: ChatMessageDTO = {
        message: userMessage.text,
        conversationId
      };

      const resp = await chat(payload);

      if (resp.data.conversationId && resp.data.conversationId !== conversationId) {
        setConversationId(resp.data.conversationId);
      }

      const botMessage: Message = {
        id: crypto.randomUUID(),
        type: "bot",
        text: resp.data.message,
        timestamp: new Date(),
        file: resp.data.file,
        report: resp.data.report
      };

      // 🔥 SALVA RELATÓRIO SE EXISTIR
      if (resp.data.report) {
        const savedReport = saveReportToStorage(resp.data.report);
        
        if (savedReport) {
          // Atualiza mensagem com ID do relatório salvo
          botMessage.report = resp.data.report;
        }
      }

      setMessages(prev => [...prev, botMessage]);
    } catch (err: any) {
      setMessages(prev => [
        ...prev,
        {
          id: crypto.randomUUID(),
          type: "bot",
          text:
            err?.response?.data?.message ||
            "Ocorreu um erro ao falar com a IA. Tente novamente.",
          timestamp: new Date()
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const useExamplePrompt = (prompt: string) => {
    setInputValue(prompt);
    setShowExamples(false);
  };

  /* --------------------------------------------------
     DOWNLOAD PDF
  -------------------------------------------------- */
  const handleDownloadPDF = async (reportHtml: string, reportTitle: string) => {
    try {
      const response = await fetch('/api/reports/generate-from-html', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ html: reportHtml })
      });

      if (!response.ok) {
        throw new Error('Erro ao gerar PDF');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${reportTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_${Date.now()}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Erro ao baixar PDF:', error);
      alert('Erro ao baixar PDF. Tente novamente.');
    }
  };

  /* --------------------------------------------------
     RENDER
  -------------------------------------------------- */
  return (
    <div className="relative w-full max-w-7xl mx-auto px-4">
      <div className="flex flex-col bg-gradient-to-br from-card to-card/50 rounded-2xl border border-border/50 shadow-2xl overflow-hidden backdrop-blur-sm">
        
        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-border/50 bg-gradient-to-r from-primary/5 to-primary/10">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Sparkles className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="font-bold text-xl">Assistente de Eventos</h2>
              <p className="text-xs text-muted-foreground">
                Conversa contínua salva automaticamente
              </p>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowExamples(!showExamples)}
            className="gap-2"
          >
            <Lightbulb className="w-4 h-4" />
            Exemplos
          </Button>
        </div>

        {/* MESSAGES */}
        <div className="flex-1 overflow-y-auto px-6 py-8 space-y-6 min-h-[65vh] max-h-[70vh]">
          {messages.map(message => (
            <div key={message.id} className="space-y-3">
              <div className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-2xl px-6 py-4 rounded-2xl shadow-lg ${
                    message.type === "user"
                      ? "bg-gradient-to-br from-primary to-primary/90 text-primary-foreground"
                      : "bg-gradient-to-br from-card to-muted border border-border/50"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{message.text}</p>
                  <span className="text-xs opacity-60 block mt-2">
                    {message.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit"
                    })}
                  </span>
                </div>
              </div>

              {/* REPORT ACTIONS */}
              {message.report && (
                <div className="pl-4 flex flex-wrap gap-2">
                  <Button 
                    onClick={() => router.push("/reports")} 
                    className="gap-2"
                    size="sm"
                  >
                    <FileText className="w-4 h-4" />
                    Ver Todos os Relatórios
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const blob = new Blob([message.report!.html], { type: "text/html" });
                      const url = URL.createObjectURL(blob);
                      window.open(url, "_blank");
                    }}
                    className="gap-2"
                  >
                    <Eye className="w-4 h-4" />
                    Preview
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownloadPDF(
                      message.report!.html, 
                      message.report!.data?.title || 'relatorio'
                    )}
                    className="gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Baixar PDF
                  </Button>
                </div>
              )}

              {/* FILE ACTIONS */}
              {message.file && (
                <div className="pl-4">
                  <AIToolbox fileInfo={message.file} />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="px-6 py-4 rounded-2xl bg-muted flex items-center gap-3">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent" />
                <span>Processando...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* INPUT */}
        <div className="border-t border-border/50 p-6 bg-gradient-to-br from-muted/30 to-muted/10">
          <form onSubmit={handleSendMessage} className="flex gap-3">
            <Input
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              disabled={isLoading}
              placeholder="Digite sua mensagem..."
              className="h-14 text-base"
            />
            <Button
              type="submit"
              disabled={isLoading || !inputValue.trim()}
              className="h-14 px-8 gap-2"
            >
              <Send className="w-5 h-5" />
              Enviar
            </Button>
          </form>
        </div>
      </div>

      {/* MODAL EXEMPLOS */}
      {showExamples && (
        <div
          className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
          onClick={() => setShowExamples(false)}
        >
          <div
            className="bg-card rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-6 border-b sticky top-0 bg-card z-10">
              <h3 className="font-bold text-xl">💡 Exemplos de Uso</h3>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setShowExamples(false)}
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
            <FunctionalityCards onSelectPrompt={useExamplePrompt} />
          </div>
        </div>
      )}
    </div>
  );
}