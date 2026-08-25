'use client';

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const toggleMenu = () => setIsOpen((prev) => !prev);
  const closeMenu = () => setIsOpen(false);

  const isActive = (path: string) => {
    if (path === "/" && pathname === "/") return true;
    if (path !== "/" && pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <nav className="site-navbar">
      <div className="nav-inner">
        <div className="logo">
          <Link href="/">
            <img src="/logo/logo.png" alt="VIFEMS Logo" className="logo-img" style={{ height: "72px", maxHeight: "80px", width: "auto", objectFit: "contain" }} />
          </Link>
        </div>

        {/* Desktop Navigation Links */}
        <div className="nav-links">
          <Link href="/" className={isActive("/") ? "nav-item active" : "nav-item"}>
            Home
          </Link>
          <Link href="/product" className={isActive("/product") ? "nav-item active" : "nav-item"}>
            Product
          </Link>
          <Link href="/solutions" className={isActive("/solutions") ? "nav-item active" : "nav-item"}>
            Solutions
          </Link>
          <Link href="/pricing" className={isActive("/pricing") ? "nav-item active" : "nav-item"}>
            Pricing
          </Link>
          <Link href="/resources" className={isActive("/resources") ? "nav-item active" : "nav-item"}>
            Resources
          </Link>
        </div>

        {/* Desktop Actions */}
        <div className="nav-desktop-actions">
          <Link href="/login" className="nav-login-icon-btn" title="Log in" aria-label="Log in">
            <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            <span>Login</span>
          </Link>
          <Link href="/signup" className="nav-cta nav-desktop-cta">Get started</Link>
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
          <Link href="/" className={isActive("/") ? "mobile-nav-item active" : "mobile-nav-item"} onClick={closeMenu}>
            Home
          </Link>
          <Link href="/product" className={isActive("/product") ? "mobile-nav-item active" : "mobile-nav-item"} onClick={closeMenu}>
            Product
          </Link>
          <Link href="/solutions" className={isActive("/solutions") ? "mobile-nav-item active" : "mobile-nav-item"} onClick={closeMenu}>
            Solutions
          </Link>
          <Link href="/pricing" className={isActive("/pricing") ? "mobile-nav-item active" : "mobile-nav-item"} onClick={closeMenu}>
            Pricing
          </Link>
          <Link href="/resources" className={isActive("/resources") ? "mobile-nav-item active" : "mobile-nav-item"} onClick={closeMenu}>
            Resources
          </Link>
          <Link href="/login" className="nav-login-icon-btn" onClick={closeMenu} style={{ justifyContent: "center", width: "100%" }}>
            <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            <span>Login</span>
          </Link>
          <Link href="/signup" className="nav-cta" onClick={closeMenu} style={{ width: "100%", textAlign: "center" }}>
            Get started
          </Link>
        </div>
      )}
    </nav>
  );
};
