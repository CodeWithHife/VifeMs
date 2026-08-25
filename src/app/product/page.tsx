'use client';

import React from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import "../pages.css";

export default function ProductPage() {
  const capabilities = [
    {
      id: "dashboard",
      icon: (
        <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <path d="M3 9h18" />
          <path d="M9 21V9" />
        </svg>
      ),
      title: "Business Dashboard",
      desc: "Get real-time visibility into revenue, attendance metrics, and active member balances from a single command center.",
      tags: ["Real-time KPI", "Live Metrics", "Command Center"]
    },
    {
      id: "staff",
      icon: (
        <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
      title: "Staff Management",
      desc: "Manage employee records, assign role permissions, track daily clock-ins, and streamline team shift schedules.",
      tags: ["Shift Schedules", "Clock-ins", "Role Permissions"]
    },
    {
      id: "customer",
      icon: (
        <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      ),
      title: "Customer Management",
      desc: "Keep organized profiles for every client, student, or member with complete interaction histories, balances, and status tracking.",
      tags: ["Client Profiles", "Balance History", "Status Badges"]
    },
    {
      id: "tasks",
      icon: (
        <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 11l3 3L22 4" />
          <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
        </svg>
      ),
      title: "Tasks",
      desc: "Assign deliverables, set deadlines, and track completion progress across departments to ensure nothing gets forgotten.",
      tags: ["Deliverables", "Deadlines", "Team Progress"]
    },
    {
      id: "finance",
      icon: (
        <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="5" width="20" height="14" rx="2" />
          <line x1="2" y1="10" x2="22" y2="10" />
        </svg>
      ),
      title: "Finance",
      desc: "Record fees and payments automatically, generate digital receipts, and track outstanding balances without payment screenshots.",
      tags: ["Digital Receipts", "Automated Billing", "Balance Tracking"]
    },
    {
      id: "reports",
      icon: (
        <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="20" x2="18" y2="10" />
          <line x1="12" y1="20" x2="12" y2="4" />
          <line x1="6" y1="20" x2="6" y2="14" />
        </svg>
      ),
      title: "Reports",
      desc: "Generate comprehensive performance analytics, attendance trends, and financial reports in seconds for data-driven decisions.",
      tags: ["Performance Analytics", "Attendance Trends", "CSV/PDF Export"]
    },
    {
      id: "notifications",
      icon: (
        <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
      ),
      title: "Notifications",
      desc: "Send automated alerts and updates to staff and clients regarding payments, attendance, and important announcements.",
      tags: ["Automated Alerts", "Payment Reminders", "Announcements"]
    },
    {
      id: "automation",
      icon: (
        <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="16 18 22 12 16 6" />
          <polyline points="8 6 2 12 8 18" />
        </svg>
      ),
      title: "Workflow Automation",
      desc: "Automate repetitive daily tasks like payment reminders, membership status updates, and attendance logs to save hours every week.",
      tags: ["Auto Reminders", "Recurring Tasks", "Status Updates"]
    },
    {
      id: "security",
      icon: (
        <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
      ),
      title: "Security & Permissions",
      desc: "Control who sees what with role-based access permissions, audit logs, and secure data storage for complete peace of mind.",
      tags: ["Role-Based Access", "Data Security", "Audit Logs"]
    }
  ];

  return (
    <div className="subpage-root">
      <Navbar />

      {/* Hero Section */}
      <section className="subpage-hero">
        <div className="wrap">
          <h1 className="subpage-title">
            The core capabilities that keep your <span className="text-gradient">organization running smoothly</span>.
          </h1>
          <p className="subpage-sub">
            VIFEMS connects your people, attendance, payments, and operational reports into one single command center.
          </p>
          <div className="subpage-actions">
            <Link href="/signup" className="btn-hero-primary">
              <span>Start 14-day free trial</span>
              <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2.2" fill="none">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>
            <Link href="/pricing" className="btn-hero-secondary">
              <span>View Pricing Plans</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Capabilities Grid */}
      <section className="subpage-section">
        <div className="wrap">
          <div className="cards-grid">
            {capabilities.map((cap) => (
              <div key={cap.id} className="capability-subcard animate-card-fade">
                <div className="card-icon-wrap">{cap.icon}</div>
                <h3>{cap.title}</h3>
                <p>{cap.desc}</p>
                <div className="card-tags">
                  {cap.tags.map((tag, i) => (
                    <span key={i} className="tag-badge">{tag}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Showcase Section */}
      <section className="subpage-section alt-bg">
        <div className="wrap">
          <div className="showcase-box">
            <div className="showcase-left">
              <h2>Built for the person doing the daily work</h2>
              <p>
                VIFEMS is designed for real day-to-day operations. Your team won't need to spend hours learning software just to log attendance or issue a receipt.
              </p>
              <ul className="check-list">
                <li>
                  <svg viewBox="0 0 24 24" width="18" height="18" stroke="#3b82f6" strokeWidth="2.5" fill="none"><polyline points="20 6 9 17 4 12"/></svg>
                  Simple interface for front-desk and field staff
                </li>
                <li>
                  <svg viewBox="0 0 24 24" width="18" height="18" stroke="#3b82f6" strokeWidth="2.5" fill="none"><polyline points="20 6 9 17 4 12"/></svg>
                  Digital receipts generated and sent automatically
                </li>
                <li>
                  <svg viewBox="0 0 24 24" width="18" height="18" stroke="#3b82f6" strokeWidth="2.5" fill="none"><polyline points="20 6 9 17 4 12"/></svg>
                  Role permissions so staff only see what they need
                </li>
              </ul>
              <Link href="/signup" className="btn-hero-primary" style={{ marginTop: "24px", display: "inline-flex" }}>
                <span>Get Started Now</span>
              </Link>
            </div>

            <div className="showcase-right">
              <div className="mock-window">
                <div className="mock-header">
                  <span className="dot red"></span>
                  <span className="dot yellow"></span>
                  <span className="dot green"></span>
                  <span className="mock-title">VIFEMS Workspace Dashboard</span>
                </div>
                <div className="mock-body">
                  <div className="stat-card">
                    <span className="stat-label">Total Monthly Revenue</span>
                    <span className="stat-value">$24,850.00</span>
                    <span className="stat-trend">+14.2% from last month</span>
                  </div>
                  <div className="stat-row">
                    <div className="mini-stat">
                      <span>Active Members</span>
                      <strong>1,240</strong>
                    </div>
                    <div className="mini-stat">
                      <span>Staff Clocked In</span>
                      <strong>18 / 20</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="subpage-cta">
        <div className="wrap">
          <h2>Ready to get your operations organized?</h2>
          <p>Try VIFEMS free for 14 days. No credit card required.</p>
          <Link href="/signup" className="btn-hero-primary">
            <span>Start Free Trial</span>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
