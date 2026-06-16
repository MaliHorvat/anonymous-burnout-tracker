"use client";

import { useState } from "react";
import {
  Briefcase,
  ChevronRight,
  Copy,
  Heart,
  RefreshCw,
  Smile,
  Star,
  ThumbsUp,
  Users,
  Workflow,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { rowAverageFromAnswers } from "@/lib/survey-service";
import { copyText } from "@/lib/copy-text";
import { publicSurveyUrl } from "@/lib/app-url";
import type { DashboardStats, OrganizationInfo, SurveyQuestionRow } from "@/lib/types";

const SCORE_ICONS: Record<string, LucideIcon> = {
  workload: Briefcase,
  feeling_valued: Heart,
  enough_resources: Users,
  work_life_balance: Workflow,
  team_collaboration: Users,
  manager_support: ThumbsUp,
  job_satisfaction: Smile,
  recommend_employer: Star,
};

function activeQuestions(stats: DashboardStats): SurveyQuestionRow[] {
  return stats.questions.filter((q) => q.active);
}

function rowAverage(row: DashboardStats["recent"][number], keys: string[]): number {
  return rowAverageFromAnswers(row.answers, keys);
}

function ScoreCard({ label, value, icon: Icon }: { label: string; value: number; icon: LucideIcon }) {
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

function ResponsesTable({
  rows,
  questions,
  title,
  compact,
}: {
  rows: DashboardStats["recent"];
  questions: SurveyQuestionRow[];
  title: string;
  compact?: boolean;
}) {
  if (rows.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-slate-200 bg-white p-8 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
        Še ni oddanih odgovorov.
      </p>
    );
  }

  const visibleQuestions = compact ? questions.slice(0, 4) : questions;
  const keys = visibleQuestions.map((q) => q.key);

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <div className="border-b border-slate-200 px-4 py-3 dark:border-slate-700">
        <h3 className="font-semibold text-slate-900 dark:text-slate-50">{title}</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-200">
            <tr>
              <th className="px-4 py-3 font-semibold">Čas</th>
              {visibleQuestions.map((q) => (
                <th key={q.key} className="px-3 py-3 font-semibold">
                  {q.title}
                </th>
              ))}
              <th className="px-4 py-3 font-semibold">Skupaj</th>
              {!compact ? <th className="px-4 py-3 font-semibold">Opombe</th> : null}
              <th className="w-8 px-2 py-3" aria-hidden />
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-b border-slate-100 last:border-0 dark:border-slate-800">
                <td className="whitespace-nowrap px-4 py-3 text-slate-700 dark:text-slate-300">
                  {new Date(row.created_at).toLocaleString("sl-SI")}
                </td>
                {visibleQuestions.map((q) => (
                  <td key={q.key} className="px-3 py-3 text-center font-semibold text-slate-900 dark:text-slate-50">
                    {row.answers[q.key] ?? "—"}
                  </td>
                ))}
                <td className="px-4 py-3 text-center font-semibold text-teal-800 dark:text-teal-400">
                  {rowAverage(row, keys).toFixed(2)}
                </td>
                {!compact ? (
                  <td className="max-w-[200px] truncate px-4 py-3 text-slate-600 dark:text-slate-400">
                    {row.notes || "—"}
                  </td>
                ) : null}
                <td className="px-2 py-3 text-slate-400">
                  <ChevronRight className="h-4 w-4" aria-hidden />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SurveyLinkCard({ organization }: { organization: OrganizationInfo }) {
  const [copied, setCopied] = useState(false);
  const url = organization.survey_url || publicSurveyUrl(organization.slug);
  const path = `/s/${organization.slug}`;

  async function copyLink() {
    const ok = await copyText(url);
    if (ok) {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <div className="rounded-2xl border border-teal-200 bg-teal-50/50 p-5 dark:border-teal-900 dark:bg-teal-950/30">
      <h2 className="font-semibold text-slate-900 dark:text-slate-50">Povezava do ankete za zaposlene</h2>
      <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
        Delite to povezavo z ekipo — anonimna oddaja brez prijave.
      </p>
      <input
        type="text"
        readOnly
        value={url}
        className="mt-3 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800"
        onFocus={(e) => e.target.select()}
      />
      <div className="mt-3 flex flex-wrap gap-2">
        <a
          href={path}
          target="_blank"
          rel="noreferrer"
          className="rounded-xl bg-teal-700 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-800"
        >
          Odpri anketo
        </a>
        <button
          type="button"
          onClick={() => void copyLink()}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold"
        >
          <Copy className="h-4 w-4" aria-hidden />
          {copied ? "Kopirano!" : "Kopiraj"}
        </button>
      </div>
    </div>
  );
}

export function DashboardOverview({
  stats,
  organization,
  loading,
  onRefresh,
}: {
  stats: DashboardStats | null;
  organization: OrganizationInfo | null;
  loading: boolean;
  onRefresh: () => void;
}) {
  const topCards = stats
    ? activeQuestions(stats)
        .slice(0, 4)
        .map((q) => ({
          label: q.title,
          value: stats.averages[q.key] ?? 0,
          icon: SCORE_ICONS[q.key] || Briefcase,
        }))
    : [];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50">Povprečne ocene</h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Skupaj oddaj: <strong className="text-slate-900 dark:text-slate-100">{stats?.count ?? "—"}</strong>
            {stats ? (
              <>
                {" "}
                · Opombe: <strong className="text-slate-900 dark:text-slate-100">{stats.notes_count}</strong>
              </>
            ) : null}
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

      {organization ? <SurveyLinkCard organization={organization} /> : null}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {topCards.map((c) => (
          <ScoreCard key={c.label} {...c} />
        ))}
      </div>

      {stats ? (
        <ResponsesTable
          rows={stats.recent.slice(0, 10)}
          questions={activeQuestions(stats)}
          title="Zadnji anonimni odgovori"
          compact
        />
      ) : null}
    </div>
  );
}

export function DashboardAnswers({ stats }: { stats: DashboardStats | null }) {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50">Vsi odgovori</h1>
      <p className="text-sm text-slate-600 dark:text-slate-400">
        Seznam vseh anonimnih oddaj za vašo organizacijo. Posameznih identitet ni mogoče določiti.
      </p>
      {stats ? (
        <ResponsesTable rows={stats.recent} questions={activeQuestions(stats)} title="Anonimni odgovori" />
      ) : null}
    </div>
  );
}

export function DashboardNotes({ stats }: { stats: DashboardStats | null }) {
  if (!stats) return null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50">Opombe zaposlenih</h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          Neobvezni komentarji iz ankete — anonimno, brez povezave z identiteto.
        </p>
      </div>

      {stats.notes.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-slate-200 bg-white p-8 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900">
          Še ni oddanih opomb.
        </p>
      ) : (
        <div className="space-y-4">
          {stats.notes.map((note) => (
            <article
              key={note.id}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
                <time dateTime={note.created_at}>{new Date(note.created_at).toLocaleString("sl-SI")}</time>
                <span>
                  Skupna ocena oddaje:{" "}
                  <strong className="text-teal-800 dark:text-teal-400">{note.average.toFixed(2)}</strong>
                </span>
              </div>
              <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-slate-800 dark:text-slate-200">
                {note.notes}
              </p>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

export function DashboardAnalytics({ stats }: { stats: DashboardStats | null }) {
  if (!stats) return null;

  const questions = activeQuestions(stats);
  const items = questions.map((q, i) => ({
    label: q.title,
    value: stats.averages[q.key] ?? 0,
    color: ["bg-teal-700", "bg-teal-600", "bg-teal-500", "bg-teal-600", "bg-teal-700", "bg-teal-500", "bg-teal-600", "bg-teal-700"][i % 8],
  }));

  const values = items.map((i) => i.value).filter((v) => v > 0);
  const overall = values.length ? values.reduce((a, b) => a + b, 0) / values.length : 0;

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
        <p className="text-xs text-slate-500">iz aktivnih vprašanj (lestvica 1–5)</p>
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
              <div className={`h-full rounded-full ${item.color}`} style={{ width: `${(item.value / 5) * 100}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export { DashboardQuestionsEditor as DashboardQuestions } from "@/components/dashboard/DashboardQuestionsEditor";

export function DashboardSettings({ organization }: { organization: OrganizationInfo | null }) {
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState("");

  const surveyPath = organization ? `/s/${organization.slug}` : "";
  const fullUrl = organization
    ? organization.survey_url || publicSurveyUrl(organization.slug)
    : "";

  async function copyLink() {
    if (!organization || !fullUrl) return;
    setCopyError("");
    const ok = await copyText(fullUrl);
    if (ok) {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
      return;
    }
    setCopyError("Kopiranje ni uspelo. Povezavo izberite ročno iz polja.");
  }

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50">Nastavitve</h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">Organizacija in povezava do ankete.</p>
      </div>

      {organization ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <h2 className="font-semibold text-slate-900 dark:text-slate-50">{organization.name}</h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">URL pot: /s/{organization.slug}</p>
          <label className="mt-3 block text-sm">
            <span className="mb-1 block font-medium text-slate-700 dark:text-slate-300">Javna povezava za zaposlene</span>
            <input
              type="text"
              readOnly
              value={fullUrl}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
              onFocus={(e) => e.target.select()}
            />
          </label>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <a
              href={surveyPath}
              target="_blank"
              rel="noreferrer"
              className="rounded-xl bg-teal-700 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-800 dark:bg-teal-600"
            >
              Odpri anketo
            </a>
            <button
              type="button"
              onClick={() => void copyLink()}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
            >
              <Copy className="h-4 w-4" aria-hidden />
              {copied ? "Kopirano!" : "Kopiraj povezavo"}
            </button>
          </div>
          {copyError ? <p className="mt-2 text-sm text-amber-700 dark:text-amber-400">{copyError}</p> : null}
        </div>
      ) : (
        <p className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-200">
          Podatki organizacije se še nalagajo. Če se povezava ne prikaže, dokončajte nastavitev na{" "}
          <a href="/setup" className="font-semibold underline">
            /setup
          </a>
          .
        </p>
      )}

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <h2 className="font-semibold text-slate-900 dark:text-slate-50">Zasebnost</h2>
        <ul className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-400">
          <li>· Ne shranjujemo imen, e-pošte ali IP naslovov zaposlenih.</li>
          <li>· V bazi so le ocene, neobvezne opombe in čas oddaje.</li>
          <li>· Podatki so ločeni po organizacijah (podjetjih).</li>
          <li>· Dostop do nadzorne plošče prek Clerk računa in organizacije.</li>
        </ul>
      </div>
    </div>
  );
}
