import { useState } from "react";
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

const ROLES = [
  "Creator",
  "Developer",
  "Designer",
  "Freelancer",
  "Business Owner",
  "Entrepreneur",
  "Content Creator",
  "Product Manager",
  "Marketer",
  "Consultant",
  "Educator",
  "Startup Founder",
  "Agency Owner",
  "Student",
];

export function DemoAccessGate({ onAccessGranted }: DemoAccessGateProps) {
  const [step, setStep] = useState(1);
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [agreementChecked, setAgreementChecked] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (value: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  };

  const isStepValid = (): boolean => {
    switch (step) {
      case 1:
        return firstName.trim().length > 0;
      case 2:
        return email.trim().length > 0 && validateEmail(email);
      case 3:
        return selectedRole.length > 0;
      case 5:
        return agreementChecked;
      default:
        return true;
    }
  };

  const handleNext = () => {
    setError("");
    if (!isStepValid()) return;

    if (step === 3) {
      setStep(4);
    } else if (step === 4) {
      setStep(5);
    } else if (step < 6) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleStartDemo = async () => {
    setError("");
    const normalized = normalizeEmail(email);

    if (hasEmailUsedDemo(normalized)) {
      setError("This email has already been used for demo access.");
      return;
    }

    setIsLoading(true);
    startDemoSession(email);
    setStep(7); // Access granted

    setTimeout(() => {
      onAccessGranted(normalized);
    }, 2000);
  };

  const handleVerifyCode = () => {
    if (verificationCode.trim().length === 0) return;
    setStep(7); // Access granted
  };

  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        background: "#000000",
        display: "flex",
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 9998,
        margin: 0,
        padding: 0,
        fontFamily: "system-ui, -apple-system, Segoe UI, sans-serif",
      }}
    >
      {/* Left Side - Logo */}
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px",
          background: "#000000",
        }}
      >
        <img
          src={logoLotus}
          alt="Lotus Logo"
          style={{
            maxWidth: "70%",
            maxHeight: "70%",
            width: "auto",
            height: "auto",
            objectFit: "contain",
            filter: "drop-shadow(0 0 30px rgba(212, 165, 116, 0.4))",
          }}
        />
      </div>

      {/* Right Side - Form */}
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px",
          background: "#000000",
          overflowY: "auto",
        }}
      >
        <motion.div
          style={{
            width: "100%",
            maxWidth: "400px",
          }}
          key={step}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Step 1: First Name */}
          {step === 1 && (
            <>
              <h2 style={{ color: "#D4A574", fontSize: 28, margin: "0 0 12px 0", fontWeight: 600, fontFamily: "Verdana" }}>Welcome</h2>
              <p style={{ color: "#8B7355", fontSize: 14, margin: "0 0 32px 0" }}>Let's get started with your name</p>
              <input
                type="text"
                placeholder="First name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                autoFocus
                style={{
                  width: "100%",
                  padding: "14px 16px",
                  fontSize: 16,
                  border: "2px solid #3a3a2a",
                  borderRadius: 8,
                  background: "#1a1a12",
                  color: "#D4A574",
                  boxSizing: "border-box",
                  outline: "none",
                }}
              />
            </>
          )}

          {/* Step 2: Email */}
          {step === 2 && (
            <>
              <h2 style={{ color: "#D4A574", fontSize: 28, margin: "0 0 12px 0", fontWeight: 600, fontFamily: "Verdana" }}>Email address</h2>
              <p style={{ color: "#8B7355", fontSize: 14, margin: "0 0 32px 0" }}>We'll use this to create your account</p>
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoFocus
                style={{
                  width: "100%",
                  padding: "14px 16px",
                  fontSize: 16,
                  border: "2px solid #3a3a2a",
                  borderRadius: 8,
                  background: "#1a1a12",
                  color: "#D4A574",
                  boxSizing: "border-box",
                  outline: "none",
                }}
              />
            </>
          )}

          {/* Step 3: Role Selection */}
          {step === 3 && (
            <>
              <h2 style={{ color: "#D4A574", fontSize: 28, margin: "0 0 12px 0", fontWeight: 600, fontFamily: "Verdana" }}>What's your role?</h2>
              <p style={{ color: "#8B7355", fontSize: 14, margin: "0 0 24px 0" }}>Help us personalize your experience</p>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                  maxHeight: "350px",
                  overflowY: "auto",
                  paddingRight: "8px",
                }}
              >
                {ROLES.map((role) => (
                  <button
                    key={role}
                    onClick={() => {
                      setSelectedRole(role);
                      setTimeout(() => setStep(4), 300);
                    }}
                    style={{
                      padding: "14px 16px",
                      textAlign: "left",
                      border: "2px solid #3a3a2a",
                      borderRadius: 8,
                      background: "#1a1a12",
                      color: "#8B7355",
                      fontSize: 15,
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.borderColor = "#D4A574";
                      (e.currentTarget as HTMLButtonElement).style.background = "#2a2a1a";
                      (e.currentTarget as HTMLButtonElement).style.color = "#D4A574";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.borderColor = "#3a3a2a";
                      (e.currentTarget as HTMLButtonElement).style.background = "#1a1a12";
                      (e.currentTarget as HTMLButtonElement).style.color = "#8B7355";
                    }}
                  >
                    {role}
                  </button>
                ))}
              </div>
            </>
          )}

          {/* Step 4: Confirmation */}
          {step === 4 && (
            <div style={{ textAlign: "center", padding: "40px 0" }}>
              <div
                style={{
                  width: "60px",
                  height: "60px",
                  background: "linear-gradient(135deg, #D4A574, #A0825D)",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 24px",
                  fontSize: 32,
                  color: "#000000",
                }}
              >
                ✓
              </div>
              <h2 style={{ color: "#D4A574", fontSize: 28, margin: "0 0 12px 0", fontWeight: 600, fontFamily: "Verdana" }}>All set!</h2>
              <p style={{ color: "#8B7355", fontSize: 14, margin: "0 0 32px 0", lineHeight: 1.6 }}>Welcome {firstName}! Check your email to verify your account.</p>
              <p style={{ color: "#6B5745", fontSize: 13, margin: "0 0 24px 0" }}>Role: <span style={{ color: "#D4A574" }}>{selectedRole}</span></p>
              <button
                onClick={() => setStep(5)}
                style={{
                  padding: "14px 32px",
                  border: "none",
                  borderRadius: 8,
                  background: "linear-gradient(135deg, #D4A574, #A0825D)",
                  color: "#000000",
                  fontSize: 15,
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px)";
                  (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 8px 24px rgba(212, 165, 116, 0.3)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
                  (e.currentTarget as HTMLButtonElement).style.boxShadow = "none";
                }}
              >
                Grant Access
              </button>
            </div>
          )}

          {/* Step 5: Terms & Demo Agreement */}
          {step === 5 && (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "24px" }}>
              <h2 style={{ color: "#D4A574", fontSize: 28, margin: "0 0 24px 0", fontWeight: 600, fontFamily: "Verdana", textAlign: "center" }}>Before You Enter</h2>

              <div
                style={{
                  background: "#1a1a12",
                  border: "2px solid #3a3a2a",
                  borderRadius: 8,
                  padding: "20px",
                  marginBottom: "24px",
                  maxHeight: "220px",
                  overflowY: "auto",
                }}
              >
                <p style={{ color: "#D4A574", fontSize: 14, fontWeight: 600, margin: "0 0 12px 0" }}>This is a private one-hour preview of Lotus App Builder.</p>
                <p style={{ color: "#8B7355", fontSize: 13, lineHeight: 1.6, margin: "0 0 12px 0" }}>During your demo, you can explore the builder experience, test the flow, and view the live app preview.</p>
                <p style={{ color: "#8B7355", fontSize: 13, lineHeight: 1.6, margin: "0 0 12px 0" }}>Some production features are disabled during demo access, including export, download, publishing, source files, real integrations, and production deployment.</p>
                <p style={{ color: "#8B7355", fontSize: 13, lineHeight: 1.6, margin: 0 }}>This preview does not include ownership, resale rights, commercial rights, source code, domain transfer, or full product handoff unless a paid agreement is completed.</p>
              </div>

              <div style={{ display: "flex", alignItems: "flex-start", gap: "12px", marginBottom: "24px" }}>
                <input
                  type="checkbox"
                  checked={agreementChecked}
                  onChange={(e) => setAgreementChecked(e.target.checked)}
                  style={{
                    width: "20px",
                    height: "20px",
                    marginTop: "2px",
                    cursor: "pointer",
                    accentColor: "#D4A574",
                    flexShrink: 0,
                  }}
                />
                <label
                  style={{
                    color: "#8B7355",
                    fontSize: 13,
                    cursor: "pointer",
                    lineHeight: 1.4,
                  }}
                >
                  I understand this is a temporary private demo preview, not a full product handoff.
                </label>
              </div>

              <button
                onClick={handleStartDemo}
                disabled={!agreementChecked || isLoading}
                style={{
                  width: "100%",
                  padding: "14px 16px",
                  border: "none",
                  borderRadius: 8,
                  background: agreementChecked ? "linear-gradient(135deg, #D4A574, #A0825D)" : "#8B7355",
                  color: "#000000",
                  fontSize: 15,
                  fontWeight: 600,
                  cursor: agreementChecked ? "pointer" : "not-allowed",
                  opacity: agreementChecked ? 1 : 0.5,
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  if (agreementChecked) {
                    (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px)";
                    (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 8px 24px rgba(212, 165, 116, 0.3)";
                  }
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
                  (e.currentTarget as HTMLButtonElement).style.boxShadow = "none";
                }}
              >
                {isLoading ? "Starting Demo..." : "Start Demo"}
              </button>
            </div>
          )}

          {/* Step 6: Verification Code */}
          {step === 6 && (
            <>
              <h2 style={{ color: "#D4A574", fontSize: 28, margin: "0 0 12px 0", fontWeight: 600, fontFamily: "Verdana" }}>Check your email</h2>
              <p style={{ color: "#8B7355", fontSize: 14, margin: "0 0 32px 0" }}>Enter the verification code from your email</p>
              <input
                type="text"
                placeholder="Enter code"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                autoFocus
                style={{
                  width: "100%",
                  padding: "14px 16px",
                  fontSize: 16,
                  border: "2px solid #3a3a2a",
                  borderRadius: 8,
                  background: "#1a1a12",
                  color: "#D4A574",
                  boxSizing: "border-box",
                  outline: "none",
                  textAlign: "center",
                  letterSpacing: "4px",
                  fontWeight: 600,
                  marginBottom: "24px",
                }}
              />
              <button
                onClick={handleVerifyCode}
                disabled={verificationCode.length === 0}
                style={{
                  width: "100%",
                  padding: "14px 16px",
                  border: "none",
                  borderRadius: 8,
                  background: verificationCode.length > 0 ? "linear-gradient(135deg, #D4A574, #A0825D)" : "#8B7355",
                  color: "#000000",
                  fontSize: 15,
                  fontWeight: 600,
                  cursor: verificationCode.length > 0 ? "pointer" : "not-allowed",
                  opacity: verificationCode.length > 0 ? 1 : 0.5,
                }}
              >
                Verify Code
              </button>
            </>
          )}

          {/* Step 7: Access Granted */}
          {step === 7 && (
            <div style={{ textAlign: "center", padding: "60px 0" }}>
              <div style={{ fontSize: "64px", margin: "0 0 32px 0" }}>🌸</div>
              <h1 style={{ color: "#D4A574", fontSize: 36, margin: "0 0 20px 0", fontWeight: 700, fontFamily: "Verdana" }}>You've been granted</h1>
              <h2 style={{ color: "#D4A574", fontSize: 32, margin: "0 0 40px 0", fontWeight: 600, fontFamily: "Verdana" }}>1 hour access to Lotus</h2>
              <p style={{ color: "#8B7355", fontSize: 15, margin: "0 0 8px 0", lineHeight: 1.6 }}>Enjoy your premium experience</p>
              <p style={{ color: "#6B5745", fontSize: 13, margin: 0 }}>Access expires in 1 hour</p>
            </div>
          )}

          {/* Navigation Buttons */}
          {step > 0 && step < 7 && step !== 5 && (
            <div style={{ display: "flex", gap: "12px", marginTop: "32px" }}>
              <button
                onClick={handleBack}
                disabled={step === 1}
                style={{
                  flex: 1,
                  padding: "14px 16px",
                  border: "2px solid #3a3a2a",
                  borderRadius: 8,
                  background: "transparent",
                  color: "#8B7355",
                  fontSize: 15,
                  fontWeight: 500,
                  cursor: step === 1 ? "not-allowed" : "pointer",
                  opacity: step === 1 ? 0.5 : 1,
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  if (step > 1) {
                    (e.currentTarget as HTMLButtonElement).style.borderColor = "#D4A574";
                    (e.currentTarget as HTMLButtonElement).style.color = "#D4A574";
                  }
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = "#3a3a2a";
                  (e.currentTarget as HTMLButtonElement).style.color = "#8B7355";
                }}
              >
                Back
              </button>
              <button
                onClick={handleNext}
                disabled={!isStepValid()}
                style={{
                  flex: 1,
                  padding: "14px 16px",
                  border: "none",
                  borderRadius: 8,
                  background: isStepValid() ? "linear-gradient(135deg, #D4A574, #A0825D)" : "#8B7355",
                  color: "#000000",
                  fontSize: 15,
                  fontWeight: 600,
                  cursor: isStepValid() ? "pointer" : "not-allowed",
                  opacity: isStepValid() ? 1 : 0.5,
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  if (isStepValid()) {
                    (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px)";
                    (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 8px 24px rgba(212, 165, 116, 0.3)";
                  }
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
                  (e.currentTarget as HTMLButtonElement).style.boxShadow = "none";
                }}
              >
                {step === 3 ? "Complete" : "Next"}
              </button>
            </div>
          )}

          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{
                color: "#c9534f",
                fontSize: 13,
                marginTop: "12px",
                textAlign: "center",
              }}
            >
              {error}
            </motion.p>
          )}
        </motion.div>
      </div>
    </div>
  );
}
