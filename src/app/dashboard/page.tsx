'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// School Panels
import SchoolOverview from './school/SchoolOverview';
import StudentsPanel from './school/StudentsPanel';
import ClassesPanel from './school/ClassesPanel';
import AcademicSessionsPanel from './school/AcademicSessionsPanel';
import SubjectsPanel from './school/SubjectsPanel';
import AttendancePanel from './school/AttendancePanel';
import ResultsPanel from './school/ResultsPanel';
import SchoolStaffPanel from './school/SchoolStaffPanel';
import FeesPanel from './school/FeesPanel';
import LibraryPanel from './school/LibraryPanel';

import { workspaceService } from '@/services/workspace.service';
import { operationsService } from '@/services/operations.service';
import { registrationService } from '@/services/registration.service';
import { refIdService } from '@/services/refid.service';
import { trainingService } from '@/services/training.service';
import { tokenStorage } from '@/lib/api';
import { EntityConfig, BUSINESS_TYPE_PRESETS } from '@/lib/moduleCatalog';
import { getOrgModuleCatalog, ALL_MODULE_METADATA } from '@/lib/orgModuleCatalog';
import { onboardingService } from '@/services/onboarding.service';
import {
  Workspace,
  DashboardStats,
  Participant,
  RegistrationLink,
  RegistrationSubmission,
  RefIdConfig,
  FormField,
  TrainingBatch,
  TrainingPayment,
  TrainingReceipt,
  TrainingCertificate,
  ParticipantPaymentSummary,
} from '@/types/workspace';
import {
  TaskItem,
  TaskPriority,
  TaskStatus,
  CustomerItem,
  StaffItem,
  TransactionItem,
  InvoiceItem,
  NotificationItem,
  SearchResult,
  FinanceSummary,
  RolePermissions,
} from '@/types/operations';
import './dashboard.css';

// SVG Vector Icons Component Library (100% Emoji-free)
const Icons = {
  Building: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
      <path d="M9 22v-4h6v4" />
      <path d="M8 6h.01M16 6h.01M8 10h.01M16 10h.01M8 14h.01M16 14h.01" />
    </svg>
  ),
  Grid: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
    </svg>
  ),
  CheckSquare: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 11 12 14 22 4" />
      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
    </svg>
  ),
  Users: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  UserCheck: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="8.5" cy="7" r="4" />
      <polyline points="17 11 19 13 23 9" />
    </svg>
  ),
  DollarSign: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="1" x2="12" y2="23" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  ),
  FileText: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  ),
  BarChart: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="20" x2="12" y2="10" />
      <line x1="18" y1="20" x2="18" y2="4" />
      <line x1="6" y1="20" x2="6" y2="16" />
    </svg>
  ),
  Bell: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  ),
  Settings: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  ),
  HelpCircle: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  ),
  Plus: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  ),
  Search: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  ),
  Trash: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
  ),
  Menu: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  ),
  Close: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
  Printer: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 6 2 18 2 18 9" />
      <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
      <rect x="6" y="14" width="12" height="8" />
    </svg>
  ),
  ChevronDown: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  ),
  ChevronRight: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  ),
  LogOut: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  ),
  Phone: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  ),
  Mail: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  ),
  Link: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  ),
  Share: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
    </svg>
  ),
  Copy: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  ),
  Hash: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="4" y1="9" x2="20" y2="9" />
      <line x1="4" y1="15" x2="20" y2="15" />
      <line x1="10" y1="3" x2="8" y2="21" />
      <line x1="16" y1="3" x2="14" y2="21" />
    </svg>
  ),
  ExternalLink: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  ),
  QrCode: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
    </svg>
  ),
  CheckCircle: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  ),
  XCircle: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="15" y1="9" x2="9" y2="15" />
      <line x1="9" y1="9" x2="15" y2="15" />
    </svg>
  ),
  MessageCircle: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </svg>
  ),
  GraduationCap: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
      <path d="M6 12v5c3 3 9 3 12 0v-5" />
    </svg>
  ),
  BookOpen: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  ),
  Clock: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  Layers: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 2 7 12 12 22 7 12 2" />
      <polyline points="2 17 12 22 22 17" />
      <polyline points="2 12 12 17 22 12" />
    </svg>
  ),
  Package: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="16.5" y1="9.4" x2="7.5" y2="4.21" />
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
      <line x1="12" y1="22.08" x2="12" y2="12" />
    </svg>
  ),
  ShoppingBag: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
      <path d="M3 6h18" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  ),
  Award: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="7" />
      <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
    </svg>
  ),
  Heart: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  ),
  Tag: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
      <line x1="7" y1="7" x2="7.01" y2="7" />
    </svg>
  ),
  TrendingUp: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  ),
  Compass: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
    </svg>
  ),
};

export default function ComprehensiveDashboardPage() {
  const router = useRouter();

  // Active Navigation
  const [activeNav, setActiveNav] = useState<string>('OVERVIEW');
  const [participantSubTab, setParticipantSubTab] = useState<'ALL' | 'LINKS' | 'PENDING'>('ALL');
  const [settingsTab, setSettingsTab] = useState<'ORG' | 'MODULES' | 'REF_IDS' | 'PROFILE' | 'ROLES' | 'NOTIFS'>('ORG');

  // Module Configuration in Settings
  const [moduleSettingStates, setModuleSettingStates] = useState<Record<string, boolean>>({});
  const [isSavingModules, setIsSavingModules] = useState<boolean>(false);
  const [moduleSuccessMsg, setModuleSuccessMsg] = useState<string | null>(null);

  // Loading & Error States
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [apiError, setApiError] = useState<string | null>(null);

  // Core Data States
  const [dashboardData, setDashboardData] = useState<DashboardStats | null>(null);
  const [entityConfig, setEntityConfig] = useState<EntityConfig>(
    BUSINESS_TYPE_PRESETS.TRAINING.defaultEntityConfig
  );
  const [enabledModules, setEnabledModules] = useState<string[]>([
    'PARTICIPANTS', 'TRAINING', 'ATTENDANCE', 'PAYMENTS', 'STAFF', 'REPORTS',
  ]);

  // Operational Datasets
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [staff, setStaff] = useState<StaffItem[]>([]);
  const [finance, setFinance] = useState<{ summary: FinanceSummary; recentTransactions: TransactionItem[] } | null>(null);
  const [invoices, setInvoices] = useState<InvoiceItem[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadNotifCount, setUnreadNotifCount] = useState<number>(0);

  // Self-Registration & Ref ID Data States
  const [registrationLinks, setRegistrationLinks] = useState<RegistrationLink[]>([]);
  const [pendingSubmissions, setPendingSubmissions] = useState<RegistrationSubmission[]>([]);
  const [refIdConfig, setRefIdConfig] = useState<RefIdConfig | null>(null);

  // Active Entity Detail View
  const [activeEntityRecord, setActiveEntityRecord] = useState<Participant | null>(null);

  // Filters & Search
  const [taskStatusFilter, setTaskStatusFilter] = useState<string>('ALL');
  const [taskSearch, setTaskSearch] = useState<string>('');
  const [recordSearch, setRecordSearch] = useState<string>('');

  // Modals & UI Toggles
  const [showQuickMenu, setShowQuickMenu] = useState<boolean>(false);
  const [showNotifPopover, setShowNotifPopover] = useState<boolean>(false);
  const [showSearchModal, setShowSearchModal] = useState<boolean>(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState<boolean>(false);

  useEffect(() => {
    if (!mobileSidebarOpen) return;
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setMobileSidebarOpen(false); };
    const handleResize = () => { if (window.innerWidth > 860) setMobileSidebarOpen(false); };
    document.addEventListener('keydown', handleKey);
    window.addEventListener('resize', handleResize);
    return () => {
      document.removeEventListener('keydown', handleKey);
      window.removeEventListener('resize', handleResize);
    };
  }, [mobileSidebarOpen]);
  const [globalSearchTerm, setGlobalSearchTerm] = useState<string>('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);

  const [showTaskModal, setShowTaskModal] = useState<boolean>(false);
  const [showEntityModal, setShowEntityModal] = useState<boolean>(false);
  const [showAddChoiceModal, setShowAddChoiceModal] = useState<boolean>(false);
  const [showCreateLinkModal, setShowCreateLinkModal] = useState<boolean>(false);
  const [showShareModal, setShowShareModal] = useState<boolean>(false);
  const [selectedLinkForShare, setSelectedLinkForShare] = useState<RegistrationLink | null>(null);
  const [showRejectModal, setShowRejectModal] = useState<boolean>(false);
  const [selectedSubmissionForReject, setSelectedSubmissionForReject] = useState<RegistrationSubmission | null>(null);
  const [rejectReason, setRejectReason] = useState<string>('');
  const [copyFeedback, setCopyFeedback] = useState<boolean>(false);

  const [showInvoiceModal, setShowInvoiceModal] = useState<boolean>(false);
  const [showStaffModal, setShowStaffModal] = useState<boolean>(false);
  const [showTxModal, setShowTxModal] = useState<boolean>(false);

  // Form States for CRUD
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDesc, setTaskDesc] = useState('');
  const [taskPriority, setTaskPriority] = useState<TaskPriority>('MEDIUM');
  const [taskDueDate, setTaskDueDate] = useState('');
  const [taskAssignee, setTaskAssignee] = useState('');

  const [recordFullName, setRecordFullName] = useState('');
  const [recordEmail, setRecordEmail] = useState('');
  const [recordPhone, setRecordPhone] = useState('');
  const [recordMetadata, setRecordMetadata] = useState<Record<string, any>>({});

  // Registration Link Creation Form & Interactive Form Builder
  const [linkName, setLinkName] = useState('');
  const [linkProgram, setLinkProgram] = useState('');
  const [linkDesc, setLinkDesc] = useState('');
  const [linkDeadline, setLinkDeadline] = useState('');
  const [linkMaxParticipants, setLinkMaxParticipants] = useState('');
  const [linkRequireApproval, setLinkRequireApproval] = useState(true);
  const [linkModalStep, setLinkModalStep] = useState<1 | 2>(1);
  const [builderTab, setBuilderTab] = useState<'FIELDS' | 'PREVIEW'>('FIELDS');
  const [builderFields, setBuilderFields] = useState<FormField[]>([
    { id: 'f_fullname', key: 'fullName', label: 'Full Name', type: 'text', required: true, isSystem: true },
    { id: 'f_email', key: 'email', label: 'Email Address', type: 'email', required: true, isSystem: true },
    { id: 'f_phone', key: 'phone', label: 'Phone Number', type: 'tel', required: true },
    { id: 'f_dob', key: 'dob', label: 'Date of Birth', type: 'date', required: false },
    { id: 'f_address', key: 'address', label: 'Address', type: 'textarea', required: false },
  ]);
  const [isCreatingLink, setIsCreatingLink] = useState(false);
  const [isApproving, setIsApproving] = useState<string | null>(null);

  // Reference ID Form
  const [refPrefix, setRefPrefix] = useState('');
  const [refSeparator, setRefSeparator] = useState('');
  const [refPadding, setRefPadding] = useState(3);
  const [refStartingNumber, setRefStartingNumber] = useState(1);
  const [refUseYear, setRefUseYear] = useState(false);
  const [isSavingRefId, setIsSavingRefId] = useState(false);
  const [refIdSuccessMsg, setRefIdSuccessMsg] = useState<string | null>(null);
  const [moduleSearch, setModuleSearch] = useState<string>('');

  const [staffEmail, setStaffEmail] = useState('');
  const [staffRole, setStaffRole] = useState<'ADMIN' | 'MEMBER'>('MEMBER');
  const [staffDept, setStaffDept] = useState('Operations');

  const [txType, setTxType] = useState<'INCOME' | 'EXPENSE'>('INCOME');
  const [txAmount, setTxAmount] = useState<number>(0);
  const [txDesc, setTxDesc] = useState('');
  const [txCategory, setTxCategory] = useState('Operations');

  const [invCustName, setInvCustName] = useState('');
  const [invCustEmail, setInvCustEmail] = useState('');
  const [invAmount, setInvAmount] = useState<number>(0);
  const [invItemDesc, setInvItemDesc] = useState('');

  // Training-specific state
  const [trainingBatches, setTrainingBatches] = useState<TrainingBatch[]>([]);
  const [trainingPayments, setTrainingPayments] = useState<TrainingPayment[]>([]);
  const [trainingReceipts, setTrainingReceipts] = useState<TrainingReceipt[]>([]);
  const [trainingCertificates, setTrainingCertificates] = useState<TrainingCertificate[]>([]);
  const [trainingDashboard, setTrainingDashboard] = useState<any>(null);
  const [selectedParticipantSummary, setSelectedParticipantSummary] = useState<ParticipantPaymentSummary | null>(null);
  const [showParticipantDetailDrawer, setShowParticipantDetailDrawer] = useState<boolean>(false);

  const [showBatchModal, setShowBatchModal] = useState<boolean>(false);
  const [showPaymentModal, setShowPaymentModal] = useState<boolean>(false);
  const [showReceiptModal, setShowReceiptModal] = useState<TrainingReceipt | null>(null);
  const [showCertificateModal, setShowCertificateModal] = useState<any>(null);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState<boolean>(false);
  const [editingBatch, setEditingBatch] = useState<TrainingBatch | null>(null);

  // Training batch form
  const [batchName, setBatchName] = useState('');
  const [batchProgram, setBatchProgram] = useState('');
  const [batchDesc, setBatchDesc] = useState('');
  const [batchStartDate, setBatchStartDate] = useState('');
  const [batchEndDate, setBatchEndDate] = useState('');
  const [batchStatus, setBatchStatus] = useState('UPCOMING');

  // Training payment form
  const [paymentParticipantId, setPaymentParticipantId] = useState('');
  const [paymentBatchId, setPaymentBatchId] = useState('');
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentFor, setPaymentFor] = useState('TRAINING_FEE');
  const [paymentDate, setPaymentDate] = useState('');
  const [paymentNotes, setPaymentNotes] = useState('');
  const [isSubmittingPayment, setIsSubmittingPayment] = useState(false);
  const [isSubmittingBatch, setIsSubmittingBatch] = useState(false);
  const [isCreatingParticipant, setIsCreatingParticipant] = useState(false);
  const [isDeletingParticipant, setIsDeletingParticipant] = useState<string | null>(null);
  const [isDeletingBatch, setIsDeletingBatch] = useState<string | null>(null);
  const [isDeletingPayment, setIsDeletingPayment] = useState<string | null>(null);
  const [isIssuingCertificate, setIsIssuingCertificate] = useState<string | null>(null);
  const [isRejectingSubmission, setIsRejectingSubmission] = useState(false);

  // Training participant form extra fields
  const [recordBatchId, setRecordBatchId] = useState('');
  const [recordApplicationFee, setRecordApplicationFee] = useState('');
  const [recordTrainingFee, setRecordTrainingFee] = useState('');

  // Training sub-tabs
  const [batchFilter, setBatchFilter] = useState('ALL');
  const [paymentBatchFilter, setPaymentBatchFilter] = useState('ALL');
  const [certBatchFilter, setCertBatchFilter] = useState('ALL');
  const [certStatusFilter, setCertStatusFilter] = useState('ALL');
  const [receiptSearch, setReceiptSearch] = useState('');
  const [certDesignerTab, setCertDesignerTab] = useState<'ISSUE' | 'DESIGN'>('ISSUE');
  const [receiptBatchFilter, setReceiptBatchFilter] = useState('ALL');
  const [receiptDateFrom, setReceiptDateFrom] = useState('');
  const [receiptDateTo, setReceiptDateTo] = useState('');

  // Certificate Template Designer state
  const [certTemplate, setCertTemplate] = useState({
    title: 'Certificate of Completion',
    subtitle: 'This is to certify that',
    bodyText: 'has successfully completed the training program and demonstrated proficiency in all required competencies.',
    footerText: 'Issued with distinction by',
    bgColor: '#ffffff',
    accentColor: '#1e3a8a',
    textColor: '#1e293b',
    fontFamily: 'Georgia, serif',
    logoUrl: '',
    signatureUrl: '',
    signatureDataUrl: '',
    participantImageField: 'photoUrl',
    borderStyle: 'double',
  });
  const [isSavingCertTemplate, setIsSavingCertTemplate] = useState(false);
  const sigCanvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const [sigIsDrawing, setSigIsDrawing] = React.useState(false);
  const [showSignatureModal, setShowSignatureModal] = useState(false);

  const extractParticipantPhoto = (participant: Participant | undefined): string => {
    if (!participant) return '';
    const meta = participant.metadata as Record<string, any> | undefined;
    if (meta) {
      if (certTemplate.participantImageField && meta[certTemplate.participantImageField]) {
        return meta[certTemplate.participantImageField];
      }
      for (const key of ['photoUrl', 'participantImage', 'photo', 'passport', 'image', 'avatar']) {
        if (meta[key] && typeof meta[key] === 'string') return meta[key];
      }
      for (const v of Object.values(meta)) {
        if (typeof v === 'string' && v.startsWith('data:image')) return v;
      }
    }
    return participant.photoUrl || '';
  };

  const handleSigDraw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = e.currentTarget;
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const scale = canvas.width / canvas.offsetWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = 2 * scale;
    ctx.strokeStyle = '#000';
    ctx.lineTo((e.clientX - rect.left) * scale, (e.clientY - rect.top) * scale);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo((e.clientX - rect.left) * scale, (e.clientY - rect.top) * scale);
  };

  const handleSigTouchDraw = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (!sigCanvasRef.current || !sigIsDrawing) return;
    const canvas = sigCanvasRef.current;
    const touch = e.touches[0];
    if (!touch) return;
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const scale = canvas.width / canvas.offsetWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = 2 * scale;
    ctx.strokeStyle = '#000';
    ctx.lineTo((touch.clientX - rect.left) * scale, (touch.clientY - rect.top) * scale);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo((touch.clientX - rect.left) * scale, (touch.clientY - rect.top) * scale);
  };

  const handleSigStart = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = e.currentTarget;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const scale = canvas.width / canvas.offsetWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = 2 * scale;
    ctx.strokeStyle = '#000';
    ctx.beginPath();
    ctx.moveTo((e.clientX - rect.left) * scale, (e.clientY - rect.top) * scale);
    setSigIsDrawing(true);
  };

  const handleSigTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (!sigCanvasRef.current) return;
    const touch = e.touches[0];
    if (!touch) return;
    const canvas = sigCanvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const scale = canvas.width / canvas.offsetWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = 2 * scale;
    ctx.strokeStyle = '#000';
    ctx.beginPath();
    ctx.moveTo((touch.clientX - rect.left) * scale, (touch.clientY - rect.top) * scale);
    setSigIsDrawing(true);
  };

  const handleSigEnd = () => {
    setSigIsDrawing(false);
    if (sigCanvasRef.current) {
      setCertTemplate({ ...certTemplate, signatureDataUrl: sigCanvasRef.current.toDataURL('image/png') });
    }
  };

  const clearSignatureCanvas = () => {
    const canvas = sigCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setCertTemplate({ ...certTemplate, signatureDataUrl: '' });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, field: 'logoUrl') => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setCertTemplate({ ...certTemplate, [field]: ev.target?.result as string });
    };
    reader.readAsDataURL(file);
  };

  // Link batch binding
  const [linkBatchId, setLinkBatchId] = useState('');

  // User Profile
  const [userProfile, setUserProfile] = useState({
    firstName: 'Workspace',
    lastName: 'Owner',
    email: 'info@vifems.com',
    role: 'OWNER',
  });

  // Load Platform Data with Strict Tenant Isolation & Error Handling
  const loadData = useCallback(async () => {
    setIsLoading(true);
    setApiError(null);
    try {
      // 1. Fetch Dynamic Dashboard Stats
      const stats = await workspaceService.getDashboardStats();
      setDashboardData(stats);

      if (stats.workspace?.id) {
        const savedTemplate = localStorage.getItem(`cert_template_${stats.workspace.id}`);
        if (savedTemplate) {
          try {
            setCertTemplate(JSON.parse(savedTemplate));
          } catch (e) {
            console.warn('Failed to parse saved cert template');
          }
        }
      }

      const activeMods = stats.enabledModules || [];
      setEnabledModules(activeMods);
      const modStatesMap: Record<string, boolean> = {};
      activeMods.forEach((k: string) => { modStatesMap[k] = true; });
      setModuleSettingStates(modStatesMap);

      if (stats.workspace?.entityConfig) {
        setEntityConfig(stats.workspace.entityConfig);
      }

      const promises: Promise<any>[] = [];

      // Conditionally load records only if module is enabled
      if (activeMods.includes('PARTICIPANTS') || activeMods.includes('CUSTOMERS') || activeMods.includes('STUDENTS')) {
        promises.push(
          workspaceService.getParticipants('', 'ALL', recordSearch)
            .then((res) => {
              const list = res.data || [];
              setParticipants(
                list.sort((a: Participant, b: Participant) =>
                  (a.refId || '').localeCompare(b.refId || '', undefined, { numeric: true })
                )
              );
              if (res.entityConfig) setEntityConfig(res.entityConfig);
            })
            .catch((err) => console.warn('Could not load entity records:', err))
        );

        promises.push(
          registrationService.getLinks(stats.workspace?.id)
            .then((res) => setRegistrationLinks(res.data || []))
            .catch((err) => console.warn('Could not load registration links:', err))
        );

        promises.push(
          registrationService.getPendingSubmissions(stats.workspace?.id, 'ALL')
            .then((res) => setPendingSubmissions(res.data || []))
            .catch((err) => console.warn('Could not load pending submissions:', err))
        );
      }

      // Always load Ref ID config for the workspace
      promises.push(
        refIdService.getConfig(stats.workspace?.id)
          .then((res) => {
            if (res.data) {
              setRefIdConfig(res.data);
              setRefPrefix(res.data.prefix || '');
              setRefSeparator(res.data.prefix ? (res.data.separator || '') : '');
              setRefPadding(res.data.padding || 3);
              setRefStartingNumber(res.data.startingNumber || 1);
              setRefUseYear(!!res.data.useYear);
            }
          })
          .catch((err) => console.warn('Could not load Ref ID config:', err))
      );

      if (activeMods.includes('TASKS')) {
        promises.push(
          operationsService.getTasks('', taskStatusFilter, 'ALL', taskSearch)
            .then((res) => setTasks(res.data || []))
            .catch((err) => console.warn('Could not load tasks:', err))
        );
      }

      if (activeMods.includes('STAFF')) {
        promises.push(
          operationsService.getStaff('')
            .then((res) => setStaff(res.data || []))
            .catch((err) => console.warn('Could not load staff:', err))
        );
      }

      if (activeMods.includes('FINANCE') || activeMods.includes('PAYMENTS')) {
        promises.push(
          operationsService.getFinanceOverview('')
            .then((res) => setFinance(res))
            .catch((err) => console.warn('Could not load finance:', err))
        );
      }

      if (activeMods.includes('INVOICES')) {
        promises.push(
          operationsService.getInvoices('')
            .then((res) => setInvoices(res.data || []))
            .catch((err) => console.warn('Could not load invoices:', err))
        );
      }

      // ── Training-specific data ────────────────────────────────────────────
      const isTraining = stats.workspace?.businessType === 'TRAINING';
      if (isTraining) {
        const wsId = stats.workspace?.id;
        promises.push(
          trainingService.getBatches(wsId)
            .then((res) => setTrainingBatches(res.data || []))
            .catch((err) => console.warn('Could not load batches:', err))
        );
        if (activeMods.includes('PAYMENTS')) {
          promises.push(
            trainingService.getPayments(wsId)
              .then((res) => setTrainingPayments(res.data || []))
              .catch((err) => console.warn('Could not load training payments:', err))
          );
        }
        if (activeMods.includes('RECEIPTS')) {
          promises.push(
            trainingService.getReceipts(wsId)
              .then((res) => setTrainingReceipts(res.data || []))
              .catch((err) => console.warn('Could not load receipts:', err))
          );
        }
        if (activeMods.includes('CERTIFICATES')) {
          promises.push(
            trainingService.getCertificates(wsId)
              .then((res) => setTrainingCertificates(res.data || []))
              .catch((err) => console.warn('Could not load certificates:', err))
          );
        }
        promises.push(
          trainingService.getTrainingDashboard(wsId)
            .then((res) => setTrainingDashboard(res.data || null))
            .catch((err) => console.warn('Could not load training dashboard:', err))
        );
      }

      // Always load notifications
      promises.push(
        operationsService.getNotifications('')
          .then((res) => {
            setNotifications(res.notifications || []);
            setUnreadNotifCount(res.unreadCount || 0);
          })
          .catch((err) => console.warn('Could not load notifications:', err))
      );

      await Promise.all(promises);
    } catch (err: any) {
      console.error('Error loading workspace data:', err);
      const code = err.status || err.statusCode || 0;
      const needsOnboarding =
        code === 404 ||
        err.data?.needsOnboarding === true ||
        err.message?.includes('No active workspace') ||
        err.message?.includes('onboarding');
      if (needsOnboarding) {
        router.push('/onboarding');
        return;
      }
      setApiError(err.message || 'Failed to load workspace data. Please verify your connection or login again.');
    } finally {
      setIsLoading(false);
    }
  }, [taskStatusFilter, taskSearch, recordSearch]);

  useEffect(() => {
    const token = tokenStorage.getToken();
    if (!token) {
      router.push('/login?redirect=/dashboard');
      return;
    }

    const cachedUser = tokenStorage.getUser<any>();
    if (cachedUser) {
      setUserProfile({
        firstName: cachedUser.firstName || 'Workspace',
        lastName: cachedUser.lastName || 'User',
        email: cachedUser.email || '',
        role: cachedUser.role || 'OWNER',
      });
    }

    loadData();
  }, [loadData, router]);

  // Global Search Handler
  const handleGlobalSearch = async (term: string) => {
    setGlobalSearchTerm(term);
    if (!term.trim()) {
      setSearchResults([]);
      return;
    }
    try {
      const res = await operationsService.globalSearch('', term);
      setSearchResults(res.results || []);
    } catch (e) {
      console.warn('Search failed:', e);
    }
  };

  const handleLogout = () => {
    tokenStorage.clear();
    router.push('/login');
  };

  // Create Entity Record (Participant / Customer / Client)
  const handleCreateEntityRecord = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recordFullName.trim() || !recordEmail.trim()) return;
    setIsCreatingParticipant(true);
    try {
      const res = await workspaceService.createParticipant({
        workspaceId: dashboardData?.workspace?.id || '',
        fullName: recordFullName.trim(),
        email: recordEmail.trim(),
        phone: recordPhone.trim(),
        status: 'CONFIRMED',
        batchId: recordBatchId || undefined,
        applicationFee: recordApplicationFee ? parseFloat(recordApplicationFee) : 0,
        trainingFee: recordTrainingFee ? parseFloat(recordTrainingFee) : 0,
        metadata: recordMetadata,
      });

      setParticipants((prev) =>
        [...prev, res.data].sort((a, b) =>
          (a.refId || '').localeCompare(b.refId || '', undefined, { numeric: true })
        )
      );
      setShowEntityModal(false);
      setRecordFullName('');
      setRecordEmail('');
      setRecordPhone('');
      setRecordBatchId('');
      setRecordApplicationFee('');
      setRecordTrainingFee('');
      setRecordMetadata({});
    } catch (err: any) {
      alert(err.message || 'Failed to create record');
    } finally {
      setIsCreatingParticipant(false);
    }
  };

  // Delete Entity Record
  const handleDeleteEntityRecord = async (id: string) => {
    if (!confirm(`Are you sure you want to remove this ${entityConfig.entityLabel.toLowerCase()}?`)) return;
    setIsDeletingParticipant(id);
    try {
      await workspaceService.deleteParticipant(id, dashboardData?.workspace?.id || '');
      setParticipants(participants.filter((p) => p.id !== id));
      if (activeEntityRecord?.id === id) setActiveEntityRecord(null);
      if (selectedParticipantSummary?.participant.id === id) setShowParticipantDetailDrawer(false);
    } catch (err: any) {
      alert(err.message || 'Failed to delete record');
    } finally {
      setIsDeletingParticipant(null);
    }
  };

  // Reference ID Live Preview Helper
  const getLiveRefIdPreview = () => {
    const pfx = (refPrefix || '').trim().toUpperCase();
    const sep = pfx ? (refSeparator || '') : '';
    const num = String(refStartingNumber || 1).padStart(refPadding || 3, '0');
    if (refUseYear) {
      const yr = new Date().getFullYear();
      return pfx ? `${pfx}${sep}${yr}${sep}${num}` : `${yr}-${num}`;
    }
    return pfx ? `${pfx}${sep}${num}` : `${num}`;
  };

  // Save Reference ID Configuration
  const handleSaveRefIdConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingRefId(true);
    setRefIdSuccessMsg(null);
    try {
      const res = await refIdService.saveConfig({
        workspaceId: dashboardData?.workspace?.id,
        prefix: refPrefix.trim(),
        separator: refSeparator,
        padding: Number(refPadding),
        startingNumber: Number(refStartingNumber),
        useYear: refUseYear,
      });
      setRefIdConfig(res.data);
      setRefIdSuccessMsg('Reference ID format updated successfully! New participants will use this sequence.');
      setTimeout(() => setRefIdSuccessMsg(null), 5000);
    } catch (err: any) {
      alert(err.message || 'Failed to save Reference ID settings');
    } finally {
      setIsSavingRefId(false);
    }
  };

  // Interactive Form Builder Field Handlers
  const handleAddBuilderField = (fieldType = 'text') => {
    const id = Date.now();
    const typeLabels: Record<string, string> = {
      text: 'Short Text',
      textarea: 'Long Text',
      email: 'Email',
      tel: 'Phone Number',
      number: 'Number',
      date: 'Date',
      select: 'Dropdown Selection',
      radio: 'Single Choice',
      checkbox: 'Multiple Choice',
      file: 'File Attachment',
      image: 'Image Upload',
    };
    setBuilderFields((prev) => [
      ...prev,
      {
        id: `field_${id}`,
        key: `custom_${id}`,
        label: `New ${typeLabels[fieldType] || 'Field'}`,
        type: fieldType,
        required: false,
        placeholder: '',
        options: ['select', 'radio', 'checkbox'].includes(fieldType) ? ['Option 1', 'Option 2'] : undefined,
      },
    ]);
  };

  const handleUpdateBuilderField = (index: number, updates: Partial<FormField>) => {
    setBuilderFields((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], ...updates };
      return next;
    });
  };

  const handleDeleteBuilderField = (index: number) => {
    setBuilderFields((prev) => prev.filter((_, i) => i !== index));
  };

  const handleMoveBuilderField = (index: number, direction: 'up' | 'down') => {
    setBuilderFields((prev) => {
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= prev.length) return prev;
      const next = [...prev];
      const item = next.splice(index, 1)[0];
      next.splice(targetIndex, 0, item);
      return next;
    });
  };

  // Create Registration Link
  const handleCreateRegistrationLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!linkName.trim()) return;

    setIsCreatingLink(true);
    try {
      const res = await registrationService.createLink({
        workspaceId: dashboardData?.workspace?.id,
        name: linkName.trim(),
        program: linkProgram.trim() || undefined,
        description: linkDesc.trim() || undefined,
        deadline: linkDeadline || undefined,
        maxParticipants: linkMaxParticipants ? parseInt(linkMaxParticipants) : undefined,
        requireApproval: linkRequireApproval,
        batchId: linkBatchId || undefined,
        formFields: builderFields.map((f) => ({
          key: f.key,
          label: f.label,
          type: f.type,
          required: f.required,
          placeholder: f.placeholder,
          options: f.options,
        })),
      });

      setRegistrationLinks([res.data, ...registrationLinks]);
      setShowCreateLinkModal(false);
      setLinkName('');
      setLinkProgram('');
      setLinkDesc('');
      setLinkDeadline('');
      setLinkMaxParticipants('');
      setLinkBatchId('');
      setLinkRequireApproval(true);
      setLinkModalStep(1);
      setBuilderFields([
        { id: 'f_fullname', key: 'fullName', label: 'Full Name', type: 'text', required: true, isSystem: true },
        { id: 'f_email', key: 'email', label: 'Email Address', type: 'email', required: true, isSystem: true },
        { id: 'f_phone', key: 'phone', label: 'Phone Number', type: 'tel', required: true },
        { id: 'f_dob', key: 'dob', label: 'Date of Birth', type: 'date', required: false },
        { id: 'f_address', key: 'address', label: 'Address', type: 'textarea', required: false },
      ]);

      // Prompt to immediately share
      setSelectedLinkForShare(res.data);
      setShowShareModal(true);
    } catch (err: any) {
      alert(err.message || 'Failed to create registration link');
    } finally {
      setIsCreatingLink(false);
    }
  };

  // Toggle/Disable Registration Link
  const handleToggleLinkStatus = async (link: RegistrationLink) => {
    try {
      const res = await registrationService.disableLink(link.id, dashboardData?.workspace?.id);
      setRegistrationLinks(
        registrationLinks.map((l) => (l.id === link.id ? res.data : l))
      );
    } catch (err: any) {
      alert(err.message || 'Failed to update link status');
    }
  };

  // Delete Registration Link
  const handleDeleteRegistrationLink = async (id: string) => {
    if (!confirm('Are you sure you want to delete this registration link?')) return;
    try {
      await registrationService.deleteLink(id, dashboardData?.workspace?.id);
      setRegistrationLinks(registrationLinks.filter((l) => l.id !== id));
    } catch (err: any) {
      alert(err.message || 'Failed to delete registration link');
    }
  };

  // Approve Pending Submission
  const handleApproveSubmission = async (sub: RegistrationSubmission) => {
    setIsApproving(sub.id);
    try {
      const res = await registrationService.approveSubmission(sub.id, dashboardData?.workspace?.id);
      setPendingSubmissions(
        pendingSubmissions.map((s) => (s.id === sub.id ? { ...s, status: 'APPROVED' } : s))
      );
      if (res.data) {
        setParticipants((prev) =>
          [...prev, res.data].sort((a, b) =>
            (a.refId || '').localeCompare(b.refId || '', undefined, { numeric: true })
          )
        );
      }
    } catch (err: any) {
      alert(err.message || 'Failed to approve submission');
    } finally {
      setIsApproving(null);
    }
  };


  // Reject Pending Submission
  const handleRejectSubmission = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSubmissionForReject) return;
    setIsRejectingSubmission(true);
    try {
      await registrationService.rejectSubmission(
        selectedSubmissionForReject.id,
        dashboardData?.workspace?.id,
        rejectReason.trim() || undefined
      );

      setPendingSubmissions(
        pendingSubmissions.map((s) =>
          s.id === selectedSubmissionForReject.id
            ? { ...s, status: 'REJECTED', rejectionReason: rejectReason }
            : s
        )
      );
      setShowRejectModal(false);
      setSelectedSubmissionForReject(null);
      setRejectReason('');
    } catch (err: any) {
      alert(err.message || 'Failed to reject submission');
    } finally {
      setIsRejectingSubmission(false);
    }
  };

  // Copy Link to Clipboard Helper
  const handleCopyLinkUrl = (slug: string) => {
    const url = typeof window !== 'undefined' ? `${window.location.origin}/register/${slug}` : `/register/${slug}`;
    navigator.clipboard.writeText(url);
    setCopyFeedback(true);
    setTimeout(() => setCopyFeedback(false), 2500);
  };


  // Create Task
  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;

    try {
      const res = await operationsService.createTask({
        workspaceId: dashboardData?.workspace?.id,
        title: taskTitle.trim(),
        description: taskDesc.trim(),
        priority: taskPriority,
        assigneeName: taskAssignee || 'Unassigned',
        status: 'TODO',
        dueDate: taskDueDate || null,
        checklist: [{ id: `c-${Date.now()}`, text: 'Initial setup', isDone: false }],
      });

      setTasks([res.data, ...tasks]);
      setShowTaskModal(false);
      setTaskTitle('');
      setTaskDesc('');
    } catch (err: any) {
      alert(err.message || 'Failed to create task');
    }
  };

  // Create Transaction
  const handleCreateTx = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!txAmount || !txDesc.trim()) return;

    try {
      const res = await operationsService.createTransaction({
        workspaceId: dashboardData?.workspace?.id,
        type: txType,
        amount: Number(txAmount),
        category: txCategory,
        description: txDesc.trim(),
        status: 'PAID',
      });

      if (finance) {
        setFinance({
          ...finance,
          recentTransactions: [res.data, ...finance.recentTransactions],
        });
      }
      setShowTxModal(false);
      setTxAmount(0);
      setTxDesc('');
    } catch (err: any) {
      alert(err.message || 'Failed to record transaction');
    }
  };

  // Create Invoice
  const handleCreateInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!invCustName.trim() || !invCustEmail.trim() || !invAmount) return;

    try {
      const res = await operationsService.createInvoice({
        workspaceId: dashboardData?.workspace?.id,
        customerName: invCustName.trim(),
        customerEmail: invCustEmail.trim(),
        items: [{ description: invItemDesc.trim() || 'Service / Product', quantity: 1, unitPrice: Number(invAmount) }],
        tax: 0,
        discount: 0,
      });

      setInvoices([res.data, ...invoices]);
      setShowInvoiceModal(false);
      setInvCustName('');
      setInvCustEmail('');
      setInvAmount(0);
      setInvItemDesc('');
    } catch (err: any) {
      alert(err.message || 'Failed to create invoice');
    }
  };

  // Save Module Configuration from Dashboard Settings
  const handleSaveModules = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingModules(true);
    setModuleSuccessMsg(null);
    try {
      const orgType = (dashboardData?.workspace as any)?.organizationType || 'training';
      const orgCatalog = getOrgModuleCatalog(orgType);
      const allCatalogModules = [...orgCatalog.core, ...orgCatalog.optional];

      const payloadModules = allCatalogModules.map((m) => ({
        key: m.key,
        enabled: m.isCore ? true : !!moduleSettingStates[m.key],
      }));

      await onboardingService.configureModules({ modules: payloadModules });
      const newlyEnabled = payloadModules.filter((m) => m.enabled).map((m) => m.key);
      setEnabledModules(newlyEnabled);
      setModuleSuccessMsg('Workspace modules updated successfully!');
      setTimeout(() => setModuleSuccessMsg(null), 5000);
      loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to update workspace modules');
    } finally {
      setIsSavingModules(false);
    }
  };

  // ── Training Specific Handlers ─────────────────────────────────────────────
  const handleCreateBatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!batchName.trim()) return;
    setIsSubmittingBatch(true);
    try {
      if (editingBatch) {
        const res = await trainingService.updateBatch(editingBatch.id, {
          name: batchName.trim(),
          program: batchProgram.trim() || undefined,
          description: batchDesc.trim() || undefined,
          startDate: batchStartDate || undefined,
          endDate: batchEndDate || undefined,
          status: batchStatus,
        });
        setTrainingBatches((prev) => prev.map((b) => (b.id === editingBatch.id ? res.data : b)));
      } else {
        const res = await trainingService.createBatch({
          workspaceId: dashboardData?.workspace?.id,
          name: batchName.trim(),
          program: batchProgram.trim() || undefined,
          description: batchDesc.trim() || undefined,
          startDate: batchStartDate || undefined,
          endDate: batchEndDate || undefined,
          status: batchStatus,
        });
        setTrainingBatches((prev) => [res.data, ...prev]);
      }
      setShowBatchModal(false);
      setEditingBatch(null);
      setBatchName('');
      setBatchProgram('');
      setBatchDesc('');
      setBatchStartDate('');
      setBatchEndDate('');
      setBatchStatus('UPCOMING');
      loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to save batch');
    } finally {
      setIsSubmittingBatch(false);
    }
  };

  const handleDeleteBatch = async (id: string) => {
    if (!confirm('Are you sure you want to delete this batch?')) return;
    setIsDeletingBatch(id);
    try {
      await trainingService.deleteBatch(id, dashboardData?.workspace?.id);
      setTrainingBatches((prev) => prev.filter((b) => b.id !== id));
      loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to delete batch');
    } finally {
      setIsDeletingBatch(null);
    }
  };

  const handleRecordPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentParticipantId || !paymentAmount) return;
    setIsSubmittingPayment(true);
    try {
      const res = await trainingService.createPayment({
        workspaceId: dashboardData?.workspace?.id,
        participantId: paymentParticipantId,
        batchId: paymentBatchId || undefined,
        amount: parseFloat(paymentAmount),
        paymentFor,
        paymentDate: paymentDate || undefined,
        notes: paymentNotes.trim() || undefined,
      });

      const { payment, receipt } = res.data;
      setTrainingPayments((prev) => [payment, ...prev]);
      if (receipt) {
        setTrainingReceipts((prev) => [receipt, ...prev]);
      }
      setShowPaymentModal(false);
      setPaymentParticipantId('');
      setPaymentBatchId('');
      setPaymentAmount('');
      setPaymentNotes('');
      setPaymentDate('');
      setPaymentFor('TRAINING_FEE');

      // Reload dashboard data
      loadData();

      // Refresh participant summary if drawer is open
      if (selectedParticipantSummary?.participant.id === paymentParticipantId) {
        handleOpenParticipantDetail(selectedParticipantSummary.participant);
      }

      // Auto-preview receipt
      if (receipt) {
        setShowReceiptModal(receipt);
      }
    } catch (err: any) {
      alert(err.message || 'Failed to record payment');
    } finally {
      setIsSubmittingPayment(false);
    }
  };

  const handleDeletePayment = async (id: string) => {
    if (!confirm('Are you sure you want to delete this payment record? This will also remove the receipt.')) return;
    setIsDeletingPayment(id);
    try {
      await trainingService.deletePayment(id, dashboardData?.workspace?.id);
      setTrainingPayments((prev) => prev.filter((p) => p.id !== id));
      loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to delete payment');
    } finally {
      setIsDeletingPayment(null);
    }
  };

  const handleIssueCertificate = async (participantId: string) => {
    if (!confirm('Issue completion certificate to this participant?')) return;
    setIsIssuingCertificate(participantId);
    try {
      const res = await trainingService.issueCertificate(participantId, dashboardData?.workspace?.id);
      setTrainingCertificates((prev) => {
        const exists = prev.some((c) => c.participantId === participantId);
        if (exists) {
          return prev.map((c) => (c.participantId === participantId ? res.data : c));
        }
        return [res.data, ...prev];
      });
      setParticipants((prev) =>
        prev.map((p) => (p.id === participantId ? { ...p, certificateStatus: 'ISSUED' } : p))
      );
      if (selectedParticipantSummary?.participant.id === participantId) {
        setSelectedParticipantSummary({
          ...selectedParticipantSummary,
          participant: { ...selectedParticipantSummary.participant, certificateStatus: 'ISSUED' },
        });
      }
      setShowCertificateModal(res.data);
    } catch (err: any) {
      alert(err.message || 'Failed to issue certificate');
    } finally {
      setIsIssuingCertificate(null);
    }
  };

  const handleOpenParticipantDetail = async (participant: Participant) => {
    try {
      const res = await trainingService.getParticipantPaymentSummary(participant.id, dashboardData?.workspace?.id);
      setSelectedParticipantSummary(res.data);
      setShowParticipantDetailDrawer(true);
    } catch (err: any) {
      console.warn('Could not load participant detail:', err);
      setSelectedParticipantSummary({
        participant,
        payments: trainingPayments.filter((p) => p.participantId === participant.id),
        summary: {
          applicationFee: participant.applicationFee || 0,
          trainingFee: participant.trainingFee || 0,
          totalFees: (participant.applicationFee || 0) + (participant.trainingFee || 0),
          totalPaid: 0,
          balance: (participant.applicationFee || 0) + (participant.trainingFee || 0),
          paymentStatus: 'UNPAID',
        },
      });
      setShowParticipantDetailDrawer(true);
    }
  };

  const handleDownloadPdf = async (elementId: string, defaultFileName: string) => {
    const el = document.getElementById(elementId);
    if (!el) {
      alert('Document element not found for PDF export.');
      return;
    }
    setIsDownloadingPdf(true);
    try {
      const html2canvas = (await import('html2canvas')).default;
      const jsPDF = (await import('jspdf')).default;

      const canvas = await html2canvas(el, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
      });

      const imgData = canvas.toDataURL('image/png');
      const isLandscape = canvas.width > canvas.height;
      const pdf = new jsPDF({
        orientation: isLandscape ? 'landscape' : 'portrait',
        unit: 'px',
        format: [canvas.width, canvas.height],
      });

      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save(defaultFileName);
    } catch (e: any) {
      console.error('PDF export error:', e);
      window.print();
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  const handleShareReceiptWhatsApp = (receipt: TrainingReceipt) => {
    const pName = receipt.participant?.fullName || 'Participant';
    const amount = Number(receipt.amount).toLocaleString();
    const currency = ws?.currency || 'NGN';
    const rcpNum = receipt.receiptNumber;
    const date = new Date(receipt.issuedAt).toLocaleDateString();

    const text = `*${ws.name} - Official Payment Receipt*\n\n` +
      `Receipt No: *${rcpNum}*\n` +
      `Participant: *${pName}*\n` +
      `Amount Paid: *${amount} ${currency}*\n` +
      `Payment Purpose: *${receipt.paymentFor.replace('_', ' ')}*\n` +
      `Date: *${date}*\n\n` +
      `Status: *VERIFIED & CONFIRMED*\n` +
      `Thank you for your payment!`;

    const phone = receipt.participant?.phone?.replace(/[^0-9]/g, '');
    const url = phone
      ? `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(text)}`
      : `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const handleShareCertificateWhatsApp = (certData: any) => {
    const pName = certData.participant?.fullName || certData.fullName || 'Graduate';
    const certNum = certData.certificateNumber || 'CERT-ISSUED';
    const prog = certData.batch?.program || certData.batch?.name || ws.name;

    const text = `*${ws.name} - Certificate of Completion*\n\n` +
      `Recipient: *${pName}*\n` +
      `Certificate Serial No: *${certNum}*\n` +
      `Program Track: *${prog}*\n` +
      `Status: *OFFICIALLY ISSUED & VERIFIED*\n\n` +
      `Congratulations on your graduation!`;

    const phone = certData.participant?.phone?.replace(/[^0-9]/g, '');
    const url = phone
      ? `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(text)}`
      : `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };


  const orgType = (dashboardData?.workspace as any)?.organizationType || 'training';
  const paymentsIsCore = getOrgModuleCatalog(orgType).core.some((m) => m.key === 'PAYMENTS');

  const ws = dashboardData?.workspace || {
    id: '',
    name: 'VIFEmS Workspace',
    businessType: 'TRAINING',
    status: 'ACTIVE',
    email: '',
    phone: '',
  };

  const entityLabel = entityConfig.entityLabel || 'Record';
  const entityLabelPlural = entityConfig.entityLabelPlural || `${entityLabel}s`;

  return (
    <div className="dashboard-root">
      {/* ==================== 1. TOP NAVBAR ==================== */}
      <header className="dashboard-navbar">
        <button
          type="button"
          className="dashboard-hamburger"
          aria-label="Open menu"
          onClick={() => setMobileSidebarOpen(true)}
        >
          <Icons.Menu />
        </button>
        <div className="dashboard-nav-left">
          <Link href="/" className="dashboard-logo">
            <img src="/logo/logo.png" alt="VIFEmS" />
          </Link>

          {/* Org Selector */}
          <div className="org-selector-container">
            <button type="button" className="org-selector-btn" title="Active Workspace">
              <Icons.Building />
              <span>{ws.name}</span>
              <span className="business-type-tag">{ws.businessType}</span>
            </button>
          </div>

          {/* Global Search */}
          <div
            className="nav-search-trigger"
            onClick={() => setShowSearchModal(true)}
            title="Global Search"
          >
            <Icons.Search />
            <span>Search workspace...</span>
            <span className="nav-search-shortcut">Ctrl+K</span>
          </div>
          <button
            type="button"
            className="nav-search-trigger-mobile"
            aria-label="Search"
            onClick={() => setShowSearchModal(true)}
          >
            <Icons.Search />
          </button>
        </div>

        <div className="dashboard-nav-right">
          {/* Quick Action Button */}
          <div className="quick-action-wrapper">
            <button
              type="button"
              className="btn-quick-action"
              onClick={() => setShowQuickMenu(!showQuickMenu)}
            >
              <Icons.Plus />
              <span>Quick Action</span>
              <Icons.ChevronDown />
            </button>

            {showQuickMenu && (
              <div className="quick-action-menu">
                {(enabledModules.includes('PARTICIPANTS') || enabledModules.includes('CUSTOMERS')) && (
                  <button
                    type="button"
                    className="quick-menu-item"
                    onClick={() => { setShowQuickMenu(false); setShowEntityModal(true); }}
                  >
                    <Icons.Users />
                    <span>New {entityLabel}</span>
                  </button>
                )}
                {enabledModules.includes('TASKS') && (
                  <button
                    type="button"
                    className="quick-menu-item"
                    onClick={() => { setShowQuickMenu(false); setShowTaskModal(true); }}
                  >
                    <Icons.CheckSquare />
                    <span>New Task</span>
                  </button>
                )}
                {enabledModules.includes('INVOICES') && (
                  <button
                    type="button"
                    className="quick-menu-item"
                    onClick={() => { setShowQuickMenu(false); setShowInvoiceModal(true); }}
                  >
                    <Icons.FileText />
                    <span>Create Invoice</span>
                  </button>
                )}
                {ws.businessType === 'TRAINING' ? (
                  <>
                    <button
                      type="button"
                      className="quick-menu-item"
                      onClick={() => { setShowQuickMenu(false); setShowPaymentModal(true); }}
                    >
                      <Icons.DollarSign />
                      <span>Record Participant Payment</span>
                    </button>
                    <button
                      type="button"
                      className="quick-menu-item"
                      onClick={() => { setShowQuickMenu(false); setEditingBatch(null); setShowBatchModal(true); }}
                    >
                      <Icons.Users />
                      <span>Create Training Batch</span>
                    </button>
                  </>
                ) : (
                  (enabledModules.includes('FINANCE') || enabledModules.includes('PAYMENTS')) && (
                    <button
                      type="button"
                      className="quick-menu-item"
                      onClick={() => { setShowQuickMenu(false); setShowTxModal(true); }}
                    >
                      <Icons.DollarSign />
                      <span>Record Payment</span>
                    </button>
                  )
                )}
              </div>
            )}
          </div>

          {/* Notifications Popover */}
          <div className="notification-bell-wrapper">
            <button
              type="button"
              className="nav-icon-btn"
              onClick={() => setShowNotifPopover(!showNotifPopover)}
              title="Notifications"
            >
              <Icons.Bell />
              {unreadNotifCount > 0 && <span className="notification-badge-dot" />}
            </button>

            {showNotifPopover && (
              <div className="notifications-popover">
                <div className="notifications-popover-header">
                  <h4>Activity & Notifications</h4>
                  <button
                    type="button"
                    className="btn-mark-all-read"
                    onClick={() => {
                      operationsService.markNotificationRead('all');
                      setUnreadNotifCount(0);
                    }}
                  >
                    Mark all read
                  </button>
                </div>
                {notifications.length > 0 ? (
                  notifications.map((n) => (
                    <div key={n.id} className={`popover-notif-item ${!n.isRead ? 'unread' : ''}`}>
                      <h5>{n.title}</h5>
                      <p>{n.description}</p>
                      <div className="popover-notif-time">{new Date(n.createdAt).toLocaleTimeString()}</div>
                    </div>
                  ))
                ) : (
                  <p style={{ fontSize: '12px', color: '#64748b', textAlign: 'center', margin: '14px 0' }}>
                    No unread notifications
                  </p>
                )}
              </div>
            )}
          </div>

          {/* User Profile */}
          <div
            className="user-profile-chip"
            onClick={() => setActiveNav('SETTINGS')}
            title="Profile & Settings"
          >
            <div className="user-avatar-circle">
              {userProfile.firstName ? userProfile.firstName[0].toUpperCase() : 'V'}
            </div>
            <span>{userProfile.firstName} {userProfile.lastName}</span>
          </div>

          <button
            type="button"
            className="btn-action-icon btn-action-delete"
            onClick={handleLogout}
            title="Log Out"
          >
            <Icons.LogOut />
          </button>
        </div>
      </header>

      {/* ==================== 2. MAIN LAYOUT ==================== */}
      <div
        className={`dashboard-sidebar-backdrop ${mobileSidebarOpen ? 'visible' : ''}`}
        onClick={() => setMobileSidebarOpen(false)}
        aria-hidden="true"
      />
      <div className="dashboard-layout">
        {/* Dynamic Sidebar Navigation */}
        <aside
          className={`dashboard-sidebar ${mobileSidebarOpen ? 'mobile-open' : ''}`}
          onClick={(e) => {
            if (!mobileSidebarOpen) return;
            const target = e.target as HTMLElement;
            if (target.closest('.sidebar-tab')) setMobileSidebarOpen(false);
          }}
        >
          <div className="sidebar-heading">Workspace</div>

          {/* Core: Overview */}
          <div
            className={`sidebar-tab ${activeNav === 'OVERVIEW' ? 'active' : ''}`}
            onClick={() => { setActiveNav('OVERVIEW'); setActiveEntityRecord(null); }}
          >
            <Icons.Grid />
            <span>Dashboard</span>
          </div>

          {/* Module: Participants / Students / Customers / Clients */}
          {(enabledModules.includes('PARTICIPANTS') || enabledModules.includes('CUSTOMERS') || enabledModules.includes('STUDENTS')) && (
            <div
              className={`sidebar-tab ${activeNav === 'RECORDS' ? 'active' : ''}`}
              onClick={() => { setActiveNav('RECORDS'); setActiveEntityRecord(null); }}
            >
              <Icons.Users />
              <span>{entityLabelPlural}</span>
              <span className="sidebar-module-badge">{participants.length}</span>
            </div>
          )}

          {/* Section: Academic & Learning (Schools / Training) */}
          {(enabledModules.includes('CLASSES') ||
            enabledModules.includes('ACADEMIC_SESSIONS') ||
            enabledModules.includes('SUBJECTS') ||
            enabledModules.includes('RESULTS') ||
            enabledModules.includes('PROGRAMS') ||
            enabledModules.includes('TRAINING') ||
            enabledModules.includes('BATCHES') ||
            enabledModules.includes('COHORTS') ||
            enabledModules.includes('CERTIFICATES') ||
            enabledModules.includes('PAYMENTS') ||
            enabledModules.includes('RECEIPTS') ||
            enabledModules.includes('PROGRESS_TRACKING') ||
            enabledModules.includes('TRAINERS') ||
            enabledModules.includes('LIBRARY') ||
            enabledModules.includes('SCHOOL_HEALTH') ||
            enabledModules.includes('GUIDANCE')) && (
            <>
              <div className="sidebar-heading" style={{ marginTop: '12px' }}>
                {enabledModules.includes('CLASSES') ? 'Academics & School' : 'Programs & Training'}
              </div>

              {enabledModules.includes('CLASSES') && (
                <div
                  className={`sidebar-tab ${activeNav === 'CLASSES' ? 'active' : ''}`}
                  onClick={() => { setActiveNav('CLASSES'); setActiveEntityRecord(null); }}
                >
                  <Icons.Layers />
                  <span>Classes & Sections</span>
                </div>
              )}

              {enabledModules.includes('ACADEMIC_SESSIONS') && (
                <div
                  className={`sidebar-tab ${activeNav === 'ACADEMIC_SESSIONS' ? 'active' : ''}`}
                  onClick={() => { setActiveNav('ACADEMIC_SESSIONS'); setActiveEntityRecord(null); }}
                >
                  <Icons.Clock />
                  <span>Academic Sessions</span>
                </div>
              )}

              {enabledModules.includes('SUBJECTS') && (
                <div
                  className={`sidebar-tab ${activeNav === 'SUBJECTS' ? 'active' : ''}`}
                  onClick={() => { setActiveNav('SUBJECTS'); setActiveEntityRecord(null); }}
                >
                  <Icons.BookOpen />
                  <span>Subjects</span>
                </div>
              )}

              {enabledModules.includes('RESULTS') && (
                <div
                  className={`sidebar-tab ${activeNav === 'RESULTS' ? 'active' : ''}`}
                  onClick={() => { setActiveNav('RESULTS'); setActiveEntityRecord(null); }}
                >
                  <Icons.Award />
                  <span>Results & Grades</span>
                </div>
              )}

              {(enabledModules.includes('PROGRAMS') || (enabledModules.includes('TRAINING') && !enabledModules.includes('CLASSES'))) && (
                <div
                  className={`sidebar-tab ${activeNav === 'PROGRAMS' ? 'active' : ''}`}
                  onClick={() => { setActiveNav('PROGRAMS'); setActiveEntityRecord(null); }}
                >
                  <Icons.BookOpen />
                  <span>Training Programs</span>
                </div>
              )}

              {enabledModules.includes('COHORTS') && (
                <div
                  className={`sidebar-tab ${activeNav === 'COHORTS' ? 'active' : ''}`}
                  onClick={() => { setActiveNav('COHORTS'); setActiveEntityRecord(null); }}
                >
                  <Icons.Users />
                  <span>Cohorts & Batches</span>
                </div>
              )}

              {enabledModules.includes('CERTIFICATES') && (
                <div
                  className={`sidebar-tab ${activeNav === 'CERTIFICATES' ? 'active' : ''}`}
                  onClick={() => { setActiveNav('CERTIFICATES'); setActiveEntityRecord(null); }}
                >
                  <Icons.CheckSquare />
                  <span>Certificates</span>
                </div>
              )}

              {/* Training-specific Payments — always shown for TRAINING orgs */}
              {ws.businessType === 'TRAINING' && (
                <div
                  className={`sidebar-tab ${activeNav === 'PAYMENTS' ? 'active' : ''}`}
                  onClick={() => { setActiveNav('PAYMENTS'); setActiveEntityRecord(null); }}
                >
                  <Icons.DollarSign />
                  <span>Payments</span>
                  <span className="sidebar-module-badge" style={{ background: '#16a34a' }}>
                    {trainingPayments.length}
                  </span>
                </div>
              )}

              {enabledModules.includes('PROGRESS_TRACKING') && (
                <div
                  className={`sidebar-tab ${activeNav === 'PROGRESS_TRACKING' ? 'active' : ''}`}
                  onClick={() => { setActiveNav('PROGRESS_TRACKING'); setActiveEntityRecord(null); }}
                >
                  <Icons.TrendingUp />
                  <span>Progress Tracking</span>
                </div>
              )}

              {enabledModules.includes('TRAINERS') && (
                <div
                  className={`sidebar-tab ${activeNav === 'TRAINERS' ? 'active' : ''}`}
                  onClick={() => { setActiveNav('TRAINERS'); setActiveEntityRecord(null); }}
                >
                  <Icons.UserCheck />
                  <span>Instructors</span>
                </div>
              )}

              {enabledModules.includes('LIBRARY') && (
                <div
                  className={`sidebar-tab ${activeNav === 'LIBRARY' ? 'active' : ''}`}
                  onClick={() => { setActiveNav('LIBRARY'); setActiveEntityRecord(null); }}
                >
                  <Icons.BookOpen />
                  <span>Library</span>
                </div>
              )}

              {enabledModules.includes('SCHOOL_HEALTH') && (
                <div
                  className={`sidebar-tab ${activeNav === 'SCHOOL_HEALTH' ? 'active' : ''}`}
                  onClick={() => { setActiveNav('SCHOOL_HEALTH'); setActiveEntityRecord(null); }}
                >
                  <Icons.Heart />
                  <span>Health & Clinic</span>
                </div>
              )}

              {enabledModules.includes('GUIDANCE') && (
                <div
                  className={`sidebar-tab ${activeNav === 'GUIDANCE' ? 'active' : ''}`}
                  onClick={() => { setActiveNav('GUIDANCE'); setActiveEntityRecord(null); }}
                >
                  <Icons.Compass />
                  <span>Guidance & Welfare</span>
                </div>
              )}
            </>
          )}

          {/* Section: Commerce & Operations (Retail, Attendance, Tasks) */}
          {(enabledModules.includes('PRODUCTS') ||
            enabledModules.includes('ORDERS') ||
            enabledModules.includes('INVENTORY') ||
            enabledModules.includes('SUPPLIERS') ||
            enabledModules.includes('DISCOUNTS') ||
            enabledModules.includes('ATTENDANCE') ||
            enabledModules.includes('TASKS')) && (
            <>
              <div className="sidebar-heading" style={{ marginTop: '12px' }}>
                {enabledModules.includes('PRODUCTS') ? 'Commerce & Stock' : 'Operations'}
              </div>

              {enabledModules.includes('PRODUCTS') && (
                <div
                  className={`sidebar-tab ${activeNav === 'PRODUCTS' ? 'active' : ''}`}
                  onClick={() => { setActiveNav('PRODUCTS'); setActiveEntityRecord(null); }}
                >
                  <Icons.ShoppingBag />
                  <span>Products & Catalog</span>
                </div>
              )}

              {enabledModules.includes('ORDERS') && (
                <div
                  className={`sidebar-tab ${activeNav === 'ORDERS' ? 'active' : ''}`}
                  onClick={() => { setActiveNav('ORDERS'); setActiveEntityRecord(null); }}
                >
                  <Icons.FileText />
                  <span>Sales & Orders</span>
                </div>
              )}

              {enabledModules.includes('INVENTORY') && (
                <div
                  className={`sidebar-tab ${activeNav === 'INVENTORY' ? 'active' : ''}`}
                  onClick={() => { setActiveNav('INVENTORY'); setActiveEntityRecord(null); }}
                >
                  <Icons.Package />
                  <span>Inventory & Stock</span>
                </div>
              )}

              {enabledModules.includes('SUPPLIERS') && (
                <div
                  className={`sidebar-tab ${activeNav === 'SUPPLIERS' ? 'active' : ''}`}
                  onClick={() => { setActiveNav('SUPPLIERS'); setActiveEntityRecord(null); }}
                >
                  <Icons.Package />
                  <span>Suppliers</span>
                </div>
              )}

              {enabledModules.includes('DISCOUNTS') && (
                <div
                  className={`sidebar-tab ${activeNav === 'DISCOUNTS' ? 'active' : ''}`}
                  onClick={() => { setActiveNav('DISCOUNTS'); setActiveEntityRecord(null); }}
                >
                  <Icons.Tag />
                  <span>Discounts</span>
                </div>
              )}

              {enabledModules.includes('ATTENDANCE') && (
                <div
                  className={`sidebar-tab ${activeNav === 'ATTENDANCE' ? 'active' : ''}`}
                  onClick={() => { setActiveNav('ATTENDANCE'); setActiveEntityRecord(null); }}
                >
                  <Icons.Clock />
                  <span>Attendance</span>
                </div>
              )}

              {enabledModules.includes('TASKS') && (
                <div
                  className={`sidebar-tab ${activeNav === 'TASKS' ? 'active' : ''}`}
                  onClick={() => { setActiveNav('TASKS'); setActiveEntityRecord(null); }}
                >
                  <Icons.CheckSquare />
                  <span>Tasks</span>
                  <span className="sidebar-module-badge">
                    {tasks.filter((t) => t.status !== 'COMPLETED').length}
                  </span>
                </div>
              )}
            </>
          )}

          {/* Section: Finance & Billing */}
          {(enabledModules.includes('FEES') || (paymentsIsCore && (enabledModules.includes('FINANCE') || enabledModules.includes('PAYMENTS'))) || enabledModules.includes('INVOICES')) && (
            <>
              <div className="sidebar-heading" style={{ marginTop: '12px' }}>
                {paymentsIsCore ? 'Finance & Billing' : 'Billing'}
              </div>

              {enabledModules.includes('FEES') && (
                <div
                  className={`sidebar-tab ${activeNav === 'FEES' ? 'active' : ''}`}
                  onClick={() => { setActiveNav('FEES'); setActiveEntityRecord(null); }}
                >
                  <Icons.DollarSign />
                  <span>Fees & Bursar</span>
                </div>
              )}

              {paymentsIsCore && (enabledModules.includes('FINANCE') || enabledModules.includes('PAYMENTS')) && (
                <div
                  className={`sidebar-tab ${activeNav === 'FINANCE' ? 'active' : ''}`}
                  onClick={() => { setActiveNav('FINANCE'); setActiveEntityRecord(null); }}
                >
                  <Icons.DollarSign />
                  <span>Finance & Ledger</span>
                </div>
              )}

              {enabledModules.includes('INVOICES') && (
                <div
                  className={`sidebar-tab ${activeNav === 'INVOICES' ? 'active' : ''}`}
                  onClick={() => { setActiveNav('INVOICES'); setActiveEntityRecord(null); }}
                >
                  <Icons.FileText />
                  <span>Invoices</span>
                  <span className="sidebar-module-badge" style={{ background: '#d97706' }}>
                    {invoices.filter((i) => i.status === 'PENDING').length}
                  </span>
                </div>
              )}
            </>
          )}

          {/* Section: Core Admin */}
          <div className="sidebar-heading" style={{ marginTop: '12px' }}>Administration</div>

          {enabledModules.includes('STAFF') && (
            <div
              className={`sidebar-tab ${activeNav === 'STAFF' ? 'active' : ''}`}
              onClick={() => { setActiveNav('STAFF'); setActiveEntityRecord(null); }}
            >
              <Icons.UserCheck />
              <span>Staff & Team</span>
              <span className="sidebar-module-badge" style={{ background: '#3b82f6' }}>{staff.length}</span>
            </div>
          )}

          {enabledModules.includes('REPORTS') && (
            <div
              className={`sidebar-tab ${activeNav === 'REPORTS' ? 'active' : ''}`}
              onClick={() => { setActiveNav('REPORTS'); setActiveEntityRecord(null); }}
            >
              <Icons.BarChart />
              <span>Reports</span>
            </div>
          )}

          <div
            className={`sidebar-tab ${activeNav === 'NOTIFICATIONS' ? 'active' : ''}`}
            onClick={() => { setActiveNav('NOTIFICATIONS'); setActiveEntityRecord(null); }}
          >
            <Icons.Bell />
            <span>Activity Logs</span>
          </div>

          <div
            className={`sidebar-tab ${activeNav === 'SETTINGS' ? 'active' : ''}`}
            onClick={() => { setActiveNav('SETTINGS'); setActiveEntityRecord(null); }}
          >
            <Icons.Settings />
            <span>Settings</span>
          </div>

          <div
            className={`sidebar-tab ${activeNav === 'HELP' ? 'active' : ''}`}
            onClick={() => { setActiveNav('HELP'); setActiveEntityRecord(null); }}
          >
            <Icons.HelpCircle />
            <span>Help Center</span>
          </div>

          <div
            className="sidebar-tab"
            onClick={handleLogout}
            style={{ color: '#dc2626', marginTop: 'auto' }}
          >
            <Icons.LogOut />
            <span>Log Out</span>
          </div>
        </aside>

        {/* ==================== 3. CONTENT AREA ==================== */}
          <main className="dashboard-content">
            {/* Top Bar: Title + Actions */}
            <div className="dashboard-header-bar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h1 className="dashboard-page-title">
                {activeNav === 'OVERVIEW' && 'Overview'}
                {activeNav === 'RECORDS' && `${entityLabelPlural} Directory`}
                {activeNav === 'CLASSES' && 'Classes & Academic Sections'}
                {activeNav === 'ACADEMIC_SESSIONS' && 'Academic Sessions & Term Calendar'}
                {activeNav === 'SUBJECTS' && 'Subjects & Academic Curriculum'}
                {activeNav === 'RESULTS' && 'Assessments, Results & Report Cards'}
                {activeNav === 'FEES' && 'Fees & Bursar Collections'}
                {activeNav === 'LIBRARY' && 'Library & Resource Catalog'}
                {activeNav === 'SCHOOL_HEALTH' && 'School Health & Medical Center'}
                {activeNav === 'GUIDANCE' && 'Guidance & Student Welfare'}
                {activeNav === 'PROGRAMS' && 'Training Programs & Courses'}
                {activeNav === 'COHORTS' && 'Cohorts & Training Batches'}
                {activeNav === 'CERTIFICATES' && 'Certificates & Credentials'}
                {activeNav === 'PAYMENTS' && ws.businessType === 'TRAINING' && 'Fee Payments & Financial Ledger'}
                {activeNav === 'RECEIPTS' && 'Payment Receipts Repository'}
                {activeNav === 'PROGRESS_TRACKING' && 'Participant Progress Tracking'}
                {activeNav === 'TRAINERS' && 'Instructors & Faculty Directory'}
                {activeNav === 'PRODUCTS' && 'Products & Price Book'}
                {activeNav === 'ORDERS' && 'Orders & Sales Dispatch'}
                {activeNav === 'INVENTORY' && 'Inventory & Stock Management'}
                {activeNav === 'SUPPLIERS' && 'Suppliers & Vendor Directory'}
                {activeNav === 'DISCOUNTS' && 'Discounts & Promotional Campaigns'}
                {activeNav === 'ATTENDANCE' && 'Attendance Sessions & Roll Call'}
                {activeNav === 'TASKS' && 'Tasks & Operations'}
                {activeNav === 'STAFF' && 'Staff & Team Roster'}
                {activeNav === 'FINANCE' && 'Finance & Cashflow'}
                {activeNav === 'INVOICES' && 'Invoices & Billing'}
                {activeNav === 'REPORTS' && 'Operational Reports'}
                {activeNav === 'NOTIFICATIONS' && 'Audit Trail & Activity Logs'}
                {activeNav === 'SETTINGS' && 'Workspace & Business Configuration'}
                {activeNav === 'HELP' && 'Documentation & Help Center'}
              </h1>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '8px' }}>
                {activeNav === 'RECORDS' && (
                  <button type="button" className="btn-nav-primary" onClick={() => setShowAddChoiceModal(true)}>
                    <Icons.Plus />
                    <span>Add {entityLabel}</span>
                  </button>
                )}
                {activeNav === 'TASKS' && (
                  <button type="button" className="btn-nav-primary" onClick={() => setShowTaskModal(true)}>
                    <Icons.Plus />
                    <span>Create Task</span>
                  </button>
                )}
                {activeNav === 'FINANCE' && (
                  <button type="button" className="btn-nav-primary" onClick={() => setShowTxModal(true)}>
                    <Icons.Plus />
                    <span>Record Transaction</span>
                  </button>
                )}
                {activeNav === 'INVOICES' && (
                  <button type="button" className="btn-nav-primary" onClick={() => setShowInvoiceModal(true)}>
                    <Icons.Plus />
                    <span>New Invoice</span>
                  </button>
                )}
                {(activeNav === 'PAYMENTS' || activeNav === 'RECEIPTS') && ws.businessType === 'TRAINING' && (
                  <button type="button" className="btn-nav-primary" onClick={() => setShowPaymentModal(true)}>
                    <Icons.Plus />
                    <span>Record Payment</span>
                  </button>
                )}
              </div>
            </div>

            {/* Error Banner if API fails */}
            {apiError && (
              <div className="auth-error-banner" role="alert" style={{ marginBottom: '20px' }}>
                <span>{apiError}</span>
                <button
                  type="button"
                  onClick={loadData}
                  style={{ marginLeft: 'auto', background: 'none', border: 'none', color: '#1e3a8a', fontWeight: 700, cursor: 'pointer' }}
                >
                  Retry
                </button>
              </div>
            )}

          {/* =========================================================================
              VIEW 1: DYNAMIC CONFIG-DRIVEN OVERVIEW
              ========================================================================= */}
          {activeNav === 'OVERVIEW' && (
            <div className="overview-container">
              {/* Dynamic KPI Cards */}
              <div className="stats-grid">
                {ws.businessType === 'TRAINING' ? (
                  <>
                    <div className="stat-card stat-card-interactive" onClick={() => { setActiveNav('RECORDS'); setParticipantSubTab('ALL'); }}>
                      <div className="stat-card-top">
                        <div className="stat-card-icon">
                          <Icons.Users />
                        </div>
                        <span className="stat-card-badge">View All &rarr;</span>
                      </div>
                      <div className="stat-card-info">
                        <h3>{participants.length}</h3>
                        <p>Total Participants</p>
                      </div>
                    </div>

                    <div className="stat-card stat-card-interactive" onClick={() => setActiveNav('COHORTS')}>
                      <div className="stat-card-top">
                        <div className="stat-card-icon purple">
                          <Icons.Layers />
                        </div>
                        <span className="stat-card-badge purple">Cohorts &rarr;</span>
                      </div>
                      <div className="stat-card-info">
                        <h3 className="stat-text-truncate" title={trainingDashboard?.activeBatch?.name || (trainingBatches[0]?.name || 'None')}>
                          {trainingDashboard?.activeBatch?.name || (trainingBatches[0]?.name || 'None')}
                        </h3>
                        <p>Active Training Batch</p>
                      </div>
                    </div>

                    <div className="stat-card stat-card-interactive" onClick={() => setActiveNav('PAYMENTS')}>
                      <div className="stat-card-top">
                        <div className="stat-card-icon success">
                          <Icons.DollarSign />
                        </div>
                        <span className="stat-card-badge success">Paid</span>
                      </div>
                      <div className="stat-card-info">
                        <h3>
                          {(trainingDashboard?.totalCollected != null ? trainingDashboard.totalCollected : (dashboardData?.stats?.totalCollected || 0)).toLocaleString()} <span className="stat-currency">{ws.currency || 'NGN'}</span>
                        </h3>
                        <p>Total Fees Collected</p>
                      </div>
                    </div>

                    <div className="stat-card stat-card-interactive" onClick={() => setActiveNav('PAYMENTS')}>
                      <div className="stat-card-top">
                        <div className="stat-card-icon warning">
                          <Icons.DollarSign />
                        </div>
                        <span className="stat-card-badge warning">Pending</span>
                      </div>
                      <div className="stat-card-info">
                        <h3>
                          {(trainingDashboard?.totalOutstanding != null ? trainingDashboard.totalOutstanding : (dashboardData?.stats?.totalOutstanding || 0)).toLocaleString()} <span className="stat-currency">{ws.currency || 'NGN'}</span>
                        </h3>
                        <p>Outstanding Balance</p>
                      </div>
                    </div>

                    <div className="stat-card stat-card-interactive" onClick={() => setActiveNav('CERTIFICATES')}>
                      <div className="stat-card-top">
                        <div className="stat-card-icon purple">
                          <Icons.Award />
                        </div>
                        <span className="stat-card-badge purple">Issue &rarr;</span>
                      </div>
                      <div className="stat-card-info">
                        <h3>
                          {trainingCertificates.filter((c) => c.status === 'ISSUED').length} <span className="stat-subtext">/ {participants.length}</span>
                        </h3>
                        <p>Certificates Issued</p>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    {(enabledModules.includes('PARTICIPANTS') || enabledModules.includes('CUSTOMERS')) && (
                      <div className="stat-card stat-card-interactive" onClick={() => { setActiveNav('RECORDS'); setParticipantSubTab('ALL'); }}>
                        <div className="stat-card-top">
                          <div className="stat-card-icon">
                            <Icons.Users />
                          </div>
                          <span className="stat-card-badge">View &rarr;</span>
                        </div>
                        <div className="stat-card-info">
                          <h3>{participants.length}</h3>
                          <p>Total {entityLabelPlural}</p>
                        </div>
                      </div>
                    )}

                    {enabledModules.includes('TASKS') && (
                      <div className="stat-card stat-card-interactive" onClick={() => setActiveNav('TASKS')}>
                        <div className="stat-card-top">
                          <div className="stat-card-icon success">
                            <Icons.CheckSquare />
                          </div>
                          <span className="stat-card-badge success">Tasks &rarr;</span>
                        </div>
                        <div className="stat-card-info">
                          <h3>
                            {tasks.filter((t) => t.status === 'COMPLETED').length} <span className="stat-subtext">/ {tasks.length}</span>
                          </h3>
                          <p>Tasks Completed</p>
                        </div>
                      </div>
                    )}

                    {(enabledModules.includes('FINANCE') || enabledModules.includes('PAYMENTS')) && (
                      <div className="stat-card stat-card-interactive" onClick={() => setActiveNav('FINANCE')}>
                        <div className="stat-card-top">
                          <div className="stat-card-icon warning">
                            <Icons.DollarSign />
                          </div>
                          <span className="stat-card-badge warning">Ledger &rarr;</span>
                        </div>
                        <div className="stat-card-info">
                          <h3>
                            {(dashboardData?.stats?.netIncome || 0).toLocaleString()} <span className="stat-currency">{ws.currency || 'NGN'}</span>
                          </h3>
                          <p>Net Revenue</p>
                        </div>
                      </div>
                    )}

                    {enabledModules.includes('INVOICES') && (
                      <div className="stat-card stat-card-interactive" onClick={() => setActiveNav('INVOICES')}>
                        <div className="stat-card-top">
                          <div className="stat-card-icon">
                            <Icons.FileText />
                          </div>
                          <span className="stat-card-badge">Billing &rarr;</span>
                        </div>
                        <div className="stat-card-info">
                          <h3>{invoices.filter((i) => i.status === 'PENDING').length}</h3>
                          <p>Pending Invoices</p>
                        </div>
                      </div>
                    )}

                    {enabledModules.includes('STAFF') && (
                      <div className="stat-card stat-card-interactive" onClick={() => setActiveNav('STAFF')}>
                        <div className="stat-card-top">
                          <div className="stat-card-icon purple">
                            <Icons.UserCheck />
                          </div>
                          <span className="stat-card-badge purple">Team &rarr;</span>
                        </div>
                        <div className="stat-card-info">
                          <h3>{staff.length}</h3>
                          <p>Active Team Members</p>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Two-Column Layout: Modules + Quick Actions */}
              <div className="overview-split-grid">
                {/* Active Operational Modules */}
                <div className="section-card">
                  <div className="section-card-header">
                    <h2 className="section-card-title">
                      <span className="icon-holder"><Icons.Grid /></span>
                      Active Workspace Modules
                    </h2>
                    <span className="badge-business-type">
                      Configured for <strong>{ws.businessType}</strong>
                    </span>
                  </div>

                  <div className="modules-grid">
                    {(enabledModules.includes('PARTICIPANTS') || enabledModules.includes('CUSTOMERS')) && (
                      <div className="module-card">
                        <div className="module-card-header">
                          <div className="module-card-title"><Icons.Users /> <span>{entityLabelPlural} Directory</span></div>
                          <span className="module-status-badge">ACTIVE</span>
                        </div>
                        <p>Track {entityLabel.toLowerCase()} records, enrollment details, and custom attributes.</p>
                        <button type="button" className="btn-module-action" onClick={() => { setActiveNav('RECORDS'); setParticipantSubTab('ALL'); }}>
                          <span>Manage {entityLabelPlural}</span>
                          <Icons.ChevronRight />
                        </button>
                      </div>
                    )}

                    {enabledModules.includes('TASKS') && (
                      <div className="module-card">
                        <div className="module-card-header">
                          <div className="module-card-title"><Icons.CheckSquare /> <span>Tasks & Workflow</span></div>
                          <span className="module-status-badge">ACTIVE</span>
                        </div>
                        <p>Assign tasks, set priorities, and track operational checklist items.</p>
                        <button type="button" className="btn-module-action" onClick={() => setActiveNav('TASKS')}>
                          <span>Open Tasks</span>
                          <Icons.ChevronRight />
                        </button>
                      </div>
                    )}

                    {(enabledModules.includes('FINANCE') || enabledModules.includes('PAYMENTS')) && (
                      <div className="module-card">
                        <div className="module-card-header">
                          <div className="module-card-title"><Icons.DollarSign /> <span>Finance & Payments</span></div>
                          <span className="module-status-badge">ACTIVE</span>
                        </div>
                        <p>Track cash inflows, operational expenses, and payments ledger.</p>
                        <button type="button" className="btn-module-action" onClick={() => setActiveNav('FINANCE')}>
                          <span>View Ledger</span>
                          <Icons.ChevronRight />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="section-card">
                  <div className="section-card-header">
                    <h2 className="section-card-title">
                      <span className="icon-holder"><Icons.Plus /></span>
                      Quick Actions
                    </h2>
                  </div>
                  <div className="modules-grid">
                    <div className="module-card">
                      <div className="module-card-header">
                        <div className="module-card-title"><Icons.Plus /> <span>Add Record</span></div>
                        <span className="quick-action-tag">Instant</span>
                      </div>
                      <p>Quickly add a new {entityLabel.toLowerCase()} to your directory.</p>
                      <button type="button" className="btn-module-action btn-module-primary" onClick={() => setShowAddChoiceModal(true)}>
                        <span>Add {entityLabel}</span>
                        <Icons.Plus />
                      </button>
                    </div>

                    {ws.businessType === 'TRAINING' && (
                      <div className="module-card">
                        <div className="module-card-header">
                          <div className="module-card-title"><Icons.Award /> <span>Issue Certificate</span></div>
                          <span className="quick-action-tag">Credentials</span>
                        </div>
                        <p>Generate and issue completion certificates for trained participants.</p>
                        <button type="button" className="btn-module-action btn-module-primary" onClick={() => setActiveNav('CERTIFICATES')}>
                          <span>View Certificates</span>
                          <Icons.ChevronRight />
                        </button>
                      </div>
                    )}

                    {enabledModules.includes('TASKS') && (
                      <div className="module-card">
                        <div className="module-card-header">
                          <div className="module-card-title"><Icons.CheckSquare /> <span>Create Task</span></div>
                          <span className="quick-action-tag">Operations</span>
                        </div>
                        <p>Set up a new task with priority and deadline for your team.</p>
                        <button type="button" className="btn-module-action" onClick={() => setShowTaskModal(true)}>
                          <span>New Task</span>
                          <Icons.Plus />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Recent Activity Audit Logs */}
              <div className="section-card">
                <div className="section-card-header">
                  <h2 className="section-card-title">
                    <span className="icon-holder"><Icons.Bell /></span>
                    Recent Workspace Activity
                  </h2>
                  <button
                    type="button"
                    className="btn-link-action"
                    onClick={() => setActiveNav('NOTIFICATIONS')}
                  >
                    View All Activity &rarr;
                  </button>
                </div>

                <div className="activity-stream">
                  {dashboardData?.recentActivity && dashboardData.recentActivity.length > 0 ? (
                    dashboardData.recentActivity.map((act) => {
                      const actionType = act.action || 'EVENT';
                      let badgeColor = 'default';
                      if (actionType.includes('CERTIFICATE')) badgeColor = 'purple';
                      else if (actionType.includes('APPROVED') || actionType.includes('PAID')) badgeColor = 'success';
                      else if (actionType.includes('SUBMITTED')) badgeColor = 'info';
                      else if (actionType.includes('DISABLED') || actionType.includes('DELETED')) badgeColor = 'danger';

                      return (
                        <div key={act.id} className="activity-item">
                          <div className={`activity-avatar ${badgeColor}`}>
                            {actionType.substring(0, 2).toUpperCase()}
                          </div>
                          <div className="activity-details">
                            <p>{act.details}</p>
                            <div className="activity-meta-line">
                              <span className={`activity-action-pill ${badgeColor}`}>{actionType.replace(/_/g, ' ')}</span>
                              <span className="activity-timestamp">
                                <Icons.Clock />
                                {new Date(act.createdAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="empty-state-box">
                      <div className="empty-state-icon"><Icons.Bell /></div>
                      <h4>No Activity Logged Yet</h4>
                      <p>Perform operations in your workspace to view real-time audit logs.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              VIEW 2: GENERIC ENTITY DIRECTORY (Participant / Customer / Client)
              With Sub-Tabs: All | Registration Links | Pending Registrations
              ========================================================================= */}
          {activeNav === 'RECORDS' && !activeEntityRecord && (
            <div>
              {/* Sub-Navigation Tab Bar */}
              <div className="tab-navigation-bar">
                <button
                  type="button"
                  className={`tab-nav-btn ${participantSubTab === 'ALL' ? 'active' : ''}`}
                  onClick={() => setParticipantSubTab('ALL')}
                >
                  <Icons.Users />
                  <span>All {entityLabelPlural}</span>
                  <span className={`tab-badge-pill ${participantSubTab === 'ALL' ? 'active' : ''}`}>{participants.length}</span>
                </button>

                <button
                  type="button"
                  className={`tab-nav-btn ${participantSubTab === 'LINKS' ? 'active' : ''}`}
                  onClick={() => setParticipantSubTab('LINKS')}
                >
                  <Icons.Link />
                  <span>Registration Links</span>
                  <span className={`tab-badge-pill ${participantSubTab === 'LINKS' ? 'active' : ''}`}>{registrationLinks.length}</span>
                </button>

                <button
                  type="button"
                  className={`tab-nav-btn ${participantSubTab === 'PENDING' ? 'active' : ''}`}
                  onClick={() => setParticipantSubTab('PENDING')}
                >
                  <Icons.CheckSquare />
                  <span>Pending Registrations</span>
                  {pendingSubmissions.filter((s) => s.status === 'PENDING').length > 0 ? (
                    <span className="tab-badge-pill warning">
                      {pendingSubmissions.filter((s) => s.status === 'PENDING').length}
                    </span>
                  ) : (
                    <span className="tab-badge-pill">0</span>
                  )}
                </button>
              </div>

              {/* SUB-TAB 1: ALL PARTICIPANTS */}
              {participantSubTab === 'ALL' && (
                <div className="section-card">
                  <div className="section-card-header">
                    <div className="search-box" style={{ width: '340px' }}>
                      <span className="search-icon"><Icons.Search /></span>
                      <input
                        type="text"
                        placeholder={`Search by Ref ID, name, email...`}
                        value={recordSearch}
                        onChange={(e) => setRecordSearch(e.target.value)}
                      />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      {ws.businessType === 'TRAINING' && trainingBatches.length > 0 && (
                        <select
                          value={batchFilter}
                          onChange={(e) => setBatchFilter(e.target.value)}
                          style={{ padding: '6px 10px', fontSize: '12.5px', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#fff' }}
                        >
                          <option value="ALL">All Batches</option>
                          {trainingBatches.map((b) => (
                            <option key={b.id} value={b.id}>{b.name}</option>
                          ))}
                        </select>
                      )}
                      <span style={{ fontSize: '13px', color: '#64748b' }}>
                        Total: <strong>{participants.filter(p => batchFilter === 'ALL' || p.batchId === batchFilter).length}</strong> {entityLabelPlural.toLowerCase()}
                      </span>
                      <button
                        type="button"
                        className="btn-nav-primary"
                        onClick={() => setShowAddChoiceModal(true)}
                        style={{ padding: '6px 14px', fontSize: '12.5px' }}
                      >
                        <Icons.Plus />
                        <span>Add {entityLabel}</span>
                      </button>
                    </div>
                  </div>

                  {participants.filter(p => batchFilter === 'ALL' || p.batchId === batchFilter).length > 0 ? (
                    <div className="table-wrapper">
                      <table className="data-table">
                        <thead>
                          <tr>
                            <th>Ref ID</th>
                            <th>{entityLabel} Name</th>
                            {ws.businessType === 'TRAINING' && <th>Batch</th>}
                            <th>Email & Contact</th>
                            <th>Status</th>
                            {ws.businessType === 'TRAINING' && <th>Certificate</th>}
                            {ws.businessType === 'TRAINING' && <th>Uploads</th>}
                            {ws.businessType !== 'TRAINING' && <th>Custom Attributes</th>}
                            <th>Registered Date</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {participants
                            .filter(p => batchFilter === 'ALL' || p.batchId === batchFilter)
                            .map((record) => (
                            <tr key={record.id}>
                              <td>
                                {record.refId ? (
                                  <span className="ref-badge">{record.refId}</span>
                                ) : (
                                  <span style={{ color: '#94a3b8', fontSize: '11.5px' }}>—</span>
                                )}
                              </td>
                              <td>
                                <strong style={{ color: '#1e3a8a' }}>
                                  {record.fullName}
                                </strong>
                              </td>
                              {ws.businessType === 'TRAINING' && (
                                <td>
                                  {record.batch?.name ? (
                                    <span style={{ fontWeight: 600, color: '#334155', background: '#f1f5f9', padding: '2px 8px', borderRadius: '4px', fontSize: '12px' }}>
                                      {record.batch.name}
                                    </span>
                                  ) : (
                                    <span style={{ color: '#94a3b8', fontSize: '12px' }}>Unassigned</span>
                                  )}
                                </td>
                              )}
                              <td>
                                <div>{record.email}</div>
                                {record.phone && <div style={{ fontSize: '11.5px', color: '#64748b' }}>{record.phone}</div>}
                              </td>
                              <td>
                                <span className={`status-badge ${record.status}`}>{record.status}</span>
                              </td>
                              {ws.businessType === 'TRAINING' && (
                                <td>
                                  <span className={`status-badge ${record.certificateStatus === 'ISSUED' ? 'ACTIVE' : 'PENDING'}`}>
                                    {record.certificateStatus || 'PENDING'}
                                  </span>
                                </td>
                              )}
                              {ws.businessType === 'TRAINING' && (
                                <td>
                                  {record.metadata && Object.values(record.metadata).some(v => typeof v === 'string' && v.startsWith('data:image/')) ? (
                                    <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                                      {Object.entries(record.metadata)
                                        .filter(([_, v]) => typeof v === 'string' && v.startsWith('data:image/'))
                                        .map(([k, v]) => (
                                          <a key={k} href={v as string} target="_blank" rel="noreferrer" style={{ fontSize: '11px', color: '#2563eb', textDecoration: 'underline' }}>
                                            Uploaded
                                          </a>
                                        ))}
                                    </div>
                                  ) : (
                                    <span style={{ fontSize: '12px', color: '#94a3b8' }}>—</span>
                                  )}
                                </td>
                              )}
                              {ws.businessType !== 'TRAINING' && (
                                <td>
                                  {record.metadata && Object.keys(record.metadata).length > 0 ? (
                                    <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                                      {Object.entries(record.metadata).slice(0, 2).map(([k, v]) => (
                                        <span key={k} style={{ fontSize: '11px', background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px' }}>
                                          {k}: <strong>
                                            {typeof v === 'string' && v.startsWith('data:image/') ? (
                                              <a href={v} target="_blank" rel="noreferrer" style={{ color: '#2563eb', textDecoration: 'underline' }}>Uploaded</a>
                                            ) : (
                                              String(v).length > 60 ? String(v).substring(0, 60) + '...' : String(v)
                                            )}
                                          </strong>
                                        </span>
                                      ))}
                                    </div>
                                  ) : (
                                    <span style={{ fontSize: '12px', color: '#94a3b8' }}>—</span>
                                  )}
                                </td>
                              )}
                              <td>{new Date(record.createdAt).toLocaleDateString()}</td>
                              <td>
                                <div className="table-actions">
                                  {ws.businessType === 'TRAINING' && (
                                    <button
                                      type="button"
                                      className="btn-action-icon"
                                      onClick={() => {
                                        setPaymentParticipantId(record.id);
                                        setPaymentBatchId(record.batchId || '');
                                        setShowPaymentModal(true);
                                      }}
                                      title="Record Payment"
                                      style={{ color: '#16a34a' }}
                                    >
                                      <Icons.DollarSign />
                                    </button>
                                  )}
                                  {ws.businessType !== 'TRAINING' && (
                                    <button
                                      type="button"
                                      className="btn-action-icon"
                                      onClick={() => setActiveEntityRecord(record)}
                                      title="View Details"
                                      style={{ color: '#2563eb' }}
                                    >
                                      <Icons.FileText />
                                    </button>
                                  )}
                                  <button
                                    type="button"
                                    className="btn-action-icon btn-action-delete"
                                    disabled={isDeletingParticipant === record.id}
                                    onClick={() => handleDeleteEntityRecord(record.id)}
                                    title={`Delete ${entityLabel}`}
                                  >
                                    {isDeletingParticipant === record.id ? '…' : <Icons.Trash />}
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="empty-state-box">
                      <div className="empty-state-icon"><Icons.Users /></div>
                      <h4>No {entityLabelPlural.toLowerCase()} yet</h4>
                      <p>Add your first {entityLabel.toLowerCase()} manually or share a registration link.</p>
                      <button type="button" className="btn-nav-primary" onClick={() => setShowAddChoiceModal(true)}>
                        <Icons.Plus />
                        <span>Add {entityLabel}</span>
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* SUB-TAB 2: REGISTRATION LINKS */}
              {participantSubTab === 'LINKS' && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <div>
                      <h3 style={{ margin: '0 0 2px 0', fontSize: '16px', fontWeight: 700 }}>Shareable Registration Links</h3>
                      <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>
                        Create branded public registration forms for participants to register themselves.
                      </p>
                    </div>
                    <button
                      type="button"
                      className="btn-nav-primary"
                      onClick={() => setShowCreateLinkModal(true)}
                    >
                      <Icons.Plus />
                      <span>Create Registration Link</span>
                    </button>
                  </div>

                  {registrationLinks.length > 0 ? (
                    <div className="links-grid">
                      {registrationLinks.map((link) => {
                        const isExpired = link.status === 'EXPIRED' || (link.deadline && new Date() > new Date(link.deadline));
                        const isFull = link.status === 'FULL';
                        const isDisabled = link.status === 'DISABLED';
                        const displayStatus = isDisabled ? 'DISABLED' : isExpired ? 'EXPIRED' : isFull ? 'FULL' : 'ACTIVE';

                        return (
                          <div key={link.id} className="link-card">
                            <div className="link-card-header">
                              <div>
                                <h4 className="link-card-title">{link.name}</h4>
                                {link.program && <p className="link-card-prog">{link.program}</p>}
                              </div>
                              <span className={`status-badge ${displayStatus}`}>
                                {displayStatus}
                              </span>
                            </div>

                            {link.description && (
                              <p style={{ fontSize: '12.5px', color: '#64748b', margin: '0', lineHeight: 1.4 }}>
                                {link.description}
                              </p>
                            )}

                            <div className="link-card-stats">
                              <div>
                                <strong>{link._count?.submissions || 0}</strong>
                                {link.maxParticipants ? ` / ${link.maxParticipants}` : ''} registered
                              </div>
                              {link.deadline && (
                                <div style={{ marginLeft: 'auto' }}>
                                  Expires: <strong>{new Date(link.deadline).toLocaleDateString()}</strong>
                                </div>
                              )}
                            </div>

                            <div className="link-card-actions">
                              <div style={{ display: 'flex', gap: '6px' }}>
                                <button
                                  type="button"
                                  className="btn-nav-secondary"
                                  style={{ padding: '6px 12px', fontSize: '12px' }}
                                  onClick={() => handleCopyLinkUrl(link.slug)}
                                  title="Copy Link URL"
                                >
                                  <Icons.Copy />
                                  <span>{copyFeedback ? 'Copied!' : 'Copy Link'}</span>
                                </button>
                                <button
                                  type="button"
                                  className="btn-nav-secondary"
                                  style={{ padding: '6px 12px', fontSize: '12px' }}
                                  onClick={() => {
                                    setSelectedLinkForShare(link);
                                    setShowShareModal(true);
                                  }}
                                  title="Share to WhatsApp / Email"
                                >
                                  <Icons.Share />
                                  <span>Share</span>
                                </button>
                              </div>

                              <div style={{ display: 'flex', gap: '4px' }}>
                                <button
                                  type="button"
                                  className="btn-action-icon"
                                  onClick={() => handleToggleLinkStatus(link)}
                                  title={isDisabled ? 'Enable Link' : 'Disable Link'}
                                >
                                  <Icons.Settings />
                                </button>
                                <button
                                  type="button"
                                  className="btn-action-icon btn-action-delete"
                                  onClick={() => handleDeleteRegistrationLink(link.id)}
                                  title="Delete Link"
                                >
                                  <Icons.Trash />
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="section-card empty-state-box">
                      <div className="empty-state-icon"><Icons.Link /></div>
                      <h4>No registration links yet</h4>
                      <p>Create a shareable registration form and let participants register themselves.</p>
                      <button
                        type="button"
                        className="btn-nav-primary"
                        onClick={() => setShowCreateLinkModal(true)}
                      >
                        <Icons.Plus />
                        <span>Create Registration Link</span>
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* SUB-TAB 3: PENDING REGISTRATIONS */}
              {participantSubTab === 'PENDING' && (
                <div className="section-card">
                  <div className="section-card-header">
                    <div>
                      <h3 style={{ margin: '0 0 2px 0', fontSize: '15px', fontWeight: 700 }}>Pending Participant Registrations</h3>
                      <p style={{ margin: 0, fontSize: '12.5px', color: '#64748b' }}>
                        Review, approve, or reject participant self-registrations. Approved entries automatically receive their Reference ID.
                      </p>
                    </div>
                  </div>

                  {pendingSubmissions.filter((s) => s.status === 'PENDING').length > 0 ? (
                    <div className="table-wrapper">
                      <table className="data-table">
                        <thead>
                          <tr>
                            <th>Submitter Name</th>
                            <th>Email & Phone</th>
                            <th>Program / Link</th>
                            <th>Submitted Details</th>
                            <th>Date</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {pendingSubmissions
                            .filter((s) => s.status === 'PENDING')
                            .map((sub) => (
                              <tr key={sub.id}>
                                <td>
                                  <strong>{sub.fullName}</strong>
                                </td>
                                <td>
                                  <div>{sub.email}</div>
                                  {sub.phone && <div style={{ fontSize: '11.5px', color: '#64748b' }}>{sub.phone}</div>}
                                </td>
                                <td>
                                  <strong>{sub.registrationLink?.name || 'Self-Registration'}</strong>
                                  {sub.registrationLink?.program && (
                                    <div style={{ fontSize: '11.5px', color: '#64748b' }}>{sub.registrationLink.program}</div>
                                  )}
                                </td>
                                <td>
                                  {sub.formData && Object.keys(sub.formData).length > 0 ? (
                                    <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                                      {Object.entries(sub.formData)
                                        .filter(([k]) => !['fullName', 'email', 'phone'].includes(k))
                                        .slice(0, 3)
                                        .map(([k, v]) => (
                                          <span key={k} style={{ fontSize: '11px', background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px' }}>
                                            {k}: <strong>
                                              {typeof v === 'string' && v.startsWith('data:image/') ? (
                                                <a href={v} target="_blank" rel="noreferrer" style={{ color: '#2563eb', textDecoration: 'underline' }}>Uploaded</a>
                                              ) : (
                                                String(v).length > 60 ? String(v).substring(0, 60) + '...' : String(v)
                                              )}
                                            </strong>
                                          </span>
                                        ))}
                                    </div>
                                  ) : (
                                    <span style={{ fontSize: '12px', color: '#94a3b8' }}>—</span>
                                  )}
                                </td>
                                <td>{new Date(sub.submittedAt).toLocaleDateString()}</td>
                                <td>
                                  <div style={{ display: 'flex', gap: '6px' }}>
                                    <button
                                      type="button"
                                      className="btn-nav-primary"
                                      style={{ padding: '5px 10px', fontSize: '12px', background: '#16a34a' }}
                                      onClick={() => handleApproveSubmission(sub)}
                                      disabled={isApproving === sub.id}
                                    >
                                      <Icons.CheckCircle />
                                      <span>{isApproving === sub.id ? 'Approving...' : 'Approve'}</span>
                                    </button>
                                    <button
                                      type="button"
                                      className="btn-action-icon btn-action-delete"
                                      onClick={() => {
                                        setSelectedSubmissionForReject(sub);
                                        setShowRejectModal(true);
                                      }}
                                      title="Reject Submission"
                                    >
                                      <Icons.XCircle />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="empty-state-box">
                      <div className="empty-state-icon"><Icons.CheckSquare /></div>
                      <h4>No pending registrations</h4>
                      <p>All submitted registrations have been reviewed. Share your registration link to collect more.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Record 360 Detail View */}
          {activeNav === 'RECORDS' && activeEntityRecord && (
            <div>
              <button
                type="button"
                className="btn-nav-secondary"
                style={{ marginBottom: '16px' }}
                onClick={() => setActiveEntityRecord(null)}
              >
                ← Back to {entityLabelPlural} Directory
              </button>

              <div className="customer-profile-header">
                <div className="customer-header-main">
                  <div className="customer-avatar-large">
                    {activeEntityRecord.fullName ? activeEntityRecord.fullName[0].toUpperCase() : 'R'}
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <h2 style={{ margin: 0, fontSize: '18px' }}>
                        {activeEntityRecord.fullName}
                      </h2>
                      {activeEntityRecord.refId && (
                        <span className="ref-badge">{activeEntityRecord.refId}</span>
                      )}
                    </div>
                    <p style={{ margin: '0 0 8px 0', fontSize: '13px', color: '#64748b' }}>
                      {activeEntityRecord.email} {activeEntityRecord.phone ? `· ${activeEntityRecord.phone}` : ''}
                    </p>
                    <span className={`status-badge ${activeEntityRecord.status}`}>{activeEntityRecord.status}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  {activeEntityRecord.phone && (
                    <a href={`tel:${activeEntityRecord.phone}`} className="btn-nav-secondary">
                      <Icons.Phone /> <span>Call</span>
                    </a>
                  )}
                  <a href={`mailto:${activeEntityRecord.email}`} className="btn-nav-secondary">
                    <Icons.Mail /> <span>Email</span>
                  </a>
                </div>
              </div>

              <div className="section-card">
                <h4 style={{ margin: '0 0 16px 0', fontSize: '14px', fontWeight: 700, color: '#1e3a8a' }}>
                  Configured {entityLabel} Attributes
                </h4>
                <div className="profile-form-grid">
                  {activeEntityRecord.refId && (
                    <div>
                      <label style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Reference ID</label>
                      <p style={{ margin: '4px 0 0 0', fontWeight: 700, fontFamily: 'monospace', color: '#1e3a8a' }}>{activeEntityRecord.refId}</p>
                    </div>
                  )}
                  <div>
                    <label style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Full Name</label>
                    <p style={{ margin: '4px 0 0 0', fontWeight: 600 }}>{activeEntityRecord.fullName}</p>
                  </div>
                  <div>
                    <label style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Email</label>
                    <p style={{ margin: '4px 0 0 0', fontWeight: 600 }}>{activeEntityRecord.email}</p>
                  </div>
                  {activeEntityRecord.phone && (
                    <div>
                      <label style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Phone</label>
                      <p style={{ margin: '4px 0 0 0', fontWeight: 600 }}>{activeEntityRecord.phone}</p>
                    </div>
                  )}
                  {activeEntityRecord.metadata && Object.entries(activeEntityRecord.metadata).map(([key, val]) => (
                    <div key={key}>
                      <label style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>
                        {key.replace(/_/g, ' ')}
                      </label>
                      <p style={{ margin: '4px 0 0 0', fontWeight: 600 }}>{String(val || '—')}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              VIEW 3: TASKS MODULE
              ========================================================================= */}
          {activeNav === 'TASKS' && (
            <div className="section-card">
              <div className="section-card-header">
                <div className="status-filter-pills">
                  {['ALL', 'TODO', 'IN_PROGRESS', 'COMPLETED'].map((st) => (
                    <button
                      key={st}
                      type="button"
                      className={`filter-pill ${taskStatusFilter === st ? 'active' : ''}`}
                      onClick={() => setTaskStatusFilter(st)}
                    >
                      {st.replace('_', ' ')}
                    </button>
                  ))}
                </div>

                <div className="search-box">
                  <span className="search-icon"><Icons.Search /></span>
                  <input
                    type="text"
                    placeholder="Search tasks..."
                    value={taskSearch}
                    onChange={(e) => setTaskSearch(e.target.value)}
                  />
                </div>
              </div>

              {tasks.length > 0 ? (
                <div className="table-wrapper">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Task Title</th>
                        <th>Assignee</th>
                        <th>Priority</th>
                        <th>Due Date</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tasks.map((task) => (
                        <tr key={task.id}>
                          <td>
                            <strong>{task.title}</strong>
                            {task.description && <div style={{ fontSize: '12px', color: '#64748b' }}>{task.description}</div>}
                          </td>
                          <td>{task.assigneeName || 'Unassigned'}</td>
                          <td><span className={`task-priority-pill ${task.priority}`}>{task.priority}</span></td>
                          <td>{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No date'}</td>
                          <td><span className={`status-badge ${task.status}`}>{task.status.replace('_', ' ')}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="empty-state-box">
                  <div className="empty-state-icon"><Icons.CheckSquare /></div>
                  <h4>No tasks found</h4>
                  <p>Create your first task to coordinate assignments across your staff.</p>
                </div>
              )}
            </div>
          )}

          {/* =========================================================================
              VIEW 4: STAFF MODULE
              ========================================================================= */}
          {activeNav === 'STAFF' && (
            <div className="section-card">
              <div className="section-card-header">
                <h2 className="section-card-title">Staff & Workspace Members</h2>
                <div style={{ fontSize: '13px', color: '#64748b' }}>
                  Total: <strong>{staff.length}</strong> active members
                </div>
              </div>

              <div className="table-wrapper">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Name / Email</th>
                      <th>Role</th>
                      <th>Department</th>
                      <th>Status</th>
                      <th>Joined Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {staff.map((s) => (
                      <tr key={s.id}>
                        <td>
                          <strong>{s.fullName || s.email}</strong>
                          <div style={{ fontSize: '12px', color: '#64748b' }}>{s.email}</div>
                        </td>
                        <td><span className="summary-pill" style={{ margin: 0 }}>{s.role}</span></td>
                        <td>{s.department || 'Operations'}</td>
                        <td><span className={`status-badge ${s.status}`}>{s.status}</span></td>
                        <td>{s.joinedAt ? new Date(s.joinedAt).toLocaleDateString() : 'N/A'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* =========================================================================
              VIEW: ACADEMIC & TRAINING MODULES
              ========================================================================= */}
          {activeNav === 'CLASSES' && (
            <div className="section-card">
              <div className="section-card-header">
                <div>
                  <h2 className="section-card-title">Classes & Sections</h2>
                  <p style={{ margin: '4px 0 0 0', fontSize: '12.5px', color: '#64748b' }}>
                    Manage academic classes, section allocations, and student rosters.
                  </p>
                </div>
                <button type="button" className="btn-nav-primary" onClick={() => alert('New Class creation modal')}>
                  <Icons.Plus /> <span>New Class</span>
                </button>
              </div>

              <div className="stats-grid" style={{ marginBottom: '20px' }}>
                <div className="stat-card">
                  <div className="stat-card-info">
                    <h3>8</h3>
                    <p>Active Classrooms</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-card-info">
                    <h3>{participants.length}</h3>
                    <p>Enrolled Students</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-card-info">
                    <h3>100%</h3>
                    <p>Teacher Assigned</p>
                  </div>
                </div>
              </div>

              <div className="table-wrapper">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Class Name</th>
                      <th>Level / Grade</th>
                      <th>Class Teacher</th>
                      <th>Enrolled Students</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {['Grade 1 - Alpha', 'Grade 2 - Beta', 'Grade 3 - Gamma', 'JSS 1 - Gold', 'SS 2 - Science'].map((c, i) => (
                      <tr key={c}>
                        <td><strong>{c}</strong></td>
                        <td>Level {i + 1}</td>
                        <td>{staff[i % Math.max(staff.length, 1)]?.fullName || 'Assigned Instructor'}</td>
                        <td>{Math.max(12, Math.floor(participants.length / 5))} students</td>
                        <td><span className="status-badge ACTIVE">ACTIVE</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeNav === 'ACADEMIC_SESSIONS' && (
            <div className="section-card">
              <div className="section-card-header">
                <div>
                  <h2 className="section-card-title">Academic Sessions & Terms</h2>
                  <p style={{ margin: '4px 0 0 0', fontSize: '12.5px', color: '#64748b' }}>
                    Configure school calendar sessions, academic terms, and promotional periods.
                  </p>
                </div>
              </div>

              <div className="stats-grid" style={{ marginBottom: '20px' }}>
                <div className="stat-card">
                  <div className="stat-card-info">
                    <h3 style={{ color: '#2563eb' }}>{new Date().getFullYear()} / {new Date().getFullYear() + 1}</h3>
                    <p>Current Academic Year</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-card-info">
                    <h3>Term 2</h3>
                    <p>Active Term</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeNav === 'SUBJECTS' && (
            <div className="section-card">
              <div className="section-card-header">
                <div>
                  <h2 className="section-card-title">Subjects & Academic Curriculum</h2>
                  <p style={{ margin: '4px 0 0 0', fontSize: '12.5px', color: '#64748b' }}>
                    Define subjects taught across departments and class levels.
                  </p>
                </div>
              </div>
              <div className="table-wrapper">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Subject Code</th>
                      <th>Subject Name</th>
                      <th>Department</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { code: 'MTH-101', name: 'Mathematics', dept: 'Sciences' },
                      { code: 'ENG-101', name: 'English Language', dept: 'Arts & Languages' },
                      { code: 'PHY-201', name: 'Physics', dept: 'Sciences' },
                      { code: 'CHM-201', name: 'Chemistry', dept: 'Sciences' },
                      { code: 'ICT-101', name: 'Computer Studies', dept: 'Technology' },
                    ].map((s) => (
                      <tr key={s.code}>
                        <td><strong>{s.code}</strong></td>
                        <td>{s.name}</td>
                        <td>{s.dept}</td>
                        <td><span className="status-badge ACTIVE">ACTIVE</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeNav === 'RESULTS' && (
            <div className="section-card">
              <div className="section-card-header">
                <div>
                  <h2 className="section-card-title">Assessments, Results & Report Cards</h2>
                  <p style={{ margin: '4px 0 0 0', fontSize: '12.5px', color: '#64748b' }}>
                    Record examination scores, calculate term averages, and export student report cards.
                  </p>
                </div>
              </div>
              <div className="stats-grid" style={{ marginBottom: '20px' }}>
                <div className="stat-card">
                  <div className="stat-card-info">
                    <h3>78.4%</h3>
                    <p>Average Performance</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-card-info">
                    <h3>{participants.length}</h3>
                    <p>Graded Students</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeNav === 'FEES' && (
            <div className="section-card">
              <div className="section-card-header">
                <div>
                  <h2 className="section-card-title">Fees & Bursar Collections</h2>
                  <p style={{ margin: '4px 0 0 0', fontSize: '12.5px', color: '#64748b' }}>
                    Track tuition fees, payment schedules, and outstanding balances.
                  </p>
                </div>
              </div>
              <div className="stats-grid" style={{ marginBottom: '20px' }}>
                <div className="stat-card">
                  <div className="stat-card-info">
                    <h3 style={{ color: '#16a34a' }}>{(finance?.summary.totalRevenue || 0).toLocaleString()} {ws.currency}</h3>
                    <p>Collected Fees</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-card-info">
                    <h3 style={{ color: '#d97706' }}>0 {ws.currency}</h3>
                    <p>Outstanding Tuition</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeNav === 'LIBRARY' && (
            <div className="section-card">
              <div className="section-card-header">
                <div>
                  <h2 className="section-card-title">Library & Resource Catalog</h2>
                  <p style={{ margin: '4px 0 0 0', fontSize: '12.5px', color: '#64748b' }}>
                    Manage book inventory, circulation records, and student borrowings.
                  </p>
                </div>
              </div>
              <div className="empty-state-box">
                <div className="empty-state-icon"><Icons.BookOpen /></div>
                <h4>Library Catalog Active</h4>
                <p>Register textbooks, digital media, and track checked-out items.</p>
              </div>
            </div>
          )}

          {activeNav === 'SCHOOL_HEALTH' && (
            <div className="section-card">
              <div className="section-card-header">
                <div>
                  <h2 className="section-card-title">Health Center & Medical Log</h2>
                  <p style={{ margin: '4px 0 0 0', fontSize: '12.5px', color: '#64748b' }}>
                    Track health records, allergies, clinic visits, and emergency contacts.
                  </p>
                </div>
              </div>
              <div className="empty-state-box">
                <div className="empty-state-icon"><Icons.Heart /></div>
                <h4>Health Logs Ready</h4>
                <p>Record medical check-ins, prescriptions, and health incidents securely.</p>
              </div>
            </div>
          )}

          {activeNav === 'GUIDANCE' && (
            <div className="section-card">
              <div className="section-card-header">
                <div>
                  <h2 className="section-card-title">Guidance & Student Welfare</h2>
                  <p style={{ margin: '4px 0 0 0', fontSize: '12.5px', color: '#64748b' }}>
                    Counseling records, behavioral observations, and welfare support logs.
                  </p>
                </div>
              </div>
              <div className="empty-state-box">
                <div className="empty-state-icon"><Icons.Compass /></div>
                <h4>Welfare Center Active</h4>
                <p>Track student support sessions, welfare programs, and parent consultations.</p>
              </div>
            </div>
          )}

          {/* =========================================================================
              VIEW: TRAINING MODULES (Programs, Cohorts, Certificates, Progress)
              ========================================================================= */}
          {activeNav === 'PROGRAMS' && (
            <div className="section-card">
              <div className="section-card-header">
                <div>
                  <h2 className="section-card-title">Training Programs & Courses</h2>
                  <p style={{ margin: '4px 0 0 0', fontSize: '12.5px', color: '#64748b' }}>
                    Manage curriculum tracks, syllabi, and training programs.
                  </p>
                </div>
              </div>
              <div className="table-wrapper">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Program Name</th>
                      <th>Duration</th>
                      <th>Enrolled Participants</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { name: 'Full-Stack Software Development', duration: '12 Weeks' },
                      { name: 'UI/UX Product Design Masterclass', duration: '8 Weeks' },
                      { name: 'Digital Marketing & Growth', duration: '6 Weeks' },
                    ].map((p) => (
                      <tr key={p.name}>
                        <td><strong>{p.name}</strong></td>
                        <td>{p.duration}</td>
                        <td>{participants.length} enrolled</td>
                        <td><span className="status-badge ACTIVE">ACTIVE</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* =========================================================================
              VIEW: COHORTS & TRAINING BATCHES
              ========================================================================= */}
          {(activeNav === 'COHORTS' || activeNav === 'BATCHES') && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div>
                  <h2 className="section-card-title">Cohorts & Training Batches</h2>
                  <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#64748b' }}>
                    Organize training schedules, manage cohort enrollments, and track batch progress.
                  </p>
                </div>
                <button
                  type="button"
                  className="btn-nav-primary"
                  onClick={() => {
                    setEditingBatch(null);
                    setBatchName('');
                    setBatchProgram('');
                    setBatchDesc('');
                    setBatchStartDate('');
                    setBatchEndDate('');
                    setBatchStatus('UPCOMING');
                    setShowBatchModal(true);
                  }}
                >
                  <Icons.Plus />
                  <span>Create Batch</span>
                </button>
              </div>

              {/* Batches Grid */}
              {trainingBatches.length > 0 ? (
                <div className="batches-grid">
                  {trainingBatches.map((batch) => {
                    const enrolledCount = participants.filter((p) => p.batchId === batch.id).length;
                    return (
                      <div key={batch.id} className="batch-card">
                        <div className="batch-card-header">
                          <div>
                            <h3 className="batch-title">{batch.name}</h3>
                            {batch.program && <p className="batch-prog">{batch.program}</p>}
                          </div>
                          <span className={`status-badge ${batch.status === 'ACTIVE' ? 'ACTIVE' : batch.status === 'COMPLETED' ? 'COMPLETED' : 'PENDING'}`}>
                            {batch.status}
                          </span>
                        </div>

                        {batch.description && (
                          <p style={{ fontSize: '13px', color: '#475569', margin: 0, lineHeight: 1.5 }}>
                            {batch.description}
                          </p>
                        )}

                        <div style={{ display: 'flex', gap: '14px', fontSize: '12.5px', color: '#64748b', background: '#f8fafc', padding: '10px 12px', borderRadius: '8px' }}>
                          <div>
                            <span style={{ display: 'block', fontSize: '11px', textTransform: 'uppercase', color: '#94a3b8' }}>Schedule</span>
                            <strong>
                              {batch.startDate ? new Date(batch.startDate).toLocaleDateString() : 'TBD'}
                              {batch.endDate ? ` → ${new Date(batch.endDate).toLocaleDateString()}` : ''}
                            </strong>
                          </div>
                          <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
                            <span style={{ display: 'block', fontSize: '11px', textTransform: 'uppercase', color: '#94a3b8' }}>Enrolled</span>
                            <strong style={{ color: '#1e3a8a' }}>{enrolledCount} participants</strong>
                          </div>
                        </div>

                        <div style={{ display: 'flex', gap: '8px', marginTop: 'auto', paddingTop: '10px', borderTop: '1px solid #f1f5f9' }}>
                          <button
                            type="button"
                            className="btn-nav-secondary"
                            style={{ flex: 1, fontSize: '12px', padding: '6px 10px' }}
                            onClick={() => {
                              setBatchFilter(batch.id);
                              setActiveNav('RECORDS');
                              setParticipantSubTab('ALL');
                            }}
                          >
                            View Enrolled ({enrolledCount})
                          </button>
                          <button
                            type="button"
                            className="btn-action-icon"
                            title="Edit Batch"
                            onClick={() => {
                              setEditingBatch(batch);
                              setBatchName(batch.name);
                              setBatchProgram(batch.program || '');
                              setBatchDesc(batch.description || '');
                              setBatchStartDate(batch.startDate ? batch.startDate.slice(0, 10) : '');
                              setBatchEndDate(batch.endDate ? batch.endDate.slice(0, 10) : '');
                              setBatchStatus(batch.status || 'UPCOMING');
                              setShowBatchModal(true);
                            }}
                          >
                            <Icons.Settings />
                          </button>
                          <button
                            type="button"
                            className="btn-action-icon btn-action-delete"
                            title="Delete Batch"
                            onClick={() => handleDeleteBatch(batch.id)}
                          >
                            <Icons.Trash />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="empty-state-box">
                  <div className="empty-state-icon"><Icons.Users /></div>
                  <h4>No training batches yet</h4>
                  <p>Create your first batch (e.g. "Batch 1", "Batch 2") to organize participants and track payments.</p>
                  <button
                    type="button"
                    className="btn-nav-primary"
                    onClick={() => {
                      setEditingBatch(null);
                      setBatchName('');
                      setBatchProgram('');
                      setBatchDesc('');
                      setBatchStartDate('');
                      setBatchEndDate('');
                      setBatchStatus('UPCOMING');
                      setShowBatchModal(true);
                    }}
                  >
                    <Icons.Plus />
                    <span>Create Training Batch</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* =========================================================================
              VIEW: TRAINING PAYMENTS & FEE LEDGER
              ========================================================================= */}
          {((activeNav === 'PAYMENTS' && ws.businessType === 'TRAINING') || activeNav === 'TRAINING_PAYMENTS') && (
            <div>
              {/* Financial KPI Summary Cards */}
              <div className="stats-grid" style={{ marginBottom: '20px' }}>
                <div className="stat-card">
                  <div className="stat-card-icon success">
                    <Icons.DollarSign />
                  </div>
                  <div className="stat-card-info">
                    <h3 style={{ color: '#16a34a' }}>
                      {(trainingDashboard?.totalCollected != null ? trainingDashboard.totalCollected : (dashboardData?.stats?.totalCollected || 0)).toLocaleString()} {ws.currency || 'NGN'}
                    </h3>
                    <p>Total Fees Collected</p>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-card-icon">
                    <Icons.DollarSign />
                  </div>
                  <div className="stat-card-info">
                    <h3>
                      {(trainingDashboard?.totalExpected != null ? trainingDashboard.totalExpected : (dashboardData?.stats?.totalExpected || 0)).toLocaleString()} {ws.currency || 'NGN'}
                    </h3>
                    <p>Total Expected Fees</p>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-card-icon warning">
                    <Icons.DollarSign />
                  </div>
                  <div className="stat-card-info">
                    <h3 style={{ color: '#d97706' }}>
                      {(trainingDashboard?.totalOutstanding != null ? trainingDashboard.totalOutstanding : (dashboardData?.stats?.totalOutstanding || 0)).toLocaleString()} {ws.currency || 'NGN'}
                    </h3>
                    <p>Outstanding Balance</p>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-card-icon purple">
                    <Icons.FileText />
                  </div>
                  <div className="stat-card-info">
                    <h3>{trainingPayments.length}</h3>
                    <p>Total Payment Transactions</p>
                  </div>
                </div>
              </div>

              {/* Payments Table Card */}
              <div className="section-card">
                <div className="section-card-header">
                  <div>
                    <h2 className="section-card-title">Payment Transactions & Receipts</h2>
                    <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#64748b' }}>
                      Immutable ledger of participant fees, application deposits, and auto-generated receipts.
                    </p>
                  </div>
                  <button
                    type="button"
                    className="btn-nav-primary"
                    onClick={() => {
                      setPaymentParticipantId('');
                      setPaymentBatchId('');
                      setPaymentAmount('');
                      setPaymentNotes('');
                      setPaymentDate('');
                      setShowPaymentModal(true);
                    }}
                  >
                    <Icons.Plus />
                    <span>Record Payment</span>
                  </button>
                </div>

                {trainingPayments.length > 0 ? (
                  <div className="table-wrapper">
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Receipt No.</th>
                          <th>Participant</th>
                          <th>Ref ID</th>
                          <th>Amount Paid</th>
                          <th>Payment For</th>
                          <th>Payment Date</th>
                          <th>Notes</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {trainingPayments.map((p) => (
                          <tr key={p.id}>
                            <td>
                              <span
                                className="ref-badge"
                                style={{ cursor: 'pointer' }}
                                onClick={() => {
                                  if (p.receipt) {
                                    trainingService.getReceiptById(p.receipt.id, ws.id)
                                      .then((res) => setShowReceiptModal(res.data))
                                      .catch(() => setShowReceiptModal(p.receipt as any));
                                  }
                                }}
                                title="Click to view & print receipt"
                              >
                                {p.receiptNumber || (p.receipt?.receiptNumber || 'RCP-GEN')}
                              </span>
                            </td>
                            <td>
                              <strong>{p.participant?.fullName || 'Participant'}</strong>
                            </td>
                            <td>
                              <span className="ref-badge" style={{ background: '#f8fafc', color: '#475569', borderColor: '#e2e8f0' }}>
                                {p.participant?.refId || '—'}
                              </span>
                            </td>
                            <td>
                              <strong style={{ color: '#16a34a' }}>
                                {Number(p.amount).toLocaleString()} {ws.currency || 'NGN'}
                              </strong>
                            </td>
                            <td>
                              <span style={{ fontSize: '12px', fontWeight: 600, background: '#f1f5f9', padding: '2px 8px', borderRadius: '4px' }}>
                                {p.paymentFor === 'APPLICATION_FEE' ? 'Application Fee' : p.paymentFor === 'TRAINING_FEE' ? 'Training Tuition' : p.paymentFor}
                              </span>
                            </td>
                            <td>{new Date(p.paymentDate).toLocaleDateString()}</td>
                            <td>
                              <span style={{ fontSize: '12px', color: '#64748b' }}>{p.notes || '—'}</span>
                            </td>
                            <td>
                              <div className="table-actions">
                                <button
                                  type="button"
                                  className="btn-action-icon"
                                  onClick={() => {
                                    if (p.receipt) {
                                      trainingService.getReceiptById(p.receipt.id, ws.id)
                                        .then((res) => setShowReceiptModal(res.data))
                                        .catch(() => setShowReceiptModal(p.receipt as any));
                                    }
                                  }}
                                  title="View Receipt"
                                  style={{ color: '#2563eb' }}
                                >
                                  <Icons.FileText />
                                </button>
                                <button
                                  type="button"
                                  className="btn-action-icon btn-action-delete"
                                  onClick={() => handleDeletePayment(p.id)}
                                  title="Delete Payment"
                                >
                                  <Icons.Trash />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="empty-state-box">
                    <div className="empty-state-icon"><Icons.DollarSign /></div>
                    <h4>No payments recorded yet</h4>
                    <p>Record your first participant tuition payment or application fee to generate an official receipt.</p>
                    <button
                      type="button"
                      className="btn-nav-primary"
                      onClick={() => setShowPaymentModal(true)}
                    >
                      <Icons.Plus />
                      <span>Record First Payment</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* =========================================================================
              VIEW: PAYMENT RECEIPTS REPOSITORY
              ========================================================================= */}
          {activeNav === 'RECEIPTS' && (
            <div className="section-card">
              <div className="section-card-header">
                <div>
                  <h2 className="section-card-title">Payment Receipts Repository</h2>
                  <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#64748b' }}>
                    View, print, and share verified digital receipts for participant payments.
                  </p>
                </div>
                <div className="search-box" style={{ width: '280px' }}>
                  <span className="search-icon"><Icons.Search /></span>
                  <input
                    type="text"
                    placeholder="Search by receipt number, name..."
                    value={receiptSearch}
                    onChange={(e) => setReceiptSearch(e.target.value)}
                  />
                </div>
              </div>

              {trainingReceipts.length > 0 ? (
                <div className="table-wrapper">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Receipt No.</th>
                        <th>Participant</th>
                        <th>Ref ID</th>
                        <th>Amount Paid</th>
                        <th>Payment Purpose</th>
                        <th>Balance at Time</th>
                        <th>Issue Date</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {trainingReceipts
                        .filter((r) => {
                          if (!receiptSearch.trim()) return true;
                          const q = receiptSearch.toLowerCase();
                          return (
                            r.receiptNumber.toLowerCase().includes(q) ||
                            (r.participant?.fullName || '').toLowerCase().includes(q) ||
                            (r.participant?.refId || '').toLowerCase().includes(q)
                          );
                        })
                        .map((r) => (
                        <tr key={r.id}>
                          <td>
                            <strong style={{ fontFamily: 'monospace', color: '#1e3a8a' }}>
                              {r.receiptNumber}
                            </strong>
                          </td>
                          <td>{r.participant?.fullName || 'Participant'}</td>
                          <td>
                            <span className="ref-badge">{r.participant?.refId || '—'}</span>
                          </td>
                          <td>
                            <strong style={{ color: '#16a34a' }}>
                              {Number(r.amount).toLocaleString()} {ws.currency || 'NGN'}
                            </strong>
                          </td>
                          <td>{r.paymentFor.replace('_', ' ')}</td>
                          <td>
                            <span style={{ color: Number(r.balanceAtTime) > 0 ? '#d97706' : '#16a34a', fontWeight: 600 }}>
                              {Number(r.balanceAtTime).toLocaleString()} {ws.currency || 'NGN'}
                            </span>
                          </td>
                          <td>{new Date(r.issuedAt).toLocaleDateString()}</td>
                          <td>
                            <div className="table-actions">
                              <button
                                type="button"
                                className="btn-action-icon"
                                onClick={() => {
                                  trainingService.getReceiptById(r.id, ws.id)
                                    .then((res) => setShowReceiptModal(res.data))
                                    .catch(() => setShowReceiptModal(r));
                                }}
                                title="View & Print Receipt"
                                style={{ color: '#2563eb' }}
                              >
                                <Icons.FileText />
                              </button>
                              <button
                                type="button"
                                className="btn-action-icon"
                                onClick={() => handleShareReceiptWhatsApp(r)}
                                title="Share via WhatsApp"
                                style={{ color: '#16a34a' }}
                              >
                                <Icons.MessageCircle />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="empty-state-box">
                  <div className="empty-state-icon"><Icons.FileText /></div>
                  <h4>No receipts issued yet</h4>
                  <p>Receipts are automatically generated whenever a payment is recorded.</p>
                </div>
              )}
            </div>
          )}

          {/* =========================================================================
              VIEW: CERTIFICATES & CREDENTIALS
              ========================================================================= */}
          {activeNav === 'CERTIFICATES' && (
            <div>
              {/* Sub-tabs */}
              <div className="tab-navigation-bar" style={{ marginBottom: '20px' }}>
                <button
                  type="button"
                  className={`tab-nav-btn ${certDesignerTab === 'ISSUE' ? 'active' : ''}`}
                  onClick={() => setCertDesignerTab('ISSUE')}
                >
                  <Icons.Award />
                  <span>Issue Certificates</span>
                  <span className={`tab-badge-pill ${certDesignerTab === 'ISSUE' ? 'active' : ''}`}>
                    {trainingCertificates.filter((c) => c.status === 'ISSUED').length} / {participants.length}
                  </span>
                </button>
                <button
                  type="button"
                  className={`tab-nav-btn ${certDesignerTab === 'DESIGN' ? 'active' : ''}`}
                  onClick={() => setCertDesignerTab('DESIGN')}
                >
                  <Icons.Settings />
                  <span>Certificate Designer</span>
                </button>
              </div>

              {certDesignerTab === 'ISSUE' && (
                <>
                  {/* Summary Cards */}
                  <div className="stats-grid" style={{ marginBottom: '20px' }}>
                    <div className="stat-card">
                      <div className="stat-card-icon success"><Icons.Award /></div>
                      <div className="stat-card-info">
                        <h3 style={{ color: '#16a34a' }}>{trainingCertificates.filter((c) => c.status === 'ISSUED').length}</h3>
                        <p>Certificates Issued</p>
                      </div>
                    </div>
                    <div className="stat-card">
                      <div className="stat-card-icon warning"><Icons.CheckSquare /></div>
                      <div className="stat-card-info">
                        <h3 style={{ color: '#d97706' }}>{participants.length - trainingCertificates.filter((c) => c.status === 'ISSUED').length}</h3>
                        <p>Pending Issuance</p>
                      </div>
                    </div>
                    <div className="stat-card">
                      <div className="stat-card-icon"><Icons.Users /></div>
                      <div className="stat-card-info">
                        <h3>{participants.length}</h3>
                        <p>Total Eligible Candidates</p>
                      </div>
                    </div>
                  </div>

                  {/* Candidates Table */}
                  <div className="section-card">
                    <div className="section-card-header">
                      <div>
                        <h2 className="section-card-title">Participant Credentials & Issuance</h2>
                        <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#64748b' }}>
                          Issue verified completion certificates with unique serial numbers (e.g. CERT-001).
                        </p>
                      </div>
                      <div style={{ display: 'flex', gap: '10px' }}>
                        {trainingBatches.length > 0 && (
                          <select
                            value={certBatchFilter}
                            onChange={(e) => setCertBatchFilter(e.target.value)}
                            style={{ padding: '6px 10px', fontSize: '12.5px', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#fff' }}
                          >
                            <option value="ALL">All Batches</option>
                            {trainingBatches.map((b) => (
                              <option key={b.id} value={b.id}>{b.name}</option>
                            ))}
                          </select>
                        )}
                        <select
                          value={certStatusFilter}
                          onChange={(e) => setCertStatusFilter(e.target.value)}
                          style={{ padding: '6px 10px', fontSize: '12.5px', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#fff' }}
                        >
                          <option value="ALL">All Statuses</option>
                          <option value="ISSUED">Issued</option>
                          <option value="PENDING">Pending</option>
                        </select>
                      </div>
                    </div>

                    {participants.length > 0 ? (
                      <div className="table-wrapper">
                        <table className="data-table">
                          <thead>
                            <tr>
                              <th>Participant</th>
                              <th>Ref ID</th>
                              <th>Batch</th>
                              <th>Certificate Serial</th>
                              <th>Status</th>
                              <th>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {participants
                              .filter((p) => {
                                if (certBatchFilter !== 'ALL' && p.batchId !== certBatchFilter) return false;
                                const cert = trainingCertificates.find((c) => c.participantId === p.id);
                                const isIssued = cert?.status === 'ISSUED' || p.certificateStatus === 'ISSUED';
                                if (certStatusFilter === 'ISSUED' && !isIssued) return false;
                                if (certStatusFilter === 'PENDING' && isIssued) return false;
                                return true;
                              })
                              .map((p) => {
                                const cert = trainingCertificates.find((c) => c.participantId === p.id);
                                const isIssued = cert?.status === 'ISSUED' || p.certificateStatus === 'ISSUED';
                                return (
                                  <tr key={p.id}>
                                    <td>
                                      <strong>{p.fullName}</strong>
                                      <div style={{ fontSize: '11.5px', color: '#64748b' }}>{p.email}</div>
                                    </td>
                                    <td><span className="ref-badge">{p.refId || '—'}</span></td>
                                    <td>
                                      <span style={{ fontSize: '12px', fontWeight: 600, color: '#334155' }}>
                                        {p.batch?.name || 'Unassigned'}
                                      </span>
                                    </td>
                                    <td>
                                      {isIssued ? (
                                        <span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#16a34a', background: '#f0fdf4', padding: '2px 8px', borderRadius: '4px' }}>
                                          {cert?.certificateNumber || 'CERT-ISSUED'}
                                        </span>
                                      ) : (
                                        <span style={{ color: '#94a3b8', fontSize: '12px' }}>Not Issued</span>
                                      )}
                                    </td>
                                    <td>
                                      <span className={`status-badge ${isIssued ? 'ACTIVE' : 'PENDING'}`}>
                                        {isIssued ? 'ISSUED' : 'PENDING'}
                                      </span>
                                    </td>
                                    <td>
                                      {isIssued ? (
                                        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                                          <span style={{ fontSize: '12px', color: '#16a34a', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                            <Icons.CheckCircle /> Certified
                                          </span>
                                          <button
                                            type="button"
                                            className="btn-action-icon"
                                            style={{ color: '#2563eb' }}
                                            onClick={() => setShowCertificateModal(cert)}
                                            title="View Certificate"
                                          >
                                            <Icons.FileText />
                                          </button>
                                        </div>
                                      ) : (
                                        <button
                                          type="button"
                                          className="btn-nav-primary"
                                          style={{ padding: '4px 10px', fontSize: '11.5px' }}
                                          disabled={isIssuingCertificate === p.id}
                                          onClick={() => handleIssueCertificate(p.id)}
                                        >
                                          <Icons.Award />
                                          <span>{isIssuingCertificate === p.id ? 'Issuing...' : 'Issue Certificate'}</span>
                                        </button>
                                      )}
                                    </td>
                                  </tr>
                                );
                              })}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="empty-state-box">
                        <div className="empty-state-icon"><Icons.Award /></div>
                        <h4>No participants found</h4>
                        <p>Register participants into batches to track and issue certificates.</p>
                      </div>
                    )}
                  </div>
                </>
              )}

              {certDesignerTab === 'DESIGN' && (
                <div style={{ display: 'grid', gridTemplateColumns: '360px 1fr', gap: '24px', alignItems: 'start' }}>
                  {/* Controls Panel */}
                  <div className="section-card" style={{ padding: '20px' }}>
                    <h3 style={{ margin: '0 0 16px 0', fontSize: '15px', fontWeight: 700 }}>🎨 Template Settings</h3>

                    <div className="form-field-group">
                      <label>Certificate Title</label>
                      <input
                        type="text"
                        value={certTemplate.title}
                        onChange={(e) => setCertTemplate({ ...certTemplate, title: e.target.value })}
                        placeholder="Certificate of Completion"
                      />
                    </div>

                    <div className="form-field-group">
                      <label>Subtitle / Opening Line</label>
                      <input
                        type="text"
                        value={certTemplate.subtitle}
                        onChange={(e) => setCertTemplate({ ...certTemplate, subtitle: e.target.value })}
                        placeholder="This is to certify that"
                      />
                    </div>

                    <div className="form-field-group">
                      <label>Body Text</label>
                      <textarea
                        rows={3}
                        value={certTemplate.bodyText}
                        onChange={(e) => setCertTemplate({ ...certTemplate, bodyText: e.target.value })}
                        placeholder="has successfully completed..."
                      />
                    </div>

                    <div className="form-field-group">
                      <label>Footer / Closing Line</label>
                      <input
                        type="text"
                        value={certTemplate.footerText}
                        onChange={(e) => setCertTemplate({ ...certTemplate, footerText: e.target.value })}
                        placeholder="Issued with distinction by"
                      />
                    </div>

                    <div className="form-grid-2">
                      <div className="form-field-group">
                        <label>Background Color</label>
                        <input
                          type="color"
                          value={certTemplate.bgColor}
                          onChange={(e) => setCertTemplate({ ...certTemplate, bgColor: e.target.value })}
                          style={{ height: '40px', cursor: 'pointer', padding: '2px 4px' }}
                        />
                      </div>
                      <div className="form-field-group">
                        <label>Accent / Border Color</label>
                        <input
                          type="color"
                          value={certTemplate.accentColor}
                          onChange={(e) => setCertTemplate({ ...certTemplate, accentColor: e.target.value })}
                          style={{ height: '40px', cursor: 'pointer', padding: '2px 4px' }}
                        />
                      </div>
                    </div>

                    <div className="form-grid-2">
                      <div className="form-field-group">
                        <label>Text Color</label>
                        <input
                          type="color"
                          value={certTemplate.textColor}
                          onChange={(e) => setCertTemplate({ ...certTemplate, textColor: e.target.value })}
                          style={{ height: '40px', cursor: 'pointer', padding: '2px 4px' }}
                        />
                      </div>
                      <div className="form-field-group">
                        <label>Font Style</label>
                        <select
                          value={certTemplate.fontFamily}
                          onChange={(e) => setCertTemplate({ ...certTemplate, fontFamily: e.target.value })}
                        >
                          <option value="Georgia, serif">Georgia (Classic)</option>
                          <option value="'Times New Roman', serif">Times New Roman</option>
                          <option value="'Palatino Linotype', serif">Palatino (Elegant)</option>
                          <option value="'Book Antiqua', serif">Book Antiqua</option>
                          <option value="Arial, sans-serif">Arial (Modern)</option>
                          <option value="'Trebuchet MS', sans-serif">Trebuchet MS</option>
                        </select>
                      </div>
                    </div>

                    <div className="form-field-group">
                      <label>Border Style</label>
                      <select
                        value={certTemplate.borderStyle}
                        onChange={(e) => setCertTemplate({ ...certTemplate, borderStyle: e.target.value })}
                      >
                        <option value="double">Double Line (Classic)</option>
                        <option value="solid">Single Solid</option>
                        <option value="ridge">Ridge (3D)</option>
                        <option value="groove">Groove</option>
                        <option value="none">No Border</option>
                      </select>
                    </div>

                    <div className="form-field-group">
                      <label>Organization Logo URL</label>
                      <input
                        type="url"
                        value={certTemplate.logoUrl}
                        onChange={(e) => setCertTemplate({ ...certTemplate, logoUrl: e.target.value })}
                        placeholder="https://example.com/logo.png"
                      />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, 'logoUrl')}
                        style={{ marginTop: '6px' }}
                      />
                    </div>

                    <div className="form-field-group">
                      <label>Participant Image Field Key (metadata)</label>
                      <input
                        type="text"
                        value={certTemplate.participantImageField}
                        onChange={(e) => setCertTemplate({ ...certTemplate, participantImageField: e.target.value })}
                        placeholder="e.g. photoUrl"
                      />
                      <p style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>
                        Metadata key where participants upload their passport/photo during registration.
                      </p>
                    </div>

                    <div className="form-field-group">
                      <label>Signature</label>
                      <button
                        type="button"
                        onClick={() => {
                          if (sigCanvasRef.current) {
                            const ctx = sigCanvasRef.current.getContext('2d');
                            if (ctx) {
                              ctx.clearRect(0, 0, sigCanvasRef.current.width, sigCanvasRef.current.height);
                              if (certTemplate.signatureDataUrl) {
                                const img = new Image();
                                img.onload = () => ctx.drawImage(img, 0, 0, sigCanvasRef.current!.width, sigCanvasRef.current!.height);
                                img.src = certTemplate.signatureDataUrl;
                              }
                            }
                          }
                          setShowSignatureModal(true);
                        }}
                        style={{ width: '100%', padding: '10px', fontSize: '13px', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#f8fafc', cursor: 'pointer', textAlign: 'center' }}
                      >
                        {certTemplate.signatureDataUrl ? 'Edit Drawn Signature ✓' : 'Draw Signature'}
                      </button>
                      <input
                        type="url"
                        value={certTemplate.signatureUrl}
                        onChange={(e) => setCertTemplate({ ...certTemplate, signatureUrl: e.target.value })}
                        placeholder="Or paste signature image URL"
                        style={{ marginTop: '8px' }}
                      />
                    </div>

                    <div className="form-field-group">
                      <label style={{ fontSize: '12px', fontWeight: 600, color: '#64748b', marginBottom: '6px' }}>Dynamic Variables (click to insert into body text)</label>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                        {['{{participant_name}}','{{reference_id}}','{{training_name}}','{{batch_name}}','{{certificate_number}}','{{issue_date}}','{{organization_name}}'].map((v) => (
                          <button
                            key={v}
                            type="button"
                            style={{ fontSize: '10.5px', padding: '3px 7px', borderRadius: '4px', border: '1px solid #cbd5e1', background: '#f8fafc', cursor: 'pointer', color: '#1e3a8a', fontFamily: 'monospace' }}
                            onClick={() => setCertTemplate({ ...certTemplate, bodyText: certTemplate.bodyText + ' ' + v })}
                          >
                            {v}
                          </button>
                        ))}
                      </div>
                    </div>

                    <button
                      type="button"
                      className="btn-nav-primary"
                      style={{ width: '100%', justifyContent: 'center', marginTop: '8px' }}
                      disabled={isSavingCertTemplate}
                      onClick={async () => {
                        setIsSavingCertTemplate(true);
                        try {
                          localStorage.setItem(`cert_template_${ws.id}`, JSON.stringify(certTemplate));
                          await new Promise((r) => setTimeout(r, 600));
                          alert('Certificate template saved! It will be applied when issuing new certificates.');
                        } finally {
                          setIsSavingCertTemplate(false);
                        }
                      }}
                    >
                      <Icons.CheckCircle />
                      <span>{isSavingCertTemplate ? 'Saving Template...' : 'Save Certificate Template'}</span>
                    </button>
                  </div>

                  {/* Live Preview Panel */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700 }}>Live Preview</h3>
                      <button
                        type="button"
                        className="btn-nav-secondary"
                        style={{ fontSize: '12px', padding: '6px 12px' }}
                        onClick={() => handleDownloadPdf('cert-preview-canvas', `Certificate_Preview_${ws.name}.pdf`)}
                        disabled={isDownloadingPdf}
                      >
                        <Icons.Printer />
                        <span>{isDownloadingPdf ? 'Exporting...' : 'Export Preview PDF'}</span>
                      </button>
                    </div>
                    <div
                      id="cert-preview-canvas"
                      style={{
                        background: certTemplate.bgColor,
                        border: `12px ${certTemplate.borderStyle} ${certTemplate.accentColor}`,
                        borderRadius: '8px',
                        padding: '50px 60px',
                        fontFamily: certTemplate.fontFamily,
                        color: certTemplate.textColor,
                        textAlign: 'center',
                        minHeight: '500px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '18px',
                        boxShadow: '0 8px 40px rgba(0,0,0,0.12)',
                        position: 'relative',
                      }}
                    >
                      {/* Inner decorative border */}
                      <div style={{
                        position: 'absolute', inset: '16px',
                        border: `2px solid ${certTemplate.accentColor}`,
                        borderRadius: '4px',
                        opacity: 0.4,
                        pointerEvents: 'none',
                      }} />

                      {certTemplate.logoUrl && (
                        <img src={certTemplate.logoUrl} alt="Logo" style={{ height: '64px', objectFit: 'contain', marginBottom: '8px' }} onError={(e) => { (e.target as any).style.display = 'none'; }} />
                      )}

                      <div>
                        <div style={{ fontSize: '11px', letterSpacing: '3px', textTransform: 'uppercase', color: certTemplate.accentColor, fontWeight: 600 }}>{ws.name}</div>
                        <h1 style={{ margin: '8px 0 0 0', fontSize: '32px', fontWeight: 800, color: certTemplate.accentColor, letterSpacing: '1px' }}>
                          {certTemplate.title}
                        </h1>
                      </div>

                      <div style={{ width: '60px', height: '3px', background: certTemplate.accentColor, borderRadius: '2px' }} />

                      <div>
                        <p style={{ margin: 0, fontSize: '14px', fontStyle: 'italic', color: certTemplate.textColor, opacity: 0.7 }}>{certTemplate.subtitle}</p>
                        <p style={{ margin: '10px 0 0 0', fontSize: '26px', fontWeight: 700, color: certTemplate.accentColor }}>Sample Participant Name</p>
                        {participants.length > 0 && (() => {
                          const participantPhoto = extractParticipantPhoto(participants[0]);
                          return participantPhoto ? (
                            <img src={participantPhoto} alt="Participant" style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '4px', border: `1px solid ${certTemplate.accentColor}`, display: 'block', margin: '6px auto' }} onError={(e) => { (e.target as any).style.display = 'none'; }} />
                          ) : null;
                        })()}
                        <p style={{ margin: '10px 0 0 0', fontSize: '13px', lineHeight: 1.8, maxWidth: '480px', color: certTemplate.textColor }}>
                          {certTemplate.bodyText
                            .replace('{{participant_name}}', 'Sample Participant Name')
                            .replace('{{training_name}}', 'Toyota Gearbox Mastery')
                            .replace('{{batch_name}}', 'Batch 3')
                            .replace('{{certificate_number}}', 'CERT-0042')
                            .replace('{{issue_date}}', new Date().toLocaleDateString())
                            .replace('{{organization_name}}', ws.name)
                            .replace('{{reference_id}}', 'GBT-042')}
                        </p>
                      </div>

                      <div style={{ width: '60px', height: '3px', background: certTemplate.accentColor, borderRadius: '2px', opacity: 0.4 }} />

                      <div style={{ display: 'flex', gap: '80px', alignItems: 'flex-end', marginTop: '10px' }}>
                        <div style={{ textAlign: 'center' }}>
                          {certTemplate.signatureDataUrl ? (
                            <img src={certTemplate.signatureDataUrl} alt="Signature" style={{ height: '48px', objectFit: 'contain', marginBottom: '4px' }} onError={(e) => { (e.target as any).style.display = 'none'; }} />
                          ) : certTemplate.signatureUrl ? (
                            <img src={certTemplate.signatureUrl} alt="Signature" style={{ height: '48px', objectFit: 'contain', marginBottom: '4px' }} onError={(e) => { (e.target as any).style.display = 'none'; }} />
                          ) : (
                            <div style={{ height: '48px', borderBottom: `1.5px solid ${certTemplate.accentColor}`, width: '120px', marginBottom: '4px' }} />
                          )}
                          <p style={{ margin: 0, fontSize: '11px', letterSpacing: '1px', textTransform: 'uppercase', opacity: 0.6 }}>Director / CEO</p>
                        </div>
                      </div>

                      <p style={{ margin: 0, fontSize: '10px', opacity: 0.45, letterSpacing: '2px', textTransform: 'uppercase' }}>
                        {certTemplate.footerText} {ws.name} · CERT-0042
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {showSignatureModal && (
            <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }} onClick={() => setShowSignatureModal(false)}>
              <div style={{ background: '#fff', borderRadius: '12px', padding: '24px', width: '90%', maxWidth: '520px' }} onClick={(e) => e.stopPropagation()}>
                <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: 600 }}>Draw Your Signature</h3>
                <p style={{ margin: '0 0 12px 0', fontSize: '12px', color: '#64748b' }}>Use mouse or touch to draw your signature below.</p>
                <div style={{ border: '1px solid #cbd5e1', borderRadius: '8px', background: '#fafafa', padding: '12px', marginBottom: '16px' }}>
                  <canvas
                    ref={sigCanvasRef}
                    width={480}
                    height={160}
                    style={{ width: '100%', height: '160px', cursor: 'crosshair', background: '#fff', touchAction: 'none' }}
                    onMouseDown={handleSigStart}
                    onMouseMove={sigIsDrawing ? handleSigDraw : undefined}
                    onMouseUp={handleSigEnd}
                    onMouseLeave={sigIsDrawing ? handleSigEnd : undefined}
                    onTouchStart={handleSigTouchStart}
                    onTouchMove={sigIsDrawing ? handleSigTouchDraw : undefined}
                    onTouchEnd={handleSigEnd}
                  />
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button
                    type="button"
                    onClick={clearSignatureCanvas}
                    style={{ flex: 1, padding: '10px', fontSize: '13px', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#f8fafc', cursor: 'pointer' }}
                  >
                    Clear
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowSignatureModal(false);
                    }}
                    style={{ flex: 1, padding: '10px', fontSize: '13px', borderRadius: '6px', border: '1px solid #2563eb', background: '#2563eb', color: '#fff', cursor: 'pointer' }}
                  >
                    Save Signature
                  </button>
                </div>
              </div>
            </div>
          )}


          {activeNav === 'PROGRESS_TRACKING' && (
            <div className="section-card">
              <div className="section-card-header">
                <div>
                  <h2 className="section-card-title">Participant Progress Tracking</h2>
                  <p style={{ margin: '4px 0 0 0', fontSize: '12.5px', color: '#64748b' }}>
                    Monitor milestone completions, attendance rates, and assignment submissions.
                  </p>
                </div>
              </div>
              <div className="stats-grid" style={{ marginBottom: '20px' }}>
                <div className="stat-card">
                  <div className="stat-card-info">
                    <h3>86%</h3>
                    <p>Average Completion Rate</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-card-info">
                    <h3>{participants.length}</h3>
                    <p>Tracked Participants</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeNav === 'TRAINERS' && (
            <div className="section-card">
              <div className="section-card-header">
                <div>
                  <h2 className="section-card-title">Instructors & Faculty Directory</h2>
                  <p style={{ margin: '4px 0 0 0', fontSize: '12.5px', color: '#64748b' }}>
                    Manage trainer profiles, course allocations, and teaching schedules.
                  </p>
                </div>
              </div>
              <div className="table-wrapper">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Instructor</th>
                      <th>Specialization</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {staff.map((s) => (
                      <tr key={s.id}>
                        <td><strong>{s.fullName || s.email}</strong></td>
                        <td>{s.department || 'Training Operations'}</td>
                        <td><span className="status-badge ACTIVE">ACTIVE</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* =========================================================================
              VIEW: COMMERCE & RETAIL MODULES
              ========================================================================= */}
          {activeNav === 'PRODUCTS' && (
            <div className="section-card">
              <div className="section-card-header">
                <div>
                  <h2 className="section-card-title">Products & Price Book</h2>
                  <p style={{ margin: '4px 0 0 0', fontSize: '12.5px', color: '#64748b' }}>
                    Catalog items, SKUs, and pricing tiers.
                  </p>
                </div>
              </div>
              <div className="empty-state-box">
                <div className="empty-state-icon"><Icons.ShoppingBag /></div>
                <h4>Product Catalog</h4>
                <p>Add products, variants, barcodes, and pricing tiers.</p>
              </div>
            </div>
          )}

          {activeNav === 'ORDERS' && (
            <div className="section-card">
              <div className="section-card-header">
                <div>
                  <h2 className="section-card-title">Sales & Customer Orders</h2>
                  <p style={{ margin: '4px 0 0 0', fontSize: '12.5px', color: '#64748b' }}>
                    Customer order tracking, invoices, and fulfillment pipeline.
                  </p>
                </div>
              </div>
              <div className="empty-state-box">
                <div className="empty-state-icon"><Icons.FileText /></div>
                <h4>Orders Hub</h4>
                <p>Process incoming sales orders, receipts, and order statuses.</p>
              </div>
            </div>
          )}

          {activeNav === 'INVENTORY' && (
            <div className="section-card">
              <div className="section-card-header">
                <div>
                  <h2 className="section-card-title">Inventory & Stock Management</h2>
                  <p style={{ margin: '4px 0 0 0', fontSize: '12.5px', color: '#64748b' }}>
                    Monitor real-time warehouse stock levels, assets, and low-stock alerts.
                  </p>
                </div>
              </div>
              <div className="empty-state-box">
                <div className="empty-state-icon"><Icons.Package /></div>
                <h4>Stock Control</h4>
                <p>Track quantities, reorder points, and warehouse locations.</p>
              </div>
            </div>
          )}

          {activeNav === 'SUPPLIERS' && (
            <div className="section-card">
              <div className="section-card-header">
                <div>
                  <h2 className="section-card-title">Suppliers & Vendors Directory</h2>
                  <p style={{ margin: '4px 0 0 0', fontSize: '12.5px', color: '#64748b' }}>
                    Maintain vendor profiles, contact information, and purchase orders.
                  </p>
                </div>
              </div>
              <div className="empty-state-box">
                <div className="empty-state-icon"><Icons.Package /></div>
                <h4>Vendor Management</h4>
                <p>Record supplier contacts and track incoming shipments.</p>
              </div>
            </div>
          )}

          {activeNav === 'DISCOUNTS' && (
            <div className="section-card">
              <div className="section-card-header">
                <div>
                  <h2 className="section-card-title">Discounts & Promotions</h2>
                  <p style={{ margin: '4px 0 0 0', fontSize: '12.5px', color: '#64748b' }}>
                    Configure promotional coupons and special rate discounts.
                  </p>
                </div>
              </div>
              <div className="empty-state-box">
                <div className="empty-state-icon"><Icons.Tag /></div>
                <h4>Promotions Engine</h4>
                <p>Create discount campaigns and percentage rebates.</p>
              </div>
            </div>
          )}

          {activeNav === 'ATTENDANCE' && ws.businessType !== 'SCHOOL' && (
            <div className="section-card">
              <div className="section-card-header">
                <div>
                  <h2 className="section-card-title">Attendance & Roll Call</h2>
                  <p style={{ margin: '4px 0 0 0', fontSize: '12.5px', color: '#64748b' }}>
                    Record daily attendance, track absent records, and view participation stats.
                  </p>
                </div>
              </div>
              <div className="stats-grid" style={{ marginBottom: '20px' }}>
                <div className="stat-card">
                  <div className="stat-card-info">
                    <h3 style={{ color: '#16a34a' }}>94.2%</h3>
                    <p>Average Attendance Rate</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-card-info">
                    <h3>{participants.length}</h3>
                    <p>Total Registered</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              VIEW: SCHOOL MODULES
              ========================================================================= */}
          {ws.businessType === 'SCHOOL' && activeNav === 'OVERVIEW' && <SchoolOverview />}
          {ws.businessType === 'SCHOOL' && activeNav === 'RECORDS' && <StudentsPanel />}
          {ws.businessType === 'SCHOOL' && activeNav === 'CLASSES' && <ClassesPanel />}
          {ws.businessType === 'SCHOOL' && activeNav === 'ACADEMIC_SESSIONS' && <AcademicSessionsPanel />}
          {ws.businessType === 'SCHOOL' && activeNav === 'SUBJECTS' && <SubjectsPanel />}
          {ws.businessType === 'SCHOOL' && activeNav === 'ATTENDANCE' && <AttendancePanel />}
          {ws.businessType === 'SCHOOL' && activeNav === 'RESULTS' && <ResultsPanel />}
          {ws.businessType === 'SCHOOL' && activeNav === 'STAFF' && <SchoolStaffPanel />}
          {ws.businessType === 'SCHOOL' && activeNav === 'FEES' && <FeesPanel />}
          {ws.businessType === 'SCHOOL' && activeNav === 'LIBRARY' && <LibraryPanel />}

          {/* =========================================================================
              VIEW 5: FINANCE & INVOICES
              ========================================================================= */}
          {activeNav === 'FINANCE' && (
            <div className="section-card">
              <div className="section-card-header">
                <h2 className="section-card-title">Financial Summary & Ledger</h2>
              </div>
              <div className="stats-grid" style={{ marginBottom: '24px' }}>
                <div className="stat-card">
                  <div className="stat-card-info">
                    <h3>{(finance?.summary.totalRevenue || 0).toLocaleString()} {ws.currency}</h3>
                    <p>Total Income</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-card-info">
                    <h3>{(finance?.summary.totalExpenses || 0).toLocaleString()} {ws.currency}</h3>
                    <p>Total Expenses</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-card-info">
                    <h3 style={{ color: '#16a34a' }}>{(finance?.summary.netIncome || 0).toLocaleString()} {ws.currency}</h3>
                    <p>Net Balance</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeNav === 'INVOICES' && (
            <div className="section-card">
              <div className="section-card-header">
                <h2 className="section-card-title">Invoices</h2>
              </div>
              {invoices.length > 0 ? (
                <div className="table-wrapper">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Invoice #</th>
                        <th>Client</th>
                        <th>Amount</th>
                        <th>Status</th>
                        <th>Due Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {invoices.map((inv) => (
                        <tr key={inv.id}>
                          <td><strong>{inv.invoiceNumber}</strong></td>
                          <td>{inv.customerName} ({inv.customerEmail})</td>
                          <td><strong>${inv.totalAmount.toLocaleString()}</strong></td>
                          <td><span className={`status-badge ${inv.status}`}>{inv.status}</span></td>
                          <td>{new Date(inv.dueDate).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="empty-state-box">
                  <div className="empty-state-icon"><Icons.FileText /></div>
                  <h4>No invoices created yet</h4>
                </div>
              )}
            </div>
          )}

          {/* =========================================================================
              VIEW 6: SETTINGS (Workspace Details, Modules & Reference IDs)
              ========================================================================= */}
          {activeNav === 'SETTINGS' && (
            <div>
              {/* Settings Sub-Tab Bar */}
              <div className="tab-navigation-bar">
                <button
                  type="button"
                  className={`tab-nav-btn ${settingsTab === 'ORG' ? 'active' : ''}`}
                  onClick={() => setSettingsTab('ORG')}
                >
                  <Icons.Building />
                  <span>Workspace Details</span>
                </button>

                <button
                  type="button"
                  className={`tab-nav-btn ${settingsTab === 'MODULES' ? 'active' : ''}`}
                  onClick={() => setSettingsTab('MODULES')}
                >
                  <Icons.Layers />
                  <span>Modules & Features</span>
                </button>

                <button
                  type="button"
                  className={`tab-nav-btn ${settingsTab === 'REF_IDS' ? 'active' : ''}`}
                  onClick={() => setSettingsTab('REF_IDS')}
                >
                  <Icons.Hash />
                  <span>Reference IDs</span>
                </button>
              </div>

              {settingsTab === 'ORG' && (
                <div className="section-card">
                  <div className="section-card-header">
                    <div>
                      <h2 className="section-card-title">Workspace Configuration</h2>
                      <p style={{ margin: '4px 0 0 0', fontSize: '12.5px', color: '#64748b' }}>
                        Overview of your organization setup and workspace parameters.
                      </p>
                    </div>
                  </div>
                  <div className="profile-form-grid" style={{ maxWidth: '600px' }}>
                    <div>
                      <label style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Workspace Name</label>
                      <p style={{ margin: '4px 0 16px 0', fontWeight: 600 }}>{ws.name}</p>
                    </div>
                    <div>
                      <label style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Business Model</label>
                      <p style={{ margin: '4px 0 16px 0', fontWeight: 600 }}>{ws.businessType}</p>
                    </div>
                    <div>
                      <label style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Primary Record Label</label>
                      <p style={{ margin: '4px 0 16px 0', fontWeight: 600 }}>{entityLabel} ({entityLabelPlural})</p>
                    </div>
                    <div>
                      <label style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Active Enabled Modules</label>
                      <p style={{ margin: '4px 0 16px 0', fontWeight: 600 }}>{enabledModules.join(', ')}</p>
                    </div>
                  </div>

                  {/* Re-onboard / Guided Setup Section */}
                  <div
                    style={{
                      marginTop: '28px',
                      padding: '18px 20px',
                      background: 'linear-gradient(135deg, #f8faff 0%, #eff6ff 100%)',
                      border: '1.5px solid #bfdbfe',
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '16px',
                      flexWrap: 'wrap',
                    }}
                  >
                    <div>
                      <h4 style={{ margin: '0 0 4px 0', fontSize: '14.5px', fontWeight: 700, color: '#1e3a8a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Icons.Layers />
                        <span>Re-onboard & Guided Setup</span>
                      </h4>
                      <p style={{ margin: 0, fontSize: '12.5px', color: '#475569', maxWidth: '540px' }}>
                        Need to change your organization type, reconfigure primary business fields, update team roles, or adjust core presets? You can rerun the step-by-step setup wizard anytime.
                      </p>
                    </div>
                    <button
                      type="button"
                      className="btn-nav-primary"
                      onClick={() => router.push('/onboarding?reonboard=true')}
                      style={{
                        padding: '10px 18px',
                        fontSize: '13px',
                        fontWeight: 600,
                        whiteSpace: 'nowrap',
                        boxShadow: '0 2px 8px rgba(37, 99, 235, 0.2)',
                      }}
                    >
                      <span>Launch Onboarding Wizard →</span>
                    </button>
                  </div>
                </div>
              )}

              {settingsTab === 'MODULES' && (
                <div className="section-card">
                  <div className="section-card-header">
                    <div>
                      <h2 className="section-card-title">Modules & Feature Configuration</h2>
                      <p style={{ margin: '4px 0 0 0', fontSize: '12.5px', color: '#64748b' }}>
                        Enable or disable optional features for your workspace. Core modules are always active and included.
                      </p>
                    </div>
                  </div>

                  {/* Module Search Bar */}
                  <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div className="search-box" style={{ width: '100%', maxWidth: '380px' }}>
                      <span className="search-icon"><Icons.Search /></span>
                      <input
                        type="text"
                        placeholder="Search available modules & features..."
                        value={moduleSearch}
                        onChange={(e) => setModuleSearch(e.target.value)}
                      />
                      {moduleSearch && (
                        <button
                          type="button"
                          onClick={() => setModuleSearch('')}
                          style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '12px', padding: '2px 6px' }}
                        >
                          ✕
                        </button>
                      )}
                    </div>
                    {moduleSearch && (
                      <span style={{ fontSize: '12.5px', color: '#64748b' }}>
                        Filtering modules matching "<strong>{moduleSearch}</strong>"
                      </span>
                    )}
                  </div>

                  {moduleSuccessMsg && (
                    <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#16a34a', padding: '10px 14px', borderRadius: '8px', fontSize: '13px', marginBottom: '18px', fontWeight: 500 }}>
                      {moduleSuccessMsg}
                    </div>
                  )}

                  {(() => {
                    const orgType = (ws as any).organizationType || 'training';
                    const orgCatalog = getOrgModuleCatalog(orgType);
                    const q = moduleSearch.trim().toLowerCase();

                    const filteredCore = orgCatalog.core.filter(
                      (m) => !q || m.name.toLowerCase().includes(q) || m.description.toLowerCase().includes(q) || m.key.toLowerCase().includes(q)
                    );
                    const filteredOptional = orgCatalog.optional.filter(
                      (m) => !q || m.name.toLowerCase().includes(q) || m.description.toLowerCase().includes(q) || m.key.toLowerCase().includes(q)
                    );

                    const totalMatches = filteredCore.length + filteredOptional.length;

                    return (
                      <form onSubmit={handleSaveModules}>
                        {totalMatches === 0 && (
                          <div className="empty-state-box" style={{ padding: '30px 10px' }}>
                            <div className="empty-state-icon"><Icons.Grid /></div>
                            <h4>No Modules Found</h4>
                            <p>No available modules match your search query "{moduleSearch}".</p>
                            <button type="button" className="btn-nav-secondary" onClick={() => setModuleSearch('')}>
                              Clear Search
                            </button>
                          </div>
                        )}

                        {/* Core Modules */}
                        {filteredCore.length > 0 && (
                          <div style={{ marginBottom: '24px' }}>
                            <h4 style={{ fontSize: '13px', textTransform: 'uppercase', color: '#64748b', letterSpacing: '0.04em', margin: '0 0 12px 0' }}>
                              Core Modules (Included) {filteredCore.length > 0 && `· ${filteredCore.length}`}
                            </h4>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '12px' }}>
                              {filteredCore.map((mod) => (
                                <div
                                  key={mod.key}
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    background: '#f0fdf4',
                                    border: '1.5px solid #bbf7d0',
                                    padding: '12px 16px',
                                    borderRadius: '10px',
                                  }}
                                >
                                  <div>
                                    <div style={{ fontWeight: 600, fontSize: '13.5px', color: '#0f172a' }}>{mod.name}</div>
                                    <div style={{ fontSize: '11.5px', color: '#64748b' }}>{mod.description}</div>
                                  </div>
                                  <span style={{ fontSize: '11px', fontWeight: 700, color: '#15803d', background: '#dcfce7', padding: '2px 8px', borderRadius: '12px' }}>
                                    Core
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Optional Modules */}
                        {filteredOptional.length > 0 && (
                          <div style={{ marginBottom: '24px' }}>
                            <h4 style={{ fontSize: '13px', textTransform: 'uppercase', color: '#64748b', letterSpacing: '0.04em', margin: '0 0 12px 0' }}>
                              Optional Modules (Customizable) {filteredOptional.length > 0 && `· ${filteredOptional.length}`}
                            </h4>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '12px' }}>
                              {filteredOptional.map((mod) => {
                                const isEnabled = !!moduleSettingStates[mod.key];
                                return (
                                  <div
                                    key={mod.key}
                                    style={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'space-between',
                                      background: isEnabled ? '#f8faff' : '#ffffff',
                                      border: `1.5px solid ${isEnabled ? '#2563eb' : '#e2e8f0'}`,
                                      padding: '12px 16px',
                                      borderRadius: '10px',
                                      cursor: 'pointer',
                                      boxShadow: isEnabled ? '0 2px 8px rgba(37, 99, 235, 0.08)' : 'none',
                                      transition: 'all 0.15s ease',
                                    }}
                                    onClick={() =>
                                      setModuleSettingStates({
                                        ...moduleSettingStates,
                                        [mod.key]: !isEnabled,
                                      })
                                    }
                                  >
                                    <div>
                                      <div style={{ fontWeight: 600, fontSize: '13.5px', color: '#0f172a' }}>{mod.name}</div>
                                      <div style={{ fontSize: '11.5px', color: '#64748b' }}>{mod.description}</div>
                                    </div>
                                    <label className="module-toggle" onClick={(e) => e.stopPropagation()}>
                                      <input
                                        type="checkbox"
                                        checked={isEnabled}
                                        onChange={() =>
                                          setModuleSettingStates({
                                            ...moduleSettingStates,
                                            [mod.key]: !isEnabled,
                                          })
                                        }
                                      />
                                      <span className="toggle-slider" />
                                    </label>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        <button
                          type="submit"
                          className="btn-nav-primary"
                          disabled={isSavingModules}
                          style={{ padding: '10px 20px', fontSize: '13.5px' }}
                        >
                          {isSavingModules ? 'Saving Modules...' : 'Save Module Configuration'}
                        </button>
                      </form>
                    );
                  })()}
                </div>
              )}



              {settingsTab === 'REF_IDS' && (
                <div className="section-card ref-id-settings-box">
                  <div className="section-card-header">
                    <div>
                      <h2 className="section-card-title">Custom Reference ID Settings</h2>
                      <p style={{ margin: '4px 0 0 0', fontSize: '12.5px', color: '#64748b' }}>
                        Configure the automatic sequence and format used when creating {entityLabelPlural.toLowerCase()}.
                      </p>
                    </div>
                  </div>

                  {refIdSuccessMsg && (
                    <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#16a34a', padding: '10px 14px', borderRadius: '8px', fontSize: '13px', marginBottom: '18px', fontWeight: 500 }}>
                      {refIdSuccessMsg}
                    </div>
                  )}

                  {/* Real-time Reactive ID Preview Box */}
                  <div className="ref-id-preview-box">
                    <div>
                      <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.8px', color: '#94a3b8', fontWeight: 700 }}>
                        Live Sequence Preview
                      </span>
                      <div className="ref-id-preview-code">
                        {getLiveRefIdPreview()}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '11.5px', color: '#cbd5e1' }}>Current Sequence Counter</span>
                      <div style={{ fontSize: '15px', fontWeight: 700, color: '#ffffff' }}>
                        #{refIdConfig?.sequence || 0}
                      </div>
                    </div>
                  </div>

                  <form onSubmit={handleSaveRefIdConfig}>
                    <div className="form-grid-2">
                      <div className="form-field-group">
                        <label>Prefix <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 400 }}>(Optional - leave empty for plain numbers e.g. 001)</span></label>
                        <input
                          type="text"
                          maxLength={10}
                          placeholder="e.g. Leave empty for 001, or enter GBT, TRN, STU"
                          value={refPrefix}
                          onChange={(e) => setRefPrefix(e.target.value.toUpperCase())}
                        />
                        <span style={{ fontSize: '11px', color: '#64748b' }}>Leave blank for simple numeric sequence (001, 002, 003)</span>
                      </div>

                      <div className="form-field-group">
                        <label>Separator</label>
                        <select
                          value={refSeparator}
                          onChange={(e) => setRefSeparator(e.target.value)}
                        >
                          <option value="-">Hyphen ( - )</option>
                          <option value="/">Slash ( / )</option>
                          <option value=".">Dot ( . )</option>
                          <option value="_">Underscore ( _ )</option>
                          <option value="">None</option>
                        </select>
                      </div>
                    </div>

                    <div className="form-grid-2">
                      <div className="form-field-group">
                        <label>Number Padding (Digits)</label>
                        <select
                          value={refPadding}
                          onChange={(e) => setRefPadding(Number(e.target.value))}
                        >
                          <option value={2}>2 digits (e.g. 01)</option>
                          <option value={3}>3 digits (e.g. 001)</option>
                          <option value={4}>4 digits (e.g. 0001)</option>
                          <option value={5}>5 digits (e.g. 00001)</option>
                        </select>
                      </div>

                      <div className="form-field-group">
                        <label>Starting Number</label>
                        <input
                          type="number"
                          min={1}
                          max={99999}
                          value={refStartingNumber}
                          onChange={(e) => setRefStartingNumber(Number(e.target.value))}
                        />
                      </div>
                    </div>

                    <div className="form-field-group" style={{ flexDirection: 'row', alignItems: 'center', gap: '10px', marginTop: '6px' }}>
                      <input
                        type="checkbox"
                        id="useYearToggle"
                        checked={refUseYear}
                        onChange={(e) => setRefUseYear(e.target.checked)}
                        style={{ width: 'auto', cursor: 'pointer' }}
                      />
                      <label htmlFor="useYearToggle" style={{ margin: 0, cursor: 'pointer', fontSize: '13px', fontWeight: 500 }}>
                        Include current year in reference ID (e.g. {refPrefix || 'GBT'}{refSeparator || '-'}{new Date().getFullYear()}{refSeparator || '-'}001)
                      </label>
                    </div>

                    <div style={{ background: '#f8fafc', padding: '12px 14px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px', color: '#64748b', margin: '16px 0' }}>
                      <strong>Note:</strong> Changing Reference ID settings will only affect newly created or approved participants. Existing participant IDs remain unchanged.
                    </div>

                    <button
                      type="submit"
                      className="btn-nav-primary"
                      disabled={isSavingRefId}
                      style={{ padding: '10px 20px', fontSize: '13.5px' }}
                    >
                      {isSavingRefId ? 'Saving Configuration...' : 'Save Configuration'}
                    </button>
                  </form>
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* ==================== MODAL 1: ADD PARTICIPANT CHOICE MODAL ==================== */}
      {showAddChoiceModal && (
        <div className="modal-overlay" onClick={() => setShowAddChoiceModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Add {entityLabel}</h3>
              <button type="button" className="btn-close-modal" onClick={() => setShowAddChoiceModal(false)}>
                <Icons.Close />
              </button>
            </div>
            <div style={{ padding: '0 24px 24px' }}>
              <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 14px 0' }}>
                Choose how you want to add this {entityLabel.toLowerCase()} to your workspace:
              </p>

              <div className="choice-cards-grid">
                {/* Option A: Manual Entry */}
                <div
                  className="choice-option-card"
                  onClick={() => {
                    setShowAddChoiceModal(false);
                    setShowEntityModal(true);
                  }}
                >
                  <div className="choice-card-icon">
                    <Icons.Plus />
                  </div>
                  <div>
                    <h4>Add Manually</h4>
                    <p>Manually enter participant details into the workspace directory.</p>
                  </div>
                </div>

                {/* Option B: Share Registration Link */}
                <div
                  className="choice-option-card"
                  onClick={() => {
                    setShowAddChoiceModal(false);
                    setShowCreateLinkModal(true);
                  }}
                >
                  <div className="choice-card-icon" style={{ background: '#f0fdf4', color: '#16a34a' }}>
                    <Icons.Link />
                  </div>
                  <div>
                    <h4>Share Registration Link</h4>
                    <p>Generate a public registration link that participants can complete themselves.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================== MODAL 2: CREATE REGISTRATION LINK (2-STEP BUILDER) ==================== */}
      {showCreateLinkModal && (
        <div className="modal-overlay" onClick={() => { setShowCreateLinkModal(false); setLinkModalStep(1); }}>
          <div className="modal-card" style={{ maxWidth: linkModalStep === 2 ? '680px' : '520px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h3>{linkModalStep === 1 ? 'Step 1: Registration Link Setup' : 'Step 2: Form Fields & Live Preview'}</h3>
                <div style={{ display: 'flex', gap: '6px', marginTop: '4px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: '10px', background: linkModalStep === 1 ? '#eff6ff' : '#f1f5f9', color: linkModalStep === 1 ? '#2563eb' : '#64748b' }}>
                    1. Link Details
                  </span>
                  <span style={{ fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: '10px', background: linkModalStep === 2 ? '#eff6ff' : '#f1f5f9', color: linkModalStep === 2 ? '#2563eb' : '#64748b' }}>
                    2. Form Preview
                  </span>
                </div>
              </div>
              <button type="button" className="btn-close-modal" onClick={() => { setShowCreateLinkModal(false); setLinkModalStep(1); }}>
                <Icons.Close />
              </button>
            </div>

            {linkModalStep === 1 ? (
              <form onSubmit={(e) => { e.preventDefault(); if (linkName.trim()) setLinkModalStep(2); }}>
                <div className="form-field-group">
                  <label>Link / Form Name <span className="req">*</span></label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 2026 Automotive Tech Masterclass"
                    value={linkName}
                    onChange={(e) => setLinkName(e.target.value)}
                  />
                </div>

                <div className="form-grid-2">
                  <div className="form-field-group">
                    <label>Program / Track</label>
                    <input
                      type="text"
                      placeholder="e.g. Gearbox Diagnostic & Repair"
                      value={linkProgram}
                      onChange={(e) => setLinkProgram(e.target.value)}
                    />
                  </div>

                  <div className="form-field-group">
                    <label>Registration Deadline</label>
                    <input
                      type="date"
                      value={linkDeadline}
                      onChange={(e) => setLinkDeadline(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-field-group">
                  <label>Description / Instructions for Applicants</label>
                  <textarea
                    rows={2}
                    placeholder="Provide overview, requirements, or workshop venue information..."
                    value={linkDesc}
                    onChange={(e) => setLinkDesc(e.target.value)}
                  />
                </div>

                <div className="form-grid-2">
                  <div className="form-field-group">
                    <label>Maximum Participant Capacity</label>
                    <input
                      type="number"
                      min={1}
                      placeholder="Leave blank for unlimited"
                      value={linkMaxParticipants}
                      onChange={(e) => setLinkMaxParticipants(e.target.value)}
                    />
                  </div>

                  <div className="form-field-group" style={{ justifyContent: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '16px' }}>
                      <input
                        type="checkbox"
                        id="reqAppr"
                        checked={linkRequireApproval}
                        onChange={(e) => setLinkRequireApproval(e.target.checked)}
                        style={{ width: 'auto', cursor: 'pointer' }}
                      />
                      <label htmlFor="reqAppr" style={{ margin: 0, cursor: 'pointer', fontSize: '13px' }}>
                        Require Admin Approval
                      </label>
                    </div>
                  </div>
                </div>

                {trainingBatches.length > 0 && (
                  <div className="form-field-group">
                    <label>Enroll Applicants into Training Batch</label>
                    <select
                      value={linkBatchId}
                      onChange={(e) => setLinkBatchId(e.target.value)}
                    >
                      <option value="">No specific batch (General Pool)</option>
                      {trainingBatches.map((b) => (
                        <option key={b.id} value={b.id}>{b.name} ({b.program || 'Training'})</option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="modal-actions">
                  <button type="button" className="btn-nav-secondary" onClick={() => setShowCreateLinkModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn-nav-primary">
                    <span>Next: Form Fields & Preview ›</span>
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleCreateRegistrationLink}>
                {/* Step 2 Sub-Tabs */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', borderBottom: '1px solid #e2e8f0', paddingBottom: '10px' }}>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      type="button"
                      style={{
                        padding: '5px 12px',
                        fontSize: '12.5px',
                        fontWeight: 600,
                        borderRadius: '6px',
                        border: '1px solid',
                        borderColor: builderTab === 'FIELDS' ? '#2563eb' : '#cbd5e1',
                        background: builderTab === 'FIELDS' ? '#eff6ff' : '#fff',
                        color: builderTab === 'FIELDS' ? '#2563eb' : '#64748b',
                        cursor: 'pointer',
                      }}
                      onClick={() => setBuilderTab('FIELDS')}
                    >
                      ✏️ Form Fields ({builderFields.length})
                    </button>
                    <button
                      type="button"
                      style={{
                        padding: '5px 12px',
                        fontSize: '12.5px',
                        fontWeight: 600,
                        borderRadius: '6px',
                        border: '1px solid',
                        borderColor: builderTab === 'PREVIEW' ? '#2563eb' : '#cbd5e1',
                        background: builderTab === 'PREVIEW' ? '#eff6ff' : '#fff',
                        color: builderTab === 'PREVIEW' ? '#2563eb' : '#64748b',
                        cursor: 'pointer',
                      }}
                      onClick={() => setBuilderTab('PREVIEW')}
                    >
                      👁️ Live Preview
                    </button>
                  </div>

                  {builderTab === 'FIELDS' && (
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button
                        type="button"
                        className="btn-nav-primary"
                        style={{ padding: '4px 10px', fontSize: '12px' }}
                        onClick={() => handleAddBuilderField('text')}
                      >
                        <Icons.Plus />
                        <span>Add Field</span>
                      </button>
                    </div>
                  )}
                </div>

                {builderTab === 'FIELDS' ? (
                  <div>
                    <p style={{ fontSize: '12.5px', color: '#64748b', margin: '0 0 12px 0' }}>
                      Customize the registration form questions. Drag or use arrows to reorder, configure field types, or mark required:
                    </p>

                    {/* Interactive Fields Builder List */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '380px', overflowY: 'auto', paddingRight: '4px', marginBottom: '14px' }}>
                      {builderFields.map((field, idx) => (
                        <div
                          key={field.id || field.key || idx}
                          style={{
                            background: '#f8fafc',
                            border: '1px solid #e2e8f0',
                            borderRadius: '8px',
                            padding: '12px 14px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '8px',
                            transition: 'border-color 0.15s',
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ cursor: 'grab', color: '#94a3b8', fontSize: '14px', userSelect: 'none' }} title="Drag / Reorder">
                              ☰
                            </span>

                            {/* Field Label Input */}
                            <input
                              type="text"
                              required
                              value={field.label}
                              onChange={(e) => handleUpdateBuilderField(idx, { label: e.target.value })}
                              placeholder="Field Question / Label..."
                              style={{
                                flex: 1,
                                fontWeight: 600,
                                fontSize: '13px',
                                padding: '5px 8px',
                                borderRadius: '6px',
                                border: '1px solid #cbd5e1',
                                background: '#fff',
                              }}
                            />

                            {/* Field Type Select */}
                            <select
                              value={field.type}
                              disabled={field.isSystem && ['fullName', 'email'].includes(field.key)}
                              onChange={(e) => {
                                const newType = e.target.value;
                                const updates: Partial<FormField> = { type: newType };
                                if (['select', 'radio', 'checkbox'].includes(newType) && (!field.options || field.options.length === 0)) {
                                  updates.options = ['Option 1', 'Option 2'];
                                }
                                handleUpdateBuilderField(idx, updates);
                              }}
                              style={{
                                fontSize: '12px',
                                padding: '5px 8px',
                                borderRadius: '6px',
                                border: '1px solid #cbd5e1',
                                background: '#fff',
                                width: '160px',
                              }}
                            >
                              <option value="text">Short Text</option>
                              <option value="textarea">Long Text</option>
                              <option value="email">Email</option>
                              <option value="tel">Phone Number</option>
                              <option value="number">Number</option>
                              <option value="date">Date</option>
                              <option value="select">Dropdown / Select</option>
                              <option value="radio">Radio / Single Choice</option>
                              <option value="checkbox">Checkbox / Multi Choice</option>
                              <option value="file">File Upload</option>
                              <option value="image">Image Upload</option>
                            </select>

                            {/* Required Toggle */}
                            <label style={{ display: 'flex', alignItems: 'center', gap: '4px', margin: 0, fontSize: '12px', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                              <input
                                type="checkbox"
                                checked={field.required}
                                disabled={field.isSystem && ['fullName', 'email'].includes(field.key)}
                                onChange={(e) => handleUpdateBuilderField(idx, { required: e.target.checked })}
                                style={{ width: 'auto', margin: 0 }}
                              />
                              <span style={{ color: field.required ? '#dc2626' : '#64748b', fontWeight: field.required ? 600 : 400 }}>
                                Required
                              </span>
                            </label>

                            {/* Move Up / Down */}
                            <button
                              type="button"
                              disabled={idx === 0}
                              onClick={() => handleMoveBuilderField(idx, 'up')}
                              style={{ border: 'none', background: 'transparent', cursor: idx === 0 ? 'default' : 'pointer', opacity: idx === 0 ? 0.3 : 0.7, padding: '2px 4px', fontSize: '12px' }}
                              title="Move Up"
                            >
                              ▲
                            </button>
                            <button
                              type="button"
                              disabled={idx === builderFields.length - 1}
                              onClick={() => handleMoveBuilderField(idx, 'down')}
                              style={{ border: 'none', background: 'transparent', cursor: idx === builderFields.length - 1 ? 'default' : 'pointer', opacity: idx === builderFields.length - 1 ? 0.3 : 0.7, padding: '2px 4px', fontSize: '12px' }}
                              title="Move Down"
                            >
                              ▼
                            </button>

                            {/* Delete Field */}
                            {!field.isSystem && (
                              <button
                                type="button"
                                onClick={() => handleDeleteBuilderField(idx)}
                                style={{ border: 'none', background: 'transparent', color: '#dc2626', cursor: 'pointer', padding: '2px 6px', fontSize: '13px' }}
                                title="Remove Field"
                              >
                                ✕
                              </button>
                            )}
                          </div>

                          {/* Options editor for dropdown, radio, and checkbox */}
                          {['select', 'radio', 'checkbox'].includes(field.type) && (
                            <div style={{ paddingLeft: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>Options:</span>
                              <input
                                type="text"
                                value={(field.options || []).join(', ')}
                                onChange={(e) => {
                                  const opts = e.target.value.split(',').map((s) => s.trim()).filter(Boolean);
                                  handleUpdateBuilderField(idx, { options: opts });
                                }}
                                placeholder="e.g. Option 1, Option 2, Option 3 (comma separated)"
                                style={{ flex: 1, fontSize: '11.5px', padding: '4px 8px', borderRadius: '4px', border: '1px solid #cbd5e1', background: '#fff' }}
                              />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Quick Add Buttons bar */}
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '14px', padding: '10px', background: '#f1f5f9', borderRadius: '8px' }}>
                      <span style={{ fontSize: '11.5px', fontWeight: 600, color: '#64748b', alignSelf: 'center', marginRight: '4px' }}>
                        + Add field type:
                      </span>
                      {[
                        { type: 'text', label: 'Short Text' },
                        { type: 'textarea', label: 'Long Text' },
                        { type: 'date', label: 'Date' },
                        { type: 'number', label: 'Number' },
                        { type: 'select', label: 'Dropdown' },
                        { type: 'radio', label: 'Single Choice' },
                        { type: 'checkbox', label: 'Checkboxes' },
                        { type: 'file', label: 'File Upload' },
                      ].map((item) => (
                        <button
                          key={item.type}
                          type="button"
                          onClick={() => handleAddBuilderField(item.type)}
                          style={{
                            fontSize: '11px',
                            padding: '3px 8px',
                            borderRadius: '4px',
                            border: '1px solid #cbd5e1',
                            background: '#fff',
                            color: '#1e3a8a',
                            cursor: 'pointer',
                            fontWeight: 500,
                          }}
                        >
                          + {item.label}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  /* Live Preview Tab */
                  <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '18px 20px', maxHeight: '380px', overflowY: 'auto', marginBottom: '14px' }}>
                    <div style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '12px', marginBottom: '16px' }}>
                      <span style={{ fontSize: '11px', fontWeight: 700, color: '#2563eb', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        {ws.name}
                      </span>
                      <h3 style={{ margin: '4px 0 2px 0', fontSize: '17px', fontWeight: 700 }}>{linkName || 'Registration Form'}</h3>
                      {linkProgram && <p style={{ margin: 0, fontSize: '12.5px', color: '#64748b' }}>Program: {linkProgram}</p>}
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                      {builderFields.map((field) => (
                        <div key={field.key} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', margin: 0 }}>
                            {field.label} {field.required && <span style={{ color: '#dc2626' }}>*</span>}
                          </label>

                          {field.type === 'select' ? (
                            <select style={{ padding: '7px 10px', fontSize: '13px', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#f8fafc' }} disabled>
                              <option>Select {field.label}...</option>
                              {(field.options || ['Option 1', 'Option 2']).map((opt) => (
                                <option key={opt}>{opt}</option>
                              ))}
                            </select>
                          ) : field.type === 'radio' ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                              {(field.options || ['Option 1', 'Option 2']).map((opt) => (
                                <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12.5px', color: '#475569' }}>
                                  <input type="radio" disabled />
                                  <span>{opt}</span>
                                </label>
                              ))}
                            </div>
                          ) : field.type === 'checkbox' ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                              {(field.options || ['Option 1', 'Option 2']).map((opt) => (
                                <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12.5px', color: '#475569' }}>
                                  <input type="checkbox" disabled />
                                  <span>{opt}</span>
                                </label>
                              ))}
                            </div>
                          ) : field.type === 'textarea' ? (
                            <textarea rows={2} placeholder={`Enter ${field.label.toLowerCase()}...`} style={{ padding: '7px 10px', fontSize: '13px', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#f8fafc' }} disabled />
                          ) : field.type === 'file' || field.type === 'image' ? (
                            <input type="file" style={{ fontSize: '12px' }} disabled />
                          ) : (
                            <input
                              type={field.type === 'number' ? 'number' : field.type === 'date' ? 'date' : 'text'}
                              placeholder={`Enter ${field.label.toLowerCase()}...`}
                              style={{ padding: '7px 10px', fontSize: '13px', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#f8fafc' }}
                              disabled
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="modal-actions">
                  <button type="button" className="btn-nav-secondary" onClick={() => setLinkModalStep(1)} disabled={isCreatingLink}>
                    ‹ Back to Link Details
                  </button>
                  <button type="submit" className="btn-nav-primary" disabled={isCreatingLink}>
                    {isCreatingLink ? 'Publishing Link...' : 'Publish & Generate Shareable Link'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ==================== MODAL 3: SHARE REGISTRATION LINK ==================== */}
      {showShareModal && selectedLinkForShare && (
        <div className="modal-overlay" onClick={() => setShowShareModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Share Registration Link</h3>
              <button type="button" className="btn-close-modal" onClick={() => setShowShareModal(false)}>
                <Icons.Close />
              </button>
            </div>
            <div style={{ padding: '0 24px 24px' }}>
              <div style={{ marginBottom: '12px' }}>
                <h4 style={{ margin: '0 0 2px 0', fontSize: '15px', fontWeight: 700 }}>
                  {selectedLinkForShare.name}
                </h4>
                {selectedLinkForShare.program && (
                  <span style={{ fontSize: '12px', color: '#64748b' }}>
                    Program: {selectedLinkForShare.program}
                  </span>
                )}
              </div>

              <label style={{ fontSize: '12px', fontWeight: 600, color: '#334155' }}>
                Public Registration URL:
              </label>
              <div className="share-link-input-row">
                <input
                  type="text"
                  readOnly
                  className="share-link-input"
                  value={typeof window !== 'undefined' ? `${window.location.origin}/register/${selectedLinkForShare.slug}` : `/register/${selectedLinkForShare.slug}`}
                />
                <button
                  type="button"
                  className="btn-nav-primary"
                  onClick={() => handleCopyLinkUrl(selectedLinkForShare.slug)}
                >
                  <Icons.Copy />
                  <span>{copyFeedback ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>

              <label style={{ fontSize: '12px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '8px' }}>
                Quick Share Channels:
              </label>
              <div className="share-actions-grid">
                {/* WhatsApp Share */}
                <a
                  href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`Register for ${selectedLinkForShare.name}: ${typeof window !== 'undefined' ? window.location.origin : ''}/register/${selectedLinkForShare.slug}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="share-action-btn whatsapp"
                >
                  <Icons.MessageCircle />
                  <span>WhatsApp</span>
                </a>

                {/* Email Share */}
                <a
                  href={`mailto:?subject=${encodeURIComponent(`Registration Link: ${selectedLinkForShare.name}`)}&body=${encodeURIComponent(`Please complete your registration using this link: ${typeof window !== 'undefined' ? window.location.origin : ''}/register/${selectedLinkForShare.slug}`)}`}
                  className="share-action-btn"
                >
                  <Icons.Mail />
                  <span>Email</span>
                </a>

                {/* QR Code / Direct Link */}
                <a
                  href={typeof window !== 'undefined' ? `/register/${selectedLinkForShare.slug}` : '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="share-action-btn"
                >
                  <Icons.ExternalLink />
                  <span>Open Page</span>
                </a>
              </div>

              <div className="modal-actions" style={{ marginTop: '20px' }}>
                <button type="button" className="btn-nav-secondary" onClick={() => setShowShareModal(false)}>
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================== MODAL 4: REJECT SUBMISSION MODAL ==================== */}
      {showRejectModal && selectedSubmissionForReject && (
        <div className="modal-overlay" onClick={() => setShowRejectModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Reject Submission</h3>
              <button type="button" className="btn-close-modal" onClick={() => setShowRejectModal(false)}>
                <Icons.Close />
              </button>
            </div>
            <form onSubmit={handleRejectSubmission}>
              <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 14px 0' }}>
                Rejecting registration for <strong>{selectedSubmissionForReject.fullName}</strong> ({selectedSubmissionForReject.email}).
              </p>

              <div className="form-field-group">
                <label>Rejection Reason (Optional)</label>
                <textarea
                  rows={3}
                  placeholder="e.g. Prerequisites not met, cohort full, duplicate entry..."
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-nav-secondary" onClick={() => setShowRejectModal(false)} disabled={isRejectingSubmission}>
                  Cancel
                </button>
                <button type="submit" className="btn-nav-primary" style={{ background: '#dc2626' }} disabled={isRejectingSubmission}>
                  {isRejectingSubmission ? 'Rejecting...' : 'Confirm Rejection'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================== CREATE ENTITY MODAL ==================== */}
      {showEntityModal && (
        <div className="modal-overlay" onClick={() => setShowEntityModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Add New {entityLabel} Manually</h3>
              <button type="button" className="btn-close-modal" onClick={() => setShowEntityModal(false)}>
                <Icons.Close />
              </button>
            </div>
            <form onSubmit={handleCreateEntityRecord}>
              <div className="form-field-group">
                <label>Full Name <span className="req">*</span></label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sarah Adebayo"
                  value={recordFullName}
                  onChange={(e) => setRecordFullName(e.target.value)}
                />
              </div>

              <div className="form-field-group">
                <label>Email Address <span className="req">*</span></label>
                <input
                  type="email"
                  required
                  placeholder="e.g. sarah@example.com"
                  value={recordEmail}
                  onChange={(e) => setRecordEmail(e.target.value)}
                />
              </div>

              <div className="form-field-group">
                <label>Phone Number</label>
                <input
                  type="tel"
                  placeholder="e.g. +2348000000000"
                  value={recordPhone}
                  onChange={(e) => setRecordPhone(e.target.value)}
                />
              </div>

              {/* Dynamic Entity Custom Fields */}
              {entityConfig.fields
                .filter((f) => f.enabled && !['fullName', 'email', 'phone'].includes(f.key))
                .map((field) => (
                  <div key={field.key} className="form-field-group">
                    <label>
                      {field.label} {field.required && <span className="req">*</span>}
                    </label>
                    {field.type === 'select' && field.options && field.options.length > 0 ? (
                      <select
                        value={recordMetadata[field.key] || ''}
                        onChange={(e) => setRecordMetadata({ ...recordMetadata, [field.key]: e.target.value })}
                        required={field.required}
                      >
                        <option value="">Select {field.label}...</option>
                        {field.options.map((opt) => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    ) : field.type === 'file' || field.type === 'image' ? (
                      <div>
                        <input
                          type="file"
                          accept={field.type === 'image' ? 'image/*' : undefined}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = (ev) => {
                                setRecordMetadata({ ...recordMetadata, [field.key]: ev.target?.result });
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                          required={field.required && !recordMetadata[field.key]}
                          style={{ fontSize: '13px', padding: '6px 0' }}
                        />
                        {recordMetadata[field.key] && (
                          <div style={{ fontSize: '11px', color: '#16a34a', marginTop: '3px' }}>
                            ✓ File attached
                          </div>
                        )}
                      </div>
                    ) : (
                      <input
                        type={field.type === 'number' ? 'number' : field.type === 'date' ? 'date' : 'text'}
                        placeholder={`Enter ${field.label.toLowerCase()}...`}
                        value={recordMetadata[field.key] || ''}
                        onChange={(e) => setRecordMetadata({ ...recordMetadata, [field.key]: e.target.value })}
                        required={field.required}
                      />
                    )}
                  </div>
                ))}

              {ws.businessType === 'TRAINING' && (
                <>
                  <div className="form-field-group">
                    <label>Training Batch</label>
                    <select
                      value={recordBatchId}
                      onChange={(e) => setRecordBatchId(e.target.value)}
                    >
                      <option value="">Select Batch (or assign later)...</option>
                      {trainingBatches.map((b) => (
                        <option key={b.id} value={b.id}>{b.name} ({b.program || 'Training'})</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-grid-2">
                    <div className="form-field-group">
                      <label>Application Fee ({ws.currency || 'NGN'})</label>
                      <input
                        type="number"
                        min={0}
                        placeholder="e.g. 5000"
                        value={recordApplicationFee}
                        onChange={(e) => setRecordApplicationFee(e.target.value)}
                      />
                    </div>

                    <div className="form-field-group">
                      <label>Training Tuition Fee ({ws.currency || 'NGN'})</label>
                      <input
                        type="number"
                        min={0}
                        placeholder="e.g. 50000"
                        value={recordTrainingFee}
                        onChange={(e) => setRecordTrainingFee(e.target.value)}
                      />
                    </div>
                  </div>
                </>
              )}

              <div className="modal-actions">
                <button type="button" className="btn-nav-secondary" onClick={() => setShowEntityModal(false)} disabled={isCreatingParticipant}>
                  Cancel
                </button>
                <button type="submit" className="btn-nav-primary" disabled={isCreatingParticipant}>
                  {isCreatingParticipant ? 'Saving...' : `Save ${entityLabel}`}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================== CREATE TASK MODAL ==================== */}
      {showTaskModal && (
        <div className="modal-overlay" onClick={() => setShowTaskModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Create Operational Task</h3>
              <button type="button" className="btn-close-modal" onClick={() => setShowTaskModal(false)}>
                <Icons.Close />
              </button>
            </div>
            <form onSubmit={handleCreateTask}>
              <div className="form-field-group">
                <label>Task Title <span className="req">*</span></label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Verify Cohort Attendance Roll Call"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                />
              </div>

              <div className="form-field-group">
                <label>Description</label>
                <textarea
                  rows={3}
                  placeholder="Task details and instructions..."
                  value={taskDesc}
                  onChange={(e) => setTaskDesc(e.target.value)}
                />
              </div>

              <div className="form-grid-2">
                <div className="form-field-group">
                  <label>Priority</label>
                  <select
                    value={taskPriority}
                    onChange={(e) => setTaskPriority(e.target.value as any)}
                  >
                    <option value="LOW">LOW</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="HIGH">HIGH</option>
                    <option value="URGENT">URGENT</option>
                  </select>
                </div>

                <div className="form-field-group">
                  <label>Due Date</label>
                  <input
                    type="date"
                    value={taskDueDate}
                    onChange={(e) => setTaskDueDate(e.target.value)}
                  />
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-nav-secondary" onClick={() => setShowTaskModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-nav-primary">
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================== CREATE TRANSACTION MODAL ==================== */}
      {showTxModal && (
        <div className="modal-overlay" onClick={() => setShowTxModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Record Transaction</h3>
              <button type="button" className="btn-close-modal" onClick={() => setShowTxModal(false)}>
                <Icons.Close />
              </button>
            </div>
            <form onSubmit={handleCreateTx}>
              <div className="form-grid-2">
                <div className="form-field-group">
                  <label>Transaction Type</label>
                  <select
                    value={txType}
                    onChange={(e) => setTxType(e.target.value as any)}
                  >
                    <option value="INCOME">INCOME (+)</option>
                    <option value="EXPENSE">EXPENSE (-)</option>
                  </select>
                </div>

                <div className="form-field-group">
                  <label>Amount ({ws.currency || 'NGN'}) <span className="req">*</span></label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={txAmount || ''}
                    onChange={(e) => setTxAmount(Number(e.target.value))}
                  />
                </div>
              </div>

              <div className="form-field-group">
                <label>Description <span className="req">*</span></label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tuition payment for Q3 Cohort"
                  value={txDesc}
                  onChange={(e) => setTxDesc(e.target.value)}
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-nav-secondary" onClick={() => setShowTxModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-nav-primary">
                  Record Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================== CREATE INVOICE MODAL ==================== */}
      {showInvoiceModal && (
        <div className="modal-overlay" onClick={() => setShowInvoiceModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Generate Invoice</h3>
              <button type="button" className="btn-close-modal" onClick={() => setShowInvoiceModal(false)}>
                <Icons.Close />
              </button>
            </div>
            <form onSubmit={handleCreateInvoice}>
              <div className="form-field-group">
                <label>Client Name <span className="req">*</span></label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Acme Corporation"
                  value={invCustName}
                  onChange={(e) => setInvCustName(e.target.value)}
                />
              </div>

              <div className="form-field-group">
                <label>Client Email <span className="req">*</span></label>
                <input
                  type="email"
                  required
                  placeholder="e.g. billing@acme.com"
                  value={invCustEmail}
                  onChange={(e) => setInvCustEmail(e.target.value)}
                />
              </div>

              <div className="form-grid-2">
                <div className="form-field-group">
                  <label>Item / Service Description</label>
                  <input
                    type="text"
                    placeholder="e.g. Professional Training Services"
                    value={invItemDesc}
                    onChange={(e) => setInvItemDesc(e.target.value)}
                  />
                </div>

                <div className="form-field-group">
                  <label>Total Amount ($) <span className="req">*</span></label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={invAmount || ''}
                    onChange={(e) => setInvAmount(Number(e.target.value))}
                  />
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-nav-secondary" onClick={() => setShowInvoiceModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-nav-primary">
                  Generate Invoice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================== GLOBAL SEARCH MODAL ==================== */}
      {showSearchModal && (
        <div className="modal-overlay" onClick={() => setShowSearchModal(false)}>
          <div className="modal-card search-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="search-input-wrapper">
              <Icons.Search />
              <input
                type="text"
                autoFocus
                placeholder="Search across records, tasks, transactions, and invoices..."
                value={globalSearchTerm}
                onChange={(e) => handleGlobalSearch(e.target.value)}
              />
              <button type="button" className="btn-close-modal" onClick={() => setShowSearchModal(false)}>
                <Icons.Close />
              </button>
            </div>

            <div className="search-results-list">
              {searchResults.length > 0 ? (
                searchResults.map((res) => (
                  <div
                    key={`${res.type}-${res.id}`}
                    className="search-result-item"
                    onClick={() => {
                      setShowSearchModal(false);
                      if (res.type === 'CUSTOMER' || (res.type as string) === 'PARTICIPANT') setActiveNav('RECORDS');
                      if (res.type === 'TASK') setActiveNav('TASKS');
                      if (res.type === 'INVOICE') setActiveNav('INVOICES');
                      if (res.type === 'TRANSACTION') setActiveNav('FINANCE');
                    }}
                  >
                    <span className="search-result-type-badge">{res.type}</span>
                    <div>
                      <h4 style={{ margin: '0 0 2px 0', fontSize: '13.5px' }}>{res.title}</h4>
                      <span style={{ fontSize: '12px', color: '#64748b' }}>{res.meta}</span>
                    </div>
                  </div>
                ))
              ) : (
                <p style={{ padding: '24px', textAlign: 'center', color: '#64748b', fontSize: '13px', margin: 0 }}>
                  {globalSearchTerm ? 'No matching records found in this workspace.' : 'Type to search workspace records...'}
                </p>
              )}
            </div>
          </div>
        </div>
      )}


      {/* ==================== CREATE / EDIT BATCH MODAL ==================== */}
      {showBatchModal && (
        <div className="modal-overlay" onClick={() => setShowBatchModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingBatch ? 'Edit Training Batch' : 'Create Training Batch'}</h3>
              <button type="button" className="btn-close-modal" onClick={() => setShowBatchModal(false)}>
                <Icons.Close />
              </button>
            </div>
            <form onSubmit={handleCreateBatch}>
              <div className="form-field-group">
                <label>Batch Name <span className="req">*</span></label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Batch 1, Cohort 3, November Masterclass"
                  value={batchName}
                  onChange={(e) => setBatchName(e.target.value)}
                />
              </div>

              <div className="form-field-group">
                <label>Program / Course Title</label>
                <input
                  type="text"
                  placeholder="e.g. Toyota/Lexus Gearbox Training"
                  value={batchProgram}
                  onChange={(e) => setBatchProgram(e.target.value)}
                />
              </div>

              <div className="form-field-group">
                <label>Description / Notes</label>
                <textarea
                  rows={2}
                  placeholder="Batch schedule details, training focus, venue..."
                  value={batchDesc}
                  onChange={(e) => setBatchDesc(e.target.value)}
                />
              </div>

              <div className="form-grid-2">
                <div className="form-field-group">
                  <label>Start Date</label>
                  <input
                    type="date"
                    value={batchStartDate}
                    onChange={(e) => setBatchStartDate(e.target.value)}
                  />
                </div>

                <div className="form-field-group">
                  <label>End Date</label>
                  <input
                    type="date"
                    value={batchEndDate}
                    onChange={(e) => setBatchEndDate(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-field-group">
                <label>Batch Status</label>
                <select
                  value={batchStatus}
                  onChange={(e) => setBatchStatus(e.target.value)}
                >
                  <option value="UPCOMING">UPCOMING</option>
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="COMPLETED">COMPLETED</option>
                </select>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-nav-secondary" onClick={() => setShowBatchModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-nav-primary" disabled={isSubmittingBatch}>
                  {isSubmittingBatch ? 'Saving...' : editingBatch ? 'Update Batch' : 'Create Batch'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================== RECORD PAYMENT MODAL ==================== */}
      {showPaymentModal && (
        <div className="modal-overlay" onClick={() => setShowPaymentModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Record Participant Payment</h3>
              <button type="button" className="btn-close-modal" onClick={() => setShowPaymentModal(false)}>
                <Icons.Close />
              </button>
            </div>
            <form onSubmit={handleRecordPayment}>
              <div className="form-field-group">
                <label>Select Participant <span className="req">*</span></label>
                <select
                  required
                  value={paymentParticipantId}
                  onChange={(e) => {
                    const id = e.target.value;
                    setPaymentParticipantId(id);
                    const p = participants.find((x) => x.id === id);
                    if (p?.batchId) setPaymentBatchId(p.batchId);
                  }}
                >
                  <option value="">Choose participant...</option>
                  {participants.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.fullName} {p.refId ? `(${p.refId})` : ''} — {p.email}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-grid-2">
                <div className="form-field-group">
                  <label>Amount Paid ({ws.currency || 'NGN'}) <span className="req">*</span></label>
                  <input
                    type="number"
                    required
                    min={1}
                    placeholder="e.g. 25000"
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                  />
                </div>

                <div className="form-field-group">
                  <label>Payment Purpose</label>
                  <select
                    value={paymentFor}
                    onChange={(e) => setPaymentFor(e.target.value)}
                  >
                    <option value="TRAINING_FEE">Training Tuition Fee</option>
                    <option value="APPLICATION_FEE">Application / Registration Fee</option>
                    <option value="OTHER">Other Service / Materials</option>
                  </select>
                </div>
              </div>

              <div className="form-grid-2">
                <div className="form-field-group">
                  <label>Batch Assignment</label>
                  <select
                    value={paymentBatchId}
                    onChange={(e) => setPaymentBatchId(e.target.value)}
                  >
                    <option value="">No Batch / Auto</option>
                    {trainingBatches.map((b) => (
                      <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
                  </select>
                </div>

                <div className="form-field-group">
                  <label>Payment Date</label>
                  <input
                    type="date"
                    value={paymentDate}
                    onChange={(e) => setPaymentDate(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-field-group">
                <label>Notes / Bank Reference</label>
                <input
                  type="text"
                  placeholder="e.g. Bank Transfer Ref: GTB-9283921"
                  value={paymentNotes}
                  onChange={(e) => setPaymentNotes(e.target.value)}
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-nav-secondary" onClick={() => setShowPaymentModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-nav-primary" disabled={isSubmittingPayment}>
                  {isSubmittingPayment ? 'Recording...' : 'Record Payment & Issue Receipt'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================== VIEW / EXPORT RECEIPT MODAL ==================== */}
      {showReceiptModal && (
        <div className="modal-overlay" onClick={() => setShowReceiptModal(null)}>
          <div className="modal-card" style={{ maxWidth: '640px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Official Payment Receipt</h3>
              <button type="button" className="btn-close-modal" onClick={() => setShowReceiptModal(null)}>
                <Icons.Close />
              </button>
            </div>

            <div style={{ padding: '0 24px 24px' }}>
              <div id="receipt-document-content" className="receipt-printable">
                {/* Header Banner */}
                <div className="receipt-top-banner">
                  <div>
                    <h2 className="receipt-org-name">{ws.name}</h2>
                    <p className="receipt-org-sub">
                      {ws.email || 'support@vifems.com'} {ws.phone ? `· ${ws.phone}` : ''}
                    </p>
                  </div>
                  <div className="receipt-badge-box">
                    <span className="receipt-title-tag">Official Receipt</span>
                    <div className="receipt-serial-num">{showReceiptModal.receiptNumber}</div>
                  </div>
                </div>

                {/* Info Grid */}
                <div className="receipt-info-grid">
                  <div className="receipt-info-item">
                    <p>Received From (Payer)</p>
                    <h4>{showReceiptModal.participant?.fullName || 'Participant'}</h4>
                    {showReceiptModal.participant?.phone && (
                      <span style={{ fontSize: '11.5px', color: '#64748b' }}>
                        {showReceiptModal.participant.phone}
                      </span>
                    )}
                  </div>
                  <div className="receipt-info-item">
                    <p>Candidate Reference ID</p>
                    <h4 style={{ fontFamily: 'monospace', color: '#1e3a8a' }}>
                      {showReceiptModal.participant?.refId || '—'}
                    </h4>
                  </div>
                  <div className="receipt-info-item">
                    <p>Date & Time Issued</p>
                    <h4>{new Date(showReceiptModal.issuedAt).toLocaleString()}</h4>
                  </div>
                  <div className="receipt-info-item">
                    <p>Payment Mode</p>
                    <h4>Direct Payment / Transfer</h4>
                  </div>
                </div>

                {/* Itemized Table */}
                <table className="receipt-table">
                  <thead>
                    <tr>
                      <th>Description</th>
                      <th>Payment Category</th>
                      <th style={{ textAlign: 'right' }}>Amount Paid</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <strong>
                          {showReceiptModal.paymentFor === 'APPLICATION_FEE'
                            ? 'Application & Registration Deposit'
                            : showReceiptModal.paymentFor === 'TRAINING_FEE'
                            ? 'Training Tuition Fee Payment'
                            : 'Training Service Payment'}
                        </strong>
                        <div style={{ fontSize: '11.5px', color: '#64748b' }}>
                          Issued to: {showReceiptModal.participant?.fullName || 'Participant'}
                        </div>
                      </td>
                      <td>
                        <span style={{ fontSize: '11.5px', background: '#f1f5f9', padding: '2px 8px', borderRadius: '4px' }}>
                          {showReceiptModal.paymentFor.replace('_', ' ')}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right', fontWeight: 700, color: '#0f172a' }}>
                        {Number(showReceiptModal.amount).toLocaleString()} {ws.currency || 'NGN'}
                      </td>
                    </tr>
                  </tbody>
                </table>

                {/* Total Paid Banner */}
                <div className="receipt-paid-banner">
                  <div>
                    <span style={{ fontSize: '11px', textTransform: 'uppercase', color: '#15803d', fontWeight: 700, letterSpacing: '0.5px' }}>
                      Total Amount Received
                    </span>
                    <div className="receipt-paid-amount">
                      {Number(showReceiptModal.amount).toLocaleString()} {ws.currency || 'NGN'}
                    </div>
                  </div>
                  <span className="receipt-stamp-badge">
                    <Icons.CheckCircle /> PAYMENT VERIFIED
                  </span>
                </div>

                {/* Footer Verification Stamp */}
                <div className="receipt-footer-stamp">
                  <div style={{ width: '100%', textAlign: 'center' }}>
                    <p style={{ margin: '0 0 2px 0', fontWeight: 700, color: '#0f172a' }}>Verified Digital Transaction</p>
                    <p style={{ margin: 0, fontSize: '11px' }}>VIFEmS Enterprise Platform Verification Token: {showReceiptModal.id.slice(0, 8).toUpperCase()}</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                <button
                  type="button"
                  className="btn-nav-primary"
                  style={{ flex: 1, justifyContent: 'center' }}
                  disabled={isDownloadingPdf}
                  onClick={() => handleDownloadPdf('receipt-document-content', `Receipt_${showReceiptModal.receiptNumber}.pdf`)}
                >
                  <Icons.FileText />
                  <span>{isDownloadingPdf ? 'Generating PDF...' : 'Download PDF Receipt'}</span>
                </button>

                <button
                  type="button"
                  className="btn-nav-secondary"
                  style={{ color: '#16a34a', borderColor: '#bbf7d0', background: '#f0fdf4' }}
                  onClick={() => handleShareReceiptWhatsApp(showReceiptModal)}
                >
                  <Icons.MessageCircle />
                  <span>WhatsApp</span>
                </button>

                <button
                  type="button"
                  className="btn-nav-secondary"
                  onClick={handlePrintReceipt}
                  title="Print Document"
                >
                  <Icons.Printer />
                </button>

                <button
                  type="button"
                  className="btn-nav-secondary"
                  onClick={() => setShowReceiptModal(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================== CERTIFICATE OF COMPLETION MODAL ==================== */}
      {showCertificateModal && (
        <div className="modal-overlay" onClick={() => setShowCertificateModal(null)}>
          <div className="modal-card" style={{ maxWidth: '820px', width: '90%' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Certificate of Completion</h3>
              <button type="button" className="btn-close-modal" onClick={() => setShowCertificateModal(null)}>
                <Icons.Close />
              </button>
            </div>

            <div style={{ padding: '0 24px 24px' }}>
                <div id="certificate-document-content" className="certificate-frame">
                  {certTemplate.logoUrl ? (
                    <img src={certTemplate.logoUrl} alt="Organization Logo" style={{ maxWidth: '120px', maxHeight: '80px', objectFit: 'contain', margin: '0 auto', display: 'block' }} onError={(e) => { (e.target as any).style.display = 'none'; }} />
                  ) : (
                    <div className="cert-header-icon">
                      <Icons.Award />
                    </div>
                  )}

                <h1 className="cert-title">Certificate of Completion</h1>
                <p className="cert-subtitle">This official credential is proudly awarded to</p>

                 <div className="cert-recipient-name">
                   {showCertificateModal.participant?.fullName || showCertificateModal.fullName || 'Participant'}
                 </div>

                 {(() => {
                   const certParticipant = participants.find((p) => p.id === showCertificateModal.participantId || p.id === showCertificateModal.participant?.id);
                   const participantPhoto = extractParticipantPhoto(certParticipant);
                   return participantPhoto ? (
                     <div style={{ textAlign: 'center' }}>
                       <img src={participantPhoto} alt="Participant Passport" style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #d1d5db', marginBottom: '8px', display: 'block', margin: '0 auto' }} onError={(e) => { (e.target as any).style.display = 'none'; }} />
                       <p style={{ fontSize: '10px', color: '#64748b', margin: 0 }}>Participant Passport</p>
                     </div>
                   ) : null;
                 })()}

                <div className="cert-body-text">
                  for successfully attending, fulfilling all rigorous practical & technical requirements, and demonstrating outstanding competence in the intensive training program:
                </div>

                <div className="cert-program-title">
                  {showCertificateModal.batch?.program || showCertificateModal.batch?.name || 'Toyota/Lexus Gearbox & Automotive Engineering Training'}
                </div>

                <p style={{ fontSize: '12px', color: '#64748b', margin: '8px 0 0 0' }}>
                  Conducted by <strong>{ws.name}</strong>
                </p>

                {/* Footer Bar */}
                <div className="cert-meta-bar">
                  <div className="cert-serial-box">
                    <div>Serial Number: <span className="cert-serial-code">{showCertificateModal.certificateNumber || 'CERT-2026-0042'}</span></div>
                    {showCertificateModal.participant?.refId && (
                      <div>Candidate Ref: <strong>{showCertificateModal.participant.refId}</strong></div>
                    )}
                    <div>Date Awarded: <strong>{showCertificateModal.issuedAt ? new Date(showCertificateModal.issuedAt).toLocaleDateString() : new Date().toLocaleDateString()}</strong></div>
                  </div>

                  <div className="cert-signatures">
                    <div className="cert-sig-item">
                      <div className="cert-sig-line">
                        {certTemplate.signatureDataUrl ? (
                          <img src={certTemplate.signatureDataUrl} alt="Signature" style={{ height: '40px', objectFit: 'contain' }} onError={(e) => { (e.target as any).style.display = 'none'; }} />
                        ) : certTemplate.signatureUrl ? (
                          <img src={certTemplate.signatureUrl} alt="Signature" style={{ height: '40px', objectFit: 'contain' }} onError={(e) => { (e.target as any).style.display = 'none'; }} />
                        ) : (
                          'Director Signature'
                        )}
                      </div>
                      <span className="cert-sig-role">Training Director</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                <button
                  type="button"
                  className="btn-nav-primary"
                  style={{ flex: 1, justifyContent: 'center' }}
                  disabled={isDownloadingPdf}
                  onClick={() =>
                    handleDownloadPdf(
                      'certificate-document-content',
                      `Certificate_${(showCertificateModal.participant?.fullName || showCertificateModal.fullName || 'Graduate').replace(/\s+/g, '_')}.pdf`
                    )
                  }
                >
                  <Icons.Award />
                  <span>{isDownloadingPdf ? 'Generating PDF...' : 'Download Certificate PDF'}</span>
                </button>

                <button
                  type="button"
                  className="btn-nav-secondary"
                  style={{ color: '#16a34a', borderColor: '#bbf7d0', background: '#f0fdf4' }}
                  onClick={() => handleShareCertificateWhatsApp(showCertificateModal)}
                >
                  <Icons.MessageCircle />
                  <span>WhatsApp</span>
                </button>

                <button
                  type="button"
                  className="btn-nav-secondary"
                  onClick={() => setShowCertificateModal(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

