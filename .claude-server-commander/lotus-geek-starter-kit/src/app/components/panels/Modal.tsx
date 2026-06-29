import { motion } from "motion/react";
import { X } from "lucide-react";

interface ModalProps {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}

export function Modal({ title, onClose, children }: ModalProps) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div
        className="absolute inset-0"
        style={{
          background: "rgba(30,18,6,0.5)",
          backdropFilter: "blur(4px)",
        }}
        onClick={onClose}
      />
      <motion.div
        className="relative w-full max-w-lg rounded-2xl overflow-hidden flex flex-col"
        style={{
          background: "var(--card)",
          border: "1px solid var(--border)",
          maxHeight: "80vh",
          boxShadow: "0 32px 80px rgba(0,0,0,0.25)",
        }}
        initial={{ y: 24, scale: 0.97 }}
        animate={{ y: 0, scale: 1 }}
        exit={{ y: 24, scale: 0.97 }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      >
        <div
          className="flex-shrink-0 flex items-center justify-between px-5 py-4"
          style={{ borderBottom: "1px solid var(--border)" }}
        >
          <span
            style={{
              fontFamily: "Fraunces,serif",
              fontSize: 16,
              fontWeight: 500,
              color: "var(--foreground)",
            }}
          >
            {title}
          </span>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors hover:opacity-70"
            style={{ background: "var(--muted)", color: "var(--muted-foreground)" }}
          >
            <X size={13} />
          </button>
        </div>
        <div
          className="flex-1 overflow-y-auto"
          style={{ scrollbarWidth: "none" }}
        >
          {children}
        </div>
      </motion.div>
    </motion.div>
  );
}
