'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  BellAlertIcon,
  CheckSquareIcon,
  UsersGroupIcon,
  WalletIcon,
  UserBadgeIcon,
  AlertTriangleIcon,
  CheckCircleIcon,
  ChevronRightIcon,
} from '@/components/icons/DashboardIcons';
import { AppNotification } from '@/types/dashboard';
import { getWorkspaceStore, saveWorkspaceStore } from '@/lib/dashboardStore';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('All');

  useEffect(() => {
    const store = getWorkspaceStore();
    setNotifications(store.notifications);
    const handleUpdate = () => {
      const updatedStore = getWorkspaceStore();
      setNotifications(updatedStore.notifications);
    };
    window.addEventListener('vifems_workspace_updated', handleUpdate);
    return () => window.removeEventListener('vifems_workspace_updated', handleUpdate);
  }, []);

  const handleMarkAsRead = (id: string) => {
    const updated = notifications.map((n) => (n.id === id ? { ...n, read: true } : n));
    setNotifications(updated);
    const curStore = getWorkspaceStore();
    saveWorkspaceStore({
      ...curStore,
      notifications: updated,
    });
  };

  const handleMarkAllAsRead = () => {
    const updated = notifications.map((n) => ({ ...n, read: true }));
    setNotifications(updated);
    const curStore = getWorkspaceStore();
    saveWorkspaceStore({
      ...curStore,
      notifications: updated,
    });
  };

  const categories = ['All', 'Tasks', 'Customers', 'Payments', 'Staff', 'System', 'Alerts'];

  const filtered = notifications.filter((n) =>
    activeCategory === 'All' ? true : n.category === activeCategory
  );

  const getNotificationIcon = (cat: string) => {
    switch (cat) {
      case 'Tasks':
        return <CheckSquareIcon size={18} />;
      case 'Customers':
        return <UsersGroupIcon size={18} />;
      case 'Payments':
        return <WalletIcon size={18} />;
      case 'Staff':
        return <UserBadgeIcon size={18} />;
      case 'Alerts':
        return <AlertTriangleIcon size={18} style={{ color: '#dc2626' }} />;
      default:
        return <BellAlertIcon size={18} />;
    }
  };

  const getRelatedLink = (n: AppNotification) => {
    if (n.relatedType === 'invoice') return '/dashboard/finance?tab=invoices';
    if (n.relatedType === 'transaction') return '/dashboard/finance?tab=transactions';
    if (n.relatedType === 'task') return `/dashboard/tasks?id=${n.relatedId}`;
    if (n.relatedType === 'customer') return `/dashboard/customers?id=${n.relatedId}`;
    return '/dashboard';
  };

  return (
    <div>
      {/* ---------- PAGE TOP HEADER ---------- */}
      <div className="page-top-header">
        <div className="page-title-group">
          <h1>
            <BellAlertIcon size={24} style={{ color: '#2563eb' }} />
            Notifications Center
          </h1>
          <p>Real-time system notices, task assignments, customer alerts, and billing events.</p>
        </div>

        <div className="page-controls-group">
          <button type="button" className="btn-secondary" onClick={handleMarkAllAsRead}>
            <CheckCircleIcon size={16} />
            <span>Mark All as Read</span>
          </button>
        </div>
      </div>

      {/* ---------- CATEGORY TABS ---------- */}
      <div className="dash-tabs-bar">
        {categories.map((cat) => {
          const count = cat === 'All' ? notifications.length : notifications.filter((n) => n.category === cat).length;
          return (
            <button
              key={cat}
              type="button"
              className={`dash-tab-btn ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              <span>{cat}</span>
              <span className="tab-counter">{count}</span>
            </button>
          );
        })}
      </div>

      {/* ---------- NOTIFICATIONS LIST (PAGE 30) ---------- */}
      <div className="dash-table-wrapper">
        {filtered.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {filtered.map((item) => (
              <div
                key={item.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '16px 20px',
                  borderBottom: '1px solid #f1f5f9',
                  background: item.read ? '#ffffff' : '#eff6ff',
                  transition: 'background 0.2s ease',
                  gap: '16px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 1 }}>
                  <div
                    className="kpi-icon-wrapper"
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '10px',
                      background: item.category === 'Alerts' ? '#fee2e2' : '#ffffff',
                      borderColor: item.category === 'Alerts' ? '#fecaca' : '#e2e8f0',
                    }}
                  >
                    {getNotificationIcon(item.category)}
                  </div>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <strong style={{ fontSize: '14px', color: '#0f172a' }}>{item.title}</strong>
                      <span className="status-pill todo" style={{ fontSize: '11px' }}>{item.category}</span>
                      {!item.read && <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#2563eb' }}></span>}
                    </div>
                    <p style={{ fontSize: '13px', color: '#475569', margin: '3px 0 0 0', lineHeight: 1.4 }}>
                      {item.description}
                    </p>
                    <span style={{ fontSize: '11.5px', color: '#94a3b8', marginTop: '4px', display: 'block' }}>
                      {item.time}
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  {!item.read && (
                    <button
                      type="button"
                      className="btn-secondary"
                      style={{ fontSize: '12px', padding: '6px 10px' }}
                      onClick={() => handleMarkAsRead(item.id)}
                    >
                      Mark as read
                    </button>
                  )}
                  {item.relatedType && (
                    <Link
                      href={getRelatedLink(item)}
                      className="btn-primary"
                      style={{ fontSize: '12px', padding: '6px 12px' }}
                    >
                      <span>View record</span>
                      <ChevronRightIcon size={12} />
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="dash-empty-state">
            <div className="empty-icon-circle">
              <BellAlertIcon size={26} />
            </div>
            <h3>No notifications in this category</h3>
            <p>You are all caught up with your workspace alerts and updates.</p>
          </div>
        )}
      </div>
    </div>
  );
}