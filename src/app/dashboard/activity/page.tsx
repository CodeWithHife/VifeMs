'use client';

import React, { useState } from 'react';
import {
  HistoryIcon,
  SearchIcon,
  DownloadIcon,
  FileTextIcon,
} from '@/components/icons/DashboardIcons';
import { ActivityLogItem } from '@/types/dashboard';
import { getWorkspaceStore } from '@/lib/dashboardStore';

export default function ActivityLogPage() {
  const [activities, setActivities] = useState<ActivityLogItem[]>([]);
  const [moduleFilter, setModuleFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  React.useEffect(() => {
    const store = getWorkspaceStore();
    setActivities(store.activities);
    const handleUpdate = () => {
      setActivities(getWorkspaceStore().activities);
    };
    window.addEventListener('vifems_workspace_updated', handleUpdate);
    return () => window.removeEventListener('vifems_workspace_updated', handleUpdate);
  }, []);

  const modules = ['All', 'Finance', 'Tasks', 'Customers', 'Reports', 'Settings'];

  const filtered = activities.filter((act) => {
    const matchesMod = moduleFilter === 'All' || act.module === moduleFilter;
    const q = searchQuery.toLowerCase().trim();
    const matchesQuery =
      !q ||
      act.userName.toLowerCase().includes(q) ||
      act.action.toLowerCase().includes(q) ||
      act.recordAffected.toLowerCase().includes(q);
    return matchesMod && matchesQuery;
  });

  return (
    <div>
      {/* ---------- PAGE TOP HEADER ---------- */}
      <div className="page-top-header">
        <div className="page-title-group">
          <h1>
            <HistoryIcon size={24} style={{ color: '#2563eb' }} />
            Auditable Activity Log
          </h1>
          <p>Complete historical timeline of administrative and operational actions across VIFEMS.</p>
        </div>

        <div className="page-controls-group">
          <button type="button" className="btn-secondary">
            <DownloadIcon size={16} />
            <span>Export Audit Trail</span>
          </button>
        </div>
      </div>

      {/* ---------- FILTERS ---------- */}
      <div className="table-filter-bar">
        <div className="search-input-wrap">
          <SearchIcon size={16} />
          <input
            type="text"
            className="dash-search-input"
            placeholder="Search by user name, action, or affected record..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="filter-controls-wrap">
          <select
            className="dash-select-filter"
            value={moduleFilter}
            onChange={(e) => setModuleFilter(e.target.value)}
          >
            {modules.map((m) => (
              <option key={m} value={m}>
                {m === 'All' ? 'All Modules' : m}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ---------- AUDIT LOG TABLE (PAGE 31) ---------- */}
      <div className="dash-table-wrapper">
        <table className="dash-table">
          <thead>
            <tr>
              <th>User / Member</th>
              <th>Action Performed</th>
              <th>Record Affected</th>
              <th>Module</th>
              <th>Timestamp</th>
              <th>IP / Device</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((item) => (
              <tr key={item.id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div className="user-avatar-circle" style={{ width: '28px', height: '28px', fontSize: '11px' }}>
                      {item.userName.split(' ').map((n) => n[0]).join('')}
                    </div>
                    <div>
                      <span className="table-primary-text">{item.userName}</span>
                      <span className="table-sub-text" style={{ display: 'block' }}>{item.userRole}</span>
                    </div>
                  </div>
                </td>
                <td>
                  <span style={{ fontSize: '13.5px', color: '#1e293b', fontWeight: 600 }}>{item.action}</span>
                </td>
                <td>
                  <span className="status-pill todo" style={{ fontSize: '12px' }}>{item.recordAffected}</span>
                </td>
                <td>
                  <span className="status-pill progress" style={{ fontSize: '11.5px' }}>{item.module}</span>
                </td>
                <td>
                  <span className="table-sub-text">{item.timestamp}</span>
                </td>
                <td>
                  <span className="table-sub-text" style={{ fontFamily: 'monospace' }}>{item.ipAddress}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
