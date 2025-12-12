// frontend/src/components/ReportModal.tsx
import React, { useState } from 'react';
import { ReportData } from '../../types/index';
import { downloadPDFFromHTML } from '../../services/api';

interface ReportModalProps {
  reportData: ReportData;
  isOpen: boolean;
  onClose: () => void;
}

export const ReportModal: React.FC<ReportModalProps> = ({
  reportData,
  isOpen,
  onClose
}) => {
  const [isDownloading, setIsDownloading] = useState(false);

  if (!isOpen) return null;

  const handleDownloadPDF = async () => {
    setIsDownloading(true);
    try {
      await downloadPDFFromHTML(
        reportData.html,
        `relatorio_${reportData.data.title.toLowerCase().replace(/\s+/g, '_')}_${Date.now()}.pdf`
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
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-6xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              {reportData.data.title}
            </h2>
            {reportData.data.subtitle && (
              <p className="text-sm text-gray-600 mt-1">
                {reportData.data.subtitle}
              </p>
            )}
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={handleDownloadPDF}
              disabled={isDownloading}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isDownloading ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Gerando PDF...</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>Baixar PDF</span>
                </>
              )}
            </button>
            
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content - iframe com o HTML do relatório */}
        <div className="flex-1 overflow-hidden">
          <iframe
            srcDoc={reportData.html}
            className="w-full h-full border-0"
            title="Relatório Preview"
            sandbox="allow-same-origin"
          />
        </div>

        {/* Footer */}
        <div className="p-4 border-t bg-gray-50 text-sm text-gray-600 text-center">
          Gerado em: {new Date(reportData.data.generatedAt).toLocaleString('pt-BR')}
          {reportData.data.metadata?.totalItems && (
            <span className="ml-4">
              • {reportData.data.metadata.totalItems} itens processados
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
