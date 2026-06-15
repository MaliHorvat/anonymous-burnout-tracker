import { NextResponse } from "next/server";
import { isDbConfigured, prisma } from "@/lib/db";
import { getOrganizationBySlug } from "@/lib/org";
import {
  getActiveQuestions,
  NOTES_MAX_LENGTH,
  seedDefaultQuestions,
} from "@/lib/survey-service";
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

    await seedDefaultQuestions(org.id);
    const questions = await getActiveQuestions(org.id);
    const answersInput =
      body.answers && typeof body.answers === "object" && !Array.isArray(body.answers)
        ? (body.answers as Record<string, unknown>)
        : body;

    const answers: Record<string, number> = {};
    for (const q of questions) {
      const value = parseScore(answersInput[q.key] ?? body[q.key]);
      if (value === null) {
        return NextResponse.json({ ok: false, error: "Vsa vprašanja morajo biti ocenjena (1–5)." }, { status: 400 });
      }
      answers[q.key] = value;
    }

    let notes: string | null = null;
    if (org.notesEnabled) {
      notes = parseNotes(body.notes, NOTES_MAX_LENGTH);
      if (body.notes && notes === null && typeof body.notes === "string" && body.notes.trim()) {
        return NextResponse.json({ ok: false, error: "Opombe so predolge." }, { status: 400 });
      }
    }

    await prisma.submission.create({
      data: {
        organizationId: org.id,
        answers,
        notes,
      },
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[submit]", err);
    return NextResponse.json({ ok: false, error: "Shranjevanje ni uspelo." }, { status: 500 });
  }
}
