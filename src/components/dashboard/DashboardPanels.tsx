"use client";

import { Briefcase, ChevronRight, Heart, RefreshCw, Users } from "lucide-react";
import type { DashboardStats } from "@/lib/types";

function rowAverage(row: { workload: number; feeling_valued: number; enough_resources: number }) {
  return (row.workload + row.feeling_valued + row.enough_resources) / 3;
}

function ScoreCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: number;
  icon: typeof Briefcase;
}) {
  const pct = Math.min(100, (value / 5) * 100);
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <div className="flex items-start gap-4">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-teal-700/20 text-teal-700 dark:border-teal-500/30 dark:text-teal-400">
          <Icon className="h-5 w-5" aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{label}</p>
          <p className="mt-1 text-3xl font-bold text-teal-800 dark:text-teal-400">{value.toFixed(2)}</p>
          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">Povprečna ocena (1–5)</p>
        </div>
      </div>
      <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
        <div className="h-full rounded-full bg-teal-700 transition-all dark:bg-teal-500" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function ResponsesTable({ rows, title }: { rows: DashboardStats["recent"]; title: string }) {
  if (rows.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-slate-200 bg-white p-8 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
        Še ni oddanih odgovorov.
      </p>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <div className="border-b border-slate-200 px-4 py-3 dark:border-slate-700">
        <h3 className="font-semibold text-slate-900 dark:text-slate-50">{title}</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-200">
            <tr>
              <th className="px-4 py-3 font-semibold">Čas oddaje</th>
              <th className="px-4 py-3 font-semibold">Delovna obremenitev</th>
              <th className="px-4 py-3 font-semibold">Počutje cenjenosti</th>
              <th className="px-4 py-3 font-semibold">Dovolj virov</th>
              <th className="px-4 py-3 font-semibold">Skupna ocena</th>
              <th className="w-10 px-2 py-3" aria-hidden />
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-b border-slate-100 last:border-0 dark:border-slate-800">
                <td className="px-4 py-3 text-slate-700 dark:text-slate-300">
                  {new Date(row.created_at).toLocaleString("sl-SI")}
                </td>
                <td className="px-4 py-3 text-center font-semibold text-slate-900 dark:text-slate-50">{row.workload}</td>
                <td className="px-4 py-3 text-center font-semibold text-slate-900 dark:text-slate-50">
                  {row.feeling_valued}
                </td>
                <td className="px-4 py-3 text-center font-semibold text-slate-900 dark:text-slate-50">
                  {row.enough_resources}
                </td>
                <td className="px-4 py-3 text-center font-semibold text-teal-800 dark:text-teal-400">
                  {rowAverage(row).toFixed(2)}
                </td>
                <td className="px-2 py-3 text-slate-400">
                  <ChevronRight className="h-4 w-4" aria-hidden />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-200 px-4 py-3 text-xs text-slate-500 dark:border-slate-700 dark:text-slate-400">
        <span>
          Prikazujem 1–{rows.length} od {rows.length} odgovorov
        </span>
        <span className="rounded border border-slate-200 px-2 py-0.5 dark:border-slate-600">1</span>
      </div>
    </div>
  );
}

export function DashboardOverview({
  stats,
  loading,
  onRefresh,
}: {
  stats: DashboardStats | null;
  loading: boolean;
  onRefresh: () => void;
}) {
  const cards = stats
    ? [
        { label: "Delovna obremenitev", value: stats.averages.workload, icon: Briefcase },
        { label: "Počutje cenjenosti", value: stats.averages.feeling_valued, icon: Heart },
        { label: "Dovolj virov", value: stats.averages.enough_resources, icon: Users },
      ]
    : [];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50">Povprečne ocene</h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Skupaj oddaj: <strong className="text-slate-900 dark:text-slate-100">{stats?.count ?? "—"}</strong>
            {loading ? " · nalagam..." : null}
          </p>
        </div>
        <button
          type="button"
          onClick={onRefresh}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-800 shadow-sm hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} aria-hidden />
          Osveži
        </button>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {cards.map((c) => (
          <ScoreCard key={c.label} {...c} />
        ))}
      </div>

      {stats ? (
        <ResponsesTable rows={stats.recent} title="Zadnji anonimni odgovori" />
      ) : null}
    </div>
  );
}

export function DashboardAnswers({ stats }: { stats: DashboardStats | null }) {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50">Vsi odgovori</h1>
      <p className="text-sm text-slate-600 dark:text-slate-400">
        Seznam vseh anonimnih oddaj. Posameznih identitet ni mogoče določiti.
      </p>
      {stats ? <ResponsesTable rows={stats.recent} title="Anonimni odgovori" /> : null}
    </div>
  );
}

export function DashboardAnalytics({ stats }: { stats: DashboardStats | null }) {
  if (!stats) return null;

  const items = [
    { label: "Delovna obremenitev", value: stats.averages.workload, color: "bg-teal-700" },
    { label: "Počutje cenjenosti", value: stats.averages.feeling_valued, color: "bg-teal-600" },
    { label: "Dovolj virov", value: stats.averages.enough_resources, color: "bg-teal-500" },
  ];

  const overall =
    (stats.averages.workload + stats.averages.feeling_valued + stats.averages.enough_resources) / 3;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50">Analitika</h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          Agregirani pregled na podlagi {stats.count} anonimnih oddaj.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Skupno povprečje</p>
        <p className="mt-1 text-4xl font-bold text-teal-800 dark:text-teal-400">{overall.toFixed(2)}</p>
        <p className="text-xs text-slate-500">iz vseh treh vprašanj (lestvica 1–5)</p>
      </div>

      <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <h2 className="font-semibold text-slate-900 dark:text-slate-50">Porazdelitev po vprašanjih</h2>
        {items.map((item) => (
          <div key={item.label}>
            <div className="mb-1.5 flex justify-between text-sm">
              <span className="text-slate-700 dark:text-slate-300">{item.label}</span>
              <span className="font-semibold text-teal-800 dark:text-teal-400">{item.value.toFixed(2)}</span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
              <div
                className={`h-full rounded-full ${item.color}`}
                style={{ width: `${(item.value / 5) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const QUESTION_INFO = [
  {
    n: 1,
    title: "Delovna obremenitev",
    body: "Ocenite, kako obremenjeni ste z delom v zadnjem obdobju.",
  },
  {
    n: 2,
    title: "Počutje cenjenosti",
    body: "Ocenite, ali se na delovnem mestu počutite cenjeni in upoštevani.",
  },
  {
    n: 3,
    title: "Dovolj virov",
    body: "Ocenite, ali imate dovolj časa, opreme in podpore za kakovostno delo.",
  },
];

export function DashboardQuestions() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50">Vprašanja v anketi</h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          Zaposleni ocenjujejo vsako trditev na lestvici od 1 (zelo slabo) do 5 (zelo dobro).
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-3">
        {QUESTION_INFO.map((q) => (
          <div
            key={q.n}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900"
          >
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-teal-50 text-sm font-bold text-teal-800 dark:bg-teal-950 dark:text-teal-300">
              {q.n}
            </span>
            <h2 className="mt-3 font-semibold text-slate-900 dark:text-slate-50">{q.title}</h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{q.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function DashboardSettings({ onLogout }: { onLogout: () => void }) {
  return (
    <div className="mx-auto max-w-lg space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50">Nastavitve</h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">Upravljanje dostopa in zasebnosti ankete.</p>
      </div>
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <h2 className="font-semibold text-slate-900 dark:text-slate-50">Zasebnost</h2>
        <ul className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-400">
          <li>· Ne shranjujemo imen, e-pošte ali IP naslovov.</li>
          <li>· V bazi so le tri ocene in čas oddaje.</li>
          <li>· Prikazani so samo agregirani podatki.</li>
        </ul>
      </div>
      <button
        type="button"
        onClick={onLogout}
        className="w-full rounded-xl border border-slate-300 bg-white py-2.5 text-sm font-semibold text-slate-800 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
      >
        Odjava
      </button>
    </div>
  );
}
