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

// Enhanced fallback responses with more variety
const FALLBACK_RESPONSES = {
  default: [
    "I'd love to help build your app! What kind of application are you thinking of? (e.g., mobile app, web app, SaaS platform)",
    "Great idea! Let's start by understanding your requirements. What problem does this app solve?",
    "I'm here to help you build something amazing. Tell me more about your vision - what features are most important?",
    "Let's design your app together. What's the primary use case you're targeting?",
    "I can help you architect, design, and deploy. What's the first thing you'd like to tackle?",
  ],
  plan: [
    "Based on your requirements, here's a solid implementation plan:\n\n1. **Design Phase**: Wireframe key user flows\n2. **Backend**: Set up database and APIs\n3. **Frontend**: Build UI with React & TypeScript\n4. **Testing**: Add comprehensive test coverage\n5. **Deployment**: Deploy to Vercel or similar\n\nWhich phase should we start with?",
    "Here's my recommended development strategy:\n\n**Week 1**: Architecture & setup\n**Week 2**: Core features\n**Week 3**: Polish & testing\n**Week 4**: Launch preparation\n\nDoes this timeline work for you?",
    "For your app, I'd recommend:\n\n• **Frontend**: Next.js + React for scalability\n• **Backend**: Node.js + Express or FastAPI\n• **Database**: PostgreSQL for reliability\n• **Hosting**: Vercel for frontend, Railway/Render for backend\n\nReady to start coding?",
  ],
  deploy: [
    "I can help deploy your app to multiple platforms! Here are your options:\n\n1. **Vercel** - Best for Next.js/React\n2. **Netlify** - Great for static sites\n3. **Cloudflare Pages** - Ultra-fast edge deployment\n4. **AWS** - Most flexible, most complex\n\nWhich platform interests you?",
    "Deployment made easy! I can set up:\n\n✓ Auto-deploys on git push\n✓ Environment variables & secrets\n✓ Custom domains & SSL\n✓ Preview deployments\n✓ Monitoring & alerts\n\nWhich hosting platform do you prefer?",
    "Let's get your app live! We can deploy to:\n\n• Vercel (recommended for React/Next.js)\n• Netlify (good for static sites)\n• Railway (full-stack apps)\n• Render (reliable backend hosting)\n\nWhat's your preference?",
  ],
  improve: [
    "To improve your UI, I'd focus on:\n\n1. **Typography** - Better font hierarchy\n2. **Spacing** - More breathing room\n3. **Colors** - Cohesive color palette\n4. **Interactions** - Smooth animations\n5. **Mobile** - Responsive design\n\nWhich area matters most?",
    "Here are some quick wins for better UX:\n\n• Add micro-interactions (hover, focus states)\n• Improve accessibility (WCAG compliance)\n• Optimize for mobile\n• Add loading states\n• Better error messages\n\nWant to tackle any of these?",
  ],
  bug: [
    "Let's debug this together! Can you tell me:\n\n1. What's the error message?\n2. When does it happen?\n3. What were you trying to do?\n4. Any patterns to when it fails?\n\nI'll help find and fix it.",
    "No problem, we'll squash that bug! Help me understand:\n\n• What's broken?\n• How to reproduce it?\n• Does it happen consistently?\n• Any error logs?\n\nOnce I have details, I can fix it quickly.",
  ],
};

/**
 * Get a random fallback response based on message context
 */
function getRandomFallback(message: string): string {
  const lower = message.toLowerCase();
  let responses: string[];

  if (lower.includes("plan") || lower.includes("architect") || lower.includes("design")) {
    responses = FALLBACK_RESPONSES.plan;
  } else if (lower.includes("deploy") || lower.includes("launch") || lower.includes("host")) {
    responses = FALLBACK_RESPONSES.deploy;
  } else if (lower.includes("improve") || lower.includes("ui") || lower.includes("ux") || lower.includes("design")) {
    responses = FALLBACK_RESPONSES.improve;
  } else if (lower.includes("bug") || lower.includes("error") || lower.includes("fix") || lower.includes("broken")) {
    responses = FALLBACK_RESPONSES.bug;
  } else {
    responses = FALLBACK_RESPONSES.default;
  }

  // Return random response from the selected category
  return responses[Math.floor(Math.random() * responses.length)];
}

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

  // Determine fallback response with variety
  const fallbackResponse = getRandomFallback(message);

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
