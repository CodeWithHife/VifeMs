import React from "react";

export const Footer: React.FC = () => {
  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="footer-grid">
          {/* Brand & Motto Column */}
          <div className="footer-brand-col">
            <div className="footer-logo">
              <img src="/logo/logo.png" alt="VIFEMS Logo" style={{ height: "36px", width: "auto", objectFit: "contain" }} />
            </div>
            <p className="footer-tagline">
              MANAGE · SIMPLIFY · GROW
            </p>
            <p className="footer-desc">
              VIFEMS connects your people, attendance, payments, and operations into one seamless workspace.
            </p>
          </div>

          {/* Product Links */}
          <div className="footer-col">
            <h4 className="footer-col-title">Product</h4>
            <ul className="footer-links">
              <li><a href="#product">Business Dashboard</a></li>
              <li><a href="#product">Staff Management</a></li>
              <li><a href="#product">Customer Management</a></li>
              <li><a href="#product">Tasks</a></li>
              <li><a href="#product">Finance</a></li>
              <li><a href="#product">Reports</a></li>
              <li><a href="#product">Notifications</a></li>
            </ul>
          </div>

          {/* Company Links */}
          <div className="footer-col">
            <h4 className="footer-col-title">Company</h4>
            <ul className="footer-links">
              <li><a href="#about">About VIFEMS</a></li>
              <li><a href="#careers">Careers</a></li>
              <li><a href="#press">Press</a></li>
              <li><a href="#partners">Partners</a></li>
            </ul>
          </div>

          {/* Resources Links */}
          <div className="footer-col">
            <h4 className="footer-col-title">Resources</h4>
            <ul className="footer-links">
              <li><a href="#docs">Documentation</a></li>
              <li><a href="#guides">Guides</a></li>
              <li><a href="#help">Help Center</a></li>
              <li><a href="#status">API Status</a></li>
            </ul>
          </div>

          {/* Legal Links */}
          <div className="footer-col">
            <h4 className="footer-col-title">Legal</h4>
            <ul className="footer-links">
              <li><a href="#privacy">Privacy Policy</a></li>
              <li><a href="#terms">Terms of Service</a></li>
              <li><a href="#security">Security</a></li>
              <li><a href="#compliance">Compliance</a></li>
            </ul>
          </div>

          {/* Contact Links */}
          <div className="footer-col">
            <h4 className="footer-col-title">Contact</h4>
            <ul className="footer-links">
              <li><a href="mailto:support@vifems.com">Support Email</a></li>
              <li><a href="#chat">Live Chat</a></li>
              <li><a href="#sales">Contact Sales</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} VIFEMS. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
