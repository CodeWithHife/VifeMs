'use client';

import React from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import "../pages.css";

export default function TermsPage() {
  return (
    <div className="subpage-root page-enter-fade">
      <Navbar />

      {/* Hero Header */}
      <section className="subpage-hero">
        <div className="wrap">
          <h1 className="subpage-title">
            Terms of <span className="text-gradient">Service</span>
          </h1>
          <p className="subpage-sub">
            Last updated: August 2026. Please read these terms carefully before creating a VIFEMS account.
          </p>
        </div>
      </section>

      {/* Legal Content */}
      <section className="subpage-section">
        <div className="wrap" style={{ maxWidth: "840px" }}>
          <div className="legal-content-box scroll-reveal">
            <h2 style={{ fontSize: "24px", fontWeight: 800, color: "#0a1a4a", marginBottom: "16px" }}>1. Account Registration</h2>
            <p style={{ color: "#64748b", lineHeight: 1.7, marginBottom: "28px" }}>
              By registering a VIFEMS workspace, you agree to provide accurate and complete business information. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
            </p>

            <h2 style={{ fontSize: "24px", fontWeight: 800, color: "#0a1a4a", marginBottom: "16px" }}>2. Use of Service</h2>
            <p style={{ color: "#64748b", lineHeight: 1.7, marginBottom: "28px" }}>
              VIFEMS provides organizational management tools including attendance logs, staff shift scheduling, customer profiles, and digital receipt generation. You agree not to use the service for any illegal or unauthorized activities.
            </p>

            <h2 style={{ fontSize: "24px", fontWeight: 800, color: "#0a1a4a", marginBottom: "16px" }}>3. Data Privacy & Ownership</h2>
            <p style={{ color: "#64748b", lineHeight: 1.7, marginBottom: "28px" }}>
              Your business records, staff clock-in logs, and customer profiles remain your sole property. VIFEMS stores your data securely with standard 256-bit SSL encryption and does not sell or share your data with third parties.
            </p>

            <h2 style={{ fontSize: "24px", fontWeight: 800, color: "#0a1a4a", marginBottom: "16px" }}>4. Subscription & Payments</h2>
            <p style={{ color: "#64748b", lineHeight: 1.7, marginBottom: "28px" }}>
              VIFEMS offers 14-day free trials. Subscriptions are billed on a monthly or annual basis depending on your selected plan. You may cancel your subscription at any time without hidden fees.
            </p>

            <h2 style={{ fontSize: "24px", fontWeight: 800, color: "#0a1a4a", marginBottom: "16px" }}>5. Support & Contact</h2>
            <p style={{ color: "#64748b", lineHeight: 1.7, marginBottom: "28px" }}>
              If you have any questions regarding these Terms, please contact our support team at <a href="mailto:vifemssupport@email.com" style={{ color: "#2563eb", fontWeight: 700 }}>vifemssupport@email.com</a>.
            </p>

            <div style={{ marginTop: "40px", paddingTop: "24px", borderTop: "1px solid #e2e8f0" }}>
              <Link href="/privacy" style={{ color: "#2563eb", fontWeight: 700, textDecoration: "none" }}>
                Read Privacy Policy →
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
