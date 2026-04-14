"use client";

import { useState } from "react";
import QRCode from "react-qr-code";

export default function SharePage() {
  const link = "https://academia-dex.vercel.app/";
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Academia DeX",
          text: "Check my academic dashboard",
          url: link,
        });
      } catch {}
    } else {
      handleCopy();
    }
  };

  return (
    <div className="h-full flex items-center justify-center bg-transparent">
      <div className="w-full max-w-sm px-4">
        <div 
          className="rounded-3xl shadow-2xl p-6 text-center space-y-6 border backdrop-blur-md"
          style={{ 
            backgroundColor: "rgba(10, 10, 10, 0.45)", 
            borderColor: "color-mix(in srgb, var(--accent) 30%, rgba(255, 255, 255, 0.1))",
            color: "var(--text)"
          }}
        >
          {/* 🔥 PREMIUM LOGO */}
          <div className="flex justify-center">
            <h1 className="flex items-center text-xl tracking-tight leading-none">
              {/* Logo A */}
              <span
                className="w-8 h-8 flex items-center justify-center rounded-[10px] text-lg font-black shadow-md shadow-black/20"
                style={{ backgroundColor: "var(--accent)", color: "var(--accent-fg)" }}
              >
                A
              </span>
              {/* Text */}
              <span className="font-medium ml-[1px]">cademia</span>
              <span className="font-bold ml-[2px]">DeX</span>
            </h1>
          </div>

          {/* Subtitle */}
          <p className="text-sm" style={{ color: "var(--muted)" }}>
            Scan to open dashboard
          </p>

          {/* QR */}
          <div className="flex flex-col items-center gap-3">
            {/* The QR code MUST have a solid light background to be readable by phone cameras */}
            <div className="bg-white p-4 rounded-2xl shadow-xl ring-2" style={{ ringColor: "rgba(255, 255, 255, 0.1)" }}>
              <QRCode value={link} size={170} />
            </div>

            <p className="text-xs" style={{ color: "var(--muted)", filter: "brightness(0.7)" }}>
              Quick scan access
            </p>
          </div>

          {/* Branded label */}
          <div 
            className="rounded-xl px-3 py-2 text-xs break-all"
            style={{ backgroundColor: "rgba(255, 255, 255, 0.05)", color: "var(--muted)" }}
          >
            {link}
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={handleCopy}
              className="flex-1 py-2 rounded-xl text-sm active:scale-95 transition font-medium"
              style={{ backgroundColor: "rgba(255, 255, 255, 0.1)", color: "var(--text)" }}
            >
              {copied ? "Copied ✓" : "Copy"}
            </button>

            <button
              onClick={handleShare}
              className="flex-1 py-2 rounded-xl text-sm active:scale-95 transition font-bold"
              style={{ backgroundColor: "var(--accent)", color: "var(--accent-fg)" }}
            >
              Share
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}