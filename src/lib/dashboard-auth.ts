import { cookies } from "next/headers";

export const DASHBOARD_COOKIE = "burnout_dashboard_auth";

export async function isDashboardAuthenticated(): Promise<boolean> {
  const jar = await cookies();
  return jar.get(DASHBOARD_COOKIE)?.value === "1";
}

export function getDashboardPassword(): string | undefined {
  return process.env.DASHBOARD_PASSWORD?.trim() || undefined;
}
