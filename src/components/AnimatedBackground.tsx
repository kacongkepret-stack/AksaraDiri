"use client";

import React from "react";
import Image from "next/image";

export default function AnimatedBackground() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      {/* 1. Base Image with Breathing Animation */}
      <Image
        src="/images/mystic_bg.png"
        alt="Background"
        fill
        priority
        quality={60}
        className="object-cover animate-[breath_20s_ease-in-out_infinite]"
      />

      {/* 2. Glassmorphism Overlay */}
      <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-[2px]"></div>

      {/* 3. Gradient Fade */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-transparent to-slate-950"></div>

      {/* 4. Ambient Glow */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-emerald-500/20 rounded-full blur-[120px]"></div>
      <div className="absolute top-1/2 -right-32 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px]"></div>
      <div className="absolute -bottom-32 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px]"></div>

      <style jsx>{`
        @keyframes breath {
          0%,
          100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.08);
          }
        }
      `}</style>
    </div>
  );
}
