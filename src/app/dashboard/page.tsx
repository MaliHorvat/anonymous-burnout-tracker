import Link from "next/link";
import { DashboardView } from "@/components/DashboardView";
import { isDashboardAuthenticated } from "@/lib/dashboard-auth";

export const metadata = {
  title: "Nadzorna plošča | Burnout Tracker",
};

export default async function DashboardPage() {
  const authed = await isDashboardAuthenticated();

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
          <span className="font-semibold text-slate-900">Burnout Tracker — Admin</span>
          <Link href="/" className="text-sm text-slate-500 hover:text-teal-700">
            ← Anketa
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-10">
        <h1 className="mb-8 text-2xl font-bold text-slate-900">Povprečne ocene</h1>
        <DashboardView initialAuthed={authed} />
      </main>
    </div>
  );
}
