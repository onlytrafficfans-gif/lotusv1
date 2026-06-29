/**
 * Groq Chat API Endpoint
 * Vercel Serverless Function
 * POST /api/chat/groq
 */

interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

interface ChatRequest {
  message: string;
  modelId: string;
  conversationHistory?: ChatMessage[];
}

interface ChatResponse {
  content: string;
  model: string;
  finish_reason: string;
}

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_BASE_URL = process.env.GROQ_BASE_URL || "https://api.groq.com/openai/v1";

// Fallback responses for demo
const FALLBACK_RESPONSES: Record<string, string> = {
  default: "I understand you want to build an app. Let me help you design the architecture, set up the backend, and deploy it. What's your main goal?",
  plan: "Based on your requirements, here's a solid plan:\n\n1. **Backend**: Set up Supabase for database & auth\n2. **Frontend**: Build with React + Vite\n3. **Deployment**: Host on Vercel\n4. **Monitoring**: Add Sentry for error tracking\n\nShould we start with the backend setup?",
  deploy: "I can help you deploy this app to Vercel, Netlify, or Cloudflare Pages. Which platform do you prefer? I'll handle the configuration.",
};

export default async function handler(
  req: any,
  res: any
): Promise<void> {
  // Only allow POST
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  try {
    const { message, modelId } = req.body as ChatRequest;

    if (!message) {
      res.status(400).json({ error: "Message required" });
      return;
    }

    // If no Groq API key, use fallback
    if (!GROQ_API_KEY) {
      console.warn("GROQ_API_KEY not set, using fallback response");
      let fallback = FALLBACK_RESPONSES.default;
      if (message.toLowerCase().includes("plan")) {
        fallback = FALLBACK_RESPONSES.plan;
      } else if (message.toLowerCase().includes("deploy")) {
        fallback = FALLBACK_RESPONSES.deploy;
      }

      res.status(200).json({
        content: fallback,
        model: modelId || "fallback",
        finish_reason: "stop",
      });
      return;
    }

    // Call Groq API with retry
    let attempts = 0;
    let lastError: Error | null = null;

    while (attempts < 2) {
      try {
        const response = await fetch(`${GROQ_BASE_URL}/chat/completions`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${GROQ_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: modelId || "llama-3.1-8b-instant",
            messages: [{ role: "user", content: message }],
            temperature: 0.7,
            max_tokens: 2048,
            stream: true,
          }),
        });

        if (response.ok) {
          // Stream the response from Groq directly to client
          res.setHeader("Content-Type", "text/event-stream");
          res.setHeader("Cache-Control", "no-cache");
          res.setHeader("Connection", "keep-alive");

          if (response.body) {
            response.body.pipe(res);
          } else {
            res.write("data: [DONE]\n\n");
            res.end();
          }
          return;
        }

        console.warn(`Groq API error attempt ${attempts + 1}: ${response.status}`);
        attempts++;
      } catch (error) {
        lastError = error as Error;
        console.warn(`Groq API error attempt ${attempts + 1}:`, error);
        attempts++;
      }
    }

    // All retries failed - use fallback
    console.warn("Groq API unavailable after retries, using fallback");
    let fallback = FALLBACK_RESPONSES.default;
    if (message.toLowerCase().includes("plan")) {
      fallback = FALLBACK_RESPONSES.plan;
    } else if (message.toLowerCase().includes("deploy")) {
      fallback = FALLBACK_RESPONSES.deploy;
    }

    res.status(200).json({
      content: fallback,
      model: modelId || "fallback",
      finish_reason: "stop",
    });
  } catch (error) {
    console.error("Chat handler error:", error);
    const message = (req.body as any).message || "";
    let fallback = FALLBACK_RESPONSES.default;
    if (message.toLowerCase().includes("plan")) {
      fallback = FALLBACK_RESPONSES.plan;
    } else if (message.toLowerCase().includes("deploy")) {
      fallback = FALLBACK_RESPONSES.deploy;
    }

    res.status(200).json({
      content: fallback,
      model: (req.body as any).modelId || "fallback",
      finish_reason: "stop",
    });
  }
}
