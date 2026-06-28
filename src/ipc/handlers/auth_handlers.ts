import { ipcMain } from 'electron';
import {
  SendCodeRequest,
  SendCodeResponse,
  VerifyCodeRequest,
  VerifyCodeResponse,
  ResendCodeRequest,
  CheckAuthStatusResponse,
} from '../types/auth';

// In-memory storage for demo (replace with database in production)
const verificationCodes = new Map<string, { code: string; expiresAt: number }>();
const users = new Map<string, { id: string; email: string; firstName: string }>();
const sessions = new Map<string, { email: string; token: string; expiresAt: number }>();

// Generate random 6-digit code
function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Generate session token
function generateToken(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

export function registerAuthHandlers() {
  ipcMain.handle('auth:send-code', async (event, request: SendCodeRequest): Promise<SendCodeResponse> => {
    try {
      const code = generateCode();
      const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

      verificationCodes.set(request.email, { code, expiresAt });

      // In production, send via email service (SendGrid, Twilio, etc.)
      console.log(`[AUTH] Verification code for ${request.email}: ${code}`);

      return {
        success: true,
        message: 'Verification code sent to your email',
        expiresIn: 600, // 10 minutes in seconds
      };
    } catch (error) {
      console.error('Failed to send verification code:', error);
      return {
        success: false,
        message: 'Failed to send verification code',
        expiresIn: 0,
      };
    }
  });

  ipcMain.handle('auth:verify-code', async (event, request: VerifyCodeRequest): Promise<VerifyCodeResponse> => {
    try {
      const codeData = verificationCodes.get(request.email);

      if (!codeData) {
        return {
          success: false,
          message: 'No verification code found. Please request a new code.',
        };
      }

      if (Date.now() > codeData.expiresAt) {
        verificationCodes.delete(request.email);
        return {
          success: false,
          message: 'Verification code has expired. Please request a new code.',
        };
      }

      if (codeData.code !== request.code) {
        return {
          success: false,
          message: 'Invalid verification code. Please try again.',
        };
      }

      // Code is valid
      verificationCodes.delete(request.email);

      // Create or get user
      let user = Array.from(users.values()).find((u) => u.email === request.email);
      if (!user) {
        user = {
          id: `user_${Date.now()}`,
          email: request.email,
          firstName: '',
        };
        users.set(user.id, user);
      }

      // Create session
      const token = generateToken();
      const sessionExpiresAt = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
      sessions.set(token, { email: request.email, token, expiresAt: sessionExpiresAt });

      return {
        success: true,
        message: 'Successfully verified. Welcome!',
        token,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
        },
      };
    } catch (error) {
      console.error('Failed to verify code:', error);
      return {
        success: false,
        message: 'Failed to verify code',
      };
    }
  });

  ipcMain.handle('auth:resend-code', async (event, request: ResendCodeRequest): Promise<SendCodeResponse> => {
    // Same as send-code, just for clarity in the flow
    const code = generateCode();
    const expiresAt = Date.now() + 10 * 60 * 1000;

    verificationCodes.set(request.email, { code, expiresAt });

    console.log(`[AUTH] Resent verification code for ${request.email}: ${code}`);

    return {
      success: true,
      message: 'New verification code sent to your email',
      expiresIn: 600,
    };
  });

  ipcMain.handle('auth:check-status', async (): Promise<CheckAuthStatusResponse> => {
    // In production, check against stored session cookie/token
    // For now, return no user
    return {
      isAuthenticated: false,
    };
  });

  ipcMain.handle('auth:logout', async (): Promise<{ success: boolean; message: string }> => {
    // Clear session
    sessions.clear();
    return {
      success: true,
      message: 'Successfully logged out',
    };
  });
}
