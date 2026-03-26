"use client";

import { usePathname } from "next/navigation";
import {
  Home,
  ClipboardCheck,
  BarChart3,
  CalendarDays,
  Calendar,
} from "lucide-react";

import { useTimetableLogic } from "@/app/hooks/useTimetable";

export default function BottomNav() {
  const pathname = usePathname();
  const { safePush } = useTimetableLogic();

  // 🔥 haptic feedback
  const triggerHaptic = () => {
    if (typeof window !== "undefined" && navigator.vibrate) {
      navigator.vibrate(8);
    }
  };

  const handleNav = (href) => {
    triggerHaptic();
    safePush(href);
  };

  const items = [
    { name: "Attendance", href: "/attendance", icon: ClipboardCheck },
    { name: "Marks", href: "/marks", icon: BarChart3 },
    { name: "Dashboard", href: "/dashboard", icon: Home, center: true },
    { name: "Timetable", href: "/timetable", icon: CalendarDays },
    { name: "Planner", href: "/planner", icon: Calendar },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      <div 
        className="border-t shadow-sm backdrop-blur-lg" 
        style={{ 
          backgroundColor: "rgba(10, 10, 10, 0.45)", 
          borderColor: "color-mix(in srgb, var(--accent) 40%, rgba(255, 255, 255, 0.1))" 
        }}
      >
        <div className="relative grid grid-cols-5 items-center">

          {items.map((item) => {
            const active = pathname === item.href;
            const Icon = item.icon;

            // 🌟 CENTER BUTTON (FAB style)
            if (item.center) {
              return (
                <button
                  key={item.href}
                  onClick={() => handleNav(item.href)}
                  className="flex justify-center"
                >
                  <div
                    className={`
                      -mt-6 flex items-center justify-center
                      w-14 h-14 rounded-full shadow-lg transition-all duration-200
                      active:scale-95
                      ${
                        active
                          ? "text-white scale-105"
                          : "border"
                      }
                    `}
                    style={{ backgroundColor: active ? "var(--accent)" : "rgba(10, 10, 10, 0.5)", color: active ? "white" : "var(--muted)", borderColor: "rgba(255, 255, 255, 0.1)" }}
                  >
                    <Icon size={20} />
                  </div>
                </button>
              );
            }

            // 📱 NORMAL ITEMS
            return (
              <button
                key={item.href}
                onClick={() => handleNav(item.href)}
                className="flex flex-col items-center justify-center py-2 text-xs relative transition-all duration-200 active:scale-95"
              >
                {/* 🔥 Active pill background */}
                <div
                  className={`
                    absolute inset-1 rounded-lg transition-all duration-200
                  `}
                  style={{ backgroundColor: active ? "rgba(255, 255, 255, 0.1)" : "transparent" }}
                />

                <Icon
                  size={18}
                  className={`
                    relative z-10 transition-all duration-200
                    ${active ? "scale-110" : ""}
                  `}
                  style={{ color: active ? "var(--accent)" : "var(--muted)" }}
                />

                <span
                  className={`
                    relative z-10 text-[10px] mt-1 transition-all
                    ${
                      active
                        ? "font-medium"
                        : ""
                    }
                  `}
                  style={{ color: active ? "var(--accent)" : "var(--muted)" }}
                >
                  {item.name}
                </span>
              </button>
            );
          })}

        </div>
      </div>
    </div>
  );
}