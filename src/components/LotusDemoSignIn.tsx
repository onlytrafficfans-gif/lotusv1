import { useEffect, useMemo, useRef, useState } from "react";
import type { KeyboardEvent, ReactNode } from "react";
import lotusLogo from "../../assets/lotus-signup-logo.png";
import lotusBox from "../../assets/lotus-box.png";
import "./LotusDemoSignIn.css";

const LOTUS_DEMO_ACCESS_KEY = "lotus.demoAccessGranted";

const roles = [
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

interface LotusDemoSignInProps {
  children: ReactNode;
}

export function LotusDemoSignIn({ children }: LotusDemoSignInProps) {
  const [hasAccess, setHasAccess] = useState(() => {
    return localStorage.getItem(LOTUS_DEMO_ACCESS_KEY) === "true";
  });
  const [step, setStep] = useState(1);
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [agreementChecked, setAgreementChecked] = useState(false);
  const firstInputRef = useRef<HTMLInputElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);

  const canContinue = useMemo(() => {
    if (step === 1) return firstName.trim().length > 0;
    if (step === 2) return email.includes("@") && email.includes(".");
    if (step === 3) return selectedRole.length > 0;
    if (step === 5) return agreementChecked;
    return true;
  }, [agreementChecked, email, firstName, selectedRole, step]);

  useEffect(() => {
    if (step === 1) firstInputRef.current?.focus();
    if (step === 2) emailInputRef.current?.focus();
  }, [step]);

  useEffect(() => {
    if (step !== 4) return;
    const timer = window.setTimeout(() => setStep(5), 900);
    return () => window.clearTimeout(timer);
  }, [step]);

  if (hasAccess) {
    return children;
  }

  const handleNext = () => {
    if (!canContinue) return;
    if (step === 5) {
      localStorage.setItem(LOTUS_DEMO_ACCESS_KEY, "true");
      setHasAccess(true);
      return;
    }
    setStep((currentStep) => Math.min(currentStep + 1, 5));
  };

  const handleBack = () => {
    setStep((currentStep) => Math.max(currentStep - 1, 1));
  };

  const handleRoleSelect = (role: string) => {
    setSelectedRole(role);
    window.setTimeout(() => setStep(4), 300);
  };

  const handleInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleNext();
    }
  };

  return (
    <main className="min-h-screen bg-black text-[#d4a574] grid grid-cols-1 md:grid-cols-2">
      <section className="hidden md:flex items-center justify-center bg-black p-10">
        <img
          src={lotusLogo}
          alt="Lotus"
          className="w-[70%] max-w-[520px] object-contain drop-shadow-[0_0_30px_rgba(218,165,32,0.4)]"
        />
      </section>

      <section className="flex min-h-screen items-center justify-center bg-black p-8">
        <div className="w-full max-w-[400px]">
          <div className="mb-10 flex justify-center md:hidden">
            <img
              src={lotusLogo}
              alt="Lotus"
              className="w-44 object-contain drop-shadow-[0_0_24px_rgba(218,165,32,0.35)]"
            />
          </div>

          {step === 1 && (
            <div className="lotus-signin-step">
              <h1 className="font-[Verdana] text-[28px] font-semibold text-[#d4a574]">
                Welcome
              </h1>
              <p className="mt-2 mb-8 text-sm text-[#8b7355]">
                Let's get started with your name
              </p>
              <label className="sr-only" htmlFor="lotus-first-name">
                First name
              </label>
              <input
                ref={firstInputRef}
                id="lotus-first-name"
                value={firstName}
                onChange={(event) => setFirstName(event.target.value)}
                onKeyDown={handleInputKeyDown}
                placeholder="First name"
                className="lotus-signin-input"
              />
            </div>
          )}

          {step === 2 && (
            <div className="lotus-signin-step">
              <h1 className="font-[Verdana] text-[28px] font-semibold text-[#d4a574]">
                Email address
              </h1>
              <p className="mt-2 mb-8 text-sm text-[#8b7355]">
                We'll use this to create your account
              </p>
              <label className="sr-only" htmlFor="lotus-email">
                Email address
              </label>
              <input
                ref={emailInputRef}
                id="lotus-email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                onKeyDown={handleInputKeyDown}
                type="email"
                placeholder="your@email.com"
                className="lotus-signin-input"
              />
            </div>
          )}

          {step === 3 && (
            <div className="lotus-signin-step">
              <h1 className="font-[Verdana] text-[28px] font-semibold text-[#d4a574]">
                What's your role?
              </h1>
              <p className="mt-2 mb-6 text-sm text-[#8b7355]">
                Help us personalize your experience
              </p>
              <div className="flex max-h-[350px] flex-col gap-2.5 overflow-y-auto pr-1">
                {roles.map((role) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => handleRoleSelect(role)}
                    className={`lotus-signin-role ${
                      selectedRole === role ? "lotus-signin-role-selected" : ""
                    }`}
                  >
                    {role}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="lotus-signin-step text-center">
              <div className="mx-auto mb-6 flex h-[60px] w-[60px] items-center justify-center rounded-full bg-linear-to-br from-[#d4a574] to-[#a0825d] text-3xl font-semibold text-black">
                ✓
              </div>
              <h1 className="font-[Verdana] text-[28px] font-semibold text-[#d4a574]">
                All set!
              </h1>
              <p className="mt-3 mb-8 text-sm text-[#8b7355]">
                Welcome {firstName.trim()}! Your Lotus demo is almost ready.
              </p>
              <p className="text-[13px] text-[#6b5745]">
                Role:{" "}
                <span className="font-medium text-[#d4a574]">
                  {selectedRole}
                </span>
              </p>
            </div>
          )}

          {step === 5 && (
            <div className="lotus-signin-step flex flex-col items-center gap-6">
              <img
                src={lotusBox}
                alt="Lotus demo access"
                className="w-[200px] object-contain drop-shadow-[0_0_20px_rgba(212,165,116,0.3)]"
              />
              <div className="w-full">
                <h1 className="mb-6 text-center font-[Verdana] text-[28px] font-semibold text-[#d4a574]">
                  Before You Enter
                </h1>
                <div className="mb-6 max-h-[220px] overflow-y-auto rounded-lg border-2 border-[#3a3a2a] bg-[#1a1a12] p-5">
                  <p className="mb-3 text-sm font-semibold text-[#d4a574]">
                    This is a private one-hour preview of Lotus App Builder.
                  </p>
                  <p className="mb-3 text-[13px] leading-6 text-[#8b7355]">
                    During your demo, you can explore the builder experience,
                    test the flow, and view the live app preview.
                  </p>
                  <p className="mb-3 text-[13px] leading-6 text-[#8b7355]">
                    Some production features remain disabled during demo access,
                    including export, publishing, and production deployment.
                  </p>
                  <p className="text-[13px] leading-6 text-[#8b7355]">
                    This preview does not include ownership, resale rights,
                    commercial rights, source code, domain transfer, or full
                    product handoff unless a paid agreement is completed.
                  </p>
                </div>
                <label className="flex cursor-pointer items-start gap-3 text-[13px] leading-5 text-[#8b7355]">
                  <input
                    type="checkbox"
                    checked={agreementChecked}
                    onChange={(event) =>
                      setAgreementChecked(event.target.checked)
                    }
                    className="mt-0.5 h-5 w-5 cursor-pointer accent-[#d4a574]"
                  />
                  <span>
                    I understand this is a temporary private demo preview, not a
                    full product handoff.
                  </span>
                </label>
              </div>
            </div>
          )}

          {step !== 4 && (
            <div className="mt-8 flex gap-3">
              <button
                type="button"
                onClick={handleBack}
                disabled={step === 1}
                className="lotus-signin-back"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleNext}
                disabled={!canContinue}
                className="lotus-signin-next"
              >
                {step === 5 ? "Start Demo" : "Next"}
              </button>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
