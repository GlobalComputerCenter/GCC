import React from "react";
import { BookOpen, Megaphone, ArrowRight, Award, ShieldCheck, MapPin, Cpu, Clock, HelpCircle } from "lucide-react";
import { Announcement, Course } from "../types";
import { motion } from "motion/react";

interface HomeSectionProps {
  onNavigate: (tab: string) => void;
  announcements: Announcement[];
  courses: Course[];
}

export default function HomeSection({ onNavigate, announcements, courses }: HomeSectionProps) {
  // Stats definitions
  const stats = [
    { value: "14+", label: "Years of Educational Excellence", color: "text-indigo-600 bg-indigo-50" },
    { value: "5000+", label: "Succeeding Board Alumini", color: "text-emerald-600 bg-emerald-50" },
    { value: "100%", label: "Practical Lab Practice Tests", color: "text-amber-600 bg-amber-50" },
    { value: "98.4%", label: "Online Exam Success Ratio", color: "text-purple-600 bg-purple-50" }
  ];

  // Quick Action cards
  const dryActions = [
    {
      title: "Online Live Registrations",
      desc: "Fill simple admission form, pay fees securely via scan QR window, block your slot instantly.",
      actionText: "Open Form",
      targetId: "admission",
      color: "from-blue-500 to-indigo-600"
    },
    {
      title: "Result & Certificate Verification",
      desc: "Verify your enrollment registration or dynamic graduates certificate with GCC ledger system.",
      actionText: "Verify Now",
      targetId: "verification",
      color: "from-slate-700 to-slate-900"
    },
    {
      title: "Personalized Student Login",
      desc: "View daily attendances, syllabus tracking dashboard, marks summary & toggle dual authentication security.",
      actionText: "Sign In Portal",
      targetId: "student-zone",
      color: "from-violet-600 to-emerald-600"
    }
  ];

  return (
    <div className="space-y-12 pb-16 text-gray-200">
      {/* Hero Showcase Block */}
      <section className="relative overflow-hidden rounded-3xl bg-slate-950 text-white shadow-2xl py-14 px-6 md:px-12 lg:px-16 border border-gray-800">
        <div className="absolute inset-0 bg-radial-gradient from-indigo-950/40 via-transparent to-transparent opacity-70"></div>
        
        {/* Animated ambient blob */}
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl"></div>

        <div className="relative max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 backdrop-blur-md rounded-full text-indigo-300 text-xs font-semibold uppercase tracking-wider mb-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Admissions Active for Session 2026-27
          </div>

          <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight md:leading-none">
            GLOBAL <span className="bg-gradient-to-r from-indigo-400 via-sky-400 to-emerald-400 bg-clip-text text-transparent">COMPUTER CENTER</span>
          </h1>
          
          <p className="text-slate-300 max-w-2xl mx-auto text-sm md:text-base font-medium leading-relaxed">
            The prime institute for certified digital computer learning. Located in front of Civil Line Petrol Pump. Level up your skills with NIELIT-CCC, Advance Computer Diplomas, Web Development, and Taxes Ledger Accounting.
          </p>

          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <button
              onClick={() => onNavigate("admission")}
              className="px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold text-sm rounded-xl shadow-lg shadow-indigo-600/30 transition flex items-center gap-2 cursor-pointer"
            >
              Start Admission Now
              <ArrowRight className="h-4 w-4" />
            </button>
            <button
              onClick={() => onNavigate("courses")}
              className="px-6 py-3.5 bg-white/10 hover:bg-white/15 text-white border border-white/20 font-bold text-sm rounded-xl transition backdrop-blur-md flex items-center gap-2 cursor-pointer"
            >
              Explore Computer Courses
              <BookOpen className="h-4 w-4 text-emerald-400" />
            </button>
          </div>
        </div>
      </section>

      {/* Grid Quick Shortcuts and Announcements */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Quick Action Navigation Cards (DCE OSM Alignment) */}
        <div className="lg:col-span-7 space-y-6">
          <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2 pl-1">
            <Cpu className="h-5 w-5 text-indigo-400" />
            Student Quick Desk
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
            {dryActions.map((action, idx) => (
              <div 
                key={idx} 
                className="bg-[#141417] border border-gray-800 hover:border-indigo-500/30 p-5 rounded-2xl shadow-sm hover:shadow-lg transition flex flex-col md:flex-row justify-between items-start md:items-center gap-4 group"
              >
                <div className="space-y-1 md:max-w-md">
                  <h3 className="font-bold text-white group-hover:text-indigo-400 transition flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-indigo-500"></span>
                    {action.title}
                  </h3>
                  <p className="text-gray-400 text-xs leading-relaxed">
                    {action.desc}
                  </p>
                </div>
                <button
                  onClick={() => onNavigate(action.targetId)}
                  className="px-4 py-2.5 bg-gray-800/60 hover:bg-indigo-600 hover:text-white rounded-lg text-xs font-bold text-indigo-400 transition flex items-center gap-1 cursor-pointer shrink-0 border border-gray-700/50"
                >
                  {action.actionText}
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Dynamic Interactive Alert Board / Announcement desk */}
        <div className="lg:col-span-5 flex flex-col">
          <div className="flex items-center justify-between pl-1 mb-4">
            <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
              <Megaphone className="h-5 w-5 text-indigo-400 animate-bounce" />
              Notice & Announcements
            </h2>
            <span className="text-[10px] uppercase font-bold text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2 py-1 rounded-md animate-pulse">
              Live updates
            </span>
          </div>

          <div className="bg-[#141417] border border-gray-800 rounded-3xl p-6 shadow-sm flex-1 flex flex-col justify-between max-h-[360px] overflow-hidden">
            <div className="space-y-4 overflow-y-auto pr-1">
              {announcements.map((ann) => (
                <div 
                  key={ann.id} 
                  className={`p-3.5 rounded-xl border-l-4 text-xs transition ${
                    ann.isImportant 
                      ? "bg-rose-950/20 border-rose-500 text-rose-200" 
                      : "bg-gray-900/40 border-gray-800 text-gray-300"
                  }`}
                >
                  <div className="flex justify-between items-start gap-1 pb-1">
                    <span className="font-bold text-white leading-tight">
                      {ann.title}
                    </span>
                    <span className="text-[9px] text-gray-500 font-medium shrink-0">
                      {ann.date}
                    </span>
                  </div>
                  <p className="text-gray-400 leading-relaxed text-[11px] mt-0.5">
                    {ann.content}
                  </p>
                  <div className="mt-2 flex gap-1.5">
                    <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider ${
                      ann.category === "Exam" ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" :
                      ann.category === "Holiday" ? "bg-blue-500/10 text-blue-400 border border-blue-500/20" :
                      ann.category === "New Course" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
                      "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
                    }`}>
                      {ann.category}
                    </span>
                    {ann.isImportant && (
                      <span className="px-1.5 py-0.5 rounded bg-rose-500/15 text-rose-400 text-[8px] font-bold uppercase tracking-wider animate-pulse border border-rose-500/30">
                        Urgent
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-4 pt-3 border-t border-gray-800 text-center">
              <p className="text-[10px] text-gray-500 font-medium flex items-center justify-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-indigo-400" />
                Timely updates for Civil Line center.
              </p>
            </div>
          </div>
        </div>

      </section>

      {/* Numerical Stats Metrics Block */}
      <section className="bg-[#141417] border border-gray-800 rounded-3xl p-8 shadow-sm">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center divide-y-2 lg:divide-y-0 lg:divide-x divide-gray-800">
          {stats.map((stat, index) => (
            <div key={index} className={`pt-4 lg:pt-0 lg:px-4 space-y-1.5 ${index === 0 ? "pt-0" : ""}`}>
              <div className="text-2.5xl md:text-3.5xl font-black text-white tracking-tight">
                {stat.value}
              </div>
              <div className="text-xs text-gray-400 font-semibold max-w-[170px] mx-auto leading-relaxed">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Brand Mission & Certifications Alignment */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#141417] border border-gray-800 rounded-2xl p-6 space-y-3">
          <div className="h-10 w-10 rounded-xl bg-indigo-505/10 bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center">
            <Award className="h-5 w-5" />
          </div>
          <h3 className="font-bold text-white text-sm">ISO 9001:2015 Approved</h3>
          <p className="text-gray-400 text-xs leading-relaxed">
            All certifications carry standardized serial codes with instant online ledger verification, aligned with national IT curriculums.
          </p>
        </div>

        <div className="bg-[#141417] border border-gray-800 rounded-2xl p-6 space-y-3">
          <div className="h-10 w-10 rounded-xl bg-emerald-600/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <h3 className="font-bold text-white text-sm">Govt Registrations & Validity</h3>
          <p className="text-gray-400 text-xs leading-relaxed">
            Recognized computer certifications helpful in private and public government recruitment vacancies and company documentation portfolios.
          </p>
        </div>

        <div className="bg-[#141417] border border-gray-800 rounded-2xl p-6 space-y-3">
          <div className="h-10 w-10 rounded-xl bg-purple-600/10 text-purple-400 border border-purple-500/20 flex items-center justify-center">
            <MapPin className="h-5 w-5" />
          </div>
          <h3 className="font-bold text-white text-sm">Prime Civil Line Location</h3>
          <p className="text-gray-400 text-xs leading-relaxed">
            Fully high-tech lab networks located in front of Civil Line Petrol Pump, easy to access via all main public transports.
          </p>
        </div>
      </section>

      {/* Real Map and Location Directions Detail Map Card */}
      <section className="bg-[#141417] border border-gray-800 rounded-3xl overflow-hidden shadow-sm grid grid-cols-1 lg:grid-cols-12">
        <div className="p-8 lg:col-span-5 space-y-5 flex flex-col justify-between">
          <div className="space-y-3">
            <span className="text-[10px] font-extrabold uppercase bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2.5 py-1 rounded">
              Contact Desk
            </span>
            <h2 className="text-xl md:text-2xl font-extrabold text-white">
              Visit Global Computer Center
            </h2>
            <p className="text-gray-400 text-xs leading-relaxed">
              Have doubts regarding syllabus modules, fees structures, or mock NIELIT exams schedules? Drop by our Civil Line branch (in front of Petrol Pump) or get in touch through phones instantly. We are open Monday to Saturday, 8:00 AM to 7:00 PM.
            </p>
          </div>

          <div className="space-y-3 border-t border-gray-800 pt-5 text-xs text-gray-300 font-semibold">
            <div className="flex items-start gap-2.5">
              <MapPin className="h-5 w-5 text-rose-400 shrink-0 mt-0.5" />
              <span>
                In front of Civil Line Petrol Pump,<br />
                Civil Line, Bijnor
              </span>
            </div>
            <div className="flex items-center gap-2.5">
              <Clock className="h-5 w-5 text-amber-400 shrink-0" />
              <span>Weekly Academic Hours: Mon-Sat (8 AM to 7 PM)</span>
            </div>
          </div>
        </div>

        {/* Dynamic Map Simulation Display (Beautiful graphic representation of Bijnor location) */}
        <div className="bg-gradient-to-br from-[#0F0F12] to-indigo-950/60 p-6 lg:col-span-7 text-white flex flex-col justify-between relative min-h-[250px] border-l border-gray-800">
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:24px_24px] opacity-40"></div>
          
          <div className="relative z-10 flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-[9px] uppercase tracking-wider font-extrabold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded">
                SIMULATED ROUTE RADAR
              </span>
              <h4 className="font-bold text-sm text-slate-100">Civil Line Node</h4>
            </div>
            <button 
              onClick={() => alert("Direction coordinates shared: civil-line-petrol-pump-gcc")}
              className="text-indigo-400 hover:text-indigo-300 font-bold text-xs bg-white/5 py-1.5 px-3 rounded-lg border border-white/10 transition cursor-pointer"
            >
              Get WhatsApp Directions
            </button>
          </div>

          {/* Graphical Map Representation of Civil Line Bijnor */}
          <div className="relative z-10 my-4 bg-slate-950/80 backdrop-blur border border-white/5 rounded-2xl p-4 space-y-3">
            <div className="flex justify-between text-xs text-gray-500 font-semibold border-b border-white/5 pb-2">
              <span>Main Landmark Locations</span>
              <span>Distance (Approx)</span>
            </div>
            <div className="space-y-2 text-[11px] font-medium">
              <div className="flex justify-between items-center bg-white/5 px-2.5 py-1.5 rounded-lg border border-white/5">
                <span className="flex items-center gap-1.5 text-slate-200">
                  <span className="h-1.5 w-1.5 bg-rose-500 rounded-full animate-pulse"></span>
                  Civil Line Petrol Pump
                </span>
                <span className="text-rose-400 font-bold">In Front (10m)</span>
              </div>
              <div className="flex justify-between items-center bg-white/5 px-2.5 py-1.5 rounded-lg border border-white/5">
                <span className="flex items-center gap-1.5 text-slate-200">
                  <span className="h-1.5 w-1.5 bg-yellow-400 rounded-full"></span>
                  Collectorate Circle Road
                </span>
                <span className="text-yellow-400 font-bold">300 meters</span>
              </div>
              <div className="flex justify-between items-center bg-white/5 px-2.5 py-1.5 rounded-lg border border-white/5">
                <span className="flex items-center gap-1.5 text-slate-200">
                  <span className="h-1.5 w-1.5 bg-blue-400 rounded-full"></span>
                  Bijnor Railway Station
                </span>
                <span className="text-blue-400 font-bold">1.2 kilometers</span>
              </div>
            </div>
          </div>

          <div className="relative z-10 text-[10px] text-indigo-300/80 font-medium flex justify-between items-center">
            <span>Lat/Lon: 29.3732° N, 78.1348° E</span>
            <span>Real-time Ledger Active</span>
          </div>
        </div>
      </section>
    </div>
  );
}
