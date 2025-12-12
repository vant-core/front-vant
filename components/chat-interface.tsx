"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useApi } from "@/context/apiContext";
import type { ChatMessageDTO, FileInfo, ReportData } from "@/types/index";
import AIToolbox from "@/components/filesGenerator/AiToolbox";
import FunctionalityCards from "@/components/functionalityCard";
import { Sparkles, Send, Lightbulb, X, FileText, Eye, ExternalLink } from "lucide-react";
import { useRouter } from "next/navigation";

interface Message {
  id: string;
  type: "user" | "bot";
  text: string;
  timestamp: Date;
  file?: FileInfo;
  report?: ReportData; // 🔥 NOVO
}

export default function ChatInterface() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "bot",
      text: "Olá! Sou sua IA especializada em eventos. 🎉\n\nPosso te ajudar a:\n• Organizar informações automaticamente\n• Gerar documentos (PDF, DOCX, CSV, XLSX)\n• Criar relatórios profissionais\n• Gerenciar eventos e fornecedores\n\nClique no ícone 💡 para ver exemplos de uso!",
      timestamp: new Date()
    }
  ]);

  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | undefined>();
  const [showExamples, setShowExamples] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { chat } = useApi();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 🔥 Função para salvar relatório no localStorage
  const saveReportToLocalStorage = (reportData: ReportData) => {
    try {
      const newReport = {
        id: `report_${Date.now()}`,
        title: reportData.data.title,
        subtitle: reportData.data.subtitle,
        createdAt: reportData.data.generatedAt,
        data: reportData
      };

      const saved = localStorage.getItem("generated_reports");
      const reports = saved ? JSON.parse(saved) : [];
      const updated = [newReport, ...reports];

      localStorage.setItem("generated_reports", JSON.stringify(updated));

      console.log('✅ Relatório salvo no localStorage:', newReport.id);

      // Mostra notificação
      showNotification({
        type: 'success',
        title: 'Relatório Gerado! 📊',
        message: `"${newReport.title}" foi salvo com sucesso.`,
      });

      return true;
    } catch (error) {
      console.error('❌ Erro ao salvar relatório:', error);
      return false;
    }
  };

  // 🔥 Sistema de notificações
  const showNotification = ({ type, title, message }: { 
    type: 'success' | 'error' | 'info', 
    title: string, 
    message: string 
  }) => {
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg ${
      type === 'success' ? 'bg-green-500' : 
      type === 'error' ? 'bg-red-500' : 
      'bg-blue-500'
    } text-white max-w-md animate-in slide-in-from-right-5 duration-300`;
    
    notification.innerHTML = `
      <div class="flex items-start gap-3">
        <div class="flex-1">
          <h4 class="font-bold mb-1">${title}</h4>
          <p class="text-sm">${message}</p>
        </div>
        <button onclick="this.parentElement.parentElement.remove()" class="text-white/80 hover:text-white">
          ✕
        </button>
      </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.remove();
    }, 5000);
  };

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

    const textToSend = inputValue;
    setInputValue("");
    setIsLoading(true);
    setShowExamples(false);

    try {
      const payload: ChatMessageDTO = {
        message: textToSend,
        conversationId
      };

      const resp = await chat(payload);

      console.log("📡 Resposta completa da IA:", resp);
      console.log("📄 Arquivo recebido:", resp.data.file);
      console.log("📊 Relatório recebido:", resp.data.report); // 🔥 NOVO LOG

      const newConvId = resp.data.conversationId;
      if (newConvId && newConvId !== conversationId) {
        setConversationId(newConvId);
      }

      const botResponseText = resp.data.message;
      const fileInfo = resp.data.file;
      const reportData = resp.data.report; // 🔥 NOVO

      const botMessage: Message = {
        id: crypto.randomUUID(),
        type: "bot",
        text: botResponseText,
        timestamp: new Date(),
        file: fileInfo,
        report: reportData // 🔥 NOVO
      };

      setMessages(prev => [...prev, botMessage]);

      // 🔥 Se gerou relatório, salva automaticamente
      if (reportData) {
        console.log('📊 Relatório detectado, salvando...');
        saveReportToLocalStorage(reportData);
      }

    } catch (err: any) {
      console.error('❌ Erro completo:', err);

      const errorMessage: Message = {
        id: crypto.randomUUID(),
        type: "bot",
        text:
          err?.response?.data?.message ||
          "Ocorreu um erro ao falar com a IA. Tente novamente.",
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMessage]);

    } finally {
      setIsLoading(false);
    }
  };

  const useExamplePrompt = (prompt: string) => {
    setInputValue(prompt);
    setShowExamples(false);
  };

  return (
    <div className="relative w-full max-w-7xl mx-auto px-4">
      
      <div className="flex flex-col bg-gradient-to-br from-card to-card/50 rounded-2xl border border-border/50 shadow-2xl overflow-hidden backdrop-blur-sm">
        
        {/* Header Premium */}
        <div className="relative flex items-center justify-between px-6 py-5 border-b border-border/50 bg-gradient-to-r from-primary/5 to-primary/10">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Sparkles className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="font-bold text-xl text-foreground">Assistente de Eventos</h2>
              <p className="text-xs text-muted-foreground">Inteligência artificial sempre pronta para ajudar</p>
            </div>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowExamples(!showExamples)}
            className="gap-2 hover:bg-primary/10 transition-all"
          >
            <Lightbulb className={`w-4 h-4 ${showExamples ? 'text-primary' : ''}`} />
            Exemplos
          </Button>
        </div>

        {/* Messages Area */}
        <div className="relative flex-1 overflow-y-auto px-6 py-8 space-y-6 min-h-[65vh] max-h-[70vh] bg-gradient-to-b from-background/50 to-muted/20">
          
          {messages.map(message => (
            <div key={message.id} className="space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div
                className={`flex ${
                  message.type === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-2xl px-6 py-4 rounded-2xl shadow-lg ${
                    message.type === "user"
                      ? "bg-gradient-to-br from-primary to-primary/90 text-primary-foreground"
                      : "bg-gradient-to-br from-card to-muted border border-border/50"
                  }`}
                >
                  <p className="text-base leading-relaxed whitespace-pre-wrap">{message.text}</p>
                  <span className="text-xs opacity-60 mt-2 block">
                    {message.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit"
                    })}
                  </span>
                </div>
              </div>

              {/* 🔥 NOVO: Botão para ver relatório */}
              {message.report && (
                <div className="pl-4 flex gap-2">
                  <Button
                    onClick={() => router.push('/reports')}
                    className="gap-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-lg"
                  >
                    <FileText className="w-4 h-4" />
                    Ver Relatório na Página de Relatórios
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={() => {
                      // Abre em nova aba o preview
                      const blob = new Blob([message.report!.html], { type: 'text/html' });
                      const url = URL.createObjectURL(blob);
                      window.open(url, '_blank');
                    }}
                    className="gap-2 border-green-600 text-green-600 hover:bg-green-50"
                  >
                    <Eye className="w-4 h-4" />
                    Preview Rápido
                  </Button>
                </div>
              )}

              {/* Arquivo */}
              {message.file && (
                <div className="pl-4">
                  <AIToolbox fileInfo={message.file} />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start animate-in fade-in slide-in-from-bottom-2">
              <div className="bg-gradient-to-br from-card to-muted border border-border/50 px-6 py-4 rounded-2xl shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="flex space-x-1.5">
                    <div className="w-2.5 h-2.5 bg-primary/70 rounded-full animate-bounce" />
                    <div className="w-2.5 h-2.5 bg-primary/70 rounded-full animate-bounce [animation-delay:0.2s]" />
                    <div className="w-2.5 h-2.5 bg-primary/70 rounded-full animate-bounce [animation-delay:0.4s]" />
                  </div>
                  <span className="text-sm text-muted-foreground">Pensando...</span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t border-border/50 bg-gradient-to-r from-muted/30 to-muted/20 p-6">
          <form onSubmit={handleSendMessage} className="flex gap-3">
            <div className="flex-1 relative">
              <Input
                type="text"
                placeholder="Digite sua mensagem aqui... (Ex: 'Gere um relatório dos meus eventos')"
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                disabled={isLoading}
                className="h-14 px-6 text-base rounded-xl border-2 border-border/50 focus:border-primary transition-all shadow-sm"
              />
            </div>
            <Button
              type="submit"
              disabled={isLoading || !inputValue.trim()}
              className="h-14 px-8 rounded-xl bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg transition-all gap-2 text-base font-medium"
            >
              <Send className="w-5 h-5" />
              Enviar
            </Button>
          </form>
          
          <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
            <Sparkles className="w-3 h-3" />
            <span>Dica: Peça &quot;gere um relatório&quot; para criar documentos profissionais</span>
          </div>
        </div>
      </div>

      {/* Modal de Exemplos */}
      {showExamples && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setShowExamples(false)}
        >
          <div 
            className="bg-card rounded-2xl border border-border shadow-2xl max-w-4xl w-full max-h-[85vh] overflow-hidden animate-in slide-in-from-bottom-4 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-6 border-b border-border bg-gradient-to-r from-primary/5 to-primary/10">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Lightbulb className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Exemplos de Uso</h3>
                  <p className="text-sm text-muted-foreground">Clique em qualquer exemplo para testar</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowExamples(false)}
                className="rounded-full"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="overflow-y-auto max-h-[calc(85vh-5rem)]">
              <FunctionalityCards onSelectPrompt={useExamplePrompt} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}