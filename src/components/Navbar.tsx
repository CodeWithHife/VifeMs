'use client';

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();

  const toggleMenu = () => setIsOpen((prev) => !prev);
  const closeMenu = () => setIsOpen(false);

  return (
    <nav>
      <div className="nav-inner">
        <div className="logo">
          <Link href="/">
            <img src="/logo/logo.png" alt="VIFEMS Logo" className="logo-img" style={{ height: "72px", maxHeight: "80px", width: "auto", objectFit: "contain" }} />
          </Link>
        </div>

        {/* Desktop Navigation Links */}
        <div className="nav-links">
          <a href="#product">Product</a>
          <a href="#solutions">Solutions</a>
          <a href="#pricing">Pricing</a>
          <a href="#how">Resources</a>
        </div>

        {/* Desktop Actions */}
        <div className="nav-desktop-actions">
          {isAuthenticated ? (
            <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.875rem", fontWeight: 600, color: "#1e293b" }}>
                <div
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    background: "#2563eb",
                    color: "#ffffff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "0.85rem",
                    fontWeight: 700,
                  }}
                >
                  {user?.firstName?.[0] || user?.email?.[0]?.toUpperCase() || "U"}
                </div>
                <span>{user?.firstName ? `${user.firstName}` : user?.email}</span>
              </div>
              <button
                onClick={logout}
                style={{
                  padding: "8px 16px",
                  borderRadius: "8px",
                  border: "1px solid #cbd5e1",
                  background: "transparent",
                  color: "#475569",
                  fontWeight: 600,
                  fontSize: "0.85rem",
                  cursor: "pointer",
                }}
              >
                Log out
              </button>
            </div>
          ) : (
            <>
              <Link href="/login" className="nav-login-icon-btn" title="Log in" aria-label="Log in">
                <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                <span>Login</span>
              </Link>
              <Link href="/signup" className="nav-cta nav-desktop-cta">Get started</Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <button
          className={`nav-toggle ${isOpen ? "open" : ""}`}
          onClick={toggleMenu}
          aria-label="Toggle navigation menu"
        >
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="nav-mobile-menu">
          <a href="#product" onClick={closeMenu}>Product</a>
          <a href="#solutions" onClick={closeMenu}>Solutions</a>
          <a href="#pricing" onClick={closeMenu}>Pricing</a>
          <a href="#how" onClick={closeMenu}>Resources</a>
          {isAuthenticated ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", width: "100%", marginTop: "8px" }}>
              <div style={{ textAlign: "center", fontWeight: 600, color: "#1e293b" }}>
                Signed in as {user?.firstName ? `${user.firstName} ${user.lastName}` : user?.email}
              </div>
              <button
                onClick={() => {
                  logout();
                  closeMenu();
                }}
                className="nav-cta"
                style={{ width: "100%", textAlign: "center", background: "#ef4444", borderColor: "#ef4444" }}
              >
                Log out
              </button>
            </div>
          ) : (
            <>
              <Link href="/login" className="nav-login-icon-btn" onClick={closeMenu} style={{ justifyContent: "center", width: "100%" }}>
                <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                <span>Login</span>
              </Link>
              <Link href="/signup" className="nav-cta" onClick={closeMenu} style={{ width: "100%", textAlign: "center" }}>
                Get started
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};
