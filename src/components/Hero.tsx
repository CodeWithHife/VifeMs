'use client';

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export const Hero: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [displayText, setDisplayText] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const fullText = "Manage. Simplify. Grow.";

  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      if (index <= fullText.length) {
        setDisplayText(fullText.slice(0, index));
        index++;
      } else {
        clearInterval(timer);
        setIsTyping(false);
      }
    }, 70);

    return () => clearInterval(timer);
  }, []);

  return (
    <header className="hero">
      {/* Floating Background SVG Icons */}
      <div className="hero-bg-icons">
        <span className="floating-icon">
          <svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.6" fill="none">
            <path d="M12 2L2 7l10 5 10-5-10-5z"/>
            <path d="M2 17l10 5 10-5"/>
            <path d="M2 12l10 5 10-5"/>
          </svg>
        </span>
        <span className="floating-icon">
          <svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.6" fill="none">
            <rect x="2" y="2" width="20" height="20" rx="2"/>
            <path d="M8 2v20"/>
            <path d="M16 2v20"/>
            <path d="M2 8h20"/>
            <path d="M2 16h20"/>
          </svg>
        </span>
        <span className="floating-icon">
          <svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.6" fill="none">
            <circle cx="12" cy="8" r="4"/>
            <path d="M5.3 18.3C5.3 15.2 8.3 13 12 13s6.7 2.2 6.7 5.3"/>
          </svg>
        </span>
        <span className="floating-icon">
          <svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.6" fill="none">
            <path d="M3 3v18h18"/>
            <path d="M18 7v10"/>
            <path d="M14 10v7"/>
            <path d="M10 13v4"/>
            <path d="M6 16v1"/>
          </svg>
        </span>
        <span className="floating-icon">
          <svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.6" fill="none">
            <rect x="1" y="4" width="22" height="16" rx="2"/>
            <circle cx="9" cy="12" r="2"/>
            <path d="M18 8l-4 4 4 4"/>
          </svg>
        </span>
        <span className="floating-icon">
          <svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.6" fill="none">
            <rect x="3" y="4" width="18" height="18" rx="2"/>
            <path d="M16 2v4"/>
            <path d="M8 2v4"/>
            <path d="M3 10h18"/>
            <circle cx="12" cy="15" r="1.5"/>
            <circle cx="16" cy="15" r="1.5"/>
          </svg>
        </span>
        <span className="floating-icon">
          <svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.6" fill="none">
            <circle cx="12" cy="12" r="3"/>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H5.78a1.65 1.65 0 0 0-1.51 1 1.65 1.65 0 0 0 .33 1.82l.04.04A8 8 0 0 0 12 19.5a8 8 0 0 0 6.36-3.36z"/>
            <path d="M6.5 6.5l11 11"/>
          </svg>
        </span>
        <span className="floating-icon">
          <svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.6" fill="none">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
            <polyline points="22 4 12 14.01 9 11.01"/>
          </svg>
        </span>
      </div>

      <div className="wrap">
        <div className="eyebrow">
          <span className="eyebrow-dot"></span>Now onboarding our first organizations
        </div>
        
        <h1 className="hero-title">
          Run your organization without the administrative chaos.
        </h1>

        {/* Animated Typewriter Motto */}
        <p className="hero-motto">
          <span>{displayText}</span>
          {isTyping && <span className="typewriter-caret">|</span>}
        </p>


        <p className="hero-sub">
          VIFEMS brings your people, staff, attendance, payments and reports into one connected workspace — so you stop chasing spreadsheets, notebooks and WhatsApp threads to find out what's actually going on.
        </p>

        {/* Action CTAs with animated icons & spring hover */}
        <div className="hero-actions">
          <a href={isAuthenticated ? "/dashboard" : "/signup"} className="hero-btn-main">
            <span>{isAuthenticated ? "Go to Dashboard" : "Start free trial"}</span>
            <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="hero-arrow-icon">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </a>
          <a href="#how" className="hero-btn-sec">
            <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="hero-play-icon">
              <circle cx="12" cy="12" r="10"></circle>
              <polygon points="10 8 16 12 10 16 10 8"></polygon>
            </svg>
            <span>See how it works</span>
          </a>
        </div>

        <p className="hero-note" style={{ marginTop: "12px" }}>{isAuthenticated ? "Welcome back! Your workspace is ready." : "No credit card required."}</p>
      </div>
    </header>
  );
};
