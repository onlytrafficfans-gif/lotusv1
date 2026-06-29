import { Connector } from "../types";

export type ConnectorStatus = "connected" | "disconnected" | "needs_config" | "error";

export interface ConnectorAdapterConfig {
  backendUrl?: string;
  timeout?: number;
}

export interface ConnectorResponse {
  connectors: Connector[];
  error?: string;
}

export interface ConnectorWithStatus extends Connector {
  status?: ConnectorStatus;
  lastError?: string;
  configUrl?: string;
}

// Mock connectors for fallback
const MOCK_CONNECTORS: Connector[] = [
  {
    id: "stripe",
    name: "Stripe",
    desc: "Payment processing",
    connected: false,
  },
  {
    id: "supabase",
    name: "Supabase",
    desc: "Database & auth",
    connected: false,
  },
  {
    id: "github",
    name: "GitHub",
    desc: "Code repository",
    connected: false,
  },
  {
    id: "openai",
    name: "OpenAI",
    desc: "AI models",
    connected: false,
  },
  {
    id: "twilio",
    name: "Twilio",
    desc: "SMS & voice",
    connected: false,
  },
  {
    id: "slack",
    name: "Slack",
    desc: "Team messaging",
    connected: false,
  },
  {
    id: "sendgrid",
    name: "SendGrid",
    desc: "Email service",
    connected: false,
  },
  {
    id: "aws",
    name: "AWS",
    desc: "Cloud infrastructure",
    connected: false,
  },
];

/**
 * Load connectors from Geek Starter Kit backend.
 * Falls back to mock connectors if backend unavailable.
 */
export async function loadConnectors(
  config?: ConnectorAdapterConfig
): Promise<ConnectorResponse> {
  if (!config?.backendUrl) {
    return {
      connectors: MOCK_CONNECTORS,
    };
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(
      () => controller.abort(),
      config.timeout || 5000
    );

    const response = await fetch(`${config.backendUrl}/api/connectors`, {
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      console.warn(
        `Failed to load connectors from backend (${response.status}), using mock`
      );
      return {
        connectors: MOCK_CONNECTORS,
        error: `Backend returned ${response.status}`,
      };
    }

    const data = await response.json();
    return {
      connectors: Array.isArray(data.connectors)
        ? data.connectors
        : MOCK_CONNECTORS,
    };
  } catch (error) {
    console.warn("Failed to load connectors from backend, using mock:", error);
    return {
      connectors: MOCK_CONNECTORS,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Test connection for a specific connector.
 * Returns true if test passed, false otherwise.
 */
export async function testConnector(
  connectorId: string,
  config?: ConnectorAdapterConfig
): Promise<boolean> {
  if (!config?.backendUrl) {
    // Mock: simulate test delay
    return new Promise((resolve) => {
      setTimeout(() => resolve(Math.random() > 0.3), 1500);
    });
  }

  try {
    const response = await fetch(
      `${config.backendUrl}/api/connectors/${connectorId}/test`,
      {
        method: "POST",
      }
    );

    return response.ok;
  } catch (error) {
    console.warn(`Failed to test connector ${connectorId}:`, error);
    return false;
  }
}

/**
 * Configure a connector with auth credentials or config.
 */
export async function configureConnector(
  connectorId: string,
  config: Record<string, string>,
  backendConfig?: ConnectorAdapterConfig
): Promise<{ success: boolean; error?: string }> {
  if (!backendConfig?.backendUrl) {
    // Mock: store in localStorage
    try {
      localStorage.setItem(`connector_config_${connectorId}`, JSON.stringify(config));
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Storage failed",
      };
    }
  }

  try {
    const response = await fetch(
      `${backendConfig.backendUrl}/api/connectors/${connectorId}/configure`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      }
    );

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      return {
        success: false,
        error: data.error || `Configuration failed (${response.status})`,
      };
    }

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Configuration failed",
    };
  }
}

/**
 * Disconnect a connector.
 */
export async function disconnectConnector(
  connectorId: string,
  config?: ConnectorAdapterConfig
): Promise<boolean> {
  if (!config?.backendUrl) {
    // Mock: clear from localStorage
    try {
      localStorage.removeItem(`connector_config_${connectorId}`);
      return true;
    } catch {
      return false;
    }
  }

  try {
    const response = await fetch(
      `${config.backendUrl}/api/connectors/${connectorId}/disconnect`,
      {
        method: "POST",
      }
    );

    return response.ok;
  } catch (error) {
    console.warn(`Failed to disconnect connector ${connectorId}:`, error);
    return false;
  }
}
