import { createTypedHandler } from "./base";
import { miscContracts } from "../types/misc";
import { DyadError, DyadErrorKind } from "@/errors/dyad_error";

// Cache for balance data (refresh every 5 minutes)
let cachedBalance: any = null;
let lastFetchTime = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

async function fetchOpenRouterBalance(apiKey: string) {
  try {
    const response = await fetch("https://openrouter.ai/api/v1/auth/key/limits", {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new DyadError("Invalid OpenRouter API key", DyadErrorKind.Auth);
      }
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();

    return {
      creditsRemaining: data.data?.credits_remaining ?? null,
      monthlyUsage: data.data?.usage?.month ?? null,
      monthlyLimit: data.data?.monthly_limit ?? null,
      lastUpdated: Date.now(),
    };
  } catch (error) {
    console.error("Error fetching OpenRouter balance:", error);
    throw new DyadError(
      `Failed to fetch OpenRouter balance: ${error instanceof Error ? error.message : "Unknown error"}`,
      DyadErrorKind.External
    );
  }
}

export function registerOpenRouterBalanceHandlers() {
  createTypedHandler(miscContracts.getOpenRouterBalance, async () => {
    try {
      // Get API key from environment
      const apiKey = process.env.OPENROUTER_API_KEY;

      if (!apiKey) {
        throw new DyadError(
          "OpenRouter API key not configured",
          DyadErrorKind.Precondition
        );
      }

      // Return cached data if available and fresh
      if (
        cachedBalance &&
        Date.now() - lastFetchTime < CACHE_DURATION
      ) {
        return cachedBalance;
      }

      const balance = await fetchOpenRouterBalance(apiKey);
      cachedBalance = balance;
      lastFetchTime = Date.now();

      return balance;
    } catch (error) {
      console.error("Error in getOpenRouterBalance:", error);
      throw error;
    }
  });

  createTypedHandler(miscContracts.refreshOpenRouterBalance, async () => {
    try {
      const apiKey = process.env.OPENROUTER_API_KEY;

      if (!apiKey) {
        throw new DyadError(
          "OpenRouter API key not configured",
          DyadErrorKind.Precondition
        );
      }

      // Force refresh by clearing cache
      lastFetchTime = 0;
      const balance = await fetchOpenRouterBalance(apiKey);
      cachedBalance = balance;
      lastFetchTime = Date.now();

      return balance;
    } catch (error) {
      console.error("Error in refreshOpenRouterBalance:", error);
      throw error;
    }
  });
}
