export type TaskStatus = 'To Do' | 'In Progress' | 'Completed' | 'Overdue' | 'Cancelled';
export type TaskPriority = 'Low' | 'Medium' | 'High' | 'Urgent';

export interface TaskChecklistItem {
  id: string;
  title: string;
  completed: boolean;
}

export interface TaskComment {
  id: string;
  author: string;
  avatar?: string;
  content: string;
  createdAt: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assigneeName: string;
  assigneeEmail: string;
  assigneeAvatar?: string;
  dueDate: string;
  category: string;
  customerName?: string;
  projectName?: string;
  checklist: TaskChecklistItem[];
  comments: TaskComment[];
  createdAt: string;
  createdBy: string;
}

export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  customerType: 'Individual' | 'Corporate' | 'Enterprise' | 'Partner';
  status: 'Active' | 'Lead' | 'Inactive' | 'VIP';
  tags: string[];
  notes: string;
  totalTransactions: number;
  totalSpent: number;
  assignedStaff: string;
  lastActivity: string;
  createdAt: string;
}

export interface StaffMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'Administrator' | 'Manager' | 'Staff';
  department: string;
  status: 'Active' | 'Inactive' | 'On Leave';
  tasksAssigned: number;
  tasksCompleted: number;
  lastActive: string;
  joinedDate: string;
  permissions: string[];
}

export type TransactionType = 'Income' | 'Expense' | 'Refund' | 'Transfer';
export type TransactionStatus = 'Completed' | 'Pending' | 'Failed';

export interface Transaction {
  id: string;
  title: string;
  type: TransactionType;
  category: string;
  amount: number;
  currency: string;
  status: TransactionStatus;
  customerName?: string;
  date: string;
  reference: string;
}

export type InvoiceStatus = 'Paid' | 'Pending' | 'Overdue' | 'Draft';

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  customerName: string;
  customerEmail: string;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  discount: number;
  totalAmount: number;
  currency: string;
  status: InvoiceStatus;
  issueDate: string;
  dueDate: string;
  notes?: string;
}

export interface ReportMetric {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  description: string;
}

export interface ReportItem {
  id: string;
  title: string;
  category: 'Business performance' | 'Financial' | 'Staff' | 'Customer' | 'Tasks' | 'Operations';
  summary: string;
  dateRange: string;
  generatedDate: string;
  metrics: ReportMetric[];
}

export interface AppNotification {
  id: string;
  category: 'Tasks' | 'Customers' | 'Payments' | 'Staff' | 'System' | 'Alerts';
  title: string;
  description: string;
  time: string;
  read: boolean;
  relatedId?: string;
  relatedType?: string;
}

export interface ActivityLogItem {
  id: string;
  userName: string;
  userRole: string;
  action: string;
  recordAffected: string;
  module: string;
  timestamp: string;
  ipAddress: string;
}

export interface OrganizationSettings {
  name: string;
  logo: string;
  email: string;
  phone: string;
  address: string;
  country: string;
  state: string;
  website: string;
  currency: string;
  timeZone: string;
  businessType: string;
}

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  role: string;
  avatar: string;
  department: string;
}
