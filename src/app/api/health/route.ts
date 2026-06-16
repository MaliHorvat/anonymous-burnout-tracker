import { NextResponse } from "next/server";
import { isDbConfigured, prisma } from "@/lib/db";

export async function GET() {
  if (!isDbConfigured() || !prisma) {
    return NextResponse.json({ ok: false, db: false, error: "DATABASE_URL ni nastavljen." }, { status: 503 });
  }

  try {
    await prisma.$queryRaw`SELECT 1`;
    return NextResponse.json({ ok: true, db: true });
  } catch (err) {
    console.error("[health]", err);
    return NextResponse.json({ ok: false, db: false, error: "Povezava z bazo ni uspela." }, { status: 503 });
  }
}
