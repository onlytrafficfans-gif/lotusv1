import { useState } from "react";
import { UploadedFile } from "../types";

export function useFileManager() {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);

  const addFiles = (e: React.ChangeEvent<HTMLInputElement>, type: "file" | "image") => {
    const files = Array.from(e.target.files || []);
    const items: UploadedFile[] = files.map((f) => ({
      id: Math.random().toString(36).slice(2),
      name: f.name,
      type,
      mime: f.type,
    }));
    setUploadedFiles((p) => [...p, ...items]);
    e.target.value = "";
  };

  const removeFile = (id: string) => {
    setUploadedFiles((p) => p.filter((f) => f.id !== id));
  };

  return {
    uploadedFiles,
    addFiles,
    removeFile,
  };
}
