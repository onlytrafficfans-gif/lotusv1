import { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
  Sparkles,
  Zap,
  Check,
  ChevronRight,
  Settings,
  RotateCcw,
  Copy,
  Play,
  Plus,
  X,
} from "lucide-react";
import logoLotus from "@/imports/logo_lotus.png";

interface CustomWorkflowProps {
  onComplete?: () => void;
}

type WorkflowStep = "welcome" | "configure" | "execute" | "results";

interface WorkflowConfig {
  name: string;
  description: string;
  connectors: string[];
  skills: string[];
  agents: string[];
  capabilities: string[];
}

const CONNECTOR_OPTIONS = [
  { id: "sup", name: "Supabase", desc: "Postgres database & auth" },
  { id: "fir", name: "Firebase", desc: "Realtime DB & hosting" },
  { id: "git", name: "GitHub", desc: "Source control & CI" },
  { id: "ver", name: "Vercel", desc: "Deploy & edge functions" },
  { id: "str", name: "Stripe", desc: "Payments & subscriptions" },
  { id: "oar", name: "OpenRouter", desc: "Multi-model API gateway" },
];

const SKILL_OPTIONS = [
  { id: "uip", name: "UI Polish", desc: "Refine spacing, type, color" },
  { id: "lpb", name: "Landing Page Builder", desc: "Generate marketing pages" },
  { id: "aus", name: "Auth Setup", desc: "Adds auth flows" },
  { id: "seo", name: "SEO Setup", desc: "Meta tags & sitemaps" },
];

const AGENT_OPTIONS = [
  { id: "pa", name: "Product Architect", desc: "Shapes features & flows" },
  { id: "uid", name: "UI Designer", desc: "Visual polish & layout" },
  { id: "be", name: "Backend Engineer", desc: "API & server logic" },
  { id: "db", name: "Database Planner", desc: "Schema & indexing" },
];

export default function CustomWorkflow({ onComplete }: CustomWorkflowProps) {
  const [step, setStep] = useState<WorkflowStep>("welcome");
  const [config, setConfig] = useState<WorkflowConfig>({
    name: "My LOTUS App",
    description: "An AI-powered web application",
    connectors: [],
    skills: ["aus"],
    agents: ["pa", "uid"],
    capabilities: [],
  });
  const [executing, setExecuting] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleAddConnector = (id: string) => {
    setConfig((prev) => ({
      ...prev,
      connectors: prev.connectors.includes(id)
        ? prev.connectors.filter((c) => c !== id)
        : [...prev.connectors, id],
    }));
  };

  const handleAddSkill = (id: string) => {
    setConfig((prev) => ({
      ...prev,
      skills: prev.skills.includes(id)
        ? prev.skills.filter((s) => s !== id)
        : [...prev.skills, id],
    }));
  };

  const handleAddAgent = (id: string) => {
    setConfig((prev) => ({
      ...prev,
      agents: prev.agents.includes(id)
        ? prev.agents.filter((a) => a !== id)
        : [...prev.agents, id],
    }));
  };

  const handleExecute = async () => {
    setExecuting(true);
    setStep("execute");

    // Simulate workflow execution
    for (let i = 0; i <= 100; i += 10) {
      await new Promise((resolve) => setTimeout(resolve, 200));
      setProgress(i);
    }

    setStep("results");
    setExecuting(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col items-center justify-center p-6">
      {/* Background gradient decoration */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl"
      >
        {/* Header */}
        <div className="text-center mb-12">
          <motion.img
            src={logoLotus}
            alt="LOTUS"
            className="w-16 h-16 mx-auto mb-6 drop-shadow-lg"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
          <h1 className="text-4xl font-bold text-white mb-2">LOTUS App Builder</h1>
          <p className="text-slate-400">Configure your AI-powered application</p>
        </div>

        {/* Welcome Step */}
        {step === "welcome" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-8"
          >
            <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg p-8">
              <h2 className="text-2xl font-semibold text-white mb-4">Welcome</h2>
              <p className="text-slate-300 mb-6">
                Let's build your application. Start by configuring your project name and
                selecting the integrations, skills, and agents you need.
              </p>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-2">
                    Project Name
                  </label>
                  <input
                    type="text"
                    value={config.name}
                    onChange={(e) =>
                      setConfig((prev) => ({ ...prev, name: e.target.value }))
                    }
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded text-white placeholder-slate-400 focus:border-amber-500 focus:outline-none"
                    placeholder="My LOTUS App"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-2">
                    Description
                  </label>
                  <textarea
                    value={config.description}
                    onChange={(e) =>
                      setConfig((prev) => ({ ...prev, description: e.target.value }))
                    }
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded text-white placeholder-slate-400 focus:border-amber-500 focus:outline-none"
                    placeholder="What's your app about?"
                    rows={3}
                  />
                </div>
              </div>
            </div>

            <motion.button
              onClick={() => setStep("configure")}
              className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Continue <ChevronRight className="w-5 h-5" />
            </motion.button>
          </motion.div>
        )}

        {/* Configure Step */}
        {step === "configure" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-8 max-h-96 overflow-y-auto pr-2"
          >
            {/* Connectors */}
            <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" />
                Integrations
              </h3>
              <div className="grid grid-cols-1 gap-2">
                {CONNECTOR_OPTIONS.map((connector) => (
                  <button
                    key={connector.id}
                    onClick={() => handleAddConnector(connector.id)}
                    className={`p-3 rounded border-2 text-left transition ${
                      config.connectors.includes(connector.id)
                        ? "bg-amber-500/20 border-amber-500"
                        : "bg-slate-700/50 border-slate-600 hover:border-slate-500"
                    }`}
                  >
                    <div className="font-medium text-white">{connector.name}</div>
                    <div className="text-sm text-slate-400">{connector.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Skills */}
            <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-500" />
                Skills
              </h3>
              <div className="grid grid-cols-1 gap-2">
                {SKILL_OPTIONS.map((skill) => (
                  <button
                    key={skill.id}
                    onClick={() => handleAddSkill(skill.id)}
                    className={`p-3 rounded border-2 text-left transition ${
                      config.skills.includes(skill.id)
                        ? "bg-amber-500/20 border-amber-500"
                        : "bg-slate-700/50 border-slate-600 hover:border-slate-500"
                    }`}
                  >
                    <div className="font-medium text-white">{skill.name}</div>
                    <div className="text-sm text-slate-400">{skill.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Agents */}
            <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Settings className="w-5 h-5 text-amber-500" />
                Agents
              </h3>
              <div className="grid grid-cols-1 gap-2">
                {AGENT_OPTIONS.map((agent) => (
                  <button
                    key={agent.id}
                    onClick={() => handleAddAgent(agent.id)}
                    className={`p-3 rounded border-2 text-left transition ${
                      config.agents.includes(agent.id)
                        ? "bg-amber-500/20 border-amber-500"
                        : "bg-slate-700/50 border-slate-600 hover:border-slate-500"
                    }`}
                  >
                    <div className="font-medium text-white">{agent.name}</div>
                    <div className="text-sm text-slate-400">{agent.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-4 sticky bottom-0 bg-gradient-to-t from-slate-900 to-transparent pt-4">
              <motion.button
                onClick={() => setStep("welcome")}
                className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-semibold py-3 px-6 rounded-lg transition"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Back
              </motion.button>
              <motion.button
                onClick={handleExecute}
                className="flex-1 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Build <Play className="w-5 h-5" />
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* Execute Step */}
        {step === "execute" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-8"
          >
            <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg p-8 text-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-16 h-16 mx-auto mb-6 border-4 border-amber-500/20 border-t-amber-500 rounded-full"
              />
              <h2 className="text-2xl font-semibold text-white mb-4">Building your app...</h2>
              <p className="text-slate-400 mb-6">
                Configuring {config.agents.length} agents and {config.connectors.length} integrations
              </p>

              <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
                <motion.div
                  className="bg-gradient-to-r from-amber-500 to-amber-400 h-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              <p className="text-slate-400 text-sm mt-2">{progress}%</p>
            </div>
          </motion.div>
        )}

        {/* Results Step */}
        {step === "results" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-8"
          >
            <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg p-8">
              <div className="flex items-center justify-center mb-6">
                <motion.div
                  animate={{ scale: [0.8, 1.2, 1] }}
                  transition={{ duration: 0.6 }}
                  className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center"
                >
                  <Check className="w-8 h-8 text-white" />
                </motion.div>
              </div>

              <h2 className="text-2xl font-semibold text-white text-center mb-2">
                {config.name} Created
              </h2>
              <p className="text-slate-400 text-center mb-8">{config.description}</p>

              <div className="space-y-4">
                {config.connectors.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-slate-300 mb-2">Integrations</p>
                    <div className="flex flex-wrap gap-2">
                      {config.connectors.map((id) => {
                        const connector = CONNECTOR_OPTIONS.find((c) => c.id === id);
                        return (
                          <span
                            key={id}
                            className="px-3 py-1 bg-amber-500/20 text-amber-300 text-sm rounded"
                          >
                            {connector?.name}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                )}

                {config.skills.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-slate-300 mb-2">Skills</p>
                    <div className="flex flex-wrap gap-2">
                      {config.skills.map((id) => {
                        const skill = SKILL_OPTIONS.find((s) => s.id === id);
                        return (
                          <span
                            key={id}
                            className="px-3 py-1 bg-blue-500/20 text-blue-300 text-sm rounded"
                          >
                            {skill?.name}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                )}

                {config.agents.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-slate-300 mb-2">Agents</p>
                    <div className="flex flex-wrap gap-2">
                      {config.agents.map((id) => {
                        const agent = AGENT_OPTIONS.find((a) => a.id === id);
                        return (
                          <span
                            key={id}
                            className="px-3 py-1 bg-purple-500/20 text-purple-300 text-sm rounded"
                          >
                            {agent?.name}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <motion.button
              onClick={onComplete}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-3 px-6 rounded-lg transition"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Continue to Deployment
            </motion.button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
