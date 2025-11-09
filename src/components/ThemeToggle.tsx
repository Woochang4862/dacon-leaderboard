"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

function SunIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-5 w-5 text-amber-500 transition-transform duration-300 ease-out"
    >
      <path
        fill="currentColor"
        d="M12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12Zm0 3a1 1 0 0 1-1-1v-1.2a1 1 0 1 1 2 0V20a1 1 0 0 1-1 1Zm0-18a1 1 0 0 1-1-1V.8a1 1 0 0 1 2 0V2a1 1 0 0 1-1 1Zm9 7h-1.2a1 1 0 1 1 0-2H21a1 1 0 0 1 0 2Zm-16 0H3a1 1 0 0 1 0-2h1.2a1 1 0 1 1 0 2Zm13.95 8.66a1 1 0 0 1-1.41 0l-.84-.85a1 1 0 0 1 1.41-1.41l.85.84a1 1 0 0 1-.01 1.42Zm-11.31 0a1 1 0 0 1-1.41-1.41l.84-.85a1 1 0 0 1 1.41 1.41l-.84.85Zm0-13.32-.84-.85A1 1 0 1 1 6.8 3.07l.84.85a1 1 0 0 1-1.41 1.41Zm11.31 0a1 1 0 0 1-1.41-1.41l.84-.85a1 1 0 0 1 1.41 1.41l-.84.85Z"
      />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-5 w-5 text-indigo-300 transition-transform duration-300 ease-out"
    >
      <path
        fill="currentColor"
        d="M12.16 21.94A10 10 0 0 0 21.94 12 8 8 0 1 1 12.16 21.94Zm.56-17.65a10 10 0 1 0 8.99 8.99 8 8 0 1 1-8.99-8.99Z"
      />
    </svg>
  );
}

export function ThemeToggle() {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentTheme = theme === "system" ? resolvedTheme : theme;
  const isDark = mounted && currentTheme === "dark";

  const handleToggle = () => {
    if (!mounted) return;
    setTheme(isDark ? "light" : "dark");
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-label="테마 전환"
      className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-3 py-1.5 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:border-slate-300 hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-200 dark:hover:border-slate-600 dark:hover:bg-slate-900"
    >
      {isDark ? <SunIcon /> : <MoonIcon />}
      <span className="hidden sm:inline">
        {isDark ? "라이트 모드" : "다크 모드"}
      </span>
    </button>
  );
}

