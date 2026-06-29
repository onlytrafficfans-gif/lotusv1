import React from "react";
import {
  Upload,
  ImageIcon,
  Plug,
  Sparkles,
  Bot,
  Cpu,
  FileText,
  Code2,
  Settings,
  Smartphone,
} from "lucide-react";
import {
  ModelRouter,
  Connector,
  ToggleItem,
  Capability,
  ChatMessage,
  MockFile,
  PlusMenuItem,
} from "../types";

export function getInitialModels(): ModelRouter[] {
  return [
    "Enigma Auto",
    "GPT-4.1",
    "Claude Sonnet",
    "Claude Opus",
    "Gemini Pro",
    "DeepSeek Coder",
    "Local Model",
  ];
}

export function getInitialConnectors(): Connector[] {
  return [
    {
      id: "sup",
      name: "Supabase",
      desc: "Postgres database & auth",
      connected: false,
    },
    {
      id: "fir",
      name: "Firebase",
      desc: "Realtime DB & hosting",
      connected: false,
    },
    { id: "git", name: "GitHub", desc: "Source control & CI", connected: false },
    {
      id: "ver",
      name: "Vercel",
      desc: "Deploy & edge functions",
      connected: false,
    },
    {
      id: "str",
      name: "Stripe",
      desc: "Payments & subscriptions",
      connected: false,
    },
    {
      id: "oar",
      name: "OpenRouter",
      desc: "Multi-model API gateway",
      connected: false,
    },
    {
      id: "oai",
      name: "OpenAI",
      desc: "GPT models & DALL-E",
      connected: false,
    },
    {
      id: "ant",
      name: "Anthropic",
      desc: "Claude models",
      connected: false,
    },
    {
      id: "gdr",
      name: "Google Drive",
      desc: "File storage & docs",
      connected: false,
    },
    {
      id: "gml",
      name: "Gmail",
      desc: "Email send & receive",
      connected: false,
    },
    {
      id: "gcl",
      name: "Google Calendar",
      desc: "Events & scheduling",
      connected: false,
    },
    {
      id: "apl",
      name: "Apple Developer",
      desc: "App Store & push certs",
      connected: false,
    },
    {
      id: "gpc",
      name: "Play Console",
      desc: "Google Play distribution",
      connected: false,
    },
    {
      id: "ble",
      name: "Bluetooth",
      desc: "BLE device connectivity",
      connected: false,
    },
    {
      id: "cam",
      name: "Camera",
      desc: "Device camera access",
      connected: false,
    },
    {
      id: "mic",
      name: "Microphone",
      desc: "Audio capture",
      connected: false,
    },
    {
      id: "psh",
      name: "Push Notifications",
      desc: "Cross-platform push",
      connected: false,
    },
    {
      id: "map",
      name: "Maps / Location",
      desc: "GPS & map rendering",
      connected: false,
    },
  ];
}

export function getInitialSkills(): ToggleItem[] {
  return [
    {
      id: "uip",
      name: "UI Polish",
      desc: "Refine spacing, type, color",
      on: false,
    },
    {
      id: "lpb",
      name: "Landing Page Builder",
      desc: "Generate marketing pages",
      on: false,
    },
    {
      id: "aus",
      name: "Auth Setup",
      desc: "Adds auth flows",
      on: true,
    },
    {
      id: "ssc",
      name: "Supabase Schema",
      desc: "Design DB tables",
      on: false,
    },
    {
      id: "asp",
      name: "App Store Prep",
      desc: "Checklist & assets",
      on: false,
    },
    {
      id: "psp",
      name: "Play Store Prep",
      desc: "Checklist & assets",
      on: false,
    },
    {
      id: "seo",
      name: "SEO Setup",
      desc: "Meta tags & sitemaps",
      on: false,
    },
    {
      id: "cpw",
      name: "Copywriter",
      desc: "AI-written UI copy",
      on: true,
    },
    {
      id: "bug",
      name: "Bug Fixer",
      desc: "Detect & fix issues",
      on: false,
    },
    {
      id: "pay",
      name: "Payment Flow",
      desc: "Stripe checkout setup",
      on: false,
    },
    {
      id: "img",
      name: "Image Generator",
      desc: "AI images inline",
      on: false,
    },
    {
      id: "dim",
      name: "Data Importer",
      desc: "CSV/JSON ingestion",
      on: false,
    },
  ];
}

export function getInitialAgents(): ToggleItem[] {
  return [
    {
      id: "pa",
      name: "Product Architect",
      desc: "Shapes features & flows",
      on: true,
    },
    {
      id: "uid",
      name: "UI Designer",
      desc: "Visual polish & layout",
      on: true,
    },
    {
      id: "be",
      name: "Backend Engineer",
      desc: "API & server logic",
      on: false,
    },
    {
      id: "mob",
      name: "Mobile App Engineer",
      desc: "React Native & Expo",
      on: false,
    },
    {
      id: "db",
      name: "Database Planner",
      desc: "Schema & indexing",
      on: false,
    },
    {
      id: "qa",
      name: "QA Tester",
      desc: "Test cases & coverage",
      on: false,
    },
    {
      id: "as",
      name: "App Store Strategist",
      desc: "ASO & store copy",
      on: false,
    },
    {
      id: "gs",
      name: "Growth Strategist",
      desc: "Retention & funnels",
      on: false,
    },
    {
      id: "sec",
      name: "Security Reviewer",
      desc: "Audits & vulnerabilities",
      on: false,
    },
    {
      id: "dep",
      name: "Deployment Manager",
      desc: "CI/CD & infra",
      on: false,
    },
  ];
}

export function getInitialCapabilities(): Capability[] {
  return [
    {
      id: "d1",
      name: "Bluetooth",
      category: "Device",
      desc: "BLE scanning & pairing",
      active: false,
    },
    {
      id: "d2",
      name: "Camera",
      category: "Device",
      desc: "Photo & video capture",
      active: false,
    },
    {
      id: "d3",
      name: "Microphone",
      category: "Device",
      desc: "Audio input",
      active: false,
    },
    {
      id: "d4",
      name: "Push Notifications",
      category: "Device",
      desc: "OS-level alerts",
      active: false,
    },
    {
      id: "d5",
      name: "Location Services",
      category: "Device",
      desc: "GPS & geofencing",
      active: false,
    },
    {
      id: "d6",
      name: "Contacts",
      category: "Device",
      desc: "Address book access",
      active: false,
    },
    {
      id: "d7",
      name: "Calendar Access",
      category: "Device",
      desc: "Read/write calendar events",
      active: false,
    },
    {
      id: "d8",
      name: "File System Access",
      category: "Device",
      desc: "Local file read/write",
      active: false,
    },
    {
      id: "d9",
      name: "Offline Mode",
      category: "Device",
      desc: "Service worker & cache",
      active: false,
    },
    {
      id: "a1",
      name: "User Authentication",
      category: "App",
      desc: "Login, signup, OAuth",
      active: true,
    },
    {
      id: "a2",
      name: "Payments",
      category: "App",
      desc: "One-time charges",
      active: false,
    },
    {
      id: "a3",
      name: "Subscriptions",
      category: "App",
      desc: "Recurring billing",
      active: false,
    },
    {
      id: "a4",
      name: "Chat",
      category: "App",
      desc: "Real-time messaging",
      active: false,
    },
    {
      id: "a5",
      name: "Image Upload",
      category: "App",
      desc: "S3/Supabase storage",
      active: false,
    },
    {
      id: "a6",
      name: "Video Upload",
      category: "App",
      desc: "Video storage & streaming",
      active: false,
    },
    {
      id: "a7",
      name: "Admin Dashboard",
      category: "App",
      desc: "Internal management UI",
      active: false,
    },
    {
      id: "a8",
      name: "Analytics",
      category: "App",
      desc: "Event tracking & funnels",
      active: false,
    },
    {
      id: "a9",
      name: "Search",
      category: "App",
      desc: "Full-text search",
      active: false,
    },
    {
      id: "a10",
      name: "Notifications",
      category: "App",
      desc: "In-app alert system",
      active: false,
    },
    {
      id: "a11",
      name: "Export Data",
      category: "App",
      desc: "CSV/JSON data export",
      active: false,
    },
    {
      id: "ai1",
      name: "Text Generation",
      category: "AI",
      desc: "LLM-powered content",
      active: true,
    },
    {
      id: "ai2",
      name: "Image Generation",
      category: "AI",
      desc: "DALL-E / Stable Diffusion",
      active: false,
    },
    {
      id: "ai3",
      name: "Audio Transcription",
      category: "AI",
      desc: "Whisper-style STT",
      active: false,
    },
    {
      id: "ai4",
      name: "Voice Generation",
      category: "AI",
      desc: "TTS synthesis",
      active: false,
    },
    {
      id: "ai5",
      name: "Code Generation",
      category: "AI",
      desc: "AI-assisted coding",
      active: true,
    },
    {
      id: "ai6",
      name: "Document Analysis",
      category: "AI",
      desc: "PDF / doc parsing",
      active: false,
    },
    {
      id: "ai7",
      name: "Workflow Automation",
      category: "AI",
      desc: "Multi-step agent pipelines",
      active: false,
    },
  ];
}

export function getInitialMessages(): ChatMessage[] {
  return [
    {
      id: "1",
      role: "assistant",
      content:
        "Welcome to Lotus. Describe the app you want to build — I'll bring it to life.",
      ts: new Date(Date.now() - 120000),
    },
    {
      id: "2",
      role: "user",
      content:
        "Build me a wellness tracking app — mood check-ins, sleep logs, gratitude journal. Calm, minimal.",
      ts: new Date(Date.now() - 90000),
    },
    {
      id: "3",
      role: "assistant",
      content:
        "Crafting a three-tab layout — Mood, Sleep, Journal — with sage-and-ivory palette. Generating preview…",
      ts: new Date(Date.now() - 60000),
    },
  ];
}

export function getInitialFiles(): MockFile[] {
  return [
    {
      name: "src/App.tsx",
      lang: "tsx",
      code: `export default function App() {\n  return <div className="app">Hello Lotus</div>;\n}`,
    },
    {
      name: "src/components/Home.tsx",
      lang: "tsx",
      code: `export default function Home() {\n  return <main>Home screen</main>;\n}`,
    },
    {
      name: "src/components/Dashboard.tsx",
      lang: "tsx",
      code: `export default function Dashboard() {\n  return <section>Dashboard</section>;\n}`,
    },
    {
      name: "src/lib/supabase.ts",
      lang: "ts",
      code: `import { createClient } from "@supabase/supabase-js";\nexport const supabase = createClient(URL, KEY);`,
    },
    {
      name: "package.json",
      lang: "json",
      code: `{\n  "name": "lotus-app",\n  "version": "1.0.0"\n}`,
    },
    {
      name: "README.md",
      lang: "md",
      code: `# Lotus App\n\nBuilt with Lotus AI builder.`,
    },
  ];
}

export function getPlusMenuItems(): PlusMenuItem[] {
  return [
    { icon: React.createElement(Upload, { size: 12 }), label: "Upload File" },
    {
      icon: React.createElement(ImageIcon, { size: 12 }),
      label: "Upload Image",
    },
    { icon: React.createElement(Plug, { size: 12 }), label: "Add Connector" },
    {
      icon: React.createElement(Sparkles, { size: 12 }),
      label: "Add Skill",
    },
    { icon: React.createElement(Bot, { size: 12 }), label: "Add Agent" },
    { icon: React.createElement(Cpu, { size: 12 }), label: "Add Function" },
    {
      icon: React.createElement(FileText, { size: 12 }),
      label: "Import Design",
    },
    {
      icon: React.createElement(Code2, { size: 12 }),
      label: "Import GitHub Repo",
    },
    {
      icon: React.createElement(Settings, { size: 12 }),
      label: "Add API Key",
    },
    {
      icon: React.createElement(Smartphone, { size: 12 }),
      label: "Add Device Capability",
    },
  ];
}
