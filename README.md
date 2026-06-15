# Anonymous Burnout Tracker (MVP)

Anonimna anketa (3 vprašanja, lestvica 1–5) + zaščitena admin nadzorna plošča s povprečji.

**Stack:** Next.js 15 · Tailwind CSS · Supabase · Vercel · GitHub

---

## FAZA 1: Lokalna nastavitev in Supabase

### 1.1 Projekt (že pripravljen v mapi `anonymous-burnout-tracker`)

Če bi začeli od nič:

```bash
cd c:\Users\marselh-local\Desktop\4.5.2026
npx create-next-app@15 anonymous-burnout-tracker --typescript --tailwind --eslint --app --src-dir --yes
cd anonymous-burnout-tracker
npm install @supabase/supabase-js
```

### 1.2 Supabase projekt

1. Odpri [https://supabase.com](https://supabase.com) → **New project**
2. Izberi regijo (npr. `eu-central-1`), nastavi geslo za bazo
3. Počakaj, da projekt pride na `Active`

### 1.3 SQL — ustvari tabelo

V Supabase: **SQL Editor** → **New query** → prilepi vsebino datoteke `supabase/schema.sql` → **Run**.

To ustvari tabelo `submissions` in RLS pravilo: **javnost lahko samo vstavlja**, ne bere.

### 1.4 Okoljske spremenljivke

```bash
copy .env.example .env.local
```

V `.env.local` vnesi (Supabase → **Project Settings** → **API**):

| Spremenljivka | Kje jo najdeš |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | anon public |
| `SUPABASE_SERVICE_ROLE_KEY` | service_role (skrivno!) |
| `DASHBOARD_PASSWORD` | Izberi močno geslo za `/dashboard` |

### 1.5 Lokalni zagon

```bash
npm run dev
```

- Anketa: [http://localhost:3000](http://localhost:3000)
- Admin: [http://localhost:3000/dashboard](http://localhost:3000/dashboard)

---

## FAZA 2: Koda (struktura)

```
src/
  app/
    page.tsx              → javna anketa
    dashboard/page.tsx    → admin povprečja
    api/submit/route.ts   → anonimni INSERT
    api/dashboard/        → prijava + statistika
  components/
    BurnoutForm.tsx
    DashboardView.tsx
  lib/
    supabase/client.ts    → anon ključ (insert)
    supabase/server.ts    → service role (branje)
supabase/schema.sql       → migracija za Supabase
```

**Vprašanja (1–5):**

1. Kakšna je vaša delovna obremenitev?
2. Se počutite cenjeni na delovnem mestu?
3. Imate dovolj virov za opravljanje dela?

---

## FAZA 3: GitHub push

### 3.1 Nov repozitorij na GitHubu

GitHub → **New repository** → ime npr. `anonymous-burnout-tracker` → **Create** (brez README).

### 3.2 Push iz lokalne mape

```bash
cd c:\Users\marselh-local\Desktop\4.5.2026\anonymous-burnout-tracker
git init
git add .
git commit -m "Initial MVP: anonymous burnout tracker"
git branch -M main
git remote add origin https://github.com/TVOJ_UPORABNIK/anonymous-burnout-tracker.git
git push -u origin main
```

Zamenjaj `TVOJ_UPORABNIK` s svojim GitHub imenom.

---

## FAZA 4: Vercel deployment

1. [https://vercel.com](https://vercel.com) → **Add New** → **Project**
2. **Import** svojega GitHub repozitorija
3. Framework: **Next.js** (avtomatsko)
4. **Environment Variables** — dodaj vse iz `.env.local`:

   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `DASHBOARD_PASSWORD`

5. **Deploy**
6. Po deployu preveri: `https://tvoj-projekt.vercel.app` in `/dashboard`

---

## FAZA 5: Lastna domena

### 5.1 V Vercel

1. Projekt → **Settings** → **Domains**
2. Vnesi domeno, npr. `burnout.tvoja-domena.si` → **Add**

### 5.2 Pri registrarju (DNS)

Vercel pokaže, kaj potrebuješ. Običajno:

**Poddomena (priporočeno)** — npr. `burnout.tvoja-domena.si`:

| Tip | Ime | Vrednost |
|-----|-----|----------|
| CNAME | `burnout` | `cname.vercel-dns.com` |

**Korenska domena** `tvoja-domena.si`:

| Tip | Ime | Vrednost |
|-----|-----|----------|
| A | `@` | `76.76.21.21` |

Počakaj 5–60 min (DNS). Vercel bo pokazal **Valid Configuration**, ko je aktivno.

### 5.3 HTTPS

Vercel sam izda SSL certifikat — ni dodatnih korakov.

---

## Varnost (MVP)

- Anketa: brez osebnih podatkov, samo 3 številke + čas
- RLS: anon ne more brati baze
- Dashboard: zaščiten z `DASHBOARD_PASSWORD` (httpOnly piškotek)
- `SUPABASE_SERVICE_ROLE_KEY` **nikoli** v kodo ali brskalnik — samo Vercel env

---

## Ukazi

```bash
npm run dev      # razvoj
npm run build    # produkcijski build
npm run start    # lokalno po buildu
```
