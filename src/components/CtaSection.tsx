'use client';

import React from "react";
import { useAuth } from "@/context/AuthContext";

export const CtaSection: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <section className="cta" id="cta">
      <div className="wrap">
        <h2 className="reveal">
          {isAuthenticated ? "Your workspace is ready." : "Ready to manage your business better?"}
        </h2>
        <p className="reveal">
          {isAuthenticated
            ? "Head to your dashboard to manage your team, records, and operations."
            : "Stop piecing your operations together. Let's set up your VIFEMS workspace."}
        </p>
        <div className="cta-actions reveal">
          <a
            href={isAuthenticated ? "/dashboard" : "/signup"}
            className="hero-btn-main"
            style={{ textDecoration: "none" }}
          >
            <span>{isAuthenticated ? "Go to Dashboard" : "Get Started"}</span>
            <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </a>
          <a href="mailto:support@vifems.com" className="btn-ghost" style={{ textDecoration: "none" }}>Talk to the team</a>
        </div>
      </div>
    </section>
  );
};
