'use client';

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import "../login/login.css";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { resetPassword } = useAuth();

  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<{ title: string; sub: string } | null>(null);

  useEffect(() => {
    const urlToken = searchParams.get("token");
    if (urlToken) {
      setToken(urlToken);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!token.trim()) {
      setFormError("Reset token is required.");
      return;
    }
    if (newPassword.length < 8) {
      setFormError("Password must be at least 8 characters long.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setFormError("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await resetPassword({
        token: token.trim(),
        newPassword,
        confirmPassword,
      });

      setIsSuccess(true);
      setToastMessage({
        title: "✅ Password Reset Successfully",
        sub: response.message || "Redirecting you to login...",
      });

      setTimeout(() => {
        router.push("/login");
      }, 2500);
    } catch (err: any) {
      setFormError(err.message || "Invalid or expired token. Please try again.");
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
        {/* LEFT: Blue side */}
        <div className="split-left desktop-only-left">
          <div className="blob-left blob-1"></div>
          <div className="blob-left blob-2"></div>

          <div className="content animate-fade-up">
            <h1>
              Set your <span className="highlight">New Password</span>
            </h1>
            <p className="lead">
              Create a strong password to keep your enterprise workspace safe and secure.
            </p>
          </div>
        </div>

        {/* RIGHT: Form container */}
        <div className="split-right">
          <div className="form-container animate-fade-up">
            <div className="form-header">
              <h2>Reset your password</h2>
              <p>Enter your new password below to regain access to your account.</p>
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

            {isSuccess ? (
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
                  Password reset successfully
                </h3>
                <p style={{ color: "#64748b", fontSize: "0.95rem", lineHeight: 1.6, marginBottom: "24px" }}>
                  Your password has been updated. You can now log in with your new credentials.
                </p>

                <Link href="/login" className="btn btn-primary" style={{ display: "inline-block", textAlign: "center", width: "100%" }}>
                  Proceed to login
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate>
                {!searchParams.get("token") && (
                  <div className="form-group">
                    <label htmlFor="token">
                      Reset Token <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      id="token"
                      placeholder="Paste your reset token here"
                      value={token}
                      onChange={(e) => {
                        setToken(e.target.value);
                        if (formError) setFormError(null);
                      }}
                      required
                    />
                  </div>
                )}

                <div className="form-group">
                  <label htmlFor="newPassword">
                    New Password <span className="required">*</span>
                  </label>
                  <div className="password-toggle">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="newPassword"
                      placeholder="Min. 8 characters"
                      value={newPassword}
                      onChange={(e) => {
                        setNewPassword(e.target.value);
                        if (formError) setFormError(null);
                      }}
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

                <div className="form-group">
                  <label htmlFor="confirmPassword">
                    Confirm New Password <span className="required">*</span>
                  </label>
                  <div className="password-toggle">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      id="confirmPassword"
                      placeholder="Re-enter your new password"
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        if (formError) setFormError(null);
                      }}
                      required
                      minLength={8}
                    />
                    <button
                      type="button"
                      className="toggle-btn"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      aria-label="Toggle confirm password visibility"
                    >
                      {showConfirmPassword ? (
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

                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                  {isSubmitting ? "Updating password..." : "Update Password"}
                </button>

                <div className="form-footer" style={{ marginTop: "24px" }}>
                  <p className="auth-switch-prompt">
                    Back to <Link href="/login" className="auth-switch-link">Log in</Link>
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

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="auth-page-root" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>Loading...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
