"use client";

import { OrganizationSwitcher, UserButton, useOrganization } from "@clerk/nextjs";
import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  ClipboardList,
  LayoutDashboard,
  Menu,
  MessageSquare,
  MessageSquarePlus,
  Settings,
  Shield,
} from "lucide-react";
import Link from "next/link";
import { BurnoutLogo } from "@/components/brand/BurnoutLogo";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

export type DashboardSection =
  | "pregled"
  | "odgovori"
  | "opombe"
  | "analitika"
  | "vprasanja"
  | "nastavitve";

const NAV: { id: DashboardSection; label: string; icon: LucideIcon }[] = [
  { id: "pregled", label: "Pregled", icon: LayoutDashboard },
  { id: "odgovori", label: "Odgovori", icon: MessageSquare },
  { id: "opombe", label: "Opombe", icon: MessageSquarePlus },
  { id: "analitika", label: "Analitika", icon: BarChart3 },
  { id: "vprasanja", label: "Vprašanja", icon: ClipboardList },
  { id: "nastavitve", label: "Nastavitve", icon: Settings },
];

type Props = {
  active: DashboardSection;
  onNavigate: (section: DashboardSection) => void;
  orgName?: string;
  children: React.ReactNode;
};

export function DashboardChrome({ active, onNavigate, orgName, children }: Props) {
  const { organization } = useOrganization();

  return (
    <div className="flex min-h-screen flex-col bg-slate-100 dark:bg-slate-950">
      <header className="flex items-center justify-between gap-3 bg-teal-800 px-4 py-3 text-white dark:bg-teal-900">
        <div className="flex items-center gap-3">
          <button type="button" className="rounded-lg p-1.5 hover:bg-white/10 lg:hidden" aria-label="Meni">
            <Menu className="h-5 w-5" />
          </button>
          <BurnoutLogo subtitle={orgName || organization?.name || "Admin"} variant="onDark" />
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <Link href="/" className="hidden text-sm text-teal-100 hover:text-white sm:inline">
            ← Domov
          </Link>
          <ThemeToggle onDark />
          <OrganizationSwitcher
            hidePersonal
            afterSelectOrganizationUrl="/dashboard"
            appearance={{
              elements: {
                organizationSwitcherTrigger:
                  "rounded-lg bg-white/10 px-2 py-1.5 text-white hover:bg-white/15 text-sm",
              },
            }}
          />
          <UserButton
            appearance={{
              elements: {
                avatarBox: "h-8 w-8",
              },
            }}
          />
        </div>
      </header>

      <div className="flex flex-1">
        <aside className="hidden w-56 shrink-0 flex-col border-r border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900 lg:flex">
          <nav className="flex flex-1 flex-col gap-1 p-3">
            {NAV.map((item) => {
              const Icon = item.icon;
              const isActive = active === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onNavigate(item.id)}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition ${
                    isActive
                      ? "bg-teal-50 text-teal-800 dark:bg-teal-950/60 dark:text-teal-300"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
                  }`}
                >
                  <Icon className={`h-4 w-4 shrink-0 ${isActive ? "text-teal-700 dark:text-teal-400" : ""}`} aria-hidden />
                  {item.label}
                </button>
              );
            })}
          </nav>
          <div className="border-t border-slate-200 p-4 dark:border-slate-800">
            <div className="flex gap-2 text-teal-800 dark:text-teal-400">
              <Shield className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
              <div>
                <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">Anonimno zbiranje</p>
                <p className="mt-0.5 text-[11px] leading-snug text-slate-500 dark:text-slate-400">
                  Identiteta ni shranjena
                </p>
              </div>
            </div>
          </div>
        </aside>

        <div className="flex flex-1 flex-col">
          <div className="flex gap-1 overflow-x-auto border-b border-slate-200 bg-white px-3 py-2 lg:hidden dark:border-slate-800 dark:bg-slate-900">
            {NAV.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => onNavigate(item.id)}
                className={`shrink-0 rounded-lg px-3 py-1.5 text-xs font-medium ${
                  active === item.id
                    ? "bg-teal-700 text-white"
                    : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
          <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
        </div>
      </div>
    </div>
  );
}

export { NAV as DASHBOARD_NAV };
