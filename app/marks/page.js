"use client";

import { useEffect } from "react";
import { useAppStore } from "@/store/useAppStore";
import { getData } from "@/lib/storage";
import { useRouter } from "next/navigation";

// UI
import Card from "@/components/ui/Card";
import SectionTitle from "@/components/ui/SectionTitle";
import GradePredictor from "@/components/GradePredictor";

// Icons
import { BarChart3, Target } from "lucide-react";
import { useState, useRef } from "react";

function ScrollReveal({ children, direction = "left" }) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const translateVal = direction === "left" ? "-60px" : "60px";

  return (
    <div
      ref={ref}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateX(0)" : `translateX(${translateVal})`,
        transition: "opacity 0.9s ease-out, transform 0.9s cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      {children}
    </div>
  );
}

export default function Marks() {
  const router = useRouter();
  const { data, setData } = useAppStore();

  useEffect(() => {
    if (!data) {
      const saved = getData();
      if (saved) setData(saved);
      else router.push("/");
    }
  }, [data, setData, router]);

  const formatNumber = (num) => {
    const n = Number(num) || 0;
    return Number.isInteger(n) ? n : n.toFixed(1);
  };

  const allMarks = data?.marks || [];

  const marksMap = {};
  allMarks.forEach((m) => {
    const key = m.code || m.course_title;
    if (!marksMap[key]) marksMap[key] = [];
    marksMap[key].push(m);
  });

  const marks = Object.values(marksMap).map((group) => {
    const theory = group.find(
      (g) => g.course_type !== "Practical"
    );
    return theory || group[0];
  });

  if (!data) {
    return (
      <div className="p-4 md:p-6 min-h-screen bg-transparent">
        Loading marks...
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 bg-transparent min-h-screen">

      {/* HEADER */}
      <div className="flex items-center gap-2 mb-6">
        <BarChart3 className="w-5 h-5" style={{ color: "var(--accent-fg)" }} />
        <h1 className="text-xl md:text-2xl font-semibold tracking-tight" style={{ color: "var(--accent-fg)", textShadow: "0 2px 10px rgba(255,255,255,0.1)" }}>
          Marks Overview
        </h1>
      </div>

      {marks.length === 0 && (
        <div className="text-gray-500">
          No marks data available
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">

        {marks.map((m, i) => {

          let totalObtained = 0;
          let totalMax = 0;

          (m.tests || []).forEach((t) => {
            totalObtained += Number(t.obtained) || 0;
            totalMax += Number(t.max) || 0;
          });

          const percent =
            totalMax > 0
              ? formatNumber((totalObtained / totalMax) * 100)
              : 0;

          const title = m.course_title || "";
          const code = m.code || "";

          const isSame =
            title.trim().toLowerCase() === code.trim().toLowerCase();

          const displayTitle =
            !title || isSame
              ? code || "Unknown Subject"
              : title;

          return (
            <ScrollReveal key={i} direction={i % 2 === 0 ? "left" : "right"}>
              <Card>

                {/* HEADER ROW */}
              <div className="flex justify-between items-start gap-3">

                {/* LEFT */}
                <div className="flex-1 min-w-0">
                  <SectionTitle className="break-words">
                    {displayTitle}
                  </SectionTitle>

                  {!isSame && code && (
                    <p className="text-xs md:text-sm text-gray-500 mt-1">
                      {code}
                    </p>
                  )}
                </div>

                {/* 🔥 PREMIUM TARGET CONTROL */}
                <div className="shrink-0">
                  <GradePredictor tests={m.tests} />
                </div>

              </div>

              {/* TESTS */}
              <div className="mt-4 space-y-2 text-xs md:text-sm">

                {(m.tests || []).length === 0 && (
                  <p className="text-gray-400">
                    No marks available
                  </p>
                )}

                {(m.tests || []).map((t, idx) => (
                <div
                  key={idx}
                  className={`flex justify-between items-center pb-1 ${
                    idx !== (m.tests.length - 1)
                      ? "border-b border-gray-200"
                      : ""
                  }`}
                >
                  <span className="font-medium" style={{ color: "var(--text)" }}>
                    {t.name}
                  </span>

                  <span style={{ color: "var(--muted)" }}>
                    {formatNumber(t.obtained)} / {formatNumber(t.max)}
                  </span>
                </div>
              ))}

              </div>

              {/* 🔥 GRAPH (MOVED HERE) */}
              <div className="mt-4 pt-3 border-t">

                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs text-gray-500">
                    Performance
                  </span>
                  <span className="text-sm font-semibold" style={{ color: "var(--accent)" }}>
                    {percent}%
                  </span>
                </div>

                <div className="w-full h-2 rounded-full overflow-hidden" style={{ backgroundColor: "rgba(255, 255, 255, 0.15)" }}>
                  <div
                    className="h-full transition-all duration-500"
                    style={{ width: `${percent}%`, backgroundColor: "var(--accent)" }}
                  />
                </div>

              </div>

              {/* TOTAL */}
              <div className="mt-4 pt-3 border-t text-center">

                <div className="text-xl md:text-2xl font-semibold">
                  {formatNumber(totalObtained)} /{" "}
                  {formatNumber(totalMax)}
                </div>

                <div className="text-sm text-gray-500 mt-1">
                  Overall Score
                </div>

              </div>

              </Card>
            </ScrollReveal>
          );
        })}
      </div>
    </div>
  );
}