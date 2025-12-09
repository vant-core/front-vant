"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useApi } from "@/context/apiContext";
import type { ChatMessageDTO, FileInfo } from "@/types/index";

// Componente de arquivo
import AIToolbox from "@/components/filesGenerator/AiToolbox";

interface Message {
  id: string;
  type: "user" | "bot";
  text: string;
  timestamp: Date;
  file?: FileInfo; // 🔥 MUDOU: agora usa FileInfo do backend
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "bot",
      text: "Olá! Sou sua IA de eventos. Como posso te ajudar hoje?",
      timestamp: new Date()
    }
  ]);

  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | undefined>();

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { chat } = useApi();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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

    try {
      const payload: ChatMessageDTO = {
        message: textToSend,
        conversationId
      };

      const resp = await chat(payload);

      // 🔥 DEBUG: ver a resposta completa
      console.log("📡 Resposta da IA:", resp);
      console.log("📄 Arquivo recebido:", resp.data.file);

      const newConvId = resp.data.conversationId;
      if (newConvId && newConvId !== conversationId) {
        setConversationId(newConvId);
      }

      const botResponseText = resp.data.message;
      const fileInfo = resp.data.file; // 🔥 ARQUIVO GERADO PELA IA

      const botMessage: Message = {
        id: crypto.randomUUID(),
        type: "bot",
        text: botResponseText,
        timestamp: new Date(),
        file: fileInfo // 🔥 INCLUI ARQUIVO SE EXISTIR
      };

      setMessages(prev => [...prev, botMessage]);

    } catch (err: any) {
      console.error(err);

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

  return (
    <div className="flex flex-col h-[600px] bg-card rounded-lg border border-border shadow-sm overflow-hidden">
      
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">

        {messages.map(message => (
          <div key={message.id} className="space-y-2">
            <div
              className={`flex ${
                message.type === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.type === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-foreground"
                }`}
              >
                <p className="text-sm leading-relaxed">{message.text}</p>
                <span className="text-xs opacity-70 mt-1 block">
                  {message.timestamp.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit"
                  })}
                </span>
              </div>
            </div>

            {/* 🔥 SE TEM ARQUIVO GERADO → MOSTRA CARD DE DOWNLOAD */}
            {message.file && (
              <AIToolbox fileInfo={message.file} />
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-muted text-foreground px-4 py-2 rounded-lg">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce delay-100" />
                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce delay-200" />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-border p-4">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <Input
            type="text"
            placeholder="Digite sua mensagem..."
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            disabled={isLoading}
            className="flex-1"
          />
          <Button
            type="submit"
            disabled={isLoading || !inputValue.trim()}
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            Enviar
          </Button>
        </form>
      </div>
    </div>
  );
}