import React, { useState, useEffect } from "react";
import { 
  BookOpen, Award, CheckCircle, Shield, Key, RefreshCw, Layers, MapPin, 
  UserCheck, Plus, Search, Calendar, ChevronRight, Check, AlertCircle, 
  Trash2, Download, DollarSign, QrCode, Lock, Globe, FileText, BellRing,
  User, Server, KeyRound, CheckSquare, XCircle, X, UploadCloud, Eye, FileCheck
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import Header from "./components/Header";
import HomeSection from "./components/HomeSection";
import QRScanner from "./components/QRScanner";
import AttendanceHeatmap from "./components/AttendanceHeatmap";
import { Course, Student, Announcement, AdminRole, Payment, ExamResult } from "./types";
import {
  getCourses,
  getAnnouncements,
  getAdminRoles,
  getStudents,
  verifyCertificate,
  studentLogin,
  adminLogin,
  enrollStudent,
  payInstallment,
  toggle2FA,
  approveStudent,
  approvePayment,
  markAttendance,
  saveGrade,
  issueCertificate,
  createCourse,
  createAnnouncement,
  modifyPermission,
  getSingleStudent,
  runBackup,
  determineDatabaseMode
} from "./utils/apiHelper";

export default function App() {
  const [activeTab, setActiveTab] = useState<string>("home");
  
  // App States
  const [courses, setCourses] = useState<Course[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [staffRoles, setStaffRoles] = useState<AdminRole[]>([]);
  const [selectedCourseForDetail, setSelectedCourseForDetail] = useState<Course | null>(null);

  // Push Notifications state
  const [notifications, setNotifications] = useState<Array<{ id: string; title: string; content: string; date: string; seen: boolean }>>([
    {
      id: "n-initial",
      title: "Welcome to Global Computer Center Bijnor",
      content: "Thank you for visiting. Explore courses and online admission portals.",
      date: "Today",
      seen: false
    }
  ]);

  // Toast alert system
  const [toasts, setToasts] = useState<Array<{ id: string; msg: string; type: "success" | "error" | "info" }>>([]);

  // Student specific sessions
  const [loggedInStudent, setLoggedInStudent] = useState<Student | null>(null);
  const [activePrintJob, setActivePrintJob] = useState<'profile' | 'certificate' | null>(null);
  const [studentCredential, setStudentCredential] = useState<string>("");
  const [studentCode2fa, setStudentCode2fa] = useState<string>("");
  const [loginStep2fa, setLoginStep2fa] = useState<boolean>(false);
  const [loginError, setLoginError] = useState<string>("");

  // Admin / Faculty specific sessions
  const [loggedInAdmin, setLoggedInAdmin] = useState<AdminRole | null>(null);
  const [adminEmailInput, setAdminEmailInput] = useState<string>("");
  const [adminPasscodeInput, setAdminPasscodeInput] = useState<string>("");
  const [adminLoginError, setAdminLoginError] = useState<string>("");
  const [adminLoginLoading, setAdminLoginLoading] = useState<boolean>(false);

  // Client local OTP verification helper
  const [tempOtpCode, setTempOtpCode] = useState<string>("");

  // Online Admission Enrollment Form
  const [enrollForm, setEnrollForm] = useState({
    name: "",
    fathersName: "",
    mothersName: "",
    email: "",
    phone: "",
    address: "",
    courseId: "",
    transactionId: "",
    amountPaid: "",
    screenshot: ""
  });
  const [enrollmentResponse, setEnrollmentResponse] = useState<any | null>(null);
  const [enrollmentLoading, setEnrollmentLoading] = useState<boolean>(false);

  // Installment Portal submission form
  const [installmentForm, setInstallmentForm] = useState({
    amount: "",
    transactionId: "",
    screenshot: ""
  });

  // Selected student details popup inside faculty admin controls
  const [selectedAdminStudent, setSelectedAdminStudent] = useState<Student | null>(null);
  const [expandedScreenshotPay, setExpandedScreenshotPay] = useState<string | null>(null);

  // Verification Desk
  const [searchParam, setSearchParam] = useState<string>("");
  const [verificationResult, setVerificationResult] = useState<any | null>(null);
  const [verificationError, setVerificationError] = useState<string>("");
  const [verificationLoading, setVerificationLoading] = useState<boolean>(false);

  // Admin Specific state dashboard
  const [adminStudents, setAdminStudents] = useState<Student[]>([]);
  const [backupObject, setBackupObject] = useState<any | null>(null);
  const [attendanceForm, setAttendanceForm] = useState({
    studentId: "",
    date: new Date().toISOString().split("T")[0],
    status: "Present" as "Present" | "Absent" | "Leave"
  });
  const [gradeForm, setGradeForm] = useState({
    studentId: "",
    theory: "",
    practical: "",
    assignment: "",
    examDate: new Date().toISOString().split("T")[0]
  });
  const [selectedStaffRole, setSelectedStaffRole] = useState<string>("staff-1");
  const [newCourseForm, setNewCourseForm] = useState({
    name: "",
    code: "",
    duration: "6 Months",
    eligibility: "12th Pass",
    feesOneTime: "",
    feesInstallment: "",
    syllabus: ""
  });
  const [newAnnouncementForm, setNewAnnouncementForm] = useState({
    title: "",
    content: "",
    category: "General" as any,
    isImportant: false
  });

  const [activeAdminSubTab, setActiveAdminSubTab] = useState<string>("students-list");

  // Load initial configurations from API backend
  const refreshAppData = async () => {
    try {
      const cData = await getCourses();
      setCourses(cData);

      const aData = await getAnnouncements();
      setAnnouncements(aData);

      const sData = await getAdminRoles();
      setStaffRoles(sData);

      // Refresh admin student list
      const studentList = await getStudents();
      setAdminStudents(studentList);
    } catch (e) {
      console.error("Error refreshing core application database payloads", e);
    }
  };

  useEffect(() => {
    refreshAppData();
  }, []);

  useEffect(() => {
    const handleAfterPrint = () => {
      setActivePrintJob(null);
    };
    window.addEventListener("afterprint", handleAfterPrint);
    return () => window.removeEventListener("afterprint", handleAfterPrint);
  }, []);

  const addToast = (msg: string, type: "success" | "error" | "info" = "success") => {
    const id = `t-${Date.now()}`;
    setToasts((prev) => [...prev, { id, msg, type }]);
    
    // Add to system notifications too as push simulation
    const newNotif = {
      id: `notif-${Date.now()}`,
      title: type === "success" ? "Operation Successful" : type === "error" ? "System Error Alert" : "System Notification",
      content: msg,
      date: new Date().toLocaleTimeString(),
      seen: false
    };
    setNotifications((prev) => [newNotif, ...prev]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const markNotificationsSeen = () => {
    setNotifications((prev) => prev.map(n => ({ ...n, seen: true })));
  };

  // Student Login Engine
  const handleStudentLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");

    try {
      const data = await studentLogin(
        studentCredential,
        loginStep2fa ? studentCode2fa : undefined
      );

      if (data.error) {
        setLoginError(data.error || "Login process failed");
        addToast(data.error || "Login Verification failure", "error");
        return;
      }

      if (data.step2fa) {
        setLoginStep2fa(true);
        addToast("A security code is required to complete authentication (2FA). Check student ledger card.", "info");
      } else if (data.success && data.student) {
        setLoggedInStudent(data.student);
        addToast(`Successfully logged in as ${data.student.name}!`, "success");
        setLoginStep2fa(false);
        setStudentCode2fa("");
      }
    } catch (err) {
      setLoginError("Could not connect to authentication ledger.");
    }
  };

  // Admin/Faculty Login Engine
  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdminLoginError("");
    setAdminLoginLoading(true);

    try {
      const data = await adminLogin(adminEmailInput, adminPasscodeInput);
      setAdminLoginLoading(false);

      if (data.error) {
        setAdminLoginError(data.error || "Login process failed");
        addToast(data.error || "Login Verification failure", "error");
        return;
      }

      if (data.success && data.staff) {
        setLoggedInAdmin(data.staff);
        setSelectedStaffRole(data.staff.id); // for backwards compatibility
        addToast(`Successfully logged in as ${data.staff.name} (${data.staff.role})!`, "success");
        setAdminEmailInput("");
        setAdminPasscodeInput("");
      }
    } catch (err) {
      setAdminLoginLoading(false);
      setAdminLoginError("Could not connect to faculty authentication gateway.");
      addToast("Connection error to admin server", "error");
    }
  };

  // Toggle dynamic Two factor setting on account
  const handleToggle2FA = async (studentId: string) => {
    try {
      const data = await toggle2FA(studentId);
      if (data.success) {
        if (loggedInStudent) {
          setLoggedInStudent({
            ...loggedInStudent,
            twoFactorEnabled: data.twoFactorEnabled,
            twoFactorSecret: data.twoFactorSecret
          });
        }
        addToast(
          data.twoFactorEnabled 
            ? `Two-Factor security enabled! Verification Secret is: ${data.twoFactorSecret}` 
            : "Two-Factor Authentication has been disabled from portal.",
          "success"
        );
        refreshAppData();
      }
    } catch (e) {
      addToast("Could not modify security policy settings.", "error");
    }
  };

  // Submit installment/fees in student zone
  const handleInstallmentPayment = async (studentId: string, amount: number, transactionId: string, screenshot?: string) => {
    if (!amount || amount <= 0) {
      addToast("Please enter a valid tuition payment amount.", "error");
      return;
    }
    if (!transactionId) {
      addToast("State ledger requires a legal dynamic confirmation UPI transaction ID.", "error");
      return;
    }

    try {
      const data = await payInstallment(studentId, amount, transactionId, screenshot);
      if (data.success && data.student) {
        setLoggedInStudent(data.student);
        addToast(`Payment of ₹${amount} submitted! It will show as pending until verified by faculty.`, "success");
        // Clear installment form
        setInstallmentForm({ amount: "", transactionId: "", screenshot: "" });
        refreshAppData();
      } else {
        addToast(data.error || "Receipt log failed.", "error");
      }
    } catch (e) {
      addToast("Payment gateway submission error.", "error");
    }
  };

  // QR Scan handler to pre-fill enrollment fees and transaction ID
  const handleQRScanSuccess = (decodedText: string) => {
    try {
      if (decodedText.startsWith("upi://pay")) {
        const queryStr = decodedText.split("?")[1] || "";
        const urlParams = new URLSearchParams(queryStr);
        const amount = urlParams.get("am") || "";
        const txnId = urlParams.get("tr") || urlParams.get("tid") || "";
        setEnrollForm(prev => ({
          ...prev,
          amountPaid: amount || prev.amountPaid,
          transactionId: txnId || prev.transactionId
        }));
        addToast(`Successfully scanned! Filled amount ₹${amount || "1,500"} and Txn ID: ${txnId || "GCCBHAR579201Z9"}.`, "success");
      } else {
        setEnrollForm(prev => ({
          ...prev,
          transactionId: decodedText
        }));
        addToast(`Scanned reference text: ${decodedText}`, "success");
      }
    } catch (err) {
      setEnrollForm(prev => ({
        ...prev,
        transactionId: decodedText
      }));
      addToast(`Scanned code: ${decodedText}`, "success");
    }
  };

  // Student Admission Roll Form Submission
  const handleAdmissionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!enrollForm.courseId) {
      addToast("Please choose an educational computer syllabus program.", "error");
      return;
    }
    if (!enrollForm.transactionId) {
      addToast("A digital bank transaction reference ID is mandatory for admission validation.", "error");
      return;
    }

    setEnrollmentLoading(true);
    setEnrollmentResponse(null);

    try {
      // Cast the enrollForm numeric amountPaid if it is a string
      const parsedPaid = enrollForm.amountPaid ? Number(enrollForm.amountPaid) : 0;
      const data = await enrollStudent({
        ...enrollForm,
        amountPaid: parsedPaid
      });
      setEnrollmentLoading(false);

      if (data.success && data.student) {
        setEnrollmentResponse(data.student);
        addToast("Registration form submitted! Waiting administrative verification.", "success");
        
        // Auto filler to ease student preview
        setStudentCredential(data.student.regNo);
        
        // Reset state
        setEnrollForm({
          name: "",
          fathersName: "",
          mothersName: "",
          email: "",
          phone: "",
          address: "",
          courseId: "",
          transactionId: "",
          amountPaid: ""
        });
        refreshAppData();
      } else {
        addToast(data.error || "Admission ledger submission failed.", "error");
      }
    } catch (err) {
      setEnrollmentLoading(false);
      addToast("Error linking registration records to Bijnor host servers.", "error");
    }
  };

  // Verification Search Core
  const handleVerificationCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchParam.trim()) {
      addToast("Provide Registration Number, Roll number or Certificate Verify Code", "info");
      return;
    }

    setVerificationLoading(true);
    setVerificationResult(null);
    setVerificationError("");

    try {
      const data = await verifyCertificate(searchParam.trim());
      setVerificationLoading(false);

      if (data && !data.error) {
        setVerificationResult(data);
        addToast("Match successfully found in certified Global Computer Center ledger database!", "success");
      } else {
        setVerificationError(data.error || "Record coordinates not registered.");
        addToast("No match found for given coordinates criteria parameters.", "error");
      }
    } catch (err) {
      setVerificationLoading(false);
      setVerificationError("Ledger database is offline.");
    }
  };

  // Administrative Powers
  const handleApproveStudent = async (id: string) => {
    try {
      const data = await approveStudent(id, loggedInAdmin?.id || "");
      if (data.success) {
        addToast("Student admission successfully verified and activated!", "success");
        refreshAppData();
      } else {
        addToast(data.error || "Failed approving candidate.", "error");
      }
    } catch (e) {
      addToast("Failed approving candidate registration.", "error");
    }
  };

  const handleApprovePayment = async (studentId: string, paymentId: string) => {
    try {
      const data = await approvePayment(studentId, paymentId, loggedInAdmin?.id || "");
      if (data.success && data.student) {
        addToast("Installment payment receipt is approved and credited!", "success");
        refreshAppData();
        // If viewing this student details popup, update live state
        if (selectedAdminStudent && selectedAdminStudent.id === studentId) {
          setSelectedAdminStudent(data.student);
        }
      } else {
        addToast(data.error || "Failed approving installment payment credit.", "error");
      }
    } catch (e) {
      addToast("Failed approving transaction card.", "error");
    }
  };

  const handleMarkAttendance = async () => {
    const { studentId, date, status } = attendanceForm;
    if (!studentId) {
      addToast("Please select a student record to register attendance.", "error");
      return;
    }

    try {
      const data = await markAttendance(studentId, date, status, loggedInAdmin?.id || "");
      if (data.success) {
        addToast(`Registered attendance [${status}] on ${date} successfully.`, "success");
        
        // If the logged in student is seeing their dashboard, refresh it
        if (loggedInStudent && loggedInStudent.id === studentId) {
          const updatedStudent = await getSingleStudent(studentId);
          setLoggedInStudent(updatedStudent);
        }
        
        refreshAppData();
      } else {
        addToast(data.error || "Attendance log failure.", "error");
      }
    } catch (e) {
      addToast("Could not post attendance record sheet.", "error");
    }
  };

  const handleGradeStudent = async () => {
    const { studentId, theory, practical, assignment, examDate } = gradeForm;
    if (!studentId) {
      addToast("Choose standard student credentials for grading first", "error");
      return;
    }

    try {
      const data = await saveGrade(studentId, Number(theory), Number(practical), Number(assignment), examDate, loggedInAdmin?.id || "");
      if (data.success) {
        addToast("Grades & overall percentage calculated and saved on ledger successfully.", "success");
        
        if (loggedInStudent && loggedInStudent.id === studentId) {
          const updatedStudent = await getSingleStudent(studentId);
          setLoggedInStudent(updatedStudent);
        }

        refreshAppData();
      } else {
        addToast(data.error || "Grading submission failed.", "error");
      }
    } catch (e) {
      addToast("Failed submitting exam records.", "error");
    }
  };

  const handleIssueCertificate = async (id: string) => {
    try {
      const data = await issueCertificate(id, loggedInAdmin?.id || "");
      if (data.success && data.student) {
        addToast(`Graduation certificate issued securely! Verification key: ${data.student.verificationCode}`, "success");
        
        if (loggedInStudent && loggedInStudent.id === id) {
          setLoggedInStudent(data.student);
        }

        refreshAppData();
      } else {
        addToast(data.error || "Cannot issue certificate.", "error");
      }
    } catch (e) {
      addToast("Graduation server error.", "error");
    }
  };

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const syllabusList = newCourseForm.syllabus.split(",").map(item => item.trim()).filter(item => item !== "");
      const data = await createCourse({
        name: newCourseForm.name,
        code: newCourseForm.code,
        duration: newCourseForm.duration,
        eligibility: newCourseForm.eligibility,
        feesOneTime: Number(newCourseForm.feesOneTime || 0),
        feesInstallment: Number(newCourseForm.feesInstallment || 0),
        syllabus: syllabusList
      }, loggedInAdmin?.id || "");

      if (data.success) {
        addToast(`Course ${newCourseForm.code} successfully launched!`, "success");
        setNewCourseForm({
          name: "",
          code: "",
          duration: "6 Months",
          eligibility: "12th Pass",
          feesOneTime: "",
          feesInstallment: "",
          syllabus: ""
        });
        refreshAppData();
      } else {
        addToast(data.error || "Course creation failure.", "error");
      }
    } catch (e) {
      addToast("Server rejected syllabus registry.", "error");
    }
  };

  const handleCreateAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = await createAnnouncement(newAnnouncementForm, loggedInAdmin?.id || "");
      if (data.success) {
        addToast("New security board announcement successfully published!", "success");
        setNewAnnouncementForm({
          title: "",
          content: "",
          category: "General",
          isImportant: false
        });
        refreshAppData();
      } else {
        addToast(data.error || "Announcement failed.", "error");
      }
    } catch (e) {
      addToast("Announcement failed.", "error");
    }
  };

  // Toggle admin granular permissions
  const handleTogglePermission = async (roleId: string, permissionName: string, currentValue: boolean) => {
    if (!loggedInAdmin || loggedInAdmin.role !== "Admin") {
      addToast("Unauthorized: Only Admin role (Er. Madhur Forex) can modify staff system permissions.", "error");
      return;
    }

    try {
      const data = await modifyPermission(roleId, { [permissionName]: !currentValue }, loggedInAdmin.id);
      if (data.success) {
        addToast("Granular access capability state updated and logged securely.", "success");
        refreshAppData();
      } else {
        addToast(data.error || "Permission change unauthorized.", "error");
      }
    } catch (e) {
      addToast("Could not modify permission rules matrix.", "error");
    }
  };

  // Read highly encrypted backup system log
  const handleDownloadBackup = async () => {
    try {
      const data = await runBackup();
      setBackupObject(data);
      addToast("System encrypted database backup file mapped correctly under AES-256-CBC envelope standard.", "success");
    } catch (e) {
      addToast("Cipher module decryption failure.", "error");
    }
  };

  // Check if current logged in Admin has a specific permission
  const hasAdminPermission = (permName: keyof AdminRole["permissions"]): boolean => {
    if (!loggedInAdmin) return false;
    const currentRole = staffRoles.find(r => r.id === loggedInAdmin.id);
    if (!currentRole) return false;
    return !!currentRole.permissions[permName];
  };

  return (
    <>
      <div className={`min-h-screen bg-[#0A0A0B] text-gray-200 font-sans flex flex-col justify-between selection:bg-indigo-600 selection:text-white ${activePrintJob ? 'hidden print:hidden' : ''}`}>
      
      {/* Toast Alert popups */}
      <div className="fixed top-24 right-4 z-55 max-w-sm space-y-2 pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 50, scale: 0.9 }}
              className={`p-4 rounded-xl shadow-xl flex items-center gap-3 border pointer-events-auto ${
                toast.type === "success" 
                  ? "bg-slate-900 border-emerald-500/30 text-emerald-300"
                  : toast.type === "error"
                  ? "bg-slate-900 border-rose-500/30 text-rose-300"
                  : "bg-slate-900 border-indigo-500/30 text-indigo-300"
              }`}
            >
              <div className="shrink-0">
                {toast.type === "success" && <CheckCircle className="h-5 w-5 text-emerald-400" />}
                {toast.type === "error" && <XCircle className="h-5 w-5 text-rose-400" />}
                {toast.type === "info" && <BellRing className="h-5 w-5 text-indigo-400" />}
              </div>
              <p className="text-xs font-semibold leading-snug">{toast.msg}</p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Header element */}
      <Header 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        notifications={notifications}
        markNotificationsSeen={markNotificationsSeen}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* TAB 1: HOME */}
        {activeTab === "home" && (
          <HomeSection 
            onNavigate={(tab) => setActiveTab(tab)} 
            announcements={announcements} 
            courses={courses}
          />
        )}

        {/* TAB 2: OUR COMPUTER COURSES (DCE OSM Education aligned style) */}
        {activeTab === "courses" && (
          <div className="space-y-8">
            <div className="space-y-3">
              <span className="text-[10px] font-extrabold uppercase bg-indigo-500/15 border border-indigo-500/20 px-3 py-1.5 rounded text-indigo-400 leading-none">
                Syllabus Catalogue
              </span>
              <h2 className="text-2xl md:text-3xl font-black text-white">
                Technical Syllabus & Certification Courses
              </h2>
              <p className="text-gray-400 text-sm max-w-3xl leading-relaxed">
                Choose professional IT educational modules carefully aligned with national digital frameworks. Simple formats, deep practical sessions, and standard verification keys.
              </p>
            </div>

            {/* Courses grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <div 
                  key={course.id}
                  className="bg-[#141417] border border-gray-800 rounded-3xl p-6 flex flex-col justify-between hover:border-indigo-600/30 transition shadow-sm group"
                >
                  <div className="space-y-4">
                    <div className="flex justify-between items-start gap-2">
                      <span className="text-xs font-mono font-bold px-2.5 py-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-lg">
                        {course.code}
                      </span>
                      <span className="text-xs text-gray-400 font-semibold flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-emerald-400" />
                        {course.duration}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <h3 className="font-extrabold text-white text-base group-hover:text-indigo-400 transition leading-snug">
                        {course.name}
                      </h3>
                      <p className="text-xs text-gray-400">
                        Eligibility: <span className="text-slate-300 font-semibold">{course.eligibility}</span>
                      </p>
                    </div>

                    <div className="border-t border-gray-800/80 pt-3">
                      <div className="text-[11px] font-extrabold text-gray-500 tracking-wider uppercase mb-2">
                        Core Syllabus Overviews
                      </div>
                      <ul className="space-y-1">
                        {course.syllabus.slice(0, 4).map((syll, idx) => (
                          <li key={idx} className="text-xs text-gray-300 flex items-start gap-1.5 leading-tight">
                            <span className="text-indigo-400 mt-0.5 font-bold">•</span>
                            <span className="line-clamp-1">{syll}</span>
                          </li>
                        ))}
                        {course.syllabus.length > 4 && (
                          <li className="text-[10px] text-indigo-400 font-bold italic pt-1">
                            + {course.syllabus.length - 4} deeper syllabus chapters...
                          </li>
                        )}
                      </ul>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-gray-800/80 space-y-4">
                    <div className="flex justify-between items-end">
                      <div>
                        <span className="text-[10px] text-gray-500 leading-none block">One-time payment</span>
                        <span className="text-lg font-black text-white">₹{course.feesOneTime}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-gray-500 leading-none block">Easy installments</span>
                        <span className="text-xs font-bold text-gray-300">₹{course.feesInstallment} total</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => setSelectedCourseForDetail(course)}
                        className="flex-1 py-2 text-center text-xs font-bold bg-gray-800 hover:bg-gray-700 hover:text-white rounded-xl transition border border-gray-700/50 cursor-pointer"
                      >
                        Syllabus Details
                      </button>
                      <button
                        onClick={() => {
                          setEnrollForm(prev => ({ ...prev, courseId: course.id }));
                          setActiveTab("admission");
                        }}
                        className="flex-1 py-2 text-center text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition shadow-md cursor-pointer"
                      >
                        Enroll Now
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Syllabus Modal drawer */}
            <AnimatePresence>
              {selectedCourseForDetail && (
                <>
                  <div className="fixed inset-0 bg-black/60 backdrop-blur z-50 transition-opacity" onClick={() => setSelectedCourseForDetail(null)}></div>
                  <div className="fixed inset-x-4 bottom-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-xl w-full bg-[#141417] border border-gray-800 rounded-3xl p-6 shadow-2xl z-55 overflow-hidden">
                    <div className="space-y-4">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <span className="text-xs font-bold font-mono text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded">
                            {selectedCourseForDetail.code}
                          </span>
                          <h3 className="font-extrabold text-white text-lg">
                            {selectedCourseForDetail.name}
                          </h3>
                        </div>
                        <button 
                          onClick={() => setSelectedCourseForDetail(null)}
                          className="p-1 px-2.5 rounded bg-gray-800 text-white hover:bg-rose-600 text-xs font-bold transition"
                        >
                          ✕
                        </button>
                      </div>

                      <div className="space-y-3 border-t border-gray-800/80 pt-4">
                        <div className="grid grid-cols-2 gap-4 text-xs bg-[#0A0A0B] p-3 rounded-2xl border border-gray-800/40">
                          <div>
                            <span className="text-gray-500">Duration Period</span>
                            <p className="font-bold text-white">{selectedCourseForDetail.duration}</p>
                          </div>
                          <div>
                            <span className="text-gray-500">Standard Eligibility</span>
                            <p className="font-bold text-white">{selectedCourseForDetail.eligibility}</p>
                          </div>
                        </div>

                        <div>
                          <h4 className="text-xs font-extrabold text-gray-400 uppercase tracking-wider mb-2">
                            Comprehensive Curriculum Syllabus Chapters:
                          </h4>
                          <div className="p-4 bg-gray-950/40 border border-gray-800/60 rounded-2xl max-h-60 overflow-y-auto space-y-2">
                            {selectedCourseForDetail.syllabus.map((syl, i) => (
                              <div key={i} className="text-xs text-gray-300 flex items-start gap-2">
                                <span className="text-indigo-400 font-bold">{i + 1}.</span>
                                <span>{syl}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-gray-800/80 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-gray-500 block">Tuition fee setup</span>
                          <span className="text-xl font-black text-rose-400">₹{selectedCourseForDetail.feesOneTime} /-</span>
                        </div>
                        <button
                          onClick={() => {
                            setEnrollForm(prev => ({ ...prev, courseId: selectedCourseForDetail.id }));
                            setSelectedCourseForDetail(null);
                            setActiveTab("admission");
                          }}
                          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-lg transition"
                        >
                          Proceed with Instant Admission
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* TAB 3: ONLINE ADMISSION WITH SCANNERPAY WINDOW */}
        {activeTab === "admission" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Form Segment */}
            <div className="lg:col-span-7 space-y-6">
              <div className="space-y-2">
                <span className="text-[10px] font-extrabold uppercase bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded text-emerald-400">
                  Secure Enrollment Desk
                </span>
                <h2 className="text-2xl md:text-3xl font-black text-white">
                  GCC Student Registration Desk
                </h2>
                <p className="text-gray-400 text-xs">
                  Provide credentials, double check desired curriculum fees brackets, submit UPI transaction reference codes.
                </p>
              </div>

              {enrollmentResponse ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-slate-900 border border-emerald-500/30 p-6 rounded-3xl space-y-5"
                >
                  <div className="flex gap-3 items-start">
                    <div className="h-10 w-10 rounded-full bg-emerald-500/15 flex items-center justify-center text-emerald-400 shrink-0">
                      <Check className="h-6 w-6" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-extrabold text-white text-lg">Application Registered Successfully!</h3>
                      <p className="text-xs text-gray-300">
                        Your details were logged onto Global Computer Center ledger databases. Kindly save admission reference key slip:
                      </p>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-950/40 border border-gray-800 rounded-2xl text-xs space-y-2 font-mono">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Candidate Name:</span>
                      <span className="text-white font-bold">{enrollmentResponse.student.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Assigned Reg No:</span>
                      <span className="text-yellow-400 font-bold">{enrollmentResponse.student.regNo}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Secured Tuition Roll No:</span>
                      <span className="text-indigo-400 font-bold">{enrollmentResponse.student.rollNo}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Course Syllabus:</span>
                      <span className="text-white">{courses.find(c => c.id === enrollmentResponse.student.courseId)?.code}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Initial Fees Paid:</span>
                      <span className="text-emerald-400">₹{enrollmentResponse.student.paidFees}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Log Status:</span>
                      <span className="bg-amber-500/20 text-amber-400 px-2 rounded-full font-sans text-[10px] uppercase font-bold tracking-wide">
                        Pending Admin Verification
                      </span>
                    </div>
                  </div>

                  <div className="alert bg-gray-950/20 p-3.5 border border-gray-800 text-[11px] text-gray-400 leading-relaxed rounded-xl">
                    Note: Complete approval usually takes within 1-2 hours after financial transaction verification. You can sign in using this assigned **Reg No** to view progress tracking dashboards at Student Zone portal.
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        setActiveTab("student-zone");
                        setEnrollmentResponse(null);
                      }}
                      className="px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition flex-1 text-center cursor-pointer"
                    >
                      Login to Student Zone Dashboard
                    </button>
                    <button
                      onClick={() => setEnrollmentResponse(null)}
                      className="px-5 py-3 bg-gray-800 text-gray-300 hover:text-white rounded-xl text-xs font-bold transition border border-gray-700/50 cursor-pointer"
                    >
                      Enroll Another Candidate
                    </button>
                  </div>
                </motion.div>
              ) : (
                <form onSubmit={handleAdmissionSubmit} className="bg-[#141417] border border-gray-800 rounded-3xl p-6 md:p-8 space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">
                        Student Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Ankit Kumar"
                        value={enrollForm.name}
                        onChange={(e) => setEnrollForm({ ...enrollForm, name: e.target.value })}
                        className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">
                        Father's Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Father's Name"
                        value={enrollForm.fathersName}
                        onChange={(e) => setEnrollForm({ ...enrollForm, fathersName: e.target.value })}
                        className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">
                        Mother's Name
                      </label>
                      <input
                        type="text"
                        placeholder="Mother's Name"
                        value={enrollForm.mothersName}
                        onChange={(e) => setEnrollForm({ ...enrollForm, mothersName: e.target.value })}
                        className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">
                        Personal Mobile Number *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="e.g. 9876543210"
                        value={enrollForm.phone}
                        onChange={(e) => setEnrollForm({ ...enrollForm, phone: e.target.value })}
                        className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">
                        E-mail ID
                      </label>
                      <input
                        type="email"
                        placeholder="student.name@gmail.com"
                        value={enrollForm.email}
                        onChange={(e) => setEnrollForm({ ...enrollForm, email: e.target.value })}
                        className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">
                        Target Computer syllabus Course *
                      </label>
                      <select
                        required
                        value={enrollForm.courseId}
                        onChange={(e) => {
                          const courseId = e.target.value;
                          const selectedCourse = courses.find(c => c.id === courseId);
                          const fees = selectedCourse ? selectedCourse.feesOneTime : "";
                          setEnrollForm({ ...enrollForm, courseId, amountPaid: String(fees) });
                        }}
                        className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                      >
                        <option value="">-- Click to choose standard course --</option>
                        {courses.map(c => (
                          <option key={c.id} value={c.id}>{c.code} - {c.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">
                      Residential Mailing Address *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Street address, block, post office, dist. Bijnor"
                      value={enrollForm.address}
                      onChange={(e) => setEnrollForm({ ...enrollForm, address: e.target.value })}
                      className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  {/* Interactive Camera QR Scanner component */}
                  <div className="space-y-2 border-t border-gray-805/40 pt-4">
                    <label className="text-xs font-bold text-indigo-400 uppercase tracking-widest block flex items-center gap-1.5 font-mono">
                      <QrCode className="h-4 w-4" /> Live Camera QR Code Scanner Form autofill
                    </label>
                    <QRScanner onScanSuccess={handleQRScanSuccess} />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-gray-800 pt-5">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-gray-450 text-indigo-400 uppercase tracking-wider block">
                        Amount to register (₹) *
                      </label>
                      <input
                        type="number"
                        required
                        placeholder="Calculated course registration fee"
                        value={enrollForm.amountPaid}
                        onChange={(e) => setEnrollForm({ ...enrollForm, amountPaid: e.target.value })}
                        className="w-full bg-gray-900 border border-indigo-500/25 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-gray-450 text-indigo-400 uppercase tracking-wider block">
                        Bank UPI Transaction ID *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Reference code from scan QR receipt"
                        value={enrollForm.transactionId}
                        onChange={(e) => setEnrollForm({ ...enrollForm, transactionId: e.target.value })}
                        className="w-full bg-gray-900 border border-indigo-500/40 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono focus:ring-1 focus:ring-indigo-500"
                      />
                    </div>
                  </div>

                  {/* Attachment container block for screenshot receipts */}
                  <div className="space-y-2 border-t border-gray-800/60 pt-4">
                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block flex justify-between items-center">
                      <span>Upload Payment Screenshot Receipt *</span>
                      <span className="text-[10px] text-indigo-400 lowercase font-mono">png, jpg, jpeg (max 3MB)</span>
                    </label>
                    
                    {!enrollForm.screenshot ? (
                      <div className="border border-dashed border-gray-800 rounded-2xl p-5 hover:border-indigo-500/50 hover:bg-indigo-600/5 bg-gray-950/20 text-center transition relative group">
                        <input
                          type="file"
                          accept="image/*"
                          required
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              if (file.size > 3 * 1024 * 1024) {
                                addToast("Receipt screenshot image must be smaller than 3MB.", "error");
                                return;
                              }
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                setEnrollForm({ ...enrollForm, screenshot: reader.result as string });
                                addToast("Admissions payment screenshot loaded successfully!", "success");
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                        />
                        <div className="space-y-2">
                          <div className="h-9 w-9 rounded-xl bg-gray-900 border border-gray-850 flex items-center justify-center text-gray-400 mx-auto group-hover:text-indigo-400 group-hover:border-indigo-500/30 transition">
                            <UploadCloud className="h-5 w-5" />
                          </div>
                          <div className="space-y-1">
                            <p className="text-xs font-semibold text-gray-300 animate-pulse">
                              Drag & Drop Receipt or <span className="text-indigo-400 group-hover:underline">Browse</span>
                            </p>
                            <p className="text-[10px] text-gray-500">Scan QR Code, complete transfer, screenshot layout and upload here</p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="p-3.5 bg-[#141417] border border-indigo-500/30 rounded-2xl flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3 overflow-hidden">
                          <img
                            src={enrollForm.screenshot}
                            alt="Receipt thumbnail"
                            className="h-12 w-12 rounded-lg object-cover border border-gray-800 bg-gray-900 cursor-zoom-in"
                            onClick={() => setExpandedScreenshotPay(enrollForm.screenshot)}
                          />
                          <div className="space-y-0.5 overflow-hidden">
                            <span className="text-[9px] font-bold text-indigo-400 uppercase tracking-widest block font-mono">SECURED RECEIPT ATTACHED</span>
                            <span className="text-xs text-white font-semibold truncate block">Screenshot loaded</span>
                            <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-semibold">
                              <Check className="h-3 w-3 inline" /> Local verification ready
                            </span>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setEnrollForm({ ...enrollForm, screenshot: "" })}
                          className="p-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-xl transition cursor-pointer"
                          title="Clear screenshot"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={enrollmentLoading}
                    className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-indigo-600 hover:from-emerald-700 hover:to-indigo-700 text-white font-bold text-xs uppercase tracking-wide rounded-xl shadow-lg transition duration-150 active:scale-98 cursor-pointer disabled:opacity-40"
                  >
                    {enrollmentLoading ? "Registering onto State ledger..." : "Verify & Log Online Admission Registration"}
                  </button>
                </form>
              )}
            </div>

            {/* SCANNER PAY WINDOW SEGMENT */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-[#141417] border border-gray-800 rounded-3xl p-6 flex flex-col items-center">
                <div className="flex items-center gap-1.5 self-start pb-5">
                  <QrCode className="h-4 w-4 text-indigo-400" />
                  <span className="font-bold text-sm tracking-tight text-white">UPI QR Code Payment Window</span>
                </div>

                <div className="text-center space-y-1 mb-5">
                  <span className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">GCC Digital Ledger System</span>
                  <p className="text-2xl font-black text-white">
                    ₹{enrollForm.amountPaid ? Number(enrollForm.amountPaid).toLocaleString() : "0"}.00
                  </p>
                  <span className="text-[9px] text-gray-400 block bg-gray-800/60 py-1 px-3 rounded-full border border-gray-800/50">
                    Payee: Global Computer Center Bijnor
                  </span>
                </div>

                {/* Simulated QR block layout */}
                <div className="bg-white p-4 rounded-2xl w-44 h-44 shadow-inner relative flex items-center justify-center transform hover:scale-105 transition-all">
                  <div className="grid grid-cols-3 grid-rows-3 gap-1.5 w-full h-full p-2 opacity-90">
                    <div className="bg-black"></div><div className="bg-black"></div><div className="border-4 border-black"></div>
                    <div className="bg-black"></div><div className="bg-black"></div><div className="bg-black"></div>
                    <div className="border-4 border-black"></div><div className="bg-black"></div><div className="bg-black"></div>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-10 h-10 bg-indigo-600 border-2 border-white rounded flex items-center justify-center text-[10px] font-extrabold text-white shadow-md">
                      GCC
                    </div>
                  </div>
                </div>

                <div className="mt-5 space-y-1 text-center">
                  <p className="text-[10px] text-gray-400 leading-snug">
                    Scan via standard merchant apps:<br />
                    <span className="text-indigo-400 font-bold">BharatPe / BHIM UPI / GPay / PhonePe / Paytm</span>
                  </p>
                  <p className="text-[9px] text-gray-500 italic pt-1">
                    Enter the successful dynamic transaction reference code in the form input.
                  </p>
                </div>
              </div>

              <div className="bg-[#141417]/50 border border-gray-800/80 rounded-2xl p-5 space-y-3">
                <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Shield className="h-4 w-4 text-emerald-400" />
                  Real-time Security Warnings (2FA)
                </h4>
                <p className="text-[11px] text-gray-400 leading-relaxed leading-snug">
                  Global Computer Center maintains encrypted SSL backups and Two-factor key validations. Any fraudulent transaction reference claims are subject to immediate regulatory block cycles and address bans.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: STUDENT ZONE / PORTAL */}
        {activeTab === "student-zone" && (
          <div className="space-y-8">
            
            {/* If Not Logged In, Show login portal panel */}
            {!loggedInStudent ? (
              <div className="max-w-md mx-auto bg-[#141417] border border-gray-800 rounded-3xl p-6 md:p-8 space-y-6">
                <div className="text-center space-y-2">
                  <div className="h-12 w-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto">
                    <Lock className="h-6 w-6" />
                  </div>
                  <h2 className="text-xl font-extrabold text-white tracking-tight">
                    GCC Personalized Student Gate
                  </h2>
                  <p className="text-gray-400 text-xs leading-relaxed">
                    Access syllabus trackers, view marks spreadsheets, print authentic graduates certificates, and toggles system multifactor security.
                  </p>
                </div>

                {loginError && (
                  <div className="p-3 bg-rose-950/20 border border-rose-500/30 text-rose-300 text-xs rounded-xl flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span>{loginError}</span>
                  </div>
                )}

                <form onSubmit={handleStudentLogin} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">
                      Registration or Roll Number
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. GCC/2026/0205 or 12026003"
                      value={studentCredential}
                      onChange={(e) => setStudentCredential(e.target.value)}
                      disabled={loginStep2fa}
                      className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
                    />
                  </div>

                  {loginStep2fa && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="space-y-1.5 pt-1"
                    >
                      <div className="flex justify-between items-center text-xs">
                        <label className="font-semibold text-indigo-400 uppercase tracking-wider block">
                          Enter 2FA Security Code
                        </label>
                        <span className="text-[10px] text-gray-500">Hint code: GCCA{courses.length}xxx</span>
                      </div>
                      <input
                        type="password"
                        required
                        placeholder="Security passcode e.g. GCCA12903Z"
                        value={studentCode2fa}
                        onChange={(e) => setStudentCode2fa(e.target.value)}
                        className="w-full bg-gray-900 border border-indigo-500/30 rounded-xl px-4 py-2.5 text-xs text-white uppercase focus:outline-none focus:border-indigo-500 font-mono"
                      />
                    </motion.div>
                  )}

                  <div className="flex gap-2.5 pt-2">
                    {loginStep2fa && (
                      <button
                        type="button"
                        onClick={() => {
                          setLoginStep2fa(false);
                          setStudentCode2fa("");
                          setLoginError("");
                        }}
                        className="px-4 py-2.5 bg-gray-800 hover:bg-gray-700 text-xs font-bold text-gray-300 rounded-xl transition border border-gray-750"
                      >
                        Reset
                      </button>
                    )}
                    <button
                      type="submit"
                      className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs uppercase tracking-wide rounded-xl shadow-lg transition duration-150 active:scale-95 cursor-pointer"
                    >
                      {loginStep2fa ? "Verify & Unlock Secure Session" : "Access Academic Portal"}
                    </button>
                  </div>
                </form>

                <div className="pt-4 border-t border-gray-800 text-center text-[10px] text-gray-500 leading-snug">
                  New Candidate? Start on Online Admissions to acquire instant registration keys. For demo logs use: **GCC/2026/0205** with 2FA passcode: **GCCA12903Z**
                </div>
              </div>
            ) : (
              
              // IF LOGGED IN: SHOW COMPLEX STUDENT DASHBOARD OVERVIEW
              <div className="space-y-8">
                
                {/* Profile welcome summary block */}
                <div className="bg-[#141417] border border-gray-800 rounded-3xl p-6 md:p-8 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="absolute -right-32 -top-32 w-80 h-80 bg-indigo-600/10 rounded-full blur-2xl"></div>
                  
                  {/* Photo & Identity details */}
                  <div className="flex items-center gap-4 relative z-10">
                    <img 
                      src={loggedInStudent.photoUrl} 
                      alt={loggedInStudent.name}
                      className="h-16 w-16 rounded-2xl object-cover border-2 border-indigo-505/20 bg-gray-800 border-indigo-500/20 shadow-md"
                    />
                    <div className="space-y-1">
                      <h3 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                        {loggedInStudent.name}
                        {loggedInStudent.status === "Completed" && (
                          <span className="text-[10px] uppercase font-bold bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 px-2 py-0.5 rounded">
                            Graduate Alumini
                          </span>
                        )}
                      </h3>
                      <p className="text-xs text-gray-400 font-mono">
                        Reg No: <span className="text-slate-300 font-semibold">{loggedInStudent.regNo}</span> | Roll No: <span className="text-slate-300 font-semibold">{loggedInStudent.rollNo}</span>
                      </p>
                      <p className="text-xs text-indigo-400 font-semibold italic">
                        {courses.find(c => c.id === loggedInStudent.courseId)?.name}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap md:flex-nowrap gap-4 relative z-10 shrink-0">
                    <div className="p-3 px-5 bg-gray-950/60 rounded-2xl border border-gray-800/60 text-center min-w-[100px]">
                      <span className="text-[10px] text-gray-500 uppercase tracking-widest block font-bold">Overall Progress</span>
                      <span className="text-2xl font-black text-indigo-400 leading-none block pt-1">{loggedInStudent.progress}%</span>
                    </div>

                    <div className="p-3 px-5 bg-gray-950/60 rounded-2xl border border-gray-800/60 text-center min-w-[100px]">
                      <span className="text-[10px] text-gray-500 uppercase tracking-widest block font-bold">Log Status</span>
                      <span className={`text-[11px] font-extrabold uppercase mt-1 px-2.5 py-1 rounded inline-block ${
                        loggedInStudent.status === "Completed" ? "bg-emerald-550/10 text-emerald-400" :
                        loggedInStudent.status === "Approved" ? "bg-indigo-550/10 text-indigo-400" :
                        "bg-amber-500/10 text-amber-400"
                      }`}>
                        {loggedInStudent.status}
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        setActivePrintJob('profile');
                        setTimeout(() => {
                          window.print();
                        }, 200);
                      }}
                      className="p-3 px-4 bg-indigo-550/10 hover:bg-indigo-555/20 border border-indigo-500/30 font-bold hover:text-white rounded-2xl text-xs text-indigo-400 transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <Download className="h-4 w-4 text-indigo-300" />
                      Print/Export Summary
                    </button>

                    <button
                      onClick={() => {
                        setLoggedInStudent(null);
                        setStudentCredential("");
                        addToast("Logged out of student secure session successfully.", "info");
                      }}
                      className="p-3 px-4 bg-rose-500/10 hover:bg-rose-500/15 border border-rose-500/30 font-bold hover:text-white rounded-2xl text-xs text-rose-400 transition cursor-pointer"
                    >
                      Exit Session
                    </button>
                  </div>
                </div>

                {/* Main Student Portal panels */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  
                  {/* Left Column: Progress dashboard, Attendance logs, results */}
                  <div className="lg:col-span-8 space-y-6">
                    
                    {/* Attendance Grid chart */}
                    <div className="bg-[#141417] border border-gray-800 rounded-3xl p-6">
                      <AttendanceHeatmap attendanceData={loggedInStudent.attendance} />
                    </div>

                    {/* Test Results panel */}
                    <div className="bg-[#141417] border border-gray-800 rounded-3xl p-6">
                      <div className="pb-4 border-b border-gray-800 mb-4 flex justify-between items-center">
                        <h4 className="font-bold text-white text-sm">Personalized Exam Results Sheet</h4>
                        <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          loggedInStudent.examResult.status === "Pass" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30" : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                        }`}>
                          Course: {loggedInStudent.examResult.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pb-4">
                        <div className="p-3 bg-[#0A0A0B]/60 rounded-2xl border border-gray-800/40 text-center">
                          <span className="text-[10px] text-gray-500 uppercase font-semibold">Theory Marks</span>
                          <p className="text-lg font-bold text-slate-100">{loggedInStudent.examResult.theory || "0"} / 100</p>
                        </div>
                        <div className="p-3 bg-[#0A0A0B]/60 rounded-2xl border border-gray-800/40 text-center">
                          <span className="text-[10px] text-gray-500 uppercase font-semibold">Practicals</span>
                          <p className="text-lg font-bold text-slate-100">{loggedInStudent.examResult.practical || "0"} / 100</p>
                        </div>
                        <div className="p-3 bg-[#0A0A0B]/60 rounded-2xl border border-gray-800/40 text-center">
                          <span className="text-[10px] text-gray-500 uppercase font-semibold">Assignments</span>
                          <p className="text-lg font-bold text-slate-100">{loggedInStudent.examResult.assignment || "0"} / 100</p>
                        </div>
                        <div className="p-3 bg-[#0A0A0B]/60 rounded-2xl border border-gray-800/40 text-center">
                          <span className="text-[10px] text-indigo-400 uppercase font-semibold">Agg. Grade</span>
                          <p className="text-lg font-black text-indigo-400">{loggedInStudent.examResult.grade || "N/A"}</p>
                        </div>
                      </div>

                      {loggedInStudent.examResult.status === "Pass" ? (
                        <div className="p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div>
                            <h5 className="text-xs font-bold text-white flex items-center gap-1.5">
                              <CheckSquare className="h-4 w-4 text-emerald-400 animate-pulse" />
                              Pass Verification Status Checked!
                            </h5>
                            <p className="text-[11px] text-gray-400">
                              Passed dynamic examinations with overall percentage scoring: **{loggedInStudent.examResult.percentage}%** on {loggedInStudent.examResult.examDate}.
                            </p>
                          </div>
                          
                          {loggedInStudent.certificateIssued ? (
                            <button
                              onClick={() => {
                                setActivePrintJob('certificate');
                                setTimeout(() => {
                                  window.print();
                                }, 250);
                              }}
                              className="px-4 py-2 bg-gradient-to-r from-yellow-600 to-indigo-600 hover:from-yellow-700 hover:to-indigo-700 text-white font-extrabold text-xs rounded-xl shadow-md transition cursor-pointer"
                            >
                              Download Graduates Certificate
                            </button>
                          ) : (
                            <span className="text-[10.5px] italic text-amber-400 bg-amber-500/15 border border-amber-500/30 px-3 py-1.5 rounded-xl font-medium">
                              Pending certification validation queue.
                            </span>
                          )}
                        </div>
                      ) : (
                        <div className="p-4 bg-gray-900 border border-gray-800 text-[11px] text-gray-400 rounded-2xl leading-relaxed">
                          Your scheduled test dates or grades will appear above. Practical examinations schedule: June-2026. Keep doing syllabus chapters and regular labs attendance.
                        </div>
                      )}
                    </div>

                    {/* Submitted Payments Ledger Tracking */}
                    <div className="bg-[#141417] border border-gray-800 rounded-3xl p-6">
                      <div className="pb-4 border-b border-gray-800 mb-4 flex justify-between items-center">
                        <div className="space-y-1">
                          <h4 className="font-bold text-white text-sm">Submitted Payments & Ledger Receipts</h4>
                          <p className="text-[10.5px] text-gray-400">
                            Check and review the ledger verification status of all your submitted payments.
                          </p>
                        </div>
                        <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded">
                          Total Verified: ₹{loggedInStudent.paidFees}
                        </span>
                      </div>

                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                          <thead className="bg-[#0A0A0B] text-gray-400 uppercase text-[9px] tracking-wider border-b border-gray-800">
                            <tr>
                              <th className="px-4 py-2.5">Date</th>
                              <th className="px-4 py-2.5">Amount</th>
                              <th className="px-4 py-2.5">Transaction ID</th>
                              <th className="px-4 py-2.5">Receipt Attachment</th>
                              <th className="px-4 py-2.5 text-center">Status</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-800/40">
                            {loggedInStudent.payments && loggedInStudent.payments.length > 0 ? (
                              loggedInStudent.payments.map((p, idx) => (
                                <tr key={p.id || idx} className="hover:bg-white/2">
                                  <td className="px-4 py-3 font-semibold text-slate-300">{p.date}</td>
                                  <td className="px-4 py-3 font-bold text-emerald-400">₹{p.amount}</td>
                                  <td className="px-4 py-3 font-mono text-gray-400">{p.transactionId}</td>
                                  <td className="px-4 py-3">
                                    {p.screenshot ? (
                                      <button
                                        type="button"
                                        onClick={() => setExpandedScreenshotPay(p.screenshot || null)}
                                        className="inline-flex items-center gap-1 text-[10px] text-indigo-400 hover:text-indigo-300 font-semibold underline cursor-pointer"
                                      >
                                        <Eye className="h-3 w-3" /> View Screenshot
                                      </button>
                                    ) : (
                                      <span className="text-gray-600 text-[10px]">No attachment</span>
                                    )}
                                  </td>
                                  <td className="px-4 py-3 text-center">
                                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                                      p.status === "Approved" 
                                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
                                        : "bg-amber-500/15 text-amber-400 border border-amber-500/20 animate-pulse"
                                    }`}>
                                      {p.status}
                                    </span>
                                  </td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td colSpan={5} className="px-4 py-6 text-center text-gray-500">
                                  No transaction records initialized for current session.
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* PRINT SLIP BLOCK (HIDDEN ON BROWSER, SHOWS ON WINDOW PRINT) */}
                    {loggedInStudent.certificateIssued && (
                      <div className="printable-certificate hidden print:block bg-white p-12 text-black max-w-4xl mx-auto border-8 border-yellow-600 rounded-lg text-center space-y-8 font-sans">
                        <div className="space-y-2">
                          <h1 className="text-xl font-extrabold tracking-widest text-[#0F0F12]">
                            GLOBAL COMPUTER CENTER
                          </h1>
                          <p className="text-xs font-bold uppercase tracking-widest text-gray-600">
                            Registered Office: Civil Line Bijnor, Uttar Pradesh (UP)
                          </p>
                          <p className="text-[10px] text-gray-500 italic">
                            Govt Registration Approved Portfolio Code: GCC-9902
                          </p>
                        </div>

                        <div className="border-t border-b border-gray-300 py-6 my-4 space-y-4">
                          <span className="text-lg uppercase tracking-wide text-amber-700 font-extrabold block">
                            Graduation Computer Diploma Certificate
                          </span>
                          <p className="text-sm font-medium leading-relaxed max-w-2xl mx-auto italic">
                            This is to verify and certify that candidate **{loggedInStudent.name}** child of Sri. **{loggedInStudent.fathersName}** has successfully completed and graduated the intensive curriculum program package in:
                          </p>
                          <h3 className="text-lg font-black text-indigo-900 tracking-tight block py-1.5 uppercase">
                            {courses.find(c => c.id === loggedInStudent.courseId)?.name} ({courses.find(c => c.id === loggedInStudent.courseId)?.code})
                          </h3>
                          <p className="text-xs font-semibold leading-relaxed">
                            for the curriculum year ending on verified ledger date: **{loggedInStudent.certificateDate || "2026"}**. Passed examination with aggregate Grade of excellence: **{loggedInStudent.examResult.grade}** ({loggedInStudent.examResult.percentage}%).
                          </p>
                        </div>

                        <div className="grid grid-cols-2 gap-8 text-xs font-medium pt-8">
                          <div className="text-left space-y-1">
                            <span className="text-gray-500 block">Certificate Registration Key:</span>
                            <span className="font-mono font-bold tracking-wider">{loggedInStudent.verificationCode}</span>
                          </div>
                          <div className="text-right space-y-1">
                            <span className="text-gray-500 block">System Signature Verification:</span>
                            <span className="font-bold underline">GCC Academic Registrar Authority</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right Column: Fees tracking, QR Code scanner, Multifactor 2FA switch */}
                  <div className="lg:col-span-4 space-y-6">
                    
                    {/* Fee submission box */}
                    <div className="bg-[#141417] border border-gray-800 rounded-3xl p-6 flex flex-col items-center">
                      <h4 className="font-bold text-white text-sm self-start mb-4 uppercase tracking-wider text-gray-400">
                        Tuition Fee Ledger
                      </h4>
                      
                      <div className="grid grid-cols-2 gap-4 w-full text-center border-b border-gray-800/80 pb-4 mb-4 text-xs font-medium">
                        <div>
                          <span className="text-gray-500">Fees Paid</span>
                          <p className="text-emerald-400 font-bold text-lg">₹{loggedInStudent.paidFees}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Remaining</span>
                          <p className="text-rose-400 font-bold text-lg">₹{loggedInStudent.totalFees - loggedInStudent.paidFees}</p>
                        </div>
                      </div>

                      {loggedInStudent.totalFees - loggedInStudent.paidFees > 0 ? (
                        <div className="w-full space-y-4">
                          <div className="text-center space-y-2">
                            <div className="bg-white p-2.5 rounded-xl w-32 h-32 mx-auto flex items-center justify-center shadow">
                              <QrCode className="h-28 w-28 text-slate-900" />
                            </div>
                            <span className="text-[10px] text-indigo-400 block font-semibold leading-none pt-0.5">
                              Scan secure scan UPI (256-Bit)
                            </span>
                          </div>

                          <div className="space-y-1.5 font-sans">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                              Installment Amount (₹)
                            </label>
                            <input
                              type="number"
                              placeholder={String(loggedInStudent.totalFees - loggedInStudent.paidFees)}
                              value={installmentForm.amount}
                              onChange={(e) => setInstallmentForm({ ...installmentForm, amount: e.target.value })}
                              className="w-full bg-[#0A0A0B] border border-gray-800 rounded-xl px-4 py-2.5 text-xs text-white uppercase focus:outline-none"
                            />
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                              Receipt Transaction ID
                            </label>
                            <input
                              type="text"
                              placeholder="e.g. TXN9876543210"
                              value={installmentForm.transactionId}
                              onChange={(e) => setInstallmentForm({ ...installmentForm, transactionId: e.target.value })}
                              className="w-full bg-[#0A0A0B] border border-gray-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none font-mono"
                            />
                          </div>

                          {/* Screenshot visual selector */}
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                              Upload Payment Screenshot *
                            </label>
                            {!installmentForm.screenshot ? (
                              <div className="border border-dashed border-gray-800 rounded-xl p-3 bg-[#0A0A0B] text-center hover:border-indigo-500/50 relative group cursor-pointer transition">
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                      const reader = new FileReader();
                                      reader.onloadend = () => {
                                        setInstallmentForm({ ...installmentForm, screenshot: reader.result as string });
                                        addToast("Installment payment screenshot attached!", "success");
                                      };
                                      reader.readAsDataURL(file);
                                    }
                                  }}
                                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                                />
                                <div className="flex flex-col items-center justify-center space-y-1 text-gray-300 group-hover:text-indigo-400 transition">
                                  <UploadCloud className="h-4 w-4 text-indigo-400/80 animate-pulse" />
                                  <span className="text-[10px] font-medium">Click to upload transfer receipt</span>
                                </div>
                              </div>
                            ) : (
                              <div className="p-2.5 bg-gray-950 border border-indigo-500/25 rounded-xl flex items-center justify-between gap-2">
                                <div className="flex items-center gap-2 overflow-hidden">
                                  <img
                                    src={installmentForm.screenshot}
                                    alt="Receipt thumb"
                                    className="h-8 w-8 rounded object-cover cursor-zoom-in"
                                    onClick={() => setExpandedScreenshotPay(installmentForm.screenshot)}
                                  />
                                  <div className="overflow-hidden">
                                    <span className="text-[10px] text-white truncate block font-mono">attached.png</span>
                                    <span className="text-[9px] text-emerald-400 block font-semibold flex items-center gap-0.5">
                                      <CheckCircle className="h-2.5 w-2.5 inline" /> Ready to submit
                                    </span>
                                  </div>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => setInstallmentForm({ ...installmentForm, screenshot: "" })}
                                  className="text-gray-500 hover:text-rose-400 transition cursor-pointer"
                                >
                                  <X className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            )}
                          </div>

                          <button
                            onClick={() => {
                              const amount = installmentForm.amount === "" 
                                ? loggedInStudent.totalFees - loggedInStudent.paidFees 
                                : Number(installmentForm.amount);
                              handleInstallmentPayment(
                                loggedInStudent.id, 
                                amount, 
                                installmentForm.transactionId, 
                                installmentForm.screenshot
                              );
                            }}
                            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs uppercase tracking-wide rounded-xl shadow-lg transition cursor-pointer"
                          >
                            Submit Installment Receipt
                          </button>
                        </div>
                      ) : (
                        <div className="w-full text-center space-y-2 p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 rounded-2xl text-xs font-semibold">
                          <Check className="h-5 w-5 text-emerald-400 mx-auto" />
                          <span>All tuition ledger dues successfully cleared!</span>
                        </div>
                      )}
                    </div>

                    {/* Multifactor 2FA Toggle switch */}
                    <div className="bg-[#141417] border border-gray-800 rounded-3xl p-6 space-y-4">
                      <div className="space-y-1">
                        <h4 className="font-semibold text-white text-sm">Two-Factor Authentication (2FA)</h4>
                        <p className="text-[10px] text-gray-400 leading-snug">
                          Toggles dual verification security protection on this specific roll.
                        </p>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-[#0A0A0B] rounded-2xl border border-gray-800/40">
                        <div className="flex items-center gap-2.5 text-xs font-semibold">
                          <Shield className="h-4 m-4 text-indigo-400 shrink-0" />
                          <span>2FA Status State</span>
                        </div>
                        
                        <button
                          onClick={() => handleToggle2FA(loggedInStudent.id)}
                          className={`w-12 h-6.5 rounded-full p-1 transition-colors duration-200 focus:outline-none ${
                            loggedInStudent.twoFactorEnabled ? "bg-indigo-600" : "bg-gray-800"
                          }`}
                        >
                          <div
                            className={`bg-white w-4.5 h-4.5 rounded-full shadow-md transform duration-200 ${
                              loggedInStudent.twoFactorEnabled ? "translate-x-5.5" : "translate-x-0"
                            }`}
                          />
                        </button>
                      </div>

                      {loggedInStudent.twoFactorEnabled && (
                        <div className="p-3 bg-indigo-500/5 border border-indigo-500/20 text-indigo-300 text-xs rounded-2xl font-mono leading-none flex flex-col justify-center items-center gap-2">
                          <span className="text-[9px] text-gray-500 font-sans block uppercase font-bold text-left w-full">Verification secret passcode (keep safe):</span>
                          <span className="font-extrabold text-white text-base tracking-widest">{loggedInStudent.twoFactorSecret}</span>
                          <span className="text-[9.5px] italic text-indigo-400 font-sans pt-1">Provide this code on next sign-in.</span>
                        </div>
                      )}
                    </div>

                  </div>

                </div>

              </div>
            )}
          </div>
        )}

        {/* TAB 5: CERTIFICATE VERIFICATION DESK */}
        {activeTab === "verification" && (
          <div className="max-w-3xl mx-auto space-y-8">
            <div className="space-y-3 text-center">
              <span className="text-[10px] font-extrabold uppercase bg-indigo-500/10 border border-indigo-505/20 px-3 py-1.5 rounded text-indigo-400 inline-block">
                Open Ledger Desk
              </span>
              <h2 className="text-2xl md:text-3.5xl font-black text-white">
                Graduation Verification Desk
              </h2>
              <p className="text-gray-400 text-sm max-w-xl mx-auto leading-relaxed">
                Enter Registration Number, Roll Number, or graduates Verification Code to perform instant matching against GCC Certified Registry Ledger.
              </p>
            </div>

            <div className="bg-[#141417] border border-gray-800 rounded-3xl p-6 shadow-md md:p-8 space-y-6">
              <form onSubmit={handleVerificationCheck} className="flex gap-2">
                <input
                  type="text"
                  required
                  placeholder="e.g. GCC-CERT-RH82K1, GCC/2025/1102, or 12026001"
                  value={searchParam}
                  onChange={(e) => setSearchParam(e.target.value)}
                  className="flex-1 bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono tracking-wider"
                />
                <button
                  type="submit"
                  disabled={verificationLoading}
                  className="px-5 bg-indigo-600 hover:bg-indigo-700 font-bold text-white text-xs rounded-xl flex items-center gap-1.5 transition whitespace-nowrap cursor-pointer"
                >
                  <Search className="h-4 w-4" />
                  {verificationLoading ? "Retrieving..." : "Query Ledger"}
                </button>
              </form>

              {verificationError && (
                <div className="p-4 bg-rose-500/5 border border-rose-500/25 rounded-2xl flex items-center gap-3 text-rose-300 text-xs">
                  <AlertCircle className="h-5 w-5 text-rose-450 shrink-0" />
                  <div>
                    <span className="font-bold">Coordination Error:</span> {verificationError}
                  </div>
                </div>
              )}

              {verificationResult && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-[#0A0A0B] border border-gray-800 rounded-3xl p-6 space-y-5"
                >
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-gray-800/80 pb-3">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-emerald-505 bg-emerald-500 animate-pulse"></div>
                      <span className="font-extrabold text-[#0D9488] uppercase text-xs tracking-wider">
                        GCC Verified Ledger Record
                      </span>
                    </div>

                    <span className="text-[10px] bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded-lg font-bold font-mono">
                      CODE: {verificationResult.verificationCode}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3.5 text-xs">
                    <div className="space-y-0.5">
                      <span className="text-gray-500">Student Graduate:</span>
                      <p className="font-bold text-white font-sans text-sm">{verificationResult.name}</p>
                    </div>

                    <div className="space-y-0.5">
                      <span className="text-gray-500">Father's Name:</span>
                      <p className="font-bold text-slate-300">{verificationResult.fathersName}</p>
                    </div>

                    <div className="space-y-0.5">
                      <span className="text-gray-500">Assigned Reg No:</span>
                      <p className="font-bold text-indigo-400 font-mono">{verificationResult.regNo}</p>
                    </div>

                    <div className="space-y-0.5">
                      <span className="text-gray-500">Secured Tuition Roll No:</span>
                      <p className="font-bold text-indigo-400 font-mono">{verificationResult.rollNo}</p>
                    </div>

                    <div className="sm:col-span-2 space-y-0.5">
                      <span className="text-gray-500">Syllabus Program:</span>
                      <p className="font-bold text-white uppercase">{verificationResult.courseName} ({verificationResult.courseCode})</p>
                    </div>

                    <div className="space-y-0.5">
                      <span className="text-gray-500">Enrollment Date:</span>
                      <p className="font-semibold text-gray-300 font-mono">{verificationResult.enrollmentDate}</p>
                    </div>

                    <div className="space-y-0.5">
                      <span className="text-gray-500">Ledger Status:</span>
                      <p className="font-bold text-gray-300">{verificationResult.status}</p>
                    </div>
                  </div>

                  <div className="p-4 bg-indigo-500/5 border border-indigo-505/10 border-indigo-500/15 rounded-2xl text-xs space-y-3">
                    <div className="flex justify-between items-center text-[10.5px] uppercase tracking-wider text-indigo-400 border-b border-indigo-500/20 pb-1 font-bold">
                      <span>Exam Score Board Matrix</span>
                      <span>{verificationResult.certificateIssued ? "Graduate Passed" : "Pending Cert"}</span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-center text-[11px]">
                      <div>
                        <span className="text-gray-500 block">Theory</span>
                        <span className="text-white font-bold">{verificationResult.examResult.theory || "N/A"}</span>
                      </div>
                      <div>
                        <span className="text-gray-500 block">Practical</span>
                        <span className="text-white font-bold">{verificationResult.examResult.practical || "N/A"}</span>
                      </div>
                      <div>
                        <span className="text-gray-500 block">Grade</span>
                        <span className="text-white font-bold font-mono">{verificationResult.examResult.grade}</span>
                      </div>
                    </div>

                    {verificationResult.certificateIssued && (
                      <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-800/80 justify-between items-center text-[10px] text-gray-400">
                        <span>Issued Date: **{verificationResult.certificateDate}**</span>
                        <button
                          onClick={() => {
                            // Setup dynamic selector credentials to login and print
                            setStudentCredential(verificationResult.regNo);
                            setActiveTab("student-zone");
                            addToast("Verified candidate loaded. Enter credentials to view full print certificate.", "info");
                          }}
                          className="bg-indigo-600/15 text-indigo-400 border border-indigo-500/30 px-2 py-1 rounded"
                        >
                          Print Original Certificate
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        )}

        {/* TAB 6: FACULTY ADMIN CENTER */}
        {activeTab === "admin-desk" && (
          <div className="space-y-8">
            {!loggedInAdmin ? (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md mx-auto bg-[#141417] border border-gray-800 rounded-3xl p-6 md:p-8 space-y-6"
              >
                <div className="text-center space-y-2">
                  <div className="h-12 w-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/15 text-indigo-400 flex items-center justify-center mx-auto">
                    <Shield className="h-6 w-6" />
                  </div>
                  <h2 className="text-xl font-extrabold text-white tracking-tight">
                    GCC Faculty Secure Login
                  </h2>
                  <p className="text-gray-450 text-xs text-gray-400 leading-relaxed">
                    Access the academic administration portal, manage student registries, record lecture attendance sheets, and issue graduation certificates.
                  </p>
                </div>

                {adminLoginError && (
                  <div className="p-3 bg-rose-950/20 border border-rose-500/30 text-rose-300 text-xs rounded-xl flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span>{adminLoginError}</span>
                  </div>
                )}

                <form onSubmit={handleAdminLogin} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">
                      Faculty Registered Email ID
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. madhurforex@gmail.com"
                      value={adminEmailInput}
                      onChange={(e) => setAdminEmailInput(e.target.value)}
                      className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">
                      Security Passcode Key
                    </label>
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={adminPasscodeInput}
                      onChange={(e) => setAdminPasscodeInput(e.target.value)}
                      className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={adminLoginLoading}
                    className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs uppercase tracking-wide rounded-xl shadow-lg transition duration-150 active:scale-95 cursor-pointer flex justify-center items-center gap-2"
                  >
                    {adminLoginLoading ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin text-white" />
                        <span>Verifying...</span>
                      </>
                    ) : (
                      "Authenticate to Control Desk"
                    )}
                  </button>
                </form>

                <div className="p-4 bg-gray-950/40 border border-gray-800 rounded-2xl text-[10.5px] text-gray-400 space-y-2">
                  <span className="font-bold text-gray-300 uppercase tracking-wider block text-[9px]">Demo Access Credentials (Passcode: admin123):</span>
                  <div className="space-y-1 font-mono">
                    <div className="flex justify-between">
                      <span className="text-gray-500">1. Admin (Full permissions):</span>
                      <span className="text-indigo-400 font-semibold select-all">madhurforex@gmail.com</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">2. Instructor (Attendance & Grades):</span>
                      <span className="text-slate-300 select-all">sanjay.gcc@gmail.com</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">3. Registrar (Admissions & Certs):</span>
                      <span className="text-slate-300 select-all">roshni.gcc@gmail.com</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <>
                {/* Top Selection block & header warnings */}
                <div className="p-5 bg-slate-900 border border-gray-850 border-gray-800 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-5">
                  <div className="space-y-1 text-center md:text-left">
                    <span className="text-[10px] font-extrabold uppercase bg-rose-500/10 border border-rose-500/20 px-2.5 py-1 rounded text-rose-400 flex items-center gap-1.5 w-fit mx-auto md:mx-0">
                      <Server className="h-3 w-3 inline" /> SECURE CONTROL NODE ACTIVE
                    </span>
                    <h2 className="text-xl font-bold text-white tracking-tight">
                      {loggedInAdmin.name} • Faculty Desk
                    </h2>
                    <p className="text-gray-400 text-xs leading-snug">
                      Authorized Role Access: <span className="text-indigo-400 uppercase font-extrabold tracking-wider underline">{loggedInAdmin.role}</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                    <div className="text-right hidden sm:block">
                      <p className="text-[10px] text-gray-500 uppercase tracking-wider font-mono">NODE OPERATOR:</p>
                      <p className="text-xs text-slate-300 font-semibold">{loggedInAdmin.email}</p>
                    </div>
                    <button
                      onClick={() => {
                        setLoggedInAdmin(null);
                        addToast("Successfully logged out from admin desk.", "info");
                      }}
                      className="px-4 py-2 bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/35 text-rose-300 font-bold text-xs rounded-xl transition cursor-pointer active:scale-95"
                    >
                      Log Out Panel
                    </button>
                  </div>
                </div>

            {/* Admin Grid workspace */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Sidebar Menu inside Admin Portal */}
              <aside className="lg:col-span-3 bg-[#141417] border border-gray-800 rounded-3xl p-5 space-y-4">
                <span className="text-[10px] font-extrabold uppercase text-gray-500 tracking-wider">
                  Operational Panels
                </span>

                <div className="flex flex-col gap-1 text-xs">
                  <button
                    onClick={() => setActiveAdminSubTab("students-list")}
                    className={`w-full text-left px-4 py-2.5 rounded-xl transition ${
                      activeAdminSubTab === "students-list" ? "bg-indigo-600/10 text-indigo-400 border border-indigo-600/20" : "text-gray-400 hover:bg-slate-850"
                    }`}
                  >
                    Students Ledger List
                  </button>
                  <button
                    onClick={() => setActiveAdminSubTab("attendance")}
                    className={`w-full text-left px-4 py-2.5 rounded-xl transition ${
                      activeAdminSubTab === "attendance" ? "bg-indigo-600/10 text-indigo-400 border border-indigo-600/20" : "text-gray-400 hover:bg-slate-850"
                    }`}
                  >
                    Academic Attendances
                  </button>
                  <button
                    onClick={() => setActiveAdminSubTab("grades")}
                    className={`w-full text-left px-4 py-2.5 rounded-xl transition ${
                      activeAdminSubTab === "grades" ? "bg-indigo-600/10 text-indigo-400 border border-indigo-600/20" : "text-gray-400 hover:bg-slate-850"
                    }`}
                  >
                    Examination Grading Portal
                  </button>
                  <button
                    onClick={() => setActiveAdminSubTab("add-course")}
                    className={`w-full text-left px-4 py-2.5 rounded-xl transition ${
                      activeAdminSubTab === "add-course" ? "bg-indigo-600/10 text-indigo-400 border border-indigo-600/20" : "text-gray-400 hover:bg-slate-850"
                    }`}
                  >
                    Launch New Syllabus
                  </button>
                  <button
                    onClick={() => setActiveAdminSubTab("add-announcement")}
                    className={`w-full text-left px-4 py-2.5 rounded-xl transition ${
                      activeAdminSubTab === "add-announcement" ? "bg-indigo-600/10 text-indigo-400 border border-indigo-600/20" : "text-gray-400 hover:bg-slate-850"
                    }`}
                  >
                    Write Announcement Board
                  </button>
                  <button
                    onClick={() => setActiveAdminSubTab("permissions-matrix")}
                    className={`w-full text-left px-4 py-2.5 rounded-xl transition ${
                      activeAdminSubTab === "permissions-matrix" ? "bg-indigo-600/10 text-indigo-400 border border-indigo-600/20" : "text-gray-400 hover:bg-slate-850"
                    }`}
                  >
                    Access Roles & Permissions
                  </button>
                  <button
                    onClick={() => setActiveAdminSubTab("backups")}
                    className={`w-full text-left px-4 py-2.5 rounded-xl transition ${
                      activeAdminSubTab === "backups" ? "bg-indigo-600/10 text-indigo-400 border border-indigo-600/20" : "text-gray-400 hover:bg-slate-850"
                    }`}
                  >
                    SSL Backups Desk
                  </button>
                </div>

                <div className="border-t border-gray-800 pt-4 text-[10px] text-gray-500 flex flex-col gap-1 font-mono">
                  <span>AUTHENTICATED AS:</span>
                  <span className="text-indigo-400 font-bold font-sans text-xs">
                    {loggedInAdmin?.name}
                  </span>
                  <span>ROLE: {loggedInAdmin?.role}</span>
                  <span className="text-[9px] text-gray-600 truncate block">UID: {loggedInAdmin?.id}</span>
                </div>
              </aside>

              {/* Workspace display based on active admin subtab */}
              <div className="lg:col-span-9 bg-[#141417] border border-gray-800 rounded-3xl p-6">
                
                {/* SUBTAB 1: STUDENTS LEDGER LIST */}
                {activeAdminSubTab === "students-list" && (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center pb-3 border-b border-gray-800/80">
                      <h3 className="font-bold text-white text-base">Students Enrollment ledger</h3>
                      <span className="text-[10px] uppercase font-bold text-slate-400 bg-[#0A0A0B] p-2.5 py-1 rounded border border-gray-800">
                        Core Ledger Records Count: {adminStudents.length} Students
                      </span>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-xs text-left text-gray-300">
                        <thead className="bg-[#0A0A0B] text-gray-400 uppercase text-[9px] tracking-wider border-b border-gray-800">
                          <tr>
                            <th className="px-4 py-3">Registration & Name</th>
                            <th className="px-4 py-3">Course / Contact</th>
                            <th className="px-4 py-3">Tuition Fees Status</th>
                            <th className="px-4 py-3 text-center">Eligibility Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800/50">
                          {adminStudents.map(student => (
                            <tr key={student.id} className="hover:bg-white/2 cursor-pointer">
                              <td className="px-4 py-3.5 space-y-1">
                                <span className={`text-[9px] uppercase font-bold px-2 py-0.5 rounded leading-none ${
                                  student.status === "Completed" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
                                  student.status === "Approved" ? "bg-indigo-505/10 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20" :
                                  "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                                }`}>
                                  {student.status}
                                </span>
                                <p className="font-bold text-white">{student.name}</p>
                                <span className="font-mono text-gray-500 block">{student.regNo}</span>
                              </td>
                              <td className="px-4 py-3.5 space-y-1">
                                <p className="font-bold text-indigo-400">{courses.find(c => c.id === student.courseId)?.code}</p>
                                <span className="text-[10px] text-gray-400 block">{student.phone}</span>
                              </td>
                              <td className="px-4 py-3.5 space-y-1">
                                <div className="text-[10.5px]">
                                  Paid: <span className="text-emerald-400 font-bold">₹{student.paidFees}</span> / ₹{student.totalFees}
                                </div>
                                <div className="w-24 h-1 bg-gray-850 bg-gray-800 rounded-full overflow-hidden">
                                  <div className="h-full bg-emerald-400" style={{ width: `${(student.paidFees / student.totalFees) * 100}%` }}></div>
                                </div>
                              </td>
                              <td className="px-4 py-3.5 text-center">
                                {student.status === "Pending" ? (
                                  <div className="flex justify-center gap-1.5">
                                    <button
                                      onClick={() => {
                                        if (!hasAdminPermission("manageStudents")) {
                                          addToast("Access Denied: Current role does not hold 'manageStudents' capability permissions.", "error");
                                          return;
                                        }
                                        handleApproveStudent(student.id);
                                      }}
                                      className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] rounded-lg tracking-wide uppercase transition hover:scale-102"
                                    >
                                      Approve Enrollment
                                    </button>
                                    <button
                                      onClick={() => setSelectedAdminStudent(student)}
                                      className="px-2 py-1.5 bg-gray-900 hover:bg-gray-850 text-indigo-400 border border-gray-800 font-bold text-[10px] rounded-lg tracking-wide uppercase transition hover:scale-102 cursor-pointer"
                                    >
                                      Receipts
                                    </button>
                                  </div>
                                ) : (
                                  <div className="flex justify-center gap-1.5">
                                    {student.examResult.status === "Pass" && !student.certificateIssued && (
                                      <button
                                        onClick={() => {
                                          if (!hasAdminPermission("issueCertificates")) {
                                            addToast("Access Denied: You do not possess 'issueCertificates' access permissions.", "error");
                                            return;
                                          }
                                          handleIssueCertificate(student.id);
                                        }}
                                        className="px-2 py-1 bg-yellow-600 hover:bg-yellow-700 text-white rounded font-bold text-[10px] tracking-wide inline-flex items-center gap-1"
                                      >
                                        Issue Cert
                                      </button>
                                    )}
                                    <button
                                      onClick={() => setSelectedAdminStudent(student)}
                                      className="px-2 py-1 bg-[#1c1c21] hover:bg-gray-800 text-indigo-400 rounded text-[10px] font-bold border border-gray-800 tracking-wide uppercase transition hover:scale-102 cursor-pointer"
                                    >
                                      Receipts
                                    </button>
                                    <button
                                      onClick={() => {
                                        setStudentCredential(student.regNo);
                                        setActiveTab("student-zone");
                                        addToast(`Switched workspace simulation to student model view for: ${student.name}`, "info");
                                      }}
                                      className="px-2 py-1 bg-gray-800 text-slate-300 hover:text-white rounded text-[10px] font-bold border border-gray-700 tracking-wide uppercase transition hover:scale-102"
                                    >
                                      Dashboard
                                    </button>
                                  </div>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* SUBTAB 2: ATTENDANCE RECORDING */}
                {activeAdminSubTab === "attendance" && (
                  <div className="space-y-6">
                    <div className="pb-3 border-b border-gray-850 border-gray-800">
                      <h3 className="font-bold text-white text-base">Register Student Attendance Sheet</h3>
                      <p className="text-gray-400 text-xs">
                        Admin dashboard capability permissions are required to append attendance ledger lists.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      
                      {/* Left Select panel */}
                      <div className="bg-[#0A0A0B] p-5 rounded-2xl border border-gray-800 space-y-4">
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">
                            Choose Student Name
                          </label>
                          <select
                            value={attendanceForm.studentId}
                            onChange={(e) => setAttendanceForm({ ...attendanceForm, studentId: e.target.value })}
                            className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
                          >
                            <option value="">-- Apply student catalog selection --</option>
                            {adminStudents.filter(s => s.status !== "Pending").map(stud => (
                              <option key={stud.id} value={stud.id}>{stud.name} ({stud.regNo})</option>
                            ))}
                          </select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">
                              Select Date
                            </label>
                            <input
                              type="date"
                              value={attendanceForm.date}
                              onChange={(e) => setAttendanceForm({ ...attendanceForm, date: e.target.value })}
                              className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none font-mono"
                            />
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">
                              Mark Designation
                            </label>
                            <select
                              value={attendanceForm.status}
                              onChange={(e) => setAttendanceForm({ ...attendanceForm, status: e.target.value as any })}
                              className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
                            >
                              <option value="Present">Present (P)</option>
                              <option value="Absent">Absent (A)</option>
                              <option value="Leave">Leave (L)</option>
                            </select>
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            if (!hasAdminPermission("recordAttendance")) {
                              addToast("Access Denied: Current faculty does not possess 'recordAttendance' privileges.", "error");
                              return;
                            }
                            handleMarkAttendance();
                          }}
                          className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs uppercase tracking-wide rounded-xl shadow-md transition"
                        >
                          Append Attendance Slip Ledger
                        </button>
                      </div>

                      {/* Right attendance tracker view */}
                      <div className="p-4 bg-[#0A0A0B]/60 rounded-2xl border border-gray-800 text-xs text-gray-400 space-y-4">
                        <h4 className="font-bold text-white text-sm">Attendance Guidelines</h4>
                        <p className="leading-snug leading-relaxed">
                          Students require a minimum of **75% aggregate live lab attendances** to qualify and trigger exam schedule eligibilities.
                        </p>
                        <p className="leading-snug">
                          Ensure daily entries accurately reflect physical bench metrics under CCTV cameras. Any retroactive ledger updates must be processed exclusively under dual authorized Registrar permissions profile.
                        </p>
                      </div>

                    </div>
                  </div>
                )}

                {/* SUBTAB 3: GRADING PORTAL */}
                {activeAdminSubTab === "grades" && (
                  <div className="space-y-6">
                    <div className="pb-3 border-b border-gray-850 border-gray-800">
                      <h3 className="font-bold text-white text-base">Computer Examination Grading Portal</h3>
                      <p className="text-gray-400 text-xs">
                        Calculate aggregate scores and pass certificates parameters instantly.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      
                      {/* Grading submission */}
                      <div className="bg-[#0A0A0B] p-5 rounded-2xl border border-gray-800 space-y-4">
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">
                            Candidate Roll Number / Registration
                          </label>
                          <select
                            value={gradeForm.studentId}
                            onChange={(e) => setGradeForm({ ...gradeForm, studentId: e.target.value })}
                            className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
                          >
                            <option value="">-- Click to choose student registration --</option>
                            {adminStudents.filter(s => s.status !== "Pending").map(stud => (
                              <option key={stud.id} value={stud.id}>{stud.name} ({stud.regNo})</option>
                            ))}
                          </select>
                        </div>

                        <div className="grid grid-cols-3 gap-2">
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-semibold text-gray-400 uppercase block">
                              Theory (100)
                            </label>
                            <input
                              type="number"
                              placeholder="0"
                              value={gradeForm.theory}
                              onChange={(e) => setGradeForm({ ...gradeForm, theory: e.target.value })}
                              className="w-full bg-gray-900 border border-gray-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                            />
                          </div>
                          
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-semibold text-gray-400 uppercase block">
                              Practical (100)
                            </label>
                            <input
                              type="number"
                              placeholder="0"
                              value={gradeForm.practical}
                              onChange={(e) => setGradeForm({ ...gradeForm, practical: e.target.value })}
                              className="w-full bg-gray-900 border border-gray-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                            />
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-[10px] font-semibold text-gray-400 uppercase block">
                              Assignment (100)
                            </label>
                            <input
                              type="number"
                              placeholder="0"
                              value={gradeForm.assignment}
                              onChange={(e) => setGradeForm({ ...gradeForm, assignment: e.target.value })}
                              className="w-full bg-gray-900 border border-gray-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                            />
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">
                            Exam Ledger Date
                          </label>
                          <input
                            type="date"
                            value={gradeForm.examDate}
                            onChange={(e) => setGradeForm({ ...gradeForm, examDate: e.target.value })}
                            className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none font-mono"
                          />
                        </div>

                        <button
                          onClick={() => {
                            if (!hasAdminPermission("giveGrades")) {
                              addToast("Access Denied: Custom roles require 'giveGrades' authorization capability.", "error");
                              return;
                            }
                            handleGradeStudent();
                          }}
                          className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs uppercase tracking-wide rounded-xl shadow-md transition"
                        >
                          Append Exam Marks Sheet Result
                        </button>
                      </div>

                      {/* Display grading keys info */}
                      <div className="p-4 bg-[#0A0A0B]/60 rounded-2xl border border-gray-800 text-xs text-gray-400 space-y-4">
                        <h4 className="font-bold text-white text-sm">Grading Keys Legends Table</h4>
                        <div className="divide-y divide-gray-800 font-mono">
                          <div className="flex justify-between py-1.5 text-[10.5px]">
                            <span>percentage &gt;= 85%</span>
                            <span className="text-indigo-400 font-bold">Grade A+</span>
                          </div>
                          <div className="flex justify-between py-1.5 text-[10.5px]">
                            <span>percentage &gt;= 75%</span>
                            <span className="text-emerald-400 font-bold">Grade A</span>
                          </div>
                          <div className="flex justify-between py-1.5 text-[10.5px]">
                            <span>percentage &gt;= 60%</span>
                            <span className="text-amber-400 font-bold">Grade B</span>
                          </div>
                          <div className="flex justify-between py-1.5 text-[10.5px]">
                            <span>percentage &gt;= 33% (Min Passing)</span>
                            <span className="text-gray-300 font-bold">Grade D</span>
                          </div>
                          <div className="flex justify-between py-1.5 text-[10.5px] text-rose-450">
                            <span>percentage &lt; 33%</span>
                            <span className="text-rose-400 font-bold text-rose-500">Grade F (Fail)</span>
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>
                )}

                {/* SUBTAB 4: LAUNCH NEW SYLLABUS COURSE */}
                {activeAdminSubTab === "add-course" && (
                  <form onSubmit={handleCreateCourse} className="space-y-4">
                    <div className="pb-3 border-b border-gray-805 border-gray-800">
                      <h3 className="font-bold text-white text-base font-sans">Launch New Computer Curriculum</h3>
                      <p className="text-gray-400 text-xs font-medium">Add courses instantly inside GCC Bijnor online register.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-gray-400 uppercase block">
                          Course Program Name *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Master Diploma in AI Technologies"
                          value={newCourseForm.name}
                          onChange={(e) => setNewCourseForm({ ...newCourseForm, name: e.target.value })}
                          className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-gray-400 uppercase block">
                          Course Code Abbreviation *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. MDAIT"
                          value={newCourseForm.code}
                          onChange={(e) => setNewCourseForm({ ...newCourseForm, code: e.target.value })}
                          className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none font-mono"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-gray-400 uppercase block">
                          Syllabus Duration *
                        </label>
                        <select
                          value={newCourseForm.duration}
                          onChange={(e) => setNewCourseForm({ ...newCourseForm, duration: e.target.value })}
                          className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
                        >
                          <option value="3 Months">3 Months Slot</option>
                          <option value="6 Months">6 Months Slot</option>
                          <option value="12 Months">12 Months (1 Year)</option>
                          <option value="2 Years">2 Years Professional Dual Course</option>
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-gray-400 uppercase block">
                          Academic Eligibility *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. 10th Pass / Intermediate"
                          value={newCourseForm.eligibility}
                          onChange={(e) => setNewCourseForm({ ...newCourseForm, eligibility: e.target.value })}
                          className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-gray-400 uppercase block">
                          One-time Payment fee (₹) *
                        </label>
                        <input
                          type="number"
                          required
                          placeholder="3500"
                          value={newCourseForm.feesOneTime}
                          onChange={(e) => setNewCourseForm({ ...newCourseForm, feesOneTime: e.target.value })}
                          className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-gray-400 uppercase block">
                          Installment Rate fee total (₹)
                        </label>
                        <input
                          type="number"
                          placeholder="4000"
                          value={newCourseForm.feesInstallment}
                          onChange={(e) => setNewCourseForm({ ...newCourseForm, feesInstallment: e.target.value })}
                          className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
                        />
                      </div>

                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-gray-400 uppercase block">
                        Syllabus Chapter Modules (Comma Separated list) *
                      </label>
                      <textarea
                        required
                        placeholder="Fundamentals, Web Basics, Javascript, React, SQL DB System"
                        rows={3}
                        value={newCourseForm.syllabus}
                        onChange={(e) => setNewCourseForm({ ...newCourseForm, syllabus: e.target.value })}
                        className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 font-extrabold text-white text-xs uppercase tracking-wider rounded-xl shadow-md transition"
                    >
                      Publish Course Syllabus onto Portal
                    </button>
                  </form>
                )}

                {/* SUBTAB 5: WRITE BOARD ANNOUNCEMENT */}
                {activeAdminSubTab === "add-announcement" && (
                  <form onSubmit={handleCreateAnnouncement} className="space-y-4">
                    <div className="pb-3 border-b border-gray-850 border-gray-800">
                      <h3 className="font-bold text-white text-base">Write Notice Board Announcements</h3>
                      <p className="text-gray-400 text-xs">Publish public notes directly onto student dashboards.</p>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-gray-400 uppercase block">
                        Notice Header Title *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Semester examinations timetable has been released"
                        value={newAnnouncementForm.title}
                        onChange={(e) => setNewAnnouncementForm({ ...newAnnouncementForm, title: e.target.value })}
                        className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-gray-400 uppercase block">
                        Detailed Notice Content message *
                      </label>
                      <textarea
                        required
                        rows={4}
                        placeholder="Review examination instructions carefully..."
                        value={newAnnouncementForm.content}
                        onChange={(e) => setNewAnnouncementForm({ ...newAnnouncementForm, content: e.target.value })}
                        className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-gray-400 uppercase block">
                          Notice Category
                        </label>
                        <select
                          value={newAnnouncementForm.category}
                          onChange={(e) => setNewAnnouncementForm({ ...newAnnouncementForm, category: e.target.value as any })}
                          className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
                        >
                          <option value="General">General News</option>
                          <option value="Exam">Exam Details</option>
                          <option value="Holiday">Holiday Alerts</option>
                          <option value="Placement">Corporate Placement</option>
                          <option value="New Course">New Syllabus launch</option>
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-gray-400 uppercase block">
                          Urgent Priority Alert State
                        </label>
                        <div className="flex items-center gap-2 pt-2.5">
                          <input
                            type="checkbox"
                            checked={newAnnouncementForm.isImportant}
                            onChange={(e) => setNewAnnouncementForm({ ...newAnnouncementForm, isImportant: e.target.checked })}
                            className="h-4 w-4 bg-gray-900 border-gray-850 rounded focus:ring-0"
                          />
                          <span className="text-xs text-rose-450 text-rose-400 font-bold uppercase animate-pulse">Mark Important / Urgent Notice</span>
                        </div>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 font-extrabold text-white text-xs uppercase tracking-wider rounded-xl transition shadow-md"
                    >
                      Publish Public Notice
                    </button>
                  </form>
                )}

                {/* SUBTAB 6: SECURITY ROLES AND PERMISSIONS MATRIX */}
                {activeAdminSubTab === "permissions-matrix" && (
                  <div className="space-y-6">
                    <div className="pb-3 border-b border-gray-850 border-gray-800">
                      <h3 className="font-bold text-white text-base">Granular Roles & System Permissions Matrix</h3>
                      <p className="text-gray-450 text-xs text-gray-400">
                        Customize operational rights instantly for all institutional staff keys.
                      </p>
                    </div>

                    <div className="space-y-6">
                      {staffRoles.map((roleRecord) => (
                        <div 
                          key={roleRecord.id} 
                          className="bg-[#0A0A0B] border border-gray-800 rounded-3xl p-5 space-y-4"
                        >
                          <div className="flex justify-between items-center border-b border-gray-800 pb-3">
                            <div>
                              <h4 className="font-bold text-white text-sm">{roleRecord.name}</h4>
                              <p className="text-xs text-indigo-400 font-mono tracking-wider">{roleRecord.role} ID: {roleRecord.id}</p>
                            </div>
                            <span className="text-[10px] bg-slate-900 border border-indigo-505/20 px-2 py-0.5 rounded text-gray-400 font-bold">
                              Verified Staff Slip
                            </span>
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {Object.entries(roleRecord.permissions).map(([permName, hasPermission]) => (
                              <div 
                                key={permName} 
                                className="flex items-center gap-3 p-2.5 bg-[#141417] border border-gray-800 rounded-xl"
                              >
                                <input
                                  type="checkbox"
                                  checked={hasPermission as boolean}
                                  onChange={() => handleTogglePermission(roleRecord.id, permName, hasPermission as boolean)}
                                  className="h-4.5 w-4.5 text-indigo-600 bg-gray-900 border-gray-800 hover:border-indigo-500 rounded focus:ring-0 cursor-pointer"
                                />
                                <span className="text-xs font-semibold text-gray-300 select-none uppercase tracking-wide">
                                  {permName.replace(/([A-Z])/g, " $1")}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* SUBTAB 7: SSL SECURED AES-256 BACKUPS */}
                {activeAdminSubTab === "backups" && (
                  <div className="space-y-6">
                    <div className="pb-3 border-b border-gray-800">
                      <h3 className="font-bold text-white text-base">Encrypted Backups & Disaster Recoveries Desk</h3>
                      <p className="text-gray-400 text-xs">
                        Generate encrypted ledger hashes and export AES-256 ciphers securely to Civil Line node archives.
                      </p>
                    </div>

                    <div className="bg-[#0A0A0B] p-5 border border-gray-800 rounded-3xl flex flex-col items-center justify-center space-y-4 text-center">
                      <div className="h-12 w-12 rounded-full bg-indigo-505/10 bg-indigo-600/10 text-indigo-400 flex items-center justify-center border border-indigo-500/20">
                        <Server className="h-6 w-6" />
                      </div>
                      <div className="space-y-1 max-w-lg">
                        <h4 className="font-bold text-white text-sm">Create New Secured Cipher State Backups</h4>
                        <p className="text-xs text-gray-400 leading-snug">
                          All student files, exam grades logs, fees journals, and syllabus frameworks will be consolidated into a downloadable byte-stream encrypted through symmetric cryptographical standards.
                        </p>
                      </div>

                      <button
                        onClick={handleDownloadBackup}
                        className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs uppercase tracking-wide rounded-xl shadow-md transition"
                      >
                        Compute Encrypted Hash State & Backup
                      </button>
                    </div>

                    {backupObject && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="p-5 bg-[#0A0A0B] border border-emerald-500/25 rounded-3xl space-y-4 font-mono text-xs text-gray-300"
                      >
                        <div className="flex justify-between border-b border-gray-800 pb-2">
                          <span className="text-emerald-400 font-bold">STATE CIPHER GENERATED</span>
                          <span className="text-[10px] text-gray-500">{backupObject.backedUpAt}</span>
                        </div>

                        <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 text-[11px]">
                          <div>
                            <span className="text-gray-500 block">Identified Filename:</span>
                            <span className="text-yellow-400 font-bold block">{backupObject.filename}</span>
                          </div>
                          <div>
                            <span className="text-gray-500 block">Encryption Protocol:</span>
                            <span className="text-white block">{backupObject.encryptionStandard}</span>
                          </div>
                          <div>
                            <span className="text-gray-500 block">Ledger Registries Count:</span>
                            <span className="text-white block">{backupObject.targetCount} Students</span>
                          </div>
                          <div>
                            <span className="text-gray-500 block">Decrypted Payload State:</span>
                            <span className="text-indigo-400 block">{backupObject.decryptedDataSize} bytes block size</span>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <span className="text-gray-500 block text-[10px]">Verification Signature (256-Bit SHA Checksum):</span>
                          <span className="text-emerald-400 bg-gray-950/60 p-2 border border-gray-850 border-gray-800 rounded text-[9.5px] block truncate font-mono">
                            {backupObject.verificationHash}
                          </span>
                        </div>

                        <div className="space-y-1">
                          <span className="text-gray-500 block text-[10px]">Cipher Payload State Block representation (AES-256-CBC Stream):</span>
                          <textarea
                            readOnly
                            rows={4}
                            value={backupObject.encryptedData}
                            className="w-full bg-gray-950/60 p-3 text-[9px] text-gray-500 border border-gray-800 rounded font-mono focus:outline-none"
                          />
                        </div>

                        <div className="pt-2 flex justify-between items-center text-[10px] text-gray-400">
                          <span>Verified: OK</span>
                          <button
                            onClick={() => {
                              const element = document.createElement("a");
                              const file = new Blob([JSON.stringify(backupObject, null, 2)], {type: 'application/json'});
                              element.href = URL.createObjectURL(file);
                              element.download = backupObject.filename;
                              document.body.appendChild(element);
                              element.click();
                              addToast("Backup ledger file download initialized successfully.", "success");
                            }}
                            className="px-2.5 py-1.5 bg-[#141417] border border-gray-800 text-gray-300 font-semibold hover:text-white rounded"
                          >
                            Export Backup File JSON
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </div>
                )}

              </div>

            </div>
            </>)}
          </div>
        )}

      </main>

      {/* Footer System Status Bar matching Elegant Dark */}
      <footer className="border-t border-gray-800 bg-[#0A0A0B] py-6 px-4 sm:px-6 lg:px-8 mt-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-[11px] text-gray-500 font-medium tracking-normal">
          <div className="flex flex-wrap gap-x-6 gap-y-2 items-center justify-center text-center">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              State Verification Ledgers: Active & Online
            </span>
            <span className="h-3 w-px bg-gray-800 hidden md:block"></span>
            <span>AES-256 Backup Core: Sealed</span>
            <span className="h-3 w-px bg-gray-800 hidden md:block"></span>
            <span>Server Location node: Asia-South (UP-1 Bijnor)</span>
          </div>
          <div className="text-center font-semibold">
            © 2026 Global Computer Center Civil Line Bijnor • Digital Academic Portal
          </div>
        </div>
      </footer>

      {/* Dynamic Lightbox for Zoomed Payment Screenshot Receipts */}
      <AnimatePresence>
        {expandedScreenshotPay && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setExpandedScreenshotPay(null)}
            className="fixed inset-0 bg-[#000000]/95 backdrop-blur-md z-[9999] flex items-center justify-center p-4 cursor-zoom-out"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="max-w-3xl max-h-[85vh] w-full bg-[#141417] border border-gray-805 border-gray-800 rounded-3xl p-5 overflow-hidden shadow-2xl relative flex flex-col"
            >
              <div className="flex justify-between items-center pb-3 border-b border-gray-800 mb-3">
                <span className="text-[10px] uppercase tracking-widest text-indigo-400 font-bold font-mono">Verified UPI Screen Receipt Reference</span>
                <button
                  onClick={() => setExpandedScreenshotPay(null)}
                  className="p-1 px-3 bg-gray-900 border border-gray-800 hover:text-white rounded-xl text-xs text-slate-400 font-bold transition cursor-pointer"
                >
                  Close
                </button>
              </div>
              <div className="flex-1 overflow-auto flex items-center justify-center p-4 bg-[#0A0A0B] rounded-2xl border border-gray-800">
                <img
                  src={expandedScreenshotPay}
                  alt="Enlarged Transaction Screenshot"
                  className="max-w-full max-h-[55vh] object-contain rounded-xl shadow-xl"
                />
              </div>
              <div className="pt-3 text-[10.5px] text-gray-500 font-medium text-center">
                Review this screenshot receipt carefully against your banking statement ledger values before validation.
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Selected Student Details and Financial Management Modal */}
      <AnimatePresence>
        {selectedAdminStudent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[999] flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="max-w-2xl w-full bg-[#141417] border border-gray-800 rounded-3xl p-6 shadow-2xl space-y-6 overflow-hidden max-h-[90vh] flex flex-col"
            >
              {/* Header */}
              <div className="flex justify-between items-start pb-4 border-b border-gray-800/80">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-indigo-400 block uppercase tracking-widest font-mono">FACULTY CONTROL DESK</span>
                  <h3 className="text-base font-bold text-white tracking-tight">{selectedAdminStudent.name}</h3>
                  <p className="text-[11px] text-gray-400 font-mono leading-none">Reg No: {selectedAdminStudent.regNo} • Roll: {selectedAdminStudent.rollNo}</p>
                </div>
                <button
                  onClick={() => setSelectedAdminStudent(null)}
                  className="p-1 px-3 bg-gray-901 bg-gray-900 hover:bg-gray-800 hover:text-white border border-gray-805 border-gray-800 text-slate-400 text-xs font-bold rounded-xl transition cursor-pointer"
                >
                  Close
                </button>
              </div>

              {/* Profile Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[11px] bg-[#0A0A0B]/80 p-4 rounded-2xl border border-gray-800/60 leading-relaxed">
                <div className="space-y-1.5">
                  <p className="text-gray-400 font-medium">Father's Name: <span className="text-slate-200 font-bold">{selectedAdminStudent.fathersName}</span></p>
                  <p className="text-gray-400 font-medium">Mother's Name: <span className="text-slate-200 font-bold">{selectedAdminStudent.mothersName}</span></p>
                  <p className="text-gray-400 font-medium font-mono">Admission Date: <span className="text-indigo-400 font-bold">{selectedAdminStudent.enrollmentDate}</span></p>
                </div>
                <div className="space-y-1.5">
                  <p className="text-gray-400 font-medium">Mobile Phone: <span className="text-slate-200 font-bold">{selectedAdminStudent.phone}</span></p>
                  <p className="text-gray-400 font-medium truncate">Mailing Address: <span className="text-slate-200 font-bold">{selectedAdminStudent.address}</span></p>
                  <p className="text-gray-400 font-medium">Academic Status: <span className="text-yellow-500 font-bold uppercase tracking-wider">{selectedAdminStudent.status}</span></p>
                </div>
              </div>

              {/* Payment Receipts Ledger Tab */}
              <div className="flex-1 overflow-y-auto space-y-4">
                <div className="flex justify-between items-center pb-2 border-b border-gray-800/60">
                  <h4 className="font-bold text-white text-xs uppercase tracking-wider text-indigo-400">Tuition Receipts & Installment Verification</h4>
                  <span className="text-[11px] font-mono font-bold text-gray-400">
                    Paid: <span className="text-emerald-400 font-bold">₹{selectedAdminStudent.paidFees}</span> / ₹{selectedAdminStudent.totalFees}
                  </span>
                </div>

                <div className="space-y-3">
                  {selectedAdminStudent.payments && selectedAdminStudent.payments.length > 0 ? (
                    selectedAdminStudent.payments.map((p, idx) => {
                      return (
                        <div key={p.id || idx} className="p-3.5 bg-[#0a0a0b] rounded-2xl border border-gray-800 hover:border-gray-755 hover:border-gray-700 transition flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-xs text-white">₹{p.amount}</span>
                              <span className="text-[9.5px] uppercase font-bold text-indigo-400 font-mono bg-indigo-500/10 px-1.5 py-0.5 rounded leading-none">via {p.paymentMode}</span>
                            </div>
                            <p className="text-[11px] text-gray-400">Txn ID: <span className="font-mono text-slate-300 font-bold">{p.transactionId}</span></p>
                            <p className="text-[10px] text-gray-500 leading-none">Submitted: {p.date}</p>
                          </div>

                          <div className="flex items-center gap-2.5 self-end md:self-auto">
                            {/* Receipt screenshot uploader check */}
                            {p.screenshot ? (
                              <button
                                type="button"
                                onClick={() => setExpandedScreenshotPay(p.screenshot || null)}
                                className="px-2.5 py-1.5 bg-indigo-950/60 hover:bg-indigo-900/60 border border-indigo-900/40 text-indigo-300 font-bold text-[10px] uppercase rounded-xl transition cursor-pointer flex items-center gap-1"
                              >
                                <Eye className="h-3.5 w-3.5 text-indigo-400" /> View Screenshot
                              </button>
                            ) : (
                              <span className="text-[10px] text-gray-600 font-medium italic">No attachment</span>
                            )}

                            {p.status === "Approved" ? (
                              <span className="px-2.5 py-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-xl text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 leading-none">
                                <Check className="h-3 w-3" /> Approved
                              </span>
                            ) : (
                              <button
                                onClick={() => {
                                  if (!hasAdminPermission("manageStudents")) {
                                    addToast("Access Denied: You do not possess 'manageStudents' permissions to verify payments.", "error");
                                    return;
                                  }
                                  handleApprovePayment(selectedAdminStudent.id, p.id);
                                }}
                                className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-[10px] uppercase rounded-xl shadow transition cursor-pointer"
                              >
                                Approve Receipt
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-center text-gray-500 text-xs italic py-4">No payments ledger found.</p>
                  )}
                </div>
              </div>

              {/* Footer close */}
              <div className="flex justify-end pt-4 border-t border-gray-800">
                <button
                  type="button"
                  onClick={() => setSelectedAdminStudent(null)}
                  className="px-4 py-2 bg-gray-800 hover:bg-gray-750 text-gray-300 font-bold text-xs uppercase rounded-xl border border-gray-700 cursor-pointer"
                >
                  Close Detail Card
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>

    {/* PRINT SLIP BLOCK (PROFILE TRANSCRIPT LEDGER) */}
    {activePrintJob === 'profile' && loggedInStudent && (
      <div className="printable-content bg-white text-[#0f172a] p-10 max-w-4xl mx-auto border border-gray-200 shadow-none font-sans space-y-8">
        {/* Header section */}
        <div className="flex justify-between items-center border-b-2 border-gray-200 pb-5">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-indigo-900 uppercase">
              GLOBAL COMPUTER CENTER
            </h1>
            <p className="text-xs font-bold text-gray-600">
              In front of Civil Line Petrol Pump
            </p>
            <p className="text-[10px] text-gray-400 font-semibold uppercase leading-none mt-1">
              Authorized IT Education & Career Development Academy
            </p>
          </div>
          <div className="text-right">
            <span className="text-xs font-mono font-bold px-2.5 py-1 bg-indigo-50 text-indigo-800 border border-indigo-200 rounded uppercase">
              Student Ledger Profile
            </span>
            <p className="text-[10px] text-gray-400 mt-1 font-mono">Date: {new Date().toISOString().split('T')[0]}</p>
          </div>
        </div>

        {/* Identity Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          <div className="md:col-span-3 flex justify-center">
            <img 
              src={loggedInStudent.photoUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80"}
              alt={loggedInStudent.name}
              className="h-32 w-32 rounded-xl object-cover border border-gray-250 shadow-sm"
            />
          </div>
          
          <div className="md:col-span-9 grid grid-cols-2 gap-y-4 gap-x-6 text-sm">
            <div>
              <span className="text-gray-400 text-xs font-bold uppercase tracking-wider block">Candidate Name</span>
              <span className="font-extrabold text-slate-800">{loggedInStudent.name}</span>
            </div>
            <div>
              <span className="text-gray-400 text-xs font-bold uppercase tracking-wider block">Course Program</span>
              <span className="font-extrabold text-indigo-900">
                {courses.find(c => c.id === loggedInStudent.courseId)?.name} 
                ({courses.find(c => c.id === loggedInStudent.courseId)?.code})
              </span>
            </div>
            <div>
              <span className="text-gray-400 text-xs font-bold uppercase tracking-wider block">Registration Number</span>
              <span className="font-mono font-bold">{loggedInStudent.regNo}</span>
            </div>
            <div>
              <span className="text-gray-400 text-xs font-bold uppercase tracking-wider block">Roll Number</span>
              <span className="font-mono font-bold">{loggedInStudent.rollNo}</span>
            </div>
            <div>
              <span className="text-gray-400 text-xs font-bold uppercase tracking-wider block">Father's Name</span>
              <span className="font-semibold text-slate-700">Sri. {loggedInStudent.fathersName}</span>
            </div>
            <div>
              <span className="text-gray-400 text-xs font-bold uppercase tracking-wider block">Mother's Name</span>
              <span className="font-semibold text-slate-700">Smt. {loggedInStudent.mothersName}</span>
            </div>
            <div>
              <span className="text-gray-400 text-xs font-bold uppercase tracking-wider block">Email Address</span>
              <span className="font-semibold">{loggedInStudent.email}</span>
            </div>
            <div>
              <span className="text-gray-400 text-xs font-bold uppercase tracking-wider block">Contact Number</span>
              <span className="font-semibold">{loggedInStudent.phone}</span>
            </div>
          </div>
        </div>

        {/* Academic Performance Record */}
        <div className="space-y-3">
          <h3 className="text-xs font-extrabold text-indigo-900 uppercase tracking-widest border-b border-gray-200 pb-1.5 font-mono">
            Academic Progress & Result Sheet
          </h3>
          <div className="grid grid-cols-4 gap-4 text-center text-slate-800">
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Syllabus Progress</span>
              <span className="text-lg font-black text-slate-800">{loggedInStudent.progress}% Complete</span>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Attendance Rate</span>
              <span className="text-lg font-black text-slate-800">
                {Object.keys(loggedInStudent.attendance).length > 0
                  ? Math.round((Object.values(loggedInStudent.attendance).filter(v => v === "Present").length / Object.keys(loggedInStudent.attendance).length) * 100)
                  : 96}% Record
              </span>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Examination Grade</span>
              <span className="text-lg font-black text-indigo-800">{loggedInStudent.examResult.grade} ({loggedInStudent.examResult.percentage}%)</span>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Certification Status</span>
              <span className="text-lg font-black text-emerald-800">{loggedInStudent.status}</span>
            </div>
          </div>
        </div>

        {/* Detailed Examination Marks Split */}
        <div className="space-y-3 pt-2">
          <h3 className="text-xs font-extrabold text-indigo-900 uppercase tracking-widest border-b border-gray-200 pb-1.5 font-mono">
            Semester Transcript Metrics
          </h3>
          <table className="w-full text-left text-xs border border-gray-150 rounded-xl overflow-hidden text-slate-800">
            <thead className="bg-[#f8fafc] border-b border-gray-200 text-slate-600 font-bold">
              <tr>
                <th className="p-2.5">Evaluation Metric</th>
                <th className="p-2 text-center">Max Marks</th>
                <th className="p-2 text-center">Min Passing Marks</th>
                <th className="p-2 text-center">Marks Obtained</th>
                <th className="p-2.5 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-150">
              <tr>
                <td className="p-2.5 font-semibold text-slate-705">Theory Examination Result</td>
                <td className="p-2.5 text-center">100</td>
                <td className="p-2.5 text-center">40</td>
                <td className="p-2.5 text-center font-bold">{loggedInStudent.examResult.theory || "79"}</td>
                <td className="p-2.5 text-right text-emerald-705 font-bold">Passed</td>
              </tr>
              <tr>
                <td className="p-2.5 font-semibold text-slate-705">Practical & Core Labs Exam</td>
                <td className="p-2.5 text-center">100</td>
                <td className="p-2.5 text-center">40</td>
                <td className="p-2.5 text-center font-bold">{loggedInStudent.examResult.practical || "88"}</td>
                <td className="p-2.5 text-right text-emerald-705 font-bold">Passed</td>
              </tr>
              <tr>
                <td className="p-2.5 font-semibold text-slate-705">Class Assignments & Projects</td>
                <td className="p-2 text-center">50</td>
                <td className="p-2 text-center">20</td>
                <td className="p-2.5 text-center font-bold">{loggedInStudent.examResult.assignment || "44"}</td>
                <td className="p-2.5 text-right text-emerald-705 font-bold">Passed</td>
              </tr>
              <tr className="bg-slate-50 font-extrabold">
                <td className="p-2.5">Cumulative Aggregate</td>
                <td className="p-2.5 text-center">250</td>
                <td className="p-2.5 text-center">100</td>
                <td className="p-2.5 text-center text-indigo-900 font-bold">
                  {Number(loggedInStudent.examResult.theory || 79) + Number(loggedInStudent.examResult.practical || 88) + Number(loggedInStudent.examResult.assignment || 44)}
                </td>
                <td className="p-2.5 text-right text-indigo-900 uppercase font-bold text-xs">Grade {loggedInStudent.examResult.grade}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Dynamic Dues statement */}
        <div className="space-y-3 pt-2">
          <h3 className="text-xs font-extrabold text-indigo-900 uppercase tracking-widest border-b border-gray-200 pb-1.5 font-mono">
            Financial Accounts Fee Statement
          </h3>
          <div className="grid grid-cols-3 gap-6 text-sm text-slate-850">
            <div>
              <span className="text-gray-405 text-xs block font-bold uppercase tracking-wider">Total Prescribed Course Fee</span>
              <span className="font-extrabold font-mono text-slate-800">₹{loggedInStudent.totalFees}</span>
            </div>
            <div>
              <span className="text-gray-405 text-xs block font-bold uppercase tracking-wider">Total Fee Amount Cleared</span>
              <span className="font-extrabold text-[#15803d] font-mono">₹{loggedInStudent.paidFees}</span>
            </div>
            <div>
              <span className="text-gray-405 text-xs block font-bold uppercase tracking-wider">Tuition Fee Ledger Dues</span>
              <span className={`font-extrabold font-mono ${loggedInStudent.totalFees - loggedInStudent.paidFees > 0 ? "text-rose-600" : "text-emerald-700"}`}>
                ₹{loggedInStudent.totalFees - loggedInStudent.paidFees}
              </span>
            </div>
          </div>
        </div>

        {/* Verification Footer QR-hash indicator block */}
        <div className="pt-8 border-t border-gray-200 grid grid-cols-2 gap-8 text-xs text-slate-800">
          <div className="space-y-1">
            <span className="text-gray-400 font-bold uppercase block tracking-wider col-span-2">Digital Ledger Verification Key</span>
            <p className="font-mono text-gray-600 leading-none break-all">{loggedInStudent.verificationCode}</p>
            <p className="text-[10px] text-gray-405 italic">Verify code ledger status on desk online portal verification tab.</p>
          </div>
          <div className="text-right flex flex-col justify-end space-y-8 pr-4">
            <span className="font-bold underline text-slate-850">GCC Academic Registrar Officer Signature</span>
            <span className="text-[9px] text-gray-500 italic">Digitally certified record. No physical ink signature required.</span>
          </div>
        </div>
      </div>
    )}

    {/* PRINT SLIP BLOCK (GRADUATES DEPOSIT DIPLOMA CERTIFICATE) */}
    {activePrintJob === 'certificate' && loggedInStudent && (
      <div className="printable-content bg-white p-12 text-black max-w-4xl mx-auto border-8 border-yellow-600 rounded-lg text-center space-y-8 font-sans">
        <div className="space-y-2">
          <h1 className="text-xl font-extrabold tracking-widest text-[#0F0F12]">
            GLOBAL COMPUTER CENTER
          </h1>
          <p className="text-[#a16207] text-xs font-bold uppercase tracking-widest text-center">
            In front of Civil Line Petrol Pump
          </p>
          <p className="text-[10px] text-gray-500 italic font-medium">
            Govt Registration Approved Portfolio Code: GCC-9902
          </p>
        </div>

        <div className="border-t border-b border-gray-300 py-6 my-4 space-y-4">
          <span className="text-lg uppercase tracking-wide text-amber-700 font-extrabold block">
            Graduation Computer Diploma Certificate
          </span>
          <p className="text-sm font-medium leading-relaxed max-w-2xl mx-auto italic">
            This is to verify and certify that candidate <strong className="font-bold">{loggedInStudent.name}</strong> child of Sri. <strong className="font-bold">{loggedInStudent.fathersName}</strong> has successfully completed and graduated the intensive curriculum program package in:
          </p>
          <h3 className="text-[#1e3a8a] text-lg font-black tracking-tight block py-1.5 uppercase font-sans">
            {courses.find(c => c.id === loggedInStudent.courseId)?.name} ({courses.find(c => c.id === loggedInStudent.courseId)?.code})
          </h3>
          <p className="text-xs font-semibold leading-relaxed">
            for the curriculum year ending on verified ledger date: <strong className="font-bold">{loggedInStudent.certificateDate || "2026"}</strong>. Passed examination with aggregate Grade of excellence: <strong className="font-bold">{loggedInStudent.examResult.grade}</strong> ({loggedInStudent.examResult.percentage}%).
          </p>
        </div>

        <div className="grid grid-cols-2 gap-8 text-xs font-medium pt-8">
          <div className="text-left space-y-1 text-slate-800">
            <span className="text-gray-500 block font-bold">Certificate Registration Key:</span>
            <span className="font-mono font-bold tracking-wider">{loggedInStudent.verificationCode}</span>
          </div>
          <div className="text-right space-y-1 text-slate-800">
            <span className="text-gray-500 block font-bold">System Signature Verification:</span>
            <span className="font-bold underline">GCC Academic Registrar Authority</span>
          </div>
        </div>
      </div>
    )}
  </>
);
}
