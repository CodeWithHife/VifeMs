'use client';

import React from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import "../pages.css";

export default function SolutionsPage() {
  const solutions = [
    {
      id: "education",
      badge: "EDUCATION",
      icon: (
        <svg viewBox="0 0 24 24" width="26" height="26" stroke="#2563eb" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
          <path d="M6 12v5c3 3 9 3 12 0v-5" />
        </svg>
      ),
      title: "Schools & Academies",
      desc: "Manage student attendance, tuition receipts, and parent announcements in one shared system.",
      points: [
        "Session attendance clock-ins",
        "Automatic digital tuition receipts",
        "Teacher & admin permissions"
      ],
      linkText: "Explore Education"
    },
    {
      id: "fitness",
      badge: "FITNESS",
      icon: (
        <svg viewBox="0 0 24 24" width="26" height="26" stroke="#2563eb" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6.5 6.5h11M6.5 17.5h11M3 10v4M21 10v4M6 8v8M18 8v8" />
        </svg>
      ),
      title: "Gyms & Studios",
      desc: "Verify member passes on arrival, schedule trainer shifts, and flag overdue balances.",
      points: [
        "Member arrival verification",
        "Trainer shift scheduling",
        "Automated pass renewal alerts"
      ],
      linkText: "Explore Fitness"
    },
    {
      id: "services",
      badge: "SERVICES",
      icon: (
        <svg viewBox="0 0 24 24" width="26" height="26" stroke="#2563eb" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
        </svg>
      ),
      title: "Agencies & Consultancies",
      desc: "Organize client profiles, track team deliverables, and monitor billable staff hours.",
      points: [
        "Client profiles & balance history",
        "Department task deliverables",
        "Staff billable hour logs"
      ],
      linkText: "Explore Agencies"
    },
    {
      id: "retail",
      badge: "RETAIL",
      icon: (
        <svg viewBox="0 0 24 24" width="26" height="26" stroke="#2563eb" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
          <line x1="3" y1="6" x2="21" y2="6" />
          <path d="M16 10a4 4 0 0 1-8 0" />
        </svg>
      ),
      title: "Retail & Multi-Branch",
      desc: "Coordinate store shift schedules, log daily expenses, and view branch reports.",
      points: [
        "Multi-branch shift management",
        "Daily operational checklists",
        "Expense & receipt logging"
      ],
      linkText: "Explore Retail"
    },
    {
      id: "field",
      badge: "FIELD & TRADES",
      icon: (
        <svg viewBox="0 0 24 24" width="26" height="26" stroke="#2563eb" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
        </svg>
      ),
      title: "Field & Trade Services",
      desc: "Dispatch field teams, log job completion times, and issue receipts on location.",
      points: [
        "Mobile staff clock-in verification",
        "Job task checklists & photos",
        "Instant on-site digital receipts"
      ],
      linkText: "Explore Field Services"
    },
    {
      id: "wellness",
      badge: "WELLNESS",
      icon: (
        <svg viewBox="0 0 24 24" width="26" height="26" stroke="#2563eb" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
        </svg>
      ),
      title: "Clinics & Wellness",
      desc: "Streamline client appointment check-ins, fee collections, and staff shift logs.",
      points: [
        "Patient appointment check-ins",
        "Fee & balance tracking",
        "Staff role security & audit logs"
      ],
      linkText: "Explore Wellness"
    }
  ];

  return (
    <div className="subpage-root">
      <Navbar />

      {/* Hero Section */}
      <section className="subpage-hero">
        <div className="wrap">
          <h1 className="subpage-title">
            Tailored workflows for your <span className="text-gradient">specific industry</span>.
          </h1>
          <p className="subpage-sub">
            VIFEMS connects attendance, staff shifts, customer balances, and receipts into a concise workspace designed for daily operations.
          </p>
          <div className="subpage-actions">
            <Link href="/signup" className="btn-hero-primary">
              <span>Start 14-day free trial</span>
            </Link>
            <Link href="/product" className="btn-hero-secondary">
              <span>Explore Features</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Solutions Cards Grid (Compact 3x2 Layout) */}
      <section className="subpage-section">
        <div className="wrap">
          <div className="solutions-grid compact-grid">
            {solutions.map((sol) => (
              <div key={sol.id} className="solution-card compact-card animate-card-fade">
                <div className="card-top-row">
                  <div className="solution-badge">{sol.badge}</div>
                  <div className="solution-icon-svg mini">{sol.icon}</div>
                </div>
                <h3>{sol.title}</h3>
                <p>{sol.desc}</p>
                <ul className="solution-list compact-list">
                  {sol.points.map((pt, idx) => (
                    <li key={idx}>{pt}</li>
                  ))}
                </ul>
                <Link href="/signup" className="solution-link">
                  {sol.linkText} →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="subpage-cta">
        <div className="wrap">
          <h2>Ready to streamline your operational workflow?</h2>
          <p>Get set up in less than 5 minutes. No software expertise required.</p>
          <Link href="/signup" className="btn-hero-primary">
            <span>Start Free Trial</span>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
