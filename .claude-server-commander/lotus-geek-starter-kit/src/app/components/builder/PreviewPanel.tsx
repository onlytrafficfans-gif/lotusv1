import { useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { GripVertical } from "lucide-react";
import { DeviceMode } from "../../types";
import { DeviceFrame } from "../device/DeviceFrame";
import { MockPreview } from "./MockPreview";

interface PreviewPanelProps {
  device: DeviceMode;
  dragKey: number;
}

export function PreviewPanel({ device, dragKey }: PreviewPanelProps) {
  const canvasRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={canvasRef}
      className="flex-1 overflow-hidden relative"
      style={{
        backgroundImage: `radial-gradient(circle, rgba(44,34,20,0.07) 1px, transparent 1px)`,
        backgroundSize: "22px 22px",
      }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 55%, rgba(245,237,216,0.65) 100%)",
        }}
      />
      <AnimatePresence mode="wait">
        <motion.div
          key={`${device}-${dragKey}`}
          className="absolute inset-0 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            drag
            dragMomentum={false}
            dragElastic={0}
            dragConstraints={canvasRef}
            className="cursor-grab active:cursor-grabbing relative"
            initial={{ scale: 0.95, y: 12 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <div
              className="absolute -top-6 left-1/2 -translate-x-1/2 flex items-center gap-1 px-2 py-0.5 rounded-full pointer-events-none"
              style={{ background: "rgba(44,34,20,0.08)" }}
            >
              <GripVertical
                size={10}
                style={{ color: "var(--muted-foreground)" }}
              />
              <span
                style={{
                  fontSize: 9,
                  color: "var(--muted-foreground)",
                  fontWeight: 500,
                }}
              >
                Drag
              </span>
            </div>
            <DeviceFrame device={device}>
              <MockPreview device={device} />
            </DeviceFrame>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
