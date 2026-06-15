import { NextResponse } from "next/server";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

function parseScore(value: unknown): number | null {
  const n = Number(value);
  if (!Number.isInteger(n) || n < 1 || n > 5) return null;
  return n;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const workload = parseScore(body.workload);
    const feeling_valued = parseScore(body.feeling_valued);
    const enough_resources = parseScore(body.enough_resources);

    if (workload === null || feeling_valued === null || enough_resources === null) {
      return NextResponse.json(
        { ok: false, error: "Vsa polja morajo biti ocene od 1 do 5." },
        { status: 400 },
      );
    }

    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.from("submissions").insert({
      workload,
      feeling_valued,
      enough_resources,
    });

    if (error) {
      console.error("[submit]", error.message);
      return NextResponse.json({ ok: false, error: "Shranjevanje ni uspelo." }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[submit]", err);
    return NextResponse.json({ ok: false, error: "Nepričakovana napaka." }, { status: 500 });
  }
}
