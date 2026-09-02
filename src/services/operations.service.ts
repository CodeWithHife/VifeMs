import { apiClient } from '@/lib/api';
import {
  TaskItem,
  CustomerItem,
  StaffItem,
  TransactionItem,
  InvoiceItem,
  NotificationItem,
  SearchResult,
  FinanceSummary,
} from '@/types/operations';

export const operationsService = {
  // --- 1. Tasks ---
  getTasks: async (
    workspaceId?: string,
    status?: string,
    priority?: string,
    search?: string
  ): Promise<{ data: TaskItem[] }> => {
    const params = new URLSearchParams();
    if (workspaceId) params.append('workspaceId', workspaceId);
    if (status && status !== 'ALL') params.append('status', status);
    if (priority && priority !== 'ALL') params.append('priority', priority);
    if (search && search.trim()) params.append('search', search.trim());

    const qs = params.toString() ? `?${params.toString()}` : '';
    return await apiClient<{ data: TaskItem[] }>(`/api/tasks${qs}`, {
      method: 'GET',
      requiresAuth: true,
    });
  },

  createTask: async (payload: {
    workspaceId?: string;
    title: string;
    description?: string;
    assigneeName?: string;
    priority?: string;
    status?: string;
    dueDate?: string | null;
    category?: string;
    checklist?: { id: string; text: string; isDone: boolean }[];
  }): Promise<{ message: string; data: TaskItem }> => {
    return await apiClient<{ message: string; data: TaskItem }>('/api/tasks', {
      method: 'POST',
      body: JSON.stringify(payload),
      requiresAuth: true,
    });
  },

  updateTask: async (
    id: string,
    payload: Partial<TaskItem>
  ): Promise<{ message: string; data: TaskItem }> => {
    return await apiClient<{ message: string; data: TaskItem }>(`/api/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
      requiresAuth: true,
    });
  },

  deleteTask: async (id: string): Promise<{ message: string }> => {
    return await apiClient<{ message: string }>(`/api/tasks/${id}`, {
      method: 'DELETE',
      requiresAuth: true,
    });
  },

  // --- 2. Customers / CRM ---
  getCustomers: async (
    workspaceId?: string,
    status?: string,
    search?: string,
    customerType?: string
  ): Promise<{ data: CustomerItem[]; entityConfig?: any }> => {
    const params = new URLSearchParams();
    if (workspaceId) params.append('workspaceId', workspaceId);
    if (status && status !== 'ALL') params.append('status', status);
    if (customerType && customerType !== 'ALL') params.append('customerType', customerType);
    if (search && search.trim()) params.append('search', search.trim());

    const qs = params.toString() ? `?${params.toString()}` : '';
    return await apiClient<{ data: CustomerItem[]; entityConfig?: any }>(`/api/customers${qs}`, {
      method: 'GET',
      requiresAuth: true,
    });
  },

  createCustomer: async (payload: {
    workspaceId?: string;
    firstName: string;
    lastName?: string;
    email: string;
    phone?: string;
    address?: string;
    customerType?: string;
    status?: string;
    notes?: string;
    tags?: string[];
    assignedStaff?: string;
    metadata?: Record<string, any>;
  }): Promise<{ message: string; data: CustomerItem }> => {
    return await apiClient<{ message: string; data: CustomerItem }>('/api/customers', {
      method: 'POST',
      body: JSON.stringify(payload),
      requiresAuth: true,
    });
  },

  getCustomerById: async (id: string): Promise<{ data: CustomerItem }> => {
    return await apiClient<{ data: CustomerItem }>(`/api/customers/${id}`, {
      method: 'GET',
      requiresAuth: true,
    });
  },

  updateCustomer: async (
    id: string,
    payload: Partial<CustomerItem>
  ): Promise<{ message: string; data: CustomerItem }> => {
    return await apiClient<{ message: string; data: CustomerItem }>(`/api/customers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
      requiresAuth: true,
    });
  },

  deleteCustomer: async (id: string): Promise<{ message: string }> => {
    return await apiClient<{ message: string }>(`/api/customers/${id}`, {
      method: 'DELETE',
      requiresAuth: true,
    });
  },

  // --- 3. Staff ---
  getStaff: async (workspaceId?: string): Promise<{ data: StaffItem[] }> => {
    const query = workspaceId ? `?workspaceId=${encodeURIComponent(workspaceId)}` : '';
    return await apiClient<{ data: StaffItem[] }>(`/api/staff${query}`, {
      method: 'GET',
      requiresAuth: true,
    });
  },

  // --- 4. Finance & Transactions ---
  getFinanceOverview: async (
    workspaceId?: string
  ): Promise<{ summary: FinanceSummary; recentTransactions: TransactionItem[] }> => {
    const query = workspaceId ? `?workspaceId=${encodeURIComponent(workspaceId)}` : '';
    return await apiClient<{ summary: FinanceSummary; recentTransactions: TransactionItem[] }>(
      `/api/finance/overview${query}`,
      {
        method: 'GET',
        requiresAuth: true,
      }
    );
  },

  getTransactions: async (
    workspaceId?: string,
    type?: string,
    status?: string,
    search?: string
  ): Promise<{ data: TransactionItem[] }> => {
    const params = new URLSearchParams();
    if (workspaceId) params.append('workspaceId', workspaceId);
    if (type && type !== 'ALL') params.append('type', type);
    if (status && status !== 'ALL') params.append('status', status);
    if (search && search.trim()) params.append('search', search.trim());

    const qs = params.toString() ? `?${params.toString()}` : '';
    return await apiClient<{ data: TransactionItem[] }>(`/api/transactions${qs}`, {
      method: 'GET',
      requiresAuth: true,
    });
  },

  createTransaction: async (payload: {
    workspaceId?: string;
    type: string;
    amount: number;
    category?: string;
    status?: string;
    date?: string;
    description: string;
    reference?: string;
  }): Promise<{ message: string; data: TransactionItem }> => {
    return await apiClient<{ message: string; data: TransactionItem }>('/api/transactions', {
      method: 'POST',
      body: JSON.stringify(payload),
      requiresAuth: true,
    });
  },

  // --- 5. Invoices ---
  getInvoices: async (
    workspaceId?: string,
    status?: string,
    search?: string
  ): Promise<{ data: InvoiceItem[] }> => {
    const params = new URLSearchParams();
    if (workspaceId) params.append('workspaceId', workspaceId);
    if (status && status !== 'ALL') params.append('status', status);
    if (search && search.trim()) params.append('search', search.trim());

    const qs = params.toString() ? `?${params.toString()}` : '';
    return await apiClient<{ data: InvoiceItem[] }>(`/api/invoices${qs}`, {
      method: 'GET',
      requiresAuth: true,
    });
  },

  createInvoice: async (payload: {
    workspaceId?: string;
    invoiceNumber?: string;
    customerName: string;
    customerEmail: string;
    items: { description: string; quantity: number; unitPrice: number }[];
    subtotal?: number;
    tax?: number;
    discount?: number;
    totalAmount?: number;
    status?: string;
    dueDate?: string;
    notes?: string;
  }): Promise<{ message: string; data: InvoiceItem }> => {
    return await apiClient<{ message: string; data: InvoiceItem }>('/api/invoices', {
      method: 'POST',
      body: JSON.stringify(payload),
      requiresAuth: true,
    });
  },

  // --- 6. Global Search ---
  globalSearch: async (workspaceId?: string, q?: string): Promise<{ results: SearchResult[] }> => {
    const params = new URLSearchParams();
    if (workspaceId) params.append('workspaceId', workspaceId);
    if (q && q.trim()) params.append('q', q.trim());

    const qs = params.toString() ? `?${params.toString()}` : '';
    return await apiClient<{ results: SearchResult[] }>(`/api/search${qs}`, {
      method: 'GET',
      requiresAuth: true,
    });
  },

  // --- 7. Notifications ---
  getNotifications: async (
    workspaceId?: string
  ): Promise<{ notifications: NotificationItem[]; unreadCount: number }> => {
    const query = workspaceId ? `?workspaceId=${encodeURIComponent(workspaceId)}` : '';
    return await apiClient<{ notifications: NotificationItem[]; unreadCount: number }>(
      `/api/notifications${query}`,
      {
        method: 'GET',
        requiresAuth: true,
      }
    );
  },

  markNotificationRead: async (id: string, workspaceId?: string): Promise<{ message: string }> => {
    const query = workspaceId ? `?workspaceId=${encodeURIComponent(workspaceId)}` : '';
    return await apiClient<{ message: string }>(`/api/notifications/${id}/read${query}`, {
      method: 'PUT',
      requiresAuth: true,
    });
  },

  getActivityLogs: async (workspaceId?: string): Promise<{ data: any[] }> => {
    const query = workspaceId ? `?workspaceId=${encodeURIComponent(workspaceId)}` : '';
    return await apiClient<{ data: any[] }>(`/api/activity-logs${query}`, {
      method: 'GET',
      requiresAuth: true,
    });
  },
};
