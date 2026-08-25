import React from "react";

export const StatsStrip: React.FC = () => {
  return (
    <section className="stats-section">
      <div className="wrap">
        <div className="stats-grid">
          
          {/* Stat Card 1: Active Users */}
          <div className="stat-card reveal-up">
            <div className="stat-icon-badge stat-blue">
              <svg viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <div className="stat-value-wrap">
              <span className="stat-number" data-count="1500" data-suffix="+">1,500+</span>
            </div>
            <p className="stat-label">Active users & members managed</p>
            <div className="stat-card-glow"></div>
          </div>

          {/* Stat Card 2: Attendance Rate */}
          <div className="stat-card reveal-up" style={{ animationDelay: "0.15s" }}>
            <div className="stat-icon-badge stat-emerald">
              <svg viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>
            <div className="stat-value-wrap">
              <span className="stat-number" data-count="98" data-suffix="%">98%</span>
            </div>
            <p className="stat-label">Attendance tracked in real-time</p>
            <div className="stat-card-glow"></div>
          </div>

          {/* Stat Card 3: Payments Processed */}
          <div className="stat-card reveal-up" style={{ animationDelay: "0.3s" }}>
            <div className="stat-icon-badge stat-amber">
              <svg viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="5" width="20" height="14" rx="2" />
                <line x1="2" y1="10" x2="22" y2="10" />
              </svg>
            </div>
            <div className="stat-value-wrap">
              <span className="stat-number" data-count="2.5" data-suffix="M+" data-prefix="₦">₦2.5M+</span>
            </div>
            <p className="stat-label">Payments & fees processed securely</p>
            <div className="stat-card-glow"></div>
          </div>

        </div>
      </div>
    </section>
  );
};
