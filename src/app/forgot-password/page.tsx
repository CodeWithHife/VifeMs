'use client';

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import "./forgot-password.css";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [toastMessage, setToastMessage] = useState<{ title: string; sub: string } | null>(null);

  // Handle Step 1: Send Reset Code
  const handleSendCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      alert("Please enter a valid work email address.");
      return;
    }

    setToastMessage({
      title: "Verification code sent!",
      sub: `We sent a 6-digit verification code to ${email}.`,
    });

    setTimeout(() => {
      setToastMessage(null);
      setStep(2);
    }, 1500);
  };

  // Handle Step 2: Verify Code
  const handleVerifyCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.trim().length < 4) {
      alert("Please enter the verification code sent to your email.");
      return;
    }

    setToastMessage({
      title: "Code verified!",
      sub: "You can now enter your new password.",
    });

    setTimeout(() => {
      setToastMessage(null);
      setStep(3);
    }, 1200);
  };

  // Handle Step 3: Set New Password
  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      alert("New password must be at least 8 characters long.");
      return;
    }
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match. Please re-enter.");
      return;
    }

    setToastMessage({
      title: "Password updated successfully!",
      sub: "Redirecting you to login...",
    });

    setTimeout(() => {
      setToastMessage(null);
      router.push("/login");
    }, 2000);
  };

  return (
    <div className="auth-page-root fp-page-root">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="toast-notification animate-fade-in">
          <div className="toast-icon">
            <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2.5" fill="none">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <div className="toast-text">
            <strong>{toastMessage.title}</strong>
            <span>{toastMessage.sub}</span>
          </div>
        </div>
      )}

      {/* Auth Navigation Header */}
      <header className="auth-header">
        <Link href="/" className="auth-logo-link">
          <img src="/logo/logo.png" alt="VIFEMS Logo" className="auth-header-logo" />
        </Link>
        <Link href="/" className="auth-back-link">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span>Back to home</span>
        </Link>
      </header>

      {/* Split Desktop / Glass Mobile Layout */}
      <div className="split-wrapper">
        {/* LEFT PANEL: Animated Graphic Canvas (Hidden on Mobile) */}
        <div className="split-left desktop-only-left">
          <div className="blob-left blob-1"></div>
          <div className="blob-left blob-2"></div>

          <div className="content animate-fade-up">
            <h1>
              Secure Account <span className="highlight">Recovery</span>
            </h1>
            <p className="lead">
              Reset your password safely with end-to-end token verification in 3 quick steps.
            </p>

            {/* Vector Illustration */}
            <div className="illustration-wrapper animate-float">
              <svg viewBox="0 0 480 280" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="fpGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#1e3a8a" stopOpacity="0.05" />
                  </linearGradient>
                  <linearGradient id="fpShieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#1d4ed8" />
                  </linearGradient>
                </defs>

                {/* Grid Canvas */}
                <path d="M 40 40 L 440 40 M 40 100 L 440 100 M 40 160 L 440 160 M 40 220 L 440 220" stroke="rgba(255,255,255,0.06)" strokeWidth="1" strokeDasharray="4 4" />
                <path d="M 100 20 L 100 260 M 240 20 L 240 260 M 380 20 L 380 260" stroke="rgba(255,255,255,0.06)" strokeWidth="1" strokeDasharray="4 4" />

                {/* Central Shield Lock */}
                <circle cx="240" cy="140" r="85" fill="url(#fpGlow)" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />
                <circle cx="240" cy="140" r="65" stroke="rgba(96, 165, 250, 0.3)" strokeWidth="2" strokeDasharray="6 6" className="gear-spin" style={{ transformOrigin: "240px 140px", animationDuration: "25s" }} />

                {/* Security Shield Card */}
                <rect x="195" y="90" width="90" height="100" rx="18" fill="url(#fpShieldGrad)" stroke="rgba(255,255,255,0.3)" strokeWidth="2" style={{ filter: "drop-shadow(0px 10px 20px rgba(0,0,0,0.3))" }} />

                <path d="M 240 115 L 240 145" stroke="#ffffff" strokeWidth="3.5" strokeLinecap="round" />
                <circle cx="240" cy="158" r="5" fill="#ffffff" />
                <path d="M 225 130 C 225 120, 255 120, 255 130" stroke="#ffffff" strokeWidth="3" fill="none" strokeLinecap="round" />
              </svg>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL: Form Container */}
        <div className="split-right">
          <div className="form-container animate-fade-up">

            {/* Step Progress Bar */}
            <div className="fp-progress-bar">
              <div className={`progress-step ${step >= 1 ? "active" : ""}`}>
                <span className="step-num">1</span>
                <span className="step-text">Email</span>
              </div>
              <div className="progress-line"></div>
              <div className={`progress-step ${step >= 2 ? "active" : ""}`}>
                <span className="step-num">2</span>
                <span className="step-text">Verification</span>
              </div>
              <div className="progress-line"></div>
              <div className={`progress-step ${step >= 3 ? "active" : ""}`}>
                <span className="step-num">3</span>
                <span className="step-text">New Password</span>
              </div>
            </div>

            {/* STEP 1: Email Form */}
            {step === 1 && (
              <form onSubmit={handleSendCode} noValidate className="fp-form-step">
                <div className="form-header">
                  <h2>Reset your password</h2>
                  <p className="form-subtitle">Enter your work email address to receive a 6-digit recovery code.</p>
                </div>

                <div className="form-group">
                  <label htmlFor="fp-email">
                    Work Email Address <span className="required">*</span>
                  </label>
                  <input
                    type="email"
                    id="fp-email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <button type="submit" className="submit-btn">
                  Send Recovery Code
                </button>

                <div className="switch-auth">
                  Remember your password?{" "}
                  <Link href="/login" className="auth-switch-link">
                    Log in
                  </Link>
                </div>
              </form>
            )}

            {/* STEP 2: Code Form */}
            {step === 2 && (
              <form onSubmit={handleVerifyCode} noValidate className="fp-form-step">
                <div className="form-header">
                  <h2>Enter verification code</h2>
                  <p className="form-subtitle">We sent a 6-digit code to <strong>{email}</strong>.</p>
                </div>

                <div className="form-group">
                  <label htmlFor="fp-code">
                    Verification Code <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    id="fp-code"
                    placeholder="e.g. 849204"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    maxLength={6}
                    required
                  />
                </div>

                <button type="submit" className="submit-btn">
                  Verify Code & Continue
                </button>

                <div className="switch-auth">
                  Didn&apos;t receive the code?{" "}
                  <button type="button" onClick={() => setStep(1)} className="auth-switch-link" style={{ background: "none", border: "none", cursor: "pointer" }}>
                    Resend Code
                  </button>
                </div>
              </form>
            )}

            {/* STEP 3: New Password Form */}
            {step === 3 && (
              <form onSubmit={handleResetPassword} noValidate className="fp-form-step">
                <div className="form-header">
                  <h2>Set new password</h2>
                  <p className="form-subtitle">Choose a secure password with at least 8 characters.</p>
                </div>

                <div className="form-group">
                  <label htmlFor="new-password">
                    New Password <span className="required">*</span>
                  </label>
                  <div className="password-toggle">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="new-password"
                      placeholder="Min. 8 characters"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      minLength={8}
                    />
                    <button
                      type="button"
                      className="toggle-btn"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label="Toggle password visibility"
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="confirm-password">
                    Confirm New Password <span className="required">*</span>
                  </label>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="confirm-password"
                    placeholder="Re-enter new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>

                <button type="submit" className="submit-btn">
                  Update Password & Log In
                </button>
              </form>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
