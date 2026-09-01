'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  UsersGroupIcon,
  PlusIcon,
  SearchIcon,
  EditIcon,
  TrashIcon,
  PhoneIcon,
  MailIcon,
  XIcon,
  AlertTriangleIcon,
} from '@/components/icons/DashboardIcons';
import { Customer } from '@/types/dashboard';
import { getWorkspaceStore, getDefaultWorkspaceStore, saveWorkspaceStore, getCurrencySymbol } from '@/lib/dashboardStore';

function CustomersContent() {
  const searchParams = useSearchParams();
  const initialAction = searchParams.get('action');
  const initialId = searchParams.get('id');

  const [workspace, setWorkspace] = useState(getDefaultWorkspaceStore());
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [activeTypeTab, setActiveTypeTab] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');

  // Modals & Drawers
  const [addCustomerModalOpen, setAddCustomerModalOpen] = useState<boolean>(initialAction === 'new');
  const [customerDetailsDrawer, setCustomerDetailsDrawer] = useState<Customer | null>(null);
  const [profileTab, setProfileTab] = useState<'Overview' | 'Activity' | 'Transactions' | 'Notes'>('Overview');
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  // Form State
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [customerType, setCustomerType] = useState<Customer['customerType']>('Corporate');
  const [notes, setNotes] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [assignedStaff, setAssignedStaff] = useState('');

  useEffect(() => {
    const store = getWorkspaceStore();
    setWorkspace(store);
    setCustomers(store.customers);
    if (store.staff.length > 0 && !assignedStaff) {
      setAssignedStaff(store.staff[0].name);
    }
    const handleUpdate = () => {
      const updatedStore = getWorkspaceStore();
      setWorkspace(updatedStore);
      setCustomers(updatedStore.customers);
    };
    window.addEventListener('vifems_workspace_updated', handleUpdate);
    return () => window.removeEventListener('vifems_workspace_updated', handleUpdate);
  }, []);

  const curSymbol = getCurrencySymbol(workspace.organization.currency);

  useEffect(() => {
    if (initialId) {
      const found = customers.find((c) => c.id === initialId);
      if (found) setCustomerDetailsDrawer(found);
    }
  }, [initialId, customers]);

  const handleSaveCustomer = (e: React.FormEvent, createAnother = false) => {
    e.preventDefault();
    if (!firstName.trim() || !email.trim()) return;

    const newCust: Customer = {
      id: `CUST-00${customers.length + 1}`,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
      phone: phone.trim() || '+234 800 000 0000',
      address: address.trim() || 'Lagos, Nigeria',
      customerType,
      status: 'Active',
      tags: tagsInput ? tagsInput.split(',').map((t) => t.trim()) : ['New Customer'],
      notes: notes.trim(),
      totalTransactions: 0,
      totalSpent: 0,
      assignedStaff: assignedStaff || workspace.user.name,
      lastActivity: 'Just now',
      createdAt: new Date().toISOString().split('T')[0],
    };

    const updated = [newCust, ...customers];
    setCustomers(updated);
    const curStore = getWorkspaceStore();
    saveWorkspaceStore({
      ...curStore,
      customers: updated,
      activities: [
        {
          id: `act-${Date.now()}`,
          userName: curStore.user.name,
          userRole: curStore.user.role,
          action: `Created new Customer record: ${newCust.firstName} ${newCust.lastName}`,
          recordAffected: `Customer ${newCust.id}`,
          module: 'Customers',
          timestamp: 'Just now',
          ipAddress: '127.0.0.1',
        },
        ...curStore.activities,
      ],
    });

    if (createAnother) {
      setFirstName('');
      setLastName('');
      setEmail('');
      setPhone('');
      setAddress('');
      setNotes('');
      setTagsInput('');
    } else {
      setAddCustomerModalOpen(false);
      setFirstName('');
      setLastName('');
      setEmail('');
      setPhone('');
      setAddress('');
      setNotes('');
      setTagsInput('');
    }
  };

  const handleDeleteCustomer = (id: string) => {
    const updated = customers.filter((c) => c.id !== id);
    setCustomers(updated);
    const curStore = getWorkspaceStore();
    saveWorkspaceStore({
      ...curStore,
      customers: updated,
    });
    if (customerDetailsDrawer?.id === id) setCustomerDetailsDrawer(null);
    setConfirmDeleteId(null);
  };

  const filteredCustomers = customers.filter((c) => {
    const matchesTab = activeTypeTab === 'All' || c.customerType === activeTypeTab;
    const matchesStatus = selectedStatus === 'All' || c.status === selectedStatus;
    const q = searchQuery.toLowerCase().trim();
    const matchesQuery =
      !q ||
      `${c.firstName} ${c.lastName}`.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      c.phone.includes(q) ||
      c.assignedStaff.toLowerCase().includes(q);
    return matchesTab && matchesStatus && matchesQuery;
  });

  const types = ['All', 'Enterprise', 'Corporate', 'Individual', 'Partner'];

  return (
    <div>
      {/* ---------- PAGE TOP HEADER ---------- */}
      <div className="page-top-header">
        <div className="page-title-group">
          <h1>
            <UsersGroupIcon size={24} style={{ color: '#2563eb' }} />
            Customer Management
          </h1>
          <p>Maintain client accounts, directories, relationship history, and transactions.</p>
        </div>

        <div className="page-controls-group">
          <button type="button" className="btn-primary" onClick={() => setAddCustomerModalOpen(true)}>
            <PlusIcon size={16} />
            <span>Add Customer</span>
          </button>
        </div>
      </div>

      {/* ---------- TYPE TABS ---------- */}
      <div className="dash-tabs-bar">
        {types.map((type) => {
          const count = type === 'All' ? customers.length : customers.filter((c) => c.customerType === type).length;
          return (
            <button
              key={type}
              type="button"
              className={`dash-tab-btn ${activeTypeTab === type ? 'active' : ''}`}
              onClick={() => setActiveTypeTab(type)}
            >
              <span>{type}</span>
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
            placeholder="Search by name, email, phone, or staff..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="filter-controls-wrap">
          <select
            className="dash-select-filter"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="VIP">VIP</option>
            <option value="Lead">Lead</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* ---------- CUSTOMERS TABLE (PAGE 18) ---------- */}
      <div className="dash-table-wrapper">
        {filteredCustomers.length > 0 ? (
          <table className="dash-table">
            <thead>
              <tr>
                <th>Customer Name</th>
                <th>Contact Details</th>
                <th>Category</th>
                <th>Status</th>
                <th>Total Volume</th>
                <th>Assigned Staff</th>
                <th>Last Activity</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map((cust) => (
                <tr key={cust.id} style={{ cursor: 'pointer' }} onClick={() => setCustomerDetailsDrawer(cust)}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div className="user-avatar-circle" style={{ width: '32px', height: '32px', fontSize: '12px' }}>
                        {cust.firstName.charAt(0)}{cust.lastName.charAt(0)}
                      </div>
                      <div>
                        <span className="table-primary-text">{cust.firstName} {cust.lastName}</span>
                        <span className="table-sub-text">{cust.id}</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontSize: '13px', color: '#0f172a' }}>{cust.email}</span>
                      <span className="table-sub-text">{cust.phone}</span>
                    </div>
                  </td>
                  <td>
                    <span className="status-pill todo" style={{ fontSize: '12px' }}>{cust.customerType}</span>
                  </td>
                  <td>
                    <span className={`status-pill ${cust.status === 'VIP' ? 'vip' : cust.status === 'Active' ? 'active' : 'lead'}`}>
                      {cust.status}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span className="table-primary-text">{curSymbol}{cust.totalSpent.toLocaleString()}</span>
                      <span className="table-sub-text">{cust.totalTransactions} transactions</span>
                    </div>
                  </td>
                  <td>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: '#334155' }}>{cust.assignedStaff}</span>
                  </td>
                  <td>
                    <span className="table-sub-text">{cust.lastActivity}</span>
                  </td>
                  <td style={{ textAlign: 'right' }} onClick={(e) => e.stopPropagation()}>
                    <div className="table-actions" style={{ justifyContent: 'flex-end' }}>
                      <button
                        type="button"
                        className="btn-table-icon"
                        onClick={() => setCustomerDetailsDrawer(cust)}
                        title="View Profile"
                      >
                        <EditIcon size={14} />
                      </button>
                      <button
                        type="button"
                        className="btn-table-icon delete"
                        onClick={() => setConfirmDeleteId(cust.id)}
                        title="Delete Customer"
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
              <UsersGroupIcon size={26} />
            </div>
            <h3>No customers found</h3>
            <p>Add your first client account or adjust your active search query.</p>
            <button type="button" className="btn-primary" onClick={() => setAddCustomerModalOpen(true)}>
              <PlusIcon size={16} />
              <span>Add Your First Customer</span>
            </button>
          </div>
        )}
      </div>

      {/* ============================================================
          PAGE 19: ADD CUSTOMER MODAL
         ============================================================ */}
      {addCustomerModalOpen && (
        <div className="dash-modal-backdrop" onClick={() => setAddCustomerModalOpen(false)}>
          <div className="dash-modal" onClick={(e) => e.stopPropagation()}>
            <div className="dash-modal-header">
              <h3>
                <PlusIcon size={20} style={{ color: '#2563eb' }} />
                Add New Customer
              </h3>
              <button
                type="button"
                className="dash-modal-close-btn"
                onClick={() => setAddCustomerModalOpen(false)}
              >
                <XIcon size={18} />
              </button>
            </div>

            <form onSubmit={(e) => handleSaveCustomer(e, false)}>
              <div className="dash-modal-body">
                <div className="form-grid-2">
                  <div className="dash-form-group">
                    <label htmlFor="cust-first-name">
                      First Name <span className="req">*</span>
                    </label>
                    <input
                      id="cust-first-name"
                      type="text"
                      className="dash-input"
                      placeholder="e.g. Tunde"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="dash-form-group">
                    <label htmlFor="cust-last-name">
                      Last Name <span className="req">*</span>
                    </label>
                    <input
                      id="cust-last-name"
                      type="text"
                      className="dash-input"
                      placeholder="e.g. Bakare"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="dash-form-group">
                    <label htmlFor="cust-email">
                      Email Address <span className="req">*</span>
                    </label>
                    <input
                      id="cust-email"
                      type="email"
                      className="dash-input"
                      placeholder="client@organization.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div className="dash-form-group">
                    <label htmlFor="cust-phone">Phone Number</label>
                    <input
                      id="cust-phone"
                      type="tel"
                      className="dash-input"
                      placeholder="+234 800 000 0000"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                </div>

                <div className="dash-form-group">
                  <label htmlFor="cust-address">Business Address</label>
                  <input
                    id="cust-address"
                    type="text"
                    className="dash-input"
                    placeholder="e.g. 42 Broad Street, Lagos Island"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>

                <div className="form-grid-2">
                  <div className="dash-form-group">
                    <label htmlFor="cust-type">Customer Type</label>
                    <select
                      id="cust-type"
                      className="dash-select"
                      value={customerType}
                      onChange={(e) => setCustomerType(e.target.value as Customer['customerType'])}
                    >
                      <option value="Corporate">Corporate</option>
                      <option value="Enterprise">Enterprise</option>
                      <option value="Individual">Individual</option>
                      <option value="Partner">Partner</option>
                    </select>
                  </div>

                  <div className="dash-form-group">
                    <label htmlFor="cust-staff">Assigned Staff Account Manager</label>
                    <select
                      id="cust-staff"
                      className="dash-select"
                      value={assignedStaff}
                      onChange={(e) => setAssignedStaff(e.target.value)}
                    >
                      {workspace.staff.length === 0 ? (
                        <option value={workspace.user.name}>{workspace.user.name} ({workspace.user.role})</option>
                      ) : (
                        workspace.staff.map((s) => (
                          <option key={s.id} value={s.name}>
                            {s.name} ({s.role})
                          </option>
                        ))
                      )}
                    </select>
                  </div>
                </div>

                <div className="dash-form-group">
                  <label htmlFor="cust-tags">Tags (comma separated)</label>
                  <input
                    id="cust-tags"
                    type="text"
                    className="dash-input"
                    placeholder="e.g. Wholesale, Priority, Recurring"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                  />
                </div>

                <div className="dash-form-group">
                  <label htmlFor="cust-notes">Customer Notes</label>
                  <textarea
                    id="cust-notes"
                    className="dash-textarea"
                    placeholder="Key account details, delivery instructions, or contract agreements..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>
              </div>

              <div className="dash-modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setAddCustomerModalOpen(false)}>
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={(e) => handleSaveCustomer(e, true)}
                >
                  Save &amp; Create Another
                </button>
                <button type="submit" className="btn-primary">
                  Save Customer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================
          PAGE 20: CUSTOMER PROFILE DETAILS DRAWER
         ============================================================ */}
      {customerDetailsDrawer && (
        <div className="dash-drawer-backdrop" onClick={() => setCustomerDetailsDrawer(null)}>
          <div className="dash-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="dash-drawer-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div className="user-avatar-circle" style={{ width: '42px', height: '42px', fontSize: '15px' }}>
                  {customerDetailsDrawer.firstName.charAt(0)}{customerDetailsDrawer.lastName.charAt(0)}
                </div>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                    {customerDetailsDrawer.firstName} {customerDetailsDrawer.lastName}
                  </h3>
                  <span className={`status-pill ${customerDetailsDrawer.status === 'VIP' ? 'vip' : 'active'}`} style={{ marginTop: '4px' }}>
                    {customerDetailsDrawer.status} &bull; {customerDetailsDrawer.customerType}
                  </span>
                </div>
              </div>
              <button
                type="button"
                className="dash-modal-close-btn"
                onClick={() => setCustomerDetailsDrawer(null)}
              >
                <XIcon size={18} />
              </button>
            </div>

            {/* Quick Action Contact Bar */}
            <div style={{ display: 'flex', gap: '8px', padding: '12px 24px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
              <a href={`tel:${customerDetailsDrawer.phone}`} className="btn-secondary" style={{ flex: 1, justifyContent: 'center', fontSize: '12.5px' }}>
                <PhoneIcon size={14} />
                <span>Call</span>
              </a>
              <a href={`mailto:${customerDetailsDrawer.email}`} className="btn-secondary" style={{ flex: 1, justifyContent: 'center', fontSize: '12.5px' }}>
                <MailIcon size={14} />
                <span>Email</span>
              </a>
            </div>

            {/* Drawer Tabs */}
            <div className="dash-tabs-bar" style={{ padding: '0 24px', margin: '14px 0', borderBottom: '1px solid #e2e8f0' }}>
              {(['Overview', 'Activity', 'Transactions', 'Notes'] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  className={`dash-tab-btn ${profileTab === tab ? 'active' : ''}`}
                  onClick={() => setProfileTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="dash-drawer-body">
              {profileTab === 'Overview' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                    <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#1e40af', textTransform: 'uppercase', marginBottom: '12px' }}>
                      Contact &amp; Account Info
                    </h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '13px' }}>
                      <div>
                        <span style={{ color: '#64748b', fontSize: '11.5px', display: 'block' }}>Email</span>
                        <strong>{customerDetailsDrawer.email}</strong>
                      </div>
                      <div>
                        <span style={{ color: '#64748b', fontSize: '11.5px', display: 'block' }}>Phone</span>
                        <strong>{customerDetailsDrawer.phone}</strong>
                      </div>
                      <div>
                        <span style={{ color: '#64748b', fontSize: '11.5px', display: 'block' }}>Address</span>
                        <span>{customerDetailsDrawer.address}</span>
                      </div>
                      <div>
                        <span style={{ color: '#64748b', fontSize: '11.5px', display: 'block' }}>Account Manager</span>
                        <strong>{customerDetailsDrawer.assignedStaff}</strong>
                      </div>
                    </div>
                  </div>

                  <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                    <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#1e40af', textTransform: 'uppercase', marginBottom: '12px' }}>
                      Financial Overview
                    </h4>
                    <div style={{ display: 'flex', gap: '20px' }}>
                      <div>
                        <span style={{ color: '#64748b', fontSize: '12px' }}>Total Invoiced</span>
                        <div style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a' }}>
                          {curSymbol}{customerDetailsDrawer.totalSpent.toLocaleString()}
                        </div>
                      </div>
                      <div>
                        <span style={{ color: '#64748b', fontSize: '12px' }}>Transactions</span>
                        <div style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a' }}>
                          {customerDetailsDrawer.totalTransactions}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
                      Tags
                    </span>
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                      {customerDetailsDrawer.tags.map((t, idx) => (
                        <span key={idx} className="status-pill progress">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {profileTab === 'Activity' && (
                <div>
                  <p style={{ fontSize: '13.5px', color: '#64748b' }}>
                    Latest interaction recorded: <strong>{customerDetailsDrawer.lastActivity}</strong>.
                  </p>
                </div>
              )}

              {profileTab === 'Transactions' && (
                <div>
                  <p style={{ fontSize: '13.5px', color: '#64748b' }}>
                    Total lifetime transactions: <strong>{customerDetailsDrawer.totalTransactions}</strong> records totaling <strong>{curSymbol}{customerDetailsDrawer.totalSpent.toLocaleString()}</strong>.
                  </p>
                </div>
              )}

              {profileTab === 'Notes' && (
                <div>
                  <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '13.5px', lineHeight: 1.6 }}>
                    {customerDetailsDrawer.notes || 'No custom notes recorded for this customer.'}
                  </div>
                </div>
              )}
            </div>

            <div className="dash-drawer-footer">
              <button
                type="button"
                className="btn-danger"
                style={{ fontSize: '13px', padding: '8px 14px' }}
                onClick={() => setConfirmDeleteId(customerDetailsDrawer.id)}
              >
                Delete Customer
              </button>
              <button
                type="button"
                className="btn-primary"
                onClick={() => setCustomerDetailsDrawer(null)}
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
              <h3 className="confirm-title">Delete Customer?</h3>
              <p className="confirm-desc">
                Are you sure you want to delete customer <strong>#{confirmDeleteId}</strong>? All transaction links will be unassigned.
              </p>
              <div className="confirm-actions">
                <button type="button" className="btn-secondary" onClick={() => setConfirmDeleteId(null)}>
                  Cancel
                </button>
                <button type="button" className="btn-danger" onClick={() => handleDeleteCustomer(confirmDeleteId)}>
                  Confirm Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CustomersPage() {
  return (
    <Suspense fallback={<div className="dash-panel-card" style={{ padding: '24px', textAlign: 'center' }}>Loading customers...</div>}>
      <CustomersContent />
    </Suspense>
  );
}
