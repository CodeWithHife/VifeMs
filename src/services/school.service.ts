import { apiClient } from '@/lib/api';
import {
  Student,
  SchoolClass,
  AcademicSession,
  Subject,
  StaffRecord,
  AttendanceRecord,
  FeeStructure,
  StudentFee,
  LibraryBook,
  LibraryBorrowing,
  SchoolDashboardStats,
} from '@/types/school';

// Helper to append workspaceId to query params
const withWorkspace = (base: string, workspaceId: string, extra?: Record<string, string>) => {
  const params = new URLSearchParams({ workspaceId, ...extra });
  return `${base}?${params.toString()}`;
};

const headers = (workspaceId: string) => ({
  'x-workspace-id': workspaceId,
} as HeadersInit);

export const schoolService = {
  // ─── Dashboard ──────────────────────────────────────────────────────────────
  getDashboard: (workspaceId: string) =>
    apiClient<{ data: SchoolDashboardStats }>(withWorkspace('/api/school/dashboard', workspaceId), {
      method: 'GET',
      requiresAuth: true,
      headers: headers(workspaceId),
    }),

  // ─── Students ───────────────────────────────────────────────────────────────
  getStudents: (workspaceId: string) =>
    apiClient<{ data: Student[] }>(withWorkspace('/api/school/students', workspaceId), {
      method: 'GET',
      requiresAuth: true,
      headers: headers(workspaceId),
    }),

  getStudent: (workspaceId: string, id: string) =>
    apiClient<{ data: Student }>(withWorkspace(`/api/school/students/${id}`, workspaceId), {
      method: 'GET',
      requiresAuth: true,
      headers: headers(workspaceId),
    }),

  createStudent: (workspaceId: string, data: Partial<Student>) =>
    apiClient<{ data: Student }>('/api/school/students', {
      method: 'POST',
      body: JSON.stringify({ ...data, workspaceId }),
      requiresAuth: true,
      headers: headers(workspaceId),
    }),

  updateStudent: (workspaceId: string, id: string, data: Partial<Student>) =>
    apiClient<{ data: Student }>(`/api/school/students/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ ...data, workspaceId }),
      requiresAuth: true,
      headers: headers(workspaceId),
    }),

  // ─── Classes ────────────────────────────────────────────────────────────────
  getClasses: (workspaceId: string) =>
    apiClient<{ data: SchoolClass[] }>(withWorkspace('/api/school/classes', workspaceId), {
      method: 'GET',
      requiresAuth: true,
      headers: headers(workspaceId),
    }),

  createClass: (workspaceId: string, data: Partial<SchoolClass>) =>
    apiClient<{ data: SchoolClass }>('/api/school/classes', {
      method: 'POST',
      body: JSON.stringify({ ...data, workspaceId }),
      requiresAuth: true,
      headers: headers(workspaceId),
    }),

  updateClass: (workspaceId: string, id: string, data: Partial<SchoolClass>) =>
    apiClient<{ data: SchoolClass }>(`/api/school/classes/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ ...data, workspaceId }),
      requiresAuth: true,
      headers: headers(workspaceId),
    }),

  // ─── Academic Sessions ──────────────────────────────────────────────────────
  getSessions: (workspaceId: string) =>
    apiClient<{ data: AcademicSession[] }>(withWorkspace('/api/school/sessions', workspaceId), {
      method: 'GET',
      requiresAuth: true,
      headers: headers(workspaceId),
    }),

  createSession: (workspaceId: string, data: Partial<AcademicSession>) =>
    apiClient<{ data: AcademicSession }>('/api/school/sessions', {
      method: 'POST',
      body: JSON.stringify({ ...data, workspaceId }),
      requiresAuth: true,
      headers: headers(workspaceId),
    }),

  setCurrentSession: (workspaceId: string, id: string) =>
    apiClient<{ message: string }>(`/api/school/sessions/${id}/set-current`, {
      method: 'POST',
      body: JSON.stringify({ workspaceId }),
      requiresAuth: true,
      headers: headers(workspaceId),
    }),

  // ─── Subjects ───────────────────────────────────────────────────────────────
  getSubjects: (workspaceId: string) =>
    apiClient<{ data: Subject[] }>(withWorkspace('/api/school/subjects', workspaceId), {
      method: 'GET',
      requiresAuth: true,
      headers: headers(workspaceId),
    }),

  createSubject: (workspaceId: string, data: Partial<Subject>) =>
    apiClient<{ data: Subject }>('/api/school/subjects', {
      method: 'POST',
      body: JSON.stringify({ ...data, workspaceId }),
      requiresAuth: true,
      headers: headers(workspaceId),
    }),

  // ─── Staff ──────────────────────────────────────────────────────────────────
  getStaff: (workspaceId: string) =>
    apiClient<{ data: StaffRecord[] }>(withWorkspace('/api/school/staff', workspaceId), {
      method: 'GET',
      requiresAuth: true,
      headers: headers(workspaceId),
    }),

  createStaff: (workspaceId: string, data: Partial<StaffRecord>) =>
    apiClient<{ data: StaffRecord }>('/api/school/staff', {
      method: 'POST',
      body: JSON.stringify({ ...data, workspaceId }),
      requiresAuth: true,
      headers: headers(workspaceId),
    }),

  // ─── Attendance ──────────────────────────────────────────────────────────────
  getAttendance: (workspaceId: string, classId?: string, date?: string) => {
    const extra: Record<string, string> = {};
    if (classId) extra.classId = classId;
    if (date) extra.date = date;
    return apiClient<{ data: AttendanceRecord[] }>(withWorkspace('/api/school/attendance', workspaceId, extra), {
      method: 'GET',
      requiresAuth: true,
      headers: headers(workspaceId),
    });
  },

  recordAttendance: (workspaceId: string, classId: string, date: string, records: Array<{ studentId: string; status: string; note?: string }>) =>
    apiClient<{ message: string }>('/api/school/attendance', {
      method: 'POST',
      body: JSON.stringify({ workspaceId, classId, date, records }),
      requiresAuth: true,
      headers: headers(workspaceId),
    }),

  // ─── Results ─────────────────────────────────────────────────────────────────
  getResults: (workspaceId: string, assessmentId?: string, studentId?: string) => {
    const extra: Record<string, string> = {};
    if (assessmentId) extra.assessmentId = assessmentId;
    if (studentId) extra.studentId = studentId;
    return apiClient<{ data: unknown[] }>(withWorkspace('/api/school/results', workspaceId, extra), {
      method: 'GET',
      requiresAuth: true,
      headers: headers(workspaceId),
    });
  },

  saveResult: (workspaceId: string, data: Record<string, unknown>) =>
    apiClient<{ message: string }>('/api/school/results', {
      method: 'POST',
      body: JSON.stringify({ ...data, workspaceId }),
      requiresAuth: true,
      headers: headers(workspaceId),
    }),

  // ─── Fees ────────────────────────────────────────────────────────────────────
  getFeeStructures: (workspaceId: string) =>
    apiClient<{ data: FeeStructure[] }>(withWorkspace('/api/school/fees/structures', workspaceId), {
      method: 'GET',
      requiresAuth: true,
      headers: headers(workspaceId),
    }),

  getStudentFees: (workspaceId: string, studentId: string) =>
    apiClient<{ data: StudentFee[] }>(withWorkspace(`/api/school/fees/students/${studentId}`, workspaceId), {
      method: 'GET',
      requiresAuth: true,
      headers: headers(workspaceId),
    }),

  recordFeePayment: (workspaceId: string, data: Record<string, unknown>) =>
    apiClient<{ message: string }>('/api/school/fees/payments', {
      method: 'POST',
      body: JSON.stringify({ ...data, workspaceId }),
      requiresAuth: true,
      headers: headers(workspaceId),
    }),

  // ─── Library ─────────────────────────────────────────────────────────────────
  getBooks: (workspaceId: string) =>
    apiClient<{ data: LibraryBook[] }>(withWorkspace('/api/school/library/books', workspaceId), {
      method: 'GET',
      requiresAuth: true,
      headers: headers(workspaceId),
    }),

  createBook: (workspaceId: string, data: Partial<LibraryBook>) =>
    apiClient<{ data: LibraryBook }>('/api/school/library/books', {
      method: 'POST',
      body: JSON.stringify({ ...data, workspaceId }),
      requiresAuth: true,
      headers: headers(workspaceId),
    }),

  getBorrowings: (workspaceId: string) =>
    apiClient<{ data: LibraryBorrowing[] }>(withWorkspace('/api/school/library/borrowings', workspaceId), {
      method: 'GET',
      requiresAuth: true,
      headers: headers(workspaceId),
    }),

  issueBorrowing: (workspaceId: string, data: Record<string, unknown>) =>
    apiClient<{ data: LibraryBorrowing }>('/api/school/library/borrowings', {
      method: 'POST',
      body: JSON.stringify({ ...data, workspaceId }),
      requiresAuth: true,
      headers: headers(workspaceId),
    }),

  returnBorrowing: (workspaceId: string, id: string) =>
    apiClient<{ message: string }>(`/api/school/library/borrowings/${id}/return`, {
      method: 'PUT',
      body: JSON.stringify({ workspaceId }),
      requiresAuth: true,
      headers: headers(workspaceId),
    }),
};

export default schoolService;
