import { motion } from "motion/react";
import { Sparkles } from "lucide-react";

export function TypingIndicator() {
  return (
    <div className="flex items-end gap-2 mb-3">
      <div
        className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mb-3"
        style={{ background: "rgba(200,146,42,0.15)" }}
      >
        <Sparkles size={9} className="text-accent" />
      </div>
      <div
        className="px-3 py-2.5 rounded-2xl rounded-bl-sm"
        style={{ background: "var(--card)" }}
      >
        <div className="flex gap-1 items-center h-3">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: "var(--muted-foreground)" }}
              animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.18,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
