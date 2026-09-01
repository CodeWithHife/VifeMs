import {
  Task,
  Customer,
  StaffMember,
  Transaction,
  Invoice,
  ReportItem,
  AppNotification,
  ActivityLogItem,
  OrganizationSettings,
  UserProfile,
} from '@/types/dashboard';

export interface WorkspaceStorageData {
  organization: OrganizationSettings;
  user: UserProfile;
  tasks: Task[];
  customers: Customer[];
  staff: StaffMember[];
  transactions: Transaction[];
  invoices: Invoice[];
  reports: ReportItem[];
  notifications: AppNotification[];
  activities: ActivityLogItem[];
  isConfigured: boolean;
}

export const DEFAULT_ORGANIZATION: OrganizationSettings = {
  name: 'My Workspace',
  logo: '/logo/logo.png',
  email: 'admin@mybusiness.com',
  phone: '+234 800 000 0000',
  address: 'Commercial Avenue',
  country: 'Nigeria',
  state: 'Lagos',
  website: 'https://mybusiness.com',
  currency: 'NGN',
  timeZone: 'Africa/Lagos',
  businessType: 'General Business',
};

export const DEFAULT_USER: UserProfile = {
  name: 'Workspace Admin',
  email: 'admin@mybusiness.com',
  phone: '+234 800 000 0000',
  role: 'Administrator',
  avatar: 'WA',
  department: 'Management',
};

export const getCurrencySymbol = (currencyCode?: string): string => {
  switch (currencyCode) {
    case 'USD': return '$';
    case 'EUR': return '€';
    case 'GBP': return '£';
    case 'KES': return 'KSh ';
    case 'GHS': return 'GH₵ ';
    case 'CAD': return 'C$';
    case 'ZAR': return 'R ';
    case 'NGN':
    default:
      return '₦';
  }
};

export const DEFAULT_WORKSPACE_STORE: WorkspaceStorageData = {
  organization: DEFAULT_ORGANIZATION,
  user: DEFAULT_USER,
  tasks: [],
  customers: [],
  staff: [
    {
      id: 'STF-01',
      name: DEFAULT_USER.name,
      email: DEFAULT_USER.email,
      phone: DEFAULT_USER.phone,
      role: 'Administrator',
      department: DEFAULT_USER.department,
      status: 'Active',
      tasksAssigned: 0,
      tasksCompleted: 0,
      lastActive: 'Just now',
      joinedDate: '2026-01-01',
      permissions: ['ALL_PERMISSIONS'],
    },
  ],
  transactions: [],
  invoices: [],
  reports: [
    {
      id: 'REP-01',
      title: 'Monthly Revenue & Margin Performance',
      category: 'Financial',
      summary: 'Analysis of gross receipts, cost of goods sold, operating expenditures, and margins.',
      dateRange: 'Current Month',
      generatedDate: '2026-01-01',
      metrics: [
        { title: 'Gross Revenue', value: '₦0', change: '0%', trend: 'neutral', description: 'current ledger' },
        { title: 'Net Margin', value: '0%', change: '0%', trend: 'neutral', description: 'profitability percentage' },
      ],
    },
  ],
  notifications: [
    {
      id: 'notif-welcome',
      category: 'System',
      title: 'Welcome to your VIFEMS Workspace!',
      description: 'Your business workspace is configured and ready. Start by adding your team and first client.',
      time: 'Just now',
      read: false,
    },
  ],
  activities: [
    {
      id: 'act-init',
      userName: DEFAULT_USER.name,
      userRole: 'Administrator',
      action: 'Initialized business workspace configuration',
      recordAffected: 'Workspace Profile',
      module: 'Settings',
      timestamp: 'Just now',
      ipAddress: '127.0.0.1',
    },
  ],
  isConfigured: false,
};

export const getDefaultWorkspaceStore = (): WorkspaceStorageData => {
  return JSON.parse(JSON.stringify(DEFAULT_WORKSPACE_STORE));
};

const STORAGE_KEY = 'vifems_workspace_store';

export const getWorkspaceStore = (): WorkspaceStorageData => {
  if (typeof window === 'undefined') {
    return getDefaultWorkspaceStore();
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.warn('Failed to load workspace store from localStorage:', e);
  }

  return getDefaultWorkspaceStore();
};

export const saveWorkspaceStore = (data: WorkspaceStorageData) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    window.dispatchEvent(new Event('vifems_workspace_updated'));
  } catch (e) {
    console.warn('Failed to persist workspace store:', e);
  }
};

