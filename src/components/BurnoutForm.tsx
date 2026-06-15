"use client";

import { FormEvent, useMemo, useState } from "react";
import { MessageSquarePlus, ShieldCheck } from "lucide-react";
import { NOTES_MAX_LENGTH } from "@/lib/survey-service";
import type { PublicSurvey } from "@/lib/types";

type Props = {
  orgSlug: string;
  survey: PublicSurvey;
};

export function BurnoutForm({ orgSlug, survey }: Props) {
  const questions = survey.questions;
  const [values, setValues] = useState<Record<string, number | null>>(() =>
    Object.fromEntries(questions.map((q) => [q.key, null])),
  );
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const questionLabels = useMemo(
    () => questions.map((q, i) => ({ ...q, numberedLabel: `${i + 1}. ${q.label}` })),
    [questions],
  );

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    for (const q of questions) {
      if (values[q.key] === null || values[q.key] === undefined) {
        setError("Prosimo, ocenite vsa vprašanja (1–5).");
        return;
      }
    }

    setLoading(true);
    try {
      const answers: Record<string, number> = {};
      for (const q of questions) answers[q.key] = values[q.key]!;

      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          org_slug: orgSlug,
          answers,
          notes: survey.config.notes_enabled ? notes.trim() || null : null,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) {
        setError(data.error || "Oddaja ni uspela.");
        return;
      }
      setDone(true);
    } catch {
      setError("Omrežna napaka. Poskusite znova.");
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-white p-8 text-center shadow-sm dark:border-emerald-800 dark:bg-slate-900">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
          <ShieldCheck className="h-7 w-7" aria-hidden />
        </div>
        <p className="mt-4 text-xl font-semibold text-slate-900 dark:text-slate-50">Hvala za vaš odgovor</p>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          Vaši podatki so bili anonimno shranjeni. Lahko zaprete stran.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {questionLabels.map((q) => (
        <fieldset
          key={q.key}
          className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900"
        >
          <legend className="text-sm font-semibold text-slate-900 dark:text-slate-50">{q.numberedLabel}</legend>
          {q.body ? <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{q.body}</p> : null}
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">1 = zelo slabo · 5 = zelo dobro</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {[1, 2, 3, 4, 5].map((n) => {
              const selected = values[q.key] === n;
              return (
                <label
                  key={n}
                  className={`flex h-11 min-w-11 cursor-pointer items-center justify-center rounded-xl border px-3.5 text-sm font-semibold transition ${
                    selected
                      ? "border-teal-700 bg-teal-700 text-white shadow-sm dark:border-teal-500 dark:bg-teal-600"
                      : "border-teal-700/30 bg-white text-teal-800 hover:border-teal-600 hover:bg-teal-50 dark:border-teal-500/40 dark:bg-slate-800 dark:text-teal-300 dark:hover:border-teal-500"
                  }`}
                >
                  <input
                    type="radio"
                    name={q.key}
                    value={n}
                    className="sr-only"
                    checked={selected}
                    onChange={() => setValues((v) => ({ ...v, [q.key]: n }))}
                  />
                  {n}
                </label>
              );
            })}
          </div>
        </fieldset>
      ))}

      {survey.config.notes_enabled ? (
        <fieldset className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <legend className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-slate-50">
            <MessageSquarePlus className="h-4 w-4 text-teal-700 dark:text-teal-400" aria-hidden />
            {survey.config.notes_label}
          </legend>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value.slice(0, NOTES_MAX_LENGTH))}
            rows={4}
            placeholder={survey.config.notes_placeholder}
            className="mt-3 w-full resize-y rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
          />
          <p className="mt-1 text-right text-xs text-slate-500">
            {notes.length}/{NOTES_MAX_LENGTH}
          </p>
        </fieldset>
      ) : null}

      {error ? <p className="text-center text-sm text-red-600 dark:text-red-400">{error}</p> : null}

      <button
        type="submit"
        disabled={loading}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-teal-700 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-800 disabled:opacity-60 dark:bg-teal-600 dark:hover:bg-teal-500"
      >
        <ShieldCheck className="h-4 w-4" aria-hidden />
        {loading ? "Pošiljam..." : "Oddaj anonimno"}
      </button>
    </form>
  );
}
