import React from "react";
import { Connector } from "../../types";
import { Modal } from "./Modal";
import { testConnector, configureConnector } from "../../adapters/connectorAdapter";

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
  const [testing, setTesting] = React.useState<string | null>(null);

  const handleTest = async (connectorId: string) => {
    setTesting(connectorId);
    const success = await testConnector(connectorId);
    console.log(`Connector ${connectorId} test result:`, success);
    setTesting(null);
  };

  const handleConfigure = async (connectorId: string) => {
    const apiKey = prompt(`Enter API key for ${connectorId}:`);
    if (apiKey) {
      const result = await configureConnector(connectorId, { apiKey });
      if (result.success) {
        onToggle(connectorId);
      } else {
        alert(`Configuration failed: ${result.error}`);
      }
    }
  };

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
                onClick={() => handleTest(c.id)}
                disabled={testing === c.id}
                className="px-2 py-1.5 rounded-lg text-xs font-semibold transition-all hover:opacity-80"
                style={{
                  background: "var(--muted)",
                  color: "var(--muted-foreground)",
                  opacity: testing === c.id ? 0.5 : 1,
                }}
              >
                {testing === c.id ? "Testing..." : "Test"}
              </button>
              <button
                onClick={() => handleConfigure(c.id)}
                className="px-2 py-1.5 rounded-lg text-xs font-semibold transition-all hover:opacity-80"
                style={{
                  background: "var(--muted)",
                  color: "var(--muted-foreground)",
                }}
              >
                Config
              </button>
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
