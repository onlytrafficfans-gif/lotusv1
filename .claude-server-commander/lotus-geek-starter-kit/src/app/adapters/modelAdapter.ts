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

// Groq supported models
const GROQ_MODELS: ModelRouter[] = [
  "llama-3.1-8b-instant",
  "llama-3.3-70b-versatile",
  "qwen-3.6-27b",
  "gpt-oss-120b",
];

const DEFAULT_MODEL = "llama-3.1-8b-instant";

/**
 * Load available models from Groq backend.
 * Falls back to local Groq models or offline models if backend unavailable.
 */
export async function loadModels(
  config?: ModelAdapterConfig
): Promise<ModelResponse> {
  // Get stored model preference or use default
  const storedModel = getStoredModelId();

  if (!config?.backendUrl) {
    // No backend: use Groq models with localStorage fallback
    return {
      models: GROQ_MODELS,
      selectedId: storedModel,
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
        `Failed to load models from backend (${response.status}), using Groq models`
      );
      return {
        models: GROQ_MODELS,
        selectedId: storedModel,
        error: `Backend returned ${response.status}`,
      };
    }

    const data = await response.json();
    return {
      models: Array.isArray(data.models) ? data.models : GROQ_MODELS,
      selectedId: data.selectedId || storedModel,
    };
  } catch (error) {
    console.warn("Failed to load models from backend, using Groq models:", error);
    return {
      models: GROQ_MODELS,
      selectedId: storedModel,
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
 * Returns stored model or default (llama-3.1-8b-instant).
 */
export function getStoredModelId(): string {
  try {
    return localStorage.getItem("selectedModel") || DEFAULT_MODEL;
  } catch {
    return DEFAULT_MODEL;
  }
}

/**
 * Get model metadata (name, description, etc.)
 */
export interface ModelMetadata {
  id: string;
  name: string;
  description: string;
  context_window: number;
}

export const GROQ_MODEL_METADATA: Record<string, ModelMetadata> = {
  "llama-3.1-8b-instant": {
    id: "llama-3.1-8b-instant",
    name: "Llama 3.1 8B (Fast)",
    description: "Fastest inference, great for quick responses",
    context_window: 131072,
  },
  "llama-3.3-70b-versatile": {
    id: "llama-3.3-70b-versatile",
    name: "Llama 3.3 70B (Versatile)",
    description: "Balanced speed and capability",
    context_window: 8192,
  },
  "qwen-3.6-27b": {
    id: "qwen-3.6-27b",
    name: "Qwen 3.6 27B",
    description: "Fast and capable",
    context_window: 32768,
  },
  "gpt-oss-120b": {
    id: "gpt-oss-120b",
    name: "GPT OSS 120B",
    description: "Powerful open-source model",
    context_window: 8192,
  },
};

/**
 * Get metadata for a specific model
 */
export function getModelMetadata(modelId: string): ModelMetadata | undefined {
  return GROQ_MODEL_METADATA[modelId];
}
