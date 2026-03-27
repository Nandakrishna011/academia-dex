"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const themeOptions = [
  { id: "signature", label: "Signature", gradient: "linear-gradient(135deg, #ffffff, #a1a1aa)" },
  { id: "aurora", label: "Aurora", gradient: "linear-gradient(135deg, #00ffcc, #0d9488)" },
  { id: "sunset", label: "Sunset", gradient: "linear-gradient(135deg, #ff6b6b, #be123c)" },
  { id: "deep", label: "Deep", gradient: "linear-gradient(135deg, #38bdf8, #0369a1)" },
  { id: "mystic", label: "Mystic", gradient: "linear-gradient(135deg, #c084fc, #6b21a8)" },
  { id: "royal", label: "Royal", gradient: "linear-gradient(135deg, #a855f7, #4c1d95)" },
  { id: "crimson", label: "Crimson", gradient: "linear-gradient(135deg, #f87171, #991b1b)" },
  { id: "electric", label: "Electric", gradient: "linear-gradient(135deg, #fde047, #d97706)" },
  { id: "emerald", label: "Emerald", gradient: "linear-gradient(135deg, #34d399, #047857)" },
  { id: "midnight", label: "Midnight", gradient: "linear-gradient(135deg, #f472b6, #be185d)" },
];

const THEME_KEY = "student_dashboard_theme";

function applyTheme(id) {
  if (typeof document === "undefined") return;
  document.documentElement.setAttribute("data-theme", id);
}

export default function ThemeSelector({ compact = false }) {
  const [selectedTheme, setSelectedTheme] = useState("mystic");
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const saved = (localStorage.getItem(THEME_KEY) || "mystic").toString();
    if (themeOptions.some((item) => item.id === saved)) {
      setSelectedTheme(saved);
      applyTheme(saved);
    } else {
      applyTheme("mystic");
    }
  }, []);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  const activeLabel = useMemo(() => {
    const theme = themeOptions.find((item) => item.id === selectedTheme);
    return theme?.label || "Mystic";
  }, [selectedTheme]);

  const activeFullName = useMemo(() => {
    if (activeLabel === "Mystic") return "Mystic Forest";
    if (activeLabel === "Signature") return "Signature Pro";
    if (activeLabel === "Deep") return "Deep Ocean";
    return activeLabel;
  }, [activeLabel]);

  const handleSelect = (themeId) => {
    setSelectedTheme(themeId);
    localStorage.setItem(THEME_KEY, themeId);
    applyTheme(themeId);
  };

  return (
    <div className={`relative ${compact ? "w-auto" : "flex justify-end w-full"}`} ref={menuRef}>
      <button
        onClick={() => setOpen((state) => !state)}
        className={`${
          compact ? "w-9 h-9 flex items-center justify-center text-lg shadow-sm" : "w-auto h-10 px-4 text-sm"
        } rounded-lg border bg-[rgba(10,10,10,0.5)] font-semibold text-white hover:opacity-80 transition`}
        style={{ borderColor: "rgba(255,255,255,0.15)", textShadow: "0 1px 3px rgba(0,0,0,0.3)" }}
        aria-label="Theme selector"
      >
        {compact ? "🎨" : `🎨 Theme`}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: -10, transformOrigin: "top right" }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="absolute right-0 top-12 z-50 p-2.5 rounded-xl shadow-2xl backdrop-blur-md border border-white/10"
            style={{ width: "155px", backgroundColor: "rgba(10, 15, 12, 0.95)" }}
          >
          {/* Header */}
          <div className="text-center mb-3">
            <h3 className="text-white font-bold text-sm leading-tight">Choose Theme</h3>
            <p className="text-gray-400 text-[10px] mt-0.5" style={{ lineHeight: "1.2" }}>
              {activeFullName}
            </p>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-2 gap-1.5">
            {themeOptions.map((theme) => {
              const isActive = selectedTheme === theme.id;
              
              return (
                <button
                  key={theme.id}
                  onClick={() => {
                    handleSelect(theme.id);
                    setOpen(false);
                  }}
                  className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl border transition-all ${
                    isActive 
                      ? "bg-white/10 border-white/40" 
                      : "bg-transparent border-white/5 hover:bg-white/5 hover:border-white/20"
                  }`}
                >
                  <div 
                    className="w-6 h-6 rounded-full mb-1.5 shadow-inner"
                    style={{ background: theme.gradient }}
                  />
                  <span 
                    className={`text-[9px] ${isActive ? "text-white font-bold" : "text-gray-400 font-medium"}`}
                    style={{ letterSpacing: "-0.2px" }}
                  >
                    {theme.label}
                  </span>
                </button>
              );
            })}
          </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
