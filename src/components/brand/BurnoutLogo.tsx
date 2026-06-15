import { BurnoutLogoMark } from "@/components/brand/BurnoutLogoMark";

type Props = {
  subtitle?: string;
  className?: string;
  variant?: "default" | "onDark";
};

export function BurnoutLogo({ subtitle, className = "", variant = "default" }: Props) {
  const onDark = variant === "onDark";
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <span
        className={`flex shrink-0 items-center justify-center rounded-full shadow-md shadow-teal-900/15 ${
          onDark ? "ring-2 ring-white/20" : ""
        }`}
      >
        {onDark ? (
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15">
            <BurnoutLogoMark size={36} className="[&_circle]:fill-white/20" />
          </span>
        ) : (
          <BurnoutLogoMark size={40} />
        )}
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
