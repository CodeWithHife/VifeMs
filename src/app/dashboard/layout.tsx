'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  HomeIcon,
  CheckSquareIcon,
  UsersGroupIcon,
  UserBadgeIcon,
  WalletIcon,
  ChartBarIcon,
  BellAlertIcon,
  HistoryIcon,
  GearIcon,
  HelpCircleIcon,
  SearchIcon,
  PlusIcon,
  MenuIcon,
  XIcon,
  FileTextIcon,
} from '@/components/icons/DashboardIcons';
import { getWorkspaceStore, getDefaultWorkspaceStore, WorkspaceStorageData } from '@/lib/dashboardStore';
import './dashboard.css';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const [workspace, setWorkspace] = useState<WorkspaceStorageData>(getDefaultWorkspaceStore());
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [quickActionModalOpen, setQuickActionModalOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [currentDateFormatted, setCurrentDateFormatted] = useState('');

  // Sync workspace store on mount and when changes occur
  useEffect(() => {
    setWorkspace(getWorkspaceStore());
    setCurrentDateFormatted(
      new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    );
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

  const unreadNotifCount = workspace.notifications.filter((n) => !n.read).length;
  const activeTasksCount = workspace.tasks.filter((t) => t.status !== 'Completed' && t.status !== 'Cancelled').length;

  // Keyboard shortcut for search (Ctrl+K or Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setSearchModalOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchModalOpen(false);
      router.push(`/dashboard/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: <HomeIcon size={20} /> },
    { href: '/dashboard/tasks', label: 'Tasks', icon: <CheckSquareIcon size={20} />, badge: activeTasksCount > 0 ? `${activeTasksCount}` : undefined },
    { href: '/dashboard/customers', label: 'Customers', icon: <UsersGroupIcon size={20} /> },
    { href: '/dashboard/staff', label: 'Staff', icon: <UserBadgeIcon size={20} /> },
    { href: '/dashboard/finance', label: 'Finance & Invoices', icon: <WalletIcon size={20} /> },
    { href: '/dashboard/reports', label: 'Reports', icon: <ChartBarIcon size={20} /> },
    { href: '/dashboard/notifications', label: 'Notifications', icon: <BellAlertIcon size={20} />, badge: unreadNotifCount > 0 ? `${unreadNotifCount}` : undefined, isAlertBadge: true },
    { href: '/dashboard/activity', label: 'Activity Log', icon: <HistoryIcon size={20} /> },
    { href: '/dashboard/settings', label: 'Settings', icon: <GearIcon size={20} /> },
    { href: '/dashboard/support', label: 'Help & Support', icon: <HelpCircleIcon size={20} /> },
  ];


  return (
    <div className="dash-shell">
      {/* ---------- SIDEBAR NAVIGATION ---------- */}
      <aside className={`dash-sidebar ${sidebarCollapsed ? 'collapsed' : ''} ${mobileMenuOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-top">
          <Link href="/dashboard" className="sidebar-logo-link">
            <img src="/logo/logo.png" alt="VIFEMS Logo" className="sidebar-logo-img" />
          </Link>
          <button
            type="button"
            className="sidebar-collapse-btn"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            aria-label="Toggle sidebar"
          >
            <MenuIcon size={16} />
          </button>
        </div>

        {/* Organization Badge Box */}
        {!sidebarCollapsed && (
          <div className="sidebar-org-box">
            {workspace.organization.logo && workspace.organization.logo !== '/logo/logo.png' ? (
              <img
                src={workspace.organization.logo}
                alt="Org Logo"
                style={{ width: '32px', height: '32px', borderRadius: '8px', objectFit: 'contain' }}
              />
            ) : (
              <div className="org-avatar-badge">
                {(workspace.organization.name || 'W').charAt(0).toUpperCase()}
              </div>
            )}
            <div className="org-details">
              <span className="org-name">{workspace.organization.name || 'My Workspace'}</span>
              <span className="org-plan">{workspace.organization.businessType || 'General Business'}</span>
            </div>
          </div>
        )}

        {/* Nav Links */}
        <nav className="sidebar-nav">
          <span className="nav-section-label">{!sidebarCollapsed ? 'Main Menu' : '•••'}</span>
          {navItems.map((item) => {
            const isActive = item.href === '/dashboard' ? pathname === '/dashboard' : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`nav-item ${isActive ? 'active' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
                title={sidebarCollapsed ? item.label : undefined}
              >
                <span className="nav-item-icon">{item.icon}</span>
                {!sidebarCollapsed && <span>{item.label}</span>}
                {!sidebarCollapsed && item.badge && (
                  <span className={`nav-item-badge ${item.isAlertBadge ? 'alert-badge' : ''}`}>
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Profile Footer */}
        <div className="sidebar-footer">
          <Link href="/dashboard/settings" className="user-profile-summary" title="View Profile">
            <div className="user-avatar-circle">{workspace.user.avatar || 'WA'}</div>
            {!sidebarCollapsed && (
              <div className="user-info-text">
                <span className="user-name-text">{workspace.user.name || 'Workspace Admin'}</span>
                <span className="user-role-text">{workspace.user.role || 'Administrator'}</span>
              </div>
            )}
          </Link>
        </div>
      </aside>

      {/* Mobile Drawer Overlay Backdrop */}
      {mobileMenuOpen && (
        <div
          className="dash-sidebar-overlay"
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* ---------- MAIN CONTENT SHELL ---------- */}
      <div className="dash-main">
        {/* Sticky Header */}
        <header className="dash-header">
          <div className="header-left">
            <button
              type="button"
              className="sidebar-collapse-btn mobile-menu-trigger"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Open mobile menu"
            >
              <MenuIcon size={18} />
            </button>
            <div className="header-greeting">
              <h2>Good day, {(workspace.user.name || 'Admin').split(' ')[0]}</h2>
              <p suppressHydrationWarning>{currentDateFormatted || 'Welcome'} &bull; {workspace.organization.name || 'Workspace'}</p>
            </div>
          </div>

          <div className="header-right">
            {/* Global Search Button */}
            <button
              type="button"
              className="global-search-btn"
              onClick={() => setSearchModalOpen(true)}
              title="Search everything (Ctrl+K)"
            >
              <SearchIcon size={16} />
              <span>Search anything...</span>
              <kbd className="search-shortcut-tag">Ctrl K</kbd>
            </button>

            {/* Notifications Menu Trigger */}
            <div style={{ position: 'relative' }}>
              <button
                type="button"
                className="header-action-btn"
                onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
                title="Notifications"
                aria-label="Notifications"
              >
                <BellAlertIcon size={18} />
                {unreadNotifCount > 0 && <span className="header-badge-dot" />}
              </button>

              {/* Notification Popover Dropdown */}
              {notifDropdownOpen && (
                <div
                  style={{
                    position: 'absolute',
                    top: '48px',
                    right: '0',
                    width: '320px',
                    background: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '16px',
                    boxShadow: '0 10px 30px rgba(15, 23, 42, 0.15)',
                    zIndex: 60,
                    overflow: 'hidden',
                  }}
                >
                  <div style={{ padding: '14px 16px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '13.5px', fontWeight: 700, color: '#0f172a' }}>Notifications</span>
                    <Link
                      href="/dashboard/notifications"
                      onClick={() => setNotifDropdownOpen(false)}
                      style={{ fontSize: '12px', color: '#2563eb', fontWeight: 600 }}
                    >
                      View all
                    </Link>
                  </div>
                  <div style={{ maxHeight: '280px', overflowY: 'auto' }}>
                    {workspace.notifications.length === 0 ? (
                      <div style={{ padding: '20px', textAlign: 'center', fontSize: '13px', color: '#64748b' }}>
                        No notifications
                      </div>
                    ) : (
                      workspace.notifications.slice(0, 3).map((n) => (
                        <div
                          key={n.id}
                          style={{
                            padding: '12px 16px',
                            borderBottom: '1px solid #f8fafc',
                            background: n.read ? '#ffffff' : '#eff6ff',
                          }}
                        >
                          <div style={{ fontSize: '12.5px', fontWeight: 700, color: '#0f172a' }}>{n.title}</div>
                          <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>{n.description}</div>
                          <div style={{ fontSize: '10.5px', color: '#94a3b8', marginTop: '4px' }}>{n.time}</div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Quick Action Button (Opens Global Dispatcher) */}
            <button
              type="button"
              className="quick-action-primary-btn"
              onClick={() => setQuickActionModalOpen(true)}
              title="Fast Business Action"
            >
              <PlusIcon size={16} />
              <span>Quick Action</span>
            </button>
          </div>
        </header>

        {/* Dynamic Nested Page Content */}
        <main className="dash-content">{children}</main>
      </div>

      {/* ---------- GLOBAL QUICK-ACTION MODAL (PAGE 46) ---------- */}
      {quickActionModalOpen && (
        <div className="dash-modal-backdrop" onClick={() => setQuickActionModalOpen(false)}>
          <div className="dash-modal" onClick={(e) => e.stopPropagation()}>
            <div className="dash-modal-header">
              <h3>
                <PlusIcon size={20} style={{ color: '#2563eb' }} />
                Quick Business Actions
              </h3>
              <button
                type="button"
                className="dash-modal-close-btn"
                onClick={() => setQuickActionModalOpen(false)}
                aria-label="Close"
              >
                <XIcon size={18} />
              </button>
            </div>

            <div className="dash-modal-body">
              <div className="quick-action-grid">
                <button
                  type="button"
                  className="quick-action-card-btn"
                  onClick={() => {
                    setQuickActionModalOpen(false);
                    router.push('/dashboard/customers?action=new');
                  }}
                >
                  <div className="quick-action-card-icon">
                    <UsersGroupIcon size={22} />
                  </div>
                  <span>Add Customer</span>
                </button>

                <button
                  type="button"
                  className="quick-action-card-btn"
                  onClick={() => {
                    setQuickActionModalOpen(false);
                    router.push('/dashboard/tasks?action=new');
                  }}
                >
                  <div className="quick-action-card-icon">
                    <CheckSquareIcon size={22} />
                  </div>
                  <span>Create Task</span>
                </button>

                <button
                  type="button"
                  className="quick-action-card-btn"
                  onClick={() => {
                    setQuickActionModalOpen(false);
                    router.push('/dashboard/staff?action=new');
                  }}
                >
                  <div className="quick-action-card-icon">
                    <UserBadgeIcon size={22} />
                  </div>
                  <span>Add Staff</span>
                </button>

                <button
                  type="button"
                  className="quick-action-card-btn"
                  onClick={() => {
                    setQuickActionModalOpen(false);
                    router.push('/dashboard/finance?action=new-invoice');
                  }}
                >
                  <div className="quick-action-card-icon">
                    <FileTextIcon size={22} />
                  </div>
                  <span>Create Invoice</span>
                </button>

                <button
                  type="button"
                  className="quick-action-card-btn"
                  onClick={() => {
                    setQuickActionModalOpen(false);
                    router.push('/dashboard/finance?action=new-transaction');
                  }}
                >
                  <div className="quick-action-card-icon">
                    <WalletIcon size={22} />
                  </div>
                  <span>Record Transaction</span>
                </button>

                <button
                  type="button"
                  className="quick-action-card-btn"
                  onClick={() => {
                    setQuickActionModalOpen(false);
                    router.push('/dashboard/reports');
                  }}
                >
                  <div className="quick-action-card-icon">
                    <ChartBarIcon size={22} />
                  </div>
                  <span>Generate Report</span>
                </button>
              </div>
            </div>

            <div className="dash-modal-footer">
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setQuickActionModalOpen(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---------- GLOBAL SEARCH DIALOG (PAGE 14 QUICK POPUP) ---------- */}
      {searchModalOpen && (
        <div className="dash-modal-backdrop" onClick={() => setSearchModalOpen(false)}>
          <div className="dash-modal" style={{ maxWidth: '540px' }} onClick={(e) => e.stopPropagation()}>
            <form onSubmit={handleSearchSubmit}>
              <div style={{ padding: '18px 20px', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <SearchIcon size={20} style={{ color: '#2563eb' }} />
                <input
                  type="text"
                  placeholder="Search customers, staff, tasks, invoices, reports..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                  style={{
                    width: '100%',
                    border: 'none',
                    outline: 'none',
                    fontSize: '15px',
                    fontFamily: 'inherit',
                    color: '#0f172a',
                  }}
                />
                <button
                  type="button"
                  className="dash-modal-close-btn"
                  onClick={() => setSearchModalOpen(false)}
                >
                  <XIcon size={18} />
                </button>
              </div>

              <div style={{ padding: '16px 20px', background: '#f8fafc' }}>
                <span style={{ fontSize: '11.5px', fontWeight: 700, textTransform: 'uppercase', color: '#94a3b8', letterSpacing: '0.5px' }}>
                  Quick Shortcuts
                </span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '8px' }}>
                  <button
                    type="button"
                    className="status-pill todo"
                    onClick={() => {
                      setSearchModalOpen(false);
                      router.push('/dashboard/tasks');
                    }}
                  >
                    Tasks
                  </button>
                  <button
                    type="button"
                    className="status-pill progress"
                    onClick={() => {
                      setSearchModalOpen(false);
                      router.push('/dashboard/customers');
                    }}
                  >
                    Customers
                  </button>
                  <button
                    type="button"
                    className="status-pill active"
                    onClick={() => {
                      setSearchModalOpen(false);
                      router.push('/dashboard/finance');
                    }}
                  >
                    Invoices
                  </button>
                  <button
                    type="button"
                    className="status-pill vip"
                    onClick={() => {
                      setSearchModalOpen(false);
                      router.push('/dashboard/reports');
                    }}
                  >
                    Reports
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
