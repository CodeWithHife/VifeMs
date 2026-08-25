'use client';

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import "../login/login.css";

export default function ForgotPasswordPage() {
  const { forgotPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<{ title: string; sub: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!email.trim()) {
      setFormError("Email is required.");
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setFormError("Please enter a valid email address.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await forgotPassword(email.trim());
      setIsSubmitted(true);
      setToastMessage({
        title: "✉️ Email Sent",
        sub: response.message || "Password reset instructions sent if account exists.",
      });
      setTimeout(() => setToastMessage(null), 6000);
    } catch (err: any) {
      setFormError(err.message || "Failed to process request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-page-root">
      {/* Header with Logo and Back Link */}
      <header className="auth-header">
        <Link href="/" className="auth-logo-link" title="VIFEMS Home">
          <img src="/logo/logo.png" alt="VIFEMS Logo" className="auth-header-logo" />
        </Link>
        <Link href="/login" className="auth-back-link">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span>Back to login</span>
        </Link>
      </header>

      <div className="split-wrapper">
        {/* LEFT: Blue side with illustration */}
        <div className="split-left desktop-only-left">
          <div className="blob-left blob-1"></div>
          <div className="blob-left blob-2"></div>

          <div className="content animate-fade-up">
            <h1>
              Account <span className="highlight">Recovery</span>
            </h1>
            <p className="lead">
              Don't worry, reset instructions will be sent straight to your registered email address.
            </p>
          </div>
        </div>

        {/* RIGHT: Form container */}
        <div className="split-right">
          <div className="form-container animate-fade-up">
            <div className="form-header">
              <h2>Forgot your password?</h2>
              <p>Enter the email address associated with your account and we&apos;ll send you a recovery link.</p>
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

            {isSubmitted ? (
              <div style={{ textAlign: "center", padding: "20px 0" }}>
                <div
                  style={{
                    width: "56px",
                    height: "56px",
                    borderRadius: "50%",
                    background: "rgba(37, 99, 235, 0.1)",
                    color: "#2563eb",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 16px auto",
                  }}
                >
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 17a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9.5C2 7 4 5 6.5 5H18c2.2 0 4 1.8 4 4v8Z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                </div>
                <h3 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "8px", color: "#0f172a" }}>
                  Check your email
                </h3>
                <p style={{ color: "#64748b", fontSize: "0.95rem", lineHeight: 1.6, marginBottom: "24px" }}>
                  We sent password reset instructions to <strong>{email}</strong>. If you don&apos;t see it, check your spam folder.
                </p>

                <button
                  type="button"
                  onClick={() => setIsSubmitted(false)}
                  className="btn btn-primary"
                  style={{ marginBottom: "16px" }}
                >
                  Try another email
                </button>

                <Link href="/login" className="auth-switch-link" style={{ display: "inline-block" }}>
                  Return to login
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate>
                <div className="form-group">
                  <label htmlFor="email">
                    Email address <span className="required">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (formError) setFormError(null);
                    }}
                    required
                  />
                </div>

                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                  {isSubmitting ? "Sending reset link..." : "Send reset link"}
                </button>

                <div className="form-footer" style={{ marginTop: "24px" }}>
                  <p className="auth-switch-prompt">
                    Remember your password? <Link href="/login" className="auth-switch-link">Log in</Link>
                  </p>
                </div>
              </form>
            )}
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
