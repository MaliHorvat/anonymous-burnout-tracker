import { Activity } from "lucide-react";

type Props = {
  subtitle?: string;
  className?: string;
  variant?: "default" | "onDark";
};

export function BurnoutLogo({ subtitle, className = "", variant = "default" }: Props) {
  const onDark = variant === "onDark";
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <span
        className={`flex h-9 w-9 items-center justify-center rounded-full shadow-sm ${
          onDark ? "bg-white/15 text-white" : "bg-teal-700 text-white dark:bg-teal-600"
        }`}
      >
        <Activity className="h-5 w-5" strokeWidth={2.5} aria-hidden />
      </span>
      <div>
        <p className={`text-base font-bold tracking-tight ${onDark ? "text-white" : "text-slate-900 dark:text-slate-50"}`}>
          Burnout Tracker
        </p>
        {subtitle ? (
          <p className={`text-xs ${onDark ? "text-teal-100" : "text-slate-500 dark:text-slate-400"}`}>{subtitle}</p>
        ) : null}
      </div>
    </div>
  );
}
