import { Bot } from "lucide-react";
import { ToggleItem } from "../../types";
import { Modal } from "./Modal";

interface AgentsPanelProps {
  agents: ToggleItem[];
  onToggle: (id: string) => void;
  onClose: () => void;
}

export function AgentsPanel({
  agents,
  onToggle,
  onClose,
}: AgentsPanelProps) {
  return (
    <Modal title="Agents" onClose={onClose}>
      <div className="p-4 flex flex-col gap-2">
        {agents.map((a) => (
          <div
            key={a.id}
            className="flex items-center justify-between px-4 py-3 rounded-xl"
            style={{ background: "var(--background)" }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: "rgba(200,146,42,0.1)" }}
              >
                <Bot size={14} className="text-accent" />
              </div>
              <div>
                <p
                  style={{
                    fontSize: 13,
                    fontWeight: 500,
                    color: "var(--foreground)",
                  }}
                >
                  {a.name}
                </p>
                <p
                  style={{
                    fontSize: 11,
                    color: "var(--muted-foreground)",
                    marginTop: 1,
                  }}
                >
                  {a.desc}
                </p>
              </div>
            </div>
            <button
              onClick={() => onToggle(a.id)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all hover:opacity-80"
              style={{
                background: a.on ? "var(--accent)" : "var(--muted)",
                color: a.on
                  ? "var(--accent-foreground)"
                  : "var(--muted-foreground)",
              }}
            >
              {a.on ? "Active" : "Off"}
            </button>
          </div>
        ))}
      </div>
    </Modal>
  );
}
