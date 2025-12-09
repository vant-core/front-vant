"use client";

import { FileText, Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FileCardProps {
  fileType: string;
  fileName: string;
  onClick: () => void;
  isLoading?: boolean; // 🔥 NOVO: estado de loading
}

export default function FileCard({ 
  fileType, 
  fileName, 
  onClick,
  isLoading = false 
}: FileCardProps) {
  
  const getFileIcon = () => {
    const iconProps = { className: "w-8 h-8" };
    
    // 🔥 Validação de segurança
    if (!fileType) {
      return <FileText {...iconProps} />;
    }
    
    switch (fileType.toLowerCase()) {
      case "pdf":
        return <FileText {...iconProps} className="w-8 h-8 text-red-500" />;
      case "docx":
      case "doc":
        return <FileText {...iconProps} className="w-8 h-8 text-blue-500" />;
      case "csv":
        return <FileText {...iconProps} className="w-8 h-8 text-green-500" />;
      case "xlsx":
      case "xls":
        return <FileText {...iconProps} className="w-8 h-8 text-emerald-600" />;
      default:
        return <FileText {...iconProps} />;
    }
  };

  return (
    <div className="flex items-center gap-3 p-4 bg-muted rounded-lg border border-border hover:bg-muted/80 transition-colors">
      <div className="flex-shrink-0">
        {getFileIcon()}
      </div>
      
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground truncate">
          {fileName}
        </p>
        <p className="text-xs text-muted-foreground uppercase">
          {fileType}
        </p>
      </div>

      <Button
        onClick={onClick}
        disabled={isLoading}
        size="sm"
        variant="outline"
        className="flex-shrink-0"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Baixando...
          </>
        ) : (
          <>
            <Download className="w-4 h-4 mr-2" />
            Baixar
          </>
        )}
      </Button>
    </div>
  );
}