'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { onboardingService } from '@/services/onboarding.service';
import { tokenStorage } from '@/lib/api';
import {
  MODULE_CATALOG,
  BUSINESS_TYPE_PRESETS,
  EntityConfig,
  EntityFieldDefinition,
} from '@/lib/moduleCatalog';
import {
  getOrgModuleCatalog,
  buildInitialModuleStates,
  ALL_MODULE_METADATA,
} from '@/lib/orgModuleCatalog';
import {
  BusinessInfo,
  TeamMember,
  ModuleItem,
} from '@/types/onboarding';
import './onboarding.css';

// SVG Icon Components (100% Vector, Zero Emojis)
const Icons = {
  Zap: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  ),
  Building: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
      <path d="M9 22v-4h6v4" />
      <path d="M8 6h.01M16 6h.01M8 10h.01M16 10h.01M16 14h.01" />
    </svg>
  ),
  GraduationCap: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
      <path d="M6 12v5c3 3 9 3 12 0v-5" />
    </svg>
  ),
  ShoppingBag: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
      <path d="M3 6h18" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  ),
  Briefcase: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="14" x="2" y="7" rx="2" ry="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  ),
  Layers: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 2 7 12 12 22 7 12 2" />
      <polyline points="2 17 12 22 22 17" />
      <polyline points="2 12 12 17 22 12" />
    </svg>
  ),
  Users: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  BookOpen: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  ),
  Clock: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  CreditCard: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="14" x="2" y="5" rx="2" />
      <line x1="2" x2="22" y1="10" y2="10" />
    </svg>
  ),
  Folder: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
    </svg>
  ),
  Package: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m7.5 4.27 9 5.15" />
      <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
      <path d="m3.3 7 8.7 5 8.7-5" />
      <path d="M12 22V12" />
    </svg>
  ),
  CheckSquare: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 11 12 14 22 4" />
      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
    </svg>
  ),
  FileText: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  ),
  DollarSign: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="1" x2="12" y2="23" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  ),
  BarChart: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="20" x2="12" y2="10" />
      <line x1="18" y1="20" x2="18" y2="4" />
      <line x1="6" y1="20" x2="6" y2="16" />
    </svg>
  ),
  CheckCircle: () => (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  ),
  Trash: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
  ),
  Plus: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  ),
  Check: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
};

const getModuleIcon = (key: string) => {
  switch (key) {
    case 'PARTICIPANTS': return <Icons.Users />;
    case 'STUDENTS': return <Icons.GraduationCap />;
    case 'TRAINING': return <Icons.BookOpen />;
    case 'PROGRAMS': return <Icons.BookOpen />;
    case 'CLASSES': return <Icons.Layers />;
    case 'ACADEMIC_SESSIONS': return <Icons.Clock />;
    case 'SUBJECTS': return <Icons.BookOpen />;
    case 'RESULTS': return <Icons.BarChart />;
    case 'ATTENDANCE': return <Icons.Clock />;
    case 'PAYMENTS': return <Icons.CreditCard />;
    case 'FEES': return <Icons.CreditCard />;
    case 'LIBRARY': return <Icons.BookOpen />;
    case 'SCHOOL_HEALTH': return <Icons.Zap />;
    case 'GUIDANCE': return <Icons.Users />;
    case 'CUSTOMERS': return <Icons.Folder />;
    case 'INVENTORY': return <Icons.Package />;
    case 'PRODUCTS': return <Icons.ShoppingBag />;
    case 'ORDERS': return <Icons.FileText />;
    case 'SUPPLIERS': return <Icons.Package />;
    case 'DISCOUNTS': return <Icons.DollarSign />;
    case 'TASKS': return <Icons.CheckSquare />;
    case 'INVOICES': return <Icons.FileText />;
    case 'FINANCE': return <Icons.DollarSign />;
    case 'STAFF': return <Icons.Users />;
    case 'TRAINERS': return <Icons.Users />;
    case 'COHORTS': return <Icons.Users />;
    case 'CERTIFICATES': return <Icons.CheckSquare />;
    case 'PROGRESS_TRACKING': return <Icons.BarChart />;
    case 'REPORTS': return <Icons.BarChart />;
    default: return <Icons.Layers />;
  }
};

const DEMO_PRESETS: BusinessInfo = {
  name: 'Victor Training Academy',
  email: 'info@vifems.com',
  phone: '+2348000000000',
  address: '123 Business Way',
  country: 'Nigeria',
  state: 'Lagos',
  website: 'https://vifems.com',
  currency: 'NGN',
  timeZone: 'Africa/Lagos',
};

export default function OnboardingPage() {
  const router = useRouter();

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isLoadingStatus, setIsLoadingStatus] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  // Organization Type State (new granular field)
  const [organizationType, setOrganizationType] = useState<string>('');
  const [customOrganizationType, setCustomOrganizationType] = useState<string>('');
  const [orgTypeError, setOrgTypeError] = useState<string | null>(null);

  // Business Type State (internal preset key — derived from organizationType)
  const [selectedBusinessType, setSelectedBusinessType] = useState<string>('TRAINING');

  // Map from organizationType -> business preset key for module defaults
  const ORG_TYPE_PRESET_MAP: Record<string, string> = {
    school: 'TRAINING',
    training: 'TRAINING',
    business: 'SERVICES',
    retail: 'RETAIL',
    healthcare: 'SERVICES',
    hospitality: 'SERVICES',
    professional_services: 'SERVICES',
    nonprofit: 'TRAINING',
    custom: 'CUSTOM',
  };

  // Business Info State
  const [businessInfo, setBusinessInfo] = useState<BusinessInfo>({
    name: '',
    email: '',
    phone: '',
    address: '',
    country: 'Nigeria',
    state: '',
    website: '',
    currency: 'NGN',
    timeZone: 'Africa/Lagos',
  });

  // Entity Configuration State
  const [entityConfig, setEntityConfig] = useState<EntityConfig>(
    BUSINESS_TYPE_PRESETS.TRAINING.defaultEntityConfig
  );
  const [newFieldLabel, setNewFieldLabel] = useState<string>('');
  const [newFieldType, setNewFieldType] = useState<EntityFieldDefinition['type']>('text');
  const [newFieldRequired, setNewFieldRequired] = useState<boolean>(false);

  // Team Members State
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    { email: 'trainer@vifems.com', role: 'ADMIN', department: 'Operations' },
  ]);

  // Modules State — dynamically initialized based on org type
  const [moduleStates, setModuleStates] = useState<Record<string, boolean>>(() =>
    buildInitialModuleStates('training')
  );

  // Step 1: Handle org type dropdown change
  const handleOrgTypeChange = (orgType: string) => {
    setOrganizationType(orgType);
    setOrgTypeError(null);
    if (orgType !== 'custom') setCustomOrganizationType('');

    const presetKey = ORG_TYPE_PRESET_MAP[orgType] || 'CUSTOM';
    setSelectedBusinessType(presetKey);

    // Set specific entityConfig presets for schools vs general
    if (orgType === 'school') {
      setEntityConfig({
        entityLabel: 'Student',
        entityLabelPlural: 'Students',
        fields: [
          { key: 'fullName', label: 'Student Full Name', type: 'text', required: true, enabled: true, order: 1 },
          { key: 'email', label: 'Student / Guardian Email', type: 'email', required: false, enabled: true, order: 2 },
          { key: 'phone', label: 'Parent / Guardian Phone', type: 'phone', required: false, enabled: true, order: 3 },
          { key: 'admissionNumber', label: 'Admission / Student ID', type: 'text', required: false, enabled: true, order: 4 },
          { key: 'gradeLevel', label: 'Grade / Class Level', type: 'text', required: false, enabled: true, order: 5 },
          { key: 'gender', label: 'Gender', type: 'select', options: ['Male', 'Female'], required: false, enabled: true, order: 6 },
          { key: 'dob', label: 'Date of Birth', type: 'date', required: false, enabled: true, order: 7 },
        ],
      });
    } else if (orgType === 'healthcare') {
      setEntityConfig({
        entityLabel: 'Patient',
        entityLabelPlural: 'Patients',
        fields: [
          { key: 'fullName', label: 'Full Name', type: 'text', required: true, enabled: true, order: 1 },
          { key: 'email', label: 'Email Address', type: 'email', required: false, enabled: true, order: 2 },
          { key: 'phone', label: 'Phone Number', type: 'phone', required: true, enabled: true, order: 3 },
          { key: 'dob', label: 'Date of Birth', type: 'date', required: false, enabled: true, order: 4 },
          { key: 'bloodGroup', label: 'Blood Group', type: 'select', options: ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'], required: false, enabled: true, order: 5 },
          { key: 'emergencyContact', label: 'Emergency Contact', type: 'phone', required: false, enabled: true, order: 6 },
        ],
      });
    } else {
      const preset = BUSINESS_TYPE_PRESETS[presetKey] || BUSINESS_TYPE_PRESETS.CUSTOM;
      setEntityConfig(preset.defaultEntityConfig);
    }

    // Safely reset module states to the new org type catalog (core = true, optional = false)
    // Ensures selections from a previous org type (e.g. Library) do NOT linger
    setModuleStates(buildInitialModuleStates(orgType));
  };

  // Legacy: kept for auto-fill and backward compat
  const handleSelectBusinessType = (key: string) => {
    setSelectedBusinessType(key);
    const preset = BUSINESS_TYPE_PRESETS[key] || BUSINESS_TYPE_PRESETS.CUSTOM;
    setEntityConfig(preset.defaultEntityConfig);
    setModuleStates(buildInitialModuleStates(key.toLowerCase()));
  };

  // Field Config Helpers
  const handleToggleField = (fieldKey: string) => {
    setEntityConfig((prev) => ({
      ...prev,
      fields: prev.fields.map((f) =>
        f.key === fieldKey ? { ...f, enabled: !f.enabled } : f
      ),
    }));
  };

  const handleAddField = () => {
    if (!newFieldLabel.trim()) return;
    const cleanKey = newFieldLabel.toLowerCase().replace(/[^a-z0-9]/g, '_');
    const uniqueKey = `${cleanKey}_${Date.now().toString().slice(-4)}`;

    const newField: EntityFieldDefinition = {
      key: uniqueKey,
      label: newFieldLabel.trim(),
      type: newFieldType,
      required: newFieldRequired,
      enabled: true,
      order: entityConfig.fields.length + 1,
    };

    setEntityConfig((prev) => ({
      ...prev,
      fields: [...prev.fields, newField],
    }));

    setNewFieldLabel('');
    setNewFieldRequired(false);
  };

  const handleRemoveField = (fieldKey: string) => {
    setEntityConfig((prev) => ({
      ...prev,
      fields: prev.fields.filter((f) => f.key !== fieldKey),
    }));
  };

  // Team Helpers
  const addTeamMember = () => {
    setTeamMembers([...teamMembers, { email: '', role: 'MEMBER', department: 'General' }]);
  };

  const removeTeamMember = (index: number) => {
    setTeamMembers(teamMembers.filter((_, i) => i !== index));
  };

  const updateTeamMember = (index: number, field: keyof TeamMember, value: string) => {
    const updated = [...teamMembers];
    updated[index] = { ...updated[index], [field]: value };
    setTeamMembers(updated);
  };

  // Initial status fetch
  useEffect(() => {
    const fetchStatus = async () => {
      const token = tokenStorage.getToken();
      if (!token) {
        router.push('/login?redirect=/onboarding');
        return;
      }

      setIsLoadingStatus(true);
      try {
        const res = await onboardingService.getStatus();
        if (res.business) {
          const b = res.business;
          setBusinessInfo({
            name: b.name || '',
            email: b.email || '',
            phone: b.phone || '',
            address: b.address || '',
            country: b.country || 'Nigeria',
            state: b.state || '',
            website: b.website || '',
            currency: b.currency || 'NGN',
            timeZone: b.timeZone || 'Africa/Lagos',
          });

          if (b.organizationType) {
            setOrganizationType(b.organizationType);
            if (b.customOrganizationType) setCustomOrganizationType(b.customOrganizationType);
            const initialStates = buildInitialModuleStates(b.organizationType);
            if (Array.isArray(b.modules) && b.modules.length > 0) {
              b.modules.forEach((m: any) => {
                initialStates[m.moduleKey] = !!m.isEnabled;
              });
            }
            setModuleStates(initialStates);
          } else if (Array.isArray(b.modules) && b.modules.length > 0) {
            const modMap: Record<string, boolean> = {};
            b.modules.forEach((m: any) => {
              modMap[m.moduleKey] = !!m.isEnabled;
            });
            setModuleStates((prev) => ({ ...prev, ...modMap }));
          }

          if (b.businessType) {
            setSelectedBusinessType(b.businessType);
            if (b.entityConfig && Array.isArray(b.entityConfig.fields)) {
              setEntityConfig(b.entityConfig);
            } else {
              const preset = BUSINESS_TYPE_PRESETS[b.businessType] || BUSINESS_TYPE_PRESETS.CUSTOM;
              setEntityConfig(preset.defaultEntityConfig);
            }
          }

          const searchParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
          const isReonboard = searchParams?.get('reonboard') === 'true' || searchParams?.get('edit') === 'true';

          if (isReonboard) {
            setIsCompleted(false);
            setCurrentStep(1);
          } else if (res.status === 'COMPLETED' || b.isCompleted) {
            setIsCompleted(true);
          } else if (res.status === 'MODULES') {
            setCurrentStep(5);
          } else if (res.status === 'TEAM_SETUP') {
            setCurrentStep(4);
          } else if (res.status === 'ENTITY_CONFIG') {
            setCurrentStep(4);
          } else if (res.status === 'BUSINESS_INFO') {
            setCurrentStep(3);
          } else if (res.status === 'BUSINESS_TYPE') {
            setCurrentStep(2);
          }
        }
      } catch (err: any) {
        console.warn('Unable to load onboarding status:', err);
      } finally {
        setIsLoadingStatus(false);
      }
    };

    fetchStatus();
  }, [router]);

  // Demo auto-fill
  const handleAutoFillDemo = () => {
    handleSelectBusinessType('TRAINING');
    setBusinessInfo(DEMO_PRESETS);
    setTeamMembers([
      { email: 'trainer@vifems.com', role: 'ADMIN', department: 'Instruction' },
      { email: 'sarah.ade@vifems.com', role: 'MEMBER', department: 'Operations' },
    ]);
    setErrorMsg(null);
  };

  // Step 1 Submit: Organization Type
  const handleStep1Submit = async () => {
    setOrgTypeError(null);
    setErrorMsg(null);

    // Validate
    if (!organizationType) {
      setOrgTypeError('Please select your organization type.');
      return;
    }
    if (organizationType === 'custom' && !customOrganizationType.trim()) {
      setOrgTypeError('Please describe what type of organization you run.');
      return;
    }

    setIsSubmitting(true);
    try {
      await onboardingService.saveBusinessType({
        organizationType,
        customOrganizationType: organizationType === 'custom' ? customOrganizationType.trim() : undefined,
      });
      setCurrentStep(2);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to save organization type.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Step 2 Submit: Business Info
  const handleStep2Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const name = businessInfo.name.trim();
    const email = businessInfo.email.trim();

    if (!name) {
      setErrorMsg('Organization or business name is required.');
      return;
    }
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      setErrorMsg('A valid work email address is required.');
      return;
    }

    setIsSubmitting(true);
    try {
      await onboardingService.saveBusinessInfo({
        name,
        email,
        phone: businessInfo.phone.trim(),
        address: businessInfo.address.trim(),
        country: businessInfo.country.trim() || 'Nigeria',
        state: businessInfo.state.trim(),
        website: businessInfo.website?.trim() || '',
        currency: businessInfo.currency || 'NGN',
        timeZone: businessInfo.timeZone || 'Africa/Lagos',
      });
      setCurrentStep(3);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to save business profile.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Step 3 Submit: Entity Configuration
  const handleStep3Submit = async () => {
    setErrorMsg(null);
    if (!entityConfig.entityLabel.trim()) {
      setErrorMsg('Primary record label cannot be empty.');
      return;
    }

    setIsSubmitting(true);
    try {
      await onboardingService.saveEntityConfig({
        entityLabel: entityConfig.entityLabel.trim(),
        entityLabelPlural: entityConfig.entityLabelPlural?.trim() || `${entityConfig.entityLabel.trim()}s`,
        fields: entityConfig.fields,
      });

      // Persist in localStorage for instant client hydration
      if (typeof window !== 'undefined') {
        localStorage.setItem('vifems_customer_fields_config', JSON.stringify(entityConfig));
      }

      setCurrentStep(4);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to save entity configuration.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Step 4 Submit: Modules Selection
  const handleStep4Submit = async () => {
    setErrorMsg(null);
    const orgCatalog = getOrgModuleCatalog(organizationType || 'training');
    const allCatalogModules = [...orgCatalog.core, ...orgCatalog.optional];

    const payloadModules: ModuleItem[] = allCatalogModules.map((m) => ({
      key: m.key,
      enabled: m.isCore ? true : !!moduleStates[m.key],
    }));

    setIsSubmitting(true);
    try {
      await onboardingService.configureModules({ modules: payloadModules });
      setCurrentStep(5);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to save module selection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Step 6 Submit: Complete Onboarding & Activate Workspace
  const handleFinalComplete = async () => {
    setErrorMsg(null);
    setIsSubmitting(true);
    try {
      const res = await onboardingService.completeOnboarding();
      if (typeof window !== 'undefined' && res.entity) {
        localStorage.setItem('vifems_customer_fields_config', JSON.stringify(res.entity));
      }
      setIsCompleted(true);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to complete workspace activation.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingStatus) {
    return (
      <div className="onboarding-root" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              border: '3.5px solid #e2e8f0',
              borderTopColor: '#1a3a8a',
              borderRadius: '50%',
              animation: 'spin 0.8s linear infinite',
              margin: '0 auto 16px auto',
            }}
          />
          <p style={{ color: '#64748b', fontWeight: 500, fontSize: '0.95rem' }}>Loading your workspace setup...</p>
        </div>
      </div>
    );
  }

  const currentPreset = BUSINESS_TYPE_PRESETS[selectedBusinessType] || BUSINESS_TYPE_PRESETS.TRAINING;
  const currentOrgCatalog = getOrgModuleCatalog(organizationType || 'training');
  const enabledModuleCount =
    currentOrgCatalog.core.length +
    currentOrgCatalog.optional.filter((m) => !!moduleStates[m.key]).length;


  return (
    <div className="onboarding-root">
      {/* Top Navbar */}
      <header className="onboarding-navbar">
        <Link href="/" className="onboarding-logo" title="VIFEmS Platform">
          <img src="/logo/logo.png" alt="VIFEmS Logo" />
        </Link>
        <button
          type="button"
          className="onboarding-quick-demo-btn"
          onClick={handleAutoFillDemo}
          title="Auto-fill recommended training academy configuration"
        >
          <Icons.Zap />
          <span>Auto-fill Demo Data</span>
        </button>
      </header>

      {/* Main Container */}
      <main className="onboarding-container">
        {/* Completion Screen */}
        {isCompleted ? (
          <div className="onboarding-card completion-screen animate-fade-up">
            <div className="completion-icon">
              <Icons.CheckCircle />
            </div>
            <h2>Workspace Activated!</h2>
            <p>
              Your VIFEmS workspace <strong>{businessInfo.name || 'Organization Workspace'}</strong> is fully configured and ready for your team.
            </p>
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginTop: '28px' }}>
              <button
                type="button"
                className="btn-onboarding-next"
                onClick={() => router.push('/dashboard')}
                style={{ padding: '14px 36px', fontSize: '1rem', fontWeight: 700 }}
              >
                Go to Workspace Dashboard →
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Stepper Progress Card */}
            <div className="onboarding-progress-card">
              <div className="stepper-header">
                {[
                  { step: 1, label: 'Model' },
                  { step: 2, label: 'Profile' },
                  { step: 3, label: 'Entity' },
                  { step: 4, label: 'Modules' },
                  { step: 5, label: 'Review' },
                ].map((s) => {
                  const isDone = currentStep > s.step;
                  const isActive = currentStep === s.step;
                  return (
                    <div
                      key={s.step}
                      className={`step-item ${isDone ? 'step-completed' : ''} ${isActive ? 'step-active' : ''}`}
                    >
                      <div className="step-circle">
                        {isDone ? <Icons.Check /> : s.step}
                      </div>
                      <span className="step-label">{s.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Error Banner */}
            {errorMsg && (
              <div className="auth-error-banner" role="alert" style={{ marginBottom: '20px' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <span>{errorMsg}</span>
              </div>
            )}

            {/* =========================================================================
                STEP 1: BUSINESS TYPE PRESET
                ========================================================================= */}
            {currentStep === 1 && (
              <div className="onboarding-card animate-fade-up">
                <div className="step-heading">
                  <span className="step-badge">Step 1 of 5</span>
                  <h2>Tell us about your organization</h2>
                  <p>What type of organization do you run? This helps us customize your VIFEmS workspace.</p>
                </div>

                <div className="form-field-group" style={{ marginBottom: '0' }}>
                  <label htmlFor="orgTypeSelect">
                    What type of organization do you run? <span className="req">*</span>
                  </label>
                  <div className="org-type-select-wrapper">
                    <select
                      id="orgTypeSelect"
                      className={`org-type-select${orgTypeError ? ' has-error' : ''}`}
                      value={organizationType}
                      onChange={(e) => handleOrgTypeChange(e.target.value)}
                    >
                      <option value="">Select organization type</option>
                      <option value="school">School / Educational Institution</option>
                      <option value="training">Training / Coaching</option>
                      <option value="business">Business / Company</option>
                      <option value="retail">Retail / E-commerce</option>
                      <option value="healthcare">Healthcare / Medical</option>
                      <option value="hospitality">Restaurant / Hospitality</option>
                      <option value="professional_services">Professional Services</option>
                      <option value="nonprofit">Nonprofit / NGO</option>
                      <option value="custom">Other / Custom Organization</option>
                    </select>
                  </div>

                  {/* Reveal custom input when "Other" is selected */}
                  {organizationType === 'custom' && (
                    <div className="org-type-custom-reveal">
                      <label htmlFor="customOrgType" style={{ fontSize: '13.5px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '7px' }}>
                        Tell us what type of organization you run <span className="req">*</span>
                      </label>
                      <input
                        id="customOrgType"
                        type="text"
                        placeholder="e.g. Gym, Church, Logistics Company..."
                        value={customOrganizationType}
                        onChange={(e) => { setCustomOrganizationType(e.target.value); if (orgTypeError) setOrgTypeError(null); }}
                        style={{
                          width: '100%',
                          padding: '11px 14px',
                          border: `1.5px solid ${orgTypeError ? '#ef4444' : '#e2e8f0'}`,
                          borderRadius: '10px',
                          fontSize: '14px',
                          color: '#0f172a',
                          outline: 'none',
                        }}
                        onFocus={(e) => { e.target.style.borderColor = '#2563eb'; e.target.style.boxShadow = '0 0 0 3px rgba(37,99,235,0.1)'; }}
                        onBlur={(e) => { e.target.style.boxShadow = ''; if (!orgTypeError) e.target.style.borderColor = '#e2e8f0'; }}
                      />
                    </div>
                  )}

                  {orgTypeError && (
                    <p className="org-type-field-error">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                      </svg>
                      {orgTypeError}
                    </p>
                  )}
                </div>

                <div className="step-actions right-align" style={{ marginTop: '32px' }}>
                  <button type="button" className="btn-onboarding-next" onClick={handleStep1Submit} disabled={isSubmitting}>
                    {isSubmitting ? 'Saving...' : 'Continue to Organization Profile →'}
                  </button>
                </div>
              </div>
            )}

            {/* =========================================================================
                STEP 2: BUSINESS INFORMATION
                ========================================================================= */}
            {currentStep === 2 && (
              <div className="onboarding-card animate-fade-up">
                <div className="step-heading">
                  <span className="step-badge">Step 2 of 5</span>
                  <h2>Organization & Workspace Profile</h2>
                  <p>Configure your workspace details, official contact info, and regional currency settings.</p>
                </div>

                <form onSubmit={handleStep2Submit} noValidate>
                  <div className="form-grid-2">
                    <div className="form-field-group">
                      <label htmlFor="bizName">
                        Organization / Business Name <span className="req">*</span>
                      </label>
                      <input
                        type="text"
                        id="bizName"
                        placeholder="e.g. Victor Training Academy"
                        value={businessInfo.name}
                        onChange={(e) => {
                          setBusinessInfo({ ...businessInfo, name: e.target.value });
                          if (errorMsg) setErrorMsg(null);
                        }}
                        required
                      />
                    </div>

                    <div className="form-field-group">
                      <label htmlFor="bizEmail">
                        Work / Official Email <span className="req">*</span>
                      </label>
                      <input
                        type="email"
                        id="bizEmail"
                        placeholder="e.g. info@vifems.com"
                        value={businessInfo.email}
                        onChange={(e) => {
                          setBusinessInfo({ ...businessInfo, email: e.target.value });
                          if (errorMsg) setErrorMsg(null);
                        }}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-grid-2">
                    <div className="form-field-group">
                      <label htmlFor="bizPhone">Contact Phone Number</label>
                      <input
                        type="tel"
                        id="bizPhone"
                        placeholder="e.g. +2348000000000"
                        value={businessInfo.phone}
                        onChange={(e) => setBusinessInfo({ ...businessInfo, phone: e.target.value })}
                      />
                    </div>

                    <div className="form-field-group">
                      <label htmlFor="bizWebsite">Official Website</label>
                      <input
                        type="url"
                        id="bizWebsite"
                        placeholder="e.g. https://vifems.com"
                        value={businessInfo.website}
                        onChange={(e) => setBusinessInfo({ ...businessInfo, website: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="form-field-group">
                    <label htmlFor="bizAddress">Office / Operating Address</label>
                    <input
                      type="text"
                      id="bizAddress"
                      placeholder="e.g. 123 Business Way, Victoria Island"
                      value={businessInfo.address}
                      onChange={(e) => setBusinessInfo({ ...businessInfo, address: e.target.value })}
                    />
                  </div>

                  <div className="form-grid-4">
                    <div className="form-field-group">
                      <label htmlFor="bizCountry">Country</label>
                      <select
                        id="bizCountry"
                        value={businessInfo.country}
                        onChange={(e) => setBusinessInfo({ ...businessInfo, country: e.target.value })}
                      >
                        <option value="Nigeria">Nigeria</option>
                        <option value="Ghana">Ghana</option>
                        <option value="Kenya">Kenya</option>
                        <option value="South Africa">South Africa</option>
                        <option value="United Kingdom">United Kingdom</option>
                        <option value="United States">United States</option>
                        <option value="Canada">Canada</option>
                      </select>
                    </div>

                    <div className="form-field-group">
                      <label htmlFor="bizState">State / Region</label>
                      <input
                        type="text"
                        id="bizState"
                        placeholder="e.g. Lagos"
                        value={businessInfo.state}
                        onChange={(e) => setBusinessInfo({ ...businessInfo, state: e.target.value })}
                      />
                    </div>

                    <div className="form-field-group">
                      <label htmlFor="bizCurrency">Base Currency</label>
                      <select
                        id="bizCurrency"
                        value={businessInfo.currency}
                        onChange={(e) => setBusinessInfo({ ...businessInfo, currency: e.target.value })}
                      >
                        <option value="NGN">NGN (₦)</option>
                        <option value="USD">USD ($)</option>
                        <option value="GBP">GBP (£)</option>
                        <option value="EUR">EUR (€)</option>
                        <option value="GHS">GHS (₵)</option>
                        <option value="KES">KES (KSh)</option>
                      </select>
                    </div>

                    <div className="form-field-group">
                      <label htmlFor="bizTimeZone">Time Zone</label>
                      <select
                        id="bizTimeZone"
                        value={businessInfo.timeZone}
                        onChange={(e) => setBusinessInfo({ ...businessInfo, timeZone: e.target.value })}
                      >
                        <option value="Africa/Lagos">Africa/Lagos (WAT, UTC+1)</option>
                        <option value="Africa/Accra">Africa/Accra (GMT, UTC+0)</option>
                        <option value="Africa/Nairobi">Africa/Nairobi (EAT, UTC+3)</option>
                        <option value="Europe/London">Europe/London (GMT/BST)</option>
                        <option value="America/New_York">America/New_York (EST)</option>
                        <option value="UTC">UTC</option>
                      </select>
                    </div>
                  </div>

                  <div className="step-actions split-between" style={{ marginTop: '24px' }}>
                    <button type="button" className="btn-onboarding-back" onClick={() => setCurrentStep(1)}>
                      ← Back
                    </button>
                    <button type="submit" className="btn-onboarding-next" disabled={isSubmitting}>
                      {isSubmitting ? 'Saving Profile...' : 'Continue to Entity Configuration →'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* =========================================================================
                STEP 3: GENERIC ENTITY CONFIGURATION
                ========================================================================= */}
            {currentStep === 3 && (
              <div className="onboarding-card animate-fade-up">
                <div className="step-heading">
                  <span className="step-badge">Step 3 of 5</span>
                  <h2>Configure Your Primary Business Record</h2>
                  <p>
                    VIFEmS does not hard-code "Customer". Configure how your organization refers to its main records (e.g. Participant, Client, Student) and select data fields to capture.
                  </p>
                </div>

                <div className="form-grid-2" style={{ marginBottom: '20px' }}>
                  <div className="form-field-group">
                    <label htmlFor="entitySingular">
                      Singular Terminology <span className="req">*</span>
                    </label>
                    <input
                      type="text"
                      id="entitySingular"
                      placeholder="e.g. Participant, Client, Student"
                      value={entityConfig.entityLabel}
                      onChange={(e) => setEntityConfig({ ...entityConfig, entityLabel: e.target.value })}
                    />
                  </div>

                  <div className="form-field-group">
                    <label htmlFor="entityPlural">
                      Plural Terminology
                    </label>
                    <input
                      type="text"
                      id="entityPlural"
                      placeholder="e.g. Participants, Clients, Students"
                      value={entityConfig.entityLabelPlural}
                      onChange={(e) => setEntityConfig({ ...entityConfig, entityLabelPlural: e.target.value })}
                    />
                  </div>
                </div>

                <div className="customer-fields-config-box">
                  <div className="customer-fields-header">
                    <h4>{entityConfig.entityLabel || 'Record'} Data Fields</h4>
                    <span style={{ fontSize: '12px', color: '#64748b' }}>
                      Click any field pill to toggle on/off
                    </span>
                  </div>

                  <div className="customer-fields-grid">
                    {entityConfig.fields.map((field) => (
                      <div
                        key={field.key}
                        className={`field-pill-card ${field.enabled ? 'active' : ''}`}
                        onClick={() => handleToggleField(field.key)}
                      >
                        <input
                          type="checkbox"
                          checked={field.enabled}
                          onChange={() => {}}
                          style={{ cursor: 'pointer' }}
                        />
                        <span className="field-pill-label">{field.label}</span>
                        <span className="field-pill-type">{field.type}</span>
                        {field.required && (
                          <span style={{ color: '#dc2626', fontSize: '11px', fontWeight: 700 }}>*</span>
                        )}
                        {!['fullName', 'email'].includes(field.key) && (
                          <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); handleRemoveField(field.key); }}
                            style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 2 }}
                            title="Remove field"
                          >
                            ×
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="add-custom-field-row">
                    <input
                      type="text"
                      placeholder="Add custom field (e.g. Sponsor Name, Graduation Cohort)..."
                      value={newFieldLabel}
                      onChange={(e) => setNewFieldLabel(e.target.value)}
                      style={{ flex: 1, padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '13px' }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddField();
                        }
                      }}
                    />
                    <select
                      value={newFieldType}
                      onChange={(e) => setNewFieldType(e.target.value as any)}
                      style={{ padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '13px' }}
                    >
                      <option value="text">Text</option>
                      <option value="number">Number</option>
                      <option value="email">Email</option>
                      <option value="phone">Phone</option>
                      <option value="date">Date</option>
                      <option value="select">Dropdown</option>
                      <option value="boolean">Yes/No</option>
                      <option value="file">File Upload</option>
                      <option value="image">Image Upload</option>
                    </select>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#475569' }}>
                      <input
                        type="checkbox"
                        checked={newFieldRequired}
                        onChange={(e) => setNewFieldRequired(e.target.checked)}
                      />
                      Required
                    </label>
                    <button type="button" className="btn-add-custom-field" onClick={handleAddField}>
                      + Add Field
                    </button>
                  </div>
                </div>

                <div className="step-actions split-between" style={{ marginTop: '24px' }}>
                  <button type="button" className="btn-onboarding-back" onClick={() => setCurrentStep(2)}>
                    ← Back
                  </button>
                  <button type="button" className="btn-onboarding-next" onClick={handleStep3Submit} disabled={isSubmitting}>
                    {isSubmitting ? 'Saving...' : 'Continue to Modules Selection →'}
                  </button>
                </div>
              </div>
            )}

            {/* =========================================================================
                STEP 4: DYNAMIC ORG-TYPE MODULES SELECTION
                ========================================================================= */}
            {currentStep === 4 && (
              <div className="onboarding-card animate-fade-up">
                <div className="step-heading">
                  <span className="step-badge">Step 4 of 5</span>
                  <h2>Customize your workspace</h2>
                  <p>
                    We’ve selected the essential features that fit your organization. Choose any additional optional features you want to use.
                  </p>
                </div>

                {/* Section 1: Core / Included Modules */}
                <div className="module-group-section">
                  <div className="module-group-header">
                    <div>
                      <h3 className="module-group-title">
                        Core modules
                        <span className="core-badge">Included</span>
                      </h3>
                      <p className="module-group-subtitle">
                        These fundamental modules are automatically included and enabled for your workspace.
                      </p>
                    </div>
                  </div>

                  <div className="modules-selection-grid">
                    {currentOrgCatalog.core.map((mod) => (
                      <div
                        key={mod.key}
                        className="module-item-card core-included"
                        title="Core module included automatically"
                      >
                        <div className="module-item-left">
                          <div className="module-item-icon core-icon">{getModuleIcon(mod.key)}</div>
                          <div className="module-info-left">
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <h4>{mod.name}</h4>
                              <span className="module-category-pill">{mod.category}</span>
                            </div>
                            <p>{mod.description}</p>
                          </div>
                        </div>

                        <div className="core-locked-pill">
                          <Icons.Check />
                          <span>Included</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Section 2: Optional Modules */}
                {currentOrgCatalog.optional.length > 0 && (
                  <div className="module-group-section" style={{ marginTop: '28px' }}>
                    <div className="module-group-header">
                      <div>
                        <h3 className="module-group-title">Optional modules</h3>
                        <p className="module-group-subtitle">
                          Enable additional features tailored to your operations. You can always change these later in Dashboard Settings.
                        </p>
                      </div>
                    </div>

                    <div className="modules-selection-grid">
                      {currentOrgCatalog.optional.map((mod) => {
                        const isEnabled = !!moduleStates[mod.key];
                        const dependencies: Record<string, string[]> = {
                          'RESULTS': ['Subjects'],
                          'ATTENDANCE': ['Students', 'Classes'],
                          'FEES': ['Students'],
                        };
                        const deps = dependencies[mod.key];

                        return (
                          <div
                            key={mod.key}
                            className={`module-item-card ${isEnabled ? 'enabled' : ''}`}
                            onClick={() => setModuleStates({ ...moduleStates, [mod.key]: !isEnabled })}
                          >
                            <div className="module-item-left">
                              <div className="module-item-icon">{getModuleIcon(mod.key)}</div>
                              <div className="module-info-left">
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                  <h4>{mod.name}</h4>
                                  <span className="module-category-pill">{mod.category}</span>
                                </div>
                                <p>{mod.description}</p>
                                {deps && (
                                  <p style={{ fontSize: '11px', color: '#64748b', marginTop: '4px', fontStyle: 'italic' }}>
                                    <Icons.Plus /> Requires: {deps.join(', ')} (auto-enabled)
                                  </p>
                                )}
                              </div>
                            </div>

                            <label className="module-toggle" onClick={(e) => e.stopPropagation()}>
                              <input
                                type="checkbox"
                                checked={isEnabled}
                                onChange={() => setModuleStates({ ...moduleStates, [mod.key]: !isEnabled })}
                              />
                              <span className="toggle-slider" />
                            </label>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div className="step-actions split-between" style={{ marginTop: '28px' }}>
                  <button type="button" className="btn-onboarding-back" onClick={() => setCurrentStep(3)}>
                    ← Back
                  </button>
                  <button type="button" className="btn-onboarding-next" onClick={handleStep4Submit} disabled={isSubmitting}>
                    {isSubmitting ? 'Saving...' : `Review & Activate (${enabledModuleCount} Enabled) →`}
                  </button>
                </div>
              </div>
            )}

            {/* =========================================================================
                STEP 5: REVIEW & WORKSPACE PREVIEW
                ========================================================================= */}
            {currentStep === 5 && (
              <div className="onboarding-card animate-fade-up">
                <div className="step-heading">
                  <span className="step-badge">Step 5 of 5</span>
                  <h2>Review Your VIFEmS Workspace</h2>
                  <p>Verify your workspace configuration before final activation. You can change modules and settings at any time.</p>
                </div>

                <div className="summary-cards-grid">
                  <div className="summary-card">
                    <span className="summary-title">Workspace Profile</span>
                    <h3>{businessInfo.name || 'Organization Workspace'}</h3>
                    <p>{businessInfo.email || 'info@vifems.com'}</p>
                    <p>{businessInfo.phone || 'No phone set'} · {businessInfo.country} ({businessInfo.currency})</p>
                    <span className="summary-pill">{organizationType ? organizationType.toUpperCase().replace('_', ' ') : currentPreset.label}</span>
                  </div>

                  <div className="summary-card">
                    <span className="summary-title">Configured Primary Entity</span>
                    <h3>{entityConfig.entityLabel || 'Participant'}</h3>
                    <p>Plural Label: <strong>{entityConfig.entityLabelPlural || 'Participants'}</strong></p>
                    <p>Active Fields: <strong>{entityConfig.fields.filter((f) => f.enabled).length} fields configured</strong></p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '8px' }}>
                      {entityConfig.fields.filter((f) => f.enabled).slice(0, 5).map((f) => (
                        <span key={f.key} style={{ fontSize: '11px', background: '#e2e8f0', padding: '2px 6px', borderRadius: '4px', color: '#334155' }}>
                          ✓ {f.label}
                        </span>
                      ))}
                      {entityConfig.fields.filter((f) => f.enabled).length > 5 && (
                        <span style={{ fontSize: '11px', color: '#64748b' }}>
                          +{entityConfig.fields.filter((f) => f.enabled).length - 5} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '18px', marginBottom: '24px' }}>
                  <h4 style={{ margin: '0 0 10px 0', fontSize: '14px', fontWeight: 700, color: '#1e3a8a' }}>
                    Active Workspace Modules ({enabledModuleCount})
                  </h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '8px' }}>
                    {/* Render Core Modules */}
                    {currentOrgCatalog.core.map((mod) => (
                      <div key={mod.key} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12.5px', color: '#0f172a', fontWeight: 600 }}>
                        <span style={{ color: '#16a34a' }}>✓</span>
                        <span>{mod.name}</span>
                        <span style={{ fontSize: '10px', background: '#dcfce7', color: '#15803d', padding: '1px 5px', borderRadius: '3px', fontWeight: 700 }}>
                          Core
                        </span>
                      </div>
                    ))}
                    {/* Render Enabled Optional Modules */}
                    {currentOrgCatalog.optional
                      .filter((mod) => !!moduleStates[mod.key])
                      .map((mod) => (
                        <div key={mod.key} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12.5px', color: '#0f172a', fontWeight: 600 }}>
                          <span style={{ color: '#2563eb' }}>✓</span>
                          <span>{mod.name}</span>
                          <span style={{ fontSize: '10px', background: '#eff6ff', color: '#2563eb', padding: '1px 5px', borderRadius: '3px', fontWeight: 600 }}>
                            Optional
                          </span>
                        </div>
                      ))}
                  </div>
                </div>

                <div className="step-actions split-between">
                  <button type="button" className="btn-onboarding-back" onClick={() => setCurrentStep(4)}>
                    ← Back to Modules
                  </button>
                  <button
                    type="button"
                    className="btn-onboarding-next"
                    onClick={handleFinalComplete}
                    disabled={isSubmitting}
                    style={{ padding: '14px 32px', fontSize: '15px' }}
                  >
                    {isSubmitting ? 'Activating Workspace...' : 'Complete Setup & Activate Workspace →'}
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
