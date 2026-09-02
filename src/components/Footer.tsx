import React from "react";

export const Footer: React.FC = () => {
  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="footer-grid">
          {/* Brand & Motto Column */}
          <div className="footer-brand-col">
            <div className="footer-logo">
              <img
                src="/logo/logo.png"
                alt="VIFEMS Logo"
                className="footer-logo-img"
              />
              <span className="footer-logo-text">VIFEMS</span>
            </div>
            <p className="footer-tagline">MANAGE · SIMPLIFY · GROW</p>
            <p className="footer-desc">
              VIFEMS connects your people, attendance, payments, and operations into one seamless workspace.
            </p>
            <a href="mailto:support@vifems.com" className="footer-support-link">
              support@vifems.com
            </a>
          </div>

          {/* Product Links */}
          <div className="footer-col">
            <h4 className="footer-col-title">Product</h4>
            <ul className="footer-links">
              <li><a href="#dashboard">Dashboard</a></li>
              <li><a href="#participants">Participants</a></li>
              <li><a href="#staff">Staff Management</a></li>
              <li><a href="#attendance">Attendance</a></li>
              <li><a href="#finance">Finance</a></li>
              <li><a href="#reports">Reports</a></li>
            </ul>
          </div>

          {/* Platform Links */}
          <div className="footer-col">
            <h4 className="footer-col-title">Platform</h4>
            <ul className="footer-links">
              <li><a href="#solutions">Solutions</a></li>
              <li><a href="#pricing">Pricing</a></li>
              <li><a href="#how">How it works</a></li>
              <li><a href="/signup">Get started</a></li>
              <li><a href="/login">Sign in</a></li>
            </ul>
          </div>

          {/* Contact Links */}
          <div className="footer-col">
            <h4 className="footer-col-title">Contact</h4>
            <ul className="footer-links">
              <li><a href="mailto:support@vifems.com">Support</a></li>
              <li><a href="mailto:sales@vifems.com">Sales enquiry</a></li>
              <li><a href="mailto:hello@vifems.com">General enquiry</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2026 VIFEMS. All rights reserved.</p>
          <div className="footer-bottom-links">
            <a href="#privacy">Privacy Policy</a>
            <a href="#terms">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
