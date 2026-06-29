import { createRoot } from "react-dom/client";
import { useState, useEffect } from "react";
import App from "./app/App.tsx";
import { SplashScreen } from "./app/components/access/SplashScreen";
import { DemoAccessGate } from "./app/components/access/DemoAccessGate";
import { DemoTimer } from "./app/components/access/DemoTimer";
import { DemoEndedPage } from "./app/components/access/DemoEndedPage";
import { PWAInstallPrompt } from "./app/components/pwa/PWAInstallPrompt";
import { getDemoSession, clearDemoAccess } from "./app/auth/demoAccess";
import "./styles/index.css";

// Register service worker for PWA support
if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/sw.js")
    .then((registration) => {
      console.log("Service Worker registered:", registration);
    })
    .catch((error) => {
      console.warn("Service Worker registration failed:", error);
    });
}

function AppWithAccess() {
  const [stage, setStage] = useState<"splash" | "access-gate" | "app" | "ended">("splash");
  const [previewDevice, setPreviewDevice] = useState<"phone" | "tablet" | "desktop">("phone");

  useEffect(() => {
    // Detect preview device from URL params
    const params = new URLSearchParams(window.location.search);
    const device = params.get("preview-device") as "phone" | "tablet" | "desktop" | null;
    if (device && ["phone", "tablet", "desktop"].includes(device)) {
      setPreviewDevice(device);
    }
  }, []);

  useEffect(() => {
    // Check if user already has a valid demo session
    const session = getDemoSession();
    if (session) {
      setStage("app");
    } else {
      // Start with splash screen
      const timer = setTimeout(() => setStage("access-gate"), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccessGranted = (_email: string) => {
    setStage("app");
  };

  const handleDemoExpired = () => {
    setStage("ended");
  };

  const handleCloseEnded = () => {
    clearDemoAccess();
    setStage("access-gate");
  };

  if (stage === "splash") {
    return <SplashScreen />;
  }

  if (stage === "access-gate") {
    return <DemoAccessGate onAccessGranted={handleAccessGranted} />;
  }

  if (stage === "ended") {
    return <DemoEndedPage onClose={handleCloseEnded} />;
  }

  // Main app with timer
  return (
    <div data-preview-device={previewDevice} className={`preview-mode-${previewDevice}`}>
      <PWAInstallPrompt />
      <DemoTimer onExpired={handleDemoExpired} />
      <App />
    </div>
  );
}

createRoot(document.getElementById("root")!).render(<AppWithAccess />);
