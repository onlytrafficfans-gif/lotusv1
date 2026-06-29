# Lotus App Builder UI — Geek Starter Kit Handoff

## What this package is
This is the cleaned Figma Make export for the Lotus App Builder UI. It is ready to be dropped into the Geek Starter Kit as the front-end shell.

The UI already includes:
- Warm cream / peach Lotus visual direction
- Chat composer with a single `+` action menu
- Router/model switcher inside chat
- Preview / Code / Deployed tabs
- Mobile / Tablet / Desktop preview modes
- Connectors, skills, agents, capabilities, and file upload mock data
- Lotus logo asset

## Fast setup
```bash
pnpm install
pnpm dev
```

If pnpm is not available:
```bash
npm install
npm run dev
```

## Main files
- `src/app/App.tsx` — current all-in-one Lotus UI shell
- `src/imports/logo_lotus.png` — Lotus logo
- `src/styles/theme.css` — cream/peach theme tokens
- `src/imports/pasted_text/builder-command-bar.tsx` — extra command bar component from export

## Integration target
Wire this UI into Geek Starter Kit as the app-builder front end. Do not rebuild the visual system from scratch. Preserve the soft Figma-style cream/peach interface.

## Important product direction
Do not make the connectors drag-and-drop. Connectors should behave like a clean settings/app-component hub, not Zapier.

The bottom chat composer should stay minimal:

```txt
+  |  Router ▼  |  Describe what you want to build...                    Send
```

The `+` menu should be the only place for app components, uploads, connectors, agents, skills, functions, API keys, and device capabilities.

## Wiring map
Replace the mock state in `src/app/App.tsx` with real Geek Starter Kit services:

### Router switcher
Current mock: `MODELS`, `selectedModel`

Wire to:
- available models / providers
- OpenRouter if available
- local model option if Geek Starter Kit supports it
- per-chat selected model state

### Plus menu
Current mock: `PLUS_ITEMS`

Wire each item to real actions:
- Upload File → file picker + project upload service
- Upload Image → image picker + asset upload service
- Add Connector → open connectors hub
- Add Skill → open skills selector
- Add Agent → open agents selector
- Add Function → function/tool builder
- Import Design → Figma/import flow
- Import GitHub Repo → GitHub import flow
- Add API Key → secrets manager
- Add Device Capability → app capabilities/settings panel

### Connectors
Current mock: `INIT_CONNECTORS`

Wire to real connector registry:
- status
- auth method
- connected account
- environment variables
- test connection
- logs
- disconnect/reconnect

### Chat
Current mock: `INIT_MESSAGES`

Wire to:
- real chat thread storage
- streaming AI responses
- selected router/model
- project context
- uploaded files context
- connector/capability context

### Preview
Current mock: `MockPreview`

Wire to:
- generated app preview iframe or sandbox
- mobile/tablet/desktop frame switcher
- live reload from build output

### Code tab
Current mock: `MOCK_FILES`

Wire to:
- generated project file tree
- file content viewer/editor
- copy/download/export ZIP

### Deployed tab
Current mock: `DeployedPanel`

Wire to:
- Vercel/Netlify/Cloudflare/Expo deployment status
- app store prep status
- build logs
- public URL

## First Claude Code prompt
Paste this into Claude Code inside the Geek Starter Kit repo:

---

I am importing a cleaned Figma Make front-end shell called `lotus-geek-starter-kit-ready` into this Geek Starter Kit repo.

Goal: wire the Lotus UI cleanly into the existing app architecture without breaking the starter kit.

Tasks:
1. Inspect the repo structure first. Do not overwrite existing routing, auth, env, or API systems blindly.
2. Add the Lotus UI as the primary app-builder screen.
3. Preserve the Lotus cream/peach visual style from `src/styles/theme.css`.
4. Keep the chat composer minimal: one `+` button, one router switcher, one text input, one send button.
5. Do not add drag-and-drop connectors.
6. Convert mock arrays from `src/app/App.tsx` into clean adapter layers:
   - `models.adapter.ts`
   - `connectors.adapter.ts`
   - `chat.adapter.ts`
   - `projects.adapter.ts`
   - `deploy.adapter.ts`
7. Wire the router switcher to the starter kit's real model/provider config if it exists. If not, create a clean placeholder provider registry.
8. Wire the `+` menu to real app actions or placeholder handlers with clear TODOs.
9. Wire Connectors to a connector registry with status, auth type, config fields, test connection, and logs.
10. Wire Preview to the starter kit preview/sandbox system if it exists. If not, keep the current mock preview but isolate it behind `PreviewPanel`.
11. Split `App.tsx` into production components:
   - `LotusAppBuilder.tsx`
   - `LotusShell.tsx`
   - `ChatPanel.tsx`
   - `ChatComposer.tsx`
   - `RouterSwitcher.tsx`
   - `PlusActionMenu.tsx`
   - `ConnectorsHub.tsx`
   - `PreviewPanel.tsx`
   - `CodePanel.tsx`
   - `DeployPanel.tsx`
12. Make sure TypeScript passes.
13. Make sure the dev server starts.
14. Give me a final report listing changed files, commands run, and anything still mocked.

Do this carefully as an integration, not a redesign.

---

## Second Claude Code prompt after it wires up

Run a full integration audit. Check for broken imports, missing packages, TypeScript errors, CSS conflicts, routing conflicts, hardcoded mock-only behavior, and anything that would stop this from being deployed. Fix what is safe. Report anything that needs an API key or backend decision.

