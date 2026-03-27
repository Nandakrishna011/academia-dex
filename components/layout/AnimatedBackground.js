"use client";

import React from "react";

export default function AnimatedBackground() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none bg-[var(--bg)]">
      
      {/* Base Gradient */}
      <div 
        className="absolute inset-0 transition-colors duration-1000"
        style={{
          background: "radial-gradient(circle at 50% 0%, color-mix(in srgb, var(--accent) 30%, transparent) 0%, var(--bg) 70%)",
        }}
      />
      
      {/* Subtle moving glowing orb (Optimizied without SVG filters) */}
      <div 
        className="absolute w-[60vw] h-[60vw] max-w-[600px] max-h-[600px] rounded-full filter blur-[100px] opacity-20 animate-blob"
        style={{ 
          backgroundColor: "var(--accent)", 
          top: "-10%", 
          left: "-10%",
          animationDuration: "25s",
          willChange: "transform",
        }}
      />
      
      {/* Second orb for balance */}
      <div 
        className="absolute w-[50vw] h-[50vw] max-w-[500px] max-h-[500px] rounded-full filter blur-[100px] opacity-[0.15] animate-blob animation-delay-4000"
        style={{ 
          backgroundColor: "var(--accent)", 
          bottom: "-10%", 
          right: "-10%",
          animationDuration: "30s",
          willChange: "transform",
        }}
      />
      
      {/* Minimal noise overlay using a simple base64 image instead of feTurbulence */}
      <div 
        className="absolute inset-0 opacity-[0.03] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

    </div>
  );
}
