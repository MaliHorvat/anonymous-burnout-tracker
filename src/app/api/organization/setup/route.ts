import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { isDbConfigured, prisma } from "@/lib/db";
import { getOrganizationByClerkId, surveyPublicUrl } from "@/lib/org";
import { isValidSlug, slugify } from "@/lib/slug";

export async function GET() {
  const authResult = await auth();
  if (!authResult.userId) {
    return NextResponse.json({ ok: false, error: "Neavtorizirano." }, { status: 401 });
  }

  if (!authResult.orgId) {
    return NextResponse.json({ ok: true, organization: null, needs_setup: true, needs_clerk_org: true });
  }

  if (!isDbConfigured() || !prisma) {
    return NextResponse.json({ ok: false, error: "Baza ni nastavljena." }, { status: 503 });
  }

  const org = await getOrganizationByClerkId(authResult.orgId);
  if (!org) {
    return NextResponse.json({ ok: true, organization: null, needs_setup: true, needs_clerk_org: false });
  }

  const origin = process.env.NEXT_PUBLIC_APP_URL || "";
  return NextResponse.json({
    ok: true,
    needs_setup: false,
    organization: {
      id: org.id,
      name: org.name,
      slug: org.slug,
      setup_completed: org.setupCompleted,
      survey_url: surveyPublicUrl(org.slug, origin),
    },
  });
}

export async function POST(request: Request) {
  const authResult = await auth();
  if (!authResult.userId) {
    return NextResponse.json({ ok: false, error: "Neavtorizirano." }, { status: 401 });
  }
  if (!authResult.orgId) {
    return NextResponse.json({ ok: false, error: "Najprej ustvarite organizacijo v Clerk." }, { status: 400 });
  }

  if (!isDbConfigured() || !prisma) {
    return NextResponse.json({ ok: false, error: "Baza ni nastavljena." }, { status: 503 });
  }

  try {
    const body = (await request.json()) as { name?: string; slug?: string };
    const name = body.name?.trim();
    const slugInput = body.slug?.trim() || (name ? slugify(name) : "");

    if (!name || name.length < 2) {
      return NextResponse.json({ ok: false, error: "Ime podjetja mora imeti vsaj 2 znaka." }, { status: 400 });
    }
    if (!slugInput || !isValidSlug(slugInput)) {
      return NextResponse.json(
        { ok: false, error: "Neveljaven URL naslov. Uporabite male črke, številke in vezaje." },
        { status: 400 },
      );
    }

    const existing = await getOrganizationByClerkId(authResult.orgId);
    if (existing) {
      return NextResponse.json({ ok: false, error: "Organizacija je že nastavljena." }, { status: 409 });
    }

    const slugTaken = await prisma.organization.findUnique({ where: { slug: slugInput } });
    if (slugTaken) {
      return NextResponse.json({ ok: false, error: "Ta URL naslov je že zaseden." }, { status: 409 });
    }

    const org = await prisma.organization.create({
      data: {
        clerkOrgId: authResult.orgId,
        name,
        slug: slugInput,
        setupCompleted: true,
      },
    });

    const origin = process.env.NEXT_PUBLIC_APP_URL || "";
    return NextResponse.json({
      ok: true,
      organization: {
        id: org.id,
        name: org.name,
        slug: org.slug,
        setup_completed: org.setupCompleted,
        survey_url: surveyPublicUrl(org.slug, origin),
      },
    });
  } catch (err) {
    console.error("[organization setup]", err);
    return NextResponse.json({ ok: false, error: "Nastavitev organizacije ni uspela." }, { status: 500 });
  }
}
