'use client';

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export const Navbar: React.FC = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();

  const toggleMenu = () => setIsOpen((prev) => !prev);
  const closeMenu = () => setIsOpen(false);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

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
                    background: "#1a3a8a",
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
                onClick={handleLogout}
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
              <a href="/login" className="nav-cta nav-desktop-cta nav-login-text" style={{ marginRight: "8px", background: "transparent", border: "1.5px solid #2563EB", color: "#2563EB" }}>Log In</a>
              <a href="/signup" className="nav-cta nav-desktop-cta">Sign Up</a>
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
                  router.push('/login');
                }}
                className="nav-cta"
                style={{ width: "100%", textAlign: "center", background: "#ef4444", borderColor: "#ef4444" }}
              >
                Log out
              </button>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", width: "100%" }}>
              <a href="/login" className="nav-cta nav-login-text" onClick={closeMenu} style={{ width: "100%", textAlign: "center", background: "transparent", border: "1.5px solid #2563EB", color: "#2563EB" }}>Log In</a>
              <a href="/signup" className="nav-cta" onClick={closeMenu} style={{ width: "100%", textAlign: "center" }}>Sign Up</a>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};