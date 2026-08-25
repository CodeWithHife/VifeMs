'use client';

import React from "react";
import Link from "next/link";

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="footer-grid">
          {/* Brand & Mission Column */}
          <div className="footer-brand-col">
            <div className="footer-logo">
              <Link href="/">
                <img
                  src="/logo/logo.png"
                  alt="VIFEMS Logo"
                  style={{ height: "48px", width: "auto", objectFit: "contain" }}
                />
              </Link>
            </div>
            <p className="footer-tagline">MANAGE · SIMPLIFY · GROW</p>
            <p className="footer-desc">
              VIFEMS connects staff shifts, customer balances, payments, and operational reports into one straightforward workspace.
            </p>
            <div className="footer-support-box">
              <span className="support-label">Need assistance?</span>
              <a href="mailto:vifemssupport@email.com" className="footer-email-link">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
                <span>vifemssupport@email.com</span>
              </a>
            </div>
          </div>

          {/* Navigation Column 1: Navigation */}
          <div className="footer-col">
            <h4 className="footer-col-title">Navigation</h4>
            <ul className="footer-links">
              <li><Link href="/">Home Page</Link></li>
              <li><Link href="/product">Product Overview</Link></li>
              <li><Link href="/solutions">Solutions Hub</Link></li>
              <li><Link href="/pricing">Pricing Plans</Link></li>
              <li><Link href="/resources">Setup Guides</Link></li>
            </ul>
          </div>

          {/* Navigation Column 2: Industry Solutions */}
          <div className="footer-col">
            <h4 className="footer-col-title">Solutions</h4>
            <ul className="footer-links">
              <li><Link href="/solutions">Schools & Academies</Link></li>
              <li><Link href="/solutions">Gyms & Studios</Link></li>
              <li><Link href="/solutions">Service Agencies</Link></li>
              <li><Link href="/solutions">Retail & Multi-Branch</Link></li>
              <li><Link href="/solutions">Field Services</Link></li>
              <li><Link href="/solutions">Clinics & Wellness</Link></li>
            </ul>
          </div>

          {/* Navigation Column 3: Legal & Account */}
          <div className="footer-col">
            <h4 className="footer-col-title">Account & Legal</h4>
            <ul className="footer-links">
              <li><Link href="/login">Log In to Workspace</Link></li>
              <li><Link href="/signup">Create Free Account</Link></li>
              <li><Link href="/forgot-password">Reset Password</Link></li>
              <li><Link href="/terms">Terms of Service</Link></li>
              <li><Link href="/privacy">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom Bar */}
        <div className="footer-bottom">
          <div className="footer-status-pill">
            <span className="status-dot"></span>
            <span>All Systems Operational</span>
          </div>

          <p className="copyright-text">© {new Date().getFullYear()} VIFEMS. All rights reserved.</p>

          <button onClick={scrollToTop} className="back-to-top-btn" aria-label="Back to top">
            <span>Back to top</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="18 15 12 9 6 15" />
            </svg>
          </button>
        </div>
      </div>
    </footer>
  );
};
