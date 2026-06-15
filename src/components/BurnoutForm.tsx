"use client";

import { FormEvent, useState } from "react";

const QUESTIONS = [
  { key: "workload", label: "1. Kakšna je vaša delovna obremenitev?" },
  { key: "feeling_valued", label: "2. Se počutite cenjeni na delovnem mestu?" },
  { key: "enough_resources", label: "3. Imate dovolj virov za opravljanje dela?" },
] as const;

type FieldKey = (typeof QUESTIONS)[number]["key"];

export function BurnoutForm() {
  const [values, setValues] = useState<Record<FieldKey, number | null>>({
    workload: null,
    feeling_valued: null,
    enough_resources: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    if (values.workload === null || values.feeling_valued === null || values.enough_resources === null) {
      setError("Prosimo, ocenite vsa tri vprašanja (1–5).");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
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
      <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-6 text-center">
        <p className="text-lg font-semibold text-emerald-900">Hvala za vaš odgovor</p>
        <p className="mt-2 text-sm text-emerald-800">
          Vaši podatki so bili anonimno shranjeni. Lahko zaprete stran.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      {QUESTIONS.map((q) => (
        <fieldset key={q.key} className="space-y-3">
          <legend className="text-sm font-medium text-slate-800">{q.label}</legend>
          <div className="flex flex-wrap gap-2">
            {[1, 2, 3, 4, 5].map((n) => (
              <label
                key={n}
                className={`flex h-11 min-w-11 cursor-pointer items-center justify-center rounded-lg border px-3 text-sm font-medium transition ${
                  values[q.key] === n
                    ? "border-teal-600 bg-teal-600 text-white"
                    : "border-slate-200 bg-white text-slate-700 hover:border-teal-300"
                }`}
              >
                <input
                  type="radio"
                  name={q.key}
                  value={n}
                  className="sr-only"
                  checked={values[q.key] === n}
                  onChange={() => setValues((v) => ({ ...v, [q.key]: n }))}
                />
                {n}
              </label>
            ))}
          </div>
          <p className="text-xs text-slate-500">1 = zelo slabo · 5 = zelo dobro</p>
        </fieldset>
      ))}

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-teal-600 py-3 text-sm font-semibold text-white hover:bg-teal-700 disabled:opacity-60"
      >
        {loading ? "Pošiljam..." : "Oddaj anonimno"}
      </button>
    </form>
  );
}
