import { useState, useRef, useEffect } from "react";
import { motion } from "motion/react";
import { RefreshCw, Smartphone, Tablet, Monitor, X } from "lucide-react";
import { DeviceMode } from "../../types";

interface LivePhonePreviewProps {
  isVisible: boolean;
  onClose?: () => void;
}

export function LivePhonePreview({ isVisible, onClose }: LivePhonePreviewProps) {
  const [device, setDevice] = useState<DeviceMode>("phone");
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const deviceSpecs: Record<DeviceMode, { width: number; height: number; name: string }> = {
    phone: { width: 390, height: 844, name: "iPhone 15" },
    tablet: { width: 768, height: 1024, name: "iPad Pro" },
    desktop: { width: 1440, height: 900, name: "Desktop" },
  };

  const spec = deviceSpecs[device];

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
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
      onMouseDown={handleMouseDown}
    >
      {/* Glass Phone Container */}
      <div className="relative" style={{ width: spec.width + 24, height: spec.height + 24 }}>
        {/* Glass Shell */}
        <div
          className="absolute inset-0 rounded-3xl pointer-events-none"
          style={{
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 100%)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255,255,255,0.2)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.1), inset 0 1px 1px rgba(255,255,255,0.3)",
          }}
        />

        {/* Device Header */}
        <div
          className="absolute top-0 left-0 right-0 px-4 py-3 flex items-center justify-between rounded-t-3xl z-10"
          style={{ background: "rgba(0,0,0,0.05)" }}
          data-no-drag
        >
          <span style={{ fontSize: 12, fontWeight: 600, color: "#2c2216" }}>{spec.name}</span>

          <div className="flex items-center gap-2" data-no-drag>
            {/* Device Toggle */}
            <div className="flex gap-1 bg-white bg-opacity-50 rounded-lg p-1" style={{ backdropFilter: "blur(10px)" }}>
              {(Object.keys(deviceSpecs) as DeviceMode[]).map((d) => (
                <button
                  key={d}
                  onClick={() => setDevice(d)}
                  className={`p-1.5 rounded transition-all ${
                    device === d ? "bg-white shadow-sm" : "hover:bg-white hover:bg-opacity-30"
                  }`}
                  title={deviceSpecs[d].name}
                >
                  {d === "phone" && <Smartphone size={14} />}
                  {d === "tablet" && <Tablet size={14} />}
                  {d === "desktop" && <Monitor size={14} />}
                </button>
              ))}
            </div>

            {/* Refresh Button */}
            <button
              onClick={handleRefresh}
              disabled={isLoading}
              className="p-1.5 rounded hover:bg-white hover:bg-opacity-30 transition-all disabled:opacity-50"
              title="Refresh preview"
              data-no-drag
            >
              <RefreshCw size={14} className={isLoading ? "animate-spin" : ""} />
            </button>

            {/* Close Button */}
            {onClose && (
              <button
                onClick={onClose}
                className="p-1.5 rounded hover:bg-white hover:bg-opacity-30 transition-all"
                title="Close preview"
                data-no-drag
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Preview Content */}
        <div
          className="absolute rounded-b-3xl overflow-hidden"
          style={{
            top: 44,
            left: 12,
            right: 12,
            bottom: 12,
            width: spec.width,
            height: spec.height - 24,
          }}
        >
          {/* Loading State */}
          {isLoading && (
            <div
              className="absolute inset-0 flex items-center justify-center z-20 rounded-2xl"
              style={{ background: "rgba(255,255,255,0.9)", backdropFilter: "blur(5px)" }}
            >
              <div className="flex flex-col items-center gap-2">
                <RefreshCw size={20} className="animate-spin" style={{ color: "#c8922a" }} />
                <span style={{ fontSize: 12, color: "#6b5745" }}>Updating preview…</span>
              </div>
            </div>
          )}

          {/* Error State */}
          {hasError && (
            <div
              className="absolute inset-0 flex items-center justify-center z-20 rounded-2xl"
              style={{ background: "rgba(255,255,255,0.95)", backdropFilter: "blur(5px)" }}
            >
              <div className="flex flex-col items-center gap-2 px-4 text-center">
                <span style={{ fontSize: 11, color: "#c9534f", fontWeight: 500 }}>Preview could not load</span>
                <span style={{ fontSize: 10, color: "#8b7355" }}>Check build or route</span>
                <button
                  onClick={handleRefresh}
                  className="mt-2 px-3 py-1 rounded text-xs font-500 transition-all"
                  style={{
                    background: "linear-gradient(135deg, #D4A574, #A0825D)",
                    color: "#000",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.05)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
                  }}
                  data-no-drag
                >
                  Retry
                </button>
              </div>
            </div>
          )}

          {/* Live Preview IFrame */}
          <iframe
            ref={iframeRef}
            src="/"
            className="w-full h-full border-0 rounded-2xl"
            style={{
              backgroundColor: "#fff",
              display: "block",
            }}
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
