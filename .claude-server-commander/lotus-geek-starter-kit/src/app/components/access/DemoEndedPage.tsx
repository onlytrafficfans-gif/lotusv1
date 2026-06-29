import { useState } from "react";
import logoLotus from "../../../imports/logo_lotus.png";

interface DemoEndedPageProps {
  onClose?: () => void;
}

export function DemoEndedPage({ onClose }: DemoEndedPageProps) {
  const [showWaitlist, setShowWaitlist] = useState(false);

  const handleJoinWaitlist = () => {
    setShowWaitlist(true);
  };

  const handleExit = () => {
    if (onClose) {
      onClose();
    } else {
      window.close();
    }
  };

  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        background: "#000",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px",
        margin: 0,
        textAlign: "center",
        fontFamily: "system-ui, -apple-system, Segoe UI, sans-serif",
        color: "#fff",
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 9997,
      }}
    >
      {/* Logo */}
      <img
        src={logoLotus}
        alt="Lotus Logo"
        style={{
          maxWidth: "300px",
          maxHeight: "300px",
          objectFit: "contain",
          marginBottom: "60px",
          width: "auto",
          height: "auto",
        }}
      />

      {/* Heading */}
      <h1
        style={{
          fontSize: 48,
          fontWeight: 600,
          margin: "0 0 24px 0",
          letterSpacing: "-0.5px",
          fontFamily: "Merriweather",
          color: "#fff",
        }}
      >
        Thank You for Exploring Lotus
      </h1>

      {/* Body Text */}
      <p
        style={{
          fontSize: 18,
          lineHeight: 1.6,
          margin: "0 0 24px 0",
          maxWidth: 600,
          color: "#ccc",
          fontFamily: "Courier New",
        }}
      >
        Lotus is just getting started. New AI models, powerful connectors, advanced deployment tools, and premium capabilities will continue to expand the platform over time.
      </p>

      <p
        style={{
          fontSize: 18,
          lineHeight: 1.6,
          margin: "0 0 24px 0",
          maxWidth: 600,
          color: "#ccc",
          fontFamily: "Courier New",
        }}
      >
        Your preview session has ended.
      </p>

      <p
        style={{
          fontSize: 18,
          lineHeight: 1.6,
          margin: "0 0 60px 0",
          maxWidth: 600,
          color: "#ccc",
          fontFamily: "Courier New",
        }}
      >
        Thank you for being part of the journey.
      </p>

      {/* Buttons */}
      {!showWaitlist ? (
        <div style={{ display: "flex", gap: "24px", justifyContent: "center", flexWrap: "wrap" }}>
          <button
            onClick={handleJoinWaitlist}
            style={{
              padding: "16px 48px",
              background: "#d4af37",
              color: "#000",
              border: "none",
              borderRadius: 8,
              fontSize: 16,
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "#e5c158";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "#d4af37";
            }}
          >
            Join the Waitlist
          </button>
          <button
            onClick={handleExit}
            style={{
              padding: "16px 48px",
              background: "transparent",
              color: "#d4af37",
              border: "2px solid #d4af37",
              borderRadius: 8,
              fontSize: 16,
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "rgba(212, 175, 55, 0.1)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "transparent";
            }}
          >
            Exit
          </button>
        </div>
      ) : (
        <div
          style={{
            textAlign: "center",
            maxWidth: 500,
          }}
        >
          <p
            style={{
              fontSize: 18,
              color: "#d4af37",
              fontFamily: "Courier New",
              marginBottom: 30,
            }}
          >
            ✓ Thank you! You've been added to the waitlist.
          </p>
          <button
            onClick={handleExit}
            style={{
              padding: "16px 48px",
              background: "transparent",
              color: "#d4af37",
              border: "2px solid #d4af37",
              borderRadius: 8,
              fontSize: 16,
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "rgba(212, 175, 55, 0.1)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "transparent";
            }}
          >
            Exit
          </button>
        </div>
      )}
    </div>
  );
}
