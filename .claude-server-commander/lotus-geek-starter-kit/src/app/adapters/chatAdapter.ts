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
 * Submit a chat message and stream response from Groq.
 * Calls onChunk for each streamed piece.
 * Includes retry logic and mock fallback.
 */
export async function submitChat(
  request: ChatSubmitRequest,
  onChunk: (event: ChatStreamEvent) => void,
  config?: ChatAdapterConfig
): Promise<void> {
  const { message } = request;

  // Determine fallback response
  let fallbackResponse = MOCK_RESPONSES.default;
  if (message.toLowerCase().includes("plan")) {
    fallbackResponse = MOCK_RESPONSES.plan;
  } else if (message.toLowerCase().includes("deploy")) {
    fallbackResponse = MOCK_RESPONSES.deploy;
  }

  if (!config?.backendUrl) {
    // Mock: stream response with simulated delays
    onChunk({ type: "start" });
    const chunks = fallbackResponse.split(" ");
    for (const chunk of chunks) {
      await new Promise((resolve) => setTimeout(resolve, 30));
      onChunk({ type: "chunk", content: chunk + " " });
    }
    onChunk({ type: "end" });
    return;
  }

  // Try to call Groq API with retry logic
  let retries = 0;
  const maxRetries = 1;

  while (retries <= maxRetries) {
    try {
      onChunk({ type: "start" });

      const controller = new AbortController();
      const timeoutId = setTimeout(
        () => controller.abort(),
        config.timeout || 60000
      );

      const response = await fetch(`${config.backendUrl}/api/chat/groq`, {
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
        // If first attempt failed, retry once
        if (retries < maxRetries) {
          console.warn(
            `Groq request failed (${response.status}), retrying...`
          );
          retries++;
          await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait 1s before retry
          continue;
        }

        // After retries exhausted, show error and fallback
        console.warn(
          `Groq request failed (${response.status}) after ${retries} retries, using fallback`
        );
        onChunk({
          type: "error",
          error: "Groq is temporarily unavailable.",
        });

        // Stream fallback response
        const chunks = fallbackResponse.split(" ");
        for (const chunk of chunks) {
          await new Promise((resolve) => setTimeout(resolve, 30));
          onChunk({ type: "chunk", content: chunk + " " });
        }
        onChunk({ type: "end" });
        return;
      }

      // Stream response from Groq
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
      return; // Success - exit retry loop
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        console.warn("Groq request timeout, using fallback");
        onChunk({
          type: "error",
          error: "Request timeout. Using fallback response.",
        });

        // Stream fallback response
        const chunks = fallbackResponse.split(" ");
        for (const chunk of chunks) {
          await new Promise((resolve) => setTimeout(resolve, 30));
          onChunk({ type: "chunk", content: chunk + " " });
        }
        onChunk({ type: "end" });
        return;
      } else if (retries < maxRetries) {
        // Network error - retry once
        console.warn("Groq request failed, retrying...", error);
        retries++;
        await new Promise((resolve) => setTimeout(resolve, 1000));
        continue;
      } else {
        // After retries exhausted, show error and fallback
        console.warn("Groq request failed after retries, using fallback:", error);
        onChunk({
          type: "error",
          error: "Groq is temporarily unavailable.",
        });

        // Stream fallback response
        const chunks = fallbackResponse.split(" ");
        for (const chunk of chunks) {
          await new Promise((resolve) => setTimeout(resolve, 30));
          onChunk({ type: "chunk", content: chunk + " " });
        }
        onChunk({ type: "end" });
        return;
      }
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
