import { motion } from "motion/react";
import { ChevronRight } from "lucide-react";
import logoLotus from "@/imports/logo_lotus.png";

interface SignScreenProps {
  onContinue?: () => void;
}

export default function SignScreen({ onContinue }: SignScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col items-center justify-center p-6 overflow-hidden">
      {/* Background gradient decoration */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-2xl"
      >
        {/* Logo */}
        <motion.img
          src={logoLotus}
          alt="LOTUS"
          className="w-24 h-24 mx-auto mb-8 drop-shadow-lg"
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ duration: 3, repeat: Infinity }}
        />

        {/* Heading */}
        <h1 className="text-5xl sm:text-6xl font-bold text-white mb-4 tracking-tight">
          LOTUS App Builder
        </h1>

        {/* Subheading */}
        <p className="text-lg sm:text-xl text-slate-300 mb-8 leading-relaxed">
          Build, configure, and deploy AI-powered applications in minutes.
          <br />
          No complexity. Pure productivity.
        </p>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-6 my-12"
        >
          {[
            { icon: "⚡", title: "Lightning Fast", desc: "Deploy in seconds" },
            { icon: "🧠", title: "AI-Powered", desc: "Multi-agent support" },
            { icon: "🔧", title: "Fully Configurable", desc: "Use what you need" },
          ].map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.3 + i * 0.1 }}
              className="p-6 rounded-lg bg-slate-800/40 backdrop-blur border border-slate-700 hover:border-amber-500/50 transition"
            >
              <div className="text-3xl mb-2">{feature.icon}</div>
              <h3 className="text-white font-semibold mb-1">{feature.title}</h3>
              <p className="text-sm text-slate-400">{feature.desc}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Button */}
        <motion.button
          onClick={onContinue}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl"
        >
          Get Started
          <ChevronRight className="w-5 h-5" />
        </motion.button>

        {/* Footer text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-slate-400 text-sm mt-12"
        >
          No credit card required • Start building immediately
        </motion.p>
      </motion.div>
    </div>
  );
}
