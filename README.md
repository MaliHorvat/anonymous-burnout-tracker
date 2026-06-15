# Anonymous Burnout Tracker

Anonimna anketa (8 vprašanj + opombe) + večpodjetniška nadzorna plošča z Clerk.  
**Domena:** `anketa.visionone.si` · **Baza:** MySQL na NEOSERV · **App:** Vercel

---

## 1. MySQL baza na NEOSERV (ločena od portala)

### 1.1 Ustvari bazo v cPanel

1. Prijava v **cPanel** (NEOSERV gostovanje za visionone.si)
2. **Databases → MySQL® Database Wizard**
3. Ustvari **novo bazo**, npr. `visionone_anketa` (ime je odvisno od predpone računa)
4. Ustvari **uporabnika baze** z močnim geslom
5. Dodeli uporabniku **ALL PRIVILEGES** na to bazo

### 1.2 Ustvari tabelo

**Možnost A — phpMyAdmin**

1. cPanel → **phpMyAdmin**
2. Izberi bazo `…_anketa`
3. Zavihek **SQL** → prilepi vsebino `prisma/mysql-init.sql` → **Go**

**Možnost B — Prisma (lokalno, če imaš DATABASE_URL)**

```bash
npm run db:push
```

### 1.3 Oddaljen dostop (Vercel → NEOSERV MySQL)

Ker aplikacija teče na **Vercelu**, mora NEOSERV dovoliti povezavo z zunaj:

1. cPanel → **Remote MySQL®** (ali **Databases → Remote MySQL**)
2. Dodaj dostop za gostitelja `%` (vsi IP-ji) **ali** IP-je, ki jih zahteva tvoj paket  
   *(pri VisionOne portalu verjetno že imaš podobno nastavitev — uporabi isti pristop)*
3. Za **Host** v `DATABASE_URL` uporabi strežniško ime iz cPanel (ne `localhost`), npr.:
   - `sqlXXX.neoserv.net` ali
   - hostname iz cPanel → **General Information → Server Name**

### 1.4 DATABASE_URL

Format (kot pri portalu):

```env
DATABASE_URL="mysql://UPORABNIK:GESLO@STREŽNIK:3306/IME_BAZE"
```

Posebni znaki v geslu morajo biti URL-kodirani (`@` → `%40`, `#` → `%23`, …).

Lokalno: kopiraj `.env.example` v `.env.local` in vnesi vrednosti.

---

## 2. Lokalni zagon

```bash
npm install
npm run dev
```

- Anketa: http://localhost:3000 (domov) · http://localhost:3000/s/vase-podjetje (anketa podjetja)
- Admin: http://localhost:3000/dashboard (Clerk prijava)
- Nastavitev: http://localhost:3000/setup

---

## 3. GitHub + Vercel

```bash
git add .
git commit -m "MySQL NEOSERV + anketa.visionone.si"
git push origin main
```

V **Vercel → Settings → Environment Variables**:

| Spremenljivka | Vrednost |
|---------------|----------|
| `DATABASE_URL` | MySQL connection string iz NEOSERV |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Iz [Clerk Dashboard](https://dashboard.clerk.com) |
| `CLERK_SECRET_KEY` | Iz Clerk Dashboard |
| `NEXT_PUBLIC_APP_URL` | `https://anketa.visionone.si` |

V Clerk omogoči **Organizations** (Settings → Organizations).

**Deploy** → preveri `https://tvoj-projekt.vercel.app`

---

## 4. Domena anketa.visionone.si (NEOSERV DNS)

### 4.1 Vercel

1. Projekt → **Settings → Domains**
2. Dodaj: `anketa.visionone.si`
3. Vercel pokaže zahtevan **CNAME** (običajno `cname.vercel-dns.com` ali specifičen `….vercel-dns-….com`)

### 4.2 NEOSERV (cPanel Zone Editor)

1. cPanel → **Zone Editor** → domena `visionone.si` → **Manage**
2. **Add Record**:

| Tip | Name | TTL | Record |
|-----|------|-----|--------|
| CNAME | `anketa` | 300 | *(točno kar pokaže Vercel)* |

**Ne spreminjaj** zapisov za `@`, `www`, `portal`, `moj` itd.

3. Počakaj 5–60 min → v Vercelu mora biti **Valid Configuration**

---

## 5. Preverjanje

1. https://anketa.visionone.si — registracija podjetja, nastavitev, delitev povezave `/s/vase-podjetje`
2. https://anketa.visionone.si/dashboard — Clerk prijava, pregled odgovorov in opomb
3. phpMyAdmin — tabele `organizations` in `submissions`

---

## Varnost

- Anketa ne zbira imen, e-pošte ali IP-jev zaposlenih (ocene + neobvezne opombe + čas)
- Nadzorna plošča je zaščitena z **Clerk** (račun + organizacija)
- Podatki so ločeni po podjetjih (`organization_id`)
- `DATABASE_URL` samo na strežniku (Vercel env), nikoli v git
