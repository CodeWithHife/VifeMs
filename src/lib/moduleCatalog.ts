export interface EntityFieldDefinition {
  key: string;
  label: string;
  type: 'text' | 'number' | 'email' | 'phone' | 'date' | 'select' | 'boolean' | 'file' | 'image';
  required: boolean;
  enabled: boolean;
  options?: string[];
  order: number;
}

export interface EntityConfig {
  entityLabel: string;
  entityLabelPlural: string;
  fields: EntityFieldDefinition[];
}

export interface ModuleCatalogItem {
  key: string;
  name: string;
  category: 'Directory' | 'Operations' | 'Finance' | 'Commerce' | 'Administration';
  description: string;
}

export interface BusinessPreset {
  key: 'TRAINING' | 'RETAIL' | 'SERVICES' | 'CUSTOM';
  label: string;
  badge: string;
  description: string;
  defaultModules: string[];
  defaultEntityConfig: EntityConfig;
}

export const MODULE_CATALOG: Record<string, ModuleCatalogItem> = {
  PARTICIPANTS: {
    key: 'PARTICIPANTS',
    name: 'Participants & Trainees',
    category: 'Directory',
    description: 'Track member biodata, enrollment records, custom attributes, and status.',
  },
  TRAINING: {
    key: 'TRAINING',
    name: 'Training Programs & Cohorts',
    category: 'Operations',
    description: 'Organize training curricula, cohorts, instructors, sessions, and course syllabi.',
  },
  ATTENDANCE: {
    key: 'ATTENDANCE',
    name: 'Real-Time Attendance & QR Check-ins',
    category: 'Operations',
    description: 'Automated check-ins, roll calls, QR scanning, and presence analytics.',
  },
  PAYMENTS: {
    key: 'PAYMENTS',
    name: 'Payments & Fee Tracking',
    category: 'Finance',
    description: 'Record invoices, installment tuition, receipts, and revenue summaries.',
  },
  CUSTOMERS: {
    key: 'CUSTOMERS',
    name: 'Customers & CRM',
    category: 'Directory',
    description: 'Manage clients, contact profiles, purchase records, and communication notes.',
  },
  PRODUCTS: {
    key: 'PRODUCTS',
    name: 'Product Catalog & Services',
    category: 'Commerce',
    description: 'Maintain item listings, prices, SKU references, and stock variations.',
  },
  INVENTORY: {
    key: 'INVENTORY',
    name: 'Stock & Warehouse Levels',
    category: 'Commerce',
    description: 'Track real-time quantities, low stock alerts, and storage locations.',
  },
  ORDERS: {
    key: 'ORDERS',
    name: 'Orders & Sales Ledger',
    category: 'Commerce',
    description: 'Process customer sales, fulfillment stages, and order history.',
  },
  PROJECTS: {
    key: 'PROJECTS',
    name: 'Client Projects & Engagements',
    category: 'Operations',
    description: 'Deliver milestones, client briefs, deliverables, and timelines.',
  },
  TASKS: {
    key: 'TASKS',
    name: 'Operational Task Manager',
    category: 'Operations',
    description: 'Assign internal tasks, priority levels, due dates, and checklist items.',
  },
  INVOICES: {
    key: 'INVOICES',
    name: 'Invoices & Billing',
    category: 'Finance',
    description: 'Generate commercial invoices, manage due dates, and capture payments.',
  },
  FINANCE: {
    key: 'FINANCE',
    name: 'Financial Ledger & Cashflow',
    category: 'Finance',
    description: 'Income and expense transactions, financial summaries, and net margins.',
  },
  STAFF: {
    key: 'STAFF',
    name: 'Staff & Team Roster',
    category: 'Administration',
    description: 'Manage staff members, roles (OWNER, ADMIN, MEMBER), and team access permissions.',
  },
  REPORTS: {
    key: 'REPORTS',
    name: 'Reports & Intelligence',
    category: 'Administration',
    description: 'Business intelligence exports, operational summaries, and key performance reports.',
  },
};

export const BUSINESS_TYPE_PRESETS: Record<string, BusinessPreset> = {
  TRAINING: {
    key: 'TRAINING',
    label: 'Training & Academy',
    badge: 'Recommended',
    description: 'Manage cohorts, trainees, courses, instructors, attendance tracking, and completion certificates.',
    defaultModules: ['PARTICIPANTS', 'TRAINING', 'ATTENDANCE', 'PAYMENTS', 'STAFF', 'REPORTS'],
    defaultEntityConfig: {
      entityLabel: 'Participant',
      entityLabelPlural: 'Participants',
      fields: [
        { key: 'fullName', label: 'Full Name', type: 'text', required: true, enabled: true, order: 1 },
        { key: 'email', label: 'Email Address', type: 'email', required: true, enabled: true, order: 2 },
        { key: 'phone', label: 'Phone Number', type: 'phone', required: false, enabled: true, order: 3 },
        { key: 'courseTrack', label: 'Course Track / Cohort', type: 'text', required: false, enabled: true, order: 4 },
        { key: 'organization', label: 'Organization / Sponsor', type: 'text', required: false, enabled: true, order: 5 },
        { key: 'experienceLevel', label: 'Experience Level', type: 'select', options: ['Beginner', 'Intermediate', 'Advanced'], required: false, enabled: true, order: 6 },
        { key: 'dietaryRequirements', label: 'Dietary Requirements', type: 'text', required: false, enabled: true, order: 7 },
      ],
    },
  },
  RETAIL: {
    key: 'RETAIL',
    label: 'Retail & Commerce',
    badge: 'Popular',
    description: 'Streamline customer orders, product catalogs, point of sale records, and inventory tracking.',
    defaultModules: ['CUSTOMERS', 'PRODUCTS', 'INVENTORY', 'ORDERS', 'PAYMENTS', 'STAFF', 'REPORTS'],
    defaultEntityConfig: {
      entityLabel: 'Customer',
      entityLabelPlural: 'Customers',
      fields: [
        { key: 'fullName', label: 'Full Name', type: 'text', required: true, enabled: true, order: 1 },
        { key: 'email', label: 'Email Address', type: 'email', required: true, enabled: true, order: 2 },
        { key: 'phone', label: 'Phone Number', type: 'phone', required: false, enabled: true, order: 3 },
        { key: 'customerTier', label: 'Customer Tier', type: 'select', options: ['Retail', 'Wholesale', 'VIP'], required: false, enabled: true, order: 4 },
        { key: 'deliveryAddress', label: 'Delivery / Shipping Address', type: 'text', required: false, enabled: true, order: 5 },
        { key: 'paymentTerms', label: 'Payment Terms', type: 'select', options: ['Prepaid', 'Net 14', 'Net 30', 'Cash on Delivery'], required: false, enabled: true, order: 6 },
        { key: 'taxId', label: 'Tax ID / VAT No', type: 'text', required: false, enabled: true, order: 7 },
      ],
    },
  },
  SERVICES: {
    key: 'SERVICES',
    label: 'Professional Services',
    badge: 'Enterprise',
    description: 'Organize client accounts, consulting services, project schedules, and billing workflows.',
    defaultModules: ['CUSTOMERS', 'TASKS', 'INVOICES', 'PAYMENTS', 'FINANCE', 'STAFF', 'REPORTS'],
    defaultEntityConfig: {
      entityLabel: 'Client',
      entityLabelPlural: 'Clients',
      fields: [
        { key: 'fullName', label: 'Full Name / Primary Contact', type: 'text', required: true, enabled: true, order: 1 },
        { key: 'email', label: 'Email Address', type: 'email', required: true, enabled: true, order: 2 },
        { key: 'phone', label: 'Phone Number', type: 'phone', required: false, enabled: true, order: 3 },
        { key: 'companyName', label: 'Company / Organization Name', type: 'text', required: false, enabled: true, order: 4 },
        { key: 'industry', label: 'Client Industry', type: 'text', required: false, enabled: true, order: 5 },
        { key: 'engagementModel', label: 'Engagement Model', type: 'select', options: ['Retainer', 'Fixed Project', 'Hourly'], required: false, enabled: true, order: 6 },
        { key: 'billingContact', label: 'Billing Contact Person', type: 'text', required: false, enabled: true, order: 7 },
        { key: 'budgetRange', label: 'Budget Range', type: 'text', required: false, enabled: true, order: 8 },
      ],
    },
  },
  CUSTOM: {
    key: 'CUSTOM',
    label: 'Custom Enterprise',
    badge: 'Flexible',
    description: 'Build a bespoke operating system tailored specifically to your organization’s workflow needs.',
    defaultModules: ['CUSTOMERS', 'TASKS', 'STAFF', 'REPORTS'],
    defaultEntityConfig: {
      entityLabel: 'Customer',
      entityLabelPlural: 'Customers',
      fields: [
        { key: 'fullName', label: 'Full Name', type: 'text', required: true, enabled: true, order: 1 },
        { key: 'email', label: 'Email Address', type: 'email', required: true, enabled: true, order: 2 },
        { key: 'phone', label: 'Phone Number', type: 'phone', required: false, enabled: true, order: 3 },
        { key: 'accountCategory', label: 'Account Category', type: 'text', required: false, enabled: true, order: 4 },
        { key: 'notes', label: 'Special Instructions', type: 'text', required: false, enabled: true, order: 5 },
      ],
    },
  },
};
