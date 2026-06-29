import { motion } from "motion/react";
import { CheckCircle2, ArrowRight, Download, Share2 } from "lucide-react";
import logoLotus from "@/imports/logo_lotus.png";

interface AfterScreenProps {
  onNewProject?: () => void;
}

export default function AfterScreen({ onNewProject }: AfterScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col items-center justify-center p-6 overflow-hidden">
      {/* Background gradient decoration */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-green-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-green-500/5 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-2xl"
      >
        {/* Success icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1, type: "spring", stiffness: 100 }}
          className="mb-8"
        >
          <div className="w-20 h-20 mx-auto bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg">
            <CheckCircle2 className="w-10 h-10 text-white" />
          </div>
        </motion.div>

        {/* Logo */}
        <motion.img
          src={logoLotus}
          alt="LOTUS"
          className="w-16 h-16 mx-auto mb-6 drop-shadow-lg opacity-80"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.8 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        />

        {/* Heading */}
        <h1 className="text-5xl sm:text-6xl font-bold text-white mb-4 tracking-tight">
          Project Complete!
        </h1>

        {/* Subheading */}
        <p className="text-lg sm:text-xl text-slate-300 mb-8 leading-relaxed">
          Your AI-powered application is ready to deploy.
          <br />
          All integrations, skills, and agents are configured.
        </p>

        {/* Status cards */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-12 max-w-md mx-auto"
        >
          {[
            { label: "Integrations", value: "Configured" },
            { label: "Agents", value: "Deployed" },
            { label: "Skills", value: "Active" },
            { label: "Status", value: "Ready" },
          ].map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.4 + i * 0.05 }}
              className="p-4 rounded-lg bg-slate-800/40 backdrop-blur border border-emerald-500/30"
            >
              <p className="text-sm text-slate-400 mb-1">{item.label}</p>
              <p className="text-lg font-semibold text-emerald-400">{item.value}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Action buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 justify-center mb-8"
        >
          <button className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition-all">
            <Download className="w-5 h-5" />
            Download Project
          </button>
          <button className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition-all">
            <Share2 className="w-5 h-5" />
            Share
          </button>
        </motion.div>

        {/* Primary CTA */}
        <motion.button
          onClick={onNewProject}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl"
        >
          Create Another Project
          <ArrowRight className="w-5 h-5" />
        </motion.button>

        {/* Footer text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="text-slate-400 text-sm mt-12"
        >
          Your project is securely saved and ready for production
        </motion.p>
      </motion.div>
    </div>
  );
}
