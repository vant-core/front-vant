"use client";

import { useState } from "react";
import { 
  FileText, 
  FolderPlus, 
  Database, 
  Search, 
  Trash2,
  Layers,
  Sparkles,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface FunctionalityCardsProps {
  onSelectPrompt: (prompt: string) => void;
}

interface Functionality {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  examples: {
    label: string;
    prompt: string;
  }[];
}

export default function FunctionalityCards({ onSelectPrompt }: FunctionalityCardsProps) {
  const [expandedCard, setExpandedCard] = useState<string | null>("generate_file");

  const functionalities: Functionality[] = [
    {
      id: "generate_file",
      title: "Gerar Arquivos",
      description: "Crie PDFs, DOCX, CSV ou XLSX automaticamente",
      icon: <FileText className="w-5 h-5" />,
      color: "text-blue-500",
      examples: [
        {
          label: "📄 Gerar PDF de Evento",
          prompt: "Gere um PDF com o nome 'Summit 2025' e 150 participantes"
        },
        {
          label: "📊 Criar Planilha",
          prompt: "Crie uma planilha XLSX com os fornecedores: Buffet Gourmet, Sonorização Tech e Decoração Plus"
        },
        {
          label: "📋 Lista em CSV",
          prompt: "Faça um CSV com as tarefas: confirmar buffet, reservar local, enviar convites"
        }
      ]
    },
    {
      id: "organize_events",
      title: "Organizar Eventos",
      description: "Sistema automático de pastas hierárquicas",
      icon: <Layers className="w-5 h-5" />,
      color: "text-purple-500",
      examples: [
        {
          label: "🎉 Registrar Evento Completo",
          prompt: "Tenho um evento da Coca-Cola com 200 pessoas no dia 15 de março em São Paulo, no Sheraton"
        },
        {
          label: "💰 Adicionar Financeiro",
          prompt: "O evento da Coca-Cola teve um custo de R$ 50.000 com pagamento parcelado em 3x"
        },
        {
          label: "👥 Registrar Participantes",
          prompt: "120 pessoas confirmaram presença no evento da Coca-Cola"
        }
      ]
    },
    {
      id: "folders",
      title: "Criar Pastas",
      description: "Organize informações em categorias",
      icon: <FolderPlus className="w-5 h-5" />,
      color: "text-green-500",
      examples: [
        {
          label: "📁 Nova Pasta Simples",
          prompt: "Crie uma pasta chamada 'Fornecedores Aprovados'"
        },
        {
          label: "🗂️ Estrutura Completa",
          prompt: "Crie a estrutura: Eventos/Aniversário Empresa/Logística/Transporte"
        },
        {
          label: "📂 Organização Temática",
          prompt: "Crie pastas para Congressos, Feiras e Lançamentos"
        }
      ]
    },
    {
      id: "add_items",
      title: "Salvar Informações",
      description: "Adicione dados organizados automaticamente",
      icon: <Database className="w-5 h-5" />,
      color: "text-orange-500",
      examples: [
        {
          label: "🛒 Registrar Compra",
          prompt: "Compramos 200 cadeiras da empresa XYZ por R$ 5.000"
        },
        {
          label: "📝 Salvar Contrato",
          prompt: "Fechamos contrato com a Buffet Gourmet, vigência até dezembro de 2025, valor R$ 30.000"
        },
        {
          label: "✅ Adicionar Tarefa",
          prompt: "Preciso confirmar a reserva do hotel até sexta-feira"
        }
      ]
    },
    {
      id: "search",
      title: "Buscar Informações",
      description: "Encontre dados salvos rapidamente",
      icon: <Search className="w-5 h-5" />,
      color: "text-cyan-500",
      examples: [
        {
          label: "🔍 Buscar por Fornecedor",
          prompt: "Mostre todas as compras da empresa XYZ"
        },
        {
          label: "📅 Buscar por Evento",
          prompt: "Quais informações temos sobre o evento da Coca-Cola?"
        },
        {
          label: "💵 Buscar Financeiro",
          prompt: "Liste todos os pagamentos pendentes"
        }
      ]
    },
    {
      id: "management",
      title: "Gerenciar Dados",
      description: "Liste, delete e organize suas informações",
      icon: <Trash2 className="w-5 h-5" />,
      color: "text-red-500",
      examples: [
        {
          label: "📋 Listar Pastas",
          prompt: "Mostre todas as minhas pastas"
        },
        {
          label: "🗑️ Deletar Pasta",
          prompt: "Delete a pasta 'Rascunhos'"
        },
        {
          label: "📊 Resumo Geral",
          prompt: "Me dê um resumo de todas as informações organizadas"
        }
      ]
    }
  ];

  const toggleCard = (id: string) => {
    setExpandedCard(expandedCard === id ? null : id);
  };

  return (
    <div className="h-full overflow-y-auto bg-card rounded-lg border border-border p-4 space-y-3">
      
      {/* Header */}
      <div className="sticky top-0 bg-card pb-3 border-b border-border z-10">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-lg">Guia de Funcionalidades</h3>
        </div>
        <p className="text-xs text-muted-foreground">
          Clique nos exemplos abaixo para testar cada funcionalidade
        </p>
      </div>

      {/* Cards */}
      <div className="space-y-3">
        {functionalities.map((func) => (
          <Card 
            key={func.id}
            className="overflow-hidden hover:shadow-md transition-shadow"
          >
            {/* Card Header */}
            <button
              onClick={() => toggleCard(func.id)}
              className="w-full p-4 flex items-center justify-between hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className={`${func.color}`}>
                  {func.icon}
                </div>
                <div className="text-left">
                  <h4 className="font-semibold text-sm">{func.title}</h4>
                  <p className="text-xs text-muted-foreground">
                    {func.description}
                  </p>
                </div>
              </div>
              {expandedCard === func.id ? (
                <ChevronUp className="w-4 h-4 text-muted-foreground" />
              ) : (
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              )}
            </button>

            {/* Card Content */}
            {expandedCard === func.id && (
              <div className="px-4 pb-4 space-y-2 border-t border-border pt-3">
                {func.examples.map((example, idx) => (
                  <div
                    key={idx}
                    onClick={() => onSelectPrompt(example.prompt)}
                    className="w-full text-left p-3 rounded-md bg-muted/50 hover:bg-muted transition-colors cursor-pointer group"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <p className="text-xs font-medium text-foreground mb-1">
                          {example.label}
                        </p>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          "{example.prompt}"
                        </p>
                      </div>
                      <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="inline-flex items-center justify-center h-6 px-2 text-xs font-medium text-primary">
                          Usar →
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        ))}
      </div>

      {/* Footer Tip */}
      <div className="sticky bottom-0 bg-card pt-3 border-t border-border">
        <div className="bg-primary/10 rounded-md p-3">
          <p className="text-xs text-primary font-medium mb-1">
            💡 Dica
          </p>
          <p className="text-xs text-muted-foreground">
            A IA é proativa! Apenas forneça as informações e ela organiza automaticamente.
          </p>
        </div>
      </div>
    </div>
  );
}