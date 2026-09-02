import { apiClient } from '@/lib/api';
import {
  TrainingBatch,
  TrainingPayment,
  TrainingReceipt,
  TrainingCertificate,
  ParticipantPaymentSummary,
  CreateTrainingBatchPayload,
  CreateTrainingPaymentPayload,
} from '@/types/workspace';

const buildQS = (params: Record<string, string | undefined>) => {
  const p = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => { if (v) p.append(k, v); });
  const s = p.toString();
  return s ? `?${s}` : '';
};

export const trainingService = {
  // ── Batches ────────────────────────────────────────────────────────────────
  getBatches: (workspaceId?: string) =>
    apiClient<{ data: TrainingBatch[] }>(`/api/training/batches${buildQS({ workspaceId })}`, {
      method: 'GET', requiresAuth: true,
    }),

  createBatch: (payload: CreateTrainingBatchPayload) =>
    apiClient<{ message: string; data: TrainingBatch }>('/api/training/batches', {
      method: 'POST', body: JSON.stringify(payload), requiresAuth: true,
    }),

  getBatchById: (id: string, workspaceId?: string) =>
    apiClient<{ data: TrainingBatch & { participants: any[] } }>(
      `/api/training/batches/${id}${buildQS({ workspaceId })}`,
      { method: 'GET', requiresAuth: true }
    ),

  updateBatch: (id: string, payload: Partial<CreateTrainingBatchPayload>) =>
    apiClient<{ message: string; data: TrainingBatch }>(`/api/training/batches/${id}`, {
      method: 'PUT', body: JSON.stringify(payload), requiresAuth: true,
    }),

  deleteBatch: (id: string, workspaceId?: string) =>
    apiClient<{ message: string }>(`/api/training/batches/${id}${buildQS({ workspaceId })}`, {
      method: 'DELETE', requiresAuth: true,
    }),

  // ── Payments ───────────────────────────────────────────────────────────────
  getPayments: (workspaceId?: string, participantId?: string, batchId?: string) =>
    apiClient<{ data: TrainingPayment[] }>(
      `/api/training/payments${buildQS({ workspaceId, participantId, batchId })}`,
      { method: 'GET', requiresAuth: true }
    ),

  createPayment: (payload: CreateTrainingPaymentPayload) =>
    apiClient<{ message: string; data: { payment: TrainingPayment; receipt: TrainingReceipt } }>(
      '/api/training/payments',
      { method: 'POST', body: JSON.stringify(payload), requiresAuth: true }
    ),

  getPaymentById: (id: string, workspaceId?: string) =>
    apiClient<{ data: TrainingPayment }>(
      `/api/training/payments/${id}${buildQS({ workspaceId })}`,
      { method: 'GET', requiresAuth: true }
    ),

  deletePayment: (id: string, workspaceId?: string) =>
    apiClient<{ message: string }>(
      `/api/training/payments/${id}${buildQS({ workspaceId })}`,
      { method: 'DELETE', requiresAuth: true }
    ),

  getParticipantPaymentSummary: (participantId: string, workspaceId?: string) =>
    apiClient<{ data: ParticipantPaymentSummary }>(
      `/api/training/payments/participant/${participantId}/summary${buildQS({ workspaceId })}`,
      { method: 'GET', requiresAuth: true }
    ),

  // ── Receipts ───────────────────────────────────────────────────────────────
  getReceipts: (workspaceId?: string, participantId?: string) =>
    apiClient<{ data: TrainingReceipt[] }>(
      `/api/training/receipts${buildQS({ workspaceId, participantId })}`,
      { method: 'GET', requiresAuth: true }
    ),

  getReceiptById: (id: string, workspaceId?: string) =>
    apiClient<{ data: TrainingReceipt & { workspace?: any } }>(
      `/api/training/receipts/${id}${buildQS({ workspaceId })}`,
      { method: 'GET', requiresAuth: true }
    ),

  // ── Certificates ───────────────────────────────────────────────────────────
  getCertificates: (workspaceId?: string, batchId?: string, status?: string) =>
    apiClient<{ data: TrainingCertificate[] }>(
      `/api/training/certificates${buildQS({ workspaceId, batchId, status })}`,
      { method: 'GET', requiresAuth: true }
    ),

  issueCertificate: (participantId: string, workspaceId?: string) =>
    apiClient<{ message: string; data: TrainingCertificate }>(
      `/api/training/certificates/${participantId}/issue${buildQS({ workspaceId })}`,
      { method: 'POST', body: JSON.stringify({ workspaceId }), requiresAuth: true }
    ),

  getCertificateById: (id: string, workspaceId?: string) =>
    apiClient<{ data: TrainingCertificate }>(
      `/api/training/certificates/${id}${buildQS({ workspaceId })}`,
      { method: 'GET', requiresAuth: true }
    ),

  // ── Training Dashboard ─────────────────────────────────────────────────────
  getTrainingDashboard: (workspaceId?: string) =>
    apiClient<{ data: any }>(
      `/api/training/dashboard${buildQS({ workspaceId })}`,
      { method: 'GET', requiresAuth: true }
    ),

  // ── Reports ────────────────────────────────────────────────────────────────
  getTrainingReports: (workspaceId?: string, batchId?: string) =>
    apiClient<{ data: any }>(
      `/api/training/reports${buildQS({ workspaceId, batchId })}`,
      { method: 'GET', requiresAuth: true }
    ),
};
