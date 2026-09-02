'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

function OAuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { handleOAuthSuccess } = useAuth();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const processOAuth = async () => {
      const token = searchParams.get('token') || searchParams.get('accessToken');
      const refreshToken = searchParams.get('refreshToken') || undefined;
      const errorParam = searchParams.get('error');

      if (errorParam) {
        setError(errorParam);
        return;
      }

      if (token) {
        try {
          await handleOAuthSuccess(token, refreshToken);
          router.push('/onboarding');
        } catch {
          setError('Failed to authenticate session with Google OAuth.');
        }
      } else {
        // In case tokens were set via cookie or query params are missing
        router.push('/login');
      }
    };

    processOAuth();
  }, [searchParams, handleOAuthSuccess, router]);

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "'Inter', sans-serif",
        background: '#f8fafc',
        padding: '24px',
      }}
    >
      <div
        style={{
          background: '#ffffff',
          borderRadius: '16px',
          padding: '40px',
          maxWidth: '420px',
          width: '100%',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05)',
          textAlign: 'center',
          border: '1px solid #e2e8f0',
        }}
      >
        <img
          src="/logo/logo.png"
          alt="VIFEMS Logo"
          style={{ height: '40px', margin: '0 auto 24px auto', objectFit: 'contain' }}
        />

        {error ? (
          <div>
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                background: 'rgba(239, 68, 68, 0.1)',
                color: '#ef4444',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px auto',
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>
              Authentication Failed
            </h3>
            <p style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '20px' }}>{error}</p>
            <Link
              href="/login"
              style={{
                display: 'inline-block',
                background: '#2563eb',
                color: '#ffffff',
                padding: '10px 20px',
                borderRadius: '8px',
                textDecoration: 'none',
                fontWeight: 600,
                fontSize: '0.9rem',
              }}
            >
              Back to Login
            </Link>
          </div>
        ) : (
          <div>
            <div
              style={{
                width: '48px',
                height: '48px',
                border: '3px solid #e2e8f0',
                borderTopColor: '#2563eb',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                margin: '0 auto 16px auto',
              }}
            />
            <h3 style={{ fontSize: '1.15rem', fontWeight: 600, color: '#0f172a', marginBottom: '6px' }}>
              Signing you in...
            </h3>
            <p style={{ fontSize: '0.875rem', color: '#64748b' }}>
              Connecting your Google account with VIFEMS
            </p>
            <style>{`
              @keyframes spin {
                to { transform: rotate(360deg); }
              }
            `}</style>
          </div>
        )}
      </div>
    </div>
  );
}

export default function OAuthCallbackPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading...</div>}>
      <OAuthCallbackContent />
    </Suspense>
  );
}
