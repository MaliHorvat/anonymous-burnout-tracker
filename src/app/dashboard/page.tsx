import Link from "next/link";
import { DashboardView } from "@/components/DashboardView";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { isDashboardAuthenticated } from "@/lib/dashboard-auth";

export const metadata = {
  title: "Nadzorna plošča | Burnout Tracker",
};

export default async function DashboardPage() {
  const authed = await isDashboardAuthenticated();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <header className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-3 px-4 py-4">
          <span className="font-semibold text-slate-900 dark:text-slate-100">Burnout Tracker — Admin</span>
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-sm text-slate-600 hover:text-teal-700 dark:text-slate-300 dark:hover:text-teal-400"
            >
              ← Anketa
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-10">
        <h1 className="mb-8 text-2xl font-bold text-slate-900 dark:text-slate-50">Povprečne ocene</h1>
        <DashboardView initialAuthed={authed} />
      </main>
    </div>
  );
}
