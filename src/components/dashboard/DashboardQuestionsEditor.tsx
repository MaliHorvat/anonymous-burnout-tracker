"use client";

import { GripVertical, Plus, Save, Trash2 } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import type { SurveyQuestionRow, SurveySettingsInput } from "@/lib/types";

type EditableQuestion = {
  id?: string;
  key?: string;
  title: string;
  body: string;
  label: string;
  active: boolean;
};

const emptyQuestion = (): EditableQuestion => ({
  title: "",
  body: "",
  label: "",
  active: true,
});

export function DashboardQuestionsEditor({ onSaved }: { onSaved?: () => void }) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [notesEnabled, setNotesEnabled] = useState(true);
  const [notesLabel, setNotesLabel] = useState("");
  const [notesPlaceholder, setNotesPlaceholder] = useState("");
  const [questions, setQuestions] = useState<EditableQuestion[]>([]);

  useEffect(() => {
    void (async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/dashboard/questions");
        const data = (await res.json()) as {
          ok?: boolean;
          settings?: SurveySettingsInput;
          error?: string;
        };
        if (!res.ok || !data.ok || !data.settings) {
          setError(data.error || "Nalaganje ni uspelo.");
          return;
        }
        setTitle(data.settings.title);
        setSubtitle(data.settings.subtitle);
        setNotesEnabled(data.settings.notes_enabled);
        setNotesLabel(data.settings.notes_label);
        setNotesPlaceholder(data.settings.notes_placeholder);
        setQuestions(
          data.settings.questions.map((q) => ({
            id: q.id,
            key: q.key,
            title: q.title,
            body: q.body,
            label: q.label,
            active: q.active ?? true,
          })),
        );
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  function moveQuestion(index: number, direction: -1 | 1) {
    const visible = questions.filter((q) => q.active !== false);
    const item = visible[index];
    const fullIndex = questions.indexOf(item);
    const targetVisible = index + direction;
    if (targetVisible < 0 || targetVisible >= visible.length) return;
    const targetItem = visible[targetVisible];
    const targetIndex = questions.indexOf(targetItem);
    const next = [...questions];
    [next[fullIndex], next[targetIndex]] = [next[targetIndex], next[fullIndex]];
    setQuestions(next);
  }

  function updateQuestion(index: number, patch: Partial<EditableQuestion>) {
    const visible = questions.filter((q) => q.active !== false);
    const item = visible[index];
    const fullIndex = questions.indexOf(item);
    setQuestions((prev) => prev.map((q, i) => (i === fullIndex ? { ...q, ...patch } : q)));
  }

  function removeQuestion(index: number) {
    const visible = questions.filter((q) => q.active !== false);
    if (visible.length <= 1) return;
    const item = visible[index];
    const fullIndex = questions.indexOf(item);
    setQuestions((prev) => {
      const itemToRemove = prev[fullIndex];
      if (itemToRemove.id) return prev.map((q, i) => (i === fullIndex ? { ...q, active: false } : q));
      return prev.filter((_, i) => i !== fullIndex);
    });
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSaving(true);
    try {
      const payload: SurveySettingsInput = {
        title,
        subtitle,
        notes_enabled: notesEnabled,
        notes_label: notesLabel,
        notes_placeholder: notesPlaceholder,
        questions,
      };

      const res = await fetch("/api/dashboard/questions", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await res.json()) as { ok?: boolean; settings?: SurveySettingsInput; error?: string };
      if (!res.ok || !data.ok || !data.settings) {
        setError(data.error || "Shranjevanje ni uspelo.");
        return;
      }

      setQuestions(
        data.settings.questions.map((q) => ({
          id: q.id,
          key: q.key,
          title: q.title,
          body: q.body,
          label: q.label,
          active: q.active ?? true,
        })),
      );
      setSuccess("Anketa je shranjena.");
      onSaved?.();
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <p className="text-sm text-slate-600 dark:text-slate-400">Nalagam vprašanja...</p>;
  }

  const visibleQuestions = questions.filter((q) => q.active !== false);

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50">Urejanje ankete</h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          Prilagodite vprašanja, naslov ankete in polje za opombe. Spremembe veljajo takoj za nove oddaje.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <h2 className="font-semibold text-slate-900 dark:text-slate-50">Splošne nastavitve</h2>
        <div className="mt-4 space-y-3">
          <label className="block text-sm">
            <span className="mb-1 block text-slate-600 dark:text-slate-400">Naslov ankete</span>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 dark:border-slate-600 dark:bg-slate-800"
              required
            />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block text-slate-600 dark:text-slate-400">Podnaslov</span>
            <input
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 dark:border-slate-600 dark:bg-slate-800"
            />
          </label>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <h2 className="font-semibold text-slate-900 dark:text-slate-50">Opombe zaposlenih</h2>
        <label className="mt-4 flex items-center gap-2 text-sm">
          <input type="checkbox" checked={notesEnabled} onChange={(e) => setNotesEnabled(e.target.checked)} />
          <span>Prikaži polje za neobvezne opombe</span>
        </label>
        {notesEnabled ? (
          <div className="mt-3 space-y-3">
            <label className="block text-sm">
              <span className="mb-1 block text-slate-600 dark:text-slate-400">Oznaka polja</span>
              <input
                value={notesLabel}
                onChange={(e) => setNotesLabel(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 dark:border-slate-600 dark:bg-slate-800"
              />
            </label>
            <label className="block text-sm">
              <span className="mb-1 block text-slate-600 dark:text-slate-400">Navodilo / placeholder</span>
              <textarea
                value={notesPlaceholder}
                onChange={(e) => setNotesPlaceholder(e.target.value)}
                rows={2}
                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 dark:border-slate-600 dark:bg-slate-800"
              />
            </label>
          </div>
        ) : null}
      </div>

      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-semibold text-slate-900 dark:text-slate-50">Vprašanja (1–5)</h2>
          <button
            type="button"
            onClick={() => setQuestions((prev) => [...prev, emptyQuestion()])}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-medium hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800"
          >
            <Plus className="h-4 w-4" aria-hidden />
            Dodaj vprašanje
          </button>
        </div>

        {visibleQuestions.map((q, index) => (
          <div
            key={q.id || `new-${index}-${q.label}`}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900"
          >
            <div className="mb-4 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-sm font-semibold text-teal-800 dark:text-teal-300">
                <GripVertical className="h-4 w-4 opacity-50" aria-hidden />
                Vprašanje {index + 1}
              </div>
              <div className="flex gap-1">
                <button type="button" onClick={() => moveQuestion(index, -1)} className="rounded-lg border px-2 py-1 text-xs">
                  ↑
                </button>
                <button type="button" onClick={() => moveQuestion(index, 1)} className="rounded-lg border px-2 py-1 text-xs">
                  ↓
                </button>
                <button
                  type="button"
                  onClick={() => removeQuestion(index)}
                  className="rounded-lg border px-2 py-1 text-xs text-red-600"
                  disabled={visibleQuestions.length <= 1}
                >
                  <Trash2 className="h-3.5 w-3.5" aria-hidden />
                </button>
              </div>
            </div>
            <div className="grid gap-3">
              <label className="block text-sm">
                <span className="mb-1 block text-slate-600 dark:text-slate-400">Kratki naslov (admin)</span>
                <input
                  value={q.title}
                  onChange={(e) => updateQuestion(index, { title: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2.5 dark:border-slate-600 dark:bg-slate-800"
                  required
                />
              </label>
              <label className="block text-sm">
                <span className="mb-1 block text-slate-600 dark:text-slate-400">Vprašanje za zaposlene</span>
                <input
                  value={q.label}
                  onChange={(e) => updateQuestion(index, { label: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2.5 dark:border-slate-600 dark:bg-slate-800"
                  required
                />
              </label>
              <label className="block text-sm">
                <span className="mb-1 block text-slate-600 dark:text-slate-400">Pomožno besedilo (neobvezno)</span>
                <textarea
                  value={q.body}
                  onChange={(e) => updateQuestion(index, { body: e.target.value })}
                  rows={2}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2.5 dark:border-slate-600 dark:bg-slate-800"
                />
              </label>
            </div>
          </div>
        ))}
      </div>

      {error ? <p className="text-sm text-red-600 dark:text-red-400">{error}</p> : null}
      {success ? <p className="text-sm text-emerald-700 dark:text-emerald-400">{success}</p> : null}

      <button
        type="submit"
        disabled={saving}
        className="inline-flex items-center gap-2 rounded-xl bg-teal-700 px-5 py-3 text-sm font-semibold text-white hover:bg-teal-800 disabled:opacity-60"
      >
        <Save className="h-4 w-4" aria-hidden />
        {saving ? "Shranjujem..." : "Shrani anketo"}
      </button>
    </form>
  );
}
