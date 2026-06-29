/**
 * Groq AI Provider
 * OpenAI-compatible API wrapper for Groq
 * Server-side only - never expose API key to browser
 */

interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

interface ChatOptions {
  temperature?: number;
  max_tokens?: number;
  stream?: boolean;
}

interface ChatResponse {
  content: string;
  model: string;
  finish_reason: string;
}

interface Model {
  id: string;
  name: string;
  description: string;
  context_window: number;
}

// Get environment variables safely
declare const process: { env?: Record<string, string | undefined> };
const GROQ_API_KEY = typeof process !== "undefined" ? (process.env?.GROQ_API_KEY || "") : "";
const GROQ_BASE_URL = typeof process !== "undefined" ? (process.env?.GROQ_BASE_URL || "https://api.groq.com/openai/v1") : "https://api.groq.com/openai/v1";

const SUPPORTED_MODELS: Model[] = [
  {
    id: "llama-3.1-8b-instant",
    name: "Llama 3.1 8B (Fast)",
    description: "Fastest inference, great for quick responses",
    context_window: 131072,
  },
  {
    id: "llama-3.3-70b-versatile",
    name: "Llama 3.3 70B (Versatile)",
    description: "Balanced speed and capability",
    context_window: 8192,
  },
  {
    id: "qwen-3.6-27b",
    name: "Qwen 3.6 27B",
    description: "Fast and capable",
    context_window: 32768,
  },
  {
    id: "gpt-oss-120b",
    name: "GPT OSS 120B",
    description: "Powerful open-source model",
    context_window: 8192,
  },
];

/**
 * List available models
 */
export async function listModels(): Promise<Model[]> {
  return SUPPORTED_MODELS;
}

/**
 * Get a single model by ID
 */
export function getModel(modelId: string): Model | undefined {
  return SUPPORTED_MODELS.find((m) => m.id === modelId);
}

/**
 * Chat completion with Groq
 */
export async function chat(
  messages: ChatMessage[],
  model: string = "llama-3.1-8b-instant",
  options: ChatOptions = {}
): Promise<ChatResponse> {
  if (!GROQ_API_KEY) {
    throw new Error("GROQ_API_KEY not configured");
  }

  const response = await fetch(`${GROQ_BASE_URL}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${GROQ_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: options.temperature ?? 0.7,
      max_tokens: options.max_tokens ?? 2048,
      stream: false,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Groq API error: ${response.status} - ${error}`);
  }

  const data = await response.json();

  return {
    content: data.choices[0].message.content,
    model: data.model,
    finish_reason: data.choices[0].finish_reason,
  };
}

/**
 * Streaming chat completion with Groq
 */
export async function* streamChat(
  messages: ChatMessage[],
  model: string = "llama-3.1-8b-instant",
  options: ChatOptions = {}
): AsyncGenerator<string> {
  if (!GROQ_API_KEY) {
    throw new Error("GROQ_API_KEY not configured");
  }

  const response = await fetch(`${GROQ_BASE_URL}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${GROQ_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: options.temperature ?? 0.7,
      max_tokens: options.max_tokens ?? 2048,
      stream: true,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Groq API error: ${response.status} - ${error}`);
  }

  if (!response.body) {
    throw new Error("No response body");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split("\n");

      for (const line of lines) {
        if (line.startsWith("data: ")) {
          const data = line.slice(6);
          if (data === "[DONE]") continue;

          try {
            const parsed = JSON.parse(data);
            const content = parsed.choices[0]?.delta?.content;
            if (content) {
              yield content;
            }
          } catch {
            // Ignore parse errors
          }
        }
      }
    }
  } finally {
    reader.releaseLock();
  }
}

/**
 * Get default model
 */
export function getDefaultModel(): string {
  return typeof process !== "undefined" ? (process.env?.DEFAULT_MODEL || "llama-3.1-8b-instant") : "llama-3.1-8b-instant";
}

/**
 * Get default provider
 */
export function getDefaultProvider(): string {
  return typeof process !== "undefined" ? (process.env?.DEFAULT_PROVIDER || "groq") : "groq";
}
