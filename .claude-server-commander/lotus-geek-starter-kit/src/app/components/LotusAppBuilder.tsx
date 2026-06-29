import React, { useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Send,
  Smartphone,
  Tablet,
  Monitor,
  RefreshCw,
  Code2,
  Eye,
  Zap,
  Check,
  MoreHorizontal,
  Undo2,
  Redo2,
  Brain,
  ChevronDown,
} from "lucide-react";
import logoLotus from "@/imports/logo_lotus.png";

import { AppInitialData, BuildView, ChatMessage } from "../types";
import { useDeviceSelection } from "../hooks/useDeviceSelection";
import { useFileManager } from "../hooks/useFileManager";
import { useConnectorToggle, useSkillToggle, useAgentToggle, useCapabilityToggle } from "../hooks/useToggleable";
import { useModalState } from "../hooks/useModalState";
import { formatTime, DEVICE_DIMENSIONS } from "../utils/formatting";

import { ConnectorsPanel } from "./panels/ConnectorsPanel";
import { SkillsPanel } from "./panels/SkillsPanel";
import { AgentsPanel } from "./panels/AgentsPanel";
import { FunctionsPanel } from "./panels/FunctionsPanel";
import { ViewAppMenu } from "./panels/ViewAppMenu";

import { CodePanel } from "./builder/CodePanel";
import { DeployedPanel } from "./builder/DeployedPanel";
import { PreviewPanel } from "./builder/PreviewPanel";
import { TypingIndicator } from "./builder/TypingIndicator";

interface LotusAppBuilderProps {
  initialData: AppInitialData;
}

const QUICK_ACTIONS = [
  { label: "Generate Plan", text: "Generate a full product plan for this app." },
  { label: "Fix Bugs", text: "Review the current code and fix any bugs." },
  { label: "Improve UI", text: "Improve the visual design and polish the UI." },
  { label: "Prepare Store Build", text: "Prepare everything needed for an App Store submission." },
];

export function LotusAppBuilder({ initialData }: LotusAppBuilderProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  // State management
  const [messages, setMessages] = React.useState<ChatMessage[]>([]);
  const [input, setInput] = React.useState("");
  const [isTyping, setIsTyping] = React.useState(false);
  const [view, setView] = React.useState<BuildView>("preview");
  const [selectedModel, setSelectedModel] = React.useState("Enigma Auto");
  const [autosaved, setAutosaved] = React.useState(true);
  const [history, setHistory] = React.useState(["Initial build"]);
  const [historyIdx, setHistoryIdx] = React.useState(0);

  const { device, setDevice, dragKey, resetPosition } = useDeviceSelection();
  const { uploadedFiles, addFiles, removeFile } = useFileManager();
  const { connectors, toggle: toggleConnector } = useConnectorToggle(initialData.connectors || []);
  const { skills, toggle: toggleSkill } = useSkillToggle(initialData.skills || []);
  const { agents, toggle: toggleAgent } = useAgentToggle(initialData.agents || []);
  const { capabilities, toggle: toggleCap } = useCapabilityToggle(initialData.capabilities || []);
  const {
    showPlus,
    setShowPlus,
    showModel,
    setShowModel,
    showConnector,
    setShowConnector,
    showSkills,
    setShowSkills,
    showAgents,
    setShowAgents,
    showFunctions,
    setShowFunctions,
    showViewApp,
    setShowViewApp,
    closeAll,
  } = useModalState();

  // Initialize state with initial data
  useEffect(() => {
    setMessages(initialData.messages || []);
    setInput("");
    setIsTyping(false);
    setView("preview");
    setSelectedModel(initialData.models?.[0] || "Enigma Auto");
    setAutosaved(true);
    setHistory(["Initial build"]);
    setHistoryIdx(0);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const activeConnectors = connectors.filter((c) => c.connected).length;
  const activeSkills = skills.filter((s) => s.on).length;
  const activeAgents = agents.filter((a) => a.on).length;
  const activeCaps = capabilities.filter((c) => c.active).length;

  function handleSend(text = input.trim()) {
    if (!text) return;
    const id = Date.now().toString();
    setMessages((p: ChatMessage[]) => [...p, { id, role: "user", content: text, ts: new Date() }]);
    setInput("");
    setIsTyping(true);
    setAutosaved(false);
    setTimeout(() => {
      setIsTyping(false);
      setMessages((p: ChatMessage[]) => [
        ...p,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: "Got it — applying your changes to the preview.",
          ts: new Date(),
        },
      ]);
      setHistory((h: string[]) => [...h.slice(0, historyIdx + 1), text]);
      setHistoryIdx((i: number) => i + 1);
      setTimeout(() => setAutosaved(true), 800);
    }, 2000);
  }

  const toolbar = [
    { icon: <RefreshCw size={12} />, label: "Refresh", onClick: () => {}, show: view === "preview" },
    { icon: <MoreHorizontal size={12} />, label: "More", onClick: () => {}, show: true },
  ];

  return (
    <div className="size-full flex flex-col overflow-hidden" style={{ fontFamily: "Outfit,sans-serif", background: "var(--background)" }}>
      {/* Top Bar */}
      <header className="flex-shrink-0 flex items-center justify-between px-5" style={{ height: 60, borderBottom: "1px solid var(--border)", background: "var(--card)" }}>
        <div className="flex items-center gap-2.5">
          <img src={logoLotus} alt="Lotus" style={{ width: 50, height: 50, objectFit: "contain" }} />
          <span style={{ fontFamily: "Fraunces,serif", fontWeight: 500, fontSize: 21, color: "var(--foreground)", letterSpacing: "-0.02em" }}>
            Lotus
          </span>
        </div>

        <div className="flex items-center gap-1 px-1.5 py-1.5 rounded-xl" style={{ background: "var(--muted)", border: "1px solid var(--border)" }}>
          {(["phone", "tablet", "desktop"] as const).map((d) => {
            const icons = { phone: <Smartphone size={12} />, tablet: <Tablet size={12} />, desktop: <Monitor size={12} /> };
            const labels = { phone: "Mobile", tablet: "Tablet", desktop: "Desktop" };
            const active = device === d;
            return (
              <motion.button
                key={d}
                onClick={() => setDevice(d)}
                whileTap={{ scale: 0.96 }}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all"
                style={{
                  background: active ? "var(--card)" : "transparent",
                  color: active ? "var(--foreground)" : "var(--muted-foreground)",
                  boxShadow: active ? "0 1px 4px rgba(0,0,0,0.08)" : "none",
                }}
              >
                {icons[d]}
                <span className="hidden sm:inline">{labels[d]}</span>
              </motion.button>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-0.5">
            <button
              onClick={() => setHistoryIdx((i: number) => Math.max(0, i - 1))}
              disabled={historyIdx === 0}
              className="p-1.5 rounded-lg transition-all hover:opacity-80"
              style={{ color: historyIdx === 0 ? "var(--muted-foreground)" : "var(--foreground)", opacity: historyIdx === 0 ? 0.4 : 1 }}
            >
              <Undo2 size={13} />
            </button>
            <button
              onClick={() => setHistoryIdx((i: number) => Math.min(history.length - 1, i + 1))}
              disabled={historyIdx === history.length - 1}
              className="p-1.5 rounded-lg transition-all hover:opacity-80"
              style={{ color: historyIdx === history.length - 1 ? "var(--muted-foreground)" : "var(--foreground)", opacity: historyIdx === history.length - 1 ? 0.4 : 1 }}
            >
              <Redo2 size={13} />
            </button>
          </div>
          <div className="h-4 w-px mx-1" style={{ background: "var(--border)" }} />
          <button
            onClick={() => setShowViewApp(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all hover:opacity-80"
            style={{ background: "var(--secondary)", color: "var(--secondary-foreground)", border: "1px solid var(--border)" }}
          >
            <Eye size={11} /> View App
          </button>
          <motion.button
            whileTap={{ scale: 0.97 }}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold"
            style={{ background: "linear-gradient(135deg,#D4A030,#B87820)", color: "#FFF8E8", boxShadow: "0 2px 12px rgba(200,146,42,0.35)" }}
          >
            <Zap size={11} /> Deploy
          </motion.button>
        </div>
      </header>

      {/* Body */}
      <div className="flex-1 flex overflow-hidden min-h-0">
        {/* Chat Sidebar */}
        <aside className="flex flex-col flex-shrink-0 overflow-hidden" style={{ width: 256, borderRight: "1px solid var(--border)", background: "var(--card)" }}>
          <div className="flex-shrink-0 flex items-center px-3 pt-3 pb-0" style={{ borderBottom: "1px solid var(--border)" }}>
            <div className="flex items-center gap-1.5 px-3 py-2 relative" style={{ color: "var(--foreground)" }}>
              <span style={{ fontSize: 12, fontWeight: 500 }}>Chat</span>
              <div className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full" style={{ background: "var(--accent)" }} />
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-3 py-3 flex flex-col" style={{ scrollbarWidth: "none" }}>
            <AnimatePresence initial={false}>
              {messages.map((msg: ChatMessage) => (
                <motion.div key={msg.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }} className={`flex mb-2.5 ${msg.role === "user" ? "justify-end" : "items-end gap-1.5"}`}>
                  {msg.role === "assistant" && <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mb-4" style={{ background: "rgba(200,146,42,0.15)" }} />}
                  <div className="flex flex-col gap-0.5 max-w-[88%]">
                    <div
                      className="px-3 py-2 leading-relaxed"
                      style={{
                        fontSize: 11.5,
                        borderRadius: msg.role === "user" ? "14px 14px 3px 14px" : "14px 14px 14px 3px",
                        background: msg.role === "user" ? "var(--primary)" : "var(--background)",
                        color: msg.role === "user" ? "var(--primary-foreground)" : "var(--foreground)",
                        boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
                      }}
                    >
                      {msg.content}
                    </div>
                    <span className={`px-1 ${msg.role === "user" ? "text-right" : ""}`} style={{ fontSize: 9, color: "var(--muted-foreground)" }}>
                      {formatTime(msg.ts)}
                    </span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {isTyping && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick actions */}
          <div className="flex-shrink-0 px-3 pb-2 flex flex-wrap gap-1" style={{ borderTop: "1px solid var(--border)", paddingTop: 8 }}>
            {QUICK_ACTIONS.map((a) => (
              <button
                key={a.label}
                onClick={() => handleSend(a.text)}
                className="px-2 py-1 rounded-lg text-left transition-all hover:opacity-80"
                style={{ background: "var(--muted)", color: "var(--muted-foreground)", fontSize: 10, fontWeight: 500 }}
              >
                {a.label}
              </button>
            ))}
          </div>

          {/* Attachments */}
          {uploadedFiles.length > 0 && (
            <div className="flex-shrink-0 flex flex-wrap gap-1.5 px-3 pb-2">
              {uploadedFiles.map((f) => (
                <div key={f.id} className="flex items-center gap-1 px-2 py-1 rounded-full" style={{ background: "rgba(200,146,42,0.1)", border: "1px solid rgba(200,146,42,0.2)" }}>
                  <span style={{ fontSize: 10, color: "var(--accent)", fontWeight: 500, maxWidth: 80, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {f.name}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Composer */}
          <div className="flex-shrink-0 px-3 pb-3">
            <div className="flex items-end gap-2 rounded-2xl px-3 py-2.5" style={{ background: "var(--background)", border: "1.5px solid var(--border)", boxShadow: "0 2px 16px rgba(0,0,0,0.06)" }}>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Describe a change, feature, screen, or function…"
                rows={2}
                className="flex-1 resize-none bg-transparent outline-none leading-relaxed"
                style={{ fontSize: 11.5, color: "var(--foreground)", fontFamily: "Outfit,sans-serif", scrollbarWidth: "none" }}
              />
              <motion.button
                whileTap={{ scale: 0.88 }}
                onClick={() => handleSend()}
                className="flex-shrink-0 w-7 h-7 rounded-xl flex items-center justify-center transition-all"
                style={{ background: input.trim() ? "linear-gradient(135deg,#D4A030,#B87820)" : "var(--muted)", color: input.trim() ? "#FFF8E8" : "var(--muted-foreground)", boxShadow: input.trim() ? "0 2px 8px rgba(200,146,42,0.3)" : "none" }}
              >
                <Send size={11} />
              </motion.button>
            </div>
            <p style={{ fontSize: 9, color: "var(--muted-foreground)", textAlign: "center", marginTop: 4 }}>
              ⏎ Send · ⇧⏎ New line
            </p>
          </div>

          {/* Hidden inputs */}
          <input ref={fileInputRef} type="file" className="hidden" accept=".pdf,.doc,.docx,.txt,.csv,.json,.zip,.js,.ts,.tsx,.css,.html" multiple onChange={(e) => addFiles(e, "file")} />
          <input ref={imageInputRef} type="file" className="hidden" accept=".png,.jpg,.jpeg,.webp,.svg" multiple onChange={(e) => addFiles(e, "image")} />
        </aside>

        {/* Main view */}
        <main className="flex-1 flex flex-col overflow-hidden" style={{ background: "var(--background)" }}>
          {/* Toolbar */}
          <div className="flex-shrink-0 flex items-center justify-between px-4 py-2" style={{ borderBottom: "1px solid var(--border)", background: "var(--card)" }}>
            <div className="flex items-center gap-1 p-1 rounded-xl" style={{ background: "var(--muted)" }}>
              {(
                [
                  ["preview", "Preview", <Eye size={11} key="eye" />],
                  ["code", "Code", <Code2 size={11} key="code" />],
                  ["deployed", "Deployed", <Zap size={11} key="zap" />],
                ] as [BuildView, string, React.ReactNode][]
              ).map(([k, l, icon]) => (
                <button
                  key={k}
                  onClick={() => setView(k as BuildView)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                  style={{
                    background: view === k ? "var(--card)" : "transparent",
                    color: view === k ? "var(--foreground)" : "var(--muted-foreground)",
                    boxShadow: view === k ? "0 1px 4px rgba(0,0,0,0.08)" : "none",
                  }}
                >
                  {icon}
                  {l}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              {view === "preview" && (
                <button
                  onClick={resetPosition}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs transition-all hover:opacity-80"
                  style={{ background: "var(--muted)", color: "var(--muted-foreground)" }}
                >
                  <RefreshCw size={10} /> Reset
                </button>
              )}
              {toolbar
                .filter((t) => t.show)
                .map((t) => (
                  <button key={t.label} onClick={t.onClick} className="p-1.5 rounded-lg transition-colors hover:opacity-70" style={{ color: "var(--muted-foreground)" }}>
                    {t.icon}
                  </button>
                ))}
            </div>
          </div>

          {/* Content */}
          {view === "preview" && <PreviewPanel device={device} dragKey={dragKey} />}
          {view === "code" && <CodePanel files={initialData.files || []} />}
          {view === "deployed" && <DeployedPanel />}

          {/* Status bar */}
          <div className="flex-shrink-0 flex items-center justify-between px-4 py-1.5" style={{ borderTop: "1px solid var(--border)", background: "var(--card)" }}>
            <div className="flex items-center gap-2 flex-wrap">
              <span style={{ fontFamily: "DM Mono,monospace", fontSize: 9, color: "var(--accent)", fontWeight: 600 }}>
                {selectedModel}
              </span>
              {[
                { count: activeConnectors, label: "Connector" },
                { count: activeSkills, label: "Skill" },
                { count: activeAgents, label: "Agent" },
                { count: activeCaps, label: "Capability" },
                { count: uploadedFiles.length, label: "File" },
              ].map((item) =>
                item.count > 0 ? (
                  <span key={item.label} style={{ fontSize: 9, color: "var(--muted-foreground)", fontFamily: "DM Mono,monospace" }}>
                    · {item.count} {item.label}
                    {item.count !== 1 ? "s" : ""}
                  </span>
                ) : null
              )}
            </div>
            <div className="flex items-center gap-1.5">
              {autosaved ? (
                <>
                  <div className="w-1.5 h-1.5 rounded-full" style={{ background: "#6BCB77" }} />
                  <span style={{ fontSize: 9, color: "var(--muted-foreground)" }}>Saved</span>
                </>
              ) : (
                <>
                  <motion.div className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--accent)" }} animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1, repeat: Infinity }} />
                  <span style={{ fontSize: 9, color: "var(--muted-foreground)" }}>Saving…</span>
                </>
              )}
              <span style={{ fontSize: 9, color: "var(--muted-foreground)", marginLeft: 6, fontFamily: "DM Mono,monospace" }}>
                {DEVICE_DIMENSIONS[device]}
              </span>
            </div>
          </div>
        </main>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showConnector && <ConnectorsPanel connectors={connectors} onToggle={toggleConnector} onClose={() => setShowConnector(false)} />}
        {showSkills && <SkillsPanel skills={skills} onToggle={toggleSkill} onClose={() => setShowSkills(false)} />}
        {showAgents && <AgentsPanel agents={agents} onToggle={toggleAgent} onClose={() => setShowAgents(false)} />}
        {showFunctions && <FunctionsPanel caps={capabilities} onToggle={toggleCap} onClose={() => setShowFunctions(false)} />}
        {showViewApp && <ViewAppMenu onClose={() => setShowViewApp(false)} />}
      </AnimatePresence>

      {(showPlus || showModel) && <div className="fixed inset-0 z-30" onClick={closeAll} />}
    </div>
  );
}
