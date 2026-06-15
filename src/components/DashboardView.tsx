"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import type { DashboardStats } from "@/lib/types";

type Props = {
  initialAuthed: boolean;
};

export function DashboardView({ initialAuthed }: Props) {
  const [authed, setAuthed] = useState(initialAuthed);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(false);

  const loadStats = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/dashboard/stats");
      const data = (await res.json()) as { ok?: boolean; stats?: DashboardStats; error?: string };
      if (!res.ok || !data.ok || !data.stats) {
        if (res.status === 401) setAuthed(false);
        return;
      }
      setStats(data.stats);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authed) void loadStats();
  }, [authed, loadStats]);

  async function onLogin(e: FormEvent) {
    e.preventDefault();
    setLoginError("");
    const res = await fetch("/api/dashboard/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    const data = (await res.json()) as { ok?: boolean; error?: string };
    if (!res.ok || !data.ok) {
      setLoginError(data.error || "Prijava ni uspela.");
      return;
    }
    setAuthed(true);
    setPassword("");
  }

  async function onLogout() {
    await fetch("/api/dashboard/login", { method: "DELETE" });
    setAuthed(false);
    setStats(null);
  }

  if (!authed) {
    return (
      <form
        onSubmit={onLogin}
        className="mx-auto max-w-sm space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900"
      >
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50">Prijava v nadzorno ploščo</h2>
        <label className="block text-sm">
          <span className="mb-1 block text-slate-600 dark:text-slate-300">Geslo</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-slate-900 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
            required
          />
        </label>
        {loginError ? <p className="text-sm text-red-600 dark:text-red-400">{loginError}</p> : null}
        <button
          type="submit"
          className="w-full rounded-lg bg-slate-800 py-2.5 text-sm font-semibold text-white hover:bg-slate-900 dark:bg-slate-600 dark:hover:bg-slate-500"
        >
          Prijava
        </button>
      </form>
    );
  }

  const cards = stats
    ? [
        { label: "Delovna obremenitev", value: stats.averages.workload },
        { label: "Počutje cenjenosti", value: stats.averages.feeling_valued },
        { label: "Dovolj virov", value: stats.averages.enough_resources },
      ]
    : [];

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm text-slate-800 dark:text-slate-200">
          Skupaj oddaj: <strong className="text-slate-900 dark:text-slate-50">{stats?.count ?? "—"}</strong>
          {loading ? <span className="text-slate-600 dark:text-slate-400"> · nalagam...</span> : null}
        </p>
        <button
          type="button"
          onClick={() => void loadStats()}
          className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-800 hover:bg-slate-100 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
        >
          Osveži
        </button>
        <button
          type="button"
          onClick={() => void onLogout()}
          className="text-sm font-medium text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-50"
        >
          Odjava
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {cards.map((c) => (
          <div
            key={c.label}
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900"
          >
            <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{c.label}</p>
            <p className="mt-2 text-3xl font-bold text-teal-800 dark:text-teal-400">{c.value.toFixed(2)}</p>
            <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">povprečje (1–5)</p>
          </div>
        ))}
      </div>

      {stats && stats.recent.length > 0 ? (
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <table className="w-full min-w-[480px] text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-100 text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100">
              <tr>
                <th className="px-4 py-3 font-semibold">Čas</th>
                <th className="px-4 py-3 font-semibold">Obrem.</th>
                <th className="px-4 py-3 font-semibold">Cenjenost</th>
                <th className="px-4 py-3 font-semibold">Viri</th>
              </tr>
            </thead>
            <tbody>
              {stats.recent.map((row) => (
                <tr key={row.id} className="border-b border-slate-100 dark:border-slate-800">
                  <td className="px-4 py-3 text-slate-700 dark:text-slate-300">
                    {new Date(row.created_at).toLocaleString("sl-SI")}
                  </td>
                  <td className="px-4 py-3 text-center font-semibold text-slate-900 dark:text-slate-50">
                    {row.workload}
                  </td>
                  <td className="px-4 py-3 text-center font-semibold text-slate-900 dark:text-slate-50">
                    {row.feeling_valued}
                  </td>
                  <td className="px-4 py-3 text-center font-semibold text-slate-900 dark:text-slate-50">
                    {row.enough_resources}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </div>
  );
}
