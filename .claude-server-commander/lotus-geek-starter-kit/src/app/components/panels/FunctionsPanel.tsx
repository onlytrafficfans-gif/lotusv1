import { X } from "lucide-react";
import { Capability } from "../../types";
import { Modal } from "./Modal";

interface FunctionsPanelProps {
  caps: Capability[];
  onToggle: (id: string) => void;
  onClose: () => void;
}

export function FunctionsPanel({
  caps,
  onToggle,
  onClose,
}: FunctionsPanelProps) {
  const active = caps.filter((c) => c.active);
  const cats = Array.from(new Set(caps.map((c) => c.category)));

  return (
    <Modal title="Functions & Capabilities" onClose={onClose}>
      <div className="p-4 flex flex-col gap-4">
        {active.length > 0 && (
          <div>
            <p
              style={{
                fontSize: 10,
                fontWeight: 600,
                letterSpacing: "0.06em",
                color: "var(--accent)",
                textTransform: "uppercase",
                marginBottom: 8,
              }}
            >
              Active · {active.length}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {active.map((c) => (
                <div
                  key={c.id}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full"
                  style={{
                    background: "rgba(200,146,42,0.12)",
                    border: "1px solid rgba(200,146,42,0.2)",
                  }}
                >
                  <span
                    style={{
                      fontSize: 11,
                      color: "var(--accent)",
                      fontWeight: 500,
                    }}
                  >
                    {c.name}
                  </span>
                  <button onClick={() => onToggle(c.id)}>
                    <X size={9} className="text-accent" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
        {cats.map((cat) => (
          <div key={cat}>
            <p
              style={{
                fontSize: 10,
                fontWeight: 600,
                letterSpacing: "0.06em",
                color: "var(--muted-foreground)",
                textTransform: "uppercase",
                marginBottom: 6,
              }}
            >
              {cat}
            </p>
            <div className="flex flex-col gap-1.5">
              {caps
                .filter((c) => c.category === cat)
                .map((c) => (
                  <div
                    key={c.id}
                    className="flex items-center justify-between px-3 py-2 rounded-lg"
                    style={{ background: "var(--background)" }}
                  >
                    <div>
                      <p
                        style={{
                          fontSize: 12,
                          fontWeight: 500,
                          color: "var(--foreground)",
                        }}
                      >
                        {c.name}
                      </p>
                      <p
                        style={{
                          fontSize: 10,
                          color: "var(--muted-foreground)",
                        }}
                      >
                        {c.desc}
                      </p>
                    </div>
                    <button
                      onClick={() => onToggle(c.id)}
                      className="px-2.5 py-1 rounded-lg text-xs font-semibold transition-all hover:opacity-80"
                      style={{
                        background: c.active
                          ? "var(--accent)"
                          : "var(--muted)",
                        color: c.active
                          ? "var(--accent-foreground)"
                          : "var(--muted-foreground)",
                      }}
                    >
                      {c.active ? "Added" : "Add"}
                    </button>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </Modal>
  );
}
