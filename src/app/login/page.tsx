'use client';

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { authService } from "@/services/auth.service";
import "./login.css";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<{ title: string; sub: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const errors: string[] = [];
    if (!email.trim()) errors.push("Email is required.");
    if (email && !/^\S+@\S+\.\S+$/.test(email)) errors.push("Please enter a valid email address.");
    if (password.length < 8) errors.push("Password must be at least 8 characters.");

    if (errors.length > 0) {
      setFormError(errors[0]);
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await login({ email: email.trim(), password });
      setToastMessage({
        title: "🎉 Welcome back!",
        sub: result.message || "Redirecting you...",
      });

      setTimeout(() => {
        router.push("/");
      }, 1500);
    } catch (err: any) {
      const msg = err.message || "Failed to log in. Please check your credentials.";
      setFormError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleAuth = () => {
    setFormError(null);
    setToastMessage({
      title: "Google Authentication",
      sub: "Redirecting to Google Sign-In...",
    });
    window.location.href = authService.getGoogleAuthUrl();
  };

  return (
    <div className="auth-page-root">
      {/* Header with Logo and Back Link */}
      <header className="auth-header">
        <Link href="/" className="auth-logo-link" title="VIFEMS Home">
          <img src="/logo/logo.png" alt="VIFEMS Logo" className="auth-header-logo" />
        </Link>
        <Link href="/" className="auth-back-link">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span>Back to home</span>
        </Link>
      </header>



      <div className="split-wrapper">
        {/* LEFT: Blue side with security illustration (Hidden on Mobile) */}
        <div className="split-left desktop-only-left">
          <div className="blob-left blob-1"></div>
          <div className="blob-left blob-2"></div>

          <div className="content animate-fade-up">
            <h1>
              Welcome back to your <span className="highlight">workspace</span>
            </h1>

            <p className="lead">
              Sign in to continue managing your people, attendance, payments, and reports.
            </p>

            <div className="illustration-wrapper animate-float">
              <svg viewBox="0 0 480 300" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="240" cy="150" r="130" fill="rgba(255, 255, 255, 0.04)" stroke="rgba(255, 255, 255, 0.1)" strokeWidth="2" />
                <circle cx="240" cy="150" r="100" fill="rgba(255, 255, 255, 0.02)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="1.5" />

                <rect x="160" y="100" width="160" height="110" rx="16" fill="#1e293b" stroke="rgba(255, 255, 255, 0.3)" strokeWidth="2" />
                <rect x="180" y="112" width="120" height="6" rx="3" fill="#475569" />

                <g className="bar-grow">
                  <rect x="180" y="130" width="16" height="40" rx="4" fill="#3b82f6" opacity="0.6" />
                </g>
                <g className="bar-grow bar-grow-2">
                  <rect x="204" y="145" width="16" height="25" rx="4" fill="#60a5fa" opacity="0.6" />
                </g>
                <g className="bar-grow bar-grow-3">
                  <rect x="228" y="120" width="16" height="50" rx="4" fill="#93c5fd" opacity="0.7" />
                </g>

                <g className="pulse-ring" style={{ animationDelay: "0.5s" }}>
                  <path d="M 248 140 L 265 140 L 265 155 C 265 165, 256.5 172, 256.5 172 C 256.5 172, 248 165, 248 155 Z" fill="rgba(147, 197, 253, 0.15)" stroke="#93c5fd" strokeWidth="2" opacity="0.9" />
                  <rect x="252" y="152" width="18" height="14" rx="3" fill="#93c5fd" opacity="0.9" />
                  <path d="M 255 152 V 147 A 6 6 0 0 1 267 147 V 152" stroke="#93c5fd" strokeWidth="2.5" fill="none" />
                  <circle cx="261" cy="157" r="2.5" fill="#0a1a4a" />
                  <line x1="261" y1="159.5" x2="259.5" y2="163" stroke="#0a1a4a" strokeWidth="2" />
                </g>

                <g className="pulse-ring" style={{ animationDelay: "1.5s" }}>
                  <circle cx="120" cy="80" r="18" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
                  <path d="M 114 76 L 120 71 L 126 76 V 83 C 126 88, 120 92, 120 92 C 120 92, 114 88, 114 83 Z" stroke="#93c5fd" strokeWidth="2" fill="none" opacity="0.9" />
                  <path d="M 117 79 L 119 81 L 123 76" stroke="#93c5fd" strokeWidth="2" fill="none" opacity="0.9" />
                </g>

                <g className="gear" style={{ transformOrigin: "370px 90px" }}>
                  <circle cx="370" cy="90" r="14" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
                  <circle cx="370" cy="90" r="6" stroke="#93c5fd" strokeWidth="2" opacity="0.8" />
                  <circle cx="370" cy="90" r="2" fill="#93c5fd" opacity="0.8" />
                </g>

                <g className="glow-key">
                  <rect x="75" y="185" width="30" height="34" rx="6" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
                  <rect x="85" y="200" width="18" height="4" rx="2" fill="#93c5fd" opacity="0.8" />
                  <circle cx="82" cy="202" r="6" stroke="#93c5fd" strokeWidth="2" fill="none" opacity="0.8" />
                  <line x1="98" y1="200" x2="98" y2="204" stroke="#93c5fd" strokeWidth="2" opacity="0.8" />
                  <line x1="102" y1="200" x2="102" y2="206" stroke="#93c5fd" strokeWidth="2" opacity="0.8" />
                </g>

                <g>
                  <rect x="375" y="185" width="30" height="34" rx="6" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
                  <circle cx="390" cy="195" r="6" stroke="#93c5fd" strokeWidth="2" fill="none" opacity="0.8" />
                  <path d="M 382 207 C 382 203, 398 203, 398 207" stroke="#93c5fd" strokeWidth="2" fill="none" opacity="0.8" />
                  <path d="M 395 190 L 397 192 L 401 188" stroke="#93c5fd" strokeWidth="2" fill="none" />
                </g>

                <line x1="136" y1="85" x2="160" y2="110" stroke="rgba(255, 255, 255, 0.15)" strokeWidth="1.5" strokeDasharray="4 4" />
                <line x1="356" y1="95" x2="320" y2="115" stroke="rgba(255, 255, 255, 0.15)" strokeWidth="1.5" strokeDasharray="4 4" />
                <line x1="105" y1="210" x2="160" y2="190" stroke="rgba(255, 255, 255, 0.15)" strokeWidth="1.5" strokeDasharray="4 4" />
                <line x1="390" y1="200" x2="320" y2="185" stroke="rgba(255, 255, 255, 0.15)" strokeWidth="1.5" strokeDasharray="4 4" />

                <circle cx="240" cy="155" r="4" fill="#60a5fa" opacity="0.8" className="pulse-ring" style={{ animationDelay: "0.5s" }} />
              </svg>
            </div>
          </div>
        </div>

        {/* RIGHT: Form container */}
        <div className="split-right">
          <div className="form-container animate-fade-up">
            <div className="form-header">
              <h2>Log in to your account</h2>
            </div>

            {formError && (
              <div className="auth-error-banner" role="alert">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <span>{formError}</span>
              </div>
            )}


            <form onSubmit={handleSubmit} noValidate>
              <div className="form-group">
                <label htmlFor="email">
                  Email <span className="required">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">
                  Password <span className="required">*</span>
                </label>
                <div className="password-toggle">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={8}
                  />
                  <button
                    type="button"
                    className="toggle-btn"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? (
                      <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </svg>
                    ) : (
                      <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <div className="remember-forgot">
                <div className="form-checkbox">
                  <input
                    type="checkbox"
                    id="remember"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                  />
                  <label htmlFor="remember">Remember me</label>
                </div>
                <Link href="/forgot-password" className="forgot-link">Forgot password?</Link>
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={isSubmitting}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                }}
              >
                {isSubmitting ? (
                  <>
                    <span
                      style={{
                        display: "inline-block",
                        width: "16px",
                        height: "16px",
                        border: "2px solid rgba(255, 255, 255, 0.4)",
                        borderTopColor: "#ffffff",
                        borderRadius: "50%",
                        animation: "spin 0.8s linear infinite",
                      }}
                    />
                    <span>Logging in...</span>
                  </>
                ) : (
                  "Log in"
                )}
              </button>

              <div className="divider">
                <span>or continue with</span>
              </div>

              <button type="button" className="btn btn-google" onClick={handleGoogleAuth}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19.8055 10.2302C19.8055 9.55056 19.7459 8.86711 19.62 8.19824H10.2V12.0491H15.6515C15.4265 13.2911 14.7614 14.3898 13.787 15.0879V17.5866H16.9557C18.7645 15.8449 19.8055 13.2728 19.8055 10.2302Z" fill="#4285F4" />
                  <path d="M10.2 20C12.83 20 15.0399 19.1134 16.9595 17.5866L13.7908 15.0879C12.7595 15.7977 11.497 16.1982 10.2037 16.1982C7.6608 16.1982 5.5089 14.4892 4.7469 12.1544H1.48633V14.7165C3.45253 18.5455 7.3718 20 10.2 20Z" fill="#34A853" />
                  <path d="M4.7433 12.1544C4.3788 11.1544 4.3788 10.0456 4.7433 9.04562V6.48352H1.4864C0.4974 8.44452 0.4974 10.7555 1.4864 12.7165L4.7433 12.1544Z" fill="#FBBC04" />
                  <path d="M10.2 3.8018C11.5768 3.7788 12.8999 4.3063 13.9271 5.2809L16.9704 2.2376C14.9586 0.3656 12.2808 -0.0584 9.9381 0.1516C7.3718 0.1516 3.45253 1.606 1.48633 5.4344L4.74323 8.0064C5.50153 5.6744 7.65713 3.8018 10.2 3.8018Z" fill="#EA4335" />
                </svg>
                Sign in with Google
              </button>

              <div className="form-footer">
                <p className="auth-switch-prompt">
                  Don't have an account? <Link href="/signup" className="auth-switch-link">Sign up</Link>
                </p>
                <div className="security-note">Secure login · 256-bit encryption</div>
              </div>

            </form>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="toast show">
          <div className="toast-title">{toastMessage.title}</div>
          <div className="toast-sub">{toastMessage.sub}</div>
        </div>
      )}
    </div>
  );
}
