import Link from "next/link";
import {
  BarChart3,
  Building2,
  CheckCircle2,
  ClipboardList,
  Link2,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import { BurnoutLogo } from "@/components/brand/BurnoutLogo";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

const STEPS = [
  {
    n: "1",
    title: "Registracija podjetja",
    body: "Ustvarite račun in organizacijo v Burnout Tracker. Vsako podjetje ima ločene podatke in svojo anketo.",
  },
  {
    n: "2",
    title: "Nastavitev ankete",
    body: "Izberite URL (npr. /s/vase-podjetje), prilagodite vprašanja in naslov ankete v nadzorni plošči.",
  },
  {
    n: "3",
    title: "Delite povezavo",
    body: "Pošljite javno povezavo zaposlenim. Oddajo je anonimna — brez prijave, brez imen.",
  },
  {
    n: "4",
    title: "Analiza rezultatov",
    body: "V nadzorni plošči spremljajte povprečja, odgovore in neobvezne opombe zaposlenih.",
  },
];

const FEATURES = [
  {
    icon: Building2,
    title: "Večpodjetniški SaaS",
    body: "Vsaka organizacija = ločena baza odgovorov, ločena anketa, ločen URL.",
  },
  {
    icon: ShieldCheck,
    title: "Anonimno zbiranje",
    body: "Brez imen, e-pošte ali IP naslovov. Samo ocene, opombe in čas oddaje.",
  },
  {
    icon: ClipboardList,
    title: "Urejanje vprašanj",
    body: "8 privzetih vprašanj ali lastna — dodajajte, urejajte in razvrščajte po potrebi.",
  },
  {
    icon: BarChart3,
    title: "HR nadzorna plošča",
    body: "Pregled, analitika, opombe zaposlenih in kopiranje povezave na enem mestu.",
  },
];

const SAAS_CHECKLIST = [
  "Clerk račun z omogočenimi Organizations (B2B prijava)",
  "MySQL baza na NEOSERV (ločena od drugih produktov)",
  "Vercel deploy z env: DATABASE_URL, CLERK_*, NEXT_PUBLIC_APP_URL",
  "DNS: anketa.vasadomena.si → CNAME na Vercel",
  "Vsako podjetje: registracija → /setup → delitev /s/slug",
];

export function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/90 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/90">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-4 sm:px-6">
          <BurnoutLogo />
          <nav className="hidden items-center gap-6 text-sm font-medium text-slate-600 md:flex dark:text-slate-300">
            <a href="#funkcije" className="hover:text-teal-700 dark:hover:text-teal-400">
              Funkcije
            </a>
            <a href="#kako-deluje" className="hover:text-teal-700 dark:hover:text-teal-400">
              Kako deluje
            </a>
            <a href="#saas" className="hover:text-teal-700 dark:hover:text-teal-400">
              SaaS navodila
            </a>
            <a href="#cenik" className="hover:text-teal-700 dark:hover:text-teal-400">
              Cenik
            </a>
          </nav>
          <div className="flex items-center gap-2 sm:gap-3">
            <Link href="/sign-in" className="hidden text-sm font-medium text-slate-600 sm:inline dark:text-slate-300">
              Prijava
            </Link>
            <Link
              href="/sign-up"
              className="rounded-xl bg-teal-700 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-800 dark:bg-teal-600"
            >
              Začni brezplačno
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main>
        <section className="border-b border-slate-200 bg-gradient-to-b from-teal-50/80 to-slate-50 px-4 py-16 dark:border-slate-800 dark:from-teal-950/30 dark:to-slate-950 sm:py-24">
          <div className="mx-auto max-w-4xl text-center">
            <p className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-white px-3 py-1 text-xs font-semibold text-teal-800 dark:border-teal-800 dark:bg-slate-900 dark:text-teal-300">
              <Sparkles className="h-3.5 w-3.5" aria-hidden />
              SaaS za HR in vodstvo
            </p>
            <h1 className="mt-6 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl dark:text-slate-50">
              Anonimna anketa o zadovoljstvu in izgorelosti
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg text-slate-600 dark:text-slate-300">
              Burnout Tracker je večpodjetniška platforma za varno zbiranje povratnih informacij zaposlenih. Vsako
              podjetje dobi svojo anketo, nadzorno ploščo in ločene podatke.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link
                href="/sign-up"
                className="rounded-xl bg-teal-700 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-teal-900/20 hover:bg-teal-800"
              >
                Ustvari račun podjetja
              </Link>
              <Link
                href="/sign-in"
                className="rounded-xl border border-slate-300 bg-white px-6 py-3.5 text-sm font-semibold text-slate-800 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-900"
              >
                Prijava v nadzorno ploščo
              </Link>
            </div>
          </div>
        </section>

        <section id="funkcije" className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <h2 className="text-center text-2xl font-bold text-slate-900 dark:text-slate-50">Zakaj Burnout Tracker</h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map((f) => {
              const Icon = f.icon;
              return (
                <div
                  key={f.title}
                  className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900"
                >
                  <Icon className="h-8 w-8 text-teal-700 dark:text-teal-400" aria-hidden />
                  <h3 className="mt-4 font-semibold text-slate-900 dark:text-slate-50">{f.title}</h3>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{f.body}</p>
                </div>
              );
            })}
          </div>
        </section>

        <section id="kako-deluje" className="border-y border-slate-200 bg-white px-4 py-16 dark:border-slate-800 dark:bg-slate-900 sm:px-6">
          <div className="mx-auto max-w-4xl">
            <h2 className="text-center text-2xl font-bold text-slate-900 dark:text-slate-50">Kako deluje (za podjetja)</h2>
            <ol className="mt-10 space-y-6">
              {STEPS.map((s) => (
                <li key={s.n} className="flex gap-4 rounded-2xl border border-slate-200 p-5 dark:border-slate-700">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-teal-700 text-sm font-bold text-white">
                    {s.n}
                  </span>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-slate-50">{s.title}</h3>
                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{s.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section id="saas" className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <div className="flex items-center gap-3">
              <Users className="h-8 w-8 text-teal-700 dark:text-teal-400" aria-hidden />
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50">Navodila: zagon kot SaaS</h2>
            </div>
            <p className="mt-3 text-slate-600 dark:text-slate-400">
              Burnout Tracker je zgrajen kot <strong>večnajemniška (multi-tenant) aplikacija</strong>. Vsako podjetje je
              ločena organizacija z lastno anketo na <code className="rounded bg-slate-100 px-1 dark:bg-slate-800">/s/vaš-slug</code>.
            </p>

            <h3 className="mt-8 font-semibold text-slate-900 dark:text-slate-50">Za lastnika platforme (vi)</h3>
            <ul className="mt-3 space-y-2">
              {SAAS_CHECKLIST.map((item) => (
                <li key={item} className="flex gap-2 text-sm text-slate-700 dark:text-slate-300">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-teal-700 dark:text-teal-400" aria-hidden />
                  {item}
                </li>
              ))}
            </ul>

            <h3 className="mt-8 font-semibold text-slate-900 dark:text-slate-50">Za vsako novo podjetje (stranka)</h3>
            <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-slate-700 dark:text-slate-300">
              <li>Registracija na <Link href="/sign-up" className="text-teal-700 underline dark:text-teal-400">/sign-up</Link></li>
              <li>Ustvarjanje organizacije v Clerk (ime podjetja)</li>
              <li>Nastavitev na <Link href="/setup" className="text-teal-700 underline dark:text-teal-400">/setup</Link> — ime in URL ankete</li>
              <li>Urejanje vprašanj v nadzorni plošči → <strong>Urejanje ankete</strong></li>
              <li>Kopiranje povezave iz <strong>Pregled</strong> ali <strong>Nastavitve</strong></li>
              <li>Pošiljanje povezave zaposlenim (e-pošta, intranet, QR koda)</li>
            </ol>

            <div className="mt-8 flex items-start gap-3 rounded-xl bg-teal-50 p-4 dark:bg-teal-950/40">
              <Link2 className="mt-0.5 h-5 w-5 text-teal-800 dark:text-teal-300" aria-hidden />
              <p className="text-sm text-teal-900 dark:text-teal-100">
                <strong>Nastavi</strong> <code className="rounded bg-white/60 px-1 dark:bg-slate-900">NEXT_PUBLIC_APP_URL=https://anketa.visionone.si</code>{" "}
                na Vercelu, da se povezave v nadzorni plošči kopirajo s pravo domeno.
              </p>
            </div>
          </div>
        </section>

        <section id="cenik" className="border-t border-slate-200 bg-slate-100 px-4 py-16 dark:border-slate-800 dark:bg-slate-900/50 sm:px-6">
          <div className="mx-auto max-w-lg text-center">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50">Cenik</h2>
            <div className="mt-8 rounded-2xl border-2 border-teal-700 bg-white p-8 shadow-lg dark:border-teal-500 dark:bg-slate-900">
              <p className="text-sm font-semibold uppercase tracking-wide text-teal-700 dark:text-teal-400">Starter</p>
              <p className="mt-2 text-4xl font-bold text-slate-900 dark:text-slate-50">Brezplačno</p>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">Za pilotne projekte in manjša podjetja</p>
              <ul className="mt-6 space-y-2 text-left text-sm text-slate-700 dark:text-slate-300">
                <li>· Neomejeno anonimnih oddaj</li>
                <li>· Urejanje vprašanj in opomb</li>
                <li>· Nadzorna plošča z analitiko</li>
                <li>· Ločeni podatki po organizaciji</li>
              </ul>
              <Link
                href="/sign-up"
                className="mt-8 inline-block w-full rounded-xl bg-teal-700 py-3 text-sm font-semibold text-white hover:bg-teal-800"
              >
                Začni zdaj
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 px-4 py-8 dark:border-slate-800">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 text-sm text-slate-500">
          <BurnoutLogo />
          <p>© {new Date().getFullYear()} Burnout Tracker · VisionOne</p>
          <div className="flex gap-4">
            <Link href="/sign-in" className="hover:text-teal-700">
              Prijava
            </Link>
            <Link href="/dashboard" className="hover:text-teal-700">
              Nadzorna plošča
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
