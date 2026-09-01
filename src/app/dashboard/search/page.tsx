'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  SearchIcon,
  CheckSquareIcon,
  UsersGroupIcon,
  UserBadgeIcon,
  WalletIcon,
  ChartBarIcon,
  ChevronRightIcon,
} from '@/components/icons/DashboardIcons';
import {
  getWorkspaceStore,
  getDefaultWorkspaceStore,
  getCurrencySymbol,
} from '@/lib/dashboardStore';

function GlobalSearchContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  const [query, setQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [workspace, setWorkspace] = useState(getDefaultWorkspaceStore());

  useEffect(() => {
    if (initialQuery) {
      setQuery(initialQuery);
    }
    const store = getWorkspaceStore();
    setWorkspace(store);
    const handleUpdate = () => {
      setWorkspace(getWorkspaceStore());
    };
    window.addEventListener('vifems_workspace_updated', handleUpdate);
    return () => window.removeEventListener('vifems_workspace_updated', handleUpdate);
  }, [initialQuery]);

  const curSymbol = getCurrencySymbol(workspace.organization.currency);

  // Aggregate all searchable items
  const allItems = [
    ...workspace.tasks.map((t) => ({
      id: t.id,
      name: t.title,
      type: 'Task',
      category: 'Tasks',
      metadata: `Assignee: ${t.assigneeName} • Priority: ${t.priority} • Status: ${t.status}`,
      lastUpdated: t.dueDate ? `Due ${t.dueDate}` : t.createdAt,
      link: `/dashboard/tasks?id=${t.id}`,
      icon: <CheckSquareIcon size={18} />,
    })),
    ...workspace.customers.map((c) => ({
      id: c.id,
      name: `${c.firstName} ${c.lastName}`,
      type: 'Customer',
      category: 'Customers',
      metadata: `${c.customerType} • ${c.email} • ${c.phone}`,
      lastUpdated: c.lastActivity,
      link: `/dashboard/customers?id=${c.id}`,
      icon: <UsersGroupIcon size={18} />,
    })),
    ...workspace.staff.map((s) => ({
      id: s.id,
      name: s.name,
      type: 'Staff',
      category: 'Staff',
      metadata: `${s.role} • ${s.department} • ${s.email}`,
      lastUpdated: s.lastActive,
      link: `/dashboard/staff?id=${s.id}`,
      icon: <UserBadgeIcon size={18} />,
    })),
    ...workspace.transactions.map((tx) => ({
      id: tx.id,
      name: tx.title,
      type: 'Transaction',
      category: 'Transactions',
      metadata: `${tx.type} • ${curSymbol}${tx.amount.toLocaleString()} • Ref: ${tx.reference}`,
      lastUpdated: tx.date,
      link: `/dashboard/finance?tab=transactions`,
      icon: <WalletIcon size={18} />,
    })),
    ...workspace.reports.map((r) => ({
      id: r.id,
      name: r.title,
      type: 'Report',
      category: 'Reports',
      metadata: `${r.category} Performance • Date Range: ${r.dateRange}`,
      lastUpdated: r.generatedDate,
      link: `/dashboard/reports?id=${r.id}`,
      icon: <ChartBarIcon size={18} />,
    })),
  ];

  // Filtering
  const filteredResults = allItems.filter((item) => {
    const matchesCat = selectedCategory === 'All' || item.category === selectedCategory;
    const qLower = query.toLowerCase().trim();
    if (!qLower) return matchesCat;
    const matchesQuery =
      item.name.toLowerCase().includes(qLower) ||
      item.type.toLowerCase().includes(qLower) ||
      item.metadata.toLowerCase().includes(qLower);
    return matchesCat && matchesQuery;
  });

  const categories = ['All', 'Customers', 'Staff', 'Tasks', 'Transactions', 'Reports'];

  return (
    <div>
      {/* Page Header */}
      <div className="page-top-header">
        <div className="page-title-group">
          <h1>
            <SearchIcon size={24} style={{ color: '#2563eb' }} />
            Global Search
          </h1>
          <p>Instantly find customers, staff, tasks, transactions, and business reports.</p>
        </div>
      </div>

      {/* Main Search Input Bar */}
      <div style={{ marginBottom: '24px' }}>
        <div className="search-input-wrap" style={{ maxWidth: '100%' }}>
          <SearchIcon size={20} />
          <input
            type="text"
            className="dash-search-input"
            placeholder="Search by keywords, names, transaction amounts, reference codes, or emails..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{ height: '48px', fontSize: '15px', paddingLeft: '48px', borderRadius: '16px' }}
            autoFocus
          />
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="dash-tabs-bar">
        {categories.map((cat) => {
          const count = allItems.filter((i) => (cat === 'All' ? true : i.category === cat)).length;
          return (
            <button
              key={cat}
              type="button"
              className={`dash-tab-btn ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              <span>{cat}</span>
              <span className="tab-counter">{count}</span>
            </button>
          );
        })}
      </div>

      {/* Search Results List */}
      <div className="dash-table-wrapper">
        {filteredResults.length > 0 ? (
          <table className="dash-table">
            <thead>
              <tr>
                <th style={{ width: '40px' }}>Icon</th>
                <th>Name / Title</th>
                <th>Type</th>
                <th>Relevant Metadata</th>
                <th>Last Activity / Due Date</th>
                <th style={{ textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredResults.map((res) => (
                <tr key={`${res.type}-${res.id}`}>
                  <td>
                    <div className="kpi-icon-wrapper" style={{ width: '32px', height: '32px', borderRadius: '8px' }}>
                      {res.icon}
                    </div>
                  </td>
                  <td>
                    <span className="table-primary-text">{res.name}</span>
                  </td>
                  <td>
                    <span className="status-pill progress">{res.type}</span>
                  </td>
                  <td>
                    <span className="table-sub-text">{res.metadata}</span>
                  </td>
                  <td>
                    <span className="table-sub-text">{res.lastUpdated}</span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <Link href={res.link} className="btn-secondary" style={{ padding: '6px 12px', fontSize: '12.5px' }}>
                      <span>View</span>
                      <ChevronRightIcon size={14} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="dash-empty-state">
            <div className="empty-icon-circle">
              <SearchIcon size={26} />
            </div>
            <h3>No results found for &ldquo;{query}&rdquo;</h3>
            <p>Try searching for a different keyword, name, or check your category filter.</p>
            <button type="button" className="btn-secondary" onClick={() => { setQuery(''); setSelectedCategory('All'); }}>
              Clear Search Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function GlobalSearchPage() {
  return (
    <Suspense fallback={<div className="dash-panel-card" style={{ padding: '24px', textAlign: 'center' }}>Searching workspace...</div>}>
      <GlobalSearchContent />
    </Suspense>
  );
}
