'use client';

import React, { useState } from 'react';
import {
  HelpCircleIcon,
  SearchIcon,
  FileTextIcon,
  CheckSquareIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  MailIcon,
  CheckCircleIcon,
} from '@/components/icons/DashboardIcons';

export default function SupportPage() {
  const [activeTab, setActiveTab] = useState<'help' | 'ticket'>('help');
  const [searchQuery, setSearchQuery] = useState('');
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Ticket Form State (Page 41)
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketCategory, setTicketCategory] = useState('Technical Issue');
  const [ticketPriority, setTicketPriority] = useState('Medium');
  const [ticketDesc, setTicketDesc] = useState('');
  const [submittedMessage, setSubmittedMessage] = useState<string | null>(null);

  const faqs = [
    {
      q: 'How do I invite team members and configure their module permissions?',
      a: 'Navigate to Settings -> Users & Roles (or Staff page), click "Add Staff Member", enter their work email, select their permission level (Administrator, Manager, or Staff), and send the invitation.',
    },
    {
      q: 'How do automated invoice reminders and due dates work?',
      a: 'When you create an invoice in Finance -> Invoices, set the due date. VIFEMS automatically monitors payment status and dispatches email and dashboard alerts when invoices approach or exceed their due date.',
    },
    {
      q: 'Can I export financial ledgers and performance reports to Excel or PDF?',
      a: 'Yes! Navigate to the Reports section, open any report details, and click either "PDF", "CSV", or "Excel" in the bottom export toolbar.',
    },
    {
      q: 'How do I customize my organization currency and timezone?',
      a: 'Go to Settings -> Organization to select your default operating currency (e.g. NGN ₦ or USD $) and regional time zone (e.g. Africa/Lagos GMT+1).',
    },
  ];

  const handleSubmitTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSubject.trim() || !ticketDesc.trim()) return;

    setSubmittedMessage(
      `Support ticket #${Math.floor(10000 + Math.random() * 90000)} submitted successfully! Our engineering team will reply within 2 hours.`
    );
    setTicketSubject('');
    setTicketDesc('');
  };

  const filteredFaqs = faqs.filter(
    (f) =>
      !searchQuery.trim() ||
      f.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.a.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      {/* ---------- PAGE TOP HEADER ---------- */}
      <div className="page-top-header">
        <div className="page-title-group">
          <h1>
            <HelpCircleIcon size={24} style={{ color: '#2563eb' }} />
            Help Center &amp; Priority Support
          </h1>
          <p>Explore tutorials, search knowledgebase articles, or open a direct technical ticket.</p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="dash-tabs-bar">
        <button
          type="button"
          className={`dash-tab-btn ${activeTab === 'help' ? 'active' : ''}`}
          onClick={() => setActiveTab('help')}
        >
          Help Center &amp; FAQs (Page 40)
        </button>
        <button
          type="button"
          className={`dash-tab-btn ${activeTab === 'ticket' ? 'active' : ''}`}
          onClick={() => setActiveTab('ticket')}
        >
          Contact Support Ticket (Page 41)
        </button>
      </div>

      {/* ============================================================
          PAGE 40: HELP CENTER & FAQS
         ============================================================ */}
      {activeTab === 'help' && (
        <div style={{ maxWidth: '880px' }}>
          {/* Search bar */}
          <div style={{ marginBottom: '24px' }}>
            <div className="search-input-wrap" style={{ maxWidth: '100%' }}>
              <SearchIcon size={20} />
              <input
                type="text"
                className="dash-search-input"
                placeholder="Search knowledgebase, guides, or troubleshooting questions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ height: '46px', paddingLeft: '44px', borderRadius: '14px' }}
              />
            </div>
          </div>

          {/* Guides Cards Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '28px' }}>
            <div className="dash-panel-card" style={{ padding: '18px' }}>
              <div className="kpi-icon-wrapper" style={{ marginBottom: '12px' }}>
                <FileTextIcon size={20} />
              </div>
              <h4 style={{ fontSize: '15px', fontWeight: 800, margin: '0 0 6px 0' }}>Getting Started Guide</h4>
              <p style={{ fontSize: '12.5px', color: '#64748b', lineHeight: 1.5, margin: 0 }}>
                Learn how to onboard your team, configure modules, and import existing customers.
              </p>
            </div>

            <div className="dash-panel-card" style={{ padding: '18px' }}>
              <div className="kpi-icon-wrapper" style={{ marginBottom: '12px' }}>
                <CheckSquareIcon size={20} />
              </div>
              <h4 style={{ fontSize: '15px', fontWeight: 800, margin: '0 0 6px 0' }}>Task Automation</h4>
              <p style={{ fontSize: '12.5px', color: '#64748b', lineHeight: 1.5, margin: 0 }}>
                Set up recurring tasks, automatic reassignments, and checklist templates.
              </p>
            </div>

            <div className="dash-panel-card" style={{ padding: '18px' }}>
              <div className="kpi-icon-wrapper" style={{ marginBottom: '12px' }}>
                <MailIcon size={20} />
              </div>
              <h4 style={{ fontSize: '15px', fontWeight: 800, margin: '0 0 6px 0' }}>Billing &amp; Invoices</h4>
              <p style={{ fontSize: '12.5px', color: '#64748b', lineHeight: 1.5, margin: 0 }}>
                Detailed walkthrough on setting tax rates, generating PDF invoices, and reconciling payments.
              </p>
            </div>
          </div>

          {/* FAQs Accordion */}
          <div className="dash-panel-card">
            <h3 style={{ fontSize: '17px', fontWeight: 800, margin: '0 0 16px 0' }}>Frequently Asked Questions</h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {filteredFaqs.map((faq, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div
                    key={idx}
                    style={{
                      border: '1px solid #e2e8f0',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      background: isOpen ? '#f8fafc' : '#ffffff',
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
                      style={{
                        width: '100%',
                        padding: '14px 18px',
                        background: 'none',
                        border: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        textAlign: 'left',
                        cursor: 'pointer',
                        fontWeight: 700,
                        fontSize: '14px',
                        color: '#0f172a',
                      }}
                    >
                      <span>{faq.q}</span>
                      <ChevronDownIcon
                        size={16}
                        style={{
                          transform: isOpen ? 'rotate(180deg)' : 'none',
                          transition: 'transform 0.2s ease',
                          color: '#64748b',
                        }}
                      />
                    </button>

                    {isOpen && (
                      <div style={{ padding: '0 18px 16px 18px', fontSize: '13.5px', color: '#334155', lineHeight: 1.6 }}>
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================
          PAGE 41: CONTACT SUPPORT TICKET FORM
         ============================================================ */}
      {activeTab === 'ticket' && (
        <div className="dash-panel-card" style={{ maxWidth: '720px' }}>
          <div className="panel-card-header">
            <h3 className="panel-card-title">
              <MailIcon size={18} style={{ color: '#2563eb' }} />
              Submit Priority Support Request
            </h3>
          </div>

          {submittedMessage ? (
            <div style={{ padding: '24px', textAlign: 'center' }}>
              <div className="empty-icon-circle" style={{ margin: '0 auto 16px', background: '#ecfdf5', borderColor: '#a7f3d0', color: '#059669' }}>
                <CheckCircleIcon size={28} />
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', margin: '0 0 8px 0' }}>Ticket Logged</h3>
              <p style={{ fontSize: '13.5px', color: '#64748b', lineHeight: 1.5, margin: '0 0 20px 0' }}>{submittedMessage}</p>
              <button type="button" className="btn-secondary" onClick={() => setSubmittedMessage(null)}>
                Submit Another Request
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmitTicket}>
              <div className="dash-form-group">
                <label htmlFor="ticket-subject">
                  Ticket Subject <span className="req">*</span>
                </label>
                <input
                  id="ticket-subject"
                  type="text"
                  className="dash-input"
                  placeholder="e.g. Issue generating invoice PDF on mobile"
                  value={ticketSubject}
                  onChange={(e) => setTicketSubject(e.target.value)}
                  required
                />
              </div>

              <div className="form-grid-2">
                <div className="dash-form-group">
                  <label htmlFor="ticket-category">Inquiry Category</label>
                  <select
                    id="ticket-category"
                    className="dash-select"
                    value={ticketCategory}
                    onChange={(e) => setTicketCategory(e.target.value)}
                  >
                    <option value="Technical Issue">Technical Issue</option>
                    <option value="Billing & Invoicing">Billing &amp; Invoicing</option>
                    <option value="Account & Permissions">Account &amp; Permissions</option>
                    <option value="Feature Request">Feature Request</option>
                  </select>
                </div>

                <div className="dash-form-group">
                  <label htmlFor="ticket-priority">Priority</label>
                  <select
                    id="ticket-priority"
                    className="dash-select"
                    value={ticketPriority}
                    onChange={(e) => setTicketPriority(e.target.value)}
                  >
                    <option value="Low">Low (General guidance)</option>
                    <option value="Medium">Medium (Standard)</option>
                    <option value="High">High (Operation impacted)</option>
                    <option value="Urgent">Urgent (System down)</option>
                  </select>
                </div>
              </div>

              <div className="dash-form-group">
                <label htmlFor="ticket-desc">
                  Issue Description &amp; Reproduction Steps <span className="req">*</span>
                </label>
                <textarea
                  id="ticket-desc"
                  className="dash-textarea"
                  placeholder="Describe in detail what happened and what steps caused the issue..."
                  value={ticketDesc}
                  onChange={(e) => setTicketDesc(e.target.value)}
                  required
                  style={{ minHeight: '120px' }}
                />
              </div>

              <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
                <button type="submit" className="btn-primary">
                  Submit Support Ticket
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
