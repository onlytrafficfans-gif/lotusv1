import { z } from 'zod';

export const SendCodeRequestSchema = z.object({
  email: z.string().email(),
});

export type SendCodeRequest = z.infer<typeof SendCodeRequestSchema>;

export const SendCodeResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  expiresIn: z.number(), // seconds
});

export type SendCodeResponse = z.infer<typeof SendCodeResponseSchema>;

export const VerifyCodeRequestSchema = z.object({
  email: z.string().email(),
  code: z.string().min(6).max(6),
});

export type VerifyCodeRequest = z.infer<typeof VerifyCodeRequestSchema>;

export const VerifyCodeResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  token: z.string().optional(),
  user: z.object({
    id: z.string(),
    email: z.string(),
    firstName: z.string().optional(),
  }).optional(),
});

export type VerifyCodeResponse = z.infer<typeof VerifyCodeResponseSchema>;

export const ResendCodeRequestSchema = z.object({
  email: z.string().email(),
});

export type ResendCodeRequest = z.infer<typeof ResendCodeRequestSchema>;

export const CheckAuthStatusResponseSchema = z.object({
  isAuthenticated: z.boolean(),
  user: z.object({
    id: z.string(),
    email: z.string(),
    firstName: z.string().optional(),
  }).optional(),
});

export type CheckAuthStatusResponse = z.infer<typeof CheckAuthStatusResponseSchema>;
