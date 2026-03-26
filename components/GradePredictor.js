"use client";

import { useState, useRef, useEffect } from "react";
import { predictGrade } from "@/lib/grade";
import { Target, X } from "lucide-react";

const grades = ["O", "A+", "A", "B+", "B", "C"];

export default function GradePredictor({ tests }) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [result, setResult] = useState(null);

  const ref = useRef();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  let obtained = 0;
  let currentMax = 0;

  (tests || []).forEach((t) => {
    obtained += Number(t.obtained) || 0;
    currentMax += Number(t.max) || 0;
  });

  const handleSelect = (grade) => {
    setSelected(grade);

    const res = predictGrade({
      obtained,
      currentMax,
      targetGrade: grade,
    });

    setResult(res);
  };

  return (
    <div className="relative" ref={ref}>
      {/* 🔥 TRIGGER */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-3 py-1.5 
        text-xs font-medium border border-transparent rounded-lg 
        transition-all duration-200 shadow-sm"
        style={{ 
          color: "var(--text)", 
          backgroundColor: open ? "var(--accent)" : "rgba(10, 10, 10, 0.45)", 
          borderColor: open ? "transparent" : "rgba(255, 255, 255, 0.1)" 
        }}
      >
        <Target className="w-4 h-4" />
        Target
      </button>

      {/* 🔥 PANEL */}
      {open && (
        <div 
          className="absolute right-0 mt-2 w-64 border rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.37)] backdrop-blur-md p-4 z-10"
          style={{ 
            backgroundColor: "rgba(10, 10, 10, 0.8)", 
            borderColor: "color-mix(in srgb, var(--accent) 30%, rgba(255, 255, 255, 0.1))" 
          }}
        >

          {/* HEADER */}
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-sm font-semibold" style={{ color: "var(--text)" }}>
              Target Grade
            </h3>

            <button
              onClick={() => setOpen(false)}
              className="p-1 rounded-md transition"
              style={{ color: "var(--muted)" }}
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* HELPER */}
          <p className="text-xs mb-4 leading-relaxed" style={{ color: "rgba(255,255,255,0.6)" }}>
            Choose a grade to see the marks required in upcoming tests.
          </p>

          {/* GRADES */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            {grades.map((g) => {
              const isActive = selected === g;

              return (
                <button
                  key={g}
                  onClick={() => handleSelect(g)}
                  className="text-xs py-1.5 rounded-md border transition-all duration-150"
                  style={{
                    backgroundColor: isActive ? "var(--accent)" : "rgba(255,255,255,0.05)",
                    borderColor: isActive ? "var(--accent)" : "rgba(255,255,255,0.1)",
                    color: isActive ? "white" : "var(--text)"
                  }}
                >
                  {g}
                </button>
              );
            })}
          </div>

          {/* RESULT */}
          {result && (
            <div className="mt-2 pt-3 border-t text-center" style={{ borderColor: "rgba(255,255,255,0.1)" }}>

              {/* MAIN RESULT */}
              <div className="text-sm font-semibold mb-1" style={{ color: "var(--text)" }}>
                {result.status === "possible" && (
                  <>
                    {result.required} <span style={{color: "var(--muted)"}}>/ {result.futureMax}</span>
                  </>
                )}

                {result.status === "achieved" && (
                  <span style={{ color: "var(--accent)" }}>Already Achieved ✓</span>
                )}

                {result.status === "impossible" && (
                  <span className="text-red-400">
                    {result.message.split(": ")[1]}
                  </span>
                )}
              </div>

              {/* SUBTEXT */}
              <div className="text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>
                {result.status === "possible" &&
                  "Marks needed in remaining tests"}

                {result.status === "achieved" &&
                  "You’re already at this grade"}

                {result.status === "impossible" &&
                  "Maximum achievable grade"}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}