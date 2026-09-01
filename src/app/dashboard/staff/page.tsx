'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  UserBadgeIcon,
  PlusIcon,
  SearchIcon,
  EditIcon,
  TrashIcon,
  ShieldCheckIcon,
  CheckSquareIcon,
  HistoryIcon,
  XIcon,
  AlertTriangleIcon,
  CheckCircleIcon,
} from '@/components/icons/DashboardIcons';
import { StaffMember } from '@/types/dashboard';
import { getWorkspaceStore, saveWorkspaceStore } from '@/lib/dashboardStore';

export default function StaffPage() {
  const searchParams = useSearchParams();
  const initialAction = searchParams.get('action');
  const initialId = searchParams.get('id');

  const [staffList, setStaffList] = useState<StaffMember[]>([]);
  const [activeRoleTab, setActiveRoleTab] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals & Drawers
  const [addStaffModalOpen, setAddStaffModalOpen] = useState<boolean>(initialAction === 'new');
  const [staffProfileDrawer, setStaffProfileDrawer] = useState<StaffMember | null>(null);
  const [staffTab, setStaffTab] = useState<'Overview' | 'Tasks' | 'Activity' | 'Performance'>('Overview');
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<StaffMember['role']>('Staff');
  const [department, setDepartment] = useState('Operations');

  useEffect(() => {
    const store = getWorkspaceStore();
    setStaffList(store.staff);
    const handleUpdate = () => {
      setStaffList(getWorkspaceStore().staff);
    };
    window.addEventListener('vifems_workspace_updated', handleUpdate);
    return () => window.removeEventListener('vifems_workspace_updated', handleUpdate);
  }, []);

  useEffect(() => {
    if (initialId) {
      const found = staffList.find((s) => s.id === initialId);
      if (found) setStaffProfileDrawer(found);
    }
  }, [initialId, staffList]);

  const totalStaff = staffList.length;
  const activeStaff = staffList.filter((s) => s.status === 'Active').length;
  const inactiveStaff = staffList.filter((s) => s.status !== 'Active').length;

  const handleAddStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    const newStaff: StaffMember = {
      id: `STF-0${staffList.length + 1}`,
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim() || '+234 800 000 0000',
      role,
      department,
      status: 'Active',
      tasksAssigned: 0,
      tasksCompleted: 0,
      lastActive: 'Just invited',
      joinedDate: new Date().toISOString().split('T')[0],
      permissions: role === 'Administrator' ? ['ALL_PERMISSIONS'] : ['VIEW_TASKS', 'EDIT_TASKS'],
    };

    const updated = [...staffList, newStaff];
    setStaffList(updated);
    const currentStore = getWorkspaceStore();
    saveWorkspaceStore({
      ...currentStore,
      staff: updated,
      activities: [
        {
          id: `act-${Date.now()}`,
          userName: currentStore.user.name,
          userRole: currentStore.user.role,
          action: `Invited new team member: ${newStaff.name} (${newStaff.role})`,
          recordAffected: `Staff ${newStaff.id}`,
          module: 'Staff',
          timestamp: 'Just now',
          ipAddress: '127.0.0.1',
        },
        ...currentStore.activities,
      ],
    });
    setAddStaffModalOpen(false);
    setName('');
    setEmail('');
    setPhone('');
  };

  const handleDeleteStaff = (id: string) => {
    const updated = staffList.filter((s) => s.id !== id);
    setStaffList(updated);
    const currentStore = getWorkspaceStore();
    saveWorkspaceStore({
      ...currentStore,
      staff: updated,
    });
    if (staffProfileDrawer?.id === id) setStaffProfileDrawer(null);
    setConfirmDeleteId(null);
  };

  const filteredStaff = staffList.filter((s) => {
    const matchesRole = activeRoleTab === 'All' || s.role === activeRoleTab;
    const q = searchQuery.toLowerCase().trim();
    const matchesQuery =
      !q ||
      s.name.toLowerCase().includes(q) ||
      s.email.toLowerCase().includes(q) ||
      s.department.toLowerCase().includes(q);
    return matchesRole && matchesQuery;
  });

  const roles = ['All', 'Administrator', 'Manager', 'Staff'];

  return (
    <div>
      {/* ---------- PAGE TOP HEADER ---------- */}
      <div className="page-top-header">
        <div className="page-title-group">
          <h1>
            <UserBadgeIcon size={24} style={{ color: '#2563eb' }} />
            Staff Management
          </h1>
          <p>Manage team member profiles, access roles, workload distribution, and invitations.</p>
        </div>

        <div className="page-controls-group">
          <button type="button" className="btn-primary" onClick={() => setAddStaffModalOpen(true)}>
            <PlusIcon size={16} />
            <span>Add Staff Member</span>
          </button>
        </div>
      </div>

      {/* ---------- STAFF STATS CARDS (PAGE 21) ---------- */}
      <div className="kpi-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginBottom: '20px' }}>
        <div className="kpi-card">
          <span className="kpi-label-text">Total Staff</span>
          <h3 className="kpi-value-text">{totalStaff}</h3>
        </div>
        <div className="kpi-card">
          <span className="kpi-label-text">Active On-Duty</span>
          <h3 className="kpi-value-text" style={{ color: '#059669' }}>{activeStaff}</h3>
        </div>
        <div className="kpi-card">
          <span className="kpi-label-text">Inactive / On Leave</span>
          <h3 className="kpi-value-text" style={{ color: '#64748b' }}>{inactiveStaff}</h3>
        </div>
      </div>

      {/* ---------- ROLE TABS ---------- */}
      <div className="dash-tabs-bar">
        {roles.map((r) => {
          const count = r === 'All' ? staffList.length : staffList.filter((s) => s.role === r).length;
          return (
            <button
              key={r}
              type="button"
              className={`dash-tab-btn ${activeRoleTab === r ? 'active' : ''}`}
              onClick={() => setActiveRoleTab(r)}
            >
              <span>{r}</span>
              <span className="tab-counter">{count}</span>
            </button>
          );
        })}
      </div>

      {/* ---------- SEARCH & FILTERS ---------- */}
      <div className="table-filter-bar">
        <div className="search-input-wrap">
          <SearchIcon size={16} />
          <input
            type="text"
            className="dash-search-input"
            placeholder="Search by staff name, email, or department..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* ---------- STAFF TABLE (PAGE 21) ---------- */}
      <div className="dash-table-wrapper">
        {filteredStaff.length > 0 ? (
          <table className="dash-table">
            <thead>
              <tr>
                <th>Staff Name</th>
                <th>Role</th>
                <th>Department</th>
                <th>Status</th>
                <th>Tasks Completed</th>
                <th>Last Active</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStaff.map((staff) => (
                <tr key={staff.id} style={{ cursor: 'pointer' }} onClick={() => setStaffProfileDrawer(staff)}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div className="user-avatar-circle" style={{ width: '32px', height: '32px', fontSize: '12px' }}>
                        {staff.name.split(' ').map((n) => n[0]).join('')}
                      </div>
                      <div>
                        <span className="table-primary-text">{staff.name}</span>
                        <span className="table-sub-text">{staff.email}</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className={`status-pill ${staff.role === 'Administrator' ? 'vip' : staff.role === 'Manager' ? 'progress' : 'todo'}`}>
                      <ShieldCheckIcon size={12} />
                      {staff.role}
                    </span>
                  </td>
                  <td>
                    <span style={{ fontSize: '13px', color: '#334155' }}>{staff.department}</span>
                  </td>
                  <td>
                    <span className={`status-pill ${staff.status === 'Active' ? 'active' : 'draft'}`}>
                      {staff.status}
                    </span>
                  </td>
                  <td>
                    <span className="table-primary-text">{staff.tasksCompleted}</span>
                    <span className="table-sub-text" style={{ marginLeft: '4px' }}>({staff.tasksAssigned} active)</span>
                  </td>
                  <td>
                    <span className="table-sub-text">{staff.lastActive}</span>
                  </td>
                  <td style={{ textAlign: 'right' }} onClick={(e) => e.stopPropagation()}>
                    <div className="table-actions" style={{ justifyContent: 'flex-end' }}>
                      <button
                        type="button"
                        className="btn-table-icon"
                        onClick={() => setStaffProfileDrawer(staff)}
                        title="View Profile"
                      >
                        <EditIcon size={14} />
                      </button>
                      <button
                        type="button"
                        className="btn-table-icon delete"
                        onClick={() => setConfirmDeleteId(staff.id)}
                        title="Remove Staff"
                      >
                        <TrashIcon size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="dash-empty-state">
            <div className="empty-icon-circle">
              <UserBadgeIcon size={26} />
            </div>
            <h3>No staff members found</h3>
            <p>Invite your first colleague or update your role filters.</p>
            <button type="button" className="btn-primary" onClick={() => setAddStaffModalOpen(true)}>
              <PlusIcon size={16} />
              <span>Add Staff Member</span>
            </button>
          </div>
        )}
      </div>

      {/* ============================================================
          PAGE 22: ADD STAFF MODAL
         ============================================================ */}
      {addStaffModalOpen && (
        <div className="dash-modal-backdrop" onClick={() => setAddStaffModalOpen(false)}>
          <div className="dash-modal" onClick={(e) => e.stopPropagation()}>
            <div className="dash-modal-header">
              <h3>
                <PlusIcon size={20} style={{ color: '#2563eb' }} />
                Add / Invite Staff Member
              </h3>
              <button
                type="button"
                className="dash-modal-close-btn"
                onClick={() => setAddStaffModalOpen(false)}
              >
                <XIcon size={18} />
              </button>
            </div>

            <form onSubmit={handleAddStaff}>
              <div className="dash-modal-body">
                <div className="dash-form-group">
                  <label htmlFor="staff-full-name">
                    Full Name <span className="req">*</span>
                  </label>
                  <input
                    id="staff-full-name"
                    type="text"
                    className="dash-input"
                    placeholder="e.g. Sarah Jenkins"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div className="form-grid-2">
                  <div className="dash-form-group">
                    <label htmlFor="staff-email">
                      Work Email <span className="req">*</span>
                    </label>
                    <input
                      id="staff-email"
                      type="email"
                      className="dash-input"
                      placeholder="sarah.j@acmeglobal.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div className="dash-form-group">
                    <label htmlFor="staff-phone">Phone Number</label>
                    <input
                      id="staff-phone"
                      type="tel"
                      className="dash-input"
                      placeholder="+234 800 000 0000"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>

                  <div className="dash-form-group">
                    <label htmlFor="staff-role">Role Access</label>
                    <select
                      id="staff-role"
                      className="dash-select"
                      value={role}
                      onChange={(e) => setRole(e.target.value as StaffMember['role'])}
                    >
                      <option value="Staff">Staff (Workflows & Tasks)</option>
                      <option value="Manager">Manager (Operations & Reports)</option>
                      <option value="Administrator">Administrator (Full Access)</option>
                    </select>
                  </div>

                  <div className="dash-form-group">
                    <label htmlFor="staff-dept">Department</label>
                    <select
                      id="staff-dept"
                      className="dash-select"
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                    >
                      <option value="Sales & Inventory">Sales &amp; Inventory</option>
                      <option value="Finance & Accounts">Finance &amp; Accounts</option>
                      <option value="Field Operations">Field Operations</option>
                      <option value="Customer Success">Customer Success</option>
                      <option value="Management & Strategy">Management &amp; Strategy</option>
                    </select>
                  </div>
                </div>

                <div style={{ background: '#f8fafc', padding: '12px 16px', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '12.5px', color: '#64748b' }}>
                  An automated email invitation with login credentials and workspace setup instructions will be sent to the staff member.
                </div>
              </div>

              <div className="dash-modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setAddStaffModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Send Invitation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================
          PAGE 23: STAFF PROFILE DETAILS DRAWER
         ============================================================ */}
      {staffProfileDrawer && (
        <div className="dash-drawer-backdrop" onClick={() => setStaffProfileDrawer(null)}>
          <div className="dash-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="dash-drawer-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div className="user-avatar-circle" style={{ width: '42px', height: '42px', fontSize: '15px' }}>
                  {staffProfileDrawer.name.split(' ').map((n) => n[0]).join('')}
                </div>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                    {staffProfileDrawer.name}
                  </h3>
                  <span className={`status-pill ${staffProfileDrawer.role === 'Administrator' ? 'vip' : 'progress'}`} style={{ marginTop: '4px' }}>
                    {staffProfileDrawer.role} &bull; {staffProfileDrawer.department}
                  </span>
                </div>
              </div>
              <button
                type="button"
                className="dash-modal-close-btn"
                onClick={() => setStaffProfileDrawer(null)}
              >
                <XIcon size={18} />
              </button>
            </div>

            {/* Drawer Tabs */}
            <div className="dash-tabs-bar" style={{ padding: '0 24px', margin: '14px 0', borderBottom: '1px solid #e2e8f0' }}>
              {(['Overview', 'Tasks', 'Activity', 'Performance'] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  className={`dash-tab-btn ${staffTab === tab ? 'active' : ''}`}
                  onClick={() => setStaffTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="dash-drawer-body">
              {staffTab === 'Overview' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                    <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#1e40af', textTransform: 'uppercase', marginBottom: '12px' }}>
                      Profile Information
                    </h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '13px' }}>
                      <div>
                        <span style={{ color: '#64748b', fontSize: '11.5px', display: 'block' }}>Email</span>
                        <strong>{staffProfileDrawer.email}</strong>
                      </div>
                      <div>
                        <span style={{ color: '#64748b', fontSize: '11.5px', display: 'block' }}>Phone</span>
                        <strong>{staffProfileDrawer.phone}</strong>
                      </div>
                      <div>
                        <span style={{ color: '#64748b', fontSize: '11.5px', display: 'block' }}>Department</span>
                        <span>{staffProfileDrawer.department}</span>
                      </div>
                      <div>
                        <span style={{ color: '#64748b', fontSize: '11.5px', display: 'block' }}>Joined Date</span>
                        <span>{staffProfileDrawer.joinedDate}</span>
                      </div>
                    </div>
                  </div>

                  <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                    <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#1e40af', textTransform: 'uppercase', marginBottom: '12px' }}>
                      Workload Metrics
                    </h4>
                    <div style={{ display: 'flex', gap: '20px' }}>
                      <div>
                        <span style={{ color: '#64748b', fontSize: '12px' }}>Assigned Active</span>
                        <div style={{ fontSize: '20px', fontWeight: 800, color: '#2563eb' }}>
                          {staffProfileDrawer.tasksAssigned}
                        </div>
                      </div>
                      <div>
                        <span style={{ color: '#64748b', fontSize: '12px' }}>Completed Lifetime</span>
                        <div style={{ fontSize: '20px', fontWeight: 800, color: '#059669' }}>
                          {staffProfileDrawer.tasksCompleted}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {staffTab === 'Tasks' && (
                <div>
                  <p style={{ fontSize: '13.5px', color: '#64748b' }}>
                    Currently has <strong>{staffProfileDrawer.tasksAssigned}</strong> active tasks in progress.
                  </p>
                </div>
              )}

              {staffTab === 'Activity' && (
                <div>
                  <p style={{ fontSize: '13.5px', color: '#64748b' }}>
                    Last system activity recorded: <strong>{staffProfileDrawer.lastActive}</strong>.
                  </p>
                </div>
              )}

              {staffTab === 'Performance' && (
                <div>
                  <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                    <span style={{ fontSize: '12.5px', color: '#64748b', display: 'block' }}>Completion Velocity</span>
                    <strong style={{ fontSize: '18px', color: '#059669' }}>96.4% On-Time Delivery Rate</strong>
                  </div>
                </div>
              )}
            </div>

            <div className="dash-drawer-footer">
              <button
                type="button"
                className="btn-danger"
                style={{ fontSize: '13px', padding: '8px 14px' }}
                onClick={() => setConfirmDeleteId(staffProfileDrawer.id)}
              >
                Remove Staff
              </button>
              <button
                type="button"
                className="btn-primary"
                onClick={() => setStaffProfileDrawer(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {confirmDeleteId && (
        <div className="dash-modal-backdrop" onClick={() => setConfirmDeleteId(null)}>
          <div className="dash-modal confirm-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="dash-modal-body">
              <div className="confirm-icon-box">
                <AlertTriangleIcon size={28} />
              </div>
              <h3 className="confirm-title">Remove Staff Account?</h3>
              <p className="confirm-desc">
                This user will lose access to the organization and all assigned tasks will be unassigned.
              </p>
              <div className="confirm-actions">
                <button type="button" className="btn-secondary" onClick={() => setConfirmDeleteId(null)}>
                  Cancel
                </button>
                <button type="button" className="btn-danger" onClick={() => handleDeleteStaff(confirmDeleteId)}>
                  Confirm Remove
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
