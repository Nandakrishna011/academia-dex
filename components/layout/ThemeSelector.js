"use client";

import { useEffect, useMemo, useState } from "react";

const themeOptions = [
  { id: "signature", label: "Signature" },
  { id: "aurora", label: "Aurora" },
  { id: "sunset", label: "Sunset" },
  { id: "deep", label: "Deep" },
  { id: "mystic", label: "Mystic" },
  { id: "royal", label: "Royal" },
  { id: "crimson", label: "Crimson" },
  { id: "electric", label: "Electric" },
  { id: "emerald", label: "Emerald" },
  { id: "midnight", label: "Midnight" },
];

const THEME_KEY = "student_dashboard_theme";

function applyTheme(id) {
  if (typeof document === "undefined") return;
  document.documentElement.setAttribute("data-theme", id);
}

export default function ThemeSelector({ compact = false }) {
  const [selectedTheme, setSelectedTheme] = useState("mystic");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const saved = (localStorage.getItem(THEME_KEY) || "mystic").toString();
    if (themeOptions.some((item) => item.id === saved)) {
      setSelectedTheme(saved);
      applyTheme(saved);
    } else {
      applyTheme("mystic");
    }
  }, []);

  const activeLabel = useMemo(() => {
    const theme = themeOptions.find((item) => item.id === selectedTheme);
    return theme?.label || "Mystic";
  }, [selectedTheme]);

  const handleSelect = (themeId) => {
    setSelectedTheme(themeId);
    localStorage.setItem(THEME_KEY, themeId);
    applyTheme(themeId);
  };

  return (
    <div className={`relative ${compact ? "w-auto" : "w-full"}`}>
      <button
        onClick={() => setOpen((state) => !state)}
        className={`${
          compact ? "w-9 h-9 flex items-center justify-center text-lg shadow-sm" : "w-full h-10 px-3 text-xs"
        } rounded-lg border border-[var(--accent)] bg-[var(--surface)] font-semibold text-[var(--text)] hover:opacity-80 transition`}
        aria-label="Theme selector"
      >
        {compact ? "🎨" : `🎨 ${activeLabel}`}
      </button>

      {open && (
        <div className={`absolute ${compact ? "right-0" : "left-0"} top-12 z-50 mt-1 w-48 rounded-lg border border-[var(--accent)] bg-[var(--surface)] shadow-lg p-2 backdrop-blur-md`}>
          <p className="text-xs font-bold uppercase tracking-wide text-[var(--muted)] mb-2">
            Choose Theme
          </p>

          <div className="grid grid-cols-2 gap-2">
            {themeOptions.map((theme) => (
              <button
                key={theme.id}
                onClick={() => {
                  handleSelect(theme.id);
                  setOpen(false);
                }}
                className={`rounded-md px-2 py-2 text-left text-sm transition font-medium ${
                  selectedTheme !== theme.id ? "hover:opacity-80" : ""
                }`}
                style={{
                  backgroundColor: selectedTheme === theme.id ? "var(--accent)" : "transparent",
                  color: selectedTheme === theme.id ? "var(--accent-fg)" : "var(--text)"
                }}
              >
                <div className="flex items-center gap-2">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: `var(--accent)` }}
                  />
                  <span>{theme.label}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
