import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Download, X } from "lucide-react";

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOSPWA, setIsIOSPWA] = useState(false);

  useEffect(() => {
    // Check if app is already installed
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
      return;
    }

    // Detect iOS PWA capability
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    if (isIOS) {
      setIsIOSPWA(true);
    }

    // Listen for beforeinstallprompt event (Chrome, Edge, Opera, Samsung)
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // Listen for app installed event
    const handleAppInstalled = () => {
      setShowPrompt(false);
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      setShowPrompt(false);
      setIsInstalled(true);
    }

    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
  };

  // Don't show if already installed
  if (isInstalled) {
    return null;
  }

  // Show iOS PWA instructions
  if (isIOSPWA && showPrompt) {
    return (
      <AnimatePresence>
        <motion.div
          className="fixed bottom-8 left-8 right-8 z-40 max-w-md mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
        >
          <div
            className="rounded-2xl p-4 backdrop-blur-xl border"
            style={{
              background: "linear-gradient(135deg, rgba(0,0,0,0.9) 0%, rgba(15,15,12,0.9) 100%)",
              borderColor: "rgba(212,165,116,0.3)",
              boxShadow: "0 20px 60px rgba(0,0,0,0.4), inset 0 1px 1px rgba(255,255,255,0.1)",
            }}
          >
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex items-start gap-3 flex-1">
                <div
                  className="mt-1 p-2 rounded-lg"
                  style={{ background: "rgba(212,165,116,0.15)" }}
                >
                  <Download size={18} style={{ color: "#d4a574" }} />
                </div>
                <div className="flex-1">
                  <h3 style={{ fontSize: 14, fontWeight: 600, color: "#fff", marginBottom: 4 }}>
                    Get Lotus on iOS
                  </h3>
                  <p style={{ fontSize: 12, color: "#999", lineHeight: 1.5 }}>
                    Tap <strong>Share</strong> → <strong>Add to Home Screen</strong>
                  </p>
                </div>
              </div>
              <button
                onClick={handleDismiss}
                className="p-1 rounded-lg transition-all"
                style={{ color: "#666" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#d4a574")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#666")}
              >
                <X size={16} />
              </button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    );
  }

  // Show Android/Desktop install prompt
  if (deferredPrompt && showPrompt) {
    return (
      <AnimatePresence>
        <motion.div
          className="fixed bottom-8 left-8 right-8 z-40 max-w-md mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
        >
          <div
            className="rounded-2xl p-5 backdrop-blur-xl border overflow-hidden"
            style={{
              background: "linear-gradient(135deg, rgba(0,0,0,0.95) 0%, rgba(15,15,12,0.95) 100%)",
              borderColor: "rgba(212,165,116,0.3)",
              boxShadow: "0 20px 60px rgba(0,0,0,0.4), inset 0 1px 1px rgba(255,255,255,0.1)",
            }}
          >
            {/* Glow accent */}
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
              style={{
                background: "radial-gradient(circle at top right, rgba(212,165,116,0.1), transparent 50%)",
              }}
            />

            <div className="relative">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex items-start gap-3 flex-1">
                  <motion.div
                    className="mt-1 p-2 rounded-lg"
                    style={{ background: "rgba(212,165,116,0.15)" }}
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Download size={20} style={{ color: "#d4a574" }} />
                  </motion.div>
                  <div className="flex-1">
                    <h3 style={{ fontSize: 15, fontWeight: 600, color: "#fff", marginBottom: 2 }}>
                      Install Lotus
                    </h3>
                    <p style={{ fontSize: 12, color: "#999" }}>
                      Get the app on your device for the best experience
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleDismiss}
                  className="p-1 rounded-lg transition-all"
                  style={{ color: "#666" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#d4a574")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "#666")}
                >
                  <X size={18} />
                </button>
              </div>

              <div className="flex gap-2">
                <motion.button
                  onClick={handleInstall}
                  className="flex-1 py-2.5 px-3 rounded-lg font-600 text-sm transition-all"
                  style={{
                    background: "linear-gradient(135deg, #D4A574, #A0825D)",
                    color: "#000",
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Install
                </motion.button>
                <motion.button
                  onClick={handleDismiss}
                  className="py-2.5 px-3 rounded-lg font-500 text-sm transition-all"
                  style={{
                    background: "rgba(255,255,255,0.08)",
                    color: "#999",
                    border: "1px solid rgba(255,255,255,0.1)",
                  }}
                  whileHover={{ scale: 1.02, color: "#d4a574" }}
                  whileTap={{ scale: 0.98 }}
                >
                  Later
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    );
  }

  return null;
}
