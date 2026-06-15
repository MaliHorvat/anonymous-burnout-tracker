import { notFound } from "next/navigation";
import { BurnoutForm } from "@/components/BurnoutForm";
import { SurveyChrome } from "@/components/layout/SurveyChrome";
import { getOrganizationBySlug } from "@/lib/org";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const org = await getOrganizationBySlug(slug);
  return {
    title: org ? `Anketa | ${org.name}` : "Anketa ni najdena",
  };
}

export default async function OrgSurveyPage({ params }: Props) {
  const { slug } = await params;
  const org = await getOrganizationBySlug(slug);
  if (!org) notFound();

  return (
    <SurveyChrome orgName={org.name}>
      <div className="mb-8 text-center">
        <p className="text-xs font-semibold uppercase tracking-wide text-teal-700 dark:text-teal-400">{org.name}</p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-slate-50">
          Anonimna anketa o zadovoljstvu in izgorelosti
        </h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          8 kratkih vprašanj + neobvezne opombe. Vaši odgovori so popolnoma anonimni.
        </p>
      </div>

      <BurnoutForm orgSlug={org.slug} />

      <p className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400">
        Podatki se shranijo anonimno z datumom oddaje. Ne zbiramo imen, e-pošte ali IP naslovov.
      </p>
    </SurveyChrome>
  );
}
