'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  ChartBarIcon,
  DownloadIcon,
  TrendingUpIcon,
  ChevronRightIcon,
  XIcon,
} from '@/components/icons/DashboardIcons';
import { ReportItem } from '@/types/dashboard';
import { getWorkspaceStore } from '@/lib/dashboardStore';

function ReportsContent() {
  const searchParams = useSearchParams();
  const initialId = searchParams.get('id');

  const [reports, setReports] = useState<ReportItem[]>([]);
  const [selectedReport, setSelectedReport] = useState<ReportItem | null>(null);
  const [activeCategoryTab, setActiveCategoryTab] = useState<string>('All');
  const [dateRange, setDateRange] = useState('Last 30 Days');
  const [exportToast, setExportToast] = useState<string | null>(null);

  useEffect(() => {
    const store = getWorkspaceStore();
    setReports(store.reports);
    if (initialId) {
      const found = store.reports.find((r) => r.id === initialId);
      if (found) setSelectedReport(found);
    }
    const handleUpdate = () => {
      const updatedStore = getWorkspaceStore();
      setReports(updatedStore.reports);
    };
    window.addEventListener('vifems_workspace_updated', handleUpdate);
    return () => window.removeEventListener('vifems_workspace_updated', handleUpdate);
  }, [initialId]);

  const categories = ['All', 'Financial', 'Staff', 'Customer', 'Operations'];

  const handleExport = (format: 'PDF' | 'CSV' | 'Excel') => {
    setExportToast(`Generating ${format} export...`);
    setTimeout(() => setExportToast(null), 2500);
  };

  const filteredReports = reports.filter((r) =>
    activeCategoryTab === 'All' ? true : r.category === activeCategoryTab
  );

  return (
    <div>
      {/* ---------- PAGE TOP HEADER ---------- */}
      <div className="page-top-header">
        <div className="page-title-group">
          <h1>
            <ChartBarIcon size={24} style={{ color: '#2563eb' }} />
            Business Intelligence &amp; Reports
          </h1>
          <p>Analyze operational velocity, financial returns, customer retention, and staff productivity.</p>
        </div>

        <div className="page-controls-group">
          <select
            className="dash-select-filter"
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
          >
            <option value="Today">Today</option>
            <option value="This Week">This Week</option>
            <option value="Last 30 Days">Last 30 Days</option>
            <option value="This Quarter">This Quarter (Q3 2026)</option>
            <option value="Year to Date">Year to Date (2026)</option>
          </select>
        </div>
      </div>

      {/* Export Toast */}
      {exportToast && (
        <div className="onboarding-toast" style={{ top: '80px' }}>
          <span>{exportToast}</span>
        </div>
      )}

      {/* ---------- REPORT CATEGORY TABS (PAGE 28) ---------- */}
      <div className="dash-tabs-bar">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            className={`dash-tab-btn ${activeCategoryTab === cat ? 'active' : ''}`}
            onClick={() => setActiveCategoryTab(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* ============================================================
          PAGE 28: REPORT CARDS CATALOG
         ============================================================ */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px', marginBottom: '28px' }}>
        {filteredReports.map((report) => (
          <div
            key={report.id}
            className="dash-panel-card"
            style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
            onClick={() => setSelectedReport(report)}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span className="status-pill progress">{report.category}</span>
                <span className="table-sub-text">{report.dateRange}</span>
              </div>
              <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#0f172a', margin: '0 0 8px 0' }}>
                {report.title}
              </h3>
              <p style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.5, margin: '0 0 16px 0' }}>
                {report.summary}
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #f1f5f9', paddingTop: '12px' }}>
              <span style={{ fontSize: '12px', color: '#94a3b8' }}>Generated: {report.generatedDate}</span>
              <button type="button" className="btn-secondary" style={{ fontSize: '12.5px', padding: '6px 12px' }}>
                <span>Inspect Report</span>
                <ChevronRightIcon size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ============================================================
          PAGE 29: REPORT DETAILS VIEW (MODAL / EXPANDED INSPECTOR)
         ============================================================ */}
      {selectedReport && (
        <div className="dash-modal-backdrop" onClick={() => setSelectedReport(null)}>
          <div className="dash-modal" style={{ maxWidth: '820px' }} onClick={(e) => e.stopPropagation()}>
            <div className="dash-modal-header">
              <div>
                <span className="status-pill progress" style={{ fontSize: '11px', marginBottom: '4px' }}>
                  {selectedReport.category}
                </span>
                <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                  {selectedReport.title}
                </h3>
              </div>
              <button
                type="button"
                className="dash-modal-close-btn"
                onClick={() => setSelectedReport(null)}
              >
                <XIcon size={18} />
              </button>
            </div>

            <div className="dash-modal-body">
              {/* Summary description */}
              <div style={{ background: '#eff6ff', padding: '16px 20px', borderRadius: '14px', border: '1px solid #bfdbfe', marginBottom: '20px' }}>
                <strong style={{ fontSize: '13px', color: '#1e40af', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                  Executive Summary
                </strong>
                <p style={{ fontSize: '13.5px', color: '#1e293b', margin: 0, lineHeight: 1.6 }}>
                  {selectedReport.summary}
                </p>
              </div>

              {/* Metrics Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px', marginBottom: '24px' }}>
                {selectedReport.metrics.map((m, idx) => (
                  <div key={idx} style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                    <span style={{ fontSize: '12px', color: '#64748b', display: 'block' }}>{m.title}</span>
                    <div style={{ fontSize: '22px', fontWeight: 800, color: '#0f172a', margin: '4px 0' }}>
                      {m.value}
                    </div>
                    <span className={`kpi-trend-badge ${m.trend}`}>
                      <TrendingUpIcon size={12} />
                      {m.change} ({m.description})
                    </span>
                  </div>
                ))}
              </div>

              {/* Automated Insights */}
              <div style={{ background: '#f8fafc', padding: '18px', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
                <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a', textTransform: 'uppercase', marginBottom: '8px' }}>
                  Key Intelligence Insights
                </h4>
                <ul style={{ paddingLeft: '20px', margin: 0, fontSize: '13px', color: '#334155', lineHeight: 1.7 }}>
                  <li>Operational cash collections are running <strong>5.4% ahead</strong> of target benchmarks.</li>
                  <li>Overdue task ratio has decreased by <strong>2.1%</strong> following staff role reallocations.</li>
                  <li>High retention rate of <strong>94.2%</strong> indicates strong repeat customer satisfaction.</li>
                </ul>
              </div>
            </div>

            <div className="dash-modal-footer" style={{ justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button type="button" className="btn-secondary" style={{ fontSize: '12.5px' }} onClick={() => handleExport('PDF')}>
                  <DownloadIcon size={14} />
                  <span>PDF</span>
                </button>
                <button type="button" className="btn-secondary" style={{ fontSize: '12.5px' }} onClick={() => handleExport('CSV')}>
                  <DownloadIcon size={14} />
                  <span>CSV</span>
                </button>
                <button type="button" className="btn-secondary" style={{ fontSize: '12.5px' }} onClick={() => handleExport('Excel')}>
                  <DownloadIcon size={14} />
                  <span>Excel</span>
                </button>
              </div>

              <button
                type="button"
                className="btn-primary"
                onClick={() => setSelectedReport(null)}
              >
                Close Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ReportsPage() {
  return (
    <Suspense fallback={<div className="dash-panel-card" style={{ padding: '24px', textAlign: 'center' }}>Loading reports...</div>}>
      <ReportsContent />
    </Suspense>
  );
}
