import Link from "next/link";
import { BurnoutForm } from "@/components/BurnoutForm";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-lg items-center justify-between px-4 py-4">
          <span className="font-semibold text-slate-900">Burnout Tracker</span>
          <Link href="/dashboard" className="text-sm text-slate-500 hover:text-teal-700">
            Admin →
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-lg px-4 py-10">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Anonimna anketa o izgorelosti</h1>
          <p className="mt-3 text-sm leading-relaxed text-slate-600">
            Tri kratka vprašanja, ocena 1–5. Brez imena, brez e-pošte — samo skupni signal za vašo organizacijo.
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <BurnoutForm />
        </div>

        <p className="mt-6 text-center text-xs text-slate-400">
          Podatki se shranijo anonimno z datumom oddaje.
        </p>
      </main>
    </div>
  );
}
