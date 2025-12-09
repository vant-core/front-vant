import { useState, useEffect } from "react";

export function useAIAction(aiMessage: string) {
  const [fileRequest, setFileRequest] = useState<any>(null);

  useEffect(() => {
    if (!aiMessage) return;

    try {
      const parsed = JSON.parse(aiMessage);

      if (parsed.action === "generate_file") {
        setFileRequest(parsed);
      } else {
        setFileRequest(null);
      }
    } catch {
      setFileRequest(null);
    }
  }, [aiMessage]);

  return { fileRequest };
}
