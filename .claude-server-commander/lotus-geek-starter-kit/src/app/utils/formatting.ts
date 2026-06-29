import { Code2, FileText, ImageIcon } from "lucide-react";

export function formatTime(date: Date): string {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export function getFileIcon(mime: string) {
  if (mime.startsWith("image/")) return ImageIcon;
  if (
    mime.includes("json") ||
    mime.includes("javascript") ||
    mime.includes("typescript")
  )
    return Code2;
  return FileText;
}

export const DEVICE_DIMENSIONS: Record<string, string> = {
  phone: "375 × 720",
  tablet: "768 × 600",
  desktop: "1100 × 620",
};
