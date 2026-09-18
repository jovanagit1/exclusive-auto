# Exclusive Auto — sajt (Next.js)

Ovo je kompletan, radni sajt za Exclusive Auto, napravljen u Next.js-u i
spreman za hosting na Vercelu. Sadrži: početnu stranicu sa loading
ekranom koji pulsira (logo firme), katalog vozila sa stranicom detalja za
svako vozilo, stranicu usluga (uvoz, registracija, detailing, poliranje,
zatamnjenje stakala — sa zakonskom napomenom), galeriju, o nama, kontakt,
te posebne forme za probnu vožnju, uvoz vozila i registraciju vozila.

Sav sadržaj (tekstovi, vozila, slike) je trenutno **placeholder** —
napravljen tako da se lako zamijeni pravim sadržajem prije lansiranja.
Ispod je tačno šta treba zamijeniti i kako.

## 1. Pokretanje sajta lokalno (na svom računaru)

Potreban je Node.js (verzija 20 ili novija). Zatim, u folderu projekta:

```bash
npm install
npm run dev
```

Sajt će biti dostupan na `http://localhost:3000`.

## 2. Šta treba zamijeniti prije lansiranja

### Logo

- Trenutno se prikazuje jednostavan "EA" monogram (`src/components/Logo.tsx`).
- Kada dobijete pravi logo firme, sačuvajte ga kao `public/logo.svg` (ili
  `.png`) i u `src/components/Logo.tsx` zamijenite `<LogoMark />` sa
  `<img src="/logo.svg" alt="Exclusive Auto" />`. Pulsirajuća animacija na
  loading ekranu (`src/components/SplashScreen.tsx`) radi automatski sa
  bilo kojom slikom.

### Vozila (katalog)

- Sva vozila se nalaze u **jednom fajlu**: `src/lib/vehicles.ts`. Dodavanje,
  brisanje ili izmjena vozila znači samo izmjenu tog niza podataka — sajt
  automatski generiše i karticu u katalogu i stranicu detalja.
- Fotografije vozila trenutno prikazuju elegantan placeholder
  (`src/components/PlaceholderImage.tsx`). Kada budete imali prave
  fotografije, najlakše je dodati ih u `public/vozila/` i zamijeniti
  `<PlaceholderImage .../>` sa `<img src="/vozila/naziv.jpg" ... />` u
  `VehicleCard.tsx` i `vozila/[slug]/page.tsx`.

### Kontakt podaci

- Telefon, email i adresa se nalaze u `src/components/Footer.tsx` i
  `src/app/kontakt/page.tsx` — trenutno je `+387 65 000 000` i
  `info@exclusiveautobl.com` kao placeholder.

### Galerija

- `src/app/galerija/page.tsx` — trenutno prikazuje 6 placeholder polja.
  Dodajte prave slike u `public/galerija/` i zamijenite ih na isti način.

## 3. Forme (kontakt, probna vožnja, uvoz, registracija)

Sve forme trenutno šalju podatke na `/api/inquiries`
(`src/app/api/inquiries/route.ts`), koji **radi, ali samo bilježi upit u
server log** — ne šalje pravi email. Prije lansiranja, povežite ga sa
servisom za slanje mejlova. Dvije najlakše opcije:

1. **Resend** (https://resend.com) — besplatan do 3000 mejlova mjesečno.
   Napravite nalog, dobijete API ključ, dodate ga u Vercel → Settings →
   Environment Variables kao `RESEND_API_KEY`, i u
   `src/app/api/inquiries/route.ts` pozovete Resend API da pošalje mejl na
   vašu adresu sa podacima iz upita.
2. **Formspree / Web3Forms** — bez pisanja koda, samo se registrujete i
   zamijenite `fetch("/api/inquiries", ...)` u `src/components/InquiryForm.tsx`
   da šalje direktno na njihov endpoint.

Do tada, upite možete pratiti u Vercel → vaš projekat → **Logs**.

## 4. Deploy na Vercel (korak po korak)

1. Napravite besplatan repozitorijum na GitHub-u i pushujte ovaj projekat:
   ```bash
   git add .
   git commit -m "Exclusive Auto — inicijalna verzija sajta"
   git branch -M main
   git remote add origin https://github.com/<vas-nalog>/exclusive-auto.git
   git push -u origin main
   ```
2. Na [vercel.com](https://vercel.com) → **Add New Project** → izaberite
   ovaj GitHub repozitorijum → Vercel automatski prepoznaje Next.js →
   kliknite **Deploy**.
3. Za par minuta dobijate radni sajt na adresi tipa
   `exclusive-auto.vercel.app` — provjerite da sve radi prije nego
   povežete pravi domen.

## 5. Povezivanje domena exclusiveautobl.com

Kada dobijete pristup DNS podešavanjima domena (vjerovatno cPanel na
hostingu gdje domen trenutno živi — provjerite kod osobe koja ima
pristup):

1. U Vercel projektu: **Settings → Domains → Add Domain** → unesite
   `exclusiveautobl.com`, prihvatite i ponuđeni `www.exclusiveautobl.com`.
2. Vercel će prikazati tačne DNS vrijednosti za vaš projekat:
   - Za glavni (apex) domen: **A zapis** → vrijednost koju vam Vercel
     prikaže (obično `76.76.21.21`, ali koristite tačno onu koju vidite
     u svom dashboardu).
   - Za `www`: **CNAME zapis** → jedinstvena vrijednost tipa
     `nesto.vercel-dns.com` koju Vercel prikaže za vaš projekat.
3. Te zapise unesite u DNS zonu domena (cPanel / DNS Zone Editor).
4. **VAŽNO:** ne dirajte MX zapise (email) i ne mijenjajte nameservere na
   Vercelove — time bi prestao raditi postojeći mejl
   `aleksandar.maric@exclusiveautobl.com`. Mijenjajte samo A i CNAME
   zapise za sajt; sve ostalo ostaje netaknuto.
5. Propagacija DNS izmjena traje od par minuta do nekoliko sati.

## 6. Struktura projekta (kratko)

```
src/app/                 stranice sajta (svaki folder = jedna ruta)
  page.tsx               početna
  vozila/                katalog + [slug] stranica detalja
  usluge/, o-nama/       informativne stranice
  kontakt/, probna-voznja/, uvoz/, registracija/   forme
  api/inquiries/         prima podatke iz svih formi
src/components/          nav, footer, kartica vozila, forma, splash ekran
src/lib/vehicles.ts      podaci o vozilima (ovdje se uređuje ponuda)
public/                  slike, logo (dodati ovdje)
```
  


  