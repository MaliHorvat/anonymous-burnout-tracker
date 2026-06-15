import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";

export async function getOrganizationBySlug(slug: string) {
  if (!prisma) return null;
  return prisma.organization.findUnique({ where: { slug } });
}

export async function getOrganizationByClerkId(clerkOrgId: string) {
  if (!prisma) return null;
  return prisma.organization.findUnique({ where: { clerkOrgId } });
}

export type DashboardOrgResult =
  | { ok: true; org: { id: string; name: string; slug: string } }
  | { ok: false; reason: "unauthenticated" | "no_clerk_org" | "not_setup" };

export async function requireDashboardOrganization(): Promise<DashboardOrgResult> {
  const { userId, orgId } = await auth();
  if (!userId) return { ok: false, reason: "unauthenticated" };
  if (!orgId) return { ok: false, reason: "no_clerk_org" };

  const org = await getOrganizationByClerkId(orgId);
  if (!org) return { ok: false, reason: "not_setup" };

  return { ok: true, org: { id: org.id, name: org.name, slug: org.slug } };
}

export function surveyPath(slug: string): string {
  return `/s/${slug}`;
}

export function surveyPublicUrl(slug: string, origin?: string): string {
  const base = origin || process.env.NEXT_PUBLIC_APP_URL || "";
  return `${base.replace(/\/$/, "")}${surveyPath(slug)}`;
}
