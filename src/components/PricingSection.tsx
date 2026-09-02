'use client';

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { PaymentModal } from "./PaymentModal";

const SETUP_FEE = 5000;
const MODULE_PRICE = 5000;

const ALL_MODULES = [
  {
    id: "participants",
    label: "Participants",
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="9" cy="7" r="4" />
        <path d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        <path d="M21 21v-2a4 4 0 0 0-3-3.85" />
      </svg>
    ),
    desc: "Manage your members & participants",
  },
  {
    id: "training",
    label: "Training",
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
      </svg>
    ),
    desc: "Training schedules & content",
  },
  {
    id: "attendance",
    label: "Attendance",
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <path d="M16 2v4" />
        <path d="M8 2v4" />
        <path d="M3 10h18" />
        <path d="M9 16l2 2 4-4" />
      </svg>
    ),
    desc: "Track presence & sessions",
  },
  {
    id: "staff",
    label: "Staff",
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="4" />
        <path d="M5.3 18.3C5.3 15.2 8.3 13 12 13s6.7 2.2 6.7 5.3" />
        <path d="M19 8l2 2-4 4" />
      </svg>
    ),
    desc: "Manage your team & roles",
  },
  {
    id: "finance",
    label: "Finance",
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="5" width="20" height="14" rx="2" />
        <path d="M2 10h20" />
        <circle cx="7" cy="15" r="1" fill="currentColor" />
      </svg>
    ),
    desc: "Payments, dues & financials",
  },
  {
    id: "tasks",
    label: "Tasks",
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 11l3 3 8-8" />
        <path d="M20 12v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h9" />
      </svg>
    ),
    desc: "Assign, track & manage tasks",
  },
  {
    id: "reports",
    label: "Reports",
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 3v18h18" />
        <path d="M18 7v10" />
        <path d="M14 10v7" />
        <path d="M10 13v4" />
        <path d="M6 16v1" />
      </svg>
    ),
    desc: "Insights, analytics & exports",
  },
  {
    id: "notifications",
    label: "Notifications",
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
      </svg>
    ),
    desc: "Alerts, reminders & updates",
  },
];

function formatNaira(amount: number) {
  return "₦" + amount.toLocaleString("en-NG");
}

export const PricingSection: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [selected, setSelected] = useState<string[]>(["participants", "training", "attendance"]);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  const toggle = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const moduleCount = selected.length;
  const monthlyTotal = moduleCount * MODULE_PRICE;
  const grandTotal = SETUP_FEE + monthlyTotal;

  const selectedModuleLabels = selected.map(
    (id) => ALL_MODULES.find((m) => m.id === id)?.label || id
  );

  return (
    <section className="pricing-section" id="pricing">
      <div className="wrap">
        {/* Header */}
        <div className="pricing-header reveal">
          <span className="pricing-eyebrow">Pricing</span>
          <h2 className="pricing-title">Only pay for what your business needs.</h2>
          <p className="pricing-subtitle">
            No tiers. No surprises. Pick the modules you need and pay a flat rate.
          </p>
        </div>

        <div className="pricing-layout">
          {/* Left — Static cards */}
          <div className="pricing-cards-col reveal">
            {/* Setup card */}
            <div className="pricing-card pricing-card-setup">
              <div className="pc-icon-wrap pc-icon-wrap--setup">
                <svg viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="3" />
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
                </svg>
              </div>
              <div className="pc-label">Setup</div>
              <div className="pc-price">{formatNaira(SETUP_FEE)} <span className="pc-period">Per-Month</span></div>
              <ul className="pc-features" style={{ marginBottom: "16px" }}>
                <li><span className="pc-check">✓</span> Workspace setup</li>
                <li><span className="pc-check">✓</span> Business configuration</li>
                <li><span className="pc-check">✓</span> Admin account setup</li>
                <li><span className="pc-check">✓</span> Basic branding</li>
                <li><span className="pc-check">✓</span> Deployment</li>
              </ul>
              <button
                type="button"
                onClick={() => setIsPaymentModalOpen(true)}
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  borderRadius: "10px",
                  border: "1.5px solid #2563eb",
                  background: "#eff6ff",
                  color: "#1d4ed8",
                  fontWeight: 700,
                  fontSize: "13px",
                  cursor: "pointer",
                  transition: "background 0.2s",
                }}
              >
                Pay Setup Fee ({formatNaira(SETUP_FEE)}) &rarr;
              </button>
            </div>

            {/* Module price card */}
            <div className="pricing-card pricing-card-module">
              <div className="pc-icon-wrap pc-icon-wrap--module">
                <svg viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="3" width="8" height="8" rx="1.5" />
                  <rect x="14" y="3" width="8" height="8" rx="1.5" />
                  <rect x="2" y="13" width="8" height="8" rx="1.5" />
                  <rect x="14" y="13" width="8" height="8" rx="1.5" />
                </svg>
              </div>
              <div className="pc-label">Modules</div>
              <div className="pc-price">{formatNaira(MODULE_PRICE)} <span className="pc-period">/ module / month</span></div>
              <p className="pc-module-note" style={{ marginBottom: "16px" }}>
                Add only the modules your business uses. Each is billed separately — swap anytime.
              </p>
              <button
                type="button"
                onClick={() => setIsPaymentModalOpen(true)}
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  borderRadius: "10px",
                  border: "1.5px solid #0891b2",
                  background: "#ecfeff",
                  color: "#0e7490",
                  fontWeight: 700,
                  fontSize: "13px",
                  cursor: "pointer",
                  transition: "background 0.2s",
                }}
              >
                Choose Modules & Pay &rarr;
              </button>
            </div>
          </div>

          {/* Right — Interactive calculator */}
          <div className="pricing-calc-col reveal">
            <div className="pricing-calc-card">
              <div className="calc-header">
                <h3 className="calc-title">Build your plan</h3>
                <p className="calc-subtitle">Select the modules you need</p>
              </div>

              <div className="calc-modules-grid">
                {ALL_MODULES.map((mod) => {
                  const active = selected.includes(mod.id);
                  return (
                    <button
                      key={mod.id}
                      className={`calc-module-btn${active ? " active" : ""}`}
                      onClick={() => toggle(mod.id)}
                      aria-pressed={active}
                      id={`module-${mod.id}`}
                    >
                      <span className={`module-icon${active ? " active" : ""}`}>{mod.icon}</span>
                      <span className="module-label">{mod.label}</span>
                      <span className={`module-check${active ? " active" : ""}`}>
                        <svg viewBox="0 0 24 24" width="13" height="13" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Summary box */}
              <div className="calc-summary">
                <div className="calc-summary-row">
                  <span className="calc-summary-label">Setup</span>
                  <span className="calc-summary-value">{formatNaira(SETUP_FEE)} <em>one-time</em></span>
                </div>
                <div className="calc-summary-row">
                  <span className="calc-summary-label">
                    {moduleCount === 0 ? "No modules selected" : `${moduleCount} Module${moduleCount !== 1 ? "s" : ""}`}
                  </span>
                  <span className="calc-summary-value">
                    {moduleCount === 0 ? "—" : `${formatNaira(monthlyTotal)}/mo`}
                  </span>
                </div>
                <div className="calc-summary-divider" />
                <div className="calc-summary-row calc-summary-total">
                  <span>Estimated total</span>
                  <div className="calc-total-right">
                    {moduleCount > 0 && (
                      <span className="calc-total-monthly">{formatNaira(monthlyTotal)}<small>/mo</small></span>
                    )}
                    <span className="calc-total-setup">+ {formatNaira(SETUP_FEE)} setup</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsPaymentModalOpen(true)}
                  className="calc-cta-btn"
                  id="pricing-get-started"
                  style={{ width: "100%", cursor: "pointer", border: "none" }}
                >
                  <span>Pay with Bank Transfer ({formatNaira(grandTotal)})</span>
                  <svg viewBox="0 0 24 24" width="17" height="17" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </button>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "12px", fontSize: "12px", color: "#64748b" }}>
                  <span>Pay to OPay: <strong>7070295803</strong></span>
                  <Link href={`/pay?modules=${selected.join(",")}`} style={{ color: "#2563eb", fontWeight: 600, textDecoration: "underline" }}>
                    Full payment page &rarr;
                  </Link>
                </div>
                <p className="calc-note">Transfer via OPay and send proof on WhatsApp for immediate setup.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        selectedModules={selectedModuleLabels}
        setupFee={SETUP_FEE}
        monthlyFee={monthlyTotal}
        totalAmount={grandTotal}
      />
    </section>
  );
};

