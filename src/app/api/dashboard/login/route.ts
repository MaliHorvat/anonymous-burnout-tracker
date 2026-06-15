import { NextResponse } from "next/server";
import { DASHBOARD_COOKIE, getDashboardPassword } from "@/lib/dashboard-auth";

export async function POST(request: Request) {
  const configured = getDashboardPassword();
  if (!configured) {
    return NextResponse.json({ ok: false, error: "Dashboard geslo ni nastavljeno." }, { status: 503 });
  }

  const body = (await request.json().catch(() => ({}))) as { password?: string };
  const password = String(body.password ?? "");

  if (password !== configured) {
    return NextResponse.json({ ok: false, error: "Napačno geslo." }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(DASHBOARD_COOKIE, "1", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(DASHBOARD_COOKIE, "", { httpOnly: true, path: "/", maxAge: 0 });
  return response;
}
