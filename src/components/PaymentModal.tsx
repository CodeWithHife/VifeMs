'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedModules?: string[];
  setupFee?: number;
  monthlyFee?: number;
  totalAmount?: number;
}

const ACCOUNT_NUMBER = "7070295803";
const ACCOUNT_NAME = "OBADIMU IFEOLUWA";
const BANK_NAME = "OPay (Paycom)";
const WHATSAPP_NUMBER = "2347070295803";

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  selectedModules = ["Participants", "Training", "Attendance"],
  setupFee = 5000,
  monthlyFee = 15000,
  totalAmount = 20000,
}) => {
  const [copied, setCopied] = useState(false);
  const [hasClickedPaid, setHasClickedPaid] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(ACCOUNT_NUMBER);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const formattedTotal = "₦" + totalAmount.toLocaleString("en-NG");
  const formattedSetup = "₦" + setupFee.toLocaleString("en-NG");
  const formattedMonthly = "₦" + monthlyFee.toLocaleString("en-NG");

  const modulesListText = selectedModules.length > 0 ? selectedModules.join(", ") : "Standard Workspace";

  const messageText = encodeURIComponent(
    `Hello Ifeoluwa, I have made a payment of ${formattedTotal} for my VIFEMS workspace!\n\n` +
    `📋 Order Summary:\n` +
    `• Setup Fee: ${formattedSetup}\n` +
    `• Monthly Modules: ${formattedMonthly}\n` +
    `• Selected Modules: ${modulesListText}\n` +
    `• Total Paid: ${formattedTotal}\n` +
    `• Account Paid To: 7070295803 (OPay - OBADIMU IFEOLUWA)\n\n` +
    `I am attaching my payment proof/screenshot below. Please verify and activate my workspace.`
  );

  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${messageText}`;

  const handlePaidClick = () => {
    setHasClickedPaid(true);
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.7)',
        backdropFilter: 'blur(8px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
      }}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200"
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#ffffff',
          borderRadius: '20px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          maxWidth: '520px',
          width: '100%',
          maxHeight: '92vh',
          overflowY: 'auto',
          border: '1px solid #e2e8f0',
          position: 'relative',
        }}
      >
        {/* Header */}
        <div
          style={{
            background: 'linear-gradient(135deg, #1e3a8a 0%, #0f172a 100%)',
            color: '#ffffff',
            padding: '24px 28px',
            position: 'relative',
          }}
        >
          <button
            onClick={onClose}
            aria-label="Close"
            style={{
              position: 'absolute',
              top: '18px',
              right: '18px',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.15)',
              border: 'none',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              fontSize: '18px',
              transition: 'background 0.2s',
            }}
            onMouseOver={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)')}
            onMouseOut={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)')}
          >
            ✕
          </button>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 10px', borderRadius: '12px', background: 'rgba(59, 130, 246, 0.25)', fontSize: '12px', fontWeight: 600, color: '#93c5fd', marginBottom: '10px' }}>
            <span>🔒 Direct Bank Transfer</span>
          </div>
          <h3 style={{ margin: 0, fontSize: '1.45rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#ffffff' }}>
            Complete Your Workspace Order
          </h3>
          <p style={{ margin: '6px 0 0', fontSize: '0.88rem', color: '#cbd5e1', lineHeight: 1.4 }}>
            Pay via bank transfer and confirm on WhatsApp for immediate setup.
          </p>
        </div>

        <div style={{ padding: '24px 28px' }}>
          {/* Order Summary Pill Box */}
          <div
            style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '14px',
              padding: '16px 18px',
              marginBottom: '20px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', fontSize: '13px', color: '#64748b' }}>
              <span>Setup & Configuration</span>
              <span style={{ fontWeight: 600, color: '#1e293b' }}>{formattedSetup} (one-time)</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', fontSize: '13px', color: '#64748b' }}>
              <span>Monthly Subscription</span>
              <span style={{ fontWeight: 600, color: '#1e293b' }}>{formattedMonthly} / mo</span>
            </div>
            {selectedModules.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '12px' }}>
                {selectedModules.map((mod, i) => (
                  <span
                    key={i}
                    style={{
                      background: '#e0e7ff',
                      color: '#3730a3',
                      fontSize: '11px',
                      fontWeight: 600,
                      padding: '2px 8px',
                      borderRadius: '8px',
                    }}
                  >
                    {mod}
                  </span>
                ))}
              </div>
            )}
            <div style={{ borderTop: '1px dashed #cbd5e1', paddingTop: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>Total Amount to Pay</span>
              <span style={{ fontSize: '1.4rem', fontWeight: 800, color: '#1d4ed8' }}>{formattedTotal}</span>
            </div>
          </div>

          {/* Bank Account Details Card */}
          <div
            style={{
              background: 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%)',
              border: '2px solid #86efac',
              borderRadius: '16px',
              padding: '18px 20px',
              marginBottom: '20px',
              position: 'relative',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', background: '#16a34a' }}></span>
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#166534', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Bank Details
                </span>
              </div>
              <span
                style={{
                  background: '#16a34a',
                  color: '#ffffff',
                  fontSize: '11px',
                  fontWeight: 700,
                  padding: '2px 8px',
                  borderRadius: '6px',
                }}
              >
                OPay (Paycom)
              </span>
            </div>

            {/* Account Number with 1-click copy */}
            <div style={{ marginBottom: '12px' }}>
              <div style={{ fontSize: '12px', color: '#475569', marginBottom: '4px', fontWeight: 500 }}>Account Number:</div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: '#ffffff',
                  border: '1.5px solid #bbf7d0',
                  borderRadius: '10px',
                  padding: '8px 14px',
                }}
              >
                <span style={{ fontFamily: 'monospace, monospace', fontSize: '1.45rem', fontWeight: 800, letterSpacing: '0.08em', color: '#0f172a' }}>
                  {ACCOUNT_NUMBER}
                </span>
                <button
                  type="button"
                  onClick={handleCopy}
                  style={{
                    background: copied ? '#15803d' : '#1e3a8a',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '7px 14px',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    transition: 'all 0.2s',
                  }}
                >
                  {copied ? (
                    <>
                      <span>✓</span> Copied!
                    </>
                  ) : (
                    <>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                      </svg>
                      Copy
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Account Name */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px', paddingTop: '4px' }}>
              <span style={{ color: '#475569' }}>Account Name:</span>
              <span style={{ fontWeight: 700, color: '#0f172a' }}>{ACCOUNT_NAME}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px', marginTop: '4px' }}>
              <span style={{ color: '#475569' }}>Bank Name:</span>
              <span style={{ fontWeight: 700, color: '#0f172a' }}>{BANK_NAME}</span>
            </div>
          </div>

          {/* Simple Steps */}
          <div style={{ marginBottom: '22px', fontSize: '12.5px', color: '#475569', lineHeight: 1.55 }}>
            <div style={{ fontWeight: 600, color: '#1e293b', marginBottom: '6px' }}>How to complete:</div>
            <ol style={{ margin: 0, paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <li>Transfer <strong>{formattedTotal}</strong> to the OPay account above.</li>
              <li>Click the green button below: <strong>&ldquo;I Have Paid&rdquo;</strong>.</li>
              <li>Drop your screenshot on WhatsApp (<strong>07070295803</strong>) for quick activation!</li>
            </ol>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button
              type="button"
              onClick={handlePaidClick}
              id="confirm-payment-whatsapp"
              style={{
                background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                color: '#ffffff',
                border: 'none',
                borderRadius: '12px',
                padding: '14px 20px',
                fontSize: '15px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                boxShadow: '0 4px 14px rgba(34, 197, 94, 0.35)',
                transition: 'transform 0.15s, box-shadow 0.15s',
              }}
              onMouseOver={(e) => (e.currentTarget.style.transform = 'translateY(-1px)')}
              onMouseOut={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
              </svg>
              <span>I Have Paid — Send Screenshot</span>
            </button>

            {hasClickedPaid && (
              <div
                style={{
                  background: '#f0fdf4',
                  border: '1px solid #bbf7d0',
                  borderRadius: '10px',
                  padding: '10px 14px',
                  fontSize: '12px',
                  color: '#166534',
                  textAlign: 'center',
                }}
              >
                ✓ WhatsApp opened! Send your screenshot in the chat. Next, you can{" "}
                <Link href="/signup" style={{ textDecoration: 'underline', fontWeight: 700, color: '#15803d' }}>
                  create your account
                </Link>{" "}
                to speed up activation.
              </div>
            )}

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '13px', color: '#64748b', marginTop: '4px' }}>
              <span>Want to register first?</span>
              <Link
                href="/signup"
                onClick={onClose}
                style={{ color: '#1e3a8a', fontWeight: 600, textDecoration: 'underline' }}
              >
                Create Account &rarr;
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
