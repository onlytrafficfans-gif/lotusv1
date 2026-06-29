import { useEffect, useState } from "react";
import { motion } from "motion/react";
import {
  formatDemoTimeRemaining,
  getDemoTimeRemaining,
} from "../../auth/demoAccess";

interface DemoTimerProps {
  onExpired?: () => void;
}

export function DemoTimer({ onExpired }: DemoTimerProps) {
  const [timeRemaining, setTimeRemaining] = useState("");
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    // Initial update
    const remaining = getDemoTimeRemaining();
    setTimeRemaining(formatDemoTimeRemaining());
    setIsExpired(remaining === 0);

    // Update timer every second
    const interval = setInterval(() => {
      const remaining = getDemoTimeRemaining();
      setTimeRemaining(formatDemoTimeRemaining());

      if (remaining === 0) {
        setIsExpired(true);
        onExpired?.();
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [onExpired]);

  if (isExpired) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-4 right-4 z-40 flex items-center gap-2 px-3 py-2 rounded-lg"
      style={{
        background: "rgba(200, 146, 42, 0.1)",
        border: "1px solid rgba(200, 146, 42, 0.2)",
        backdropFilter: "blur(10px)",
      }}
    >
      <div
        style={{
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: "#c8922a",
          animation: "pulse 2s infinite",
        }}
      />
      <span
        style={{
          fontSize: 12,
          fontWeight: 600,
          color: "#c8922a",
          fontFamily: "system-ui, monospace, sans-serif",
          letterSpacing: "0.05em",
        }}
      >
        Demo: {timeRemaining}
      </span>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </motion.div>
  );
}
