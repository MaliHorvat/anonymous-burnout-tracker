import { NextResponse } from "next/server";
import { isDbConfigured, prisma } from "@/lib/db";
import { requireDashboardOrganization } from "@/lib/org";
import { averageScores, rowAverage } from "@/lib/survey-questions";
import { mapSubmissionRow } from "@/lib/submission-mapper";
import type { DashboardStats } from "@/lib/types";

export async function GET() {
  const orgResult = await requireDashboardOrganization();
  if (!orgResult.ok) {
    const status = orgResult.reason === "unauthenticated" ? 401 : 403;
    const error =
      orgResult.reason === "no_clerk_org"
        ? "Izberite organizacijo v meniju zgoraj desno."
        : orgResult.reason === "not_setup"
          ? "Organizacija še ni nastavljena."
          : "Neavtorizirano.";
    return NextResponse.json({ ok: false, error }, { status });
  }

  if (!isDbConfigured() || !prisma) {
    return NextResponse.json({ ok: false, error: "Baza ni nastavljena." }, { status: 503 });
  }

  try {
    const rows = await prisma.submission.findMany({
      where: { organizationId: orgResult.org.id },
      orderBy: { createdAt: "desc" },
      take: 500,
    });

    const mapped = rows.map(mapSubmissionRow);
    const scoreRows = mapped.map(({ workload, feeling_valued, enough_resources, work_life_balance, team_collaboration, manager_support, job_satisfaction, recommend_employer }) => ({
      workload,
      feeling_valued,
      enough_resources,
      work_life_balance,
      team_collaboration,
      manager_support,
      job_satisfaction,
      recommend_employer,
    }));

    const stats: DashboardStats = {
      count: rows.length,
      notes_count: mapped.filter((r) => r.notes).length,
      averages: averageScores(scoreRows),
      recent: mapped.slice(0, 50),
      notes: mapped
        .filter((r) => r.notes)
        .slice(0, 100)
        .map((r) => ({
          id: r.id,
          created_at: r.created_at,
          notes: r.notes!,
          average: rowAverage(r),
        })),
    };

    return NextResponse.json({ ok: true, stats, organization: orgResult.org });
  } catch (err) {
    console.error("[dashboard stats]", err);
    return NextResponse.json({ ok: false, error: "Branje podatkov ni uspelo." }, { status: 500 });
  }
}
