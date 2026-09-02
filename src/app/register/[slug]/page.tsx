'use client';

import React, { useState, useEffect, use } from 'react';
import { registrationService } from '@/services/registration.service';
import { FormField } from '@/types/workspace';
import './register.css';

interface PublicLinkData {
  id: string;
  name: string;
  program?: string;
  description?: string;
  deadline?: string;
  maxParticipants?: number;
  spotsLeft?: number;
  requireApproval: boolean;
  formFields: FormField[];
  workspace: {
    name: string;
    slug: string;
    businessType: string;
  };
}

export default function PublicRegistrationPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [linkData, setLinkData] = useState<PublicLinkData | null>(null);

  const [formData, setFormData] = useState<Record<string, any>>({
    fullName: '',
    email: '',
    phone: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>('');

  useEffect(() => {
    if (!slug) return;
    setIsLoading(true);
    registrationService
      .getPublicLink(slug)
      .then((res) => {
        setLinkData(res.data);
      })
      .catch((err) => {
        setError(err.message || 'Unable to load registration form');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [slug]);

  const handleInputChange = (key: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName?.trim() || !formData.email?.trim()) {
      alert('Please fill in required fields (Full Name, Email)');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const res = await registrationService.submitRegistration(slug, formData);
      setSubmitSuccess(true);
      setSuccessMessage(res.message);
    } catch (err: any) {
      setError(err.message || 'Failed to submit registration. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="pub-reg-root">
        <div className="pub-reg-card" style={{ padding: '60px 20px', textAlign: 'center' }}>
          <div style={{ fontSize: '15px', color: '#64748b', fontWeight: 500 }}>Loading registration form...</div>
        </div>
      </div>
    );
  }

  if (error && !linkData && !submitSuccess) {
    return (
      <div className="pub-reg-root">
        <div className="pub-reg-card">
          <div className="pub-status-box">
            <div className="pub-status-icon error">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            <h2 className="pub-status-title">Registration Unavailable</h2>
            <p className="pub-status-desc">{error}</p>
          </div>
        </div>
        <div className="pub-reg-footer">
          Powered by <strong>VIFEmS</strong>
        </div>
      </div>
    );
  }

  if (submitSuccess) {
    return (
      <div className="pub-reg-root">
        <div className="pub-reg-card">
          <div className="pub-status-box">
            <div className="pub-status-icon success">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h2 className="pub-status-title">Registration Submitted!</h2>
            <p className="pub-status-desc">{successMessage}</p>
            <div style={{ fontSize: '13px', color: '#64748b', background: '#f8fafc', padding: '12px 18px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              We have recorded your submission for <strong>{linkData?.name}</strong>.
            </div>
          </div>
        </div>
        <div className="pub-reg-footer">
          Powered by <strong>VIFEmS</strong>
        </div>
      </div>
    );
  }

  return (
    <div className="pub-reg-root">
      <div className="pub-reg-card">
        {/* Header */}
        <div className="pub-reg-header">
          <div className="pub-reg-org-badge">
            <span>{linkData?.workspace?.name || 'VIFEmS Workspace'}</span>
          </div>
          <h1 className="pub-reg-title">{linkData?.name}</h1>
          {linkData?.program && (
            <p className="pub-reg-subtitle">Program: {linkData.program}</p>
          )}
          {linkData?.description && (
            <p className="pub-reg-subtitle" style={{ marginTop: '6px' }}>{linkData.description}</p>
          )}

          <div className="pub-reg-meta-bar">
            {linkData?.deadline && (
              <div className="pub-reg-meta-item">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                <span>Deadline: {new Date(linkData.deadline).toLocaleDateString()}</span>
              </div>
            )}
            {linkData?.spotsLeft !== undefined && linkData?.spotsLeft !== null && (
              <div className="pub-reg-meta-item">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                </svg>
                <span>Spots Left: {linkData.spotsLeft}</span>
              </div>
            )}
          </div>
        </div>

        {/* Form Body */}
        <div className="pub-reg-body">
          {error && (
            <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '10px 14px', borderRadius: '8px', fontSize: '13px', marginBottom: '18px', fontWeight: 500 }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Dynamic Form Fields defined by Link Creator */}
            {linkData?.formFields && linkData.formFields.length > 0 ? (
              linkData.formFields.map((field) => (
                <div key={field.key} className="pub-form-group">
                  <label className="pub-form-label">
                    {field.label} {field.required && <span className="req">*</span>}
                  </label>

                  {field.type === 'select' && field.options && field.options.length > 0 ? (
                    <select
                      className="pub-form-select"
                      required={field.required}
                      value={formData[field.key] || ''}
                      onChange={(e) => handleInputChange(field.key, e.target.value)}
                    >
                      <option value="">Select {field.label}...</option>
                      {field.options.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  ) : field.type === 'radio' && field.options && field.options.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '4px' }}>
                      {field.options.map((opt) => (
                        <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13.5px' }}>
                          <input
                            type="radio"
                            name={field.key}
                            value={opt}
                            required={field.required && !formData[field.key]}
                            checked={formData[field.key] === opt}
                            onChange={(e) => handleInputChange(field.key, e.target.value)}
                          />
                          <span>{opt}</span>
                        </label>
                      ))}
                    </div>
                  ) : field.type === 'checkbox' ? (
                    field.options && field.options.length > 0 ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '4px' }}>
                        {field.options.map((opt) => {
                          const currentValues = Array.isArray(formData[field.key]) ? formData[field.key] : [];
                          return (
                            <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13.5px' }}>
                              <input
                                type="checkbox"
                                checked={currentValues.includes(opt)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    handleInputChange(field.key, [...currentValues, opt]);
                                  } else {
                                    handleInputChange(field.key, currentValues.filter((v: string) => v !== opt));
                                  }
                                }}
                              />
                              <span>{opt}</span>
                            </label>
                          );
                        })}
                      </div>
                    ) : (
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13.5px' }}>
                        <input
                          type="checkbox"
                          required={field.required}
                          checked={!!formData[field.key]}
                          onChange={(e) => handleInputChange(field.key, e.target.checked)}
                        />
                        <span>{field.placeholder || `I agree / confirm ${field.label}`}</span>
                      </label>
                    )
                  ) : field.type === 'textarea' ? (
                    <textarea
                      className="pub-form-textarea"
                      required={field.required}
                      rows={3}
                      placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
                      value={formData[field.key] || ''}
                      onChange={(e) => handleInputChange(field.key, e.target.value)}
                    />
                  ) : field.type === 'file' || field.type === 'image' ? (
                    <input
                      type="file"
                      accept={field.type === 'image' ? 'image/*' : undefined}
                      className="pub-form-input"
                      required={field.required}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        if (field.type === 'image' && file.type.startsWith('image/')) {
                          const reader = new FileReader();
                          reader.onload = () => {
                            handleInputChange(field.key, reader.result as string);
                          };
                          reader.readAsDataURL(file);
                        } else {
                          handleInputChange(field.key, file.name);
                        }
                      }}
                    />
                  ) : (
                    <input
                      type={
                        field.type === 'email' ? 'email' :
                        field.type === 'tel' ? 'tel' :
                        field.type === 'number' ? 'number' :
                        field.type === 'date' ? 'date' : 'text'
                      }
                      className="pub-form-input"
                      required={field.required}
                      placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
                      value={formData[field.key] || ''}
                      onChange={(e) => handleInputChange(field.key, e.target.value)}
                    />
                  )}
                </div>
              ))
            ) : (
              <>
                <div className="pub-form-group">
                  <label className="pub-form-label">
                    Full Name <span className="req">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    className="pub-form-input"
                    placeholder="e.g. Samuel Adewale"
                    value={formData.fullName || ''}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                  />
                </div>

                <div className="pub-form-group">
                  <label className="pub-form-label">
                    Email Address <span className="req">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    className="pub-form-input"
                    placeholder="e.g. samuel@example.com"
                    value={formData.email || ''}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                  />
                </div>

                <div className="pub-form-group">
                  <label className="pub-form-label">
                    Phone Number (WhatsApp) <span className="req">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    className="pub-form-input"
                    placeholder="e.g. +2348012345678"
                    value={formData.phone || ''}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                  />
                </div>
              </>
            )}

            <button
              type="submit"
              className="pub-submit-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                'Submitting...'
              ) : (
                <>
                  <span>Submit Registration</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      <div className="pub-reg-footer">
        Powered by <strong>VIFEmS</strong> · Configurable Business Management
      </div>
    </div>
  );
}
