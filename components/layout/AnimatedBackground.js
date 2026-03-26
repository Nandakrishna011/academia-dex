"use client";

import React from "react";

export default function AnimatedBackground() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none bg-black">
      
      {/* 1. Base Dynamic Gradient (Deep bottom, Bright top) */}
      <div 
        className="absolute inset-0"
        style={{
          background: "linear-gradient(180deg, color-mix(in srgb, var(--accent) 70%, white) 0%, var(--bg) 60%)",
        }}
      />

      {/* 2. Abstract Brush / Sponge Texture (Using SVG feTurbulence) */}
      <div 
        className="absolute inset-0 opacity-[0.45]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.008' numOctaves='5' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          backgroundSize: "cover",
          mixBlendMode: "color-dodge",
        }}
      />
      
      {/* 3. Darker Burn Texture for Depth */}
      <div 
        className="absolute inset-0 opacity-[0.5]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter2'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.015' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter2)'/%3E%3C/svg%3E")`,
          mixBlendMode: "multiply",
        }}
      />

      {/* 4. Subtle ambient moving glows (Keeps it 'Animated' without breaking the texture) */}
      <div 
        className="absolute w-[800px] h-[800px] rounded-full filter blur-[120px] opacity-30 animate-blob"
        style={{ 
          backgroundColor: "var(--accent)", 
          top: "-20%", 
          left: "-20%",
          mixBlendMode: "overlay",
          animationDuration: "25s"
        }}
      />
      
      {/* 5. Minimal glass frosted seal to soften the raw SVG noise slightly */}
      <div className="absolute inset-0 bg-black/10 backdrop-blur-[1px]" />

    </div>
  );
}
