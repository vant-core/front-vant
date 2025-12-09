"use client";

import { useState } from "react";
import FileCard from "@/components/filesGenerator/fileCard";
import { downloadFile } from "@/services/api";
import type { FileInfo } from "@/types/index";

interface AIToolboxProps {
  fileInfo: FileInfo;
}

export default function AIToolbox({ fileInfo }: AIToolboxProps) {
  const [isDownloading, setIsDownloading] = useState(false);

  console.log("📦 FileInfo recebido:", fileInfo);

  // 🔥 CORREÇÃO: Adaptar para ambas estruturas (backend antigo e novo)
  const fileName = fileInfo.fileName || fileInfo.url?.split('/').pop() || '';
  const fileType = fileInfo.fileType || fileInfo.type || 'pdf';
  const displayName = fileInfo.title || fileInfo.name || fileName;

  // Validação melhorada
  if (!fileName) {
    console.error("❌ FileInfo inválido:", fileInfo);
    return (
      <div className="mt-3 p-4 bg-red-100 text-red-800 rounded-lg">
        ⚠️ Erro ao carregar informações do arquivo
      </div>
    );
  }

  const handleDownload = async () => {
    try {
      setIsDownloading(true);

      // 🔥 Faz download do arquivo do backend
      const fileBlob = await downloadFile(fileName);

      // 🔥 Cria um link temporário e clica nele
      const url = window.URL.createObjectURL(fileBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = displayName;
      document.body.appendChild(a);
      a.click();
      
      // Limpa
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      console.log("✅ Arquivo baixado com sucesso:", fileName);

    } catch (error) {
      console.error("❌ Erro ao baixar arquivo:", error);
      alert("Erro ao baixar o arquivo. Tente novamente.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="mt-3">
      <FileCard
        fileType={fileType}
        fileName={displayName}
        onClick={handleDownload}
        isLoading={isDownloading}
      />
    </div>
  );
}