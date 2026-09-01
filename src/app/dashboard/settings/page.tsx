'use client';

import React, { useState, useEffect } from 'react';
import {
  GearIcon,
  UserBadgeIcon,
  ShieldCheckIcon,
  LockIcon,
  WalletIcon,
  BellAlertIcon,
  CheckSquareIcon,
  CheckCircleIcon,
} from '@/components/icons/DashboardIcons';
import {
  getWorkspaceStore,
  getDefaultWorkspaceStore,
  saveWorkspaceStore,
  getCurrencySymbol,
  DEFAULT_ORGANIZATION,
  DEFAULT_USER,
} from '@/lib/dashboardStore';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<
    'organization' | 'profile' | 'roles' | 'permissions' | 'notifications' | 'security' | 'billing'
  >('organization');

  const [workspace, setWorkspace] = useState(getDefaultWorkspaceStore());
  // Org Settings State (Page 33)
  const [org, setOrg] = useState(DEFAULT_ORGANIZATION);
  // User Profile State (Page 34)
  const [userProfile, setUserProfile] = useState(DEFAULT_USER);
  // Notification Preferences State (Page 37)
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [pushAlerts, setPushAlerts] = useState(true);
  const [taskAlerts, setTaskAlerts] = useState(true);
  const [paymentAlerts, setPaymentAlerts] = useState(true);
  // Security 2FA State (Page 38)
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  // Saved feedback banner
  const [savedToast, setSavedToast] = useState<string | null>(null);

  useEffect(() => {
    const store = getWorkspaceStore();
    setWorkspace(store);
    setOrg(store.organization);
    setUserProfile(store.user);
    const handleUpdate = () => {
      const updatedStore = getWorkspaceStore();
      setWorkspace(updatedStore);
      setOrg(updatedStore.organization);
      setUserProfile(updatedStore.user);
    };
    window.addEventListener('vifems_workspace_updated', handleUpdate);
    return () => window.removeEventListener('vifems_workspace_updated', handleUpdate);
  }, []);

  const triggerSave = (msg: string) => {
    setSavedToast(msg);
    setTimeout(() => setSavedToast(null), 2500);
  };

  const handleSaveOrg = (e: React.FormEvent) => {
    e.preventDefault();
    const curStore = getWorkspaceStore();
    saveWorkspaceStore({
      ...curStore,
      organization: org,
      activities: [
        {
          id: `act-${Date.now()}`,
          userName: curStore.user.name,
          userRole: curStore.user.role,
          action: `Updated Organization settings (${org.name})`,
          recordAffected: 'Workspace Settings',
          module: 'Settings',
          timestamp: 'Just now',
          ipAddress: '127.0.0.1',
        },
        ...curStore.activities,
      ],
    });
    triggerSave('Organization profile and settings updated successfully.');
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const curStore = getWorkspaceStore();
    saveWorkspaceStore({
      ...curStore,
      user: userProfile,
      activities: [
        {
          id: `act-${Date.now()}`,
          userName: userProfile.name,
          userRole: userProfile.role,
          action: 'Updated personal profile settings',
          recordAffected: 'User Account',
          module: 'Settings',
          timestamp: 'Just now',
          ipAddress: '127.0.0.1',
        },
        ...curStore.activities,
      ],
    });
    triggerSave('Personal profile changes saved.');
  };

  return (
    <div>
      {/* ---------- PAGE TOP HEADER ---------- */}
      <div className="page-top-header">
        <div className="page-title-group">
          <h1>
            <GearIcon size={24} style={{ color: '#2563eb' }} />
            Settings &amp; Workspace Administration
          </h1>
          <p>Configure organization profile, member permissions, security standards, and billing preferences.</p>
        </div>
      </div>

      {/* Save Toast Notification */}
      {savedToast && (
        <div className="onboarding-toast" style={{ top: '80px' }}>
          <span>{savedToast}</span>
        </div>
      )}

      {/* ---------- SETTINGS CATEGORY TABS (PAGE 32) ---------- */}
      <div className="dash-tabs-bar">
        <button
          type="button"
          className={`dash-tab-btn ${activeTab === 'organization' ? 'active' : ''}`}
          onClick={() => setActiveTab('organization')}
        >
          Organization (Page 33)
        </button>
        <button
          type="button"
          className={`dash-tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          My Profile (Page 34)
        </button>
        <button
          type="button"
          className={`dash-tab-btn ${activeTab === 'roles' ? 'active' : ''}`}
          onClick={() => setActiveTab('roles')}
        >
          Users &amp; Roles (Page 35)
        </button>
        <button
          type="button"
          className={`dash-tab-btn ${activeTab === 'permissions' ? 'active' : ''}`}
          onClick={() => setActiveTab('permissions')}
        >
          Permissions Matrix (Page 36)
        </button>
        <button
          type="button"
          className={`dash-tab-btn ${activeTab === 'notifications' ? 'active' : ''}`}
          onClick={() => setActiveTab('notifications')}
        >
          Notification Settings (Page 37)
        </button>
        <button
          type="button"
          className={`dash-tab-btn ${activeTab === 'security' ? 'active' : ''}`}
          onClick={() => setActiveTab('security')}
        >
          Security &amp; 2FA (Page 38)
        </button>
        <button
          type="button"
          className={`dash-tab-btn ${activeTab === 'billing' ? 'active' : ''}`}
          onClick={() => setActiveTab('billing')}
        >
          Billing &amp; Plans (Page 39)
        </button>
      </div>

      {/* ============================================================
          PAGE 33: ORGANIZATION SETTINGS
         ============================================================ */}
      {activeTab === 'organization' && (
        <div className="dash-panel-card" style={{ maxWidth: '840px' }}>
          <div className="panel-card-header">
            <h3 className="panel-card-title">Organization Profile &amp; Location</h3>
          </div>

          <form onSubmit={handleSaveOrg}>
            <div className="form-grid-2">
              <div className="dash-form-group">
                <label htmlFor="org-name">Organization Name</label>
                <input
                  id="org-name"
                  type="text"
                  className="dash-input"
                  value={org.name}
                  onChange={(e) => setOrg({ ...org, name: e.target.value })}
                  required
                />
              </div>

              <div className="dash-form-group">
                <label htmlFor="org-email">Official Operations Email</label>
                <input
                  id="org-email"
                  type="email"
                  className="dash-input"
                  value={org.email}
                  onChange={(e) => setOrg({ ...org, email: e.target.value })}
                  required
                />
              </div>

              <div className="dash-form-group">
                <label htmlFor="org-phone">Phone Number</label>
                <input
                  id="org-phone"
                  type="tel"
                  className="dash-input"
                  value={org.phone}
                  onChange={(e) => setOrg({ ...org, phone: e.target.value })}
                />
              </div>

              <div className="dash-form-group">
                <label htmlFor="org-website">Website URL</label>
                <input
                  id="org-website"
                  type="url"
                  className="dash-input"
                  value={org.website}
                  onChange={(e) => setOrg({ ...org, website: e.target.value })}
                />
              </div>

              <div className="dash-form-group form-grid-full">
                <label htmlFor="org-address">Headquarters Address</label>
                <input
                  id="org-address"
                  type="text"
                  className="dash-input"
                  value={org.address}
                  onChange={(e) => setOrg({ ...org, address: e.target.value })}
                />
              </div>

              <div className="dash-form-group">
                <label htmlFor="org-currency">Default Currency</label>
                <select
                  id="org-currency"
                  className="dash-select"
                  value={org.currency}
                  onChange={(e) => setOrg({ ...org, currency: e.target.value })}
                >
                  <option value="NGN">NGN (₦) - Nigerian Naira</option>
                  <option value="USD">USD ($) - US Dollar</option>
                  <option value="GBP">GBP (£) - British Pound</option>
                  <option value="EUR">EUR (€) - Euro</option>
                </select>
              </div>

              <div className="dash-form-group">
                <label htmlFor="org-timezone">Time Zone</label>
                <select
                  id="org-timezone"
                  className="dash-select"
                  value={org.timeZone}
                  onChange={(e) => setOrg({ ...org, timeZone: e.target.value })}
                >
                  <option value="Africa/Lagos">Africa/Lagos (GMT+1)</option>
                  <option value="UTC">UTC (GMT+0)</option>
                  <option value="America/New_York">America/New_York (EST)</option>
                  <option value="Europe/London">Europe/London (BST)</option>
                </select>
              </div>
            </div>

            <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
              <button type="submit" className="btn-primary">
                Save Organization Changes
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ============================================================
          PAGE 34: PROFILE SETTINGS
         ============================================================ */}
      {activeTab === 'profile' && (
        <div className="dash-panel-card" style={{ maxWidth: '840px' }}>
          <div className="panel-card-header">
            <h3 className="panel-card-title">My Personal Profile</h3>
          </div>

          <form onSubmit={handleSaveProfile}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
              <div className="user-avatar-circle" style={{ width: '64px', height: '64px', fontSize: '22px' }}>
                {userProfile.avatar}
              </div>
              <div>
                <strong style={{ fontSize: '15px', color: '#0f172a', display: 'block' }}>{userProfile.name}</strong>
                <span style={{ fontSize: '12.5px', color: '#64748b' }}>{userProfile.role} &bull; {userProfile.department}</span>
              </div>
            </div>

            <div className="form-grid-2">
              <div className="dash-form-group">
                <label htmlFor="prof-name">Full Name</label>
                <input
                  id="prof-name"
                  type="text"
                  className="dash-input"
                  value={userProfile.name}
                  onChange={(e) => setUserProfile({ ...userProfile, name: e.target.value, avatar: e.target.value.split(' ').map(n=>n[0]).join('').slice(0,2) })}
                  required
                />
              </div>

              <div className="dash-form-group">
                <label htmlFor="prof-email">Email Address</label>
                <input
                  id="prof-email"
                  type="email"
                  className="dash-input"
                  value={userProfile.email}
                  onChange={(e) => setUserProfile({ ...userProfile, email: e.target.value })}
                  required
                />
              </div>

              <div className="dash-form-group">
                <label htmlFor="prof-phone">Phone Number</label>
                <input
                  id="prof-phone"
                  type="tel"
                  className="dash-input"
                  value={userProfile.phone}
                  onChange={(e) => setUserProfile({ ...userProfile, phone: e.target.value })}
                />
              </div>

              <div className="dash-form-group">
                <label htmlFor="prof-dept">Department</label>
                <input
                  id="prof-dept"
                  type="text"
                  className="dash-input"
                  value={userProfile.department}
                  onChange={(e) => setUserProfile({ ...userProfile, department: e.target.value })}
                />
              </div>
            </div>

            <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
              <button type="submit" className="btn-primary">
                Update My Profile
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ============================================================
          PAGE 35: USERS & ROLES
         ============================================================ */}
      {activeTab === 'roles' && (
        <div className="dash-panel-card">
          <div className="panel-card-header">
            <h3 className="panel-card-title">
              <UserBadgeIcon size={18} style={{ color: '#2563eb' }} />
              Workspace Users &amp; Roles Management
            </h3>
          </div>

          <table className="dash-table">
            <thead>
              <tr>
                <th>Member</th>
                <th>Assigned Role</th>
                <th>Department</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {workspace.staff.map((staff) => (
                <tr key={staff.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div className="user-avatar-circle" style={{ width: '28px', height: '28px', fontSize: '11px' }}>
                        {staff.name.split(' ').map((n) => n[0]).join('')}
                      </div>
                      <div>
                        <strong>{staff.name}</strong>
                        <span className="table-sub-text" style={{ display: 'block' }}>{staff.email}</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="status-pill vip">{staff.role}</span>
                  </td>
                  <td>{staff.department}</td>
                  <td>
                    <span className="status-pill active">{staff.status}</span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button type="button" className="btn-secondary" style={{ fontSize: '12px', padding: '4px 10px' }}>
                      Edit Role
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ============================================================
          PAGE 36: PERMISSIONS MATRIX
         ============================================================ */}
      {activeTab === 'permissions' && (
        <div className="dash-panel-card">
          <div className="panel-card-header">
            <h3 className="panel-card-title">
              <ShieldCheckIcon size={18} style={{ color: '#2563eb' }} />
              Granular Role Permissions Matrix
            </h3>
          </div>

          <table className="dash-table">
            <thead>
              <tr>
                <th>Module</th>
                <th>View</th>
                <th>Create</th>
                <th>Edit</th>
                <th>Delete</th>
                <th>Export</th>
                <th>Approve</th>
              </tr>
            </thead>
            <tbody>
              {['Dashboard', 'Customers', 'Staff', 'Tasks', 'Finance', 'Reports', 'Settings'].map((mod) => (
                <tr key={mod}>
                  <td>
                    <strong>{mod}</strong>
                  </td>
                  <td><input type="checkbox" defaultChecked /></td>
                  <td><input type="checkbox" defaultChecked={mod !== 'Settings'} /></td>
                  <td><input type="checkbox" defaultChecked={mod !== 'Settings'} /></td>
                  <td><input type="checkbox" defaultChecked={mod === 'Tasks' || mod === 'Customers'} /></td>
                  <td><input type="checkbox" defaultChecked /></td>
                  <td><input type="checkbox" defaultChecked={mod === 'Finance'} /></td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
            <button
              type="button"
              className="btn-primary"
              onClick={() => triggerSave('Permissions matrix updated.')}
            >
              Save Permission Rules
            </button>
          </div>
        </div>
      )}

      {/* ============================================================
          PAGE 37: NOTIFICATION SETTINGS
         ============================================================ */}
      {activeTab === 'notifications' && (
        <div className="dash-panel-card" style={{ maxWidth: '780px' }}>
          <div className="panel-card-header">
            <h3 className="panel-card-title">
              <BellAlertIcon size={18} style={{ color: '#2563eb' }} />
              Notification Delivery Channels
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0', cursor: 'pointer' }}>
              <div>
                <strong>Email Summaries &amp; Digest</strong>
                <p style={{ fontSize: '12px', color: '#64748b', margin: '2px 0 0 0' }}>Receive daily executive summaries of workspace activity.</p>
              </div>
              <input type="checkbox" checked={emailAlerts} onChange={(e) => setEmailAlerts(e.target.checked)} />
            </label>

            <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0', cursor: 'pointer' }}>
              <div>
                <strong>Browser Push Notifications</strong>
                <p style={{ fontSize: '12px', color: '#64748b', margin: '2px 0 0 0' }}>Instant desktop popups when tasks are assigned or overdue.</p>
              </div>
              <input type="checkbox" checked={pushAlerts} onChange={(e) => setPushAlerts(e.target.checked)} />
            </label>

            <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0', cursor: 'pointer' }}>
              <div>
                <strong>Task Assignment Alerts</strong>
                <p style={{ fontSize: '12px', color: '#64748b', margin: '2px 0 0 0' }}>Notify me when assigned a new task or mentioned in comments.</p>
              </div>
              <input type="checkbox" checked={taskAlerts} onChange={(e) => setTaskAlerts(e.target.checked)} />
            </label>

            <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0', cursor: 'pointer' }}>
              <div>
                <strong>Payment &amp; Invoice Reminders</strong>
                <p style={{ fontSize: '12px', color: '#64748b', margin: '2px 0 0 0' }}>Alerts on customer payments received or overdue balances.</p>
              </div>
              <input type="checkbox" checked={paymentAlerts} onChange={(e) => setPaymentAlerts(e.target.checked)} />
            </label>
          </div>

          <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
            <button
              type="button"
              className="btn-primary"
              onClick={() => triggerSave('Notification preferences updated.')}
            >
              Save Notification Preferences
            </button>
          </div>
        </div>
      )}

      {/* ============================================================
          PAGE 38: SECURITY & 2FA
         ============================================================ */}
      {activeTab === 'security' && (
        <div className="dash-panel-card" style={{ maxWidth: '780px' }}>
          <div className="panel-card-header">
            <h3 className="panel-card-title">
              <LockIcon size={18} style={{ color: '#2563eb' }} />
              Account Security &amp; Two-Factor Authentication
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* 2FA Card */}
            <div style={{ padding: '18px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <strong style={{ fontSize: '14px', color: '#0f172a' }}>Two-Factor Authentication (2FA)</strong>
                <p style={{ fontSize: '12.5px', color: '#64748b', margin: '3px 0 0 0' }}>
                  Add an extra layer of security via authenticator app verification codes.
                </p>
              </div>
              <button
                type="button"
                className={twoFactorEnabled ? 'btn-secondary' : 'btn-primary'}
                onClick={() => {
                  setTwoFactorEnabled(!twoFactorEnabled);
                  triggerSave(twoFactorEnabled ? '2FA disabled.' : '2FA activated.');
                }}
              >
                {twoFactorEnabled ? 'Disable 2FA' : 'Enable 2FA'}
              </button>
            </div>

            {/* Change Password Form */}
            <div style={{ padding: '18px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '14px' }}>
              <h4 style={{ fontSize: '14px', fontWeight: 700, margin: '0 0 14px 0' }}>Change Account Password</h4>
              <div className="form-grid-2">
                <div className="dash-form-group">
                  <label htmlFor="sec-cur-pwd">Current Password</label>
                  <input id="sec-cur-pwd" type="password" className="dash-input" placeholder="••••••••" />
                </div>
                <div className="dash-form-group">
                  <label htmlFor="sec-new-pwd">New Password</label>
                  <input id="sec-new-pwd" type="password" className="dash-input" placeholder="••••••••" />
                </div>
              </div>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => triggerSave('Password changed successfully.')}
              >
                Update Password
              </button>
            </div>

            {/* Active Sessions */}
            <div>
              <h4 style={{ fontSize: '13.5px', fontWeight: 700, margin: '0 0 10px 0' }}>Active Workspace Sessions</h4>
              <div style={{ padding: '12px 16px', background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: '10px', fontSize: '13px', color: '#065f46' }}>
                Current Session: Windows 11 &bull; Chrome Browser &bull; IP: 102.89.23.114 (Lagos, Nigeria)
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================
          PAGE 39: BILLING & PLANS
         ============================================================ */}
      {activeTab === 'billing' && (
        <div className="dash-panel-card" style={{ maxWidth: '840px' }}>
          <div className="panel-card-header">
            <h3 className="panel-card-title">
              <WalletIcon size={18} style={{ color: '#2563eb' }} />
              Workspace Subscription &amp; Billing
            </h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
            <div style={{ background: '#eff6ff', padding: '20px', borderRadius: '16px', border: '1.5px solid #bfdbfe' }}>
              <span className="status-pill progress" style={{ fontSize: '11px', marginBottom: '6px' }}>Current Plan</span>
              <h3 style={{ fontSize: '22px', fontWeight: 800, color: '#1e40af', margin: '4px 0' }}>VIFEMS Professional</h3>
              <p style={{ fontSize: '13px', color: '#3b82f6', margin: '0 0 14px 0' }}>₦35,000 / month &bull; Renews Sep 30, 2026</p>
              <button type="button" className="btn-primary" style={{ fontSize: '12.5px' }} onClick={() => triggerSave('Enterprise upgrade inquiry opened.')}>
                Upgrade to Enterprise
              </button>
            </div>

            <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
              <span style={{ fontSize: '12px', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Workspace Limits &amp; Usage</span>
              <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                    <span>Team Members</span>
                    <strong>5 / 20 Seats</strong>
                  </div>
                  <div style={{ width: '100%', height: '6px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: '25%', height: '100%', background: '#2563eb' }}></div>
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                    <span>Customer Records</span>
                    <strong>148 / 1,000</strong>
                  </div>
                  <div style={{ width: '100%', height: '6px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: '15%', height: '100%', background: '#10b981' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <h4 style={{ fontSize: '14px', fontWeight: 700, margin: '0 0 10px 0' }}>Payment Method on File</h4>
          <div style={{ padding: '14px 18px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ fontWeight: 800, color: '#1e40af', fontSize: '16px' }}>VISA</div>
              <div>
                <strong style={{ fontSize: '13.5px' }}>•••• •••• •••• 4242</strong>
                <span className="table-sub-text" style={{ display: 'block' }}>Expires 12/28</span>
              </div>
            </div>
            <button type="button" className="btn-secondary" style={{ fontSize: '12px' }} onClick={() => triggerSave('Payment method modal triggered.')}>
              Update Card
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
