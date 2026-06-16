"use client";

import { useAuth, useOrganization } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import {
  DashboardAnalytics,
  DashboardAnswers,
  DashboardNotes,
  DashboardOverview,
  DashboardQuestions,
  DashboardSettings,
} from "@/components/dashboard/DashboardPanels";
import { DashboardChrome, type DashboardSection } from "@/components/layout/DashboardChrome";
import { publicSurveyUrl } from "@/lib/app-url";
import type { DashboardStats, OrganizationInfo } from "@/lib/types";

export function DashboardView() {
  const router = useRouter();
  const { isLoaded: authLoaded, isSignedIn } = useAuth();
  const { organization, isLoaded: orgLoaded } = useOrganization();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [orgInfo, setOrgInfo] = useState<OrganizationInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [section, setSection] = useState<DashboardSection>("pregled");

  const loadOrganization = useCallback(async () => {
    const res = await fetch("/api/organization/setup");
    const data = (await res.json()) as {
      ok?: boolean;
      organization?: { id: string; name: string; slug: string; survey_url?: string };
      needs_setup?: boolean;
    };
    if (data.needs_setup) {
      router.replace("/setup");
      return false;
    }
    if (data.organization) {
      setOrgInfo({
        id: data.organization.id,
        name: data.organization.name,
        slug: data.organization.slug,
        setup_completed: true,
        survey_url:
          data.organization.survey_url || publicSurveyUrl(data.organization.slug, window.location.origin),
      });
      return true;
    }
    return false;
  }, [router]);

  const loadStats = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/dashboard/stats");
      const data = (await res.json()) as {
        ok?: boolean;
        stats?: DashboardStats;
        organization?: { id: string; name: string; slug: string; survey_url?: string };
        error?: string;
      };

      if (res.status === 403) {
        router.replace("/setup");
        return;
      }
      if (!res.ok || !data.ok) {
        setError(data.error || "Nalaganje ni uspelo.");
        return;
      }

      if (data.stats) setStats(data.stats);
      if (data.organization) {
        setOrgInfo({
          id: data.organization.id,
          name: data.organization.name,
          slug: data.organization.slug,
          setup_completed: true,
          survey_url:
            data.organization.survey_url || publicSurveyUrl(data.organization.slug, window.location.origin),
        });
      }
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    if (!authLoaded) return;
    if (!isSignedIn) {
      router.replace("/sign-in");
      return;
    }
    if (!orgLoaded) return;
    if (!organization) {
      setLoading(false);
      return;
    }
    void (async () => {
      const ok = await loadOrganization();
      if (ok) await loadStats();
      else setLoading(false);
    })();
  }, [authLoaded, isSignedIn, orgLoaded, organization, loadOrganization, loadStats, router]);

  if (!authLoaded || !orgLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100 dark:bg-slate-950">
        <p className="text-sm text-slate-600 dark:text-slate-400">Nalagam...</p>
      </div>
    );
  }

  if (!organization) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100 p-4 dark:bg-slate-950">
        <div className="max-w-md rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50">Izberite organizacijo</h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Za dostop do nadzorne plošče izberite ali ustvarite podjetje v meniju zgoraj desno.
          </p>
        </div>
      </div>
    );
  }

  return (
    <DashboardChrome active={section} onNavigate={setSection} orgName={orgInfo?.name || organization.name}>
      {error ? (
        <p className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
          {error}
        </p>
      ) : null}
      {section === "pregled" ? (
        <DashboardOverview
          stats={stats}
          organization={orgInfo}
          loading={loading}
          onRefresh={() => void loadStats()}
        />
      ) : null}
      {section === "odgovori" ? <DashboardAnswers stats={stats} /> : null}
      {section === "opombe" ? <DashboardNotes stats={stats} /> : null}
      {section === "analitika" ? <DashboardAnalytics stats={stats} /> : null}
      {section === "vprasanja" ? <DashboardQuestions onSaved={() => void loadStats()} /> : null}
      {section === "nastavitve" ? <DashboardSettings organization={orgInfo} /> : null}
    </DashboardChrome>
  );
}
