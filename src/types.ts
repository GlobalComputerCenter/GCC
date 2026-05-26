export interface Course {
  id: string;
  name: string;
  code: string; // e.g., ADCA, DCA, CCC, O-LEVEL
  duration: string; // e.g., "12 Months", "3 Months"
  eligibility: string; // e.g., "12th Pass", "10th Pass"
  feesOneTime: number;
  feesInstallment: number;
  syllabus: string[];
}

export interface Payment {
  id: string;
  amount: number;
  date: string;
  paymentMode: string; // "UPI QR Check", "Cash", "Card"
  transactionId: string;
  status: "Pending" | "Approved";
  screenshot?: string; // base64 payload or simulated check reference screenshot
}

export interface ExamResult {
  theory: number;
  practical: number;
  assignment: number;
  total: number;
  maxMarks: number;
  grade: string;
  percentage: number;
  examDate: string;
  status: "Pass" | "Fail" | "Pending";
}

export interface AttendanceRecord {
  date: string; // YYYY-MM-DD
  status: "Present" | "Absent" | "Leave";
}

export interface Student {
  id: string; // unique database ID
  regNo: string; // GCC/2026/XXXX
  rollNo: string; // 12026XXX
  name: string;
  fathersName: string;
  mothersName: string;
  email: string;
  phone: string;
  address: string;
  enrollmentDate: string;
  photoUrl: string;
  status: "Pending" | "Approved" | "Completed";
  courseId: string;
  progress: number; // 0 to 100
  attendance: { [date: string]: "Present" | "Absent" | "Leave" };
  examResult: ExamResult;
  certificateIssued: boolean;
  certificateDate?: string;
  verificationCode?: string; // and verifiable code e.g. GCC-CERT-XXXXXX
  twoFactorSecret?: string;
  twoFactorEnabled: boolean;
  totalFees: number;
  paidFees: number;
  payments: Payment[];
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  category: "General" | "Exam" | "Holiday" | "Placement" | "New Course";
  isImportant: boolean;
}

export interface AdminRole {
  id: string;
  name: string;
  email: string;
  role: "Admin" | "Instructor" | "Registrar";
  permissions: {
    manageCourses: boolean;
    manageStudents: boolean;
    recordAttendance: boolean;
    giveGrades: boolean;
    issueCertificates: boolean;
    systemBackups: boolean;
  };
}
