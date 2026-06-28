import React, { useState } from 'react';

const ROLES = [
  'Creator',
  'Developer',
  'Designer',
  'Freelancer',
  'Business Owner',
  'Entrepreneur',
  'Content Creator',
  'Product Manager',
  'Marketer',
  'Consultant',
  'Educator',
  'Startup Founder',
  'Agency Owner',
  'Student',
];

interface SignUpFlowProps {
  onComplete?: (data: SignUpData) => void;
}

interface SignUpData {
  firstName: string;
  email: string;
  role: string;
}

export const SignUpFlow: React.FC<SignUpFlowProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [agreementChecked, setAgreementChecked] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [isAccessGranted, setIsAccessGranted] = useState(false);

  const isStep1Valid = firstName.trim().length > 0;
  const isStep2Valid = email.includes('@') && email.includes('.');
  const isStep3Valid = selectedRole.length > 0;

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else if (step === 3) {
      setStep(4);
    } else if (step === 4) {
      setStep(5);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleRoleSelect = (role: string) => {
    setSelectedRole(role);
    setTimeout(() => setStep(4), 300);
  };

  const handleGrantAccess = () => {
    setStep(6);
  };

  const handleStartDemo = () => {
    if (agreementChecked) {
      setStep(5);
    }
  };

  const handleVerifyCode = () => {
    if (verificationCode.trim().length > 0) {
      setIsAccessGranted(true);
      if (onComplete) {
        onComplete({ firstName, email, role: selectedRole });
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && step < 3) {
      handleNext();
    }
  };

  const handleCodeKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleVerifyCode();
    }
  };

  return (
    <div style={{
      display: 'flex',
      width: '100%',
      height: '100vh',
      background: '#000000',
      margin: 0,
      padding: 0,
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }}>
      {/* Left Side - Logo/Branding */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px',
        background: '#000000',
      }}>
        <div style={{
          fontSize: '120px',
          filter: 'drop-shadow(0 0 30px rgba(218,165,32,0.4))',
        }}>
          🪷
        </div>
      </div>

      {/* Right Side - Sign Up Form */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px',
        background: '#000000',
      }}>
        <div style={{ width: '100%', maxWidth: '400px' }}>
          {/* Step 1: First Name */}
          {step === 1 && (
            <div style={{ animation: 'slideIn 0.4s ease-out', animationFillMode: 'both' }}>
              <h2 style={{
                color: '#D4A574',
                fontSize: '28px',
                margin: '0 0 12px 0',
                fontWeight: 600,
                fontFamily: 'Verdana',
              }}>Welcome</h2>
              <p style={{
                color: '#8B7355',
                fontSize: '14px',
                margin: '0 0 32px 0',
              }}>Let's get started with your name</p>
              <input
                type="text"
                placeholder="First name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                onKeyPress={handleKeyPress}
                autoFocus
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  fontSize: '16px',
                  border: '2px solid #3a3a2a',
                  borderRadius: '8px',
                  background: '#1a1a12',
                  color: '#D4A574',
                  boxSizing: 'border-box',
                  transition: 'all 0.2s ease',
                }}
              />
            </div>
          )}

          {/* Step 2: Email */}
          {step === 2 && (
            <div style={{ animation: 'slideIn 0.4s ease-out', animationFillMode: 'both' }}>
              <h2 style={{
                color: '#D4A574',
                fontSize: '28px',
                margin: '0 0 12px 0',
                fontWeight: 600,
                fontFamily: 'Verdana',
              }}>Email address</h2>
              <p style={{
                color: '#8B7355',
                fontSize: '14px',
                margin: '0 0 32px 0',
              }}>We'll use this to create your account</p>
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyPress={handleKeyPress}
                autoFocus
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  fontSize: '16px',
                  border: '2px solid #3a3a2a',
                  borderRadius: '8px',
                  background: '#1a1a12',
                  color: '#D4A574',
                  boxSizing: 'border-box',
                  transition: 'all 0.2s ease',
                }}
              />
            </div>
          )}

          {/* Step 3: Role Selection */}
          {step === 3 && (
            <div style={{ animation: 'slideIn 0.4s ease-out', animationFillMode: 'both' }}>
              <h2 style={{
                color: '#D4A574',
                fontSize: '28px',
                margin: '0 0 12px 0',
                fontWeight: 600,
                fontFamily: 'Verdana',
              }}>What's your role?</h2>
              <p style={{
                color: '#8B7355',
                fontSize: '14px',
                margin: '0 0 24px 0',
              }}>Help us personalize your experience</p>

              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                maxHeight: '350px',
                overflowY: 'auto',
                paddingRight: '8px',
              }}>
                {ROLES.map((role) => (
                  <button
                    key={role}
                    onClick={() => handleRoleSelect(role)}
                    style={{
                      padding: '14px 16px',
                      textAlign: 'left',
                      border: '2px solid #3a3a2a',
                      borderRadius: '8px',
                      background: '#1a1a12',
                      color: '#8B7355',
                      fontSize: '15px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      fontFamily: 'inherit',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#D4A574';
                      e.currentTarget.style.background = '#2a2a1a';
                      e.currentTarget.style.color = '#D4A574';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = '#3a3a2a';
                      e.currentTarget.style.background = '#1a1a12';
                      e.currentTarget.style.color = '#8B7355';
                    }}
                  >
                    {role}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Confirmation */}
          {step === 4 && (
            <div style={{
              animation: 'slideIn 0.4s ease-out',
              animationFillMode: 'both',
              textAlign: 'center',
              padding: '40px 0',
            }}>
              <div style={{
                width: '60px',
                height: '60px',
                background: 'linear-gradient(135deg, #D4A574, #A0825D)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 24px',
                fontSize: '32px',
                color: '#000000',
              }}>
                ✓
              </div>
              <h2 style={{
                color: '#D4A574',
                fontSize: '28px',
                margin: '0 0 12px 0',
                fontWeight: 600,
                fontFamily: 'Verdana',
              }}>All set!</h2>
              <p style={{
                color: '#8B7355',
                fontSize: '14px',
                margin: '0 0 32px 0',
                lineHeight: '1.6',
              }}>Welcome {firstName}! Check your email to verify your account.</p>
              <p style={{
                color: '#6B5745',
                fontSize: '13px',
                margin: '0 0 24px 0',
              }}>Role: <span style={{ color: '#D4A574' }}>{selectedRole}</span></p>
              <button
                onClick={handleGrantAccess}
                style={{
                  padding: '14px 32px',
                  border: 'none',
                  borderRadius: '8px',
                  background: 'linear-gradient(135deg, #D4A574, #A0825D)',
                  color: '#000000',
                  fontSize: '15px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(212, 165, 116, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                Grant Access
              </button>
            </div>
          )}

          {/* Step 5: Demo Agreement */}
          {step === 5 && (
            <div style={{
              animation: 'slideIn 0.4s ease-out',
              animationFillMode: 'both',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '24px',
            }}>
              <div style={{ fontSize: '64px' }}>📦</div>

              <div style={{ width: '100%' }}>
                <h2 style={{
                  color: '#D4A574',
                  fontSize: '28px',
                  margin: '0 0 24px 0',
                  fontWeight: 600,
                  fontFamily: 'Verdana',
                  textAlign: 'center',
                }}>Before You Enter</h2>

                <div style={{
                  background: '#1a1a12',
                  border: '2px solid #3a3a2a',
                  borderRadius: '8px',
                  padding: '20px',
                  marginBottom: '24px',
                  maxHeight: '220px',
                  overflowY: 'auto',
                }}>
                  <p style={{
                    color: '#D4A574',
                    fontSize: '14px',
                    fontWeight: 600,
                    margin: '0 0 12px 0',
                  }}>This is a private one-hour preview of Lotus App Builder.</p>

                  <p style={{
                    color: '#8B7355',
                    fontSize: '13px',
                    lineHeight: '1.6',
                    margin: '0 0 12px 0',
                  }}>During your demo, you can explore the builder experience, test the flow, and view the live app preview.</p>

                  <p style={{
                    color: '#8B7355',
                    fontSize: '13px',
                    lineHeight: '1.6',
                    margin: '0 0 12px 0',
                  }}>Some production features are disabled during demo access, including export, download, publishing, source files, real integrations, and production deployment.</p>

                  <p style={{
                    color: '#8B7355',
                    fontSize: '13px',
                    lineHeight: '1.6',
                    margin: 0,
                  }}>This preview does not include ownership, resale rights, commercial rights, source code, domain transfer, or full product handoff unless a paid agreement is completed.</p>
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px',
                  marginBottom: '24px',
                }}>
                  <input
                    type="checkbox"
                    checked={agreementChecked}
                    onChange={(e) => setAgreementChecked(e.target.checked)}
                    style={{
                      width: '20px',
                      height: '20px',
                      marginTop: '2px',
                      cursor: 'pointer',
                      accentColor: '#D4A574',
                      flexShrink: 0,
                    }}
                  />
                  <label style={{
                    color: '#8B7355',
                    fontSize: '13px',
                    cursor: 'pointer',
                    lineHeight: '1.4',
                  }}>
                    I understand this is a temporary private demo preview, not a full product handoff.
                  </label>
                </div>

                <button
                  onClick={handleStartDemo}
                  disabled={!agreementChecked}
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    border: 'none',
                    borderRadius: '8px',
                    background: 'linear-gradient(135deg, #D4A574, #A0825D)',
                    color: '#000000',
                    fontSize: '15px',
                    fontWeight: 600,
                    cursor: agreementChecked ? 'pointer' : 'not-allowed',
                    transition: 'all 0.2s ease',
                    opacity: agreementChecked ? 1 : 0.5,
                  }}
                  onMouseEnter={(e) => {
                    if (agreementChecked) {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 8px 24px rgba(212, 165, 116, 0.3)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  Start Demo
                </button>
              </div>
            </div>
          )}

          {/* Step 6: Verification Code */}
          {step === 6 && !isAccessGranted && (
            <div style={{ animation: 'slideIn 0.4s ease-out', animationFillMode: 'both' }}>
              <h2 style={{
                color: '#D4A574',
                fontSize: '28px',
                margin: '0 0 12px 0',
                fontWeight: 600,
                fontFamily: 'Verdana',
              }}>Check your email</h2>
              <p style={{
                color: '#8B7355',
                fontSize: '14px',
                margin: '0 0 32px 0',
              }}>Enter the verification code from your email</p>
              <input
                type="text"
                placeholder="Enter code"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                onKeyPress={handleCodeKeyPress}
                autoFocus
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  fontSize: '16px',
                  border: '2px solid #3a3a2a',
                  borderRadius: '8px',
                  background: '#1a1a12',
                  color: '#D4A574',
                  boxSizing: 'border-box',
                  transition: 'all 0.2s ease',
                  textAlign: 'center',
                  letterSpacing: '4px',
                  fontWeight: 600,
                  marginBottom: '24px',
                }}
              />
              <button
                onClick={handleVerifyCode}
                disabled={verificationCode.length === 0}
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  border: 'none',
                  borderRadius: '8px',
                  background: 'linear-gradient(135deg, #D4A574, #A0825D)',
                  color: '#000000',
                  fontSize: '15px',
                  fontWeight: 600,
                  cursor: verificationCode.length > 0 ? 'pointer' : 'not-allowed',
                  transition: 'all 0.2s ease',
                  opacity: verificationCode.length > 0 ? 1 : 0.5,
                }}
                onMouseEnter={(e) => {
                  if (verificationCode.length > 0) {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(212, 165, 116, 0.3)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                Verify Code
              </button>
            </div>
          )}

          {/* Step 7: Access Granted */}
          {isAccessGranted && (
            <div style={{
              animation: 'slideIn 0.4s ease-out',
              animationFillMode: 'both',
              textAlign: 'center',
              padding: '60px 0',
            }}>
              <div style={{ fontSize: '64px', margin: '0 0 32px 0' }}>🌸</div>
              <h1 style={{
                color: '#D4A574',
                fontSize: '36px',
                margin: '0 0 20px 0',
                fontWeight: 700,
                fontFamily: 'Verdana',
              }}>You've been granted</h1>
              <h2 style={{
                color: '#D4A574',
                fontSize: '32px',
                margin: '0 0 40px 0',
                fontWeight: 600,
                fontFamily: 'Verdana',
              }}>1 hour access to Lotus</h2>
              <p style={{
                color: '#8B7355',
                fontSize: '15px',
                margin: '0 0 8px 0',
                lineHeight: '1.6',
              }}>Enjoy your premium experience</p>
              <p style={{
                color: '#6B5745',
                fontSize: '13px',
                margin: 0,
              }}>Access expires in 1 hour</p>
            </div>
          )}

          {/* Navigation Buttons */}
          {step > 0 && step < 4 && (
            <div style={{
              display: 'flex',
              gap: '12px',
              marginTop: '32px',
              animation: 'slideIn 0.4s ease-out',
              animationFillMode: 'both',
            }}>
              <button
                onClick={handleBack}
                disabled={step === 1}
                style={{
                  flex: 1,
                  padding: '14px 16px',
                  border: '2px solid #3a3a2a',
                  borderRadius: '8px',
                  background: 'transparent',
                  color: '#8B7355',
                  fontSize: '15px',
                  fontWeight: 500,
                  cursor: step === 1 ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s ease',
                  opacity: step === 1 ? 0.5 : 1,
                  fontFamily: 'inherit',
                }}
                onMouseEnter={(e) => {
                  if (step > 1) {
                    e.currentTarget.style.borderColor = '#D4A574';
                    e.currentTarget.style.color = '#D4A574';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#3a3a2a';
                  e.currentTarget.style.color = '#8B7355';
                }}
              >
                Back
              </button>
              <button
                onClick={handleNext}
                disabled={step === 1 ? !isStep1Valid : step === 2 ? !isStep2Valid : !isStep3Valid}
                style={{
                  flex: 1,
                  padding: '14px 16px',
                  border: 'none',
                  borderRadius: '8px',
                  background: 'linear-gradient(135deg, #D4A574, #A0825D)',
                  color: '#000000',
                  fontSize: '15px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  opacity: (step === 1 && !isStep1Valid) || (step === 2 && !isStep2Valid) || (step === 3 && !isStep3Valid) ? 0.5 : 1,
                  fontFamily: 'inherit',
                }}
                onMouseEnter={(e) => {
                  const disabled = (step === 1 && !isStep1Valid) || (step === 2 && !isStep2Valid) || (step === 3 && !isStep3Valid);
                  if (!disabled) {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(212, 165, 116, 0.3)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                {step === 3 ? 'Complete' : 'Next'}
              </button>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};
