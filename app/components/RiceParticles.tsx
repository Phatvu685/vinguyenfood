"use client";

import { useEffect, useState } from "react";

export default function RiceParticles() {
  const [particles, setParticles] = useState<{ id: number; left: number; delay: number; duration: number; size: number; rotation: number }[]>([]);

  useEffect(() => {
    // Generate some particles on mount
    const p = Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100, // random left position percentage
      delay: Math.random() * 5, // random delay
      duration: 12 + Math.random() * 15, // random duration between 12-27s
      size: 0.6 + Math.random() * 0.8, // random size scale
      rotation: Math.random() * 360,
    }));
    setParticles(p);
  }, []);

  return (
    <div className="rice-particles-container" aria-hidden="true">
      {particles.map((p) => (
        <div
          key={p.id}
          className="rice-particle"
          style={{
            left: `${p.left}%`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            transform: `scale(${p.size}) rotate(${p.rotation}deg)`,
          }}
        >
          {/* A simple SVG representing a grain of rice */}
          <svg width="24" height="64" viewBox="0 0 24 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M12 2C6 2 2 15 2 32C2 49 6 62 12 62C18 62 22 49 22 32C22 15 18 2 12 2Z"
              fill="url(#rice-gradient)"
              stroke="rgba(255,255,255,0.4)"
              strokeWidth="0.5"
              filter="drop-shadow(2px 4px 6px rgba(0,0,0,0.3))"
            />
            <path d="M12 4 C14 15 14 49 12 60" stroke="rgba(0,0,0,0.05)" strokeWidth="1" fill="none" />
            <defs>
              <linearGradient id="rice-gradient" x1="8" y1="2" x2="16" y2="62" gradientUnits="userSpaceOnUse">
                <stop stopColor="#F8F6EE" />
                <stop offset="0.6" stopColor="#EFD889" />
                <stop offset="1" stopColor="#D8B45A" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      ))}
    </div>
  );
}
