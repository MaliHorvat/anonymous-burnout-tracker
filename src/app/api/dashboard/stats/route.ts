import { NextResponse } from "next/server";
import { isDashboardAuthenticated } from "@/lib/dashboard-auth";
import { createSupabaseAdminClient } from "@/lib/supabase/server";
import type { DashboardStats } from "@/lib/types";

function average(nums: number[]): number {
  if (nums.length === 0) return 0;
  return Math.round((nums.reduce((a, b) => a + b, 0) / nums.length) * 100) / 100;
}

export async function GET() {
  if (!(await isDashboardAuthenticated())) {
    return NextResponse.json({ ok: false, error: "Neavtorizirano." }, { status: 401 });
  }

  try {
    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase
      .from("submissions")
      .select("id, workload, feeling_valued, enough_resources, created_at")
      .order("created_at", { ascending: false })
      .limit(500);

    if (error) {
      console.error("[dashboard stats]", error.message);
      return NextResponse.json({ ok: false, error: "Branje podatkov ni uspelo." }, { status: 500 });
    }

    const rows = data ?? [];
    const stats: DashboardStats = {
      count: rows.length,
      averages: {
        workload: average(rows.map((r) => r.workload)),
        feeling_valued: average(rows.map((r) => r.feeling_valued)),
        enough_resources: average(rows.map((r) => r.enough_resources)),
      },
      recent: rows.slice(0, 20),
    };

    return NextResponse.json({ ok: true, stats });
  } catch (err) {
    console.error("[dashboard stats]", err);
    return NextResponse.json({ ok: false, error: "Nepričakovana napaka." }, { status: 500 });
  }
}
