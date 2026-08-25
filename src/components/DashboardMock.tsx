'use client';

import React from "react";

export const DashboardMock: React.FC = () => {
  return (
    <div className="dash-wrap">
      <div className="wrap">
        <div className="dash" id="dashMock">
          <div className="dash-side">
            <div className="dash-brand">
              <img src="/logo/logo.png" alt="VIFEms Logo" style={{ height: "24px", width: "auto", objectFit: "contain" }} />
            </div>

            <div className="dash-nav-item active" data-nav><span className="dot"></span>Dashboard</div>
            <div className="dash-nav-item" data-nav><span className="dot"></span>People</div>
            <div className="dash-nav-item" data-nav><span className="dot"></span>Attendance</div>
            <div className="dash-nav-item" data-nav><span className="dot"></span>Payments</div>
            <div className="dash-nav-item" data-nav><span className="dot"></span>Staff</div>
            <div className="dash-nav-item" data-nav><span className="dot"></span>Reports</div>
          </div>
          
          <div className="dash-main">
            <div className="dash-topbar">
              <div className="dash-org">
                <div className="dash-org-name">Bright Future Academy</div>
                <div className="dash-org-sub">VIFEMS WORKSPACE</div>
              </div>
              <div className="dash-topbar-right" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div className="dash-bell" title="Notifications" aria-label="Notifications" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                  </svg>
                </div>
                <div className="dash-avatar" title="Admin User" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="dash-greeting" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <svg viewBox="0 0 24 24" width="18" height="18" stroke="var(--primary)" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
              <span><strong>Good morning, Admin</strong> — here&apos;s what&apos;s happening today.</span>
            </div>

            <div className="dash-kpis">
              <div className="dash-kpi" data-kpi>
                <div className="kv" data-count="1500" data-suffix="+">1,500+</div>
                <div className="kl">Total people</div>
                <div className="kd">↑ 12.5% this month</div>
              </div>
              <div className="dash-kpi" data-kpi>
                <div className="kv" data-count="98" data-suffix="%">98%</div>
                <div className="kl">Today&apos;s attendance</div>
                <div className="kd">1,470 present · 30 absent</div>
              </div>
              <div className="dash-kpi" data-kpi>
                <div className="kv" data-count="2.5" data-suffix="M" data-prefix="₦">₦2.5M</div>
                <div className="kl">Payments this month</div>
                <div className="kd">↑ 14.2%</div>
              </div>
              <div className="dash-kpi" data-kpi>
                <div className="kv" data-count="340" data-suffix="K" data-prefix="₦">₦340K</div>
                <div className="kl">Outstanding balance</div>
                <div className="kd" style={{ color: "var(--warning)" }}>Across 8 accounts</div>
              </div>
            </div>

            <div className="dash-panels">
              <div className="dash-panel">
                <div className="dash-panel-title">Attendance overview — this week</div>
                <div className="dash-chart" id="dashChart">
                  <div className="dash-bar" style={{ height: "52px" }}></div>
                  <div className="dash-bar" style={{ height: "68px" }}></div>
                  <div className="dash-bar" style={{ height: "61px" }}></div>
                  <div className="dash-bar" style={{ height: "80px" }}></div>
                  <div className="dash-bar" style={{ height: "74px" }}></div>
                  <div className="dash-bar" style={{ height: "90px" }}></div>
                  <div className="dash-bar" style={{ height: "96px" }}></div>
                </div>
              </div>
              <div className="dash-panel">
                <div className="dash-panel-title">Recent payments</div>
                <div className="dash-pay-row">
                  <span>John Adeyemi</span>
                  <span className="dash-pay-amt">₦25,000</span>
                </div>
                <div className="dash-pay-row">
                  <span>Sarah James</span>
                  <span className="dash-pay-amt">₦15,000</span>
                </div>
                <div className="dash-pay-row">
                  <span>Michael Obi</span>
                  <span className="dash-pay-amt">₦30,000</span>
                </div>
                <div className="dash-pay-row">
                  <span>Amaka Chukwu</span>
                  <span className="dash-pay-amt">₦20,000</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
