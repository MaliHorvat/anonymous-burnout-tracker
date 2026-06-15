import Link from "next/link";
import { BurnoutForm } from "@/components/BurnoutForm";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <header className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto flex max-w-lg items-center justify-between gap-3 px-4 py-4">
          <span className="font-semibold text-slate-900 dark:text-slate-100">Burnout Tracker</span>
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="text-sm text-slate-600 hover:text-teal-700 dark:text-slate-300 dark:hover:text-teal-400"
            >
              Admin →
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-lg px-4 py-10">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
            Anonimna anketa o izgorelosti
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
            Tri kratka vprašanja, ocena 1–5. Brez imena, brez e-pošte — samo skupni signal za vašo organizacijo.
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <BurnoutForm />
        </div>

        <p className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400">
          Podatki se shranijo anonimno z datumom oddaje.
        </p>
      </main>
    </div>
  );
}
