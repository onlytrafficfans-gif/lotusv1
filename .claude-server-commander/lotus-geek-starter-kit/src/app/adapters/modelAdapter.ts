import { ModelRouter } from "../types";

export interface ModelAdapterConfig {
  backendUrl?: string;
  timeout?: number;
}

export interface ModelResponse {
  models: ModelRouter[];
  selectedId?: string;
  error?: string;
}

// Mock models for fallback
const MOCK_MODELS: ModelRouter[] = [
  "gpt-4",
  "gpt-3.5-turbo",
  "claude-opus-4",
  "claude-sonnet-4.6",
  "gemini-pro",
  "local-llama",
];

/**
 * Load available models from Geek Starter Kit backend.
 * Falls back to mock models if backend unavailable.
 */
export async function loadModels(
  config?: ModelAdapterConfig
): Promise<ModelResponse> {
  if (!config?.backendUrl) {
    return {
      models: MOCK_MODELS,
      selectedId: "claude-sonnet-4.6",
    };
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(
      () => controller.abort(),
      config.timeout || 5000
    );

    const response = await fetch(`${config.backendUrl}/api/models`, {
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      console.warn(
        `Failed to load models from backend (${response.status}), using mock`
      );
      return {
        models: MOCK_MODELS,
        selectedId: "claude-sonnet-4.6",
        error: `Backend returned ${response.status}`,
      };
    }

    const data = await response.json();
    return {
      models: Array.isArray(data.models) ? data.models : MOCK_MODELS,
      selectedId: data.selectedId || "claude-sonnet-4.6",
    };
  } catch (error) {
    console.warn("Failed to load models from backend, using mock:", error);
    return {
      models: MOCK_MODELS,
      selectedId: "claude-sonnet-4.6",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Save selected model preference for current session.
 * Returns true if persisted, false if fallback only.
 */
export async function saveSelectedModel(
  modelId: string,
  config?: ModelAdapterConfig
): Promise<boolean> {
  if (!config?.backendUrl) {
    // Mock: persist to localStorage for demo
    try {
      localStorage.setItem("selectedModel", modelId);
      return true;
    } catch {
      return false;
    }
  }

  try {
    const response = await fetch(
      `${config.backendUrl}/api/models/selected`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ modelId }),
      }
    );

    return response.ok;
  } catch (error) {
    console.warn("Failed to save model selection:", error);
    return false;
  }
}

/**
 * Get stored model preference for current session.
 */
export function getStoredModelId(): string {
  try {
    return localStorage.getItem("selectedModel") || "claude-sonnet-4.6";
  } catch {
    return "claude-sonnet-4.6";
  }
}
