"use client";

import { useMemo } from "react";

type Particle = {
  left: string;
  delay: string;
  duration: string;
  size: string;
  color: string;
};

const PARTICLE_COLORS = ["#ff4fa3", "#5dff9e", "#ffb84f", "#5fd4ff", "#ffe45f"];

export default function AnimatedBanner() {
  const particles = useMemo<Particle[]>(() => {
    return Array.from({ length: 24 }, (_, i) => ({
      left: `${(i * 4.3 + (i % 3) * 2) % 100}%`,
      delay: `${(i % 8) * 0.6}s`,
      duration: `${4 + (i % 5) * 1.1}s`,
      size: `${3 + (i % 3) * 2}px`,
      color: PARTICLE_COLORS[i % PARTICLE_COLORS.length],
    }));
  }, []);

  return (
    <div className="relative w-full overflow-hidden rounded-lg border border-line">
      {/* Base banner image */}
      <img
        src="/images/banner.png"
        alt="PixelDesk — ของแต่งโต๊ะเกมมิ่ง/สตรีมมิ่ง"
        className="w-full h-auto block select-none"
        draggable={false}
      />

      {/* Flickering light overlay (blend mode screen to brighten existing light points) */}
      <div className="absolute inset-0 pointer-events-none mix-blend-screen">
        <div className="absolute top-[8%] left-[14%] w-10 h-10 rounded-full bg-cyan-300/40 blur-md animate-flicker-a" />
        <div className="absolute top-[18%] left-[36%] w-6 h-6 rounded-full bg-pink-400/40 blur-md animate-flicker-b" />
        <div className="absolute top-[55%] left-[68%] w-8 h-8 rounded-full bg-yellow-300/40 blur-md animate-flicker-a" />
        <div className="absolute top-[40%] left-[8%] w-7 h-7 rounded-full bg-orange-400/40 blur-md animate-flicker-c" />
        <div className="absolute top-[12%] left-[78%] w-9 h-9 rounded-full bg-pink-300/40 blur-md animate-flicker-b" />
        <div className="absolute top-[62%] left-[42%] w-6 h-6 rounded-full bg-lime-300/40 blur-md animate-flicker-c" />
        <div className="absolute top-[70%] left-[88%] w-8 h-8 rounded-full bg-cyan-200/40 blur-md animate-flicker-a" />
        <div className="absolute top-[30%] left-[58%] w-6 h-6 rounded-full bg-green-300/40 blur-md animate-flicker-b" />
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none">
        {particles.map((p, i) => (
          <span
            key={i}
            className="absolute bottom-0 rounded-full animate-float-up"
            style={{
              left: p.left,
              width: p.size,
              height: p.size,
              backgroundColor: p.color,
              boxShadow: `0 0 6px ${p.color}`,
              animationDelay: p.delay,
              animationDuration: p.duration,
            }}
          />
        ))}
      </div>

      <style jsx>{`
        @keyframes flicker-a {
          0%,
          100% {
            opacity: 0.3;
            transform: scale(1);
          }
          45% {
            opacity: 0.9;
            transform: scale(1.15);
          }
          50% {
            opacity: 0.25;
            transform: scale(0.95);
          }
          55% {
            opacity: 0.8;
            transform: scale(1.1);
          }
        }
        @keyframes flicker-b {
          0%,
          100% {
            opacity: 0.85;
          }
          20% {
            opacity: 0.2;
          }
          30% {
            opacity: 0.9;
          }
          70% {
            opacity: 0.3;
          }
          80% {
            opacity: 0.85;
          }
        }
        @keyframes flicker-c {
          0%,
          100% {
            opacity: 0.4;
          }
          50% {
            opacity: 1;
          }
        }
        @keyframes float-up {
          0% {
            transform: translateY(0) translateX(0);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 0.8;
          }
          100% {
            transform: translateY(-260px) translateX(12px);
            opacity: 0;
          }
        }
        .animate-flicker-a {
          animation: flicker-a 2.4s ease-in-out infinite;
        }
        .animate-flicker-b {
          animation: flicker-b 3.1s ease-in-out infinite;
        }
        .animate-flicker-c {
          animation: flicker-c 1.8s ease-in-out infinite;
        }
        .animate-float-up {
          animation: float-up linear infinite;
        }
      `}</style>
    </div>
  );
}
