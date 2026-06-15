"use client";

import { CreateOrganization, OrganizationSwitcher, useAuth, useOrganization, useUser } from "@clerk/nextjs";
import { Building2, Link2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { BurnoutLogo } from "@/components/brand/BurnoutLogo";
import { slugify } from "@/lib/slug";

export function SetupView() {
  const router = useRouter();
  const { isLoaded: authLoaded, isSignedIn } = useAuth();
  const { isLoaded: userLoaded } = useUser();
  const { organization, isLoaded: orgLoaded } = useOrganization();
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (organization?.name && !name) setName(organization.name);
  }, [organization?.name, name]);

  useEffect(() => {
    if (!slugTouched && name) setSlug(slugify(name));
  }, [name, slugTouched]);

  useEffect(() => {
    if (!authLoaded) return;
    if (!isSignedIn) router.replace("/sign-in");
  }, [authLoaded, isSignedIn, router]);

  useEffect(() => {
    if (!userLoaded || !orgLoaded) return;
    void (async () => {
      try {
        const res = await fetch("/api/organization/setup");
        const data = (await res.json()) as { needs_setup?: boolean };
        if (res.ok && data.needs_setup === false) {
          router.replace("/dashboard");
          return;
        }
      } finally {
        setChecking(false);
      }
    })();
  }, [userLoaded, orgLoaded, router]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/organization/setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, slug }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) {
        setError(data.error || "Nastavitev ni uspela.");
        return;
      }
      router.replace("/dashboard");
    } catch {
      setError("Omrežna napaka. Poskusite znova.");
    } finally {
      setLoading(false);
    }
  }

  if (!authLoaded || !userLoaded || !orgLoaded || checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100 dark:bg-slate-950">
        <p className="text-sm text-slate-600 dark:text-slate-400">Nalagam...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950">
      <header className="border-b border-slate-200 bg-white px-4 py-4 dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto flex max-w-2xl items-center justify-between gap-3">
          <BurnoutLogo />
          <OrganizationSwitcher hidePersonal afterSelectOrganizationUrl="/setup" />
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-10">
        <div className="mb-8 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300">
            <Building2 className="h-7 w-7" aria-hidden />
          </div>
          <h1 className="mt-4 text-2xl font-bold text-slate-900 dark:text-slate-50">Začetna nastavitev podjetja</h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Ustvarite organizacijo in pridobite javno povezavo do anonimne ankete za vaše zaposlene.
          </p>
        </div>

        {!organization ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <h2 className="font-semibold text-slate-900 dark:text-slate-50">1. Ustvarite organizacijo</h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              Najprej ustvarite podjetje v Clerk. Nato nadaljujte z nastavitvijo ankete.
            </p>
            <div className="mt-6 flex justify-center">
              <CreateOrganization afterCreateOrganizationUrl="/setup" />
            </div>
          </div>
        ) : (
          <form
            onSubmit={onSubmit}
            className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900"
          >
            <div>
              <h2 className="font-semibold text-slate-900 dark:text-slate-50">2. Podatki ankete</h2>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                Organizacija: <strong>{organization.name}</strong>
              </p>
            </div>

            <label className="block text-sm">
              <span className="mb-1 block font-medium text-slate-700 dark:text-slate-300">Ime podjetja</span>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-slate-900 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
                required
                minLength={2}
              />
            </label>

            <label className="block text-sm">
              <span className="mb-1 block font-medium text-slate-700 dark:text-slate-300">URL naslov ankete</span>
              <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 dark:border-slate-600 dark:bg-slate-800/80">
                <Link2 className="h-4 w-4 shrink-0 text-slate-400" aria-hidden />
                <span className="text-slate-500 dark:text-slate-400">/s/</span>
                <input
                  value={slug}
                  onChange={(e) => {
                    setSlugTouched(true);
                    setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""));
                  }}
                  className="min-w-0 flex-1 bg-transparent text-slate-900 outline-none dark:text-slate-100"
                  required
                  pattern="[a-z0-9]([a-z0-9-]{0,46}[a-z0-9])?"
                  title="Male črke, številke in vezaji"
                />
              </div>
              <p className="mt-1 text-xs text-slate-500">Ta povezavo delite z zaposlenimi — anonimna anketa.</p>
            </label>

            {error ? <p className="text-sm text-red-600 dark:text-red-400">{error}</p> : null}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-teal-700 py-3 text-sm font-semibold text-white hover:bg-teal-800 disabled:opacity-60 dark:bg-teal-600"
            >
              {loading ? "Shranjujem..." : "Dokončaj nastavitev"}
            </button>
          </form>
        )}
      </main>
    </div>
  );
}
