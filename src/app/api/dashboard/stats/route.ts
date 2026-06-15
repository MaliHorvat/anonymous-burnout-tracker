import { NextResponse } from "next/server";
import { isDbConfigured, prisma } from "@/lib/db";
import { requireDashboardOrganization } from "@/lib/org";
import {
  averageForQuestions,
  getAllQuestions,
  mapQuestionRow,
  mapSurveyConfig,
  rowAverageFromAnswers,
  seedDefaultQuestions,
} from "@/lib/survey-service";
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
    await seedDefaultQuestions(orgResult.org.id);
    const org = await prisma.organization.findUniqueOrThrow({ where: { id: orgResult.org.id } });
    const questions = await getAllQuestions(orgResult.org.id);
    const activeQuestions = questions.filter((q) => q.active);
    const questionRows = questions.map(mapQuestionRow);
    const activeKeys = activeQuestions.map((q) => q.key);

    const rows = await prisma.submission.findMany({
      where: { organizationId: orgResult.org.id },
      orderBy: { createdAt: "desc" },
      take: 500,
    });

    const mapped = rows.map(mapSubmissionRow);
    const stats: DashboardStats = {
      count: rows.length,
      notes_count: mapped.filter((r) => r.notes).length,
      config: mapSurveyConfig(org),
      questions: questionRows,
      averages: averageForQuestions(
        mapped.map((r) => r.answers),
        activeKeys.length > 0 ? activeKeys : questions.map((q) => q.key),
      ),
      recent: mapped.slice(0, 50),
      notes: mapped
        .filter((r) => r.notes)
        .slice(0, 100)
        .map((r) => ({
          id: r.id,
          created_at: r.created_at,
          notes: r.notes!,
          average: rowAverageFromAnswers(r.answers, activeKeys),
        })),
    };

    return NextResponse.json({ ok: true, stats, organization: orgResult.org });
  } catch (err) {
    console.error("[dashboard stats]", err);
    return NextResponse.json({ ok: false, error: "Branje podatkov ni uspelo." }, { status: 500 });
  }
}
