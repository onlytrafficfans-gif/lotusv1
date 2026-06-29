import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Download, X, Smartphone, Monitor } from "lucide-react";

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOSPWA, setIsIOSPWA] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [dismissCount, setDismissCount] = useState(0);

  useEffect(() => {
    // Check if app is already installed
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
      return;
    }

    // Detect device type
    const mobile = /iPhone|iPad|iPod|Android|Mobile/.test(navigator.userAgent);
    setIsMobile(mobile);

    // Detect iOS PWA capability
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    if (isIOS) {
      setIsIOSPWA(true);
    }

    // Load dismiss count from storage
    const stored = localStorage.getItem("lotus_install_dismiss_count");
    const count = stored ? parseInt(stored) : 0;
    setDismissCount(count);

    // Show prompt after user engagement (2 seconds for first time)
    let timeoutId: NodeJS.Timeout;

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);

      // Show after brief delay for better UX
      timeoutId = setTimeout(() => {
        // Only show if dismissed less than 3 times
        if (count < 3) {
          setShowPrompt(true);
        }
      }, 2000);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // Listen for app installed event
    const handleAppInstalled = () => {
      setShowPrompt(false);
      setIsInstalled(true);
      setDeferredPrompt(null);
      localStorage.removeItem("lotus_install_dismiss_count");
    };

    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, [dismissCount]);

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
    // Track dismissals - show again after 3 dismissals
    const newCount = dismissCount + 1;
    setDismissCount(newCount);
    localStorage.setItem("lotus_install_dismiss_count", newCount.toString());
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
          className="fixed inset-0 z-40 flex items-end"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleDismiss}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

          {/* Prompt Card */}
          <motion.div
            className="relative w-full mx-4 mb-8 rounded-3xl overflow-hidden"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="p-6"
              style={{
                background: "linear-gradient(135deg, rgba(0,0,0,0.98) 0%, rgba(15,15,12,0.95) 100%)",
                boxShadow: "0 25px 80px rgba(0,0,0,0.6), inset 0 1px 1px rgba(212,165,116,0.2)",
                border: "1px solid rgba(212,165,116,0.2)",
              }}
            >
              {/* Header with close */}
              <div className="flex items-start justify-between gap-4 mb-5">
                <motion.div
                  className="p-3 rounded-2xl"
                  style={{ background: "rgba(212,165,116,0.15)" }}
                  animate={{ scale: [1, 1.08, 1] }}
                  transition={{ duration: 2.5, repeat: Infinity }}
                >
                  <Smartphone size={24} style={{ color: "#d4a574" }} />
                </motion.div>
                <button
                  onClick={handleDismiss}
                  className="p-2 rounded-full transition-all"
                  style={{ background: "rgba(255,255,255,0.05)" }}
                >
                  <X size={20} style={{ color: "#666" }} />
                </button>
              </div>

              {/* Content */}
              <div className="mb-5">
                <h2 style={{ fontSize: 18, fontWeight: 700, color: "#fff", marginBottom: 8 }}>
                  Get Lotus App on Your iPhone
                </h2>
                <p style={{ fontSize: 13, color: "#aaa", lineHeight: 1.6, marginBottom: 12 }}>
                  Install Lotus as an app to unlock the full experience — offline access, home screen shortcut, and notifications.
                </p>

                {/* Steps */}
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <div
                      className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-sm font-600"
                      style={{ background: "rgba(212,165,116,0.2)", color: "#d4a574" }}
                    >
                      1
                    </div>
                    <p style={{ fontSize: 12, color: "#999", marginTop: 2 }}>
                      Tap the <strong>Share</strong> button at the bottom
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <div
                      className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-sm font-600"
                      style={{ background: "rgba(212,165,116,0.2)", color: "#d4a574" }}
                    >
                      2
                    </div>
                    <p style={{ fontSize: 12, color: "#999", marginTop: 2 }}>
                      Select <strong>Add to Home Screen</strong>
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <div
                      className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-sm font-600"
                      style={{ background: "rgba(212,165,116,0.2)", color: "#d4a574" }}
                    >
                      3
                    </div>
                    <p style={{ fontSize: 12, color: "#999", marginTop: 2 }}>
                      Customize the name and tap <strong>Add</strong>
                    </p>
                  </div>
                </div>
              </div>

              {/* Button */}
              <motion.button
                onClick={handleDismiss}
                className="w-full py-3 rounded-xl font-600 text-sm transition-all"
                style={{
                  background: "linear-gradient(135deg, #D4A574, #A0825D)",
                  color: "#000",
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Got It
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  }

  // Show Android/Desktop install prompt
  if (deferredPrompt && showPrompt) {
    const deviceType = isMobile ? "Mobile" : "Desktop";
    const Icon = isMobile ? Smartphone : Monitor;

    return (
      <AnimatePresence>
        {/* Backdrop for mobile/prominent display */}
        {isMobile && (
          <motion.div
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleDismiss}
          />
        )}

        <motion.div
          className={isMobile ? "fixed inset-0 z-40 flex items-end p-4" : "fixed bottom-8 right-8 z-40 max-w-sm"}
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          onClick={isMobile ? (e) => e.stopPropagation() : undefined}
        >
          <div
            className={isMobile ? "w-full" : ""}
            style={{
              background: "linear-gradient(135deg, rgba(0,0,0,0.98) 0%, rgba(15,15,12,0.95) 100%)",
              borderRadius: isMobile ? "28px" : "20px",
              border: "1px solid rgba(212,165,116,0.25)",
              boxShadow: isMobile
                ? "0 25px 80px rgba(0,0,0,0.6), inset 0 1px 1px rgba(212,165,116,0.2)"
                : "0 20px 60px rgba(0,0,0,0.5), inset 0 1px 1px rgba(212,165,116,0.15)",
              padding: isMobile ? 24 : 20,
            }}
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-4 mb-5">
              <motion.div
                className="p-3 rounded-2xl flex-shrink-0"
                style={{ background: "rgba(212,165,116,0.15)" }}
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2.5, repeat: Infinity }}
              >
                <Icon size={isMobile ? 28 : 24} style={{ color: "#d4a574" }} />
              </motion.div>
              <button
                onClick={handleDismiss}
                className="p-2 rounded-full transition-all flex-shrink-0"
                style={{ background: "rgba(255,255,255,0.05)" }}
              >
                <X size={20} style={{ color: "#666" }} />
              </button>
            </div>

            {/* Content */}
            <div className="mb-6">
              <h2 style={{ fontSize: isMobile ? 20 : 16, fontWeight: 700, color: "#fff", marginBottom: 8 }}>
                Install Lotus {deviceType}
              </h2>
              <p style={{ fontSize: isMobile ? 14 : 13, color: "#aaa", lineHeight: 1.6 }}>
                Get the full-featured app experience with {isMobile ? "offline access, notifications" : "seamless desktop integration"}
                , and fast loading times.
              </p>
            </div>

            {/* Benefits (for mobile) */}
            {isMobile && (
              <div className="space-y-2 mb-6">
                <div className="flex gap-2 items-center">
                  <div style={{ width: 4, height: 4, borderRadius: 2, background: "#d4a574" }} />
                  <p style={{ fontSize: 12, color: "#999" }}>Quick access from home screen</p>
                </div>
                <div className="flex gap-2 items-center">
                  <div style={{ width: 4, height: 4, borderRadius: 2, background: "#d4a574" }} />
                  <p style={{ fontSize: 12, color: "#999" }}>Works offline</p>
                </div>
                <div className="flex gap-2 items-center">
                  <div style={{ width: 4, height: 4, borderRadius: 2, background: "#d4a574" }} />
                  <p style={{ fontSize: 12, color: "#999" }}>Zero ads, just the app</p>
                </div>
              </div>
            )}

            {/* Buttons */}
            <div className="flex gap-3">
              <motion.button
                onClick={handleInstall}
                className="flex-1 py-3 px-4 rounded-xl font-600 text-sm transition-all"
                style={{
                  background: "linear-gradient(135deg, #D4A574, #A0825D)",
                  color: "#000",
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Install Now
              </motion.button>
              <motion.button
                onClick={handleDismiss}
                className="py-3 px-4 rounded-xl font-600 text-sm transition-all"
                style={{
                  background: "rgba(255,255,255,0.08)",
                  color: "#999",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
                whileHover={{ scale: 1.02, color: "#d4a574" }}
                whileTap={{ scale: 0.98 }}
              >
                {dismissCount >= 2 ? "Never" : "Later"}
              </motion.button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    );
  }

  return null;
}
