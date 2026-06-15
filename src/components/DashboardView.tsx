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
      <form onSubmit={onLogin} className="mx-auto max-w-sm space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Prijava v nadzorno ploščo</h2>
        <label className="block text-sm">
          <span className="mb-1 block text-slate-600">Geslo</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-slate-200 px-3 py-2"
            required
          />
        </label>
        {loginError ? <p className="text-sm text-red-600">{loginError}</p> : null}
        <button type="submit" className="w-full rounded-lg bg-slate-800 py-2.5 text-sm font-semibold text-white hover:bg-slate-900">
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
        <p className="text-sm text-slate-600">
          Skupaj oddaj: <strong>{stats?.count ?? "—"}</strong>
          {loading ? " · nalagam..." : null}
        </p>
        <button
          type="button"
          onClick={() => void loadStats()}
          className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm hover:bg-slate-50"
        >
          Osveži
        </button>
        <button type="button" onClick={() => void onLogout()} className="text-sm text-slate-500 hover:text-slate-800">
          Odjava
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {cards.map((c) => (
          <div key={c.label} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-600">{c.label}</p>
            <p className="mt-2 text-3xl font-bold text-teal-700">{c.value.toFixed(2)}</p>
            <p className="mt-1 text-xs text-slate-500">povprečje (1–5)</p>
          </div>
        ))}
      </div>

      {stats && stats.recent.length > 0 ? (
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full min-w-[480px] text-left text-sm">
            <thead className="border-b border-slate-100 bg-slate-50 text-slate-600">
              <tr>
                <th className="px-4 py-3 font-medium">Čas</th>
                <th className="px-4 py-3 font-medium">Obrem.</th>
                <th className="px-4 py-3 font-medium">Cenjenost</th>
                <th className="px-4 py-3 font-medium">Viri</th>
              </tr>
            </thead>
            <tbody>
              {stats.recent.map((row) => (
                <tr key={row.id} className="border-b border-slate-50">
                  <td className="px-4 py-2 text-slate-600">
                    {new Date(row.created_at).toLocaleString("sl-SI")}
                  </td>
                  <td className="px-4 py-2">{row.workload}</td>
                  <td className="px-4 py-2">{row.feeling_valued}</td>
                  <td className="px-4 py-2">{row.enough_resources}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </div>
  );
}
