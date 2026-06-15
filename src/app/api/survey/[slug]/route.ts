import { NextResponse } from "next/server";
import { isDbConfigured, prisma } from "@/lib/db";
import { getOrganizationBySlug } from "@/lib/org";
import {
  getActiveQuestions,
  mapQuestionRow,
  mapSurveyConfig,
  seedDefaultQuestions,
} from "@/lib/survey-service";

type Props = { params: Promise<{ slug: string }> };

export async function GET(_request: Request, { params }: Props) {
  if (!isDbConfigured() || !prisma) {
    return NextResponse.json({ ok: false, error: "Baza ni nastavljena." }, { status: 503 });
  }

  try {
    const { slug } = await params;
    const org = await getOrganizationBySlug(slug);
    if (!org) {
      return NextResponse.json({ ok: false, error: "Anketa ni na voljo." }, { status: 404 });
    }

    await seedDefaultQuestions(org.id);
    const questions = await getActiveQuestions(org.id);

    return NextResponse.json({
      ok: true,
      survey: {
        config: mapSurveyConfig(org),
        questions: questions.map(mapQuestionRow),
      },
    });
  } catch (err) {
    console.error("[survey config]", err);
    return NextResponse.json({ ok: false, error: "Nalaganje ankete ni uspelo." }, { status: 500 });
  }
}
