import { NextResponse } from "next/server";
import { isDbConfigured, prisma } from "@/lib/db";
import { getOrganizationBySlug } from "@/lib/org";
import { SCORE_FIELD_KEYS } from "@/lib/survey-questions";
import { parseNotes, parseScore } from "@/lib/submission-mapper";

export async function POST(request: Request) {
  if (!isDbConfigured() || !prisma) {
    return NextResponse.json({ ok: false, error: "Baza ni nastavljena." }, { status: 503 });
  }

  try {
    const body = (await request.json()) as Record<string, unknown>;
    const orgSlug = typeof body.org_slug === "string" ? body.org_slug.trim() : "";
    if (!orgSlug) {
      return NextResponse.json({ ok: false, error: "Manjka identifikator organizacije." }, { status: 400 });
    }

    const org = await getOrganizationBySlug(orgSlug);
    if (!org) {
      return NextResponse.json({ ok: false, error: "Anketa za to podjetje ni na voljo." }, { status: 404 });
    }

    const scores: Record<string, number> = {};
    for (const key of SCORE_FIELD_KEYS) {
      const value = parseScore(body[key]);
      if (value === null) {
        return NextResponse.json({ ok: false, error: "Vsa vprašanja morajo biti ocenjena (1–5)." }, { status: 400 });
      }
      scores[key] = value;
    }

    const notes = parseNotes(body.notes);
    if (body.notes && notes === null && typeof body.notes === "string" && body.notes.trim()) {
      return NextResponse.json({ ok: false, error: "Opombe so predolge (največ 2000 znakov)." }, { status: 400 });
    }

    const data = {
      organizationId: org.id,
      workload: scores.workload,
      feelingValued: scores.feeling_valued,
      enoughResources: scores.enough_resources,
      workLifeBalance: scores.work_life_balance,
      teamCollaboration: scores.team_collaboration,
      managerSupport: scores.manager_support,
      jobSatisfaction: scores.job_satisfaction,
      recommendEmployer: scores.recommend_employer,
      notes,
    };

    await prisma.submission.create({ data });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[submit]", err);
    return NextResponse.json({ ok: false, error: "Shranjevanje ni uspelo." }, { status: 500 });
  }
}
