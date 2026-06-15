"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/theme/ThemeProvider";

export function ThemeToggle({ onDark = false }: { onDark?: boolean }) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Preklopi na svetlo temo" : "Preklopi na temno temo"}
      title={isDark ? "Svetla tema" : "Temna tema"}
      className={`flex h-10 w-10 items-center justify-center rounded-full border transition ${
        onDark
          ? "border-white/25 bg-white/10 text-white hover:bg-white/20"
          : "border-slate-200 bg-white text-slate-700 shadow-sm hover:border-teal-300 hover:text-teal-800 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-teal-500 dark:hover:text-teal-300"
      }`}
    >
      {isDark ? <Sun className="h-5 w-5" aria-hidden /> : <Moon className="h-5 w-5" aria-hidden />}
    </button>
  );
}
