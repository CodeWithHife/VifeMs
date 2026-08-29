import React from "react";
import Link from "next/link";

export const Footer: React.FC = () => {
  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="footer-grid">
          {/* Brand Column */}
          <div className="footer-brand-col">
            <div className="footer-logo">
              <img src="/logo/logo.png" alt="VIFEMS Logo" style={{ height: "40px", width: "auto", objectFit: "contain" }} />
            </div>
            <p className="footer-tagline">MANAGE · SIMPLIFY · GROW</p>
            <p className="footer-desc">
              VIFEMS connects your people, attendance, payments, and operations into one seamless workspace.
            </p>
            <a href="mailto:support@vifems.com" className="footer-email-badge">
              <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
              support@vifems.com
            </a>
          </div>

          {/* Product */}
          <div className="footer-col">
            <h4 className="footer-col-title">Product</h4>
            <ul className="footer-links">
              <li><a href="#product">Dashboard</a></li>
              <li><a href="#product">Participants</a></li>
              <li><a href="#product">Staff Management</a></li>
              <li><a href="#product">Attendance</a></li>
              <li><a href="#product">Finance</a></li>
              <li><a href="#product">Reports</a></li>
            </ul>
          </div>

          {/* Platform */}
          <div className="footer-col">
            <h4 className="footer-col-title">Platform</h4>
            <ul className="footer-links">
              <li><a href="#solutions">Solutions</a></li>
              <li><a href="#pricing">Pricing</a></li>
              <li><a href="#how">How it works</a></li>
              <li><Link href="/signup">Get started</Link></li>
              <li><Link href="/login">Sign in</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="footer-col">
            <h4 className="footer-col-title">Contact</h4>
            <ul className="footer-links">
              <li><a href="mailto:support@vifems.com">Support</a></li>
              <li><a href="mailto:support@vifems.com">Sales enquiry</a></li>
              <li><a href="mailto:support@vifems.com">General enquiry</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} VIFEMS. All rights reserved.</p>
          <div className="footer-bottom-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
