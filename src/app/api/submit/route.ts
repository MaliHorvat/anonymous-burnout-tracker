import { NextResponse } from "next/server";
import { isDbConfigured, prisma } from "@/lib/db";

function parseScore(value: unknown): number | null {
  const n = Number(value);
  if (!Number.isInteger(n) || n < 1 || n > 5) return null;
  return n;
}

export async function POST(request: Request) {
  if (!isDbConfigured() || !prisma) {
    return NextResponse.json({ ok: false, error: "Baza ni nastavljena." }, { status: 503 });
  }

  try {
    const body = (await request.json()) as Record<string, unknown>;
    const workload = parseScore(body.workload);
    const feelingValued = parseScore(body.feeling_valued);
    const enoughResources = parseScore(body.enough_resources);

    if (workload === null || feelingValued === null || enoughResources === null) {
      return NextResponse.json(
        { ok: false, error: "Vsa polja morajo biti ocene od 1 do 5." },
        { status: 400 },
      );
    }

    await prisma.submission.create({
      data: { workload, feelingValued, enoughResources },
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[submit]", err);
    return NextResponse.json({ ok: false, error: "Shranjevanje ni uspelo." }, { status: 500 });
  }
}
