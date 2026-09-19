# Exclusive Auto — sajt (Next.js)

Kompletan, radni sajt za Exclusive Auto: početna, katalog vozila, cjenovnik
(sveska ponude za štampu), usluge, galerija, o nama, kontakt, forme za
probnu vožnju/uvoz/registraciju, **admin panel** za samostalno dodavanje
vozila i slika, i **premium newsletter** za stalne kupce.

## 1. Pokretanje sajta lokalno

```bash
npm install
npm run dev
```

Sajt je na `http://localhost:3000`. Admin panel radi i lokalno, ali bez
env varijabli ispod ne može trajno da snimi izmjene (to je normalno —
samo za testiranje na svom računaru).

## 2. Šta MORATE podesiti u Vercelu prije nego sajt bude potpuno funkcionalan

Sve ispod se podešava u Vercel projektu → **Settings → Environment
Variables**, a zatim → **Deployments → (tri tačke na zadnjem deployu) →
Redeploy** (env varijable se primjenjuju tek poslije redeploy-a).

### a) Admin panel — lozinka

| Varijabla | Vrijednost |
|---|---|
| `ADMIN_PASSWORD` | lozinka po vašem izboru (npr. neka jaka fraza) |

Admin panel je na `/admin` (npr. `https://www.exclusiveautobl.com/admin`).
I vi i Aco se logujete istom lozinkom.

### b) Slike i podaci o vozilima — Vercel Blob

Bez ovoga admin panel NE MOŽE trajno sačuvati vozila/slike (Vercel nema
trajni disk).

1. U Vercel projektu → **Storage** → **Create Database** → izaberite
   **Blob** → Create.
2. Vercel automatski doda `BLOB_READ_WRITE_TOKEN` i ponudi redeploy —
   prihvatite.

Besplatni plan (Hobby) uključuje 1GB skladišta i solidan mjesečni
saobraćaj — za par stotina fotografija vozila je više nego dovoljno.

### c) Slanje mejlova (upiti sa sajta + newsletter) — Resend

1. Napravite besplatan nalog na [resend.com](https://resend.com)
   (100 mejlova/dan, 3000/mjesec besplatno).
2. Napravite API ključ (**API Keys → Create**).
3. Dodajte u Vercel:

| Varijabla | Vrijednost |
|---|---|
| `RESEND_API_KEY` | vaš Resend API ključ |
| `OWNER_EMAIL` | `aleksandar.maric@exclusiveautobl.com` (ili koji god mejl treba da prima upite) |

Bez ovoga sajt i dalje radi, samo upiti sa formi ne stižu na mejl (samo
se bilježe u Vercel → Logs).

**Profesionalniji "šalje se sa" mejl (preporučeno, opciono):** dok ne
verifikujete domen kod Resend-a, mejlovi idu sa `onboarding@resend.dev`
adrese (radi odmah, ali izgleda manje profesionalno primaocu). Da mejlovi
izgledaju kao da dolaze sa `@exclusiveautobl.com`:

1. U Resend-u: **Domains → Add Domain** → `exclusiveautobl.com`.
2. Resend će dati par TXT/DKIM zapisa — dodajte ih u cPanel Zone Editor
   (to su NOVI zapisi, ne diraju postojeće — sigurno je).
3. Kad se domen verifikuje (zeleno), dodajte u Vercel:

| Varijabla | Vrijednost |
|---|---|
| `RESEND_FROM` | npr. `Exclusive Auto <upiti@exclusiveautobl.com>` |

### d) Newsletter linkovi u mejlu (opciono)

| Varijabla | Vrijednost |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | `https://www.exclusiveautobl.com` |

Koristi se samo da link ka vozilu u newsletter mejlu bude tačan. Bez
ovoga koristi se podrazumijevana vrijednost (ista adresa).

## 3. Admin panel — kako se koristi

Otvorite `/admin`, ulogujte se lozinkom (`ADMIN_PASSWORD`).

- **Vozila** — pregled svih vozila, izmjena, brisanje.
- **+ Dodaj vozilo** — unesite podatke, pa u dijelu "Slike vozila"
  kliknite **Choose Files** i odaberite SVE fotografije tog vozila
  odjednom (cijeli folder — može se selektovati 20-30 slika u istom
  koraku). Slike se otpremaju direktno, prva postaje naslovna fotografija
  (može se promijeniti strelicama ←/→ na svakoj slici).
- Ako je uključena kučica **"Pošalji obavještenje premium korisnicima"**,
  svi sa newsletter liste odmah dobijaju mejl o novom vozilu.
- **Newsletter** — ovdje ručno dodajete korisnike koji su kupili 2+
  vozila kod vas (ime, email, napomena). Ova lista NIJE javna — samo vi
  i Aco je vidite i uređujete.

Za 50 vozila × ~30 slika: najbrže je raditi vozilo po vozilo — otvorite
"Dodaj vozilo", popunite podatke, selektujte cijeli folder tog vozila
odjednom u polju za slike, sačuvajte, pa pređite na sljedeće vozilo.

## 4. Cjenovnik

Stranica `/cjenovnik` prikazuje sva vozila u kompaktnoj tabeli i ima
dugme **"Štampaj / Preuzmi kao PDF"** — koristi štampanje iz browsera
(u dijalogu za štampu izaberite "Save as PDF" umjesto štampača).

## 5. Forme (kontakt, probna vožnja, uvoz, registracija)

Šalju se na `/api/inquiries`, koji ih odmah prosljeđuje na `OWNER_EMAIL`
preko Resend-a (vidi tačku 2c). Dok Resend nije podešen, upiti se i dalje
mogu vidjeti u Vercel → Project → Logs.

## 6. Deploy na Vercel

Ako mijenjate fajlove lokalno pa ih upload-ujete na GitHub (kao do sada):
zamijenite izmijenjene fajlove u repozitorijumu (ili cijeli projekat), a
Vercel će automatski napraviti novi deploy u roku od minut-dva.

```bash
# Alternativa preko git komandne linije, ako je ikad zgodnije:
git add .
git commit -m "Izmjene sajta"
git push
```

## 7. Povezivanje domena exclusiveautobl.com

Ovo je već urađeno (www.exclusiveautobl.com → Vercel, gola adresa
preusmjerena na www preko cPanel Redirects). Za referencu:

- **VAŽNO:** ne dirajte MX zapise niti root A zapis domena (email zavisi
  od njih) — mijenja se SAMO www CNAME zapis, koji već pokazuje na
  Vercel.

## 8. Struktura projekta (kratko)

```
src/app/                    stranice sajta
  page.tsx                  početna
  vozila/                   katalog + [slug] stranica detalja
  cjenovnik/                sveska ponude (tabela + štampa)
  usluge/, o-nama/          informativne stranice
  kontakt/, probna-voznja/, uvoz/, registracija/   forme
  admin/                    admin panel (login, vozila, newsletter)
  api/inquiries/            prima podatke iz javnih formi (šalje mejl)
  api/admin/                admin API (login, vozila, newsletter, upload slika)
src/components/             nav, footer, kartice, forme, admin komponente
src/lib/
  vehicles.ts               tip Vehicle + polazni (seed) podaci
  store.ts                  čitanje/pisanje vozila i newsletter liste (Vercel Blob)
  newsletter.ts             slanje mejla premium korisnicima
  admin-auth.ts             provjera admin lozinke i sesije
proxy.ts                    štiti /admin i /api/admin rute (bivši middleware.ts)
public/                     logo (dodati kad stigne), statične slike
```
