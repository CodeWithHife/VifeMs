import { EntityConfig } from '@/lib/moduleCatalog';

export interface WorkspaceModule {
  id?: string;
  moduleKey: string;
  isEnabled: boolean;
  settings?: any;
}

export interface Workspace {
  id: string;
  name: string;
  slug?: string;
  businessType: 'TRAINING' | 'RETAIL' | 'SERVICES' | 'CUSTOM' | string;
  status?: string;
  email?: string;
  phone?: string;
  address?: string;
  country?: string;
  state?: string;
  website?: string;
  currency?: string;
  timeZone?: string;
  entityConfig?: EntityConfig;
  userRole?: 'OWNER' | 'ADMIN' | 'MEMBER' | string;
  onboardingStep?: string;
  isCompleted?: boolean;
  createdAt?: string;
  modules?: WorkspaceModule[];
}

export interface ActivityLog {
  id: string;
  workspaceId: string;
  userId?: string;
  action: string;
  details: string;
  createdAt: string;
}

export interface DashboardStats {
  workspace: {
    id: string;
    name: string;
    slug?: string;
    businessType: string;
    status?: string;
    email?: string;
    phone?: string;
    address?: string;
    currency?: string;
    timeZone?: string;
    entityConfig?: EntityConfig;
    userRole?: string;
  };
  enabledModules: string[];
  stats: {
    totalParticipants?: number;
    totalCustomers?: number;
    totalTasks?: number;
    completedTasks?: number;
    totalRevenue?: number;
    totalExpenses?: number;
    netIncome?: number;
    totalInvoices?: number;
    pendingInvoices?: number;
    totalStaff?: number;
    // Training-specific
    totalCollected?: number;
    totalExpected?: number;
    totalOutstanding?: number;
    activeBatch?: TrainingBatch | null;
  };
  recentActivity: ActivityLog[];
  alerts?: any[];
}

export interface Participant {
  id: string;
  workspaceId: string;
  batchId?: string | null;
  fullName: string;
  email: string;
  phone?: string | null;
  refId?: string | null;
  status: 'REGISTERED' | 'CONFIRMED' | 'ATTENDED' | 'CANCELLED' | 'PENDING' | string;
  photoUrl?: string | null;
  applicationFee?: number;
  trainingFee?: number;
  certificateStatus?: 'PENDING' | 'ISSUED' | string;
  metadata?: Record<string, any>;
  batch?: { id: string; name: string; program?: string | null } | null;
  createdAt: string;
  updatedAt?: string;
}

export interface TrainingBatch {
  id: string;
  workspaceId: string;
  name: string;
  program?: string | null;
  description?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  status: 'UPCOMING' | 'ACTIVE' | 'COMPLETED' | string;
  createdAt: string;
  updatedAt?: string;
  _count?: { participants: number };
}

export interface TrainingPayment {
  id: string;
  workspaceId: string;
  participantId: string;
  batchId?: string | null;
  receiptNumber?: string | null;
  amount: number;
  paymentFor: 'APPLICATION_FEE' | 'TRAINING_FEE' | 'OTHER' | string;
  paymentDate: string;
  notes?: string | null;
  createdAt: string;
  participant?: { id: string; fullName: string; refId?: string | null; applicationFee?: number; trainingFee?: number };
  receipt?: { id: string; receiptNumber: string } | null;
}

export interface TrainingReceipt {
  id: string;
  workspaceId: string;
  participantId: string;
  paymentId: string;
  receiptNumber: string;
  amount: number;
  paymentFor: string;
  balanceAtTime: number;
  issuedAt: string;
  createdAt: string;
  participant?: { id: string; fullName: string; refId?: string | null; phone?: string | null };
  payment?: { paymentFor: string; paymentDate: string; notes?: string | null };
  workspace?: { name: string; email?: string; phone?: string; address?: string };
}

export interface TrainingCertificate {
  id: string;
  workspaceId: string;
  participantId: string;
  batchId?: string | null;
  certificateNumber?: string | null;
  status: 'PENDING' | 'ISSUED' | string;
  issuedAt?: string | null;
  createdAt: string;
  updatedAt?: string;
  participant?: { id: string; fullName: string; refId?: string | null; phone?: string | null };
  batch?: { name: string; program?: string | null } | null;
}

export interface ParticipantPaymentSummary {
  participant: Participant;
  payments: TrainingPayment[];
  summary: {
    applicationFee: number;
    trainingFee: number;
    totalFees: number;
    totalPaid: number;
    balance: number;
    paymentStatus: 'UNPAID' | 'PARTIALLY_PAID' | 'FULLY_PAID' | string;
  };
}

export interface WorkspaceTeamMember {
  id: string;
  fullName?: string;
  email: string;
  role: 'OWNER' | 'ADMIN' | 'MEMBER' | 'ADMINISTRATOR' | 'INSTRUCTOR' | 'COORDINATOR' | 'VIEWER' | string;
  status: 'ACTIVE' | 'INVITED' | string;
  joinedAt: string;
}

export interface CreateWorkspacePayload {
  name: string;
  businessType: string;
  modules?: string[];
  entityConfig?: EntityConfig;
}

export interface CreateParticipantPayload {
  workspaceId: string;
  fullName: string;
  email: string;
  phone?: string;
  status?: string;
  batchId?: string;
  applicationFee?: number;
  trainingFee?: number;
  metadata?: Record<string, any>;
}

export interface PublicRegisterPayload {
  workspaceSlug: string;
  fullName: string;
  email: string;
  phone?: string;
  metadata?: Record<string, any>;
}

export interface FormField {
  id?: string;
  key: string;
  label: string;
  type: 'text' | 'textarea' | 'email' | 'tel' | 'number' | 'date' | 'select' | 'radio' | 'checkbox' | 'file' | 'image' | string;
  required: boolean;
  options?: string[];
  placeholder?: string;
  isSystem?: boolean;
}

export interface RegistrationLink {
  id: string;
  workspaceId: string;
  slug: string;
  name: string;
  program?: string | null;
  description?: string | null;
  deadline?: string | null;
  maxParticipants?: number | null;
  requireApproval: boolean;
  formFields: FormField[];
  status: 'ACTIVE' | 'DISABLED' | 'EXPIRED' | 'FULL' | string;
  batchId?: string | null;
  createdByUserId?: string | null;
  createdAt: string;
  updatedAt?: string;
  _count?: { submissions: number };
}

export interface RegistrationSubmission {
  id: string;
  workspaceId: string;
  registrationLinkId: string;
  batchId?: string | null;
  fullName: string;
  email: string;
  phone?: string | null;
  formData: Record<string, any>;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | string;
  rejectionReason?: string | null;
  submittedAt: string;
  reviewedAt?: string | null;
  registrationLink?: { name: string; program?: string | null };
}

export interface RefIdConfig {
  id: string;
  workspaceId: string;
  prefix: string;
  separator: string;
  padding: number;
  startingNumber: number;
  sequence: number;
  receiptSequence: number;
  useYear: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRegistrationLinkPayload {
  workspaceId?: string;
  name: string;
  program?: string;
  description?: string;
  deadline?: string;
  maxParticipants?: number;
  requireApproval?: boolean;
  formFields?: FormField[];
  batchId?: string;
}

export interface CreateTrainingBatchPayload {
  workspaceId?: string;
  name: string;
  program?: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  status?: string;
}

export interface CreateTrainingPaymentPayload {
  workspaceId?: string;
  participantId: string;
  batchId?: string;
  amount: number;
  paymentFor?: string;
  paymentDate?: string;
  notes?: string;
}
