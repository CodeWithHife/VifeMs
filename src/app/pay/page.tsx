'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

const ACCOUNT_NUMBER = "7070295803";
const ACCOUNT_NAME = "OBADIMU IFEOLUWA";
const BANK_NAME = "OPay (Paycom)";
const WHATSAPP_NUMBER = "2347070295803";

const ALL_MODULES = [
  { id: "participants", label: "Participants", price: 5000 },
  { id: "training", label: "Training", price: 5000 },
  { id: "attendance", label: "Attendance", price: 5000 },
  { id: "staff", label: "Staff", price: 5000 },
  { id: "finance", label: "Finance", price: 5000 },
  { id: "tasks", label: "Tasks", price: 5000 },
  { id: "reports", label: "Reports", price: 5000 },
  { id: "notifications", label: "Notifications", price: 5000 },
];

function PayPageContent() {
  const searchParams = useSearchParams();
  const initialModules = searchParams.get("modules")
    ? searchParams.get("modules")!.split(",")
    : ["participants", "training", "attendance"];

  const [selected, setSelected] = useState<string[]>(initialModules);
  const [copied, setCopied] = useState(false);
  const [hasPaid, setHasPaid] = useState(false);

  const toggle = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
    );
  };

  const setupFee = 5000;
  const monthlyFee = selected.length * 5000;
  const totalAmount = setupFee + monthlyFee;

  const formattedTotal = "₦" + totalAmount.toLocaleString("en-NG");
  const formattedSetup = "₦" + setupFee.toLocaleString("en-NG");
  const formattedMonthly = "₦" + monthlyFee.toLocaleString("en-NG");

  const selectedLabels = selected
    .map((id) => ALL_MODULES.find((m) => m.id === id)?.label || id)
    .join(", ");

  const handleCopy = () => {
    navigator.clipboard.writeText(ACCOUNT_NUMBER);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const messageText = encodeURIComponent(
    `Hello Ifeoluwa, I have made a payment of ${formattedTotal} for my VIFEMS workspace!\n\n` +
    `📋 Order Summary:\n` +
    `• Setup Fee: ${formattedSetup}\n` +
    `• Monthly Modules: ${formattedMonthly}\n` +
    `• Selected Modules: ${selectedLabels || "None"}\n` +
    `• Total Amount: ${formattedTotal}\n` +
    `• Paid To: 7070295803 (OPay - OBADIMU IFEOLUWA)\n\n` +
    `I am attaching my payment proof/screenshot below. Please activate my workspace.`
  );

  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${messageText}`;

  const handleWhatsAppRedirect = () => {
    setHasPaid(true);
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <main style={{ flex: 1, padding: '40px 20px', maxWidth: '840px', margin: '0 auto', width: '100%' }}>
        {/* Breadcrumb / Top return */}
        <div style={{ marginBottom: '24px' }}>
          <Link href="/#pricing" style={{ fontSize: '13px', color: '#1e3a8a', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            &larr; Back to Pricing
          </Link>
        </div>

        {/* Page Title */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <span style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.08em', color: '#2563eb', textTransform: 'uppercase', background: '#eff6ff', padding: '4px 12px', borderRadius: '12px', border: '1px solid #bfdbfe' }}>
            Direct Payment & Setup
          </span>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', margin: '12px 0 8px', letterSpacing: '-0.02em' }}>
            Pay for your VIFEMS Workspace
          </h1>
          <p style={{ color: '#64748b', fontSize: '1rem', maxWidth: '520px', margin: '0 auto' }}>
            Transfer to the account details below, then click &ldquo;I Have Paid&rdquo; to send proof on WhatsApp for instant activation.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', alignItems: 'start' }}>
          {/* Left Column: Bank Account & WhatsApp Confirmation */}
          <div style={{ background: '#ffffff', border: '1.5px solid #e2e8f0', borderRadius: '20px', padding: '28px', boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#dcfce7', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>
                ₦
              </div>
              <div>
                <h2 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0, color: '#0f172a' }}>Bank Transfer Details</h2>
                <span style={{ fontSize: '12px', color: '#16a34a', fontWeight: 600 }}>Instant OPay Confirmation</span>
              </div>
            </div>

            {/* Account Box */}
            <div style={{ background: 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%)', border: '2px solid #86efac', borderRadius: '16px', padding: '20px', marginBottom: '20px' }}>
              <div style={{ fontSize: '12px', color: '#475569', marginBottom: '6px', fontWeight: 600, textTransform: 'uppercase' }}>
                Account Number (OPay)
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#ffffff', border: '1.5px solid #bbf7d0', borderRadius: '10px', padding: '10px 14px', marginBottom: '14px' }}>
                <span style={{ fontFamily: 'monospace', fontSize: '1.6rem', fontWeight: 800, letterSpacing: '0.08em', color: '#0f172a' }}>
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
                    padding: '8px 14px',
                    fontSize: '12.5px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  {copied ? '✓ Copied!' : 'Copy'}
                </button>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                <span style={{ color: '#475569' }}>Account Name:</span>
                <strong style={{ color: '#0f172a' }}>{ACCOUNT_NAME}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                <span style={{ color: '#475569' }}>Bank Name:</span>
                <strong style={{ color: '#0f172a' }}>{BANK_NAME}</strong>
              </div>
            </div>

            {/* Step list */}
            <div style={{ fontSize: '13px', color: '#475569', marginBottom: '22px' }}>
              <strong style={{ color: '#1e293b', display: 'block', marginBottom: '8px' }}>Payment Steps:</strong>
              <ol style={{ margin: 0, paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <li>Transfer <strong>{formattedTotal}</strong> to <strong>{ACCOUNT_NUMBER} ({ACCOUNT_NAME})</strong>.</li>
                <li>Click <strong>&ldquo;I Have Paid&rdquo;</strong> below to open WhatsApp.</li>
                <li>Drop your payment receipt/screenshot in WhatsApp (<strong>07070295803</strong>).</li>
              </ol>
            </div>

            {/* Primary Action Button */}
            <button
              type="button"
              onClick={handleWhatsAppRedirect}
              style={{
                width: '100%',
                background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                color: '#ffffff',
                border: 'none',
                borderRadius: '12px',
                padding: '16px',
                fontSize: '16px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                boxShadow: '0 4px 14px rgba(34, 197, 94, 0.35)',
              }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
              </svg>
              <span>I Have Paid — Send Screenshot</span>
            </button>

            {hasPaid && (
              <div style={{ marginTop: '12px', padding: '12px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '10px', fontSize: '12.5px', color: '#166534', textAlign: 'center' }}>
                WhatsApp launched! Send your screenshot in the conversation. Once sent,{" "}
                <Link href="/signup" style={{ textDecoration: 'underline', fontWeight: 700 }}>
                  register your account here
                </Link>{" "}
                so we can connect your payment.
              </div>
            )}
          </div>

          {/* Right Column: Customize Modules & Order Breakdown */}
          <div style={{ background: '#ffffff', border: '1.5px solid #e2e8f0', borderRadius: '20px', padding: '28px', boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 700, margin: '0 0 6px', color: '#0f172a' }}>
              Your Workspace Plan
            </h2>
            <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 18px' }}>
              Select or toggle modules to update your invoice:
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '20px' }}>
              {ALL_MODULES.map((mod) => {
                const isActive = selected.includes(mod.id);
                return (
                  <button
                    key={mod.id}
                    type="button"
                    onClick={() => toggle(mod.id)}
                    style={{
                      padding: '10px 12px',
                      borderRadius: '10px',
                      border: isActive ? '1.5px solid #2563eb' : '1px solid #e2e8f0',
                      background: isActive ? '#eff6ff' : '#ffffff',
                      color: isActive ? '#1e3a8a' : '#475569',
                      fontSize: '13px',
                      fontWeight: isActive ? 700 : 500,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      textAlign: 'left',
                      transition: 'all 0.15s',
                    }}
                  >
                    <span>{mod.label}</span>
                    <span style={{ fontSize: '11px', color: isActive ? '#2563eb' : '#94a3b8' }}>
                      {isActive ? '✓' : '+'}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Total breakdown */}
            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#64748b', marginBottom: '8px' }}>
                <span>One-time Setup Fee</span>
                <span style={{ fontWeight: 600, color: '#1e293b' }}>{formattedSetup}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#64748b', marginBottom: '12px' }}>
                <span>{selected.length} Modules (₦5,000 each)</span>
                <span style={{ fontWeight: 600, color: '#1e293b' }}>{formattedMonthly} / mo</span>
              </div>
              <div style={{ borderTop: '1px dashed #cbd5e1', paddingTop: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 700, color: '#0f172a' }}>Total Payable Now</span>
                <span style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1d4ed8' }}>{formattedTotal}</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function PayPage() {
  return (
    <Suspense fallback={<div style={{ padding: '60px', textAlign: 'center' }}>Loading payment details...</div>}>
      <PayPageContent />
    </Suspense>
  );
}
