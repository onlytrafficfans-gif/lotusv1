import { useState } from "react";
import { FileText, Copy, Download, Archive, Check } from "lucide-react";
import { MockFile } from "../../types";

interface CodePanelProps {
  files: MockFile[];
}

export function CodePanel({ files }: CodePanelProps) {
  const [activeFile, setActiveFile] = useState(0);
  const [copied, setCopied] = useState(false);
  const file = files[activeFile];

  function handleCopy() {
    navigator.clipboard.writeText(file.code).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  return (
    <div className="flex flex-1 overflow-hidden min-h-0">
      <div
        className="flex-shrink-0 flex flex-col overflow-y-auto"
        style={{
          width: 188,
          borderRight: "1px solid var(--border)",
          background: "var(--card)",
        }}
      >
        <div
          className="px-3 py-2.5 text-xs font-semibold"
          style={{
            color: "var(--muted-foreground)",
            letterSpacing: "0.06em",
            borderBottom: "1px solid var(--border)",
          }}
        >
          FILES
        </div>
        {files.map((f, i) => (
          <button
            key={i}
            onClick={() => setActiveFile(i)}
            className="flex items-center gap-2 px-3 py-2 text-left transition-colors"
            style={{
              background: i === activeFile ? "var(--muted)" : "transparent",
              color:
                i === activeFile
                  ? "var(--foreground)"
                  : "var(--muted-foreground)",
              fontSize: 11,
              fontFamily: "DM Mono,monospace",
              borderLeft:
                i === activeFile
                  ? "2px solid var(--accent)"
                  : "2px solid transparent",
            }}
          >
            <FileText size={11} /> {f.name.split("/").pop()}
          </button>
        ))}
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <div
          className="flex-shrink-0 flex items-center justify-between px-4 py-2"
          style={{
            borderBottom: "1px solid var(--border)",
            background: "var(--card)",
          }}
        >
          <span
            style={{
              fontSize: 11,
              fontFamily: "DM Mono,monospace",
              color: "var(--muted-foreground)",
            }}
          >
            {file.name}
          </span>
          <div className="flex gap-1">
            {[
              {
                icon: copied ? <Check size={11} /> : <Copy size={11} />,
                label: copied ? "Copied" : "Copy",
                fn: handleCopy,
              },
              {
                icon: <Download size={11} />,
                label: "Download",
                fn: () => {},
              },
              { icon: <Archive size={11} />, label: "Export ZIP", fn: () => {} },
            ].map((a) => (
              <button
                key={a.label}
                onClick={a.fn}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors hover:opacity-80"
                style={{
                  background: "var(--muted)",
                  color: "var(--muted-foreground)",
                }}
              >
                {a.icon}
                {a.label}
              </button>
            ))}
          </div>
        </div>

        <div
          className="flex-1 overflow-auto p-5"
          style={{
            background: "var(--background)",
            scrollbarWidth: "none",
          }}
        >
          <pre
            style={{
              margin: 0,
              fontFamily: "DM Mono,monospace",
              fontSize: 12,
              lineHeight: 1.7,
              color: "var(--foreground)",
              whiteSpace: "pre-wrap",
            }}
          >
            {file.code}
          </pre>
        </div>
      </div>
    </div>
  );
}
