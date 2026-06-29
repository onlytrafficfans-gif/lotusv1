/**
 * Demo Access Management
 * Handles one-time per-email 1-hour demo access for Lotus
 */

const DEMO_USED_EMAILS_KEY = "lotus_demo_used_emails";
const DEMO_SESSION_KEY = "lotus_demo_session";
const DEMO_DURATION_MS = 60 * 60 * 1000; // 1 hour

export interface DemoSession {
  email: string;
  startTime: number;
  expiryTime: number;
}

export interface UsedEmail {
  email: string;
  usedAt: string;
}

/**
 * Normalize email for consistent comparison
 */
export function normalizeEmail(email: string): string {
  return email.toLowerCase().trim();
}

/**
 * Check if email has already used demo access
 */
export function hasEmailUsedDemo(email: string): boolean {
  try {
    const usedEmails = JSON.parse(
      localStorage.getItem(DEMO_USED_EMAILS_KEY) || "[]"
    ) as UsedEmail[];
    const normalized = normalizeEmail(email);
    return usedEmails.some((record) => normalizeEmail(record.email) === normalized);
  } catch {
    return false;
  }
}

/**
 * Mark email as having used demo access
 */
export function markEmailAsUsed(email: string): void {
  try {
    const usedEmails = JSON.parse(
      localStorage.getItem(DEMO_USED_EMAILS_KEY) || "[]"
    ) as UsedEmail[];
    const normalized = normalizeEmail(email);

    // Avoid duplicates
    if (!usedEmails.some((r) => normalizeEmail(r.email) === normalized)) {
      usedEmails.push({
        email: normalized,
        usedAt: new Date().toISOString(),
      });
      localStorage.setItem(DEMO_USED_EMAILS_KEY, JSON.stringify(usedEmails));
    }
  } catch {
    console.warn("Failed to mark email as used");
  }
}

/**
 * Start a new demo session
 */
export function startDemoSession(email: string): DemoSession {
  const now = Date.now();
  const session: DemoSession = {
    email: normalizeEmail(email),
    startTime: now,
    expiryTime: now + DEMO_DURATION_MS,
  };

  try {
    localStorage.setItem(DEMO_SESSION_KEY, JSON.stringify(session));
  } catch {
    console.warn("Failed to save demo session");
  }

  markEmailAsUsed(email);
  return session;
}

/**
 * Get current demo session if valid
 */
export function getDemoSession(): DemoSession | null {
  try {
    const stored = localStorage.getItem(DEMO_SESSION_KEY);
    if (!stored) return null;

    const session = JSON.parse(stored) as DemoSession;
    const now = Date.now();

    // Check if session is still valid
    if (now < session.expiryTime) {
      return session;
    }

    // Session expired, clear it
    localStorage.removeItem(DEMO_SESSION_KEY);
    return null;
  } catch {
    return null;
  }
}

/**
 * Get remaining time in milliseconds for current session
 */
export function getDemoTimeRemaining(): number {
  const session = getDemoSession();
  if (!session) return 0;

  const remaining = session.expiryTime - Date.now();
  return Math.max(0, remaining);
}

/**
 * Check if demo has expired
 */
export function isDemoExpired(): boolean {
  return getDemoTimeRemaining() === 0;
}

/**
 * Format remaining time as HH:MM:SS
 */
export function formatDemoTimeRemaining(): string {
  const remaining = getDemoTimeRemaining();
  const totalSeconds = Math.floor(remaining / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

/**
 * Clear all demo access data (for development only)
 */
export function clearDemoAccess(): void {
  localStorage.removeItem(DEMO_SESSION_KEY);
  localStorage.removeItem(DEMO_USED_EMAILS_KEY);
}

/**
 * Get all emails that have used demo
 */
export function getUsedEmails(): UsedEmail[] {
  try {
    return JSON.parse(
      localStorage.getItem(DEMO_USED_EMAILS_KEY) || "[]"
    ) as UsedEmail[];
  } catch {
    return [];
  }
}
