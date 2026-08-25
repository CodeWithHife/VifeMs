'use client';

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import "../login/login.css";

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { verifyEmail, resendVerification } = useAuth();

  const [tokenInput, setTokenInput] = useState("");
  const [resendEmail, setResendEmail] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [showResend, setShowResend] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<{ title: string; sub: string } | null>(null);

  // Auto-verify if token param exists in URL
  useEffect(() => {
    const urlToken = searchParams.get("token");
    if (urlToken) {
      setTokenInput(urlToken);
      handleTokenVerification(urlToken);
    }
  }, [searchParams]);

  const handleTokenVerification = async (tok: string) => {
    if (!tok.trim()) {
      setErrorMessage("Verification token cannot be empty.");
      return;
    }
    setIsVerifying(true);
    setErrorMessage(null);
    setStatusMessage(null);

    try {
      const res = await verifyEmail(tok.trim());
      setIsVerified(true);
      setStatusMessage(res.message || "Email address verified successfully!");
      setToastMessage({
        title: "🎉 Verified!",
        sub: "Your email has been verified. Redirecting to login...",
      });
      setTimeout(() => {
        router.push("/login");
      }, 2500);
    } catch (err: any) {
      setErrorMessage(err.message || "Invalid or expired verification token.");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleTokenVerification(tokenInput);
  };

  const handleResendSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resendEmail.trim()) {
      setErrorMessage("Please enter your email address.");
      return;
    }
    setIsResending(true);
    setErrorMessage(null);

    try {
      const res = await resendVerification(resendEmail.trim());
      setToastMessage({
        title: "✉️ Link Sent",
        sub: res.message || "Verification email has been resent.",
      });
      setStatusMessage("Verification email sent! Please check your inbox.");
      setShowResend(false);
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to resend verification email.");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="auth-page-root">
      {/* Header */}
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
        {/* LEFT */}
        <div className="split-left desktop-only-left">
          <div className="blob-left blob-1"></div>
          <div className="blob-left blob-2"></div>

          <div className="content animate-fade-up">
            <h1>
              Verify your <span className="highlight">Email Address</span>
            </h1>
            <p className="lead">
              Confirm your email address to activate all enterprise modules and secure your organization&apos;s workspace.
            </p>
          </div>
        </div>

        {/* RIGHT */}
        <div className="split-right">
          <div className="form-container animate-fade-up">
            <div className="form-header">
              <h2>Email Verification</h2>
              <p>
                {isVerified
                  ? "Your account is activated!"
                  : "We sent a verification link to your inbox. Verify to continue."}
              </p>
            </div>

            {errorMessage && (
              <div className="auth-error-banner" role="alert">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <span>{errorMessage}</span>
              </div>
            )}

            {isVerified ? (
              <div style={{ textAlign: "center", padding: "20px 0" }}>
                <div
                  style={{
                    width: "56px",
                    height: "56px",
                    borderRadius: "50%",
                    background: "rgba(34, 197, 94, 0.1)",
                    color: "#16a34a",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 16px auto",
                  }}
                >
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <h3 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "8px", color: "#0f172a" }}>
                  Email Verified Successfully
                </h3>
                <p style={{ color: "#64748b", fontSize: "0.95rem", lineHeight: 1.6, marginBottom: "24px" }}>
                  {statusMessage || "Your email address has been confirmed. You can now log into your account."}
                </p>

                <Link href="/login" className="btn btn-primary" style={{ display: "inline-block", textAlign: "center", width: "100%" }}>
                  Proceed to login
                </Link>
              </div>
            ) : showResend ? (
              <form onSubmit={handleResendSubmit} noValidate>
                <div className="form-group">
                  <label htmlFor="resendEmail">
                    Registered Email <span className="required">*</span>
                  </label>
                  <input
                    type="email"
                    id="resendEmail"
                    placeholder="you@company.com"
                    value={resendEmail}
                    onChange={(e) => setResendEmail(e.target.value)}
                    required
                  />
                </div>

                <button type="submit" className="btn btn-primary" disabled={isResending}>
                  {isResending ? "Sending verification email..." : "Resend Verification Link"}
                </button>

                <button
                  type="button"
                  onClick={() => setShowResend(false)}
                  style={{
                    marginTop: "12px",
                    background: "transparent",
                    border: "none",
                    color: "#2563eb",
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    cursor: "pointer",
                    width: "100%",
                    textAlign: "center",
                  }}
                >
                  Enter token manually instead
                </button>
              </form>
            ) : (
              <form onSubmit={handleManualSubmit} noValidate>
                <div className="form-group">
                  <label htmlFor="token">
                    Verification Token <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    id="token"
                    placeholder="Paste token from email link"
                    value={tokenInput}
                    onChange={(e) => setTokenInput(e.target.value)}
                    required
                  />
                </div>

                <button type="submit" className="btn btn-primary" disabled={isVerifying}>
                  {isVerifying ? "Verifying..." : "Verify Email"}
                </button>

                <div className="divider">
                  <span>didn&apos;t get the email?</span>
                </div>

                <button
                  type="button"
                  onClick={() => setShowResend(true)}
                  className="btn"
                  style={{
                    background: "transparent",
                    border: "1px solid #e2e8f0",
                    color: "#0f172a",
                    fontWeight: 600,
                    width: "100%",
                    padding: "12px",
                    borderRadius: "10px",
                    cursor: "pointer",
                  }}
                >
                  Resend verification email
                </button>

                <div className="form-footer" style={{ marginTop: "24px" }}>
                  <p className="auth-switch-prompt">
                    Ready to sign in? <Link href="/login" className="auth-switch-link">Log in</Link>
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

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="auth-page-root" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>Loading...</div>}>
      <VerifyEmailContent />
    </Suspense>
  );
}
