import { useState, useRef, useEffect } from "react";
import { motion } from "motion/react";
import { RefreshCw, X } from "lucide-react";

interface LivePhonePreviewProps {
  isVisible: boolean;
  onClose?: () => void;
}

export function LivePhonePreview({ isVisible, onClose }: LivePhonePreviewProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 20, y: 20 });
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const spec = { width: 390, height: 844, name: "iPhone 15" };

  const handleRefresh = () => {
    setIsLoading(true);
    setHasError(false);
    if (iframeRef.current) {
      iframeRef.current.src = iframeRef.current.src;
    }
    setTimeout(() => setIsLoading(false), 1500);
  };


  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest("[data-no-drag]")) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging, dragStart]);

  if (!isVisible) return null;

  return (
    <motion.div
      ref={containerRef}
      className="fixed z-50"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        cursor: isDragging ? "grabbing" : "grab",
      }}
      initial={{ opacity: 0, scale: 0.85, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.85, y: 20 }}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      onMouseDown={handleMouseDown}
    >
      {/* Glass Phone Container */}
      <div
        className="relative shadow-2xl"
        style={{
          width: spec.width + 24,
          height: spec.height + 24,
          borderRadius: 48,
        }}
      >
        {/* Outer Glass Shell - Premium glow */}
        <div
          className="absolute inset-0 rounded-3xl pointer-events-none"
          style={{
            background: "linear-gradient(135deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.06) 100%)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(255,255,255,0.25)",
            boxShadow: "0 20px 60px rgba(0,0,0,0.3), inset 0 2px 8px rgba(255,255,255,0.4)",
          }}
        />

        {/* Device Header - Premium dark gradient */}
        <div
          className="absolute top-0 left-0 right-0 px-4 py-3.5 flex items-center justify-between rounded-t-3xl z-10 border-b"
          style={{
            background: "linear-gradient(180deg, rgba(15,15,12,0.9) 0%, rgba(20,20,18,0.85) 100%)",
            borderBottomColor: "rgba(255,255,255,0.1)",
          }}
          data-no-drag
        >
          <span style={{ fontSize: 12, fontWeight: 600, color: "#d4a574", letterSpacing: "0.5px" }}>
            {spec.name}
          </span>


            {/* Refresh Button - Enhanced */}
            <motion.button
              onClick={handleRefresh}
              disabled={isLoading}
              className="p-2 rounded transition-all"
              style={{
                background: isLoading
                  ? "rgba(255,255,255,0.1)"
                  : "transparent",
                color: isLoading ? "#d4a574" : "#999",
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title="Refresh preview"
              data-no-drag
            >
              <RefreshCw
                size={16}
                className={isLoading ? "animate-spin" : ""}
                style={{ transition: "color 0.3s ease" }}
              />
            </motion.button>

            {/* Close Button - Enhanced */}
            {onClose && (
              <motion.button
                onClick={onClose}
                className="p-2 rounded transition-all"
                style={{ color: "#999" }}
                whileHover={{ scale: 1.05, color: "#d4a574" }}
                whileTap={{ scale: 0.95 }}
                title="Close preview"
                data-no-drag
              >
                <X size={16} />
              </motion.button>
            )}
          </div>
        </div>

        {/* Preview Content */}
        <div
          className="absolute rounded-b-3xl overflow-hidden"
          style={{
            top: 48,
            left: 12,
            right: 12,
            bottom: 12,
            width: spec.width,
            height: spec.height - 24,
            background: "#000",
          }}
        >
          {/* Loading State - Premium overlay */}
          {isLoading && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center z-20 rounded-2xl"
              style={{
                background: "linear-gradient(135deg, rgba(20,20,18,0.95) 0%, rgba(15,15,12,0.95) 100%)",
                backdropFilter: "blur(8px)",
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex flex-col items-center gap-3">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <RefreshCw size={24} style={{ color: "#d4a574" }} />
                </motion.div>
                <span style={{ fontSize: 13, color: "#d4a574", fontWeight: 500, letterSpacing: "0.3px" }}>
                  Adapting layout…
                </span>
              </div>
            </motion.div>
          )}

          {/* Error State - Premium error message */}
          {hasError && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center z-20 rounded-2xl"
              style={{
                background: "linear-gradient(135deg, rgba(20,20,18,0.98) 0%, rgba(15,15,12,0.98) 100%)",
                backdropFilter: "blur(8px)",
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex flex-col items-center gap-3 px-4 text-center">
                <div style={{ width: 48, height: 48, borderRadius: 12, background: "rgba(212,165,116,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ fontSize: 24 }}>⚠</span>
                </div>
                <span style={{ fontSize: 13, color: "#d4a574", fontWeight: 600 }}>Preview unavailable</span>
                <span style={{ fontSize: 11, color: "#999" }}>Check if the app is running</span>
                <motion.button
                  onClick={handleRefresh}
                  className="mt-3 px-4 py-2 rounded transition-all"
                  style={{
                    background: "linear-gradient(135deg, #D4A574, #A0825D)",
                    color: "#000",
                    fontSize: 12,
                    fontWeight: 600,
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  data-no-drag
                >
                  Retry
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* Live Preview IFrame */}
          <motion.iframe
            ref={iframeRef}
            src="/"
            className="w-full h-full border-0 rounded-2xl"
            style={{
              backgroundColor: "#fff",
              display: "block",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            onLoad={() => {
              setIsLoading(false);
              setHasError(false);
            }}
            onError={() => {
              setIsLoading(false);
              setHasError(true);
            }}
            title="Live app preview"
          />
        </div>
      </div>
    </motion.div>
  );
}
