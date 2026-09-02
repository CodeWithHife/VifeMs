'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import '../login/login.css';

function CheckEmailContent() {
  const searchParams = useSearchParams();
  const emailParam = searchParams.get('email') || '';
  const { resendVerification } = useAuth();

  const [resending, setResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleResend = async () => {
    if (!emailParam) {
      setErrorMessage('No email address provided to resend verification.');
      return;
    }
    setResending(true);
    setErrorMessage(null);
    setResendSuccess(false);

    try {
      await resendVerification(emailParam);
      setResendSuccess(true);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to resend verification email.');
    } finally {
      setResending(false);
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
        {/* LEFT: Blue side with illustration */}
        <div className="split-left desktop-only-left">
          <div className="blob-left blob-1"></div>
          <div className="blob-left blob-2"></div>

          <div className="content animate-fade-up">
            <h1>
              Almost <span className="highlight">there!</span>
            </h1>
            <p className="lead">
              We&apos;re getting your workspace ready. Just one quick step left to confirm your email.
            </p>
          </div>
        </div>

        {/* RIGHT: Confirmation container */}
        <div className="split-right">
          <div className="form-container animate-fade-up" style={{ textAlign: 'center', padding: '40px 32px' }}>
            <div
              style={{
                width: '72px',
                height: '72px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.15), rgba(59, 130, 246, 0.05))',
                border: '1px solid rgba(37, 99, 235, 0.2)',
                color: '#2563eb',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 24px auto',
              }}
            >
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
            </div>

            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', marginBottom: '12px' }}>
              Check your email
            </h2>

            <p style={{ color: '#64748b', fontSize: '1rem', lineHeight: 1.6, marginBottom: '24px' }}>
              We&apos;ve sent a verification link to{' '}
              <strong style={{ color: '#0f172a', wordBreak: 'break-word' }}>
                {emailParam || 'your registered email'}
              </strong>
              . Click the link to verify your account and activate your workspace.
            </p>

            {errorMessage && (
              <div className="auth-error-banner" role="alert" style={{ marginBottom: '20px', textAlign: 'left' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <span>{errorMessage}</span>
              </div>
            )}

            {resendSuccess && (
              <div
                style={{
                  background: 'rgba(34, 197, 94, 0.1)',
                  border: '1px solid rgba(34, 197, 94, 0.3)',
                  color: '#15803d',
                  borderRadius: '10px',
                  padding: '12px 16px',
                  marginBottom: '20px',
                  fontSize: '0.9rem',
                  fontWeight: 500,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  textAlign: 'left',
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>Verification email resent! Please check your inbox and spam folder.</span>
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px' }}>
              {emailParam && (
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={resending}
                  className="btn"
                  style={{
                    background: '#f1f5f9',
                    border: '1px solid #e2e8f0',
                    color: '#0f172a',
                    fontWeight: 600,
                    width: '100%',
                    padding: '12px',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  {resending ? 'Resending email...' : 'Resend verification email'}
                </button>
              )}

              <Link
                href="/onboarding"
                className="btn btn-primary"
                style={{ width: '100%', display: 'inline-block', textAlign: 'center' }}
              >
                Proceed to Onboarding
              </Link>
            </div>

            <div className="form-footer" style={{ marginTop: '28px' }}>
              <p className="auth-switch-prompt">
                Wrong email address? <Link href="/signup" className="auth-switch-link">Sign up again</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="auth-page-root" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          Loading...
        </div>
      }
    >
      <CheckEmailContent />
    </Suspense>
  );
}
