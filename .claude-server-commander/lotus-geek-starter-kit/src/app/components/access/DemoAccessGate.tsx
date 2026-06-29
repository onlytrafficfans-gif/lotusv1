import React, { useState } from "react";
import { motion } from "motion/react";
import logoLotus from "../../../imports/logo_lotus.png";
import {
  normalizeEmail,
  hasEmailUsedDemo,
  startDemoSession,
} from "../../auth/demoAccess";

interface DemoAccessGateProps {
  onAccessGranted: (email: string) => void;
}

export function DemoAccessGate({ onAccessGranted }: DemoAccessGateProps) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const validateEmail = (value: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Please enter your email");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setIsLoading(true);

    // Simulate a small delay for UX
    await new Promise((resolve) => setTimeout(resolve, 500));

    const normalized = normalizeEmail(email);

    if (hasEmailUsedDemo(normalized)) {
      setError("This demo access has already been used for this email.");
      setIsLoading(false);
      return;
    }

    // Grant access
    startDemoSession(email);
    setSubmitted(true);

    // Transition to app after a brief delay
    setTimeout(() => {
      onAccessGranted(normalized);
    }, 1000);
  };

  return (
    <div
      className="w-screen h-screen flex items-center justify-center overflow-hidden"
      style={{
        background: "#f5ede8",
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 9998,
      }}
    >
      {/* Background pattern */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `radial-gradient(circle, rgba(200,146,42,0.05) 1px, transparent 1px)`,
          backgroundSize: "50px 50px",
          opacity: 0.5,
        }}
      />

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 flex flex-col items-center gap-6 px-4 max-w-md w-full"
      >
        {/* Logo */}
        <div className="flex items-center justify-center mb-4">
          <img
            src={logoLotus}
            alt="Lotus"
            style={{
              width: 80,
              height: 80,
              objectFit: "contain",
            }}
          />
        </div>

        {/* Heading */}
        <div className="text-center">
          <h1
            style={{
              fontFamily: "Fraunces, serif",
              fontSize: 28,
              fontWeight: 500,
              color: "#2c2216",
              letterSpacing: "-0.02em",
              margin: 0,
              marginBottom: 8,
            }}
          >
            Welcome to Lotus
          </h1>
          <p
            style={{
              fontSize: 13,
              color: "#8b7968",
              fontFamily: "system-ui, sans-serif",
              margin: 0,
              lineHeight: 1.6,
            }}
          >
            Explore a 1-hour demo of the future of app building
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="w-full mt-4">
          {/* Email Input */}
          <div className="mb-4">
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
              }}
              placeholder="you@example.com"
              disabled={isLoading || submitted}
              style={{
                width: "100%",
                padding: "12px 14px",
                border: `1px solid ${error ? "#c9534f" : "#d4c4b0"}`,
                borderRadius: 8,
                fontSize: 14,
                fontFamily: "system-ui, sans-serif",
                background: "#fdfbf9",
                color: "#2c2216",
                outline: "none",
                transition: "all 200ms",
                boxSizing: "border-box",
              }}
            />
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  fontSize: 12,
                  color: "#c9534f",
                  margin: "6px 0 0 0",
                  fontFamily: "system-ui, sans-serif",
                }}
              >
                {error}
              </motion.p>
            )}
          </div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={isLoading || submitted}
            whileTap={{ scale: 0.98 }}
            style={{
              width: "100%",
              padding: "12px 16px",
              background: submitted ? "#6bcb77" : "#c8922a",
              color: submitted ? "#fff" : "#fdfbf9",
              border: "none",
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 600,
              fontFamily: "system-ui, sans-serif",
              cursor: isLoading || submitted ? "default" : "pointer",
              opacity: isLoading || submitted ? 0.8 : 1,
              transition: "all 200ms",
            }}
          >
            {submitted ? "✓ Access Granted" : isLoading ? "Validating..." : "Start 1-Hour Demo"}
          </motion.button>
        </form>

        {/* Info text */}
        <p
          style={{
            fontSize: 11,
            color: "#8b7968",
            fontFamily: "system-ui, sans-serif",
            textAlign: "center",
            lineHeight: 1.6,
            marginTop: 8,
            margin: 0,
          }}
        >
          One email per person. Your session will last 1 hour from the time you enter.
        </p>

        {/* Footer */}
        <p
          style={{
            fontSize: 10,
            color: "#b0a093",
            fontFamily: "system-ui, sans-serif",
            textAlign: "center",
            marginTop: 16,
            margin: 0,
          }}
        >
          The journey is just beginning
        </p>
      </motion.div>
    </div>
  );
}
