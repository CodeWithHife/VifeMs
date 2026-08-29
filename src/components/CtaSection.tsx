import React from "react";
import Link from "next/link";

export const CtaSection: React.FC = () => {
  return (
    <section className="cta" id="cta">
      <div className="wrap">
        {/* Eyebrow */}
        <div className="cta-eyebrow reveal">
          <span className="cta-eyebrow-dot" />
          Get started today
        </div>

        <h2 className="reveal">
          Ready to manage your business{" "}
          <span>better?</span>
        </h2>

        <p className="reveal">
          Stop piecing your operations together. Let&apos;s set up your VIFEMS workspace and have you running in days.
        </p>

        <div className="cta-actions reveal">
          <Link href="/signup" className="cta-btn-primary">
            <span>Get Started</span>
            <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </Link>
          <a href="mailto:support@vifems.com" className="btn-ghost">
            <svg viewBox="0 0 24 24" width="17" height="17" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
            Talk to the team
          </a>
        </div>

        {/* Trust indicators */}
        <div className="cta-trust reveal">
          <div className="cta-trust-item">
            <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            No credit card required
          </div>
          <div className="cta-trust-item">
            <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            Setup in minutes
          </div>
          <div className="cta-trust-item">
            <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            Cancel anytime
          </div>
        </div>
      </div>
    </section>
  );
};
