'use client';

import React from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import "../pages.css";

export default function PrivacyPage() {
  return (
    <div className="subpage-root page-enter-fade">
      <Navbar />

      {/* Hero Header */}
      <section className="subpage-hero">
        <div className="wrap">
          <h1 className="subpage-title">
            Privacy <span className="text-gradient">Policy</span>
          </h1>
          <p className="subpage-sub">
            Last updated: August 2026. How VIFEMS protects your data and privacy.
          </p>
        </div>
      </section>

      {/* Legal Content */}
      <section className="subpage-section">
        <div className="wrap" style={{ maxWidth: "840px" }}>
          <div className="legal-content-box scroll-reveal">
            <h2 style={{ fontSize: "24px", fontWeight: 800, color: "#0a1a4a", marginBottom: "16px" }}>1. Information We Collect</h2>
            <p style={{ color: "#64748b", lineHeight: 1.7, marginBottom: "28px" }}>
              We collect information necessary to operate your VIFEMS workspace, including business owner name, work email address, staff shift records, customer profiles, and transaction receipt data.
            </p>

            <h2 style={{ fontSize: "24px", fontWeight: 800, color: "#0a1a4a", marginBottom: "16px" }}>2. How We Use Your Information</h2>
            <p style={{ color: "#64748b", lineHeight: 1.7, marginBottom: "28px" }}>
              Your information is strictly used to provide, maintain, and improve VIFEMS features. We do not sell your personal or business data to advertisers or third parties.
            </p>

            <h2 style={{ fontSize: "24px", fontWeight: 800, color: "#0a1a4a", marginBottom: "16px" }}>3. Data Security & Encryption</h2>
            <p style={{ color: "#64748b", lineHeight: 1.7, marginBottom: "28px" }}>
              All records, payment logs, and staff clock-in data are transmitted using standard 256-bit SSL encryption and stored in secure server facilities with regular automated backups.
            </p>

            <h2 style={{ fontSize: "24px", fontWeight: 800, color: "#0a1a4a", marginBottom: "16px" }}>4. Your Data Rights</h2>
            <p style={{ color: "#64748b", lineHeight: 1.7, marginBottom: "28px" }}>
              You may request an export of all your business records or request permanent account deletion at any time by contacting our privacy team.
            </p>

            <h2 style={{ fontSize: "24px", fontWeight: 800, color: "#0a1a4a", marginBottom: "16px" }}>5. Contact Privacy Team</h2>
            <p style={{ color: "#64748b", lineHeight: 1.7, marginBottom: "28px" }}>
              For questions about this Privacy Policy, please email <a href="mailto:vifemssupport@email.com" style={{ color: "#2563eb", fontWeight: 700 }}>vifemssupport@email.com</a>.
            </p>

            <div style={{ marginTop: "40px", paddingTop: "24px", borderTop: "1px solid #e2e8f0" }}>
              <Link href="/terms" style={{ color: "#2563eb", fontWeight: 700, textDecoration: "none" }}>
                Read Terms of Service →
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
