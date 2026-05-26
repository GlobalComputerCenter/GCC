import React, { useState, useEffect } from "react";
import { BookOpen, Bell, Menu, X, MapPin, Phone, Mail, Award, Lock, ShieldAlert, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  notifications: Array<{ id: string; title: string; content: string; date: string; seen: boolean }>;
  markNotificationsSeen: () => void;
}

export default function Header({ activeTab, setActiveTab, notifications, markNotificationsSeen }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.seen).length;

  const navItems = [
    { id: "home", label: "Home" },
    { id: "courses", label: "Our Courses" },
    { id: "admission", label: "Online Admission" },
    { id: "student-zone", label: "Student Zone" },
    { id: "verification", label: "Verification Desk" },
    { id: "admin-desk", label: "Faculty Admin" }
  ];

  return (
    <header className="w-full bg-[#0F0F12] border-b border-gray-800 sticky top-0 z-50">
      {/* Top Contact & Location Bar */}
      <div className="bg-[#0A0A0B] text-slate-400 text-xs py-2 px-4 md:px-8 flex flex-col md:flex-row md:justify-between items-center gap-2 border-b border-gray-800/40">
        <div className="flex flex-wrap justify-center items-center gap-4 text-center">
          <span className="flex items-center gap-1.5 font-medium">
            <MapPin className="h-3.5 w-3.5 text-indigo-400" />
            In front of Civil Line Petrol Pump
          </span>
          <span className="h-3 w-px bg-gray-800 hidden md:block"></span>
          <span className="flex items-center gap-1.5 font-medium">
            <Phone className="h-3.5 w-3.5 text-emerald-400" />
            +91-9876543210, +91-7409212233
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <Mail className="h-3.5 w-3.5 text-indigo-400" />
            admission@globalcomputercenter.org
          </span>
          <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider animate-pulse">
            Govt Reg. GCC-9902
          </span>
        </div>
      </div>

      {/* Main Header navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        {/* Logo Section */}
        <div 
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => { setActiveTab("home"); setMobileMenuOpen(false); }}
        >
          <div className="h-10 w-10 md:h-11 md:w-11 rounded-xl bg-gradient-to-br from-indigo-600 to-indigo-900 flex items-center justify-center text-white shadow-lg shadow-indigo-500/10 group-hover:scale-105 transition-all">
            <BookOpen className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-base md:text-lg font-bold tracking-tight text-white flex items-center gap-1.5">
              <span>GLOBAL</span>
              <span className="text-indigo-400 font-extrabold text-xs px-1.5 py-0.5 bg-indigo-500/10 border border-indigo-500/20 rounded">GCC</span>
            </h1>
            <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest leading-none mt-0.5">
              Computer Academy
            </p>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1 md:gap-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all relative ${
                activeTab === item.id
                  ? "bg-indigo-600/10 text-indigo-400 border border-indigo-600/20"
                  : "text-gray-400 hover:text-white hover:bg-gray-800/40"
              }`}
            >
              {item.label}
              {activeTab === item.id && (
                <motion.div
                  layoutId="activeTabUnderline"
                  className="absolute bottom-0 left-4 right-4 h-0.5 bg-indigo-500 rounded"
                />
              )}
            </button>
          ))}
        </nav>

        {/* Header Right Tools: Notifications & Quick Enroll button */}
        <div className="flex items-center gap-3">
          {/* Notifications Alerts Bell */}
          <div className="relative">
            <button
              onClick={() => {
                setNotificationsOpen(!notificationsOpen);
                if (!notificationsOpen) markNotificationsSeen();
              }}
              className="p-2.5 text-gray-400 hover:text-white hover:bg-gray-800/40 rounded-xl transition"
              title="Alerts and updates"
            >
              <Bell className="h-4 w-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[9px] h-4.5 w-4.5 rounded-full flex items-center justify-center font-bold border-2 border-[#0F0F12] animate-bounce">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notification Drawer Pop-up modal */}
            <AnimatePresence>
              {notificationsOpen && (
                <>
                  <div className="fixed inset-0 z-40 bg-transparent" onClick={() => setNotificationsOpen(false)}></div>
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-2.5 w-80 md:w-96 bg-[#141417] border border-gray-800 shadow-xl rounded-2xl z-50 overflow-hidden"
                  >
                    <div className="p-4 bg-gradient-to-r from-indigo-950/80 to-[#0F0F12] text-white flex justify-between items-center border-b border-gray-800">
                      <div className="flex items-center gap-2">
                        <Bell className="h-4 w-4 text-indigo-400" />
                        <span className="font-semibold text-sm">System Push Notifications</span>
                      </div>
                      <span className="text-[10px] bg-[#141417] border border-gray-800 px-2 py-0.5 rounded text-indigo-400 font-medium">
                        Real-time
                      </span>
                    </div>

                    <div className="max-h-80 overflow-y-auto divide-y divide-gray-800/60">
                      {notifications.length === 0 ? (
                        <div className="p-8 text-center text-gray-500 text-xs">
                          No recent system alerts at this moment
                        </div>
                      ) : (
                        notifications.map((notif, idx) => (
                          <div key={notif.id} className="p-4 hover:bg-white/5 transition duration-150">
                            <div className="flex gap-2 items-start justify-between">
                              <span className="font-bold text-xs text-gray-200 flex items-center gap-1.5">
                                <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-pulse"></span>
                                {notif.title}
                              </span>
                              <span className="text-[9px] text-gray-500 font-semibold">{notif.date}</span>
                            </div>
                            <p className="text-xs text-slate-400 mt-1 pl-3 leading-relaxed">
                              {notif.content}
                            </p>
                          </div>
                        ))
                      )}
                    </div>

                    <div className="bg-[#0F0F12] p-2.5 text-center border-t border-gray-800">
                      <button 
                        onClick={() => setNotificationsOpen(false)}
                        className="text-indigo-400 hover:text-indigo-300 font-semibold text-xs transition"
                      >
                        Dismiss Alerts Pane
                      </button>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          <button
            onClick={() => setActiveTab("admission")}
            className="hidden sm:inline-flex items-center gap-1.5 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md cursor-pointer transition-all active:scale-95"
          >
            <Award className="h-4 w-4 text-indigo-200" />
            Enroll Now
          </button>

          {/* Toggle Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-800/40 rounded-lg lg:hidden"
            title="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Slide Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t border-gray-800 bg-[#0F0F12]"
          >
            <div className="px-4 py-3 space-y-1.5">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2.5 rounded-xl text-xs uppercase tracking-wider font-semibold transition ${
                    activeTab === item.id
                      ? "text-indigo-400 bg-indigo-600/10 border-l-4 border-indigo-500"
                      : "text-gray-400 hover:bg-gray-800/40 hover:text-white"
                  }`}
                >
                  {item.label}
                </button>
              ))}
              <div className="pt-2 border-t border-gray-800 flex items-center justify-between">
                <button
                  onClick={() => {
                    setActiveTab("admission");
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-center bg-indigo-600 text-white font-bold py-2.5 rounded-xl shadow-md text-xs uppercase tracking-wide cursor-pointer"
                >
                  Apply Online (Admission)
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
