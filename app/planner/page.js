"use client";

import { useState, useEffect, useRef } from "react";
import plannerData from "@/data/planner.json";

import Card from "@/components/ui/Card";
import SectionTitle from "@/components/ui/SectionTitle";

export default function Planner() {
  const yearData = plannerData["2026"] || {};
  const months = Object.keys(yearData);

  const today = new Date();

  const currentMonthName = today.toLocaleString("default", {
    month: "long",
  });

  const initialMonth = months.includes(currentMonthName)
    ? currentMonthName
    : months[0];

  const [selectedMonth, setSelectedMonth] = useState(initialMonth);

  const days = yearData[selectedMonth] || [];
  const todayStr = today.toISOString().split("T")[0];

  const todayRef = useRef(null);

  /* ✅ FIX: REAL mobile viewport height */
  useEffect(() => {
    const setVH = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    };

    setVH();
    window.addEventListener("resize", setVH);

    return () => window.removeEventListener("resize", setVH);
  }, []);

  /* scroll to today */
  useEffect(() => {
    if (todayRef.current) {
      todayRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [selectedMonth]);

  return (
    <div
      className="w-full bg-transparent overflow-x-hidden relative"
      style={{ minHeight: "calc(var(--vh, 1vh) * 100)" }}
    >
      {/* Container */}
      <div className="max-w-screen-xl mx-auto p-4 md:p-6 pb-28">

        {/* Header */}
        <h1 className="text-lg md:text-2xl font-bold mb-4 break-words" style={{ color: "var(--accent-fg)", textShadow: "0 2px 10px rgba(255,255,255,0.1)" }}>
          Academic Planner 2026
        </h1>

        {/* Legend */}
        <div className="flex flex-wrap gap-2 text-xs mb-4">
          <span className="px-2 py-1 rounded-full shadow-sm" style={{ backgroundColor: "rgba(239, 68, 68, 0.2)", color: "#fca5a5" }}>
            Holiday
          </span>
          <span className="px-2 py-1 rounded-full shadow-sm" style={{ backgroundColor: "rgba(59, 130, 246, 0.2)", color: "#93c5fd" }}>
            Event
          </span>
          <span className="px-2 py-1 rounded-full shadow-sm" style={{ backgroundColor: "rgba(34, 197, 94, 0.2)", color: "#86efac" }}>
            Day Order
          </span>
          <span className="px-2 py-1 rounded-full shadow-sm font-semibold" style={{ backgroundColor: "var(--accent)", color: "var(--bg)" }}>
            Today
          </span>
        </div>

        {/* Month Selector */}
        <div className="sticky top-0 z-10 bg-transparent pb-2">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {months.map((month) => (
              <button
                key={month}
                onClick={() => setSelectedMonth(month)}
                className="px-3 py-1.5 rounded-full text-sm whitespace-nowrap flex-shrink-0 transition-all shadow-sm border border-transparent"
                style={{
                  backgroundColor: selectedMonth === month ? "var(--accent)" : "rgba(10,10,10,0.5)",
                  color: selectedMonth === month ? "var(--bg)" : "var(--text)",
                  borderColor: selectedMonth === month ? "transparent" : "rgba(255,255,255,0.1)"
                }}
              >
                {month}
              </button>
            ))}
          </div>
        </div>

        {/* Calendar */}
        <div className="w-full mt-3">
          <Card>
            <SectionTitle>{selectedMonth}</SectionTitle>

            {days.length === 0 ? (
              <p className="text-gray-500">No data available</p>
            ) : (
              <div
                className="
                  grid gap-3 w-full
                  grid-cols-2
                  sm:grid-cols-3
                  md:grid-cols-4
                  lg:grid-cols-5
                  xl:grid-cols-7
                "
              >
                {days.map((d) => {
                  const isHoliday = !!d.holiday;
                  const isEvent = !!d.event;

                  const dateObj = new Date(d.date);
                  const dayNumber = dateObj.getDate();

                  const isToday = d.date === todayStr;

                  let boxStyle = { backgroundColor: "rgba(255,255,255,0.03)", borderColor: "rgba(255,255,255,0.1)", color: "var(--text)" };

                  if (isHoliday) {
                    boxStyle.backgroundColor = "rgba(239, 68, 68, 0.15)";
                    boxStyle.borderColor = "rgba(239, 68, 68, 0.3)";
                  } else if (isEvent) {
                    boxStyle.backgroundColor = "rgba(59, 130, 246, 0.15)";
                    boxStyle.borderColor = "rgba(59, 130, 246, 0.3)";
                  } else if (d.dayOrder) {
                    boxStyle.backgroundColor = "rgba(34, 197, 94, 0.1)";
                    boxStyle.borderColor = "rgba(34, 197, 94, 0.3)";
                  }

                  if (isToday) {
                    boxStyle.borderColor = "var(--accent)";
                    boxStyle.boxShadow = "0 0 10px var(--accent)";
                  }

                  return (
                    <div
                      key={d.date}
                      ref={isToday ? todayRef : null}
                      className="p-3 rounded-xl border text-sm transition min-w-0 break-words overflow-hidden"
                      style={boxStyle}
                    >
                      {/* Top Row */}
                      <div className="flex justify-between items-center gap-1">
                        <span className="font-semibold text-base">
                          {dayNumber}
                        </span>

                        <span className="text-[10px] truncate" style={{ color: "var(--muted)" }}>
                          {d.day}
                        </span>
                      </div>

                      {/* Day Order */}
                      {d.dayOrder && (
                        <div className="mt-1 text-green-700 font-medium text-xs break-words">
                          Day {d.dayOrder}
                        </div>
                      )}

                      {/* Holiday */}
                      {d.holiday && (
                        <div className="mt-1 text-red-600 text-xs break-words">
                          {d.holiday}
                        </div>
                      )}

                      {/* Event */}
                      {d.event && (
                        <div className="mt-1 text-blue-600 text-xs break-words">
                          {d.event}
                        </div>
                      )}

                      {/* Today Badge */}
                      {isToday && (
                        <div 
                          className="mt-2 text-[10px] font-bold px-2 py-0.5 rounded text-center shadow-sm"
                          style={{ backgroundColor: "var(--accent)", color: "var(--accent-fg)" }}
                        >
                          TODAY
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}