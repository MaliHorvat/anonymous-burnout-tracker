import { NextResponse } from "next/server";
import { isDashboardAuthenticated } from "@/lib/dashboard-auth";
import { isDbConfigured, prisma } from "@/lib/db";
import type { DashboardStats } from "@/lib/types";

function average(nums: number[]): number {
  if (nums.length === 0) return 0;
  return Math.round((nums.reduce((a, b) => a + b, 0) / nums.length) * 100) / 100;
}

export async function GET() {
  if (!(await isDashboardAuthenticated())) {
    return NextResponse.json({ ok: false, error: "Neavtorizirano." }, { status: 401 });
  }

  if (!isDbConfigured() || !prisma) {
    return NextResponse.json({ ok: false, error: "Baza ni nastavljena." }, { status: 503 });
  }

  try {
    const rows = await prisma.submission.findMany({
      orderBy: { createdAt: "desc" },
      take: 500,
    });

    const stats: DashboardStats = {
      count: rows.length,
      averages: {
        workload: average(rows.map((r) => r.workload)),
        feeling_valued: average(rows.map((r) => r.feelingValued)),
        enough_resources: average(rows.map((r) => r.enoughResources)),
      },
      recent: rows.slice(0, 20).map((r) => ({
        id: r.id,
        workload: r.workload,
        feeling_valued: r.feelingValued,
        enough_resources: r.enoughResources,
        created_at: r.createdAt.toISOString(),
      })),
    };

    return NextResponse.json({ ok: true, stats });
  } catch (err) {
    console.error("[dashboard stats]", err);
    return NextResponse.json({ ok: false, error: "Branje podatkov ni uspelo." }, { status: 500 });
  }
}
