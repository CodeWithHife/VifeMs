export interface SchoolClass {
  id: string;
  name: string;
  level?: string;
  academicSessionId?: string;
  classTeacherId?: string;
  status: string;
  academicSession?: AcademicSession;
}

export interface Student {
  id: string;
  admissionId?: string;
  fullName: string;
  dateOfBirth?: string;
  gender?: string;
  phone?: string;
  email?: string;
  address?: string;
  classId?: string;
  admissionDate?: string;
  status: string;
  guardianName?: string;
  guardianPhone?: string;
  class?: SchoolClass;
  studentFees?: StudentFee[];
}

export interface AcademicSession {
  id: string;
  name: string;
  term?: string;
  startDate?: string;
  endDate?: string;
  isCurrent: boolean;
}

export interface Subject {
  id: string;
  name: string;
  code?: string;
  defaultTeacherId?: string;
  status: string;
}

export interface StaffRecord {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  role: string;
  department?: string;
  employmentStatus: string;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  classId: string;
  date: string;
  status: string; // PRESENT, ABSENT, LATE
  note?: string;
  student?: Student;
}

export interface AssessmentScore {
  id: string;
  assessmentId: string;
  studentId: string;
  subjectId: string;
  score?: number;
  remarks?: string;
  student?: Student;
  subject?: Subject;
}

export interface FeeStructure {
  id: string;
  name: string;
  description?: string;
  amount: number;
  academicSessionId?: string;
  dueDate?: string;
  isActive: boolean;
}

export interface StudentFee {
  id: string;
  studentId: string;
  feeStructureId: string;
  amountDue: number;
  status: string; // UNPAID, PARTIAL, PAID
  feeStructure?: FeeStructure;
  payments?: FeePayment[];
}

export interface FeePayment {
  id: string;
  studentFeeId: string;
  studentId: string;
  amount: number;
  paymentDate: string;
  receiptNumber?: string;
}

export interface LibraryBook {
  id: string;
  title: string;
  author?: string;
  category?: string;
  totalCopies: number;
  availableCopies: number;
  status: string;
}

export interface LibraryBorrowing {
  id: string;
  bookId: string;
  borrowerId: string;
  borrowerType: string;
  issueDate: string;
  dueDate: string;
  returnDate?: string;
  status: string;
  book?: LibraryBook;
  student?: Student;
}

export interface SchoolDashboardStats {
  totalStudents: number;
  totalClasses: number;
  todayAttendance: { present: number, absent: number, late: number };
  feesCollected: number;
  feesOutstanding: number;
  totalStaff: number;
}
