import { Course, Student, Announcement, AdminRole, Payment, ExamResult } from "../types";

// Seed data matching server.ts precisely
const seedCourses: Course[] = [
  {
    id: "adca",
    name: "Advance Diploma in Computer Application",
    code: "ADCA",
    duration: "12 Months",
    eligibility: "12th Pass",
    feesOneTime: 7500,
    feesInstallment: 9000,
    syllabus: [
      "Computer Fundamentals & OS (Windows, Linux)",
      "Microsoft Office (Word, Excel, PowerPoint, Access)",
      "Internet, Web Browsing & Emails",
      "Financial Accounting (Tally Prime with GST)",
      "Graphics Designing (Photoshop, CoralDraw)",
      "Programming Basics (HTML, CSS, JavaScript, Python Essentials)",
      "Database Management & Operations",
      "Project & Practical Presentation"
    ]
  },
  {
    id: "dca",
    name: "Diploma in Computer Application",
    code: "DCA",
    duration: "6 Months",
    eligibility: "10th Pass",
    feesOneTime: 4500,
    feesInstallment: 5400,
    syllabus: [
      "Computer Fundamentals & Windows OS",
      "Office Automation Tools (MS Office suite)",
      "Information Technology & Social Media",
      "Introduction to Tally Accounting",
      "Internet & Networking Concepts",
      "Practical Assignments"
    ]
  },
  {
    id: "ccc",
    name: "Course on Computer Concepts (NIELIT aligned)",
    code: "CCC",
    duration: "3 Months",
    eligibility: "Literate",
    feesOneTime: 2500,
    feesInstallment: 2500,
    syllabus: [
      "Introduction to Computer & GUI OS",
      "Word Processing (LibreOffice / MS Word)",
      "Spreadsheets (LibreOffice Calc / MS Excel)",
      "Presentation Essentials (PowerPoint / Impress)",
      "Introduction to Internet, WWW, Web Browsers",
      "Digital Financial Tools & Applications",
      "Overview of Cyber Security & Future Skills"
    ]
  },
  {
    id: "tally-prime",
    name: "Certificate in Taxation & Financial Accounting",
    code: "TALLY-PRIME",
    duration: "3 Months",
    eligibility: "12th Pass / Commerce background preferred",
    feesOneTime: 3500,
    feesInstallment: 4000,
    syllabus: [
      "Accounting Rules & Fundamentals",
      "Company Creation & Voucher Entries",
      "Inventory Management & Stock Keeping",
      "Goods and Service Tax (GST) Calculations & Filings",
      "TDS, TCS & Payroll Management",
      "Balance Sheet & Income Statement analysis"
    ]
  },
  {
    id: "fullstack-web",
    name: "Advanced Professional Web Development",
    code: "APWD",
    duration: "6 Months",
    eligibility: "12th Pass with basic logic understanding",
    feesOneTime: 8500,
    feesInstallment: 10000,
    syllabus: [
      "Frontend Essentials: HTML5, CSS3, Tailwind CSS",
      "Modern JavaScript ES6+ Concepts",
      "Version Control using Git & GitHub",
      "ReactJS Framework & State Management",
      "Backend foundations: NodeJS & Express Basics",
      "Mock API Integrations & Live Project Hosting"
    ]
  }
];

const seedStudents: Student[] = [
  {
    id: "student-1",
    regNo: "GCC/2025/1102",
    rollNo: "12026001",
    name: "Rahul Sharma",
    fathersName: "Vijay Kumar Sharma",
    mothersName: "Saraswati Devi",
    email: "rahul.bijnor@gmail.com",
    phone: "9876543210",
    address: "Mohalla Kazi, Civil Line, Bijnor, UP",
    enrollmentDate: "2025-06-15",
    photoUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150",
    status: "Completed",
    courseId: "adca",
    progress: 100,
    attendance: {
      "2026-05-20": "Present",
      "2026-05-21": "Present",
      "2026-05-22": "Present",
      "2026-05-23": "Present",
      "2026-05-24": "Present",
      "2026-05-25": "Present",
    },
    examResult: {
      theory: 88,
      practical: 92,
      assignment: 85,
      total: 265,
      maxMarks: 300,
      grade: "A+",
      percentage: 88.33,
      examDate: "2026-05-10",
      status: "Pass"
    },
    certificateIssued: true,
    certificateDate: "2026-05-18",
    verificationCode: "GCC-CERT-RH82K1",
    twoFactorEnabled: false,
    totalFees: 7500,
    paidFees: 7500,
    payments: [
      {
        id: "p-101",
        amount: 7500,
        date: "2025-06-15",
        paymentMode: "UPI QR Check",
        transactionId: "TXN7781029410",
        status: "Approved"
      }
    ]
  },
  {
    id: "student-2",
    regNo: "GCC/2026/0201",
    rollNo: "12026002",
    name: "Priya Singh",
    fathersName: "Rajendra Singh",
    mothersName: "Kiran Singh",
    email: "priya.singh@yahoo.com",
    phone: "8899887766",
    address: "Awas Vikas Colony, Bijnor, UP",
    enrollmentDate: "2026-01-10",
    photoUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
    status: "Approved",
    courseId: "dca",
    progress: 78,
    attendance: {
      "2026-05-20": "Present",
      "2026-05-21": "Present",
      "2026-05-22": "Absent",
      "2026-05-23": "Present",
      "2026-05-24": "Present",
      "2026-05-25": "Present",
    },
    examResult: {
      theory: 0,
      practical: 0,
      assignment: 0,
      total: 0,
      maxMarks: 300,
      grade: "N/A",
      percentage: 0,
      examDate: "Pending Schedule",
      status: "Pending"
    },
    certificateIssued: false,
    twoFactorEnabled: false,
    totalFees: 5400,
    paidFees: 2700,
    payments: [
      {
        id: "p-201",
        amount: 2700,
        date: "2026-01-10",
        paymentMode: "UPI QR Check",
        transactionId: "TXN1120038812",
        status: "Approved"
      }
    ]
  },
  {
    id: "student-3",
    regNo: "GCC/2026/0205",
    rollNo: "12026003",
    name: "Amit Kumar",
    fathersName: "Ganga Prasad",
    mothersName: "Meira Devi",
    email: "amit.ccc@outlook.com",
    phone: "7409212233",
    address: "Civil Line Opposite Police Lines, Bijnor",
    enrollmentDate: "2026-03-01",
    photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
    status: "Approved",
    courseId: "ccc",
    progress: 45,
    attendance: {
      "2026-05-20": "Present",
      "2026-05-21": "Leave",
      "2026-05-22": "Present",
      "2026-05-23": "Present",
      "2026-05-24": "Present",
      "2026-05-25": "Present",
    },
    examResult: {
      theory: 0,
      practical: 0,
      assignment: 0,
      total: 0,
      maxMarks: 100,
      grade: "N/A",
      percentage: 0,
      examDate: "Scheduled Jun-2026",
      status: "Pending"
    },
    certificateIssued: false,
    twoFactorEnabled: true,
    twoFactorSecret: "GCCA12903Z",
    totalFees: 2500,
    paidFees: 2500,
    payments: [
      {
        id: "p-301",
        amount: 2500,
        date: "2026-03-01",
        paymentMode: "UPI QR Check",
        transactionId: "TXN55219982701",
        status: "Approved"
      }
    ]
  }
];

const seedAnnouncements: Announcement[] = [
  {
    id: "ann-1",
    title: "New Batch of ADCA & DCA Starting From 1st June 2026",
    content: "Admissions are actively open for both morning and evening slots. Reach our office at Civil Line Bijnor to grab exclusive 10% scholar discount. Limited seats are available.",
    date: "2026-05-24",
    category: "New Course",
    isImportant: true
  },
  {
    id: "ann-2",
    title: "Online Practical Examination Dates Released",
    content: "All current ADCA Semester 1 and DCA students are requested to review and verify their eligibility and print attendance slip from student dashboard. Exam to be held strictly under CCTV supervision on June 15th.",
    date: "2026-05-20",
    category: "Exam",
    isImportant: true
  },
  {
    id: "ann-3",
    title: "Summer Holidays Announcement",
    content: "The academy center will remain closed on 29th and 30th May on account of regional celebrations. Online tests and learning modules will remain accessible for students.",
    date: "2026-05-18",
    category: "Holiday",
    isImportant: false
  }
];

const seedStaffRoles: AdminRole[] = [
  {
    id: "staff-1",
    name: "Er. Madhur Forex",
    email: "madhurforex@gmail.com",
    role: "Admin",
    permissions: {
      manageCourses: true,
      manageStudents: true,
      recordAttendance: true,
      giveGrades: true,
      issueCertificates: true,
      systemBackups: true
    }
  },
  {
    id: "staff-2",
    name: "Sanjay Mishra",
    email: "sanjay.gcc@gmail.com",
    role: "Instructor",
    permissions: {
      manageCourses: false,
      manageStudents: false,
      recordAttendance: true,
      giveGrades: true,
      issueCertificates: false,
      systemBackups: false
    }
  },
  {
    id: "staff-3",
    name: "Roshni Tyagi",
    email: "roshni.gcc@gmail.com",
    role: "Registrar",
    permissions: {
      manageCourses: true,
      manageStudents: true,
      recordAttendance: true,
      giveGrades: false,
      issueCertificates: true,
      systemBackups: false
    }
  }
];

// Helper to determine if we should execute in local mode
export function determineDatabaseMode(): boolean {
  if (typeof window === "undefined") return false;
  
  // If explicitly forced
  if (localStorage.getItem("gcc_force_local") === "true") return true;

  const hostname = window.location.hostname;
  // If hosted on GitHub pages or InfinityFree namespaces
  if (
    hostname.includes("github.io") ||
    hostname.includes("infinityfree") ||
    hostname.includes("rf.gd") ||
    hostname.includes("epizy.com") ||
    hostname.includes("freecluster.eu") ||
    hostname === "" || // loaded locally via double-click file://
    hostname === "127.0.0.1"
  ) {
    return true;
  }
  return false;
}

// Check and Initialize localStorage Database if missing
function initializeLocalStorageDB() {
  if (typeof window === "undefined") return;

  if (!localStorage.getItem("gcc_courses")) {
    localStorage.setItem("gcc_courses", JSON.stringify(seedCourses));
  }
  if (!localStorage.getItem("gcc_students")) {
    localStorage.setItem("gcc_students", JSON.stringify(seedStudents));
  }
  if (!localStorage.getItem("gcc_announcements")) {
    localStorage.setItem("gcc_announcements", JSON.stringify(seedAnnouncements));
  }
  if (!localStorage.getItem("gcc_staff_roles")) {
    localStorage.setItem("gcc_staff_roles", JSON.stringify(seedStaffRoles));
  }
}

// Fetch all courses
export async function getCourses(): Promise<Course[]> {
  const local = determineDatabaseMode();
  if (local) {
    initializeLocalStorageDB();
    return JSON.parse(localStorage.getItem("gcc_courses") || "[]");
  }
  const res = await fetch("/api/courses");
  if (!res.ok) throw new Error("Backend API Call Failed");
  return res.json();
}

// Fetch announcements
export async function getAnnouncements(): Promise<Announcement[]> {
  const local = determineDatabaseMode();
  if (local) {
    initializeLocalStorageDB();
    return JSON.parse(localStorage.getItem("gcc_announcements") || "[]");
  }
  const res = await fetch("/api/announcements");
  if (!res.ok) throw new Error("Backend API Call Failed");
  return res.json();
}

// Fetch Admin/Staff roles
export async function getAdminRoles(): Promise<AdminRole[]> {
  const local = determineDatabaseMode();
  if (local) {
    initializeLocalStorageDB();
    return JSON.parse(localStorage.getItem("gcc_staff_roles") || "[]");
  }
  const res = await fetch("/api/admin/roles");
  if (!res.ok) throw new Error("Backend API Call Failed");
  return res.json();
}

// Fetch Students
export async function getStudents(): Promise<Student[]> {
  const local = determineDatabaseMode();
  if (local) {
    initializeLocalStorageDB();
    return JSON.parse(localStorage.getItem("gcc_students") || "[]");
  }
  const res = await fetch("/api/admin/students");
  if (!res.ok) throw new Error("Backend API Call Failed");
  return res.json();
}

// Verify certificate / search registry
export async function verifyCertificate(code: string): Promise<any> {
  const local = determineDatabaseMode();
  if (local) {
    initializeLocalStorageDB();
    const studentsList: Student[] = JSON.parse(localStorage.getItem("gcc_students") || "[]");
    const cleanCode = code.trim().toUpperCase();
    
    // Find by verification code, regNo, or rollNo
    const match = studentsList.find(s => 
      (s.verificationCode && s.verificationCode.toUpperCase() === cleanCode) ||
      s.regNo.toUpperCase() === cleanCode ||
      s.rollNo.toUpperCase() === cleanCode
    );

    if (!match) {
      return { error: "No matching record found in directory." };
    }

    const coursesList: Course[] = JSON.parse(localStorage.getItem("gcc_courses") || "[]");
    const course = coursesList.find(c => c.id === match.courseId);

    return {
      name: match.name,
      fathersName: match.fathersName,
      mothersName: match.mothersName,
      regNo: match.regNo,
      rollNo: match.rollNo,
      courseCode: course?.code || "N/A",
      courseName: course?.name || "N/A",
      enrollmentDate: match.enrollmentDate,
      status: match.status,
      examResult: match.examResult,
      certificateIssued: match.certificateIssued,
      certificateDate: match.certificateDate,
      verificationCode: match.verificationCode || "N/A"
    };
  }

  const res = await fetch(`/api/verify/${encodeURIComponent(code.trim())}`);
  return res.json();
}

// Student Login
export async function studentLogin(credential: string, code2fa?: string): Promise<{ success: boolean; student?: Student; step2fa?: boolean; error?: string }> {
  const local = determineDatabaseMode();
  if (local) {
    initializeLocalStorageDB();
    const studentsList: Student[] = JSON.parse(localStorage.getItem("gcc_students") || "[]");
    const cleanCred = credential.trim().toLowerCase();

    const student = studentsList.find(s => 
      s.regNo.toLowerCase() === cleanCred || 
      s.rollNo.toLowerCase() === cleanCred ||
      s.email.toLowerCase() === cleanCred
    );

    if (!student) {
      return { success: false, error: "Student not found with these credentials" };
    }

    if (student.twoFactorEnabled) {
      if (!code2fa) {
        return { success: true, step2fa: true };
      }
      if (code2fa !== student.twoFactorSecret) {
        return { success: false, error: "Invalid two-factor verification OTP code." };
      }
    }

    return { success: true, student };
  }

  const res = await fetch("/api/students/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ credential, code2fa })
  });
  return res.json();
}

// Admin Login
export async function adminLogin(credential: string, password?: string): Promise<{ success: boolean; staff?: AdminRole; error?: string }> {
  const local = determineDatabaseMode();
  if (local) {
    initializeLocalStorageDB();
    const roles: AdminRole[] = JSON.parse(localStorage.getItem("gcc_staff_roles") || "[]");
    
    const staff = roles.find(r => r.email.toLowerCase() === credential.trim().toLowerCase());
    if (!staff) {
      return { success: false, error: "Staff role not found with this email" };
    }

    if (password !== "admin123") {
      return { success: false, error: "Invalid staff passcode. Hint: use admin123" };
    }

    return { success: true, staff };
  }

  const res = await fetch("/api/admin/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ credential, password })
  });
  return res.json();
}

// Student Self-Enrollment
export async function enrollStudent(formData: {
  name: string;
  fathersName: string;
  mothersName: string;
  email: string;
  phone: string;
  address: string;
  courseId: string;
  amountPaid: number;
  transactionId: string;
  screenshot?: string;
}): Promise<{ success: boolean; student?: Student; error?: string }> {
  const local = determineDatabaseMode();
  if (local) {
    initializeLocalStorageDB();
    const studentsList: Student[] = JSON.parse(localStorage.getItem("gcc_students") || "[]");
    const coursesList: Course[] = JSON.parse(localStorage.getItem("gcc_courses") || "[]");

    const course = coursesList.find(c => c.id === formData.courseId);
    if (!course) return { success: false, error: "Incompatible course ID selected" };

    const totalFees = course.feesInstallment;
    const idSuffix = String(studentsList.length + 1).padStart(4, "0");
    const newStudent: Student = {
      id: `student-${Date.now()}`,
      regNo: `GCC/2026/${idSuffix}`,
      rollNo: `12026${idSuffix}`,
      name: formData.name,
      fathersName: formData.fathersName,
      mothersName: formData.mothersName,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      enrollmentDate: new Date().toISOString().split("T")[0],
      photoUrl: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 1000000)}?w=150`,
      status: "Pending",
      courseId: formData.courseId,
      progress: 5,
      attendance: {},
      examResult: {
        theory: 0,
        practical: 0,
        assignment: 0,
        total: 0,
        maxMarks: course.id === "ccc" ? 100 : 300,
        grade: "N/A",
        percentage: 0,
        examDate: "Not Scheduled",
        status: "Pending"
      },
      certificateIssued: false,
      twoFactorEnabled: false,
      totalFees,
      paidFees: 0, // Pending state means NO fees credited yet
      payments: [
        {
          id: `p-${Date.now()}`,
          amount: formData.amountPaid,
          date: new Date().toISOString().split("T")[0],
          paymentMode: "UPI QR Check",
          transactionId: formData.transactionId,
          screenshot: formData.screenshot || "",
          status: "Pending"
        }
      ]
    };

    studentsList.push(newStudent);
    localStorage.setItem("gcc_students", JSON.stringify(studentsList));
    return { success: true, student: newStudent };
  }

  const res = await fetch("/api/students/enroll", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData)
  });
  return res.json();
}

// Pay Installment
export async function payInstallment(studentId: string, amount: number, transactionId: string, screenshot?: string): Promise<{ success: boolean; student?: Student; error?: string }> {
  const local = determineDatabaseMode();
  if (local) {
    initializeLocalStorageDB();
    const studentsList: Student[] = JSON.parse(localStorage.getItem("gcc_students") || "[]");
    const student = studentsList.find(s => s.id === studentId);
    
    if (!student) return { success: false, error: "Student not found" };

    const newPayment: Payment = {
      id: `p-${Date.now()}`,
      amount,
      date: new Date().toISOString().split("T")[0],
      paymentMode: "UPI QR Check",
      transactionId,
      screenshot: screenshot || "",
      status: "Pending"
    };

    student.payments.push(newPayment);
    localStorage.setItem("gcc_students", JSON.stringify(studentsList));
    return { success: true, student };
  }

  const res = await fetch(`/api/students/${studentId}/pay-installment`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ amount, transactionId, screenshot })
  });
  return res.json();
}

// Toggle 2FA
export async function toggle2FA(studentId: string): Promise<{ success: boolean; twoFactorEnabled: boolean; twoFactorSecret?: string; error?: string }> {
  const local = determineDatabaseMode();
  if (local) {
    initializeLocalStorageDB();
    const studentsList: Student[] = JSON.parse(localStorage.getItem("gcc_students") || "[]");
    const student = studentsList.find(s => s.id === studentId);
    
    if (!student) return { success: false, twoFactorEnabled: false, error: "Student not found" };

    student.twoFactorEnabled = !student.twoFactorEnabled;
    if (student.twoFactorEnabled) {
      student.twoFactorSecret = `GCCA${Math.floor(1000 + Math.random() * 9000)}Z`;
    } else {
      student.twoFactorSecret = undefined;
    }

    localStorage.setItem("gcc_students", JSON.stringify(studentsList));
    return { 
      success: true, 
      twoFactorEnabled: student.twoFactorEnabled, 
      twoFactorSecret: student.twoFactorSecret 
    };
  }

  const res = await fetch(`/api/students/${studentId}/toggle-2fa`, {
    method: "POST"
  });
  return res.json();
}

// Approve student enrollment (Admin action)
export async function approveStudent(studentId: string, operatorId: string): Promise<{ success: boolean; student?: Student; error?: string }> {
  const local = determineDatabaseMode();
  if (local) {
    initializeLocalStorageDB();
    
    // Check permission
    const roles: AdminRole[] = JSON.parse(localStorage.getItem("gcc_staff_roles") || "[]");
    const op = roles.find(r => r.id === operatorId);
    if (op && op.role !== "Admin" && !op.permissions.manageStudents) {
      return { success: false, error: "Unauthorized: You do not have permission to manage students." };
    }

    const studentsList: Student[] = JSON.parse(localStorage.getItem("gcc_students") || "[]");
    const student = studentsList.find(s => s.id === studentId);
    
    if (!student) return { success: false, error: "Student not found" };

    student.status = "Approved";
    if (student.payments.length > 0) {
      const initialPayment = student.payments[0];
      if (initialPayment.status === "Pending") {
        initialPayment.status = "Approved";
        student.paidFees += initialPayment.amount;
      }
    }

    localStorage.setItem("gcc_students", JSON.stringify(studentsList));
    return { success: true, student };
  }

  const res = await fetch(`/api/admin/students/${studentId}/approve`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ operatorId })
  });
  return res.json();
}

// Approve installment payment receipt (Admin action)
export async function approvePayment(studentId: string, paymentId: string, operatorId: string): Promise<{ success: boolean; student?: Student; error?: string }> {
  const local = determineDatabaseMode();
  if (local) {
    initializeLocalStorageDB();
    
    // Check permission
    const roles: AdminRole[] = JSON.parse(localStorage.getItem("gcc_staff_roles") || "[]");
    const op = roles.find(r => r.id === operatorId);
    if (op && op.role !== "Admin" && !op.permissions.manageStudents) {
      return { success: false, error: "Unauthorized: You do not have permission to manage student financials." };
    }

    const studentsList: Student[] = JSON.parse(localStorage.getItem("gcc_students") || "[]");
    const student = studentsList.find(s => s.id === studentId);
    if (!student) return { success: false, error: "Student not found" };

    const payment = student.payments.find(p => p.id === paymentId);
    if (!payment) return { success: false, error: "Payment not found" };

    if (payment.status !== "Approved") {
      payment.status = "Approved";
      student.paidFees = Number(student.paidFees) + Number(payment.amount);
    }

    localStorage.setItem("gcc_students", JSON.stringify(studentsList));
    return { success: true, student };
  }

  const res = await fetch(`/api/admin/students/${studentId}/payments/${paymentId}/approve`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ operatorId })
  });
  return res.json();
}

// Mark student attendance (Admin action)
export async function markAttendance(studentId: string, date: string, status: "Present" | "Absent" | "Leave", operatorId: string): Promise<{ success: boolean; attendance?: any; progress?: number; error?: string }> {
  const local = determineDatabaseMode();
  if (local) {
    initializeLocalStorageDB();
    
    // Check permission
    const roles: AdminRole[] = JSON.parse(localStorage.getItem("gcc_staff_roles") || "[]");
    const op = roles.find(r => r.id === operatorId);
    if (op && op.role !== "Admin" && !op.permissions.recordAttendance) {
      return { success: false, error: "Unauthorized: You do not have permission to record attendance." };
    }

    const studentsList: Student[] = JSON.parse(localStorage.getItem("gcc_students") || "[]");
    const student = studentsList.find(s => s.id === studentId);
    if (!student) return { success: false, error: "Student not found" };

    student.attendance[date] = status;

    // Recalculate progress:
    const values = Object.values(student.attendance);
    const presentCount = values.filter(v => v === "Present").length;
    const totalDays = values.length;
    const attRatio = totalDays > 0 ? (presentCount / totalDays) : 1;
    student.progress = Math.min(100, Math.round(5 + attRatio * 75));

    localStorage.setItem("gcc_students", JSON.stringify(studentsList));
    return { success: true, attendance: student.attendance, progress: student.progress };
  }

  const res = await fetch(`/api/admin/students/${studentId}/attendance`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ operatorId, date, status })
  });
  return res.json();
}

// Save Exam grades (Admin action)
export async function saveGrade(studentId: string, theory: number, practical: number, assignment: number, examDate: string, operatorId: string): Promise<{ success: boolean; examResult?: ExamResult; error?: string }> {
  const local = determineDatabaseMode();
  if (local) {
    initializeLocalStorageDB();
    
    // Check permission
    const roles: AdminRole[] = JSON.parse(localStorage.getItem("gcc_staff_roles") || "[]");
    const op = roles.find(r => r.id === operatorId);
    if (op && op.role !== "Admin" && !op.permissions.giveGrades) {
      return { success: false, error: "Unauthorized: You do not have permission to grade students." };
    }

    const studentsList: Student[] = JSON.parse(localStorage.getItem("gcc_students") || "[]");
    const student = studentsList.find(s => s.id === studentId);
    if (!student) return { success: false, error: "Student not found" };

    const maxMarks = student.examResult.maxMarks || (student.courseId === "ccc" ? 100 : 300);
    const sum = Number(theory) + Number(practical) + Number(assignment);
    const pct = parseFloat(((sum / maxMarks) * 100).toFixed(2));
    
    let grade = "F";
    let status: "Pass" | "Fail" = "Fail";
    if (pct >= 85) { grade = "A+"; status = "Pass"; }
    else if (pct >= 75) { grade = "A"; status = "Pass"; }
    else if (pct >= 60) { grade = "B"; status = "Pass"; }
    else if (pct >= 50) { grade = "C"; status = "Pass"; }
    else if (pct >= 40) { grade = "D"; status = "Pass"; }

    student.examResult = {
      theory: Number(theory),
      practical: Number(practical),
      assignment: Number(assignment),
      total: sum,
      maxMarks,
      percentage: pct,
      grade,
      examDate,
      status
    };

    if (status === "Pass") {
      student.progress = 100;
    } else {
      student.progress = Math.max(90, student.progress);
    }

    localStorage.setItem("gcc_students", JSON.stringify(studentsList));
    return { success: true, examResult: student.examResult };
  }

  const res = await fetch(`/api/admin/students/${studentId}/grade`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ theory, practical, assignment, examDate, operatorId })
  });
  return res.json();
}

// Issue Cert
export async function issueCertificate(studentId: string, operatorId: string): Promise<{ success: boolean; student?: Student; error?: string }> {
  const local = determineDatabaseMode();
  if (local) {
    initializeLocalStorageDB();
    
    // Check permission
    const roles: AdminRole[] = JSON.parse(localStorage.getItem("gcc_staff_roles") || "[]");
    const op = roles.find(r => r.id === operatorId);
    if (op && op.role !== "Admin" && !op.permissions.issueCertificates) {
      return { success: false, error: "Unauthorized: You do not have permission to issue certificates." };
    }

    const studentsList: Student[] = JSON.parse(localStorage.getItem("gcc_students") || "[]");
    const student = studentsList.find(s => s.id === studentId);
    if (!student) return { success: false, error: "Student not found" };

    if (student.examResult.status !== "Pass") {
      return { success: false, error: "Student has not successfully passed examination yet" };
    }

    student.certificateIssued = true;
    student.status = "Completed";
    student.certificateDate = new Date().toISOString().split("T")[0];
    student.verificationCode = `GCC-CERT-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    localStorage.setItem("gcc_students", JSON.stringify(studentsList));
    return { success: true, student };
  }

  const res = await fetch(`/api/admin/students/${studentId}/issue-certificate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ operatorId })
  });
  return res.json();
}

// Create Course
export async function createCourse(courseData: Partial<Course>, operatorId: string): Promise<{ success: boolean; course?: Course; error?: string }> {
  const local = determineDatabaseMode();
  if (local) {
    initializeLocalStorageDB();
    
    const roles: AdminRole[] = JSON.parse(localStorage.getItem("gcc_staff_roles") || "[]");
    const op = roles.find(r => r.id === operatorId);
    if (op && op.role !== "Admin" && !op.permissions.manageCourses) {
      return { success: false, error: "Unauthorized: You do not have permissions to create courses." };
    }

    const coursesList: Course[] = JSON.parse(localStorage.getItem("gcc_courses") || "[]");
    const newCourse: Course = {
      id: (courseData.code || "Course").toLowerCase().replace(/[^a-z0-5]/g, "-"),
      name: courseData.name || "Untitled Course",
      code: (courseData.code || "TEMP").toUpperCase(),
      duration: courseData.duration || "1 Month",
      eligibility: courseData.eligibility || "Open",
      feesOneTime: Number(courseData.feesOneTime || 1000),
      feesInstallment: Number(courseData.feesInstallment || 1200),
      syllabus: courseData.syllabus || []
    };

    coursesList.push(newCourse);
    localStorage.setItem("gcc_courses", JSON.stringify(coursesList));
    return { success: true, course: newCourse };
  }

  const res = await fetch("/api/courses", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...courseData, operatorId })
  });
  return res.json();
}

// Create Announcement
export async function createAnnouncement(announcementData: Partial<Announcement>, operatorId: string): Promise<{ success: boolean; announcement?: Announcement; error?: string }> {
  const local = determineDatabaseMode();
  if (local) {
    initializeLocalStorageDB();
    
    const announcementsList: Announcement[] = JSON.parse(localStorage.getItem("gcc_announcements") || "[]");
    const newAnn: Announcement = {
      id: `ann-${Date.now()}`,
      title: announcementData.title || "Untitled Info",
      content: announcementData.content || "",
      date: new Date().toISOString().split("T")[0],
      category: announcementData.category || "General",
      isImportant: announcementData.isImportant || false
    };

    announcementsList.unshift(newAnn);
    localStorage.setItem("gcc_announcements", JSON.stringify(announcementsList));
    return { success: true, announcement: newAnn };
  }

  const res = await fetch("/api/announcements", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...announcementData, operatorId })
  });
  return res.json();
}

// Modify Staff Permission
export async function modifyPermission(roleId: string, permissions: any, operatorId: string): Promise<{ success: boolean; role?: AdminRole; error?: string }> {
  const local = determineDatabaseMode();
  if (local) {
    initializeLocalStorageDB();
    
    // Only Admin bypass
    const roles: AdminRole[] = JSON.parse(localStorage.getItem("gcc_staff_roles") || "[]");
    const op = roles.find(r => r.id === operatorId);
    if (!op || op.role !== "Admin") {
      return { success: false, error: "Only the Administrator (Madhur Forex) holds permissions matrix override capability." };
    }

    const targetRole = roles.find(r => r.id === roleId);
    if (!targetRole) return { success: false, error: "Staff role not found" };

    targetRole.permissions = { ...targetRole.permissions, ...permissions };
    localStorage.setItem("gcc_staff_roles", JSON.stringify(roles));
    return { success: true, role: targetRole };
  }

  const res = await fetch(`/api/admin/roles/${roleId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ permissions, operatorId })
  });
  return res.json();
}

// Fetch single student info (for updates)
export async function getSingleStudent(studentId: string): Promise<Student> {
  const local = determineDatabaseMode();
  if (local) {
    initializeLocalStorageDB();
    const studentsList: Student[] = JSON.parse(localStorage.getItem("gcc_students") || "[]");
    const s = studentsList.find(student => student.id === studentId);
    if (!s) throw new Error("Student not found");
    return s;
  }
  const res = await fetch(`/api/students/${studentId}`);
  if (!res.ok) throw new Error("Failed to fetch student details");
  return res.json();
}

// Run Backup
export async function runBackup(): Promise<any> {
  const local = determineDatabaseMode();
  if (local) {
    initializeLocalStorageDB();
    const courses = JSON.parse(localStorage.getItem("gcc_courses") || "[]");
    const students = JSON.parse(localStorage.getItem("gcc_students") || "[]");
    const announcements = JSON.parse(localStorage.getItem("gcc_announcements") || "[]");
    const staff = JSON.parse(localStorage.getItem("gcc_staff_roles") || "[]");

    const payload = JSON.stringify({ courses, students, announcements, staff });
    return {
      success: true,
      backupId: `local-bkp-${Date.now()}`,
      timestamp: new Date().toISOString(),
      targetCount: students.length,
      hash: "local-sha256-encrypted-backup-hash",
      payload: btoa(payload) // base64 encoded for download simulation
    };
  }

  const res = await fetch("/api/admin/backup");
  return res.json();
}
