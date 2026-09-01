'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  WalletIcon,
  PlusIcon,
  SearchIcon,
  TrendingUpIcon,
  FileTextIcon,
  DownloadIcon,
  XIcon,
} from '@/components/icons/DashboardIcons';
import { Transaction, Invoice, InvoiceItem, TransactionType } from '@/types/dashboard';
import {
  getWorkspaceStore,
  getDefaultWorkspaceStore,
  saveWorkspaceStore,
  getCurrencySymbol,
} from '@/lib/dashboardStore';

function FinanceContent() {
  const searchParams = useSearchParams();
  const initialAction = searchParams.get('action');
  const initialTab = searchParams.get('tab') || 'overview';

  const [workspace, setWorkspace] = useState(getDefaultWorkspaceStore());
  const [mainTab, setMainTab] = useState<'overview' | 'invoices' | 'transactions'>(
    initialTab === 'invoices' ? 'invoices' : initialTab === 'transactions' ? 'transactions' : 'overview'
  );

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);

  // Modals
  const [createInvoiceModalOpen, setCreateInvoiceModalOpen] = useState<boolean>(initialAction === 'new-invoice');
  const [recordTxnModalOpen, setRecordTxnModalOpen] = useState<boolean>(initialAction === 'new-transaction');

  // Transaction Filters
  const [txnTypeFilter, setTxnTypeFilter] = useState<string>('All');
  const [txnSearchQuery, setTxnSearchQuery] = useState<string>('');

  // Create Invoice State
  const [invCustomer, setInvCustomer] = useState('');
  const [invDueDate, setInvDueDate] = useState('');
  const [invDiscount, setInvDiscount] = useState(0);
  const [invTaxPercent, setInvTaxPercent] = useState(7.5);
  const [invItems, setInvItems] = useState<InvoiceItem[]>([
    { id: 'item-1', description: 'Product / Service Deliverable', quantity: 1, unitPrice: 150000, total: 150000 },
  ]);

  // Record Transaction State
  const [txnTitle, setTxnTitle] = useState('');
  const [txnType, setTxnType] = useState<TransactionType>('Income');
  const [txnAmount, setTxnAmount] = useState<number>(0);
  const [txnCategory, setTxnCategory] = useState('Sales Revenue');

  useEffect(() => {
    const store = getWorkspaceStore();
    setWorkspace(store);
    setTransactions(store.transactions);
    setInvoices(store.invoices);
    if (store.customers.length > 0 && !invCustomer) {
      setInvCustomer(`${store.customers[0].firstName} ${store.customers[0].lastName}`);
    }
    const handleUpdate = () => {
      const updatedStore = getWorkspaceStore();
      setWorkspace(updatedStore);
      setTransactions(updatedStore.transactions);
      setInvoices(updatedStore.invoices);
    };
    window.addEventListener('vifems_workspace_updated', handleUpdate);
    return () => window.removeEventListener('vifems_workspace_updated', handleUpdate);
  }, []);

  const curSymbol = getCurrencySymbol(workspace.organization.currency);

  // Invoice Calculations
  const invoiceSubtotal = invItems.reduce((acc, it) => acc + it.total, 0);
  const invoiceTax = (invoiceSubtotal * invTaxPercent) / 100;
  const invoiceTotal = Math.max(0, invoiceSubtotal + invoiceTax - invDiscount);

  // Dynamic Live Financial Metrics
  const totalIncome = transactions
    .filter((t) => t.type === 'Income')
    .reduce((acc, t) => acc + t.amount, 0) +
    invoices.filter((i) => i.status === 'Paid').reduce((acc, i) => acc + i.totalAmount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === 'Expense')
    .reduce((acc, t) => acc + t.amount, 0);

  const netIncome = totalIncome - totalExpense;
  const netMargin = totalIncome > 0 ? ((netIncome / totalIncome) * 100).toFixed(1) : '0.0';

  const pendingReceivables = invoices
    .filter((i) => i.status === 'Pending' || i.status === 'Overdue')
    .reduce((acc, i) => acc + i.totalAmount, 0);

  const handleAddInvoiceItem = () => {
    setInvItems([
      ...invItems,
      { id: `item-${Date.now()}`, description: '', quantity: 1, unitPrice: 0, total: 0 },
    ]);
  };

  const handleUpdateInvoiceItem = (index: number, field: 'description' | 'quantity' | 'unitPrice', val: any) => {
    const updated = [...invItems];
    if (field === 'description') updated[index].description = val;
    if (field === 'quantity') {
      const q = Math.max(1, parseInt(val) || 1);
      updated[index].quantity = q;
      updated[index].total = q * updated[index].unitPrice;
    }
    if (field === 'unitPrice') {
      const p = Math.max(0, parseFloat(val) || 0);
      updated[index].unitPrice = p;
      updated[index].total = updated[index].quantity * p;
    }
    setInvItems(updated);
  };

  const handleCreateInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    const matchedCust = workspace.customers.find((c) => `${c.firstName} ${c.lastName}` === invCustomer);

    const newInv: Invoice = {
      id: `INV-2026-00${invoices.length + 1}`,
      invoiceNumber: `INV-2026-00${invoices.length + 1}`,
      customerName: invCustomer || 'Client Account',
      customerEmail: matchedCust?.email || 'client@organization.com',
      items: invItems,
      subtotal: invoiceSubtotal,
      tax: invoiceTax,
      discount: invDiscount,
      totalAmount: invoiceTotal,
      currency: workspace.organization.currency,
      status: 'Pending',
      issueDate: new Date().toISOString().split('T')[0],
      dueDate: invDueDate || new Date(Date.now() + 86400000 * 14).toISOString().split('T')[0],
    };

    const updatedInvoices = [newInv, ...invoices];
    setInvoices(updatedInvoices);
    const curStore = getWorkspaceStore();
    saveWorkspaceStore({
      ...curStore,
      invoices: updatedInvoices,
      activities: [
        {
          id: `act-${Date.now()}`,
          userName: curStore.user.name,
          userRole: curStore.user.role,
          action: `Generated Invoice #${newInv.invoiceNumber} for ${newInv.customerName} (${curSymbol}${newInv.totalAmount.toLocaleString()})`,
          recordAffected: `Invoice ${newInv.id}`,
          module: 'Finance',
          timestamp: 'Just now',
          ipAddress: '127.0.0.1',
        },
        ...curStore.activities,
      ],
    });
    setCreateInvoiceModalOpen(false);
  };

  const handleRecordTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!txnTitle.trim() || txnAmount <= 0) return;

    const newTx: Transaction = {
      id: `TXN-${Date.now().toString().slice(-3)}`,
      title: txnTitle.trim(),
      type: txnType,
      category: txnCategory,
      amount: txnAmount,
      currency: workspace.organization.currency,
      status: 'Completed',
      date: new Date().toISOString().split('T')[0],
      reference: `REF-${Math.floor(1000 + Math.random() * 9000)}`,
    };

    const updatedTxns = [newTx, ...transactions];
    setTransactions(updatedTxns);
    const curStore = getWorkspaceStore();
    saveWorkspaceStore({
      ...curStore,
      transactions: updatedTxns,
      activities: [
        {
          id: `act-${Date.now()}`,
          userName: curStore.user.name,
          userRole: curStore.user.role,
          action: `Recorded ${newTx.type} transaction: "${newTx.title}" (${curSymbol}${newTx.amount.toLocaleString()})`,
          recordAffected: `Transaction ${newTx.id}`,
          module: 'Finance',
          timestamp: 'Just now',
          ipAddress: '127.0.0.1',
        },
        ...curStore.activities,
      ],
    });
    setRecordTxnModalOpen(false);
    setTxnTitle('');
    setTxnAmount(0);
  };

  return (
    <div>
      {/* ---------- PAGE TOP HEADER ---------- */}
      <div className="page-top-header">
        <div className="page-title-group">
          <h1>
            <WalletIcon size={24} style={{ color: '#2563eb' }} />
            Finance &amp; Invoices
          </h1>
          <p>Manage receipts, track expenditures, generate client invoices, and monitor cash flow.</p>
        </div>

        <div className="page-controls-group">
          <button type="button" className="btn-secondary" onClick={() => setRecordTxnModalOpen(true)}>
            <PlusIcon size={16} />
            <span>Record Transaction</span>
          </button>
          <button type="button" className="btn-primary" onClick={() => setCreateInvoiceModalOpen(true)}>
            <FileTextIcon size={16} />
            <span>Create Invoice</span>
          </button>
        </div>
      </div>

      {/* ---------- NAVIGATION TABS ---------- */}
      <div className="dash-tabs-bar">
        <button
          type="button"
          className={`dash-tab-btn ${mainTab === 'overview' ? 'active' : ''}`}
          onClick={() => setMainTab('overview')}
        >
          Finance Dashboard
        </button>
        <button
          type="button"
          className={`dash-tab-btn ${mainTab === 'invoices' ? 'active' : ''}`}
          onClick={() => setMainTab('invoices')}
        >
          Invoices ({invoices.length})
        </button>
        <button
          type="button"
          className={`dash-tab-btn ${mainTab === 'transactions' ? 'active' : ''}`}
          onClick={() => setMainTab('transactions')}
        >
          Transactions Ledger ({transactions.length})
        </button>
      </div>

      {/* ============================================================
          PAGE 24: FINANCE DASHBOARD OVERVIEW
         ============================================================ */}
      {mainTab === 'overview' && (
        <div>
          {/* KPI Metrics Cards */}
          <div className="kpi-grid">
            <div className="kpi-card">
              <span className="kpi-label-text">Total Recorded Revenue</span>
              <h3 className="kpi-value-text" style={{ color: '#059669' }}>
                {curSymbol}{totalIncome.toLocaleString()}
              </h3>
              <span className="kpi-trend-badge up" style={{ width: 'fit-content' }}>
                <TrendingUpIcon size={12} />
                Live receipts
              </span>
            </div>

            <div className="kpi-card">
              <span className="kpi-label-text">Operating Expenses</span>
              <h3 className="kpi-value-text" style={{ color: '#dc2626' }}>
                {curSymbol}{totalExpense.toLocaleString()}
              </h3>
              <span className="kpi-trend-badge down" style={{ width: 'fit-content' }}>
                Outflows
              </span>
            </div>

            <div className="kpi-card">
              <span className="kpi-label-text">Net Operating Income</span>
              <h3 className="kpi-value-text" style={{ color: '#2563eb' }}>
                {curSymbol}{netIncome.toLocaleString()}
              </h3>
              <span className="kpi-trend-badge up" style={{ width: 'fit-content' }}>
                {netMargin}% Margin
              </span>
            </div>

            <div className="kpi-card">
              <span className="kpi-label-text">Outstanding Receivables</span>
              <h3 className="kpi-value-text" style={{ color: '#d97706' }}>
                {curSymbol}{pendingReceivables.toLocaleString()}
              </h3>
              <span className="kpi-trend-badge down" style={{ background: '#fffbeb', color: '#b45309', borderColor: '#fde68a', width: 'fit-content' }}>
                {invoices.filter((i) => i.status === 'Pending' || i.status === 'Overdue').length} pending invoices
              </span>
            </div>
          </div>

          {/* Recent Invoices & Recent Transactions Split */}
          <div className="dash-two-col-grid">
            <div className="dash-panel-card">
              <div className="panel-card-header">
                <h3 className="panel-card-title">
                  <FileTextIcon size={18} style={{ color: '#2563eb' }} />
                  Recent Invoices
                </h3>
                <button type="button" className="btn-secondary" style={{ fontSize: '12.5px', padding: '4px 10px' }} onClick={() => setMainTab('invoices')}>
                  View all
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {invoices.length === 0 ? (
                  <div style={{ padding: '20px', textAlign: 'center', color: '#64748b', fontSize: '13px' }}>
                    No invoices generated yet.
                  </div>
                ) : (
                  invoices.slice(0, 4).map((inv) => (
                    <div
                      key={inv.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '12px 14px',
                        background: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        borderRadius: '12px',
                      }}
                    >
                      <div>
                        <strong style={{ fontSize: '13.5px', color: '#0f172a' }}>{inv.invoiceNumber}</strong>
                        <div style={{ fontSize: '12px', color: '#64748b' }}>{inv.customerName}</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a' }}>
                          {curSymbol}{inv.totalAmount.toLocaleString()}
                        </div>
                        <span className={`status-pill ${inv.status.toLowerCase()}`}>{inv.status}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="dash-panel-card">
              <div className="panel-card-header">
                <h3 className="panel-card-title">
                  <WalletIcon size={18} style={{ color: '#2563eb' }} />
                  Recent Transactions
                </h3>
                <button type="button" className="btn-secondary" style={{ fontSize: '12.5px', padding: '4px 10px' }} onClick={() => setMainTab('transactions')}>
                  View ledger
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {transactions.length === 0 ? (
                  <div style={{ padding: '20px', textAlign: 'center', color: '#64748b', fontSize: '13px' }}>
                    No transactions recorded yet.
                  </div>
                ) : (
                  transactions.slice(0, 4).map((tx) => (
                    <div
                      key={tx.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '12px 14px',
                        background: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        borderRadius: '12px',
                      }}
                    >
                      <div>
                        <strong style={{ fontSize: '13px', color: '#0f172a' }}>{tx.title}</strong>
                        <div style={{ fontSize: '11.5px', color: '#64748b' }}>{tx.category} &bull; {tx.date}</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '13.5px', fontWeight: 700, color: tx.type === 'Income' ? '#059669' : '#dc2626' }}>
                          {tx.type === 'Income' ? '+' : '-'}{curSymbol}{tx.amount.toLocaleString()}
                        </div>
                        <span className="status-pill todo" style={{ fontSize: '11px' }}>{tx.type}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================
          PAGE 26: INVOICES TABLE
         ============================================================ */}
      {mainTab === 'invoices' && (
        <div>
          <div className="dash-table-wrapper">
            {invoices.length > 0 ? (
              <table className="dash-table">
                <thead>
                  <tr>
                    <th>Invoice Number</th>
                    <th>Customer Account</th>
                    <th>Total Amount</th>
                    <th>Issue Date</th>
                    <th>Due Date</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'right' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((inv) => (
                    <tr key={inv.id}>
                      <td>
                        <span className="table-primary-text">{inv.invoiceNumber}</span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span className="table-primary-text">{inv.customerName}</span>
                          <span className="table-sub-text">{inv.customerEmail}</span>
                        </div>
                      </td>
                      <td>
                        <span className="table-primary-text">{curSymbol}{inv.totalAmount.toLocaleString()}</span>
                      </td>
                      <td>
                        <span className="table-sub-text">{inv.issueDate}</span>
                      </td>
                      <td>
                        <span className="table-sub-text" style={{ color: inv.status === 'Overdue' ? '#dc2626' : '#0f172a', fontWeight: 600 }}>
                          {inv.dueDate}
                        </span>
                      </td>
                      <td>
                        <span className={`status-pill ${inv.status.toLowerCase()}`}>{inv.status}</span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <button type="button" className="btn-secondary" style={{ fontSize: '12px', padding: '6px 12px' }}>
                          <DownloadIcon size={14} />
                          <span>PDF</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="dash-empty-state">
                <div className="empty-icon-circle">
                  <FileTextIcon size={26} />
                </div>
                <h3>No invoices created yet</h3>
                <p>Generate your first branded invoice and start billing clients.</p>
                <button type="button" className="btn-primary" onClick={() => setCreateInvoiceModalOpen(true)}>
                  <PlusIcon size={16} />
                  <span>Create Invoice</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ============================================================
          PAGE 25: TRANSACTIONS LEDGER TABLE
         ============================================================ */}
      {mainTab === 'transactions' && (
        <div>
          <div className="table-filter-bar">
            <div className="search-input-wrap">
              <SearchIcon size={16} />
              <input
                type="text"
                className="dash-search-input"
                placeholder="Search transactions by title or reference..."
                value={txnSearchQuery}
                onChange={(e) => setTxnSearchQuery(e.target.value)}
              />
            </div>

            <div className="filter-controls-wrap">
              <select
                className="dash-select-filter"
                value={txnTypeFilter}
                onChange={(e) => setTxnTypeFilter(e.target.value)}
              >
                <option value="All">All Types</option>
                <option value="Income">Income</option>
                <option value="Expense">Expense</option>
                <option value="Refund">Refund</option>
                <option value="Transfer">Transfer</option>
              </select>
            </div>
          </div>

          <div className="dash-table-wrapper">
            {transactions.length > 0 ? (
              <table className="dash-table">
                <thead>
                  <tr>
                    <th>Transaction Reference</th>
                    <th>Title / Category</th>
                    <th>Type</th>
                    <th>Amount</th>
                    <th>Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions
                    .filter((tx) => txnTypeFilter === 'All' || tx.type === txnTypeFilter)
                    .filter((tx) => !txnSearchQuery || tx.title.toLowerCase().includes(txnSearchQuery.toLowerCase()))
                    .map((tx) => (
                      <tr key={tx.id}>
                        <td>
                          <span className="table-primary-text">{tx.reference}</span>
                        </td>
                        <td>
                          <div>
                            <span className="table-primary-text">{tx.title}</span>
                            <span className="table-sub-text" style={{ display: 'block' }}>{tx.category}</span>
                          </div>
                        </td>
                        <td>
                          <span className="status-pill todo">{tx.type}</span>
                        </td>
                        <td>
                          <strong style={{ color: tx.type === 'Income' ? '#059669' : '#dc2626' }}>
                            {tx.type === 'Income' ? '+' : '-'}{curSymbol}{tx.amount.toLocaleString()}
                          </strong>
                        </td>
                        <td>
                          <span className="table-sub-text">{tx.date}</span>
                        </td>
                        <td>
                          <span className="status-pill completed">{tx.status}</span>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            ) : (
              <div className="dash-empty-state">
                <div className="empty-icon-circle">
                  <WalletIcon size={26} />
                </div>
                <h3>No transactions in ledger</h3>
                <p>Record your first income or expense transaction.</p>
                <button type="button" className="btn-primary" onClick={() => setRecordTxnModalOpen(true)}>
                  <PlusIcon size={16} />
                  <span>Record Transaction</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ============================================================
          PAGE 27: CREATE INVOICE MODAL
         ============================================================ */}
      {createInvoiceModalOpen && (
        <div className="dash-modal-backdrop" onClick={() => setCreateInvoiceModalOpen(false)}>
          <div className="dash-modal" style={{ maxWidth: '680px' }} onClick={(e) => e.stopPropagation()}>
            <div className="dash-modal-header">
              <h3>
                <FileTextIcon size={20} style={{ color: '#2563eb' }} />
                Create New Invoice (Page 27)
              </h3>
              <button
                type="button"
                className="dash-modal-close-btn"
                onClick={() => setCreateInvoiceModalOpen(false)}
              >
                <XIcon size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateInvoice}>
              <div className="dash-modal-body">
                <div className="form-grid-2">
                  <div className="dash-form-group">
                    <label htmlFor="inv-customer">
                      Customer Account <span className="req">*</span>
                    </label>
                    <select
                      id="inv-customer"
                      className="dash-select"
                      value={invCustomer}
                      onChange={(e) => setInvCustomer(e.target.value)}
                    >
                      {workspace.customers.length === 0 ? (
                        <option value="Direct Client">Direct Client (Walk-in)</option>
                      ) : (
                        workspace.customers.map((c) => (
                          <option key={c.id} value={`${c.firstName} ${c.lastName}`}>
                            {c.firstName} {c.lastName} ({c.email})
                          </option>
                        ))
                      )}
                    </select>
                  </div>

                  <div className="dash-form-group">
                    <label htmlFor="inv-due-date">Payment Due Date</label>
                    <input
                      id="inv-due-date"
                      type="date"
                      className="dash-input"
                      value={invDueDate}
                      onChange={(e) => setInvDueDate(e.target.value)}
                    />
                  </div>
                </div>

                {/* Line Items Table */}
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ fontSize: '13px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '8px' }}>
                    Invoice Line Items
                  </label>

                  {invItems.map((item, idx) => (
                    <div key={item.id} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1.2fr 1fr', gap: '8px', marginBottom: '8px' }}>
                      <input
                        type="text"
                        className="dash-input"
                        placeholder="Item description"
                        value={item.description}
                        onChange={(e) => handleUpdateInvoiceItem(idx, 'description', e.target.value)}
                        required
                      />
                      <input
                        type="number"
                        className="dash-input"
                        placeholder="Qty"
                        value={item.quantity}
                        onChange={(e) => handleUpdateInvoiceItem(idx, 'quantity', e.target.value)}
                        min="1"
                      />
                      <input
                        type="number"
                        className="dash-input"
                        placeholder={`Price (${curSymbol})`}
                        value={item.unitPrice}
                        onChange={(e) => handleUpdateInvoiceItem(idx, 'unitPrice', e.target.value)}
                      />
                      <div style={{ display: 'flex', alignItems: 'center', fontWeight: 700, fontSize: '13px', color: '#0f172a' }}>
                        {curSymbol}{item.total.toLocaleString()}
                      </div>
                    </div>
                  ))}

                  <button type="button" className="btn-secondary" style={{ fontSize: '12.5px', marginTop: '6px' }} onClick={handleAddInvoiceItem}>
                    + Add Item Line
                  </button>
                </div>

                {/* Totals Calculation Summary */}
                <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '13px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Subtotal:</span>
                    <strong>{curSymbol}{invoiceSubtotal.toLocaleString()}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>VAT Tax (7.5%):</span>
                    <span>{curSymbol}{invoiceTax.toLocaleString()}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #e2e8f0', paddingTop: '6px', fontSize: '15px' }}>
                    <strong>Total Invoiced Amount:</strong>
                    <strong style={{ color: '#2563eb' }}>{curSymbol}{invoiceTotal.toLocaleString()}</strong>
                  </div>
                </div>
              </div>

              <div className="dash-modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setCreateInvoiceModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Send Invoice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Record Transaction Modal */}
      {recordTxnModalOpen && (
        <div className="dash-modal-backdrop" onClick={() => setRecordTxnModalOpen(false)}>
          <div className="dash-modal" onClick={(e) => e.stopPropagation()}>
            <div className="dash-modal-header">
              <h3>
                <WalletIcon size={20} style={{ color: '#2563eb' }} />
                Record Transaction
              </h3>
              <button
                type="button"
                className="dash-modal-close-btn"
                onClick={() => setRecordTxnModalOpen(false)}
              >
                <XIcon size={18} />
              </button>
            </div>

            <form onSubmit={handleRecordTransaction}>
              <div className="dash-modal-body">
                <div className="dash-form-group">
                  <label htmlFor="txn-title">
                    Transaction Description <span className="req">*</span>
                  </label>
                  <input
                    id="txn-title"
                    type="text"
                    className="dash-input"
                    placeholder="e.g. Bulk Stock Purchase from Supplier"
                    value={txnTitle}
                    onChange={(e) => setTxnTitle(e.target.value)}
                    required
                  />
                </div>

                <div className="form-grid-2">
                  <div className="dash-form-group">
                    <label htmlFor="txn-type">Transaction Type</label>
                    <select
                      id="txn-type"
                      className="dash-select"
                      value={txnType}
                      onChange={(e) => setTxnType(e.target.value as TransactionType)}
                    >
                      <option value="Income">Income (+)</option>
                      <option value="Expense">Expense (-)</option>
                      <option value="Refund">Refund (-)</option>
                      <option value="Transfer">Transfer</option>
                    </select>
                  </div>

                  <div className="dash-form-group">
                    <label htmlFor="txn-amount">
                      Amount (₦) <span className="req">*</span>
                    </label>
                    <input
                      id="txn-amount"
                      type="number"
                      className="dash-input"
                      placeholder="e.g. 500000"
                      value={txnAmount || ''}
                      onChange={(e) => setTxnAmount(parseFloat(e.target.value) || 0)}
                      required
                    />
                  </div>

                  <div className="dash-form-group form-grid-full">
                    <label htmlFor="txn-category">Category</label>
                    <select
                      id="txn-category"
                      className="dash-select"
                      value={txnCategory}
                      onChange={(e) => setTxnCategory(e.target.value)}
                    >
                      <option value="Sales Revenue">Sales Revenue</option>
                      <option value="Operations & Rent">Operations &amp; Rent</option>
                      <option value="Supplier Settlement">Supplier Settlement</option>
                      <option value="Payroll & Wages">Payroll &amp; Wages</option>
                      <option value="Software & Utilities">Software &amp; Utilities</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="dash-modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setRecordTxnModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Save Transaction
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function FinancePage() {
  return (
    <Suspense fallback={<div className="dash-panel-card" style={{ padding: '24px', textAlign: 'center' }}>Loading finance data...</div>}>
      <FinanceContent />
    </Suspense>
  );
}
