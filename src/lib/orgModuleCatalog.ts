/**
 * VIFEmS Organization-Type Module Catalog — Frontend
 *
 * Mirror of the backend orgModuleCatalog.js
 * Single source of truth for what modules are shown per org type.
 */

export interface ModuleMetadata {
  key: string;
  name: string;
  description: string;
  category: 'Directory' | 'Operations' | 'Finance' | 'Commerce' | 'Administration';
  isCore: boolean;
}

export interface OrgModuleCatalog {
  core: ModuleMetadata[];
  optional: ModuleMetadata[];
}

export const ALL_MODULE_METADATA: Record<string, Omit<ModuleMetadata, 'key' | 'isCore'>> = {
  // ─── Generic / Shared ─────────────────────────────────────────────────────
  PARTICIPANTS: {
    name: 'Participants',
    description: 'Track member biodata, enrollment records, and status.',
    category: 'Directory',
  },
  ATTENDANCE: {
    name: 'Attendance',
    description: 'Record and manage attendance sessions.',
    category: 'Operations',
  },
  PAYMENTS: {
    name: 'Payments',
    description: 'Track payments, fees, and financial transactions.',
    category: 'Finance',
  },
  CUSTOMERS: {
    name: 'Customers & CRM',
    description: 'Directory of clients, shoppers, and contacts.',
    category: 'Directory',
  },
  INVENTORY: {
    name: 'Inventory & Stock',
    description: 'Track physical assets, stock levels, and equipment.',
    category: 'Commerce',
  },
  PRODUCTS: {
    name: 'Products & Pricing',
    description: 'Catalog items, product SKUs, and pricing tiers.',
    category: 'Commerce',
  },
  ORDERS: {
    name: 'Sales & Orders',
    description: 'Customer order processing and fulfillment.',
    category: 'Commerce',
  },
  TASKS: {
    name: 'Tasks & Workflows',
    description: 'Assign tasks, set due dates, and monitor team progress.',
    category: 'Operations',
  },
  INVOICES: {
    name: 'Billing & Invoices',
    description: 'Generate professional invoices with tax calculations.',
    category: 'Finance',
  },
  FINANCE: {
    name: 'Financial Ledger',
    description: 'Income, expenses, and cashflow summaries.',
    category: 'Finance',
  },
  STAFF: {
    name: 'Staff & Team Roster',
    description: 'Manage staff members, roles, and access permissions.',
    category: 'Administration',
  },
  REPORTS: {
    name: 'Reports & Analytics',
    description: 'Business intelligence exports and performance reports.',
    category: 'Administration',
  },
  // ─── Training / Coaching ───────────────────────────────────────────────────
  TRAINING: {
    name: 'Training Programs',
    description: 'Organize training curricula, cohorts, and sessions.',
    category: 'Operations',
  },
  PROGRAMS: {
    name: 'Programs',
    description: 'Define and manage training programs and courses.',
    category: 'Operations',
  },
  COHORTS: {
    name: 'Cohorts & Groups',
    description: 'Group participants into cohorts or training batches.',
    category: 'Operations',
  },
  CERTIFICATES: {
    name: 'Certificates',
    description: 'Issue and manage completion certificates.',
    category: 'Operations',
  },
  TRAINERS: {
    name: 'Trainers & Instructors',
    description: 'Manage instructor profiles and assignments.',
    category: 'Administration',
  },
  PROGRESS_TRACKING: {
    name: 'Progress Tracking',
    description: 'Monitor participant progress and milestone completion.',
    category: 'Operations',
  },
  // ─── School / Educational Institution ─────────────────────────────────────
  STUDENTS: {
    name: 'Students',
    description: 'Manage student profiles, enrollment, and records.',
    category: 'Directory',
  },
  CLASSES: {
    name: 'Classes & Sections',
    description: 'Organize students into classes and academic sections.',
    category: 'Operations',
  },
  ACADEMIC_SESSIONS: {
    name: 'Academic Sessions',
    description: 'Manage academic terms, semesters, and school years.',
    category: 'Operations',
  },
  SUBJECTS: {
    name: 'Subjects & Curriculum',
    description: 'Define subjects taught in each class.',
    category: 'Operations',
  },
  RESULTS: {
    name: 'Results & Assessments',
    description: 'Record exam scores, grades, and performance reports.',
    category: 'Operations',
  },
  FEES: {
    name: 'Fees & Bursar',
    description: 'Manage school fees, payment schedules, and receipts.',
    category: 'Finance',
  },
  LIBRARY: {
    name: 'Library',
    description: 'Track library resources, borrowing, and returns.',
    category: 'Operations',
  },
  SCHOOL_HEALTH: {
    name: 'School Health',
    description: 'Manage student health records and medical requests.',
    category: 'Administration',
  },
  GUIDANCE: {
    name: 'Guidance & Welfare',
    description: 'Track student counseling and welfare activities.',
    category: 'Administration',
  },
  // ─── Retail / Commerce ─────────────────────────────────────────────────────
  SUPPLIERS: {
    name: 'Suppliers',
    description: 'Manage supplier profiles and purchase orders.',
    category: 'Commerce',
  },
  DISCOUNTS: {
    name: 'Discounts & Promotions',
    description: 'Configure discount codes and promotional pricing.',
    category: 'Commerce',
  },
};

const ORG_MODULE_RAW: Record<string, { core: string[]; optional: string[] }> = {
  school: {
    core: ['STUDENTS', 'CLASSES', 'ACADEMIC_SESSIONS', 'ATTENDANCE', 'RESULTS'],
    optional: ['SUBJECTS', 'FEES', 'LIBRARY', 'SCHOOL_HEALTH', 'GUIDANCE', 'STAFF', 'TASKS', 'REPORTS'],
  },
  training: {
    core: ['PARTICIPANTS', 'BATCHES', 'PAYMENTS'],
    optional: ['RECEIPTS', 'CERTIFICATES', 'TRAINING', 'ATTENDANCE', 'PROGRAMS', 'COHORTS', 'TRAINERS', 'PROGRESS_TRACKING', 'STAFF', 'TASKS', 'REPORTS'],
  },
  business: {
    core: ['CUSTOMERS', 'TASKS'],
    optional: ['INVOICES', 'PAYMENTS', 'FINANCE', 'STAFF', 'REPORTS'],
  },
  retail: {
    core: ['PRODUCTS', 'CUSTOMERS', 'ORDERS', 'INVENTORY'],
    optional: ['PAYMENTS', 'SUPPLIERS', 'DISCOUNTS', 'STAFF', 'FINANCE', 'REPORTS'],
  },
  healthcare: {
    core: ['PARTICIPANTS', 'ATTENDANCE', 'TASKS'],
    optional: ['PAYMENTS', 'INVOICES', 'SCHOOL_HEALTH', 'STAFF', 'REPORTS', 'FINANCE'],
  },
  hospitality: {
    core: ['CUSTOMERS', 'ORDERS', 'TASKS'],
    optional: ['PAYMENTS', 'INVENTORY', 'STAFF', 'REPORTS', 'FINANCE'],
  },
  professional_services: {
    core: ['CUSTOMERS', 'TASKS', 'INVOICES'],
    optional: ['PAYMENTS', 'FINANCE', 'STAFF', 'REPORTS'],
  },
  nonprofit: {
    core: ['PARTICIPANTS', 'ATTENDANCE', 'TASKS'],
    optional: ['PAYMENTS', 'CERTIFICATES', 'STAFF', 'REPORTS', 'FINANCE'],
  },
  custom: {
    core: ['CUSTOMERS', 'TASKS'],
    optional: ['PARTICIPANTS', 'ATTENDANCE', 'PAYMENTS', 'INVOICES', 'FINANCE', 'STAFF', 'REPORTS'],
  },
};

const buildMeta = (key: string, isCore: boolean): ModuleMetadata => ({
  key,
  isCore,
  ...(ALL_MODULE_METADATA[key] ?? {
    name: key,
    description: '',
    category: 'Operations' as const,
  }),
});

/**
 * Returns the full OrgModuleCatalog (core + optional with metadata) for a given org type.
 * Falls back to 'custom' if the org type is unknown.
 */
export const getOrgModuleCatalog = (orgType: string): OrgModuleCatalog => {
  const raw = ORG_MODULE_RAW[orgType?.toLowerCase()] ?? ORG_MODULE_RAW.custom;
  return {
    core: raw.core.map((key) => buildMeta(key, true)),
    optional: raw.optional.map((key) => buildMeta(key, false)),
  };
};

/**
 * Returns ALL module keys (core + optional) allowed for an org type.
 */
export const getAllowedModuleKeys = (orgType: string): string[] => {
  const catalog = getOrgModuleCatalog(orgType);
  return [...catalog.core, ...catalog.optional].map((m) => m.key);
};

/**
 * Builds the initial moduleStates map for an org type.
 * Core = always true, Optional = false by default.
 */
export const buildInitialModuleStates = (orgType: string): Record<string, boolean> => {
  const catalog = getOrgModuleCatalog(orgType);
  const states: Record<string, boolean> = {};
  catalog.core.forEach((m) => { states[m.key] = true; });
  catalog.optional.forEach((m) => { states[m.key] = false; });
  return states;
};
