"use client";

import * as React from "react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/components/theme-provider";

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className = "" }: ThemeToggleProps) {
  const { isDarkMode, toggleTheme, mounted } = useTheme();

  if (!mounted) {
    return (
      <div
        className={`size-9 rounded-full border border-white/20 bg-white/10 backdrop-blur-md ${className}`}
        aria-hidden="true"
      />
    );
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDarkMode ? "Switch to Day Sky (Light Mode)" : "Switch to Night Sky (Dark Mode)"}
      title={isDarkMode ? "Switch to Day Sky (Light Mode)" : "Switch to Night Sky (Dark Mode)"}
      className={`relative inline-flex size-9 items-center justify-center rounded-full border transition-all duration-300 active:scale-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 ${
        isDarkMode
          ? "border-sky-500/40 bg-slate-900/80 text-sky-300 shadow-[0_0_15px_-3px_rgba(56,189,248,0.4)] hover:border-sky-400 hover:bg-slate-800"
          : "border-slate-300/80 bg-white/90 text-amber-600 shadow-sm hover:border-amber-400 hover:bg-amber-50/60"
      } ${className}`}
    >
      {/* Sun Icon */}
      <Sun
        className={`size-4.5 transition-all duration-500 transform ${
          isDarkMode
            ? "rotate-90 scale-0 opacity-0 absolute text-amber-400"
            : "rotate-0 scale-100 opacity-100 text-amber-500"
        }`}
      />
      {/* Moon Icon */}
      <Moon
        className={`size-4.5 transition-all duration-500 transform ${
          isDarkMode
            ? "rotate-0 scale-100 opacity-100 text-sky-300"
            : "-rotate-90 scale-0 opacity-0 absolute text-slate-700"
        }`}
      />
    </button>
  );
}

export default ThemeToggle;

