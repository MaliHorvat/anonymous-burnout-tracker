"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import {
  DashboardAnalytics,
  DashboardAnswers,
  DashboardOverview,
  DashboardQuestions,
  DashboardSettings,
} from "@/components/dashboard/DashboardPanels";
import { DashboardChrome, type DashboardSection } from "@/components/layout/DashboardChrome";
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
  const [section, setSection] = useState<DashboardSection>("pregled");

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
    setSection("pregled");
  }

  if (!authed) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100 p-4 dark:bg-slate-950">
        <form
          onSubmit={onLogin}
          className="w-full max-w-sm space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900"
        >
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50">Prijava v nadzorno ploščo</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">Burnout Tracker — Admin</p>
          <label className="block text-sm">
            <span className="mb-1 block text-slate-600 dark:text-slate-300">Geslo</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-slate-900 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
              required
            />
          </label>
          {loginError ? <p className="text-sm text-red-600 dark:text-red-400">{loginError}</p> : null}
          <button
            type="submit"
            className="w-full rounded-xl bg-teal-700 py-2.5 text-sm font-semibold text-white hover:bg-teal-800 dark:bg-teal-600"
          >
            Prijava
          </button>
        </form>
      </div>
    );
  }

  return (
    <DashboardChrome active={section} onNavigate={setSection}>
      {section === "pregled" ? (
        <DashboardOverview stats={stats} loading={loading} onRefresh={() => void loadStats()} />
      ) : null}
      {section === "odgovori" ? <DashboardAnswers stats={stats} /> : null}
      {section === "analitika" ? <DashboardAnalytics stats={stats} /> : null}
      {section === "vprasanja" ? <DashboardQuestions /> : null}
      {section === "nastavitve" ? <DashboardSettings onLogout={() => void onLogout()} /> : null}
    </DashboardChrome>
  );
}
