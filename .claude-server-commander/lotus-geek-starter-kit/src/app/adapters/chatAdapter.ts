import { ChatMessage } from "../types";

export interface ChatAdapterConfig {
  backendUrl?: string;
  timeout?: number;
  apiKey?: string;
}

export interface ChatSubmitRequest {
  message: string;
  modelId: string;
  sessionId?: string;
  conversationHistory?: ChatMessage[];
}

export interface ChatStreamEvent {
  type: "start" | "chunk" | "end" | "error";
  content?: string;
  error?: string;
}

// Mock responses for fallback
const MOCK_RESPONSES: Record<string, string> = {
  default:
    "I understand you want to build an app. Let me help you design the architecture, set up the backend, and deploy it. What's your main goal?",
  plan: "Based on your requirements, here's a solid plan:\n\n1. **Backend**: Set up Supabase for database & auth\n2. **Frontend**: Build with React + Vite\n3. **Deployment**: Host on Vercel\n4. **Monitoring**: Add Sentry for error tracking\n\nShould we start with the backend setup?",
  deploy:
    "I can help you deploy this app to Vercel, Netlify, or Cloudflare Pages. Which platform do you prefer? I'll handle the configuration.",
};

/**
 * Submit a chat message and stream response.
 * Calls onChunk for each streamed piece.
 * Falls back to mock response if backend unavailable.
 */
export async function submitChat(
  request: ChatSubmitRequest,
  onChunk: (event: ChatStreamEvent) => void,
  config?: ChatAdapterConfig
): Promise<void> {
  const { message } = request;

  // Determine mock response
  let mockResponse = MOCK_RESPONSES.default;
  if (message.toLowerCase().includes("plan")) {
    mockResponse = MOCK_RESPONSES.plan;
  } else if (message.toLowerCase().includes("deploy")) {
    mockResponse = MOCK_RESPONSES.deploy;
  }

  if (!config?.backendUrl) {
    // Mock: stream response with simulated delays
    onChunk({ type: "start" });

    // Simulate streaming by breaking response into chunks
    const chunks = mockResponse.split(" ");
    for (const chunk of chunks) {
      await new Promise((resolve) => setTimeout(resolve, 30));
      onChunk({ type: "chunk", content: chunk + " " });
    }

    onChunk({ type: "end" });
    return;
  }

  try {
    onChunk({ type: "start" });

    const controller = new AbortController();
    const timeoutId = setTimeout(
      () => controller.abort(),
      config.timeout || 60000
    );

    const response = await fetch(`${config.backendUrl}/api/chat/stream`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(config.apiKey && { Authorization: `Bearer ${config.apiKey}` }),
      },
      body: JSON.stringify(request),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      console.warn(
        `Chat request failed (${response.status}), using mock response`
      );
      // Fallback to mock on error
      const chunks = mockResponse.split(" ");
      for (const chunk of chunks) {
        await new Promise((resolve) => setTimeout(resolve, 30));
        onChunk({ type: "chunk", content: chunk + " " });
      }
      onChunk({ type: "end" });
      return;
    }

    // Stream response
    if (response.body) {
      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          onChunk({ type: "chunk", content: chunk });
        }
      } finally {
        reader.releaseLock();
      }
    }

    onChunk({ type: "end" });
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      onChunk({
        type: "error",
        error: "Request timeout. Falling back to mock response.",
      });
      // Stream mock response as fallback
      const chunks = mockResponse.split(" ");
      for (const chunk of chunks) {
        await new Promise((resolve) => setTimeout(resolve, 30));
        onChunk({ type: "chunk", content: chunk + " " });
      }
      onChunk({ type: "end" });
    } else {
      console.warn("Chat request failed, using mock response:", error);
      onChunk({
        type: "error",
        error: error instanceof Error ? error.message : "Chat failed",
      });
      // Stream mock response as fallback
      const chunks = mockResponse.split(" ");
      for (const chunk of chunks) {
        await new Promise((resolve) => setTimeout(resolve, 30));
        onChunk({ type: "chunk", content: chunk + " " });
      }
      onChunk({ type: "end" });
    }
  }
}

/**
 * Load chat history for a session.
 */
export async function loadChatHistory(
  sessionId: string,
  config?: ChatAdapterConfig
): Promise<ChatMessage[]> {
  if (!config?.backendUrl) {
    return [];
  }

  try {
    const response = await fetch(
      `${config.backendUrl}/api/chat/history/${sessionId}`,
      {
        headers: config.apiKey ? { Authorization: `Bearer ${config.apiKey}` } : {},
      }
    );

    if (!response.ok) {
      return [];
    }

    const data = await response.json();
    return Array.isArray(data.messages) ? data.messages : [];
  } catch (error) {
    console.warn("Failed to load chat history:", error);
    return [];
  }
}
