export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'COMPLETED' | 'OVERDUE' | 'CANCELLED';

export interface TaskChecklistItem {
  id: string;
  text: string;
  isDone: boolean;
}

export interface TaskItem {
  id: string;
  workspaceId?: string;
  title: string;
  description?: string;
  assigneeName?: string;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate?: string | null;
  category?: string;
  checklist?: TaskChecklistItem[];
  createdAt?: string;
  updatedAt?: string;
}

export type CustomerType = 'STANDARD' | 'VIP' | 'WHOLESALE' | 'LEAD';
export type CustomerStatus = 'ACTIVE' | 'INACTIVE' | 'LEAD';

export interface CustomerItem {
  id: string;
  workspaceId?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: string;
  customerType: CustomerType;
  status: CustomerStatus;
  notes?: string;
  tags?: string[];
  assignedStaff?: string;
  totalSpent?: number;
  metadata?: Record<string, any>;
  createdAt?: string;
  updatedAt?: string;
}

export interface StaffItem {
  id: string;
  userId?: string;
  fullName: string;
  email: string;
  role: 'OWNER' | 'ADMIN' | 'MANAGER' | 'STAFF' | string;
  department: string;
  status: 'ACTIVE' | 'INVITED' | 'INACTIVE' | string;
  joinedAt?: string;
}

export type TransactionType = 'INCOME' | 'EXPENSE' | 'REFUND' | 'TRANSFER';
export type TransactionStatus = 'PAID' | 'PENDING' | 'OVERDUE' | 'FAILED';

export interface TransactionItem {
  id: string;
  workspaceId?: string;
  type: TransactionType;
  amount: number;
  category: string;
  status: TransactionStatus;
  date: string;
  description: string;
  reference?: string;
  createdAt?: string;
}

export interface InvoiceLineItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export type InvoiceStatus = 'DRAFT' | 'PENDING' | 'PAID' | 'OVERDUE';

export interface InvoiceItem {
  id: string;
  workspaceId?: string;
  invoiceNumber: string;
  customerName: string;
  customerEmail: string;
  items: InvoiceLineItem[];
  subtotal: number;
  tax: number;
  discount: number;
  totalAmount: number;
  status: InvoiceStatus;
  issueDate?: string;
  dueDate: string;
  notes?: string;
  createdAt?: string;
}

export interface NotificationItem {
  id: string;
  workspaceId?: string;
  category: 'TASKS' | 'CUSTOMERS' | 'PAYMENTS' | 'STAFF' | 'SYSTEM' | 'ALERTS';
  title: string;
  description: string;
  isRead: boolean;
  relatedRecordId?: string;
  relatedRecordType?: string;
  createdAt: string;
}

export interface SearchResult {
  id: string;
  title: string;
  type: 'CUSTOMER' | 'TASK' | 'INVOICE' | 'TRANSACTION' | 'STAFF' | 'REPORT';
  meta?: string;
  updatedAt?: string;
}

export interface FinanceSummary {
  totalRevenue: number;
  totalExpenses: number;
  netIncome: number;
  outstandingPayments: number;
}

export interface RolePermissions {
  dashboard: { view: boolean; export: boolean };
  customers: { view: boolean; create: boolean; edit: boolean; delete: boolean; export: boolean };
  staff: { view: boolean; create: boolean; edit: boolean; delete: boolean; approve: boolean };
  tasks: { view: boolean; create: boolean; edit: boolean; delete: boolean };
  finance: { view: boolean; create: boolean; edit: boolean; export: boolean };
  reports: { view: boolean; export: boolean };
  settings: { view: boolean; edit: boolean };
}
