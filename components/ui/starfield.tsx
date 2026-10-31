"use client";

import * as React from "react";

interface Star {
  id: number;
  top: number;
  left: number;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
  color: string;
  hasGlow: boolean;
}

// Deterministic LCG pseudo-random generator to ensure exact same stars on SSR and client (no hydration error)
function generateDeterministicStars(count = 110): Star[] {
  let seed = 42;
  const rnd = () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };

  const colors = [
    "#ffffff",
    "#e0f2fe",
    "#bae6fd",
    "#f8fafc",
    "#fef08a",
    "#ffffff",
    "#93c5fd",
  ];

  const stars: Star[] = [];
  for (let i = 0; i < count; i++) {
    const sizeRoll = rnd();
    const size = sizeRoll > 0.88 ? 3 : sizeRoll > 0.65 ? 2 : 1.2;
    const color = colors[Math.floor(rnd() * colors.length)];
    const duration = +(2 + rnd() * 4).toFixed(2);
    const delay = +(rnd() * 5).toFixed(2);
    const opacity = +(0.3 + rnd() * 0.7).toFixed(2);

    stars.push({
      id: i,
      top: +(rnd() * 100).toFixed(2),
      left: +(rnd() * 100).toFixed(2),
      size,
      duration,
      delay,
      opacity,
      color,
      hasGlow: size >= 2.5,
    });
  }
  return stars;
}

const STATIC_STARS = generateDeterministicStars(120);

export function StarField({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden select-none ${className}`}
    >
      {STATIC_STARS.map((star) => (
        <span
          key={star.id}
          className="absolute rounded-full animate-twinkle"
          style={
            {
              top: `${star.top}%`,
              left: `${star.left}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              backgroundColor: star.color,
              boxShadow: star.hasGlow
                ? `0 0 6px 1px ${star.color}, 0 0 10px 2px rgba(147, 197, 253, 0.4)`
                : `0 0 2px ${star.color}`,
              "--twinkle-duration": `${star.duration}s`,
              "--twinkle-delay": `${star.delay}s`,
              opacity: star.opacity,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}

export default StarField;
