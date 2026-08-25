'use client';

import React, { useEffect, useRef, useState } from "react";

export const ProductShowcase: React.FC = () => {
  const gridRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleCheck = () => {
      if (gridRef.current) {
        const rect = gridRef.current.getBoundingClientRect();
        if (rect.top <= window.innerHeight * 0.9) {
          setIsVisible(true);
        }
      }
    };

    // Check immediately on load
    handleCheck();

    // IntersectionObserver for smooth scroll detection
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.05, rootMargin: "0px 0px 50px 0px" }
    );

    if (gridRef.current) {
      observer.observe(gridRef.current);
    }

    window.addEventListener("scroll", handleCheck, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", handleCheck);
    };
  }, []);

  const capabilities = [
    {
      title: "Business Dashboard",
      desc: "Get real-time visibility into your revenue, attendance metrics, and active member balances from a single intuitive command center.",
      iconClass: "cap-blue",
      icon: (
        <svg viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <path d="M3 9h18" />
          <path d="M9 21V9" />
        </svg>
      ),
    },
    {
      title: "Staff Management",
      desc: "Manage employee records, assign role permissions, track daily clock-ins, and streamline team shift schedules effortlessly.",
      iconClass: "cap-emerald",
      icon: (
        <svg viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
    },
    {
      title: "Customer Management",
      desc: "Keep organized profiles for every client, student, or member with complete interaction histories, balances, and status tracking.",
      iconClass: "cap-amber",
      icon: (
        <svg viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      ),
    },
    {
      title: "Tasks",
      desc: "Assign deliverables, set deadlines, and track completion progress across departments to ensure nothing gets forgotten.",
      iconClass: "cap-purple",
      icon: (
        <svg viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 11l3 3L22 4" />
          <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
        </svg>
      ),
    },
    {
      title: "Finance",
      desc: "Record fees and payments automatically, generate digital receipts, and track outstanding balances without payment screenshots.",
      iconClass: "cap-cyan",
      icon: (
        <svg viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="5" width="20" height="14" rx="2" />
          <line x1="2" y1="10" x2="22" y2="10" />
        </svg>
      ),
    },
    {
      title: "Reports",
      desc: "Generate comprehensive performance analytics, attendance trends, and financial reports in seconds for data-driven decisions.",
      iconClass: "cap-rose",
      icon: (
        <svg viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="20" x2="18" y2="10" />
          <line x1="12" y1="20" x2="12" y2="4" />
          <line x1="6" y1="20" x2="6" y2="14" />
        </svg>
      ),
    },
    {
      title: "Notifications",
      desc: "Send automated alerts and updates to staff and clients regarding payments, attendance, and important announcements.",
      iconClass: "cap-indigo",
      icon: (
        <svg viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
      ),
    },
    {
      title: "Workflow Automation",
      desc: "Automate recurring operational tasks, membership renewals, and activity tracking to save hours every single week.",
      iconClass: "cap-teal",
      icon: (
        <svg viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 2 7 12 12 22 7 12 2" />
          <polyline points="2 17 12 22 22 17" />
          <polyline points="2 12 12 17 22 12" />
        </svg>
      ),
    },
    {
      title: "Security & Permissions",
      desc: "Protect sensitive business data with role-based access control, encrypted records, and secure multi-user permissions.",
      iconClass: "cap-orange",
      icon: (
        <svg viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
      ),
    },
  ];

  return (
    <section id="product">
      <div className="wrap">
        <span className="section-label">Feature Overview</span>
        <h2 className="section-title reveal">How VIFEMS Solves Operational Chaos.</h2>
        <p className="section-body reveal">
          VIFEMS connects your core business capabilities into one unified platform — eliminating fragmented spreadsheets, missed tasks, and manual reporting.
        </p>

        {/* 9 Core Capabilities Grid (Scroll & Load Stagger Animation) */}
        <div className="capabilities-grid" ref={gridRef}>
          {capabilities.map((cap, index) => (
            <div
              key={index}
              className={`capability-card ${isVisible ? "card-animated" : "card-hidden"}`}
              style={{ transitionDelay: `${index * 0.09}s` }}
            >
              <div className={`cap-icon ${cap.iconClass}`}>{cap.icon}</div>
              <h3>{cap.title}</h3>
              <p>{cap.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
