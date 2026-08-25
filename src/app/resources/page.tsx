'use client';

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import "../pages.css";

export default function ResourcesPage() {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [currentDateStr, setCurrentDateStr] = useState<string>("");

  useEffect(() => {
    const today = new Date().toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    });
    setCurrentDateStr(today);
  }, []);

  const guides = [
    {
      id: 1,
      category: "setup",
      categoryName: "WORKSPACE SETUP",
      icon: (
        <svg viewBox="0 0 24 24" width="24" height="24" stroke="#2563eb" strokeWidth="2" fill="none">
          <path d="M12 2L2 7l10 5 10-5-10-5z" />
          <path d="M2 17l10 5 10-5" />
          <path d="M2 12l10 5 10-5" />
        </svg>
      ),
      title: "Setting Up Your VIFEMS Workspace",
      desc: "Configure your business profile, upload your brand logo, set timezone settings, and invite your initial admin team.",
      steps: ["Enter business details", "Configure role permissions", "Send staff invitations"]
    },
    {
      id: 2,
      category: "ops",
      categoryName: "STAFF & SHIFTS",
      icon: (
        <svg viewBox="0 0 24 24" width="24" height="24" stroke="#2563eb" strokeWidth="2" fill="none">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H5.78a1.65 1.65 0 0 0-1.51 1 1.65 1.65 0 0 0 .33 1.82l.04.04A8 8 0 0 0 12 19.5a8 8 0 0 0 6.36-3.36z" />
        </svg>
      ),
      title: "Daily Staff Clock-Ins & Shift Roster",
      desc: "Replace paper attendance notebooks with mobile staff clock-ins and real-time shift verification.",
      steps: ["Assign shift schedules", "Enable PIN/Location check-ins", "Review clock-in logs"]
    },
    {
      id: 3,
      category: "finance",
      categoryName: "FINANCE & RECEIPTS",
      icon: (
        <svg viewBox="0 0 24 24" width="24" height="24" stroke="#2563eb" strokeWidth="2" fill="none">
          <rect x="2" y="5" width="20" height="14" rx="2" />
          <line x1="2" y1="10" x2="22" y2="10" />
        </svg>
      ),
      title: "Digital Receipt Automation",
      desc: "Record incoming client payments and issue instant digital PDF receipts via email or SMS.",
      steps: ["Record payment entry", "Generate digital receipt", "Send instant customer copy"]
    },
    {
      id: 4,
      category: "ops",
      categoryName: "CUSTOMER BALANCES",
      icon: (
        <svg viewBox="0 0 24 24" width="24" height="24" stroke="#2563eb" strokeWidth="2" fill="none">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      ),
      title: "Managing Customer & Member Balances",
      desc: "Keep organized profiles for every client or student with complete balance tracking and status flags.",
      steps: ["Create customer profile", "Track payment history", "Set automated balance alerts"]
    },
    {
      id: 5,
      category: "security",
      categoryName: "SECURITY & ROLES",
      icon: (
        <svg viewBox="0 0 24 24" width="24" height="24" stroke="#2563eb" strokeWidth="2" fill="none">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
      ),
      title: "Role-Based Access & Data Security",
      desc: "Configure precise permissions for front-desk staff, managers, and financial accountants.",
      steps: ["Define access levels", "Restrict sensitive reports", "Audit staff log history"]
    },
    {
      id: 6,
      category: "finance",
      categoryName: "REPORTS & EXPORTS",
      icon: (
        <svg viewBox="0 0 24 24" width="24" height="24" stroke="#2563eb" strokeWidth="2" fill="none">
          <line x1="18" y1="20" x2="18" y2="10" />
          <line x1="12" y1="20" x2="12" y2="4" />
          <line x1="6" y1="20" x2="6" y2="14" />
        </svg>
      ),
      title: "Exporting Monthly Analytics",
      desc: "Export attendance trends, outstanding fee lists, and revenue totals into CSV or PDF formats.",
      steps: ["Select date range", "Choose report filters", "Download CSV or PDF export"]
    }
  ];

  const filteredGuides = guides.filter((g) => {
    return activeCategory === "all" || g.category === activeCategory;
  });

  return (
    <div className="subpage-root page-enter-fade">
      <Navbar />

      {/* Hero Section */}
      <section className="subpage-hero">
        <div className="wrap">
          <h1 className="subpage-title">
            Operational Knowledge & <span className="text-gradient">Setup Documentation</span>.
          </h1>
          <p className="subpage-sub">
            Practical steps to configure your VIFEMS workspace, manage staff shifts, and automate daily digital receipts.
          </p>
        </div>
      </section>

      {/* Category Pills & Guides Grid */}
      <section className="subpage-section">
        <div className="wrap">
          {/* Category Pills */}
          <div className="tab-pills" style={{ marginBottom: "40px" }}>
            <button className={`tab-btn ${activeCategory === "all" ? "active" : ""}`} onClick={() => setActiveCategory("all")}>
              All Topics
            </button>
            <button className={`tab-btn ${activeCategory === "setup" ? "active" : ""}`} onClick={() => setActiveCategory("setup")}>
              Workspace Setup
            </button>
            <button className={`tab-btn ${activeCategory === "ops" ? "active" : ""}`} onClick={() => setActiveCategory("ops")}>
              Staff & Operations
            </button>
            <button className={`tab-btn ${activeCategory === "finance" ? "active" : ""}`} onClick={() => setActiveCategory("finance")}>
              Finance & Receipts
            </button>
            <button className={`tab-btn ${activeCategory === "security" ? "active" : ""}`} onClick={() => setActiveCategory("security")}>
              Security & Roles
            </button>
          </div>

          {/* Guides Grid */}
          <div className="cards-grid">
            {filteredGuides.map((guide) => (
              <div key={guide.id} className="resource-guide-card scroll-reveal">
                <div className="guide-top-row">
                  <div className="cat-icon-svg mini">{guide.icon}</div>
                  <span className="guide-date-posted">Updated: {currentDateStr || "Today"}</span>
                </div>
                <span className="guide-cat-badge">{guide.categoryName}</span>
                <h3>{guide.title}</h3>
                <p>{guide.desc}</p>
                <div className="guide-steps-list">
                  {guide.steps.map((st, i) => (
                    <div key={i} className="step-item">
                      <span className="step-num">{i + 1}</span>
                      <span>{st}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dedicated Support Section */}
      <section className="subpage-section alt-bg">
        <div className="wrap">
          <div className="support-banner-box scroll-reveal">
            <div className="banner-text">
              <h2>Need Personal Support?</h2>
              <p>Our dedicated support team is ready to assist you with onboarding, data imports, or custom setup questions.</p>
              <div className="support-email-pill">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
                <span>vifemssupport@email.com</span>
              </div>
            </div>
            <div className="banner-action">
              <a href="mailto:vifemssupport@email.com" className="btn-hero-primary">
                <span>Send Email to Support</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="subpage-cta">
        <div className="wrap">
          <h2>Ready to experience VIFEMS in action?</h2>
          <p>Join businesses managing their daily operations with VIFEMS.</p>
          <Link href="/signup" className="btn-hero-primary">
            <span>Start Free Trial</span>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
