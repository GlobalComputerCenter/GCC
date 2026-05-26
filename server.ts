import express from "express";
import path from "path";
import crypto from "crypto";
import { createServer as createViteServer } from "vite";
import { Course, Student, Announcement, AdminRole, Payment, ExamResult } from "./src/types";

const app = express();
const PORT = 3000;

app.use(express.json());

// -------------------------------------------------------------
// IN-MEMORY COMPREHENSIVE SIMULATED SEED DATABASE
// -------------------------------------------------------------

// Active Courses matching standard IT Institutes like dce.osmeducation.com
let courses: Course[] = [
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

// Initial mock students matching our "existing database"
let students: Student[] = [
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
    twoFactorEnabled: true, // Has 2FA enabled
    twoFactorSecret: "GCCA12903Z", // Simulated OTP key
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

// In-memory staff/roles configuration with granular permissions
let adminRoles: AdminRole[] = [
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

// Helper to assert granular staff permissions on the backend
const checkStaffPermission = (operatorId: any, permissionKey: string): boolean => {
  if (!operatorId) return false;
  const staff = adminRoles.find(r => r.id === operatorId);
  if (!staff) return false;
  if (staff.role === "Admin") return true; // Admin bypass is perfect
  return !!(staff.permissions as any)[permissionKey];
};

// Feed announcements
let announcements: Announcement[] = [
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

// Helper to encrypt server state
const STATIC_KEY = Buffer.alloc(32, 'gcc-secret-key-32-chars-long-!!!');
const STATIC_IV = Buffer.alloc(16, 'gcc-iv-16-bytes!');

function encryptData(text: string): string {
  try {
    const cipher = crypto.createCipheriv("aes-256-cbc", STATIC_KEY, STATIC_IV);
    let encrypted = cipher.update(text, "utf8", "hex");
    encrypted += cipher.final("hex");
    return encrypted;
  } catch (err) {
    console.error("Encryption error:", err);
    return "ENCRYPTION_FAILED";
  }
}

function generateVerificationCode(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "GCC-CERT-";
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// -------------------------------------------------------------
// CORE BUSINESS LOGIC ENDPOINTS
// -------------------------------------------------------------

// Global announcements lookup
app.get("/api/announcements", (req, res) => {
  res.json(announcements);
});

// Admin add announcements
app.post("/api/announcements", (req, res) => {
  const { title, content, category, isImportant } = req.body;
  if (!title || !content) {
    return res.status(400).json({ error: "Missing required details Title/Content" });
  }
  const newAnn: Announcement = {
    id: `ann-${Date.now()}`,
    title,
    content,
    date: new Date().toISOString().split("T")[0],
    category: category || "General",
    isImportant: !!isImportant
  };
  announcements.unshift(newAnn);
  res.json({ success: true, announcement: newAnn });
});

// Get Courses
app.get("/api/courses", (req, res) => {
  res.json(courses);
});

// Admin Add Course
app.post("/api/courses", (req, res) => {
  const { name, code, duration, eligibility, feesOneTime, feesInstallment, syllabus } = req.body;
  if (!name || !code || !duration || !feesOneTime) {
    return res.status(400).json({ error: "Missing key parameters" });
  }

  const existing = courses.find(c => c.code.toUpperCase() === code.toUpperCase());
  if (existing) {
    return res.status(400).json({ error: "Course with this code already exists" });
  }

  const newCourse: Course = {
    id: code.toLowerCase().replace(/[^a-z0-9]/g, "-"),
    name,
    code: code.toUpperCase(),
    duration,
    eligibility: eligibility || "10th Pass",
    feesOneTime: Number(feesOneTime),
    feesInstallment: Number(feesInstallment || feesOneTime),
    syllabus: Array.isArray(syllabus) ? syllabus : [syllabus]
  };

  courses.push(newCourse);
  res.json({ success: true, course: newCourse });
});

// Student Enrollment & UPI QR Payment Window Integration
app.post("/api/students/enroll", (req, res) => {
  const { name, fathersName, mothersName, email, phone, address, courseId, amountPaid, transactionId, paymentMode, screenshot } = req.body;

  if (!name || !fathersName || !phone || !courseId || !transactionId) {
    return res.status(400).json({ error: "Missing required enrollment fields" });
  }

  const course = courses.find(c => c.id === courseId);
  if (!course) {
    return res.status(404).json({ error: "Course not found" });
  }

  const idSuffix = String(students.length + 1).padStart(4, "0");
  const regNo = `GCC/2026/${idSuffix}`;
  const rollNo = `12026${idSuffix}`;

  const newStudent: Student = {
    id: `student-${Date.now()}`,
    regNo,
    rollNo,
    name,
    fathersName,
    mothersName: mothersName || "N/A",
    email: email || "",
    phone,
    address,
    enrollmentDate: new Date().toISOString().split("T")[0],
    photoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150", // generic avatar
    status: "Pending", // Admin triggers "Approve"
    courseId,
    progress: 5,
    attendance: {},
    examResult: {
      theory: 0,
      practical: 0,
      assignment: 0,
      total: 0,
      maxMarks: course.id === "ccc" ? 100 : 300,
      grade: "Pending",
      percentage: 0,
      examDate: "Scheduled June-2026",
      status: "Pending"
    },
    certificateIssued: false,
    twoFactorEnabled: false,
    totalFees: course.feesOneTime,
    paidFees: Number(amountPaid || 0),
    payments: [
      {
        id: `pay-${Date.now()}`,
        amount: Number(amountPaid || 0),
        date: new Date().toISOString().split("T")[0],
        paymentMode: paymentMode || "UPI QR Check",
        transactionId,
        screenshot: screenshot || "",
        status: "Pending" // Verified by admin
      }
    ]
  };

  students.push(newStudent);
  res.json({
    success: true,
    message: "Registration received! Status is pending verification. Save your details.",
    student: newStudent
  });
});

// Admin/Faculty Login endpoint
app.post("/api/admin/login", (req, res) => {
  const { credential, password } = req.body;

  if (!credential || !password) {
    return res.status(400).json({ error: "Please enter Email Address and Passcode" });
  }

  const staff = adminRoles.find(
    r => r.email.toLowerCase() === credential.trim().toLowerCase()
  );

  if (!staff) {
    return res.status(404).json({ error: "Staff role not found with this email" });
  }

  // Check password - default passcode admin123
  if (password !== "admin123") {
    return res.status(400).json({ error: "Invalid staff passcode. Hint: use admin123" });
  }

  res.json({
    success: true,
    staff
  });
});

// Student Login by Roll Number or Registration Number & Simulated 2FA Check
app.post("/api/students/login", (req, res) => {
  const { credential, code2fa } = req.body;

  if (!credential) {
    return res.status(400).json({ error: "Please enter Registration Number or Roll Number" });
  }

  const student = students.find(
    s => s.regNo.toLowerCase() === credential.trim().toLowerCase() || s.rollNo === credential.trim()
  );

  if (!student) {
    return res.status(404).json({ error: "Student not found with this credentials" });
  }

  // Two-Factor Authentication Check
  if (student.twoFactorEnabled) {
    if (!code2fa) {
      return res.json({
        twoFactorRequired: true,
        message: "Two-Factor Authentication (2FA) is turned on for this account. Please enter code."
      });
    }

    if (code2fa !== student.twoFactorSecret) {
      return res.status(400).json({ error: "Invalid 2FA OTP security verification code code." });
    }
  }

  res.json({
    success: true,
    student
  });
});

// Fetch Single Student details
app.get("/api/students/:id", (req, res) => {
  const student = students.find(s => s.id === req.params.id);
  if (!student) return res.status(404).json({ error: "Student not found" });
  res.json(student);
});

// Get Verification details by Roll No / Registration No / Certificate Verification Code
app.get("/api/verify/:param", (req, res) => {
  const param = req.params.param.trim().toUpperCase();

  const student = students.find(
    s =>
      s.rollNo === param ||
      s.regNo.toUpperCase() === param ||
      (s.verificationCode && s.verificationCode.toUpperCase() === param)
  );

  if (!student) {
    return res.status(404).json({ error: "No records found matched this criteria" });
  }

  res.json({
    found: true,
    name: student.name,
    fathersName: student.fathersName,
    mothersName: student.mothersName,
    regNo: student.regNo,
    rollNo: student.rollNo,
    courseCode: courses.find(c => c.id === student.courseId)?.code || "Unknown",
    courseName: courses.find(c => c.id === student.courseId)?.name || "Unknown",
    enrollmentDate: student.enrollmentDate,
    status: student.status,
    examResult: student.examResult,
    certificateIssued: student.certificateIssued,
    certificateDate: student.certificateDate,
    verificationCode: student.verificationCode || "N/A"
  });
});

// Toggle student 2FA state
app.post("/api/students/:id/toggle-2fa", (req, res) => {
  const student = students.find(s => s.id === req.params.id);
  if (!student) return res.status(404).json({ error: "Student not found" });

  student.twoFactorEnabled = !student.twoFactorEnabled;
  if (student.twoFactorEnabled) {
    student.twoFactorSecret = `GCCA${Math.floor(1000 + Math.random() * 9000)}Z`;
  } else {
    student.twoFactorSecret = undefined;
  }

  res.json({
    success: true,
    twoFactorEnabled: student.twoFactorEnabled,
    twoFactorSecret: student.twoFactorSecret
  });
});

// List all students
app.get("/api/admin/students", (req, res) => {
  res.json(students);
});

// Approve Pending Student
app.post("/api/admin/students/:id/approve", (req, res) => {
  const operatorId = req.body.operatorId || req.headers["x-operator-id"];
  if (!checkStaffPermission(operatorId, "manageStudents")) {
    return res.status(403).json({ error: "Unauthorized: You do not have permission to manage students." });
  }

  const student = students.find(s => s.id === req.params.id);
  if (!student) return res.status(404).json({ error: "Student not found" });

  student.status = "Approved";
  if (student.payments.length > 0) {
    student.payments[0].status = "Approved"; // approve initial payment too
  }
  res.json({ success: true, student });
});

// Approve Pending installment/payment
app.post("/api/admin/students/:studentId/payments/:paymentId/approve", (req, res) => {
  const operatorId = req.body.operatorId || req.headers["x-operator-id"];
  if (!checkStaffPermission(operatorId, "manageStudents")) {
    return res.status(403).json({ error: "Unauthorized: You do not have permission to manage student financials." });
  }

  const student = students.find(s => s.id === req.params.studentId);
  if (!student) return res.status(404).json({ error: "Student not found" });

  const payment = student.payments.find(p => p.id === req.params.paymentId);
  if (!payment) return res.status(404).json({ error: "Payment not found" });

  payment.status = "Approved";
  student.paidFees = Number(student.paidFees) + Number(payment.amount);
  res.json({ success: true, student });
});

// Attendance marker endpoint (academic staff)
app.post("/api/admin/students/:id/attendance", (req, res) => {
  const { date, status, operatorId } = req.body; // status: "Present" | "Absent" | "Leave"
  
  if (!checkStaffPermission(operatorId || req.headers["x-operator-id"], "recordAttendance")) {
    return res.status(403).json({ error: "Unauthorized: You do not have permission to record attendance." });
  }

  if (!date || !status) {
    return res.status(400).json({ error: "Missing parameters: Date and Status required." });
  }

  const student = students.find(s => s.id === req.params.id);
  if (!student) return res.status(404).json({ error: "Student not found" });

  student.attendance[date] = status;

  // recalculate student progress dynamically based on attendances + academic milestone
  const totalDays = Object.keys(student.attendance).length;
  if (totalDays > 0) {
    const presentCount = Object.values(student.attendance).filter(st => st === "Present").length;
    const attRatio = presentCount / totalDays;
    student.progress = Math.min(100, Math.round(5 + attRatio * 75));
  }

  res.json({ success: true, attendance: student.attendance, progress: student.progress });
});

// Grading Portal endpoint (academic staff)
app.post("/api/admin/students/:id/grade", (req, res) => {
  const { theory, practical, assignment, examDate, operatorId } = req.body;

  if (!checkStaffPermission(operatorId || req.headers["x-operator-id"], "giveGrades")) {
    return res.status(403).json({ error: "Unauthorized: You do not have permission to grade students." });
  }

  const student = students.find(s => s.id === req.params.id);
  if (!student) return res.status(404).json({ error: "Student not found" });

  const total = Number(theory || 0) + Number(practical || 0) + Number(assignment || 0);
  const maxMarks = student.examResult.maxMarks || 300;
  const percentage = Number(((total / maxMarks) * 100).toFixed(2));

  // Determine Grade
  let grade = "F";
  let status: "Pass" | "Fail" | "Pending" = "Fail";
  if (percentage >= 85) grade = "A+";
  else if (percentage >= 75) grade = "A";
  else if (percentage >= 60) grade = "B";
  else if (percentage >= 45) grade = "C";
  else if (percentage >= 33) grade = "D";

  if (percentage >= 33) {
    status = "Pass";
  }

  student.examResult = {
    theory: Number(theory),
    practical: Number(practical),
    assignment: Number(assignment),
    total,
    maxMarks,
    grade,
    percentage,
    examDate: examDate || new Date().toISOString().split("T")[0],
    status
  };

  student.progress = status === "Pass" ? 100 : Math.max(90, student.progress);

  res.json({ success: true, examResult: student.examResult });
});

// Issue Graduation Certificates (for admin)
app.post("/api/admin/students/:id/issue-certificate", (req, res) => {
  const operatorId = req.body.operatorId || req.headers["x-operator-id"];
  if (!checkStaffPermission(operatorId, "issueCertificates")) {
    return res.status(403).json({ error: "Unauthorized: You do not have permission to issue certificates." });
  }

  const student = students.find(s => s.id === req.params.id);
  if (!student) return res.status(404).json({ error: "Student not found" });

  if (student.examResult.status !== "Pass") {
    return res.status(400).json({ error: "Student has not successfully passed examination yet" });
  }

  student.certificateIssued = true;
  student.status = "Completed";
  student.certificateDate = new Date().toISOString().split("T")[0];
  student.verificationCode = generateVerificationCode();

  res.json({ success: true, student });
});

// Fee submission portal (both student/admin)
app.post("/api/students/:id/pay-installment", (req, res) => {
  const { amount, transactionId, paymentMode, screenshot } = req.body;
  if (!amount || !transactionId) {
    return res.status(400).json({ error: "Amount and Transaction ID are required" });
  }

  const student = students.find(s => s.id === req.params.id);
  if (!student) return res.status(404).json({ error: "Student not found" });

  const newPayment: Payment = {
    id: `pay-${Date.now()}`,
    amount: Number(amount),
    date: new Date().toISOString().split("T")[0],
    paymentMode: paymentMode || "UPI QR Check",
    transactionId,
    screenshot: screenshot || "",
    status: "Pending" // Verified by admin
  };

  student.payments.push(newPayment);
  // Do not increase paidFees on student side until Admin approves it!

  res.json({ success: true, student });
});

// Fetch system roles config
app.get("/api/admin/roles", (req, res) => {
  res.json(adminRoles);
});

// Edit granular staff permissions
app.post("/api/admin/roles/:id", (req, res) => {
  const { permissions, operatorId } = req.body;
  
  if (!operatorId) {
    return res.status(403).json({ error: "Unauthorized: Missing operator verification credentials." });
  }

  const operator = adminRoles.find(r => r.id === operatorId);
  if (!operator || operator.role !== "Admin") {
    return res.status(403).json({ error: "Unauthorized: Only Admin role can modify staff system permissions." });
  }

  const roleRecord = adminRoles.find(r => r.id === req.params.id);
  if (!roleRecord) return res.status(404).json({ error: "Staff role record not found" });

  if (permissions) {
    roleRecord.permissions = { ...roleRecord.permissions, ...permissions };
  }
  res.json({ success: true, role: roleRecord });
});

// Encrypted Database Backups
app.get("/api/admin/backup", (req, res) => {
  const stateToBackup = {
    students,
    courses,
    adminRoles,
    announcements,
    backedAt: new Date().toISOString(),
    hash: crypto.createHash("sha256").update(JSON.stringify(students)).digest("hex"),
    serverMetadata: {
      institute: "Global Computer Center",
      location: "Civil Line Bijnor, Uttar Pradesh",
      encryptionStandard: "AES-256-CBC"
    }
  };

  const rawString = JSON.stringify(stateToBackup);
  const encryptedPayload = encryptData(rawString);

  res.json({
    filename: `gcc_backup_${new Date().toISOString().split("T")[0]}.enc`,
    backedUpAt: stateToBackup.backedAt,
    targetCount: students.length,
    encryptionStandard: "AES-256-CBC",
    encryptedData: encryptedPayload,
    decryptedDataSize: rawString.length,
    verificationHash: stateToBackup.hash,
    passphraseHash: "0f443b7430138541c4a161fd4bf65306660dc7d745da3c2b186b51ff9b7ff0ea" // simulated sha256 of passcode
  });
});

// -------------------------------------------------------------
// VITE INTEGRATION FOR ASSETS AND ROUTING
// -------------------------------------------------------------
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Global Computer Center backend server listening at http://0.0.0.0:${PORT}`);
  });
}

startServer();
