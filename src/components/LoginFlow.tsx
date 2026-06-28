import React, { useState, useEffect } from 'react';
import { ipc } from '@/ipc/types';

interface LoginFlowProps {
  onSuccess?: (token: string, email: string) => void;
  onCancel?: () => void;
}

export const LoginFlow: React.FC<LoginFlowProps> = ({ onSuccess, onCancel }) => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [expiresIn, setExpiresIn] = useState(0);

  const isEmailValid = email.includes('@') && email.includes('.');

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (expiresIn > 0 && step === 2) {
      timer = setInterval(() => {
        setExpiresIn((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [expiresIn, step]);

  const handleSendCode = async () => {
    if (!isEmailValid) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await ipc.send('auth:send-code', { email });
      if (response.success) {
        setSuccessMessage('Code sent to your email!');
        setExpiresIn(response.expiresIn);
        setStep(2);
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        setError(response.message || 'Failed to send code');
      }
    } catch (err) {
      setError('Failed to send verification code. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (code.length !== 6) {
      setError('Please enter a 6-digit code');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await ipc.send('auth:verify-code', { email, code });
      if (response.success && response.token) {
        setSuccessMessage('Successfully authenticated!');
        if (onSuccess) {
          setTimeout(() => onSuccess(response.token!, email), 500);
        }
      } else {
        setError(response.message || 'Failed to verify code');
      }
    } catch (err) {
      setError('Failed to verify code. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    setIsLoading(true);
    setError('');

    try {
      const response = await ipc.send('auth:resend-code', { email });
      if (response.success) {
        setSuccessMessage('New code sent to your email!');
        setExpiresIn(response.expiresIn);
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        setError(response.message || 'Failed to resend code');
      }
    } catch (err) {
      setError('Failed to resend code. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isLoading) {
      if (step === 1 && isEmailValid) {
        handleSendCode();
      } else if (step === 2 && code.length === 6) {
        handleVerifyCode();
      }
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        width: '100%',
        height: '100vh',
        background: '#000000',
        margin: 0,
        padding: 0,
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      }}
    >
      {/* Left Side - Logo/Branding */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px',
          background: '#000000',
        }}
      >
        <div
          style={{
            fontSize: '120px',
            filter: 'drop-shadow(0 0 30px rgba(218,165,32,0.4))',
          }}
        >
          🪷
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px',
          background: '#000000',
        }}
      >
        <div style={{ width: '100%', maxWidth: '400px' }}>
          {/* Step 1: Email */}
          {step === 1 && (
            <div style={{ animation: 'slideIn 0.4s ease-out', animationFillMode: 'both' }}>
              <h2
                style={{
                  color: '#D4A574',
                  fontSize: '28px',
                  margin: '0 0 12px 0',
                  fontWeight: 600,
                  fontFamily: 'Verdana',
                }}
              >
                Welcome Back
              </h2>
              <p
                style={{
                  color: '#8B7355',
                  fontSize: '14px',
                  margin: '0 0 32px 0',
                }}
              >
                Sign in with your email to access Lotus
              </p>

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
                  marginBottom: '24px',
                }}
              />

              {error && (
                <p
                  style={{
                    color: '#ef4444',
                    fontSize: '13px',
                    margin: '0 0 16px 0',
                  }}
                >
                  {error}
                </p>
              )}

              {successMessage && (
                <p
                  style={{
                    color: '#10b981',
                    fontSize: '13px',
                    margin: '0 0 16px 0',
                  }}
                >
                  ✓ {successMessage}
                </p>
              )}

              <button
                onClick={handleSendCode}
                disabled={!isEmailValid || isLoading}
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  border: 'none',
                  borderRadius: '8px',
                  background: 'linear-gradient(135deg, #D4A574, #A0825D)',
                  color: '#000000',
                  fontSize: '15px',
                  fontWeight: 600,
                  cursor: !isEmailValid || isLoading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s ease',
                  opacity: !isEmailValid || isLoading ? 0.5 : 1,
                }}
                onMouseEnter={(e) => {
                  if (isEmailValid && !isLoading) {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(212, 165, 116, 0.3)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                {isLoading ? 'Sending...' : 'Send Code'}
              </button>

              {onCancel && (
                <button
                  onClick={onCancel}
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    border: '2px solid #3a3a2a',
                    borderRadius: '8px',
                    background: 'transparent',
                    color: '#8B7355',
                    fontSize: '15px',
                    fontWeight: 500,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    marginTop: '12px',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#D4A574';
                    e.currentTarget.style.color = '#D4A574';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#3a3a2a';
                    e.currentTarget.style.color = '#8B7355';
                  }}
                >
                  Cancel
                </button>
              )}
            </div>
          )}

          {/* Step 2: Code Verification */}
          {step === 2 && (
            <div style={{ animation: 'slideIn 0.4s ease-out', animationFillMode: 'both' }}>
              <h2
                style={{
                  color: '#D4A574',
                  fontSize: '28px',
                  margin: '0 0 12px 0',
                  fontWeight: 600,
                  fontFamily: 'Verdana',
                }}
              >
                Verify Code
              </h2>
              <p
                style={{
                  color: '#8B7355',
                  fontSize: '14px',
                  margin: '0 0 8px 0',
                }}
              >
                Enter the 6-digit code sent to
              </p>
              <p
                style={{
                  color: '#D4A574',
                  fontSize: '13px',
                  margin: '0 0 24px 0',
                  fontWeight: 600,
                }}
              >
                {email}
              </p>

              <input
                type="text"
                placeholder="000000"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                onKeyPress={handleKeyPress}
                autoFocus
                maxLength={6}
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  fontSize: '24px',
                  border: '2px solid #3a3a2a',
                  borderRadius: '8px',
                  background: '#1a1a12',
                  color: '#D4A574',
                  boxSizing: 'border-box',
                  transition: 'all 0.2s ease',
                  textAlign: 'center',
                  letterSpacing: '8px',
                  fontWeight: 600,
                  marginBottom: '24px',
                }}
              />

              {error && (
                <p
                  style={{
                    color: '#ef4444',
                    fontSize: '13px',
                    margin: '0 0 16px 0',
                  }}
                >
                  {error}
                </p>
              )}

              {successMessage && (
                <p
                  style={{
                    color: '#10b981',
                    fontSize: '13px',
                    margin: '0 0 16px 0',
                  }}
                >
                  ✓ {successMessage}
                </p>
              )}

              <button
                onClick={handleVerifyCode}
                disabled={code.length !== 6 || isLoading}
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  border: 'none',
                  borderRadius: '8px',
                  background: 'linear-gradient(135deg, #D4A574, #A0825D)',
                  color: '#000000',
                  fontSize: '15px',
                  fontWeight: 600,
                  cursor: code.length !== 6 || isLoading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s ease',
                  opacity: code.length !== 6 || isLoading ? 0.5 : 1,
                }}
                onMouseEnter={(e) => {
                  if (code.length === 6 && !isLoading) {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(212, 165, 116, 0.3)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                {isLoading ? 'Verifying...' : 'Verify Code'}
              </button>

              <div style={{ marginTop: '16px', textAlign: 'center' }}>
                <p
                  style={{
                    color: '#8B7355',
                    fontSize: '13px',
                    margin: '0 0 12px 0',
                  }}
                >
                  {expiresIn > 0 ? `Code expires in ${expiresIn}s` : 'Code expired'}
                </p>
                <button
                  onClick={handleResendCode}
                  disabled={isLoading}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#D4A574',
                    fontSize: '13px',
                    cursor: isLoading ? 'not-allowed' : 'pointer',
                    textDecoration: 'underline',
                    opacity: isLoading ? 0.5 : 1,
                  }}
                >
                  Resend Code
                </button>
              </div>

              <button
                onClick={() => {
                  setStep(1);
                  setCode('');
                  setError('');
                }}
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  border: '2px solid #3a3a2a',
                  borderRadius: '8px',
                  background: 'transparent',
                  color: '#8B7355',
                  fontSize: '15px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  marginTop: '12px',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#D4A574';
                  e.currentTarget.style.color = '#D4A574';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#3a3a2a';
                  e.currentTarget.style.color = '#8B7355';
                }}
              >
                Back
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
