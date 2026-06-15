"use client";

import { useTheme, type Theme } from "@/components/theme/ThemeProvider";

const OPTIONS: { id: Theme; label: string }[] = [
  { id: "light", label: "Svetlo" },
  { id: "dark", label: "Temno" },
  { id: "system", label: "Sistem" },
];

export function ThemeToggle({ onDark = false }: { onDark?: boolean }) {
  const { theme, setTheme } = useTheme();

  return (
    <div
      className={`flex rounded-lg border p-0.5 ${
        onDark
          ? "border-white/25 bg-white/10"
          : "border-slate-300 bg-slate-100 dark:border-slate-600 dark:bg-slate-800"
      }`}
      role="group"
      aria-label="Izbira teme"
    >
      {OPTIONS.map((opt) => {
        const active = theme === opt.id;
        return (
          <button
            key={opt.id}
            type="button"
            onClick={() => setTheme(opt.id)}
            className={`rounded-md px-2.5 py-1 text-xs font-medium transition ${
              active
                ? onDark
                  ? "bg-white text-teal-900 shadow-sm"
                  : "bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-slate-50"
                : onDark
                  ? "text-teal-100 hover:text-white"
                  : "text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-50"
            }`}
            aria-pressed={active}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
