import React, { useState } from "react";
import { motion } from "motion/react";
import { submitEarlyAccessEmail } from "../../adapters/earlyAccessAdapter";
import logoLotus from "../../../imports/logo_lotus.png";

interface DemoEndedPageProps {
  onClose?: () => void;
}

export function DemoEndedPage({ onClose }: DemoEndedPageProps) {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [message, setMessage] = useState("");
  const [isDuplicate, setIsDuplicate] = useState(false);

  const validateEmail = (value: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim() || !validateEmail(email)) {
      setMessage("Please enter a valid email address");
      return;
    }

    setIsLoading(true);

    const result = await submitEarlyAccessEmail(email);
    setMessage(result.message);
    setIsDuplicate(result.duplicate || false);
    setSubmitted(true);
    setIsLoading(false);
  };

  return (
    <div
      className="w-screen h-screen flex items-center justify-center overflow-hidden"
      style={{
        background: "#1a1a1a",
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 9997,
      }}
    >
      {/* Animated background gradient */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)",
        }}
      />

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 flex flex-col items-center gap-6 px-4 max-w-md w-full text-center"
      >
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <img
            src={logoLotus}
            alt="Lotus"
            style={{
              width: 60,
              height: 60,
              objectFit: "contain",
              filter: "brightness(1.1)",
            }}
          />
        </motion.div>

        {/* Title */}
        <h1
          style={{
            fontFamily: "Fraunces, serif",
            fontSize: 32,
            fontWeight: 500,
            color: "#f5ede8",
            letterSpacing: "-0.02em",
            margin: 0,
            marginBottom: 4,
          }}
        >
          Thank You for Exploring Lotus
        </h1>

        {/* Subtitle */}
        <p
          style={{
            fontSize: 14,
            color: "#c9b8ac",
            fontFamily: "system-ui, sans-serif",
            margin: 0,
            marginBottom: 20,
            lineHeight: 1.6,
          }}
        >
          Your preview session has ended.
        </p>

        {/* Body text */}
        <div
          style={{
            fontSize: 13,
            color: "#b0a093",
            fontFamily: "system-ui, sans-serif",
            lineHeight: 1.8,
            marginBottom: 24,
          }}
        >
          <p style={{ margin: "0 0 12px 0" }}>
            Lotus is continuing to expand with new AI models, powerful connectors,
            deployment tools, collaboration features, and premium capabilities.
          </p>
          <p style={{ margin: 0 }}>
            Enter your email below to request early access and receive launch updates.
          </p>
        </div>

        {/* Form */}
        {!submitted ? (
          <form onSubmit={handleSubmit} className="w-full">
            <div className="mb-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                disabled={isLoading}
                style={{
                  width: "100%",
                  padding: "11px 13px",
                  border: "1px solid #3a3a3a",
                  borderRadius: 6,
                  fontSize: 13,
                  fontFamily: "system-ui, sans-serif",
                  background: "#242424",
                  color: "#f5ede8",
                  outline: "none",
                  transition: "all 200ms",
                  boxSizing: "border-box",
                }}
              />
            </div>

            <motion.button
              type="submit"
              disabled={isLoading}
              whileTap={{ scale: 0.98 }}
              style={{
                width: "100%",
                padding: "11px 16px",
                background: "#c8922a",
                color: "#f5ede8",
                border: "none",
                borderRadius: 6,
                fontSize: 13,
                fontWeight: 600,
                fontFamily: "system-ui, sans-serif",
                cursor: isLoading ? "default" : "pointer",
                opacity: isLoading ? 0.7 : 1,
                transition: "all 200ms",
              }}
            >
              {isLoading ? "Submitting..." : "Request Early Access"}
            </motion.button>
          </form>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full"
          >
            <div
              style={{
                padding: 16,
                background: isDuplicate
                  ? "rgba(201, 83, 79, 0.1)"
                  : "rgba(107, 203, 119, 0.1)",
                border: `1px solid ${isDuplicate ? "#c9534f" : "#6bcb77"}`,
                borderRadius: 6,
                marginBottom: 16,
              }}
            >
              <p
                style={{
                  fontSize: 13,
                  color: isDuplicate ? "#f8b3af" : "#a8f5c5",
                  fontFamily: "system-ui, sans-serif",
                  margin: 0,
                  fontWeight: 500,
                }}
              >
                {message}
              </p>
            </div>
          </motion.div>
        )}

        {/* Footer text */}
        <p
          style={{
            fontSize: 11,
            color: "#8b7968",
            fontFamily: "system-ui, sans-serif",
            marginTop: 20,
            margin: 0,
          }}
        >
          The journey is just beginning.
        </p>

        {/* Close button (only show after submission or on request) */}
        {submitted && (
          <motion.button
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            style={{
              marginTop: 20,
              padding: "8px 16px",
              background: "transparent",
              border: "1px solid #3a3a3a",
              borderRadius: 6,
              fontSize: 12,
              color: "#c9b8ac",
              fontFamily: "system-ui, sans-serif",
              cursor: "pointer",
              transition: "all 200ms",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = "#c8922a";
              (e.currentTarget as HTMLButtonElement).style.color = "#c8922a";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = "#3a3a3a";
              (e.currentTarget as HTMLButtonElement).style.color = "#c9b8ac";
            }}
          >
            Close
          </motion.button>
        )}
      </motion.div>
    </div>
  );
}
