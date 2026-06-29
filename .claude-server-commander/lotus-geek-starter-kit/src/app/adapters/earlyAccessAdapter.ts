/**
 * Early Access Email Adapter
 * Handles early access email submissions with backend fallback to localStorage
 */

const EARLY_ACCESS_KEY = "lotus_early_access_emails";

export interface EarlyAccessSubmission {
  email: string;
  submittedAt: string;
  source: "demo-ended";
}

export interface EarlyAccessResponse {
  success: boolean;
  duplicate?: boolean;
  message: string;
}

export interface EarlyAccessAdapterConfig {
  backendUrl?: string;
  timeout?: number;
}

/**
 * Normalize email for consistent storage
 */
function normalizeEmail(email: string): string {
  return email.toLowerCase().trim();
}

/**
 * Submit email for early access
 */
export async function submitEarlyAccessEmail(
  email: string,
  config?: EarlyAccessAdapterConfig
): Promise<EarlyAccessResponse> {
  const normalizedEmail = normalizeEmail(email);

  if (!config?.backendUrl) {
    // Fallback to localStorage
    return submitToLocalStorage(normalizedEmail);
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(
      () => controller.abort(),
      config.timeout || 5000
    );

    const response = await fetch(`${config.backendUrl}/api/early-access`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: normalizedEmail,
        source: "demo-ended",
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      console.warn(
        `Early access submission failed (${response.status}), falling back to localStorage`
      );
      return submitToLocalStorage(normalizedEmail);
    }

    const data = await response.json();
    return {
      success: true,
      duplicate: data.duplicate || false,
      message: data.duplicate
        ? "This email has already requested early access."
        : "You're on the Lotus early access list.",
    };
  } catch (error) {
    console.warn("Early access submission failed, falling back to localStorage:", error);
    return submitToLocalStorage(normalizedEmail);
  }
}

/**
 * Submit email to localStorage as fallback
 */
function submitToLocalStorage(email: string): EarlyAccessResponse {
  try {
    const submissions = JSON.parse(
      localStorage.getItem(EARLY_ACCESS_KEY) || "[]"
    ) as EarlyAccessSubmission[];

    // Check if email already submitted
    const isDuplicate = submissions.some(
      (s) => normalizeEmail(s.email) === email
    );

    if (isDuplicate) {
      return {
        success: false,
        duplicate: true,
        message: "This email has already requested early access.",
      };
    }

    // Add new submission
    submissions.push({
      email,
      submittedAt: new Date().toISOString(),
      source: "demo-ended",
    });

    localStorage.setItem(EARLY_ACCESS_KEY, JSON.stringify(submissions));

    return {
      success: true,
      message: "You're on the Lotus early access list.",
    };
  } catch (error) {
    console.error("Failed to submit early access email:", error);
    return {
      success: false,
      message: "Failed to submit email. Please try again.",
    };
  }
}

/**
 * Get all early access submissions (for development)
 */
export function getEarlyAccessSubmissions(): EarlyAccessSubmission[] {
  try {
    return JSON.parse(
      localStorage.getItem(EARLY_ACCESS_KEY) || "[]"
    ) as EarlyAccessSubmission[];
  } catch {
    return [];
  }
}

/**
 * Clear early access submissions (for development)
 */
export function clearEarlyAccessSubmissions(): void {
  localStorage.removeItem(EARLY_ACCESS_KEY);
}
