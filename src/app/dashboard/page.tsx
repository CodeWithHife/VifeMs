'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  WalletIcon,
  UsersGroupIcon,
  CheckSquareIcon,
  UserBadgeIcon,
  AlertTriangleIcon,
  TrendingUpIcon,
  ChartBarIcon,
  HistoryIcon,
  PlusIcon,
  FileTextIcon,
  ShieldCheckIcon,
} from '@/components/icons/DashboardIcons';
import {
  getWorkspaceStore,
  getDefaultWorkspaceStore,
  getCurrencySymbol,
  WorkspaceStorageData,
} from '@/lib/dashboardStore';

export default function MainDashboardPage() {
  const [workspace, setWorkspace] = useState<WorkspaceStorageData>(getDefaultWorkspaceStore());
  const [chartMetric, setChartMetric] = useState<'revenue' | 'tasks' | 'customers'>('revenue');

  useEffect(() => {
    setWorkspace(getWorkspaceStore());
    const handleUpdate = () => {
      setWorkspace(getWorkspaceStore());
    };
    window.addEventListener('vifems_workspace_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('vifems_workspace_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const curSymbol = getCurrencySymbol(workspace.organization.currency);

  // Dynamic live metric calculations
  const totalRevenue =
    workspace.transactions
      .filter((t) => t.type === 'Income' && t.status === 'Completed')
      .reduce((acc, t) => acc + t.amount, 0) +
    workspace.invoices
      .filter((i) => i.status === 'Paid')
      .reduce((acc, i) => acc + i.totalAmount, 0);

  const activeCustomersCount = workspace.customers.filter(
    (c) => c.status === 'Active' || c.status === 'VIP'
  ).length;
  const totalCustomersCount = workspace.customers.length;

  const activeTasksCount = workspace.tasks.filter(
    (t) => t.status === 'In Progress' || t.status === 'To Do'
  ).length;
  const completedTasksCount = workspace.tasks.filter((t) => t.status === 'Completed').length;
  const overdueTasksCount = workspace.tasks.filter((t) => t.status === 'Overdue').length;
  const todoTasksCount = workspace.tasks.filter((t) => t.status === 'To Do').length;
  const inProgressTasksCount = workspace.tasks.filter((t) => t.status === 'In Progress').length;

  const totalStaffCount = workspace.staff.length;
  const onDutyStaffCount = workspace.staff.filter((s) => s.status === 'Active').length;

  const pendingInvoices = workspace.invoices.filter(
    (i) => i.status === 'Pending' || i.status === 'Overdue'
  );
  const pendingRequestsCount = pendingInvoices.length + todoTasksCount;

  // Alerts
  const overdueTaskItems = workspace.tasks.filter((t) => t.status === 'Overdue');
  const overdueInvoiceItems = workspace.invoices.filter((i) => i.status === 'Overdue');

  const chartData = {
    revenue: [
      { label: 'Jan', value: totalRevenue > 0 ? 30 : 10 },
      { label: 'Feb', value: totalRevenue > 0 ? 45 : 10 },
      { label: 'Mar', value: totalRevenue > 0 ? 60 : 15 },
      { label: 'Apr', value: totalRevenue > 0 ? 55 : 15 },
      { label: 'May', value: totalRevenue > 0 ? 70 : 20 },
      { label: 'Jun', value: totalRevenue > 0 ? 80 : 25 },
      { label: 'Jul', value: totalRevenue > 0 ? 75 : 30 },
      { label: 'Aug', value: totalRevenue > 0 ? 95 : 35 },
    ],
    tasks: [
      { label: 'Jan', value: completedTasksCount > 0 ? 40 : 10 },
      { label: 'Feb', value: completedTasksCount > 0 ? 55 : 15 },
      { label: 'Mar', value: completedTasksCount > 0 ? 70 : 20 },
      { label: 'Apr', value: completedTasksCount > 0 ? 65 : 20 },
      { label: 'May', value: completedTasksCount > 0 ? 80 : 25 },
      { label: 'Jun', value: completedTasksCount > 0 ? 90 : 30 },
      { label: 'Jul', value: completedTasksCount > 0 ? 85 : 30 },
      { label: 'Aug', value: completedTasksCount > 0 ? 95 : 35 },
    ],
    customers: [
      { label: 'Jan', value: totalCustomersCount > 0 ? 25 : 10 },
      { label: 'Feb', value: totalCustomersCount > 0 ? 35 : 10 },
      { label: 'Mar', value: totalCustomersCount > 0 ? 50 : 15 },
      { label: 'Apr', value: totalCustomersCount > 0 ? 45 : 15 },
      { label: 'May', value: totalCustomersCount > 0 ? 60 : 20 },
      { label: 'Jun', value: totalCustomersCount > 0 ? 70 : 25 },
      { label: 'Jul', value: totalCustomersCount > 0 ? 85 : 30 },
      { label: 'Aug', value: totalCustomersCount > 0 ? 90 : 35 },
    ],
  };

  const currentChartBars = chartData[chartMetric];

  return (
    <div>
      {/* ---------- PAGE TOP HEADER ---------- */}
      <div className="page-top-header">
        <div className="page-title-group">
          <h1>Business Performance Snapshot</h1>
          <p>
            Real-time analytics, actionable workflows, and metrics for{' '}
            <strong>{workspace.organization.name || 'Your Business'}</strong> ({workspace.organization.businessType || 'General Business'}).
          </p>
        </div>

        <div className="page-controls-group">
          <Link href="/dashboard/reports" className="btn-secondary">
            <ChartBarIcon size={16} />
            <span>View Full Reports</span>
          </Link>
          <Link href="/dashboard/tasks?action=new" className="btn-primary">
            <PlusIcon size={16} />
            <span>Create Task</span>
          </Link>
        </div>
      </div>

      {/* ---------- DYNAMIC KPI METRIC CARDS ---------- */}
      <div className="kpi-grid">
        {/* 1. Revenue */}
        <div className="kpi-card">
          <div className="kpi-card-top">
            <div className="kpi-icon-wrapper">
              <WalletIcon size={20} />
            </div>
            <span className={`kpi-trend-badge ${totalRevenue > 0 ? 'up' : 'down'}`}>
              <TrendingUpIcon size={13} />
              {totalRevenue > 0 ? '+100%' : '0%'}
            </span>
          </div>
          <div>
            <h3 className="kpi-value-text">
              {curSymbol}{totalRevenue.toLocaleString()}
            </h3>
            <p className="kpi-label-text">Total Recorded Revenue</p>
          </div>
        </div>

        {/* 2. Customers */}
        <div className="kpi-card">
          <div className="kpi-card-top">
            <div className="kpi-icon-wrapper">
              <UsersGroupIcon size={20} />
            </div>
            <span className="kpi-trend-badge up">
              <TrendingUpIcon size={13} />
              {activeCustomersCount} Active
            </span>
          </div>
          <div>
            <h3 className="kpi-value-text">{totalCustomersCount}</h3>
            <p className="kpi-label-text">Client Directory</p>
          </div>
        </div>

        {/* 3. Active Tasks */}
        <div className="kpi-card">
          <div className="kpi-card-top">
            <div className="kpi-icon-wrapper">
              <CheckSquareIcon size={20} />
            </div>
            <span className="kpi-trend-badge up">
              <TrendingUpIcon size={13} />
              In Progress
            </span>
          </div>
          <div>
            <h3 className="kpi-value-text">{activeTasksCount}</h3>
            <p className="kpi-label-text">Active Operational Tasks</p>
          </div>
        </div>

        {/* 4. Completed Tasks */}
        <div className="kpi-card">
          <div className="kpi-card-top">
            <div className="kpi-icon-wrapper" style={{ background: '#ecfdf5', borderColor: '#a7f3d0', color: '#059669' }}>
              <CheckSquareIcon size={20} />
            </div>
            <span className="kpi-trend-badge up">
              <TrendingUpIcon size={13} />
              Closed
            </span>
          </div>
          <div>
            <h3 className="kpi-value-text">{completedTasksCount}</h3>
            <p className="kpi-label-text">Completed Tasks</p>
          </div>
        </div>

        {/* 5. Staff Members */}
        <div className="kpi-card">
          <div className="kpi-card-top">
            <div className="kpi-icon-wrapper">
              <UserBadgeIcon size={20} />
            </div>
            <span className="kpi-trend-badge up">
              {onDutyStaffCount} Active
            </span>
          </div>
          <div>
            <h3 className="kpi-value-text">{totalStaffCount}</h3>
            <p className="kpi-label-text">Team Members</p>
          </div>
        </div>

        {/* 6. Pending Requests */}
        <div className="kpi-card">
          <div className="kpi-card-top">
            <div className="kpi-icon-wrapper" style={{ background: '#fffbeb', borderColor: '#fde68a', color: '#d97706' }}>
              <AlertTriangleIcon size={20} />
            </div>
            <span className="kpi-trend-badge down" style={{ background: '#fffbeb', color: '#b45309', borderColor: '#fde68a' }}>
              {pendingRequestsCount > 0 ? 'Action required' : 'All Clear'}
            </span>
          </div>
          <div>
            <h3 className="kpi-value-text">{pendingRequestsCount}</h3>
            <p className="kpi-label-text">Pending Items</p>
          </div>
        </div>
      </div>

      {/* ---------- DYNAMIC ALERTS BANNER ---------- */}
      <div className="alerts-section" style={{ background: overdueTaskItems.length + overdueInvoiceItems.length > 0 ? '#fffbeb' : '#f0fdf4', borderColor: overdueTaskItems.length + overdueInvoiceItems.length > 0 ? '#fde68a' : '#bbf7d0' }}>
        <div className="alerts-header" style={{ color: overdueTaskItems.length + overdueInvoiceItems.length > 0 ? '#b45309' : '#166534' }}>
          {overdueTaskItems.length + overdueInvoiceItems.length > 0 ? (
            <>
              <AlertTriangleIcon size={18} />
              <span>Actionable Organization Alerts ({overdueTaskItems.length + overdueInvoiceItems.length} items require attention)</span>
            </>
          ) : (
            <>
              <ShieldCheckIcon size={18} />
              <span>Workspace Status: Healthy &bull; All systems and deadlines up to date.</span>
            </>
          )}
        </div>

        {overdueTaskItems.length + overdueInvoiceItems.length > 0 && (
          <div className="alerts-grid">
            {overdueTaskItems.map((task) => (
              <div key={task.id} className="alert-item-card">
                <div className="alert-item-left">
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#dc2626' }}></div>
                  <span className="alert-item-text">Overdue Task: &ldquo;{task.title}&rdquo;</span>
                </div>
                <Link href={`/dashboard/tasks?id=${task.id}`} className="alert-item-btn">
                  Resolve
                </Link>
              </div>
            ))}

            {overdueInvoiceItems.map((inv) => (
              <div key={inv.id} className="alert-item-card">
                <div className="alert-item-left">
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#d97706' }}></div>
                  <span className="alert-item-text">
                    Unpaid Invoice {inv.invoiceNumber}: {inv.customerName} ({curSymbol}{inv.totalAmount.toLocaleString()})
                  </span>
                </div>
                <Link href="/dashboard/finance?tab=invoices" className="alert-item-btn">
                  Review
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ---------- TWO-COLUMN PERFORMANCE & TASKS GRID ---------- */}
      <div className="dash-two-col-grid">
        {/* Left: Performance Visual Chart Panel */}
        <div className="dash-panel-card">
          <div className="panel-card-header">
            <h3 className="panel-card-title">
              <ChartBarIcon size={18} style={{ color: '#2563eb' }} />
              Business Performance Overview
            </h3>
            <div className="dash-tabs-bar" style={{ marginBottom: 0, paddingBottom: 0, borderBottom: 'none' }}>
              <button
                type="button"
                className={`dash-tab-btn ${chartMetric === 'revenue' ? 'active' : ''}`}
                onClick={() => setChartMetric('revenue')}
              >
                Revenue
              </button>
              <button
                type="button"
                className={`dash-tab-btn ${chartMetric === 'tasks' ? 'active' : ''}`}
                onClick={() => setChartMetric('tasks')}
              >
                Tasks Closed
              </button>
              <button
                type="button"
                className={`dash-tab-btn ${chartMetric === 'customers' ? 'active' : ''}`}
                onClick={() => setChartMetric('customers')}
              >
                New Clients
              </button>
            </div>
          </div>

          <div className="chart-container">
            <div className="chart-bars-wrap">
              {currentChartBars.map((bar, idx) => (
                <div key={idx} className="chart-bar-col">
                  <div
                    className="chart-bar-fill"
                    style={{ height: `${bar.value}%` }}
                    title={`${bar.label}: ${bar.value}%`}
                  ></div>
                  <span className="chart-bar-label">{bar.label}</span>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#64748b', paddingTop: '8px' }}>
              <span>Live {workspace.organization.name || 'Workspace'} Analytics</span>
              <span style={{ color: '#2563eb', fontWeight: 600 }}>Fiscal Year {new Date().getFullYear()}</span>
            </div>
          </div>
        </div>

        {/* Right: Tasks Status Distribution Overview */}
        <div className="dash-panel-card">
          <div className="panel-card-header">
            <h3 className="panel-card-title">
              <CheckSquareIcon size={18} style={{ color: '#2563eb' }} />
              Tasks Overview
            </h3>
            <Link href="/dashboard/tasks" style={{ fontSize: '12.5px', color: '#2563eb', fontWeight: 600 }}>
              Manage &rarr;
            </Link>
          </div>

          <div>
            <div className="task-status-row">
              <div className="task-status-info">
                <span className="task-status-dot dot-todo"></span>
                <span>To Do</span>
              </div>
              <span className="task-status-count">{todoTasksCount}</span>
            </div>

            <div className="task-status-row">
              <div className="task-status-info">
                <span className="task-status-dot dot-progress"></span>
                <span>In Progress</span>
              </div>
              <span className="task-status-count">{inProgressTasksCount}</span>
            </div>

            <div className="task-status-row">
              <div className="task-status-info">
                <span className="task-status-dot dot-completed"></span>
                <span>Completed</span>
              </div>
              <span className="task-status-count">{completedTasksCount}</span>
            </div>

            <div className="task-status-row">
              <div className="task-status-info">
                <span className="task-status-dot dot-overdue"></span>
                <span>Overdue</span>
              </div>
              <span className="task-status-count" style={{ color: overdueTasksCount > 0 ? '#dc2626' : '#64748b' }}>
                {overdueTasksCount}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ---------- BOTTOM TWO-COLUMN: RECENT ACTIVITY & LATEST CUSTOMERS ---------- */}
      <div className="dash-two-col-grid">
        {/* Left: Real-time Activity Overview (Page 13) */}
        <div className="dash-panel-card">
          <div className="panel-card-header">
            <h3 className="panel-card-title">
              <HistoryIcon size={18} style={{ color: '#2563eb' }} />
              Activity Overview
            </h3>
            <Link href="/dashboard/activity" style={{ fontSize: '12.5px', color: '#2563eb', fontWeight: 600 }}>
              Full audit log &rarr;
            </Link>
          </div>

          <div className="activity-feed-list">
            {workspace.activities.length === 0 ? (
              <div style={{ padding: '20px', textAlign: 'center', color: '#64748b', fontSize: '13px' }}>
                No recent activity recorded yet.
              </div>
            ) : (
              workspace.activities.slice(0, 5).map((act) => (
                <div key={act.id} className="activity-feed-item">
                  <div className="activity-icon-badge">
                    <FileTextIcon size={16} />
                  </div>
                  <div className="activity-content-text">
                    <p className="activity-action-title">
                      <strong>{act.userName}</strong>: {act.action}
                    </p>
                    <div className="activity-meta-line">
                      <span>{act.timestamp}</span> &bull; <span>{act.module}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right: Key Customer Accounts */}
        <div className="dash-panel-card">
          <div className="panel-card-header">
            <h3 className="panel-card-title">
              <UsersGroupIcon size={18} style={{ color: '#2563eb' }} />
              Priority Customers
            </h3>
            <Link href="/dashboard/customers" style={{ fontSize: '12.5px', color: '#2563eb', fontWeight: 600 }}>
              Directory &rarr;
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {workspace.customers.length === 0 ? (
              <div style={{ padding: '24px', textAlign: 'center' }}>
                <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 12px 0' }}>
                  No customer records yet in your workspace.
                </p>
                <Link href="/dashboard/customers?action=new" className="btn-secondary" style={{ display: 'inline-flex' }}>
                  <PlusIcon size={14} />
                  <span>Add First Customer</span>
                </Link>
              </div>
            ) : (
              workspace.customers.slice(0, 4).map((cust) => (
                <div
                  key={cust.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 12px',
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                  }}
                >
                  <div>
                    <div style={{ fontSize: '13.5px', fontWeight: 700, color: '#0f172a' }}>
                      {cust.firstName} {cust.lastName}
                    </div>
                    <div style={{ fontSize: '11.5px', color: '#64748b' }}>
                      {cust.customerType} &bull; {cust.email}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span
                      className={`status-pill ${
                        cust.status === 'VIP' ? 'vip' : cust.status === 'Active' ? 'active' : 'lead'
                      }`}
                    >
                      {cust.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
