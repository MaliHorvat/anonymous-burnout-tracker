import Link from "next/link";
import { Building2, ShieldCheck, Users } from "lucide-react";
import { BurnoutLogo } from "@/components/brand/BurnoutLogo";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950">
      <header className="border-b border-slate-200/80 bg-white/90 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/90">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-4 sm:px-6">
          <BurnoutLogo />
          <div className="flex items-center gap-3">
            <Link
              href="/sign-in"
              className="text-sm font-medium text-slate-600 hover:text-teal-700 dark:text-slate-300 dark:hover:text-teal-400"
            >
              Prijava
            </Link>
            <Link
              href="/sign-up"
              className="rounded-xl bg-teal-700 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-800 dark:bg-teal-600"
            >
              Registracija
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-slate-50">
            Anonimna anketa o zadovoljstvu in izgorelosti
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-slate-600 dark:text-slate-300">
            Burnout Tracker omogoča podjetjem varno zbiranje povratnih informacij zaposlenih — brez identifikacije,
            z jasnim pregledom za HR in vodstvo.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/sign-up"
              className="rounded-xl bg-teal-700 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-teal-800 dark:bg-teal-600"
            >
              Začni brezplačno
            </Link>
            <Link
              href="/sign-in"
              className="rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-800 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
            >
              Prijava v nadzorno ploščo
            </Link>
          </div>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <Users className="h-8 w-8 text-teal-700 dark:text-teal-400" aria-hidden />
            <h2 className="mt-4 font-semibold text-slate-900 dark:text-slate-50">Več podjetij</h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              Vsako podjetje ima svojo organizacijo, ločeno anketo in ločene podatke.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <ShieldCheck className="h-8 w-8 text-teal-700 dark:text-teal-400" aria-hidden />
            <h2 className="mt-4 font-semibold text-slate-900 dark:text-slate-50">Anonimno</h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              Zaposleni oddajo ocene in neobvezne opombe brez prijave. Identiteta se ne shranjuje.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <Building2 className="h-8 w-8 text-teal-700 dark:text-teal-400" aria-hidden />
            <h2 className="mt-4 font-semibold text-slate-900 dark:text-slate-50">8 vprašanj + opombe</h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              Širša anketa o zadovoljstvu, izgorelosti in prostor za predloge zaposlenih.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
