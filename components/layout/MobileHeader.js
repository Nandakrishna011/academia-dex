"use client";

import { useRouter } from "next/navigation";
import ThemeSelector from "@/components/layout/ThemeSelector";

export default function MobileHeader() {
  const router = useRouter();

  return (
    <div
      className="
        md:hidden
        fixed top-0 left-0 right-0
        z-50
        flex items-center justify-between
        px-4 py-3
        backdrop-blur-md border-b
        shadow-[0_2px_12px_rgba(0,0,0,0.05)]
      "
      style={{ 
        backgroundColor: "rgba(10, 10, 10, 0.45)", 
        borderColor: "color-mix(in srgb, var(--accent) 40%, rgba(255, 255, 255, 0.1))" 
      }}
    >
      {/* Hamburger */}
      <button
        onClick={() =>
          document.dispatchEvent(new Event("toggle-sidebar"))
        }
        className="
          flex items-center justify-center
          w-10 h-10
          rounded-xl
          active:scale-95 transition
        "
        style={{ backgroundColor: "rgba(255, 255, 255, 0.1)", color: "var(--text)" }}
      >
        <span className="text-lg leading-none">☰</span>
      </button>

      {/* Premium Logo */}
      <div
        onClick={() => router.push("/dashboard")}
        className="
          flex items-center justify-center cursor-pointer
          active:scale-95 transition
        "
      >
        <h1 className="flex items-center text-xl leading-none tracking-tight" style={{ color: "var(--text)" }}>
          
          {/* Logo A */}
          <span
            className="
              w-8 h-8
              flex items-center justify-center
              rounded-[10px]
              text-lg font-black
              shadow-md shadow-black/20
            "
            style={{ backgroundColor: "var(--accent)", color: "var(--accent-fg)" }}
          >
            A
          </span>

          {/* Text */}
          <span className="font-medium ml-[1px]">
            cademia
          </span>

          <span className="font-bold ml-[2px]">
            DeX
          </span>
        </h1>
      </div>

      <ThemeSelector compact />
    </div>
  );
}