import { Connector } from "../../types";
import { Modal } from "./Modal";

interface ConnectorsPanelProps {
  connectors: Connector[];
  onToggle: (id: string) => void;
  onClose: () => void;
}

export function ConnectorsPanel({
  connectors,
  onToggle,
  onClose,
}: ConnectorsPanelProps) {
  return (
    <Modal title="Connectors" onClose={onClose}>
      <div className="p-4 flex flex-col gap-2">
        {connectors.map((c) => (
          <div
            key={c.id}
            className="flex items-center justify-between px-4 py-3 rounded-xl"
            style={{ background: "var(--background)" }}
          >
            <div>
              <p
                style={{
                  fontSize: 13,
                  fontWeight: 500,
                  color: "var(--foreground)",
                }}
              >
                {c.name}
              </p>
              <p
                style={{
                  fontSize: 11,
                  color: "var(--muted-foreground)",
                  marginTop: 1,
                }}
              >
                {c.desc}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span
                style={{
                  fontSize: 9,
                  fontWeight: 600,
                  letterSpacing: "0.05em",
                  padding: "2px 8px",
                  borderRadius: 999,
                  background: c.connected
                    ? "rgba(107,203,119,0.15)"
                    : "var(--muted)",
                  color: c.connected ? "#3A8A44" : "var(--muted-foreground)",
                }}
              >
                {c.connected ? "Connected" : "Not Connected"}
              </span>
              <button
                onClick={() => onToggle(c.id)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all hover:opacity-80"
                style={{
                  background: c.connected ? "var(--muted)" : "var(--accent)",
                  color: c.connected
                    ? "var(--muted-foreground)"
                    : "var(--accent-foreground)",
                }}
              >
                {c.connected ? "Disconnect" : "Connect"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </Modal>
  );
}
