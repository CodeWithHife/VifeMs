'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { onboardingService } from '@/services/onboarding.service';
import {
  BusinessInfo,
  TeamMember,
  ModuleConfig,
} from '@/types/onboarding';
import {
  ZapIcon,
  BuildingIcon,
  TargetIcon,
  UsersIcon,
  SlidersIcon,
  CheckCircleIcon,
  SparklesIcon,
  ShieldIcon,
  ManagerIcon,
  StaffIcon,
  ShoppingBagIcon,
  GraduationCapIcon,
  UtensilsIcon,
  PaletteIcon,
  BriefcaseIcon,
  HeartPulseIcon,
  ConstructionIcon,
  TruckIcon,
  PackageIcon,
  ClipboardListIcon,
  UserCheckIcon,
  CreditCardIcon,
  CalendarIcon,
  RocketIcon,
  BarChartIcon,
  BellIcon,
} from '@/components/icons/OnboardingIcons';
import { saveWorkspaceStore, getCurrencySymbol } from '@/lib/dashboardStore';
import { StaffMember } from '@/types/dashboard';
import './onboarding.css';

// Demo initial defaults
const DEMO_BUSINESS_INFO: BusinessInfo = {
  name: 'Acme Global Ventures',
  logo: '',
  email: 'hello@acmeglobal.com',
  phone: '+234 801 234 5678',
  address: '14 Marina Commercial Boulevard',
  country: 'Nigeria',
  state: 'Lagos',
  website: 'https://acmeglobal.com',
  currency: 'NGN',
  timeZone: 'Africa/Lagos',
};

// Business type dropdown options
export interface BusinessTypeOption {
  value: string;
  label: string;
  badge: string;
  description: string;
  iconType: 'retail' | 'school' | 'restaurant' | 'agency' | 'services' | 'health' | 'construction' | 'logistics' | 'other';
  recommendedModules: string[];
}

const BUSINESS_TYPE_OPTIONS: BusinessTypeOption[] = [
  {
    value: 'Retail',
    label: 'Retail & E-commerce',
    badge: 'Commerce',
    description: 'Physical stores, online shops, supermarkets, and merchandise distribution.',
    iconType: 'retail',
    recommendedModules: ['TASKS', 'CUSTOMERS', 'FINANCE', 'INVENTORY', 'REPORTS', 'NOTIFICATIONS'],
  },
  {
    value: 'School',
    label: 'School & Education',
    badge: 'Education',
    description: 'K-12 schools, training institutes, academies, and tutoring centers.',
    iconType: 'school',
    recommendedModules: ['TASKS', 'CUSTOMERS', 'STAFF', 'FINANCE', 'REPORTS', 'NOTIFICATIONS'],
  },
  {
    value: 'Restaurant',
    label: 'Restaurant & Hospitality',
    badge: 'Hospitality',
    description: 'Restaurants, cafes, food chains, catering services, and bars.',
    iconType: 'restaurant',
    recommendedModules: ['TASKS', 'STAFF', 'INVENTORY', 'FINANCE', 'REPORTS'],
  },
  {
    value: 'Agency',
    label: 'Agency & Creative Studio',
    badge: 'Creative',
    description: 'Digital agencies, marketing firms, software houses, and design studios.',
    iconType: 'agency',
    recommendedModules: ['TASKS', 'CUSTOMERS', 'PROJECTS', 'FINANCE', 'REPORTS', 'NOTIFICATIONS'],
  },
  {
    value: 'Professional services',
    label: 'Professional Services',
    badge: 'Services',
    description: 'Law firms, accounting practices, consulting, and advisory offices.',
    iconType: 'services',
    recommendedModules: ['TASKS', 'CUSTOMERS', 'APPOINTMENTS', 'FINANCE', 'REPORTS', 'NOTIFICATIONS'],
  },
  {
    value: 'Healthcare',
    label: 'Healthcare & Clinic',
    badge: 'Health',
    description: 'Medical practices, dental clinics, wellness centers, and pharmacies.',
    iconType: 'health',
    recommendedModules: ['STAFF', 'CUSTOMERS', 'APPOINTMENTS', 'INVENTORY', 'NOTIFICATIONS'],
  },
  {
    value: 'Construction',
    label: 'Construction & Real Estate',
    badge: 'Industrial',
    description: 'General contractors, architectural firms, property managers, and builders.',
    iconType: 'construction',
    recommendedModules: ['TASKS', 'PROJECTS', 'STAFF', 'INVENTORY', 'FINANCE', 'REPORTS'],
  },
  {
    value: 'Logistics',
    label: 'Logistics & Transportation',
    badge: 'Supply Chain',
    description: 'Couriers, haulage, dispatch networks, and supply chain operators.',
    iconType: 'logistics',
    recommendedModules: ['TASKS', 'STAFF', 'INVENTORY', 'CUSTOMERS', 'REPORTS', 'NOTIFICATIONS'],
  },
  {
    value: 'Other',
    label: 'Other Business Type',
    badge: 'General',
    description: 'Custom organizations, non-profits, associations, and multi-disciplinary teams.',
    iconType: 'other',
    recommendedModules: ['TASKS', 'CUSTOMERS', 'STAFF', 'FINANCE', 'REPORTS', 'NOTIFICATIONS'],
  },
];

// Helper to render Business Type Icon
const renderBusinessTypeIcon = (iconType: string, size = 20) => {
  switch (iconType) {
    case 'retail':
      return <ShoppingBagIcon size={size} />;
    case 'school':
      return <GraduationCapIcon size={size} />;
    case 'restaurant':
      return <UtensilsIcon size={size} />;
    case 'agency':
      return <PaletteIcon size={size} />;
    case 'services':
      return <BriefcaseIcon size={size} />;
    case 'health':
      return <HeartPulseIcon size={size} />;
    case 'construction':
      return <ConstructionIcon size={size} />;
    case 'logistics':
      return <TruckIcon size={size} />;
    case 'other':
    default:
      return <PackageIcon size={size} />;
  }
};

// Helper to render Module Icon
const renderModuleIcon = (key: string, size = 22) => {
  switch (key) {
    case 'TASKS':
      return <ClipboardListIcon size={size} />;
    case 'CUSTOMERS':
      return <UserCheckIcon size={size} />;
    case 'STAFF':
      return <UsersIcon size={size} />;
    case 'FINANCE':
      return <CreditCardIcon size={size} />;
    case 'INVENTORY':
      return <PackageIcon size={size} />;
    case 'APPOINTMENTS':
      return <CalendarIcon size={size} />;
    case 'PROJECTS':
      return <RocketIcon size={size} />;
    case 'REPORTS':
      return <BarChartIcon size={size} />;
    case 'NOTIFICATIONS':
      return <BellIcon size={size} />;
    default:
      return <SlidersIcon size={size} />;
  }
};

// All 9 Modules
const INITIAL_MODULES: ModuleConfig[] = [
  {
    key: 'TASKS',
    name: 'Tasks',
    description: 'Assign, track, and manage team tasks, checklists, and internal workflows.',
    enabled: true,
  },
  {
    key: 'CUSTOMERS',
    name: 'Customers',
    description: 'Client profiles, interaction history, contact directory, and CRM communications.',
    enabled: true,
  },
  {
    key: 'STAFF',
    name: 'Staff',
    description: 'Employee profiles, attendance tracking, shift scheduling, and role assignments.',
    enabled: true,
  },
  {
    key: 'FINANCE',
    name: 'Finance',
    description: 'Invoicing, automated billing, payment collection, revenue & expense tracking.',
    enabled: true,
  },
  {
    key: 'INVENTORY',
    name: 'Inventory',
    description: 'Real-time stock tracking, product catalog, supplier orders, and low-stock alerts.',
    enabled: true,
  },
  {
    key: 'APPOINTMENTS',
    name: 'Appointments',
    description: 'Online booking calendar, appointment schedules, and automated reminders.',
    enabled: false,
  },
  {
    key: 'PROJECTS',
    name: 'Projects',
    description: 'Milestones, project deliverables, client approvals, and timeline tracking.',
    enabled: false,
  },
  {
    key: 'REPORTS',
    name: 'Reports',
    description: 'Operational analytics, performance metrics, financial summaries, and data exports.',
    enabled: true,
  },
  {
    key: 'NOTIFICATIONS',
    name: 'Notifications',
    description: 'Automated email alerts, SMS reminders, and multi-channel system notifications.',
    enabled: true,
  },
];

export default function OnboardingPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Form States
  const [businessInfo, setBusinessInfo] = useState<BusinessInfo>({
    name: '',
    logo: '',
    email: '',
    phone: '',
    address: '',
    country: 'Nigeria',
    state: 'Lagos',
    website: '',
    currency: 'NGN',
    timeZone: 'Africa/Lagos',
  });

  const [selectedBusinessType, setSelectedBusinessType] = useState<string>('Retail');

  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    { email: '', role: 'Manager' },
  ]);

  const [modules, setModules] = useState<ModuleConfig[]>(INITIAL_MODULES);

  // Fetch current onboarding status on load if available
  useEffect(() => {
    async function checkStatus() {
      try {
        const res = await onboardingService.getStatus();
        if (res.status === 'COMPLETED') {
          setCurrentStep(5);
        } else if (res.business) {
          setBusinessInfo((prev) => ({
            ...prev,
            ...res.business,
          }));
        }
      } catch (err) {
        console.log('Onboarding status check skipped:', err);
      }
    }
    checkStatus();
  }, []);

  const triggerToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(null), 3000);
  };

  // Quick Auto-fill Demo Data handler
  const handleAutoFillDemo = () => {
    setBusinessInfo(DEMO_BUSINESS_INFO);
    setSelectedBusinessType('Retail');
    setTeamMembers([
      { email: 'sarah.manager@acmeglobal.com', role: 'Manager' },
      { email: 'david.ops@acmeglobal.com', role: 'Staff' },
    ]);
    setModules(INITIAL_MODULES);
    setErrorMsg(null);
    triggerToast('Demo information filled successfully!');
  };

  // Logo Upload handler
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setErrorMsg('Logo file size should be less than 2MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setBusinessInfo((prev) => ({
          ...prev,
          logo: reader.result as string,
        }));
        setErrorMsg(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeLogo = () => {
    setBusinessInfo((prev) => ({ ...prev, logo: '' }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Step 1 Submission: PUT /api/onboarding/business-info
  const handleStep1Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!businessInfo.name.trim()) {
      setErrorMsg('Business name is required.');
      return;
    }
    if (!businessInfo.email.trim()) {
      setErrorMsg('Business email is required.');
      return;
    }

    setIsSubmitting(true);
    try {
      await onboardingService.saveBusinessInfo(businessInfo);
      setCurrentStep(2);
    } catch (err: any) {
      console.warn('API saveBusinessInfo warning:', err);
      setCurrentStep(2);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Step 2 Submission: PUT /api/onboarding/business-type
  const handleStep2Submit = async () => {
    setErrorMsg(null);
    if (!selectedBusinessType) {
      setErrorMsg('Please select a business type.');
      return;
    }

    const matchedType = BUSINESS_TYPE_OPTIONS.find((t) => t.value === selectedBusinessType);
    if (matchedType) {
      setModules((prev) =>
        prev.map((m) => ({
          ...m,
          enabled: matchedType.recommendedModules.includes(m.key),
        }))
      );
    }

    setIsSubmitting(true);
    try {
      await onboardingService.saveBusinessType({ businessType: selectedBusinessType });
      setCurrentStep(3);
    } catch (err: any) {
      console.warn('API saveBusinessType warning:', err);
      setCurrentStep(3);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Step 3 Submission: POST /api/onboarding/team
  const handleStep3Submit = async () => {
    setErrorMsg(null);
    const validMembers = teamMembers.filter((m) => m.email.trim() !== '');

    setIsSubmitting(true);
    try {
      if (validMembers.length > 0) {
        await onboardingService.inviteTeam({ members: validMembers });
      }
      setCurrentStep(4);
    } catch (err: any) {
      console.warn('API inviteTeam warning:', err);
      setCurrentStep(4);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSkipTeam = () => {
    setErrorMsg(null);
    setCurrentStep(4);
  };

  // Step 4 Submission: PUT /api/onboarding/modules
  const handleStep4Submit = async () => {
    setErrorMsg(null);
    const payloadModules = modules.map((m) => ({
      key: m.key,
      enabled: m.enabled,
    }));

    setIsSubmitting(true);
    try {
      await onboardingService.configureModules({ modules: payloadModules });
      setCurrentStep(5);
    } catch (err: any) {
      console.warn('API configureModules warning:', err);
      setCurrentStep(5);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Final Step 5 Submission: POST /api/onboarding/complete
  const handleFinalComplete = async () => {
    setErrorMsg(null);
    setIsSubmitting(true);

    const validMembers = teamMembers.filter((m) => m.email.trim() !== '');
    const adminName = businessInfo.name ? `${businessInfo.name} Owner` : 'Workspace Admin';
    const adminAvatar = (businessInfo.name ? businessInfo.name.substring(0, 2) : 'WA').toUpperCase();

    const staffList: StaffMember[] = [
      {
        id: 'STF-01',
        name: adminName,
        email: businessInfo.email || 'admin@business.com',
        phone: businessInfo.phone || '+234 800 000 0000',
        role: 'Administrator',
        department: 'Executive Operations',
        status: 'Active',
        tasksAssigned: 0,
        tasksCompleted: 0,
        lastActive: 'Just now',
        joinedDate: new Date().toISOString().split('T')[0],
        permissions: ['ALL_PERMISSIONS'],
      },
      ...validMembers.map((m, idx) => ({
        id: `STF-0${idx + 2}`,
        name: m.email.split('@')[0],
        email: m.email,
        phone: '+234 800 000 0000',
        role: m.role as any,
        department: m.role === 'Manager' ? 'Operations' : 'Staff Operations',
        status: 'Active' as const,
        tasksAssigned: 0,
        tasksCompleted: 0,
        lastActive: 'Just invited',
        joinedDate: new Date().toISOString().split('T')[0],
        permissions: m.role === 'Administrator' ? ['ALL_PERMISSIONS'] : ['VIEW_TASKS', 'EDIT_TASKS'],
      })),
    ];

    saveWorkspaceStore({
      organization: {
        name: businessInfo.name || 'My Business',
        logo: businessInfo.logo || '/logo/logo.png',
        email: businessInfo.email || 'contact@mybusiness.com',
        phone: businessInfo.phone || '+234 800 000 0000',
        address: businessInfo.address || 'Commercial Hub',
        country: businessInfo.country || 'Nigeria',
        state: businessInfo.state || 'Lagos',
        website: businessInfo.website || 'https://mybusiness.com',
        currency: businessInfo.currency || 'NGN',
        timeZone: businessInfo.timeZone || 'Africa/Lagos',
        businessType: selectedBusinessType || 'General Business',
      },
      user: {
        name: adminName,
        email: businessInfo.email || 'admin@business.com',
        phone: businessInfo.phone || '+234 800 000 0000',
        role: 'Administrator',
        avatar: adminAvatar,
        department: 'Executive Operations',
      },
      tasks: [],
      customers: [],
      staff: staffList,
      transactions: [],
      invoices: [],
      reports: [
        {
          id: 'REP-01',
          title: 'Monthly Revenue & Margin Performance',
          category: 'Financial',
          summary: `Financial overview and operating margins for ${businessInfo.name || 'your workspace'}.`,
          dateRange: 'Current Month',
          generatedDate: new Date().toISOString().split('T')[0],
          metrics: [
            { title: 'Gross Revenue', value: `${getCurrencySymbol(businessInfo.currency)}0`, change: '0%', trend: 'neutral', description: 'initial balance' },
            { title: 'Net Margin', value: '0%', change: '0%', trend: 'neutral', description: 'margin baseline' },
          ],
        },
      ],
      notifications: [
        {
          id: 'notif-welcome',
          category: 'System',
          title: `Welcome to ${businessInfo.name || 'your workspace'}!`,
          description: `Your ${selectedBusinessType} workspace is active and initialized.`,
          time: 'Just now',
          read: false,
        },
      ],
      activities: [
        {
          id: 'act-1',
          userName: adminName,
          userRole: 'Administrator',
          action: `Completed business onboarding for ${businessInfo.name || 'Workspace'}`,
          recordAffected: 'Workspace Configuration',
          module: 'Settings',
          timestamp: 'Just now',
          ipAddress: '127.0.0.1',
        },
      ],
      isConfigured: true,
    });

    try {
      await onboardingService.completeOnboarding();
      triggerToast('Workspace successfully initialized! Redirecting to dashboard...');
      setTimeout(() => {
        router.push('/dashboard');
      }, 1000);
    } catch (err: any) {
      console.warn('API completeOnboarding warning:', err);
      triggerToast('Workspace successfully initialized! Redirecting to dashboard...');
      setTimeout(() => {
        router.push('/dashboard');
      }, 1000);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Team members helper
  const addTeamMemberRow = () => {
    setTeamMembers([...teamMembers, { email: '', role: 'Staff' }]);
  };

  const removeTeamMemberRow = (index: number) => {
    setTeamMembers(teamMembers.filter((_, i) => i !== index));
  };

  const updateTeamMember = (index: number, field: 'email' | 'role', value: string) => {
    const updated = [...teamMembers];
    updated[index][field] = value;
    setTeamMembers(updated);
  };

  // Module toggle helper
  const toggleModule = (key: string) => {
    setModules(
      modules.map((m) => (m.key === key ? { ...m, enabled: !m.enabled } : m))
    );
  };

  const currentBusinessTypeObj = BUSINESS_TYPE_OPTIONS.find(
    (t) => t.value === selectedBusinessType
  ) || BUSINESS_TYPE_OPTIONS[0];

  const isSetupActive = currentStep >= 1 && currentStep <= 5;
  const progressPercent = isSetupActive ? ((currentStep - 1) / 4) * 100 : 0;

  return (
    <div className="onboarding-root">
      {/* Dynamic Ambient Glow Blobs */}
      <div className="onboarding-blob onboarding-blob-1"></div>
      <div className="onboarding-blob onboarding-blob-2"></div>
      <div className="onboarding-blob onboarding-blob-3"></div>

      {/* Top Navbar */}
      <header className="onboarding-navbar">
        <Link href="/" className="onboarding-logo" title="VIFEMS Home">
          <img src="/logo/logo.png" alt="VIFEMS Logo" />
        </Link>
        <div className="onboarding-nav-right">
          {currentStep < 5 && (
            <button
              type="button"
              className="onboarding-quick-demo-btn"
              onClick={handleAutoFillDemo}
              title="Pre-fill sample business details for testing"
            >
              <ZapIcon size={16} />
              <span>Fill Demo Info</span>
            </button>
          )}
          <Link href="/" className="onboarding-nav-exit">
            Exit to Site ✕
          </Link>
        </div>
      </header>

      {/* Toast Notification */}
      {successToast && (
        <div className="onboarding-toast">
          <CheckCircleIcon size={18} />
          <span>{successToast}</span>
        </div>
      )}

      {/* Main Container */}
      <div className="onboarding-container">
        {/* PROGRESS STEPPER (Displayed for steps 1-5) */}
        {isSetupActive && currentStep < 5 && (
          <div className="onboarding-progress-card">
            <div className="stepper-header">
              <div
                className="stepper-progress-line"
                style={{ width: `calc(${progressPercent}% * 0.82)` }}
              ></div>

              <div
                className={`step-item ${currentStep === 1 ? 'active' : ''} ${currentStep > 1 ? 'completed' : ''}`}
                onClick={() => setCurrentStep(1)}
              >
                <div className="step-circle">{currentStep > 1 ? <CheckCircleIcon size={16} /> : '1'}</div>
                <span className="step-label">1. Business Info</span>
              </div>

              <div
                className={`step-item ${currentStep === 2 ? 'active' : ''} ${currentStep > 2 ? 'completed' : ''}`}
                onClick={() => currentStep > 1 && setCurrentStep(2)}
              >
                <div className="step-circle">{currentStep > 2 ? <CheckCircleIcon size={16} /> : '2'}</div>
                <span className="step-label">2. Business Type</span>
              </div>

              <div
                className={`step-item ${currentStep === 3 ? 'active' : ''} ${currentStep > 3 ? 'completed' : ''}`}
                onClick={() => currentStep > 2 && setCurrentStep(3)}
              >
                <div className="step-circle">{currentStep > 3 ? <CheckCircleIcon size={16} /> : '3'}</div>
                <span className="step-label">3. Team</span>
              </div>

              <div
                className={`step-item ${currentStep === 4 ? 'active' : ''} ${currentStep > 4 ? 'completed' : ''}`}
                onClick={() => currentStep > 3 && setCurrentStep(4)}
              >
                <div className="step-circle">{currentStep > 4 ? <CheckCircleIcon size={16} /> : '4'}</div>
                <span className="step-label">4. Modules</span>
              </div>

              <div
                className={`step-item ${currentStep === 5 ? 'active' : ''}`}
                onClick={() => currentStep > 4 && setCurrentStep(5)}
              >
                <div className="step-circle">5</div>
                <span className="step-label">5. Preferences</span>
              </div>
            </div>
          </div>
        )}

        {/* Global Error Banner */}
        {errorMsg && (
          <div className="onboarding-error-banner" role="alert">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span>{errorMsg}</span>
          </div>
        )}

        {/* ============================================================
            PAGE 07: WELCOME / SETUP (Step 0)
           ============================================================ */}
        {currentStep === 0 && (
          <div className="onboarding-card welcome-step-card">
            <div className="welcome-hero-badge">
              <SparklesIcon size={16} />
              <span>Workspace Onboarding</span>
            </div>

            <h1 className="welcome-title">
              Let&apos;s get your business <span>ready.</span>
            </h1>

            <p className="welcome-subtitle">
              Welcome to VIFEMS. We&apos;ll configure your workspace in just a few quick steps to streamline your operations, team, and daily workflows.
            </p>

            {/* Checklist items */}
            <div className="setup-checklist-box">
              <h3 className="checklist-heading">Setup Checklist</h3>
              <div className="checklist-items">
                <div className="checklist-row">
                  <div className="checklist-icon-box">
                    <BuildingIcon size={18} />
                  </div>
                  <div className="checklist-text">
                    <strong>1. Business Information</strong>
                    <span>Organization name, logo, contact, location & currency</span>
                  </div>
                </div>

                <div className="checklist-row">
                  <div className="checklist-icon-box">
                    <TargetIcon size={18} />
                  </div>
                  <div className="checklist-text">
                    <strong>2. Business Type</strong>
                    <span>Select your industry to optimize dashboard configuration</span>
                  </div>
                </div>

                <div className="checklist-row">
                  <div className="checklist-icon-box">
                    <UsersIcon size={18} />
                  </div>
                  <div className="checklist-text">
                    <strong>3. Team</strong>
                    <span>Invite administrators, managers, and staff members</span>
                  </div>
                </div>

                <div className="checklist-row">
                  <div className="checklist-icon-box">
                    <SlidersIcon size={18} />
                  </div>
                  <div className="checklist-text">
                    <strong>4. Modules</strong>
                    <span>Enable or customize the specific tools your business needs</span>
                  </div>
                </div>

                <div className="checklist-row">
                  <div className="checklist-icon-box">
                    <SparklesIcon size={18} />
                  </div>
                  <div className="checklist-text">
                    <strong>5. Preferences & Launch</strong>
                    <span>Review configuration summary and start running in minutes</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="welcome-actions">
              <button
                type="button"
                className="btn-onboarding-next welcome-btn"
                onClick={() => setCurrentStep(1)}
              >
                <span>Get Started &rarr;</span>
              </button>
            </div>
          </div>
        )}

        {/* ============================================================
            PAGE 08: BUSINESS PROFILE SETUP (Step 1)
           ============================================================ */}
        {currentStep === 1 && (
          <div className="onboarding-card">
            <div className="card-title-section">
              <div className="step-badge">Step 1 of 5</div>
              <h2>
                <BuildingIcon size={26} className="title-lead-icon" />
                Business Profile Setup
              </h2>
              <p>Enter your core company information and upload your business logo.</p>
            </div>

            <form onSubmit={handleStep1Submit}>
              {/* Business Logo Upload Zone */}
              <div className="logo-upload-section">
                <label className="logo-label">Business Logo</label>
                <div className="logo-uploader-box">
                  <div className="logo-preview-area">
                    {businessInfo.logo ? (
                      <div className="logo-preview-wrapper">
                        <img src={businessInfo.logo} alt="Business Logo" className="logo-preview-img" />
                        <button
                          type="button"
                          className="logo-remove-btn"
                          onClick={removeLogo}
                          title="Remove logo"
                        >
                          ✕
                        </button>
                      </div>
                    ) : (
                      <div className="logo-placeholder">
                        <BuildingIcon size={28} className="logo-placeholder-svg" />
                        <span className="logo-placeholder-text">No Logo Uploaded</span>
                      </div>
                    )}
                  </div>

                  <div className="logo-upload-controls">
                    <input
                      ref={fileInputRef}
                      type="file"
                      id="business-logo-input"
                      accept="image/png, image/jpeg, image/svg+xml, image/webp"
                      onChange={handleLogoUpload}
                      style={{ display: 'none' }}
                    />
                    <button
                      type="button"
                      className="btn-upload-logo"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="17 8 12 3 7 8" />
                        <line x1="12" y1="3" x2="12" y2="15" />
                      </svg>
                      {businessInfo.logo ? 'Change Logo' : 'Upload Logo'}
                    </button>
                    <p className="logo-hint">Supports PNG, JPG, SVG or WebP up to 2MB.</p>
                  </div>
                </div>
              </div>

              <div className="onboarding-grid-2">
                <div className="onboarding-form-group onboarding-grid-full">
                  <label htmlFor="business-name">
                    Business Name <span className="req">*</span>
                  </label>
                  <input
                    id="business-name"
                    type="text"
                    className="onboarding-input"
                    placeholder="e.g. Acme Global Ventures"
                    value={businessInfo.name}
                    onChange={(e) => setBusinessInfo({ ...businessInfo, name: e.target.value })}
                    required
                  />
                </div>

                <div className="onboarding-form-group">
                  <label htmlFor="business-email">
                    Business Email <span className="req">*</span>
                  </label>
                  <input
                    id="business-email"
                    type="email"
                    className="onboarding-input"
                    placeholder="contact@yourbusiness.com"
                    value={businessInfo.email}
                    onChange={(e) => setBusinessInfo({ ...businessInfo, email: e.target.value })}
                    required
                  />
                </div>

                <div className="onboarding-form-group">
                  <label htmlFor="business-phone">Phone Number</label>
                  <input
                    id="business-phone"
                    type="tel"
                    className="onboarding-input"
                    placeholder="+234 800 000 0000"
                    value={businessInfo.phone}
                    onChange={(e) => setBusinessInfo({ ...businessInfo, phone: e.target.value })}
                  />
                </div>

                <div className="onboarding-form-group onboarding-grid-full">
                  <label htmlFor="business-address">Business Address</label>
                  <input
                    id="business-address"
                    type="text"
                    className="onboarding-input"
                    placeholder="e.g. 14 Marina Commercial Boulevard"
                    value={businessInfo.address}
                    onChange={(e) => setBusinessInfo({ ...businessInfo, address: e.target.value })}
                  />
                </div>

                <div className="onboarding-form-group">
                  <label htmlFor="business-country">Country</label>
                  <select
                    id="business-country"
                    className="onboarding-select"
                    value={businessInfo.country}
                    onChange={(e) => setBusinessInfo({ ...businessInfo, country: e.target.value })}
                  >
                    <option value="Nigeria">Nigeria</option>
                    <option value="United States">United States</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="Ghana">Ghana</option>
                    <option value="Kenya">Kenya</option>
                    <option value="South Africa">South Africa</option>
                    <option value="Canada">Canada</option>
                    <option value="Germany">Germany</option>
                    <option value="United Arab Emirates">United Arab Emirates</option>
                    <option value="Other">Other Country</option>
                  </select>
                </div>

                <div className="onboarding-form-group">
                  <label htmlFor="business-state">State / Region</label>
                  <input
                    id="business-state"
                    type="text"
                    className="onboarding-input"
                    placeholder="e.g. Lagos"
                    value={businessInfo.state}
                    onChange={(e) => setBusinessInfo({ ...businessInfo, state: e.target.value })}
                  />
                </div>

                <div className="onboarding-form-group onboarding-grid-full">
                  <label htmlFor="business-website">Website URL</label>
                  <input
                    id="business-website"
                    type="url"
                    className="onboarding-input"
                    placeholder="https://yourbusiness.com"
                    value={businessInfo.website}
                    onChange={(e) => setBusinessInfo({ ...businessInfo, website: e.target.value })}
                  />
                </div>

                <div className="onboarding-form-group">
                  <label htmlFor="business-currency">Currency</label>
                  <select
                    id="business-currency"
                    className="onboarding-select"
                    value={businessInfo.currency}
                    onChange={(e) => setBusinessInfo({ ...businessInfo, currency: e.target.value })}
                  >
                    <option value="NGN">NGN (₦ - Nigerian Naira)</option>
                    <option value="USD">USD ($ - US Dollar)</option>
                    <option value="EUR">EUR (€ - Euro)</option>
                    <option value="GBP">GBP (£ - British Pound)</option>
                    <option value="KES">KES (KSh - Kenyan Shilling)</option>
                    <option value="GHS">GHS (GH₵ - Ghanaian Cedi)</option>
                    <option value="CAD">CAD (C$ - Canadian Dollar)</option>
                    <option value="ZAR">ZAR (R - South African Rand)</option>
                  </select>
                </div>

                <div className="onboarding-form-group">
                  <label htmlFor="business-timezone">Time Zone</label>
                  <select
                    id="business-timezone"
                    className="onboarding-select"
                    value={businessInfo.timeZone}
                    onChange={(e) => setBusinessInfo({ ...businessInfo, timeZone: e.target.value })}
                  >
                    <option value="Africa/Lagos">Africa/Lagos (WAT, UTC+1)</option>
                    <option value="UTC">UTC / GMT</option>
                    <option value="America/New_York">America/New_York (EST, UTC-5)</option>
                    <option value="Europe/London">Europe/London (BST/GMT, UTC+0/+1)</option>
                    <option value="Africa/Nairobi">Africa/Nairobi (EAT, UTC+3)</option>
                    <option value="Africa/Johannesburg">Africa/Johannesburg (SAST, UTC+2)</option>
                    <option value="Asia/Dubai">Asia/Dubai (GST, UTC+4)</option>
                  </select>
                </div>
              </div>

              <div className="onboarding-footer-actions">
                <button type="button" className="btn-onboarding-back" onClick={() => setCurrentStep(0)}>
                  &larr; Back
                </button>
                <button type="submit" className="btn-onboarding-next" disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : 'Save & Continue →'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ============================================================
            PAGE 09: SELECT BUSINESS TYPE (Step 2 - Dropdown)
           ============================================================ */}
        {currentStep === 2 && (
          <div className="onboarding-card">
            <div className="card-title-section">
              <div className="step-badge">Step 2 of 5</div>
              <h2>
                <TargetIcon size={26} className="title-lead-icon" />
                Select Business Type
              </h2>
              <p>Business type determines available modules and dashboard configuration.</p>
            </div>

            <div className="business-type-dropdown-section">
              <div className="onboarding-form-group">
                <label htmlFor="business-type-select">
                  Select your Business Category <span className="req">*</span>
                </label>
                <div className="select-with-icon-wrapper">
                  <span className="select-lead-icon-svg">
                    {renderBusinessTypeIcon(currentBusinessTypeObj.iconType, 20)}
                  </span>
                  <select
                    id="business-type-select"
                    className="onboarding-select custom-type-select"
                    value={selectedBusinessType}
                    onChange={(e) => setSelectedBusinessType(e.target.value)}
                  >
                    {BUSINESS_TYPE_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label} ({opt.badge})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Dynamic Information Card for Chosen Category */}
              <div className="type-preview-card">
                <div className="type-preview-top">
                  <div className="type-preview-badge">{currentBusinessTypeObj.badge}</div>
                  <div className="type-preview-icon-wrapper">
                    {renderBusinessTypeIcon(currentBusinessTypeObj.iconType, 24)}
                  </div>
                </div>
                <h3 className="type-preview-title">{currentBusinessTypeObj.label}</h3>
                <p className="type-preview-desc">{currentBusinessTypeObj.description}</p>

                <div className="type-preview-recommended">
                  <span className="recommended-label">Recommended Workspace Modules:</span>
                  <div className="recommended-tags">
                    {currentBusinessTypeObj.recommendedModules.map((modKey) => {
                      const mod = INITIAL_MODULES.find((m) => m.key === modKey);
                      return (
                        <span key={modKey} className="recommended-tag">
                          {renderModuleIcon(modKey, 14)}
                          <span>{mod?.name || modKey}</span>
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            <div className="onboarding-footer-actions">
              <button type="button" className="btn-onboarding-back" onClick={() => setCurrentStep(1)}>
                &larr; Back
              </button>
              <button
                type="button"
                className="btn-onboarding-next"
                onClick={handleStep2Submit}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Saving...' : 'Continue to Team →'}
              </button>
            </div>
          </div>
        )}

        {/* ============================================================
            PAGE 10: TEAM SETUP (Step 3)
           ============================================================ */}
        {currentStep === 3 && (
          <div className="onboarding-card">
            <div className="card-title-section">
              <div className="step-badge">Step 3 of 5</div>
              <h2>
                <UsersIcon size={26} className="title-lead-icon" />
                Team Setup
              </h2>
              <p>Invite team members with role-based access permissions.</p>
            </div>

            <div className="team-setup-container">
              <div className="team-list-header">
                <span>Staff Email</span>
                <span>Role Selector</span>
                <span>Action</span>
              </div>

              {teamMembers.map((member, index) => (
                <div key={index} className="team-member-row">
                  <div className="team-email-col">
                    <input
                      type="email"
                      className="onboarding-input"
                      placeholder="colleague@yourbusiness.com"
                      value={member.email}
                      onChange={(e) => updateTeamMember(index, 'email', e.target.value)}
                    />
                  </div>

                  <div className="team-role-col">
                    <select
                      className="onboarding-select"
                      value={member.role}
                      onChange={(e) => updateTeamMember(index, 'role', e.target.value)}
                    >
                      <option value="Administrator">Administrator (Full Access)</option>
                      <option value="Manager">Manager (Operations & Reports)</option>
                      <option value="Staff">Staff (Daily Tasks & Shifts)</option>
                    </select>
                  </div>

                  <div className="team-action-col">
                    {teamMembers.length > 1 ? (
                      <button
                        type="button"
                        className="remove-member-btn"
                        onClick={() => removeTeamMemberRow(index)}
                        title="Remove member"
                      >
                        ✕
                      </button>
                    ) : (
                      <div className="remove-placeholder"></div>
                    )}
                  </div>
                </div>
              ))}

              <button type="button" className="add-member-btn" onClick={addTeamMemberRow}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                <span>Add another person</span>
              </button>

              <div className="roles-guide-box">
                <div className="role-guide-item">
                  <ShieldIcon size={16} className="role-guide-icon" />
                  <div>
                    <strong>Administrator:</strong> Full workspace control, billing, settings & permissions.
                  </div>
                </div>
                <div className="role-guide-item">
                  <ManagerIcon size={16} className="role-guide-icon" />
                  <div>
                    <strong>Manager:</strong> Operations oversight, module configs, staff attendance & reporting.
                  </div>
                </div>
                <div className="role-guide-item">
                  <StaffIcon size={16} className="role-guide-icon" />
                  <div>
                    <strong>Staff:</strong> Day-to-day task workflows, appointments, shift schedules & client logs.
                  </div>
                </div>
              </div>
            </div>

            <div className="onboarding-footer-actions">
              <div className="footer-left-group">
                <button type="button" className="btn-onboarding-back" onClick={() => setCurrentStep(2)}>
                  &larr; Back
                </button>
                <button type="button" className="btn-onboarding-skip" onClick={handleSkipTeam}>
                  Skip for now
                </button>
              </div>

              <button
                type="button"
                className="btn-onboarding-next"
                onClick={handleStep3Submit}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Sending invitations...' : 'Send invitations & Continue →'}
              </button>
            </div>
          </div>
        )}

        {/* ============================================================
            PAGE 11: MODULE CONFIGURATION (Step 4)
           ============================================================ */}
        {currentStep === 4 && (
          <div className="onboarding-card">
            <div className="card-title-section">
              <div className="step-badge">Step 4 of 5</div>
              <h2>
                <SlidersIcon size={26} className="title-lead-icon" />
                Choose Modules
              </h2>
              <p>Select which modules to activate for your workspace. You can change these anytime in Settings.</p>
            </div>

            <div className="modules-grid">
              {modules.map((mod) => (
                <div
                  key={mod.key}
                  className={`module-item-card ${mod.enabled ? 'active' : ''}`}
                  onClick={() => toggleModule(mod.key)}
                >
                  <div className="module-info">
                    <div className="module-icon">
                      {renderModuleIcon(mod.key, 22)}
                    </div>
                    <div className="module-details">
                      <h4>{mod.name}</h4>
                      <p>{mod.description}</p>
                    </div>
                  </div>

                  <label
                    className="switch-toggle"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <input
                      type="checkbox"
                      checked={mod.enabled}
                      onChange={() => toggleModule(mod.key)}
                      aria-label={`Toggle ${mod.name} module`}
                    />
                    <span className="slider-round"></span>
                  </label>
                </div>
              ))}
            </div>

            <div className="onboarding-footer-actions">
              <button type="button" className="btn-onboarding-back" onClick={() => setCurrentStep(3)}>
                &larr; Back
              </button>
              <button
                type="button"
                className="btn-onboarding-next"
                onClick={handleStep4Submit}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Saving...' : 'Review & Finalize →'}
              </button>
            </div>
          </div>
        )}

        {/* ============================================================
            PAGE 12: ONBOARDING COMPLETE / SUMMARY (Step 5)
           ============================================================ */}
        {currentStep === 5 && (
          <div className="onboarding-card completion-screen">
            <div className="completion-icon">
              <CheckCircleIcon size={44} />
            </div>
            <h2 className="completion-title">Setup Complete!</h2>
            <p className="completion-subtitle">
              Your business workspace <strong>{businessInfo.name || 'Your Business'}</strong> is fully configured and ready for action.
            </p>

            {/* Completion Summary Container */}
            <div className="summary-container">
              {/* Summary Block 1: Business Profile */}
              <div className="summary-block">
                <div className="summary-block-header">
                  <div className="summary-title-with-icon">
                    <BuildingIcon size={18} />
                    <h4>Business Profile</h4>
                  </div>
                  <button type="button" className="summary-edit-btn" onClick={() => setCurrentStep(1)}>
                    Edit
                  </button>
                </div>
                <div className="summary-details-grid">
                  <div className="summary-field">
                    <label>Business Name</label>
                    <span>{businessInfo.name || 'Acme Global'}</span>
                  </div>
                  <div className="summary-field">
                    <label>Email Address</label>
                    <span>{businessInfo.email || 'info@acmeglobal.com'}</span>
                  </div>
                  <div className="summary-field">
                    <label>Phone</label>
                    <span>{businessInfo.phone || 'Not provided'}</span>
                  </div>
                  <div className="summary-field">
                    <label>Location</label>
                    <span>{`${businessInfo.state || 'Lagos'}, ${businessInfo.country || 'Nigeria'}`}</span>
                  </div>
                  <div className="summary-field">
                    <label>Currency & Timezone</label>
                    <span>{`${businessInfo.currency} · ${businessInfo.timeZone}`}</span>
                  </div>
                  {businessInfo.logo && (
                    <div className="summary-field">
                      <label>Brand Logo</label>
                      <img src={businessInfo.logo} alt="Logo" className="summary-mini-logo" />
                    </div>
                  )}
                </div>
              </div>

              {/* Summary Block 2: Business Type & Team */}
              <div className="summary-block">
                <div className="summary-block-header">
                  <div className="summary-title-with-icon">
                    <TargetIcon size={18} />
                    <h4>Category & Team</h4>
                  </div>
                  <button type="button" className="summary-edit-btn" onClick={() => setCurrentStep(2)}>
                    Edit
                  </button>
                </div>
                <div className="summary-details-grid">
                  <div className="summary-field">
                    <label>Business Category</label>
                    <span className="summary-type-value">
                      {renderBusinessTypeIcon(currentBusinessTypeObj.iconType, 16)}
                      <span>{selectedBusinessType}</span>
                    </span>
                  </div>
                  <div className="summary-field">
                    <label>Team Invitations</label>
                    <span>
                      {teamMembers.filter((m) => m.email.trim() !== '').length > 0
                        ? `${teamMembers.filter((m) => m.email.trim() !== '').length} member(s) queued`
                        : 'No team members invited (Solo setup)'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Summary Block 3: Active Modules */}
              <div className="summary-block">
                <div className="summary-block-header">
                  <div className="summary-title-with-icon">
                    <SlidersIcon size={18} />
                    <h4>Active Modules ({modules.filter((m) => m.enabled).length})</h4>
                  </div>
                  <button type="button" className="summary-edit-btn" onClick={() => setCurrentStep(4)}>
                    Edit
                  </button>
                </div>
                <div className="summary-pills">
                  {modules
                    .filter((m) => m.enabled)
                    .map((m) => (
                      <span key={m.key} className="summary-pill">
                        {renderModuleIcon(m.key, 14)}
                        <span>{m.name}</span>
                      </span>
                    ))}
                </div>
              </div>
            </div>

            {/* Finish Action */}
            <div className="completion-actions">
              <button
                type="button"
                className="btn-onboarding-next completion-btn"
                onClick={handleFinalComplete}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Launching workspace...' : 'Go to Dashboard →'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
