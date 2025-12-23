"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FileText, FolderSearch, Download, Eye, Calendar, Loader2, Trash2, RefreshCw } from "lucide-react";
import { ReportData } from "@/types";

interface ReportDataWithMetadata extends ReportData {
  metadata?: {
    totalItems?: number;
  };
  sections?: Array<any>;
}
import { downloadPDFFromHTML } from "@/services/api";
import Navigation from "@/components/navigation";

interface StoredReport {
  id: string;
  title: string;
  subtitle?: string;
  createdAt: string;
  html: string;
  data: ReportDataWithMetadata;
  conversationId?: string;
}

export default function ReportsPage() {
  const [reports, setReports] = useState<StoredReport[]>([]);
  const [selectedReport, setSelectedReport] = useState<StoredReport | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  // Carregar relatórios salvos do localStorage
  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = () => {
    try {
      // Tenta carregar da nova chave primeiro (saved_reports)
      let saved = localStorage.getItem("saved_reports");
      
      // Se não existir, tenta carregar da chave antiga (generated_reports)
      if (!saved) {
        saved = localStorage.getItem("generated_reports");
      }

      if (saved) {
        const parsed = JSON.parse(saved);
        setReports(parsed);

        // Migra para nova chave se necessário
        if (localStorage.getItem("generated_reports")) {
          localStorage.setItem("saved_reports", saved);
          localStorage.removeItem("generated_reports");
        }
      }
    } catch (error) {
      console.error("Erro ao carregar relatórios:", error);
    }
  };

  // Recarrega ao focar na página
  useEffect(() => {
    const handleFocus = () => {
      loadReports();
    };

    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, []);

  // Visualizar relatório
  const handleViewReport = (report: StoredReport) => {
    setSelectedReport(report);
    setShowPreview(true);
  };

  // Baixar PDF
  const handleDownloadPDF = async (report: StoredReport) => {
    setDownloadingId(report.id);
    try {
      await downloadPDFFromHTML(
        report.html,
        `${report.title.toLowerCase().replace(/\s+/g, '_')}_${Date.now()}.pdf`
      );
    } catch (error) {
      console.error("Erro ao baixar PDF:", error);
      alert("❌ Erro ao baixar PDF. Tente novamente.");
    } finally {
      setDownloadingId(null);
    }
  };

  // Deletar relatório
  const handleDeleteReport = (reportId: string) => {
    if (!confirm("Tem certeza que deseja excluir este relatório?")) return;

    try {
      const updated = reports.filter(r => r.id !== reportId);
      setReports(updated);
      localStorage.setItem("saved_reports", JSON.stringify(updated));
    } catch (error) {
      console.error("Erro ao deletar relatório:", error);
    }
  };

  // Limpar todos os relatórios
  const handleClearAll = () => {
    if (!confirm("⚠️ Tem certeza que deseja excluir TODOS os relatórios? Esta ação não pode ser desfeita.")) return;

    try {
      setReports([]);
      localStorage.removeItem("saved_reports");
      localStorage.removeItem("generated_reports"); // Remove chave antiga também
    } catch (error) {
      console.error("Erro ao limpar relatórios:", error);
    }
  };

  return (
    <>
      <Navigation />
      <div className="container mx-auto py-10 space-y-10 mt-16">
        {/* HEADER */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <FileText className="w-8 h-8 text-primary" />
              Meus Relatórios
            </h1>
            <p className="text-muted-foreground mt-1">
              Visualize e gerencie os relatórios gerados pela IA.
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={loadReports}
              className="flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Atualizar
            </Button>
            {reports.length > 0 && (
              <Button
                variant="destructive"
                onClick={handleClearAll}
                className="flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Limpar Tudo
              </Button>
            )}
          </div>
        </div>

        {/* INFO CARD */}
        <Card className="p-5 border-blue-300 bg-blue-50 dark:bg-blue-950 dark:border-blue-800">
          <p className="text-blue-900 dark:text-blue-100 text-sm leading-relaxed">
            💡 <strong>Dica:</strong> Para gerar um novo relatório, vá até o chat e peça algo como:
            &quot;Gere um relatório dos meus eventos&quot;, &quot;Crie um relatório financeiro&quot; ou
            &quot;Faça um resumo do workspace&quot;. Os relatórios gerados aparecerão aqui automaticamente.
          </p>
        </Card>

        {/* HISTÓRICO DE RELATÓRIOS */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Histórico</h2>
            {reports.length > 0 && (
              <span className="text-sm text-muted-foreground">
                {reports.length} relatório{reports.length !== 1 ? 's' : ''} gerado{reports.length !== 1 ? 's' : ''}
              </span>
            )}
          </div>

          {reports.length === 0 ? (
            <Card className="p-10 text-center border-dashed">
              <FolderSearch className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">
                Nenhum relatório gerado ainda
              </h3>
              <p className="text-muted-foreground">
                Vá até o chat e peça para a IA gerar um relatório! 🚀
              </p>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {reports.map((report) => (
                <Card key={report.id} className="p-5 hover:shadow-lg transition-shadow">
                  <div className="space-y-3">
                    {/* Header do Card */}
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                        <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm line-clamp-2">
                          {report.title}
                        </h3>
                        {report.subtitle && (
                          <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                            {report.subtitle}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Metadata */}
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar className="w-3 h-3" />
                      <span>
                        {new Date(report.createdAt).toLocaleDateString('pt-BR', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>

                    {/* Stats */}
                    {report.data?.metadata && (
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        {report.data.metadata.totalItems && (
                          <span>📝 {report.data.metadata.totalItems} itens</span>
                        )}
                        {report.data.sections && (
                          <span>📊 {report.data.sections.length} seções</span>
                        )}
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center gap-2 pt-2 border-t">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 gap-2"
                        onClick={() => handleViewReport(report)}
                      >
                        <Eye className="w-3 h-3" />
                        Visualizar
                      </Button>
                      <Button
                        size="sm"
                        variant="default"
                        className="flex-1 gap-2"
                        onClick={() => handleDownloadPDF(report)}
                        disabled={downloadingId === report.id}
                      >
                        {downloadingId === report.id ? (
                          <>
                            <Loader2 className="w-3 h-3 animate-spin" />
                            Gerando...
                          </>
                        ) : (
                          <>
                            <Download className="w-3 h-3" />
                            PDF
                          </>
                        )}
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => handleDeleteReport(report.id)}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* MODAL DE PREVIEW */}
        {selectedReport && showPreview && (
          <ReportModal
            report={selectedReport}
            isOpen={showPreview}
            onClose={() => {
              setShowPreview(false);
              setSelectedReport(null);
            }}
          />
        )}
      </div>
    </>
  );
}

/* ============================================================================
   REPORT MODAL COMPONENT
============================================================================ */

interface ReportModalProps {
  report: StoredReport;
  isOpen: boolean;
  onClose: () => void;
}

function ReportModal({ report, isOpen, onClose }: ReportModalProps) {
  const [isDownloading, setIsDownloading] = useState(false);

  if (!isOpen) return null;

  const handleDownloadPDF = async () => {
    setIsDownloading(true);
    try {
      await downloadPDFFromHTML(
        report.html,
        `relatorio_${report.title.toLowerCase().replace(/\s+/g, '_')}_${Date.now()}.pdf`
      );
      alert('✅ PDF baixado com sucesso!');
    } catch (error) {
      console.error('Erro ao baixar PDF:', error);
      alert('❌ Erro ao baixar PDF. Tente novamente.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-2xl w-full h-[95vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b dark:border-gray-800">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 truncate">
              {report.title}
            </h2>
            {report.subtitle && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 truncate">
                {report.subtitle}
              </p>
            )}
          </div>

          <div className="flex items-center gap-3 ml-4">
            <Button
              onClick={handleDownloadPDF}
              disabled={isDownloading}
              className="flex items-center gap-2"
            >
              {isDownloading ? (
                <>
                  <Loader2 className="animate-spin h-5 w-5" />
                  <span>Gerando PDF...</span>
                </>
              ) : (
                <>
                  <Download className="w-5 h-5" />
                  <span>Baixar PDF</span>
                </>
              )}
            </Button>

            <Button
              onClick={onClose}
              variant="ghost"
              size="icon"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </Button>
          </div>
        </div>

        {/* Content - iframe com o HTML do relatório */}
        <div className="flex-1 overflow-hidden">
          <iframe
            srcDoc={report.html}
            className="w-full h-full border-0"
            title="Relatório Preview"
            sandbox="allow-same-origin"
          />
        </div>

        {/* Footer */}
        <div className="p-4 border-t dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 text-sm text-gray-600 dark:text-gray-400 text-center">
          Gerado em: {new Date(report.createdAt).toLocaleString('pt-BR')}
          {report.data?.metadata?.totalItems && (
            <span className="ml-4">
              • {report.data.metadata.totalItems} itens processados
            </span>
          )}
        </div>
      </div>
    </div>
  );
}