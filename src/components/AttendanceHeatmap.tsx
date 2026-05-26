import React, { useState } from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell, Legend } from "recharts";
import { Calendar, HelpCircle, CheckCircle, AlertTriangle, XCircle, Info, Sparkles, ChevronLeft, ChevronRight } from "lucide-react";

interface AttendanceHeatmapProps {
  attendanceData: Record<string, "Present" | "Absent" | "Leave">;
}

export default function AttendanceHeatmap({ attendanceData }: AttendanceHeatmapProps) {
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth()); // 0-indexed (0 = Jan, 11 = Dec)
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // Helper: Get days in selected month
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOffset = (year: number, month: number) => {
    // 0 = Sunday, 1 = Monday, etc.
    const day = new Date(year, month, 1).getDay();
    return day === 0 ? 6 : day - 1; // Align Mon-Sun grid format (Mon=0, Sun=6)
  };

  const totalDays = getDaysInMonth(selectedYear, selectedMonth);
  const firstDayOffset = getFirstDayOffset(selectedYear, selectedMonth);

  // Generate date array for the month grid
  const daysArray: { dateString: string; dayNumber: number; status: "Present" | "Absent" | "Leave" | "None" }[] = [];

  // Add spacers for calendar grid offset
  for (let i = 0; i < firstDayOffset; i++) {
    daysArray.push({ dateString: "empty-" + i, dayNumber: 0, status: "None" });
  }

  for (let d = 1; d <= totalDays; d++) {
    const formattedDate = `${selectedYear}-${String(selectedMonth + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    const status = attendanceData[formattedDate] || "None";
    daysArray.push({
      dateString: formattedDate,
      dayNumber: d,
      status
    });
  }

  // Count metrics for current selected month
  let presentCount = 0;
  let absentCount = 0;
  let leaveCount = 0;
  let totalActive = 0;

  daysArray.forEach((item) => {
    if (item.dayNumber > 0) {
      if (item.status === "Present") {
        presentCount++;
        totalActive++;
      } else if (item.status === "Absent") {
        absentCount++;
        totalActive++;
      } else if (item.status === "Leave") {
        leaveCount++;
        totalActive++;
      }
    }
  });

  const monthAttendanceRatio = totalActive > 0 ? Math.round((presentCount / totalActive) * 100) : 100;

  // Let's create Recharts aggregate weekly summary data
  // Group days of the month into 4 weeks
  const weekData = [
    { name: "Week 1", Present: 0, Absent: 0, Leave: 0 },
    { name: "Week 2", Present: 0, Absent: 0, Leave: 0 },
    { name: "Week 3", Present: 0, Absent: 0, Leave: 0 },
    { name: "Week 4", Present: 0, Absent: 0, Leave: 0 },
    { name: "Week 5+", Present: 0, Absent: 0, Leave: 0 }
  ];

  daysArray.forEach((item) => {
    if (item.dayNumber > 0 && item.status !== "None") {
      const weekIndex = Math.min(Math.floor((item.dayNumber - 1) / 7), 4);
      if (item.status === "Present") weekData[weekIndex].Present++;
      else if (item.status === "Absent") weekData[weekIndex].Absent++;
      else if (item.status === "Leave") weekData[weekIndex].Leave++;
    }
  });

  const prevMonth = () => {
    if (selectedMonth === 0) {
      setSelectedMonth(11);
      setSelectedYear((y) => y - 1);
    } else {
      setSelectedMonth((m) => m - 1);
    }
  };

  const nextMonth = () => {
    if (selectedMonth === 11) {
      setSelectedMonth(0);
      setSelectedYear((y) => y + 1);
    } else {
      setSelectedMonth((m) => m + 1);
    }
  };

  const getDayColorClass = (status: "Present" | "Absent" | "Leave" | "None", isDummy: boolean) => {
    if (isDummy) return "bg-transparent border-none";
    switch (status) {
      case "Present":
        return "bg-emerald-500 hover:bg-emerald-400 border border-emerald-600 shadow-[0_0_8px_rgba(16,185,129,0.3)]";
      case "Absent":
        return "bg-rose-500 hover:bg-rose-400 border border-rose-600 shadow-[0_0_8px_rgba(239,68,68,0.3)]";
      case "Leave":
        return "bg-amber-500 hover:bg-amber-400 border border-amber-600 shadow-[0_0_8px_rgba(245,158,11,0.3)]";
      default:
        return "bg-gray-900 border border-gray-800 hover:border-gray-700 hover:bg-gray-850/60";
    }
  };

  return (
    <div className="space-y-6">
      {/* Dynamic Header Picker */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gray-950/40 p-4 border border-gray-800/80 rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-indigo-400">
            <Calendar className="h-5 w-5" />
          </div>
          <div>
            <h5 className="font-bold text-white text-sm">Monthly Attendance Grid Heatmap</h5>
            <p className="text-[10.5px] text-gray-400">
              Interactive D3-style day density logs with Recharts weekly aggregates.
            </p>
          </div>
        </div>

        {/* Month controller */}
        <div className="flex items-center gap-2 self-stretch sm:self-auto justify-between bg-gray-950 border border-gray-850 rounded-xl p-1 shrink-0">
          <button
            type="button"
            onClick={prevMonth}
            className="p-1.5 hover:bg-gray-900 rounded-lg text-gray-400 hover:text-white transition cursor-pointer"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="text-xs font-bold text-white px-3 tracking-wide">
            {monthNames[selectedMonth]} {selectedYear}
          </span>
          <button
            type="button"
            onClick={nextMonth}
            className="p-1.5 hover:bg-gray-900 rounded-lg text-gray-400 hover:text-white transition cursor-pointer"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* HEATMAP CORE (Left 7 cols) */}
        <div className="lg:col-span-7 bg-[#0b0b0d]/50 border border-gray-850/70 rounded-2.5xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-gray-800/60 pb-3">
            <span className="text-xs font-bold text-gray-200 uppercase tracking-widest font-mono">D3 Activity Matrix</span>
            <div className="flex gap-2.5 items-center text-[10px] text-gray-400 font-medium">
              <span className="flex items-center gap-1">
                <span className="h-2 w-2 rounded bg-emerald-500"></span> Present
              </span>
              <span className="flex items-center gap-1">
                <span className="h-2 w-2 rounded bg-rose-500"></span> Absent
              </span>
              <span className="flex items-center gap-1">
                <span className="h-2 w-2 rounded bg-amber-500"></span> Leave
              </span>
            </div>
          </div>

          {/* Calendar Heatmap Grid */}
          <div className="space-y-1 select-none">
            {/* Days indicator row */}
            <div className="grid grid-cols-7 text-center text-[9px] font-bold text-gray-500 uppercase tracking-wider mb-2 font-mono">
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
              <span>Sun</span>
            </div>

            {/* Boxes blocks */}
            <div className="grid grid-cols-7 gap-2.5">
              {daysArray.map((dayItem, index) => {
                const isDummy = dayItem.dayNumber === 0;
                return (
                  <div
                    key={dayItem.dateString + "-" + index}
                    className={`aspect-square rounded-lg flex flex-col justify-center items-center transition-all duration-300 relative group cursor-help ${getDayColorClass(
                      dayItem.status,
                      isDummy
                    )}`}
                  >
                    {!isDummy && (
                      <>
                        <span className={`text-[10px] font-bold font-mono ${
                          dayItem.status !== "None" ? "text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]" : "text-gray-400"
                        }`}>
                          {dayItem.dayNumber}
                        </span>

                        {/* Beautiful D3 interactive Hover Tooltip */}
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:flex flex-col items-center z-55 pointer-events-none scale-95 origin-bottom group-hover:scale-100 transition whitespace-nowrap">
                          <div className="bg-gray-950/95 border border-indigo-500/40 text-white rounded-xl py-2 px-3 shadow-2xl space-y-1.5 text-left text-[10px]">
                            <div className="flex items-center gap-1.5 font-bold">
                              <span className="text-gray-300">Date:</span>
                              <span className="text-indigo-400 font-mono">{dayItem.dateString}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-gray-400">Class State:</span>
                              <span className={`font-extrabold uppercase ${
                                dayItem.status === "Present" ? "text-emerald-400" :
                                dayItem.status === "Absent" ? "text-rose-400" :
                                dayItem.status === "Leave" ? "text-amber-400" :
                                "text-gray-500"
                              }`}>
                                {dayItem.status === "None" ? "Unrecorded / No Lecture" : dayItem.status}
                              </span>
                            </div>
                            {dayItem.status === "Present" && (
                              <p className="text-[9px] text-emerald-400/90 italic">
                                ✓ Certified with CCTV ID verification.
                              </p>
                            )}
                          </div>
                          {/* Triangle Arrow */}
                          <div className="w-2 h-2 bg-gray-950 border-r border-b border-indigo-500/40 rotate-45 -mt-1"></div>
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Informational Note */}
          <div className="flex gap-2 items-start bg-indigo-950/20 border border-indigo-500/10 rounded-xl p-3 text-[10px] text-indigo-300">
            <Info className="h-4 w-4 shrink-0 text-indigo-400" />
            <p className="leading-relaxed">
              <strong>Interactive Tip:</strong> Click/hover over any day box in the activity grid to verify exact faculty sign-off, or navigate months to audit active log history.
            </p>
          </div>
        </div>

        {/* METRIC TRENDS (Right 5 cols) */}
        <div className="lg:col-span-5 bg-[#0b0b0d]/50 border border-gray-850/70 rounded-2.5xl p-5 flex flex-col justify-between space-y-5">
          <div className="border-b border-gray-800/60 pb-3">
            <span className="text-xs font-bold text-gray-200 uppercase tracking-widest font-mono">Monthly Aggregate Compliance</span>
          </div>

          {/* Micro stats grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-gray-900/40 border border-gray-800/60 rounded-xl space-y-1">
              <span className="text-[9px] font-bold text-gray-500 uppercase tracking-wider font-mono">Month's Ratio</span>
              <p className="text-xl font-black text-white">{monthAttendanceRatio}%</p>
              <div className="h-1 w-full bg-gray-855 rounded-full overflow-hidden">
                <div
                  className={`h-full ${monthAttendanceRatio >= 75 ? "bg-emerald-500" : "bg-rose-500"}`}
                  style={{ width: `${monthAttendanceRatio}%` }}
                ></div>
              </div>
            </div>

            <div className="p-3 bg-gray-900/40 border border-gray-800/60 rounded-xl space-y-1">
              <span className="text-[9px] font-bold text-gray-500 uppercase tracking-wider font-mono">Total Lectures</span>
              <p className="text-xl font-black text-white">{totalActive}</p>
              <span className="text-[8.5px] text-gray-500 font-semibold block">In {monthNames[selectedMonth]}</span>
            </div>
          </div>

          {/* Recharts Analytics Bar Graph */}
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block font-mono">Weekly Analytics Summary</span>
            <div className="h-[120px] w-full text-xs">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={weekData}
                  margin={{ top: 5, right: 5, left: -25, bottom: 5 }}
                >
                  <XAxis dataKey="name" stroke="#6b7280" fontSize={9} />
                  <YAxis stroke="#6b7280" fontSize={9} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{ background: "#09090b", borderColor: "#1f2937", borderRadius: "10px", fontSize: "10px" }}
                    itemStyle={{ color: "#fff" }}
                  />
                  <Bar dataKey="Present" fill="#10b981" radius={[3, 3, 0, 0]} stackId="statusStack" />
                  <Bar dataKey="Leave" fill="#f59e0b" radius={[3, 3, 0, 0]} stackId="statusStack" />
                  <Bar dataKey="Absent" fill="#ef4444" radius={[3, 3, 0, 0]} stackId="statusStack" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="pt-3 border-t border-gray-800/50 flex justify-between items-center text-[10px] text-gray-400">
            <span className="flex items-center gap-1">
              <CheckCircle className="h-3 w-3 text-emerald-400" /> {presentCount} Present
            </span>
            <span className="flex items-center gap-1">
              <AlertTriangle className="h-3 w-3 text-amber-400" /> {leaveCount} Leave
            </span>
            <span className="flex items-center gap-1">
              <XCircle className="h-3 w-3 text-rose-400" /> {absentCount} Absent
            </span>
          </div>

        </div>

      </div>
    </div>
  );
}
