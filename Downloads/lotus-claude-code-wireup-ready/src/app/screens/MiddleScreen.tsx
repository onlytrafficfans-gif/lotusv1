import logoLotus from "@/imports/logo_lotus.png";

interface MiddleScreenProps {
  onComplete?: () => void;
}

/**
 * LOTUS WORKSTATION - Main Application
 *
 * This is your workstation template. Replace the entire component
 * with your custom workflow/application.
 *
 * The only requirement is that the component accepts:
 * - onComplete?: () => void (optional callback when done)
 */
export default function MiddleScreen({ onComplete }: MiddleScreenProps) {
  return (
    <div
      className="size-full flex flex-col"
      style={{
        fontFamily: "Outfit, sans-serif",
        background: "linear-gradient(135deg, #0A0A0A 0%, #1A1514 100%)",
      }}
    >
      {/* Header */}
      <header
        className="flex-shrink-0 flex items-center justify-between px-8"
        style={{
          height: 64,
          borderBottom: "1px solid rgba(255,255,255,0.05)",
          background: "rgba(0,0,0,0.3)",
        }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3">
          <img
            src={logoLotus}
            alt="Lotus"
            style={{ width: 40, height: 40, objectFit: "contain" }}
          />
          <span
            style={{
              fontFamily: "Fraunces, serif",
              fontSize: 20,
              fontWeight: 600,
              color: "#FFF8E8",
              letterSpacing: "-0.02em",
            }}
          >
            Lotus Workstation
          </span>
        </div>

        {/* Right side - optional controls */}
        <div className="flex items-center gap-4">
          <button
            onClick={onComplete}
            style={{
              background: "rgba(212, 160, 48, 0.15)",
              color: "#D4A574",
              border: "1px solid rgba(212, 160, 48, 0.3)",
              padding: "8px 16px",
              borderRadius: 8,
              fontSize: 12,
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.2s",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = "rgba(212, 160, 48, 0.25)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = "rgba(212, 160, 48, 0.15)";
            }}
          >
            Done
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 overflow-auto" style={{ background: "#0A0A0A" }}>
        <div
          className="size-full flex items-center justify-center p-8"
          style={{
            textAlign: "center",
          }}
        >
          <div>
            <h1
              style={{
                fontSize: 32,
                fontWeight: 600,
                color: "#D4A574",
                margin: "0 0 16px",
                fontFamily: "Fraunces, serif",
              }}
            >
              Your Workstation
            </h1>
            <p
              style={{
                fontSize: 14,
                color: "#AAA",
                margin: "0 0 24px",
                maxWidth: 500,
                lineHeight: 1.6,
              }}
            >
              Replace this entire component with your custom workflow. Keep the
              MiddleScreenProps interface if you want the onComplete callback.
            </p>
            <p
              style={{
                fontSize: 12,
                color: "#666",
                margin: 0,
              }}
            >
              File: src/app/screens/MiddleScreen.tsx
            </p>
          </div>
        </div>
      </div>

      {/* Status Bar */}
      <footer
        style={{
          flexShrink: 0,
          padding: "12px 16px",
          borderTop: "1px solid rgba(255,255,255,0.05)",
          background: "rgba(0,0,0,0.3)",
          fontSize: 11,
          color: "#666",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span>Ready</span>
        <span style={{ color: "#D4A574" }}>Lotus Workstation v1.0</span>
      </footer>
    </div>
  );
}
