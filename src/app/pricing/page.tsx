'use client';

import React, { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import "../pages.css";

export default function PricingPage() {
  const [isAnnual, setIsAnnual] = useState(true);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqs = [
    {
      q: "Is there a free trial?",
      a: "Yes! Every VIFEMS account starts with a 14-day full-access trial. You don't need a credit card to sign up."
    },
    {
      q: "Can I change plans later?",
      a: "Yes, you can upgrade, downgrade, or switch between monthly and annual billing whenever your team needs to."
    },
    {
      q: "How does annual billing save money?",
      a: "When you choose annual billing, you receive a 20% discount compared to paying month-to-month."
    },
    {
      q: "What payment methods are supported?",
      a: "We accept local bank transfers, debit cards, USSD, and online payment channels."
    },
    {
      q: "Is my business data secure?",
      a: "Yes. All records are encrypted with standard 256-bit SSL encryption and backed up automatically every day."
    }
  ];

  return (
    <div className="subpage-root page-enter-fade">
      <Navbar />

      {/* Hero Section */}
      <section className="subpage-hero">
        <div className="wrap">
          <h1 className="subpage-title">
            Simple plans with <span className="text-gradient">no surprise charges</span>.
          </h1>
          <p className="subpage-sub">
            Start with a 14-day free trial. Pick the plan that matches your team size and upgrade as your organization grows.
          </p>

          {/* Billing Cycle Toggle */}
          <div className="billing-toggle-wrap">
            <span className={!isAnnual ? "active-label" : ""}>Monthly Billing</span>
            <button
              className={`toggle-switch ${isAnnual ? "annual" : ""}`}
              onClick={() => setIsAnnual(!isAnnual)}
              aria-label="Toggle annual billing"
            >
              <span className="switch-knob"></span>
            </button>
            <span className={isAnnual ? "active-label" : ""}>
              Annual Billing <span className="save-badge">SAVE 20%</span>
            </span>
          </div>
        </div>
      </section>

      {/* Pricing Cards Grid */}
      <section className="subpage-section">
        <div className="wrap">
          <div className="pricing-grid">

            {/* Starter Plan */}
            <div className="pricing-card scroll-reveal">
              <div className="tier-header">
                <h3>Starter</h3>
                <p>For emerging pilot centers and small teams.</p>
              </div>
              <div className="tier-price">
                <span className="currency">₦</span>
                <span className="amount">{isAnnual ? "16,000" : "20,000"}</span>
                <span className="period">/ month</span>
              </div>
              {isAnnual && <div className="billed-note">Billed ₦192,000 annually</div>}

              <ul className="tier-features">
                <li><svg viewBox="0 0 24 24" width="16" height="16" stroke="#2563eb" strokeWidth="2.5" fill="none"><polyline points="20 6 9 17 4 12"/></svg>Up to 10 Staff Members</li>
                <li><svg viewBox="0 0 24 24" width="16" height="16" stroke="#2563eb" strokeWidth="2.5" fill="none"><polyline points="20 6 9 17 4 12"/></svg>Up to 250 Customer Profiles</li>
                <li><svg viewBox="0 0 24 24" width="16" height="16" stroke="#2563eb" strokeWidth="2.5" fill="none"><polyline points="20 6 9 17 4 12"/></svg>Business Dashboard</li>
                <li><svg viewBox="0 0 24 24" width="16" height="16" stroke="#2563eb" strokeWidth="2.5" fill="none"><polyline points="20 6 9 17 4 12"/></svg>Digital Receipts & Fee Records</li>
                <li><svg viewBox="0 0 24 24" width="16" height="16" stroke="#2563eb" strokeWidth="2.5" fill="none"><polyline points="20 6 9 17 4 12"/></svg>Standard Email Support</li>
              </ul>

              <Link href="/signup" className="btn-tier-sec">
                Start 14-day trial
              </Link>
            </div>

            {/* Professional Plan (Popular) */}
            <div className="pricing-card popular-card scroll-reveal">
              <div className="popular-tag">MOST POPULAR</div>
              <div className="tier-header">
                <h3>Professional</h3>
                <p>For growing schools, gyms & service providers.</p>
              </div>
              <div className="tier-price">
                <span className="currency">₦</span>
                <span className="amount">{isAnnual ? "40,000" : "50,000"}</span>
                <span className="period">/ month</span>
              </div>
              {isAnnual && <div className="billed-note">Billed ₦480,000 annually</div>}

              <ul className="tier-features">
                <li><svg viewBox="0 0 24 24" width="16" height="16" stroke="#2563eb" strokeWidth="2.5" fill="none"><polyline points="20 6 9 17 4 12"/></svg>Unlimited Staff Members</li>
                <li><svg viewBox="0 0 24 24" width="16" height="16" stroke="#2563eb" strokeWidth="2.5" fill="none"><polyline points="20 6 9 17 4 12"/></svg>Up to 2,500 Customer Profiles</li>
                <li><svg viewBox="0 0 24 24" width="16" height="16" stroke="#2563eb" strokeWidth="2.5" fill="none"><polyline points="20 6 9 17 4 12"/></svg>Workflow Automation Rules</li>
                <li><svg viewBox="0 0 24 24" width="16" height="16" stroke="#2563eb" strokeWidth="2.5" fill="none"><polyline points="20 6 9 17 4 12"/></svg>Attendance & Shift Clock-ins</li>
                <li><svg viewBox="0 0 24 24" width="16" height="16" stroke="#2563eb" strokeWidth="2.5" fill="none"><polyline points="20 6 9 17 4 12"/></svg>CSV & PDF Report Exports</li>
                <li><svg viewBox="0 0 24 24" width="16" height="16" stroke="#2563eb" strokeWidth="2.5" fill="none"><polyline points="20 6 9 17 4 12"/></svg>Priority Support</li>
              </ul>

              <Link href="/signup" className="btn-hero-primary" style={{ width: "100%" }}>
                Start 14-day trial
              </Link>
            </div>

            {/* Enterprise Plan */}
            <div className="pricing-card scroll-reveal">
              <div className="tier-header">
                <h3>Enterprise</h3>
                <p>For multi-location teams and large organizations.</p>
              </div>
              <div className="tier-price">
                <span className="currency">₦</span>
                <span className="amount">{isAnnual ? "120,000" : "150,000"}</span>
                <span className="period">/ month</span>
              </div>
              {isAnnual && <div className="billed-note">Billed ₦1,440,000 annually</div>}

              <ul className="tier-features">
                <li><svg viewBox="0 0 24 24" width="16" height="16" stroke="#2563eb" strokeWidth="2.5" fill="none"><polyline points="20 6 9 17 4 12"/></svg>Unlimited Profiles & Records</li>
                <li><svg viewBox="0 0 24 24" width="16" height="16" stroke="#2563eb" strokeWidth="2.5" fill="none"><polyline points="20 6 9 17 4 12"/></svg>Custom Role Permissions</li>
                <li><svg viewBox="0 0 24 24" width="16" height="16" stroke="#2563eb" strokeWidth="2.5" fill="none"><polyline points="20 6 9 17 4 12"/></svg>Dedicated Account Support</li>
                <li><svg viewBox="0 0 24 24" width="16" height="16" stroke="#2563eb" strokeWidth="2.5" fill="none"><polyline points="20 6 9 17 4 12"/></svg>Custom System Integrations</li>
                <li><svg viewBox="0 0 24 24" width="16" height="16" stroke="#2563eb" strokeWidth="2.5" fill="none"><polyline points="20 6 9 17 4 12"/></svg>Priority Phone & Chat Support</li>
              </ul>

              <Link href="/signup" className="btn-tier-sec">
                Contact Sales
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="subpage-section alt-bg">
        <div className="wrap">
          <div className="section-header-center scroll-reveal">
            <h2>Frequently Asked Questions</h2>
            <p>Common questions about VIFEMS accounts and billing.</p>
          </div>

          <div className="faq-container scroll-reveal">
            {faqs.map((faq, index) => (
              <div key={index} className={`faq-item ${openFaq === index ? "open" : ""}`} onClick={() => toggleFaq(index)}>
                <div className="faq-question">
                  <h3>{faq.q}</h3>
                  <span className="faq-icon">{openFaq === index ? "−" : "+"}</span>
                </div>
                {openFaq === index && (
                  <div className="faq-answer">
                    <p>{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="subpage-cta">
        <div className="wrap">
          <h2>Start running your organization smoothly</h2>
          <p>Setup takes less than 5 minutes. No credit card required.</p>
          <Link href="/signup" className="btn-hero-primary">
            <span>Start Free Trial</span>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
