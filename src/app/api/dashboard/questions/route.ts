import { NextResponse } from "next/server";
import { isDbConfigured, prisma } from "@/lib/db";
import { requireDashboardOrganization } from "@/lib/org";
import { surveyPublicUrl } from "@/lib/org";
import {
  getAllQuestions,
  mapQuestionRow,
  mapSurveyConfig,
  seedDefaultQuestions,
  uniqueQuestionKey,
} from "@/lib/survey-service";
import type { SurveySettingsInput } from "@/lib/types";

export async function GET() {
  const orgResult = await requireDashboardOrganization();
  if (!orgResult.ok) {
    const status = orgResult.reason === "unauthenticated" ? 401 : 403;
    return NextResponse.json({ ok: false, error: "Neavtorizirano." }, { status });
  }

  if (!isDbConfigured() || !prisma) {
    return NextResponse.json({ ok: false, error: "Baza ni nastavljena." }, { status: 503 });
  }

  try {
    await seedDefaultQuestions(orgResult.org.id);
    const org = await prisma.organization.findUniqueOrThrow({ where: { id: orgResult.org.id } });
    const questions = await getAllQuestions(orgResult.org.id);

    return NextResponse.json({
      ok: true,
      settings: {
        title: org.surveyTitle,
        subtitle: org.surveySubtitle,
        notes_enabled: org.notesEnabled,
        notes_label: org.notesLabel,
        notes_placeholder: org.notesPlaceholder,
        questions: questions.map(mapQuestionRow),
      },
      config: mapSurveyConfig(org),
      questions: questions.map(mapQuestionRow),
    });
  } catch (err) {
    console.error("[dashboard questions GET]", err);
    return NextResponse.json({ ok: false, error: "Branje ni uspelo." }, { status: 500 });
  }
}

function trim(value: unknown, max: number): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export async function PUT(request: Request) {
  const orgResult = await requireDashboardOrganization();
  if (!orgResult.ok) {
    const status = orgResult.reason === "unauthenticated" ? 401 : 403;
    return NextResponse.json({ ok: false, error: "Neavtorizirano." }, { status });
  }

  if (!isDbConfigured() || !prisma) {
    return NextResponse.json({ ok: false, error: "Baza ni nastavljena." }, { status: 503 });
  }

  try {
    const body = (await request.json()) as SurveySettingsInput;
    const title = trim(body.title, 255);
    const subtitle = trim(body.subtitle, 500);
    const notesLabel = trim(body.notes_label, 255);
    const notesPlaceholder = trim(body.notes_placeholder, 500);
    const questionsInput = Array.isArray(body.questions) ? body.questions : [];

    if (!title) {
      return NextResponse.json({ ok: false, error: "Naslov ankete je obvezen." }, { status: 400 });
    }
    if (questionsInput.filter((q) => q.active !== false).length === 0) {
      return NextResponse.json({ ok: false, error: "Vsaj eno aktivno vprašanje je obvezno." }, { status: 400 });
    }

    for (const q of questionsInput) {
      if (!trim(q.title, 255) || !trim(q.label, 500)) {
        return NextResponse.json({ ok: false, error: "Vsako vprašanje potrebuje naslov in besedilo." }, { status: 400 });
      }
    }

    const existing = await getAllQuestions(orgResult.org.id);
    const existingById = new Map(existing.map((q) => [q.id, q]));
    const usedKeys = new Set(existing.map((q) => q.key));
    const keepIds = new Set<string>();

    await prisma.$transaction(async (tx) => {
      await tx.organization.update({
        where: { id: orgResult.org.id },
        data: {
          surveyTitle: title,
          surveySubtitle: subtitle || "Vaši odgovori so popolnoma anonimni.",
          notesEnabled: body.notes_enabled !== false,
          notesLabel: notesLabel || "Dodatne opombe (neobvezno)",
          notesPlaceholder: notesPlaceholder || "Delite morebitne predloge, skrbi ali opombe.",
        },
      });

      for (let i = 0; i < questionsInput.length; i += 1) {
        const input = questionsInput[i];
        const titleQ = trim(input.title, 255);
        const bodyQ = trim(input.body, 500);
        const labelQ = trim(input.label, 500);
        const active = input.active !== false;

        if (input.id && existingById.has(input.id)) {
          keepIds.add(input.id);
          await tx.surveyQuestion.update({
            where: { id: input.id },
            data: { title: titleQ, body: bodyQ, label: labelQ, sortOrder: i, active },
          });
          continue;
        }

        const baseKey = input.key || titleQ;
        const key = uniqueQuestionKey(baseKey, usedKeys);
        const created = await tx.surveyQuestion.create({
          data: {
            organizationId: orgResult.org.id,
            key,
            title: titleQ,
            body: bodyQ,
            label: labelQ,
            sortOrder: i,
            active,
          },
        });
        keepIds.add(created.id);
      }

      const toDelete = existing.filter((q) => !keepIds.has(q.id)).map((q) => q.id);
      if (toDelete.length > 0) {
        await tx.surveyQuestion.deleteMany({ where: { id: { in: toDelete }, organizationId: orgResult.org.id } });
      }
    });

    const org = await prisma.organization.findUniqueOrThrow({ where: { id: orgResult.org.id } });
    const questions = await getAllQuestions(orgResult.org.id);

    return NextResponse.json({
      ok: true,
      settings: {
        title: org.surveyTitle,
        subtitle: org.surveySubtitle,
        notes_enabled: org.notesEnabled,
        notes_label: org.notesLabel,
        notes_placeholder: org.notesPlaceholder,
        questions: questions.map(mapQuestionRow),
      },
      config: mapSurveyConfig(org),
      questions: questions.map(mapQuestionRow),
    });
  } catch (err) {
    console.error("[dashboard questions PUT]", err);
    return NextResponse.json({ ok: false, error: "Shranjevanje ni uspelo." }, { status: 500 });
  }
}

/** Obnovi 8 privzetih vprašanj (ponastavitev predloge). */
export async function POST() {
  const orgResult = await requireDashboardOrganization();
  if (!orgResult.ok) {
    const status = orgResult.reason === "unauthenticated" ? 401 : 403;
    return NextResponse.json({ ok: false, error: "Neavtorizirano." }, { status });
  }

  if (!isDbConfigured() || !prisma) {
    return NextResponse.json({ ok: false, error: "Baza ni nastavljena." }, { status: 503 });
  }

  try {
    await seedDefaultQuestions(orgResult.org.id, true);
    const org = await prisma.organization.findUniqueOrThrow({ where: { id: orgResult.org.id } });
    const questions = await getAllQuestions(orgResult.org.id);

    return NextResponse.json({
      ok: true,
      settings: {
        title: org.surveyTitle,
        subtitle: org.surveySubtitle,
        notes_enabled: org.notesEnabled,
        notes_label: org.notesLabel,
        notes_placeholder: org.notesPlaceholder,
        questions: questions.map(mapQuestionRow),
      },
    });
  } catch (err) {
    console.error("[dashboard questions POST seed]", err);
    return NextResponse.json({ ok: false, error: "Nalaganje privzetih vprašanj ni uspelo." }, { status: 500 });
  }
}
