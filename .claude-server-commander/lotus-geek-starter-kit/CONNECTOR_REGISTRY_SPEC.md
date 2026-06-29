# Lotus Connector Registry Spec

Connectors should be registry-driven, not drag-and-drop.

## Connector shape
```ts
export type ConnectorCategory =
  | 'ai'
  | 'auth'
  | 'database'
  | 'storage'
  | 'payments'
  | 'analytics'
  | 'notifications'
  | 'deployment'
  | 'source-control'
  | 'mobile'
  | 'device'
  | 'productivity'
  | 'communication'
  | 'security';

export type AuthType = 'oauth' | 'api-key' | 'env' | 'none';

export interface LotusConnector {
  id: string;
  name: string;
  category: ConnectorCategory;
  description: string;
  authType: AuthType;
  requiredEnv?: string[];
  status: 'available' | 'connected' | 'error' | 'disabled';
  connectedAccount?: string;
  docsUrl?: string;
  premium?: boolean;
}
```

## Core starter connectors
Start with these because they unlock the app-builder business case fastest:

- OpenRouter
- OpenAI
- Anthropic
- Gemini
- Supabase
- Firebase
- GitHub
- Vercel
- Cloudflare
- Stripe
- RevenueCat
- Apple Developer
- Google Play Console
- Expo EAS
- OneSignal
- SendGrid / Resend
- Google Maps
- Sentry

## Behavior
- The AI can recommend connectors based on the user prompt.
- User can install/skip.
- Connector settings open in a right-side panel.
- No drag-and-drop canvas.
- All secrets go through environment variables or the starter kit secrets manager.
