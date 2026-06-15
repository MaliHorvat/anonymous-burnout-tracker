import { BurnoutForm } from "@/components/BurnoutForm";
import { SurveyChrome } from "@/components/layout/SurveyChrome";

export default function HomePage() {
  return (
    <SurveyChrome>
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-slate-50">
          Anonimna anketa o izgorelosti
        </h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Vaši odgovori so popolnoma anonimni.</p>
      </div>

      <BurnoutForm />

      <p className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400">
        Podatki se shranijo anonimno z datumom oddaje.
      </p>
    </SurveyChrome>
  );
}
