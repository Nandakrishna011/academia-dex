"use client";

import { useEffect, useMemo } from "react";
import { useAppStore } from "@/store/useAppStore";
import { getData } from "@/lib/storage";
import { useRouter } from "next/navigation";

import Card from "@/components/ui/Card";
import { User, Mail, Phone } from "lucide-react";
import { BookOpen, BarChart3, XCircle, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function Dashboard() {
  const router = useRouter();
  const { data, setData } = useAppStore();

  useEffect(() => {
    if (!data) {
      const saved = getData();
      if (saved) setData(saved);
      else router.push("/");
    }
  }, [data, setData, router]);

  if (!data) return <div className="p-6">Loading...</div>;

  /* ---------- HELPERS ---------- */
  const round1 = (val) => Number(val || 0).toFixed(1);

  /* ---------- DATA ---------- */
  const student = data.student || {};
  const marks = data.marks || [];
  const raw = data.raw || {};

  const attendanceSummary = raw?.attendance?.attendance || {};

  const overallAttendance = Number(
    attendanceSummary?.overall_attendance || 0
  );

  const totalConducted = Number(
    attendanceSummary?.total_hours_conducted || 0
  );

  const totalAbsent = Number(
    attendanceSummary?.total_hours_absent || 0
  );

  const totalPresent = useMemo(
    () => totalConducted - totalAbsent,
    [totalConducted, totalAbsent]
  );

  const marksSummary = useMemo(() => {
    let obtained = 0;
    let max = 0;

    marks.forEach((m) => {
      (m.tests || []).forEach((t) => {
        obtained += Number(t.obtained || 0);
        max += Number(t.max || 0);
      });
    });

    const percent = max > 0 ? (obtained / max) * 100 : 0;

    return { obtained, max, percent };
  }, [marks]);

  const facultyAdvisor =
    raw?.timetable?.advisors?.faculty_advisor || {};

  const academicAdvisor =
    raw?.timetable?.advisors?.academic_advisor || {};

  /* ---------- CIRCLE COMPONENT ---------- */
  const Circle = ({ value }) => {
    const radius = 45;
    const stroke = 6;
    const normalizedRadius = radius - stroke * 2;
    const circumference = normalizedRadius * 2 * Math.PI;

    const strokeDashoffset =
      circumference - (value / 100) * circumference;

    return (
      <div className="relative w-[110px] h-[110px]">
        <svg height="110" width="110">
          <circle
            stroke="rgba(255, 255, 255, 0.15)"
            fill="transparent"
            strokeWidth={stroke}
            r={normalizedRadius}
            cx="55"
            cy="55"
          />
          <circle
            stroke="var(--accent)"
            fill="transparent"
            strokeWidth={stroke}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            r={normalizedRadius}
            cx="55"
            cy="55"
            style={{
              transform: "rotate(-90deg)",
              transformOrigin: "50% 50%",
            }}
          />
        </svg>

        <div className="absolute inset-0 flex items-center justify-center font-semibold">
          {round1(value)}%
        </div>
      </div>
    );
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="p-4 md:p-6 space-y-6 bg-transparent min-h-screen"
    >

      {/* 👤 PROFILE */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card className="p-5 space-y-2">
        <h2 className="text-2xl font-bold">
          {student.name || "N/A"}
        </h2>

        <p className="text-sm" style={{ color: "var(--muted)" }}>
          {student.registration_number || "N/A"}
        </p>

        <div className="flex flex-wrap gap-2 pt-2">
          <span className="px-3 py-1 text-xs rounded-full" style={{ backgroundColor: "rgba(255, 255, 255, 0.1)", color: "var(--text)" }}>
            {student.department || "N/A"}
          </span>
          <span className="px-3 py-1 text-xs rounded-full" style={{ backgroundColor: "rgba(255, 255, 255, 0.1)", color: "var(--text)" }}>
            {student.specialization || "N/A"}
          </span>
          <span className="px-3 py-1 text-xs rounded-full" style={{ backgroundColor: "rgba(255, 255, 255, 0.1)", color: "var(--text)" }}>
            Sem {student.semester || "N/A"}
          </span>
        </div>
      </Card>
      </motion.div>

      {/* 📊 GRAPH + DETAILS GRID */}
      <div className="grid grid-cols-2 gap-3">

        {/* Attendance Graph */}
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.4, delay: 0.2 }}
        >
        <Card className="h-full p-4 flex flex-col items-center justify-center aspect-square hover:shadow-md transition">
          <p className="text-xs mb-2 uppercase tracking-wide" style={{ color: "var(--muted)", filter: "brightness(0.8)" }}>
            Attendance
          </p>
          <div className="flex-1 flex items-center justify-center">
            <Circle value={overallAttendance} />
          </div>
        </Card>
        </motion.div>

        {/* Marks Graph */}
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.4, delay: 0.3 }}
        >
        <Card className="h-full p-4 flex flex-col items-center justify-center aspect-square hover:shadow-md transition">
          <p className="text-xs mb-2 uppercase tracking-wide" style={{ color: "var(--muted)", filter: "brightness(0.8)" }}>
            Marks
          </p>
          <div className="flex-1 flex items-center justify-center">
            <Circle value={marksSummary.percent} />
          </div>
        </Card>
        </motion.div>

        {/* Attendance Details */}
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.4, delay: 0.4 }}
        >
        <Card className="h-full p-3 flex flex-col justify-center aspect-square hover:shadow-md transition">

          <p className="text-xs mb-2 uppercase tracking-wide" style={{ color: "var(--muted)", filter: "brightness(0.8)" }}>
            Attendance
          </p>

          <div className="space-y-2 text-sm">

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2" style={{ color: "var(--muted)" }}>
                <CheckCircle size={13} />
                <span>Present</span>
              </div>
              <span className="font-semibold w-[50px] text-right" style={{ color: "var(--text)" }}>
                {round1(totalPresent)}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2" style={{ color: "var(--muted)" }}>
                <BarChart3 size={13} />
                <span>Total</span>
              </div>
              <span className="font-semibold w-[50px] text-right" style={{ color: "var(--text)" }}>
                {round1(totalConducted)}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2" style={{ color: "var(--muted)" }}>
                <XCircle size={13} />
                <span>Absent</span>
              </div>
              <span className="font-semibold w-[50px] text-right" style={{ color: "var(--text)" }}>
                {round1(totalAbsent)}
              </span>
            </div>

          </div>

        </Card>
        </motion.div>

        {/* Marks Details */}
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.4, delay: 0.5 }}
        >
        <Card className="h-full p-3 flex flex-col justify-center items-center text-center aspect-square hover:shadow-md transition">

          <p className="text-xs mb-2 uppercase tracking-wide" style={{ color: "var(--muted)", filter: "brightness(0.8)" }}>
            Marks
          </p>

          <div className="flex items-center gap-2 text-sm mb-2" style={{ color: "var(--muted)" }}>
            <BookOpen size={14} />
            <span>Score</span>
          </div>

          {/* 🔥 moved below & centered */}
          <div className="w-full flex justify-center">
            <p className="font-semibold text-base text-center">
              {round1(marksSummary.obtained)} / {round1(marksSummary.max)}
            </p>
          </div>

        </Card>
        </motion.div>

      </div>

      {/* 👨‍🏫 FACULTY */}
      <div className="grid grid-cols-1 gap-4">

        {/* Faculty Advisor */}
        <motion.div
           initial={{ opacity: 0, x: -20 }}
           animate={{ opacity: 1, x: 0 }}
           transition={{ duration: 0.4, delay: 0.6 }}
        >
        <Card className="p-4 flex flex-col justify-between hover:shadow-md transition">

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center shadow-inner" style={{ backgroundColor: "rgba(255, 255, 255, 0.1)", color: "var(--text)" }}>
              <User size={18} />
            </div>

            <div>
              <p className="text-xs" style={{ color: "var(--muted)" }}>
                Faculty Advisor
              </p>
              <p className="font-semibold text-sm" style={{ color: "var(--text)" }}>
                {facultyAdvisor.name || "N/A"}
              </p>
            </div>
          </div>

          <div className="mt-3 text-sm space-y-1" style={{ color: "var(--muted)", opacity: 0.8 }}>

            <div className="flex items-center gap-2">
              <Mail size={14} />
              <span>{facultyAdvisor.email || "N/A"}</span>
            </div>

            <div className="flex items-center gap-2">
              <Phone size={14} />
              <span>{facultyAdvisor.phone || "N/A"}</span>
            </div>

          </div>

        </Card>
        </motion.div>

        {/* Academic Advisor */}
        <motion.div
           initial={{ opacity: 0, x: -20 }}
           animate={{ opacity: 1, x: 0 }}
           transition={{ duration: 0.4, delay: 0.7 }}
        >
        <Card className="p-4 flex flex-col justify-between hover:shadow-md transition">

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center shadow-inner" style={{ backgroundColor: "rgba(255, 255, 255, 0.1)", color: "var(--text)" }}>
              <User size={18} />
            </div>

            <div>
              <p className="text-xs" style={{ color: "var(--muted)" }}>
                Academic Advisor
              </p>
              <p className="font-semibold text-sm" style={{ color: "var(--text)" }}>
                {academicAdvisor.name || "N/A"}
              </p>
            </div>
          </div>

          <div className="mt-3 text-sm space-y-1" style={{ color: "var(--muted)", opacity: 0.8 }}>

            <div className="flex items-center gap-2">
              <Mail size={14} />
              <span>{academicAdvisor.email || "N/A"}</span>
            </div>

            <div className="flex items-center gap-2">
              <Phone size={14} />
              <span>{academicAdvisor.phone || "N/A"}</span>
            </div>

          </div>

        </Card>
        </motion.div>

      </div>

    </motion.div>
  );
}