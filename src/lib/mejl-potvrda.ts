/**
 * Izgled mejla POTVRDE koji posjetilac dobije kad pošalje formu na sajtu.
 * Umjesto gole tabele: lična poruka, kartica sa zahtjevom, "Šta slijedi"
 * u tri koraka i dugmad — u crno-bijelom stilu sajta.
 *
 * Tekstovi za svaku formu su u objektu FORME ispod — tu se mijenjaju.
 * (HTML je namjerno "staromodan" — tabele i inline stilovi — jer samo tako
 * mejl izgleda isto u Gmailu, Outlooku i na telefonu.)
 */

const SAJT = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.exclusiveautobl.com";
export const LOGO_MEJL = `${SAJT}/email/logo-bijeli.png`;

function esc(v: unknown): string {
  return String(v ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

type Podaci = Record<string, unknown>;
const t = (p: Podaci, k: string) => {
  const v = String(p[k] ?? "").trim();
  // Budžet upisan kao golo broj (npr. 35000) prikazuje se kao "35.000 KM".
  if (k === "budzet" && /^\d{4,}$/.test(v)) return `${Number(v).toLocaleString("de-DE")} KM`;
  // Datum iz kalendara (2026-10-02) prikazuje se kao 02.10.2026.
  const d = /^(\d{4})-(\d{2})-(\d{2})$/.exec(v);
  if (d) return `${d[3]}.${d[2]}.${d[1]}.`;
  return v;
};

type Forma = {
  oznaka: string; // mala oznaka iznad naslova
  uvod: (p: Podaci) => string; // HTML (vrijednosti se escape-uju)
  naslovKartice: (p: Podaci) => string;
  polja: [string, string][]; // [ključ, oznaka] — prikazuju se samo popunjena
  koraci: [string, string][]; // [naslov, opis]
  dugme: [string, string]; // [tekst, putanja]
};

const FORME: Record<string, Forma> = {
  uvoz: {
    oznaka: "Uvoz vozila",
    uvod: (p) =>
      `Vaš zahtjev za uvoz${t(p, "markaModel") ? ` <b>${esc(t(p, "markaModel"))}</b>` : " vozila"} je stigao do nas. Krećemo u potragu i javljamo vam se sa konkretnim ponudama u najkraćem roku.`,
    naslovKartice: (p) => t(p, "markaModel") || "Vozilo po vašoj želji",
    polja: [
      ["odakle", "Uvoz iz"],
      ["godiste", "Godište"],
      ["budzet", "Budžet"],
      ["napomena", "Napomena"],
    ],
    koraci: [
      ["Pretraga", "Pregledamo ponudu provjerenih prodavaca i salona u Evropi."],
      ["Ponude", "Šaljemo vam izbor vozila sa slikama, porijeklom i cijenom ključ u ruke."],
      ["Uvoz i predaja", "Preuzimamo uvoz, carinu i registraciju — uz mogućnost dostave na vašu adresu."],
    ],
    dugme: ["Pogledaj ponudu", "/vozila"],
  },
  kontakt: {
    oznaka: "Poruka",
    uvod: () => "Vaša poruka je stigla do nas. Javljamo vam se u najkraćem roku.",
    naslovKartice: () => "Vaša poruka",
    polja: [["poruka", "Poruka"]],
    koraci: [
      ["Čitamo", "Vašu poruku pregleda neko iz našeg tima."],
      ["Javljamo se", "Odgovaramo mejlom ili telefonom, kako vam više odgovara."],
      ["Dogovor", "Dogovaramo sve detalje — ili posjetu salonu."],
    ],
    dugme: ["Pogledaj ponudu", "/vozila"],
  },
  "probna-voznja": {
    oznaka: "Probna vožnja",
    uvod: (p) =>
      `Vaš zahtjev za probnu vožnju${t(p, "vozilo") ? ` vozila <b>${esc(t(p, "vozilo"))}</b>` : ""} je primljen. Tačan termin potvrđujemo telefonom ili mejlom.`,
    naslovKartice: (p) => t(p, "vozilo") || "Probna vožnja",
    polja: [
      ["datum", "Željeni datum"],
      ["napomena", "Napomena"],
    ],
    koraci: [
      ["Potvrda termina", "Javljamo vam se da potvrdimo dan i sat."],
      ["Priprema", "Vozilo pripremamo i čeka vas u salonu."],
      ["Vožnja", "Isprobajte vozilo bez žurbe, uz sva pitanja koja imate."],
    ],
    dugme: ["Pogledaj vozila", "/vozila"],
  },
  registracija: {
    oznaka: "Registracija vozila",
    uvod: () => "Vaš upit za registraciju je primljen. Javljamo vam se sa svim potrebnim informacijama.",
    naslovKartice: (p) => t(p, "markaModel") || t(p, "vozilo") || "Registracija vozila",
    polja: [
      ["status", "Status vozila"],
      ["napomena", "Napomena"],
    ],
    koraci: [
      ["Provjera", "Pregledamo podatke o vozilu i dokumentaciji."],
      ["Ponuda", "Javljamo vam cijenu i šta je sve potrebno."],
      ["Registracija", "Obavljamo sve umjesto vas — bez čekanja u redovima."],
    ],
    dugme: ["Naše usluge", "/usluge"],
  },
  kredit: {
    oznaka: "Kredit",
    uvod: (p) =>
      `Vaš upit za kredit${t(p, "vozilo") ? ` za <b>${esc(t(p, "vozilo"))}</b>` : ""} je primljen. Javljamo vam se sa ponudom i narednim koracima.`,
    naslovKartice: (p) => t(p, "vozilo") || "Kredit",
    polja: [
      ["cijena", "Cijena vozila"],
      ["ucesce", "Učešće"],
      ["iznosKredita", "Iznos kredita"],
      ["rok", "Rok otplate"],
      ["rata", "Mjesečna rata"],
    ],
    koraci: [
      ["Provjera", "Pregledamo vaš izračun i uslove banke."],
      ["Ponuda", "Šaljemo vam konkretnu ponudu i spisak dokumenata."],
      ["Preuzimanje", "Po odobrenju kredita vozilo je vaše."],
    ],
    dugme: ["Pogledaj ponudu", "/vozila"],
  },
  lizing: {
    oznaka: "Lizing",
    uvod: (p) =>
      `Vaš upit za lizing${t(p, "vozilo") ? ` za <b>${esc(t(p, "vozilo"))}</b>` : ""} je primljen. Javljamo vam se sa ponudom po vašoj mjeri.`,
    naslovKartice: (p) => t(p, "vozilo") || "Lizing",
    polja: [
      ["cijena", "Cijena vozila"],
      ["ucesce", "Učešće"],
      ["iznosKredita", "Iznos finansiranja"],
      ["rok", "Rok otplate"],
      ["rata", "Mjesečna rata"],
    ],
    koraci: [
      ["Provjera", "Pregledamo vaš izračun i uslove lizing kuće."],
      ["Ponuda", "Šaljemo vam konkretnu ponudu i spisak dokumenata."],
      ["Preuzimanje", "Po odobrenju lizinga preuzimate vozilo."],
    ],
    dugme: ["Pogledaj ponudu", "/vozila"],
  },
};

/** Da li za ovu formu postoji lijepa potvrda. */
export function imaPotvrdu(formType: string): boolean {
  return formType in FORME;
}

const F = "font-family:Arial,Helvetica,sans-serif;";
const SERIF = "font-family:Georgia,'Times New Roman',serif;";

/** Crni "okvir" svakog mejla: logo gore, podaci firme dole. */
export function okvirMejla(unutra: string, pregled = ""): string {
  return `<!doctype html>
<html lang="sr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light only"><title>Exclusive Auto</title>
<style>@media (max-width:520px){.px{padding-left:24px!important;padding-right:24px!important}.btn a{padding-left:16px!important;padding-right:16px!important}}</style></head>
<body style="margin:0;padding:0;background:#e9e9eb;">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${esc(pregled)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#e9e9eb;">
<tr><td align="center" style="padding:28px 12px;">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:100%;max-width:600px;background:#ffffff;">
  <tr><td align="center" style="background:#0a0a0b;padding:38px 24px 34px;">
    <a href="${SAJT}" style="text-decoration:none;"><img src="${LOGO_MEJL}" width="168" alt="EXCLUSIVE AUTO" style="display:block;width:168px;max-width:60%;height:auto;border:0;color:#ffffff;${F}font-size:20px;letter-spacing:4px;"></a>
  </td></tr>
  ${unutra}
  <tr><td style="background:#0a0a0b;padding:30px 40px;text-align:center;${F}">
    <p style="margin:0 0 6px;color:#ffffff;font-size:11px;letter-spacing:3px;text-transform:uppercase;">Exclusive Auto · Banja Luka</p>
    <p style="margin:0;color:#8e8e94;font-size:12px;line-height:1.8;">
      Jaroslava Plecitija 17, 78000 Banja Luka<br>
      Pon – Pet 09 – 17 h · Sub 09 – 15 h<br>
      <a href="tel:+38765063063" style="color:#8e8e94;text-decoration:none;">065 063 063</a> ·
      <a href="tel:+38766888555" style="color:#8e8e94;text-decoration:none;">066 888 555</a> ·
      <a href="${SAJT}" style="color:#ffffff;text-decoration:none;">exclusiveautobl.com</a>
    </p>
  </td></tr>
</table>
<p style="margin:16px 0 0;${F}font-size:11px;color:#9a9aa0;">Na ovaj mejl možete direktno odgovoriti.</p>
</td></tr></table>
</body></html>`;
}

/* ── Gradivni blokovi (koriste ih svi mejlovi sa sajta) ─────────────── */

/** Uvod: mala oznaka, veliki serif naslov i tekst (HTML, već escape-ovan). */
export function blokUvod(oznaka: string, naslov: string, tekstHtml = ""): string {
  return `<tr><td class="px" style="padding:44px 44px 8px;${F}">
    <p style="margin:0 0 14px;color:#8e8e94;font-size:11px;letter-spacing:3px;text-transform:uppercase;">${esc(oznaka)}</p>
    <h1 style="margin:0 0 16px;${SERIF}font-weight:normal;font-size:30px;line-height:1.2;color:#0a0a0b;">${esc(naslov)}</h1>
    ${tekstHtml ? `<p style="margin:0;font-size:15px;line-height:1.65;color:#3c3c42;">${tekstHtml}</p>` : ""}
  </td></tr>`;
}

/** Slobodan sadržaj (HTML) u redu sa standardnim marginama. */
export function blokSadrzaj(html: string, gore = 24, dole = 8): string {
  return `<tr><td class="px" style="padding:${gore}px 44px ${dole}px;${F}font-size:14px;line-height:1.65;color:#3c3c42;">${html}</td></tr>`;
}

/** Fotografija preko cijele širine (npr. novo vozilo), opciono kao link. */
export function blokSlika(src: string, href?: string): string {
  const img = `<img src="${esc(src)}" alt="" width="512" style="display:block;width:100%;height:auto;border:0;">`;
  return `<tr><td class="px" style="padding:28px 44px 0;">${href ? `<a href="${esc(href)}">${img}</a>` : img}</td></tr>`;
}

/**
 * Crna kartica: mala oznaka, serif naslov, pa polja po dva u redu.
 * Duga polja (siroko=true) idu preko cijele širine. Prazna se preskaču.
 */
export function blokKartica(
  oznaka: string,
  naslov: string,
  polja: { oznaka: string; vrijednost: unknown; siroko?: boolean }[] = [],
  dodatakHtml = ""
): string {
  const puna = polja.filter((p) => String(p.vrijednost ?? "").trim() !== "");
  const kratka = puna.filter((p) => !p.siroko);
  const siroka = puna.filter((p) => p.siroko);
  const celija = (p: { oznaka: string; vrijednost: unknown }, colspan = 1) =>
    `<td ${colspan > 1 ? 'colspan="2"' : 'width="50%"'} valign="top" style="padding:0 0 18px;${F}">
      <p style="margin:0 0 4px;color:#8e8e94;font-size:10px;letter-spacing:2px;text-transform:uppercase;">${esc(p.oznaka)}</p>
      <p style="margin:0;color:#ffffff;font-size:15px;line-height:1.55;">${esc(p.vrijednost).replace(/\n/g, "<br>")}</p>
    </td>`;
  let redovi = "";
  for (let i = 0; i < kratka.length; i += 2) {
    redovi += `<tr>${celija(kratka[i])}${kratka[i + 1] ? celija(kratka[i + 1]) : "<td></td>"}</tr>`;
  }
  for (const p of siroka) redovi += `<tr>${celija(p, 2)}</tr>`;
  return `<tr><td class="px" style="padding:28px 44px 8px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0b;">
      <tr><td style="padding:26px 28px 10px;${F}">
        <p style="margin:0 0 6px;color:#8e8e94;font-size:10px;letter-spacing:3px;text-transform:uppercase;">${esc(oznaka)}</p>
        <p style="margin:0 0 22px;${SERIF}font-size:24px;line-height:1.25;color:#ffffff;">${esc(naslov)}</p>
        ${dodatakHtml}
        ${redovi ? `<table role="presentation" width="100%" cellpadding="0" cellspacing="0">${redovi}</table>` : ""}
      </td></tr>
    </table>
  </td></tr>`;
}

/** Numerisani koraci (01, 02, 03…) sa naslovom iznad. */
export function blokKoraci(naslov: string, koraci: [string, string][]): string {
  const redovi = koraci
    .map(
      ([n, o], i) => `<tr>
      <td width="46" valign="top" style="padding:0 0 18px;${SERIF}font-size:22px;color:#0a0a0b;">${String(i + 1).padStart(2, "0")}</td>
      <td valign="top" style="padding:3px 0 18px;${F}">
        <p style="margin:0 0 3px;font-size:14px;font-weight:bold;color:#0a0a0b;">${esc(n)}</p>
        <p style="margin:0;font-size:13px;line-height:1.55;color:#5a5a60;">${esc(o)}</p>
      </td></tr>`
    )
    .join("");
  return `<tr><td class="px" style="padding:34px 44px 4px;${F}">
    <p style="margin:0 0 20px;color:#8e8e94;font-size:11px;letter-spacing:3px;text-transform:uppercase;">${esc(naslov)}</p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${redovi}</table>
  </td></tr>`;
}

/** Dugmad: prvo crno (glavno), ostala sa okvirom. href može biti i tel:. */
export function blokDugmad(dugmad: [string, string][], napomenaHtml = ""): string {
  const celije = dugmad
    .map(([tekst, href], i) =>
      i === 0
        ? `<td class="btn" style="background:#0a0a0b;"><a href="${esc(href)}" style="display:inline-block;padding:14px 26px;${F}font-size:12px;font-weight:bold;letter-spacing:1.5px;text-transform:uppercase;white-space:nowrap;color:#ffffff;text-decoration:none;">${esc(tekst)}</a></td>`
        : `<td width="12"></td><td class="btn" style="border:1px solid #0a0a0b;"><a href="${esc(href)}" style="display:inline-block;padding:13px 24px;${F}font-size:12px;font-weight:bold;letter-spacing:1.5px;text-transform:uppercase;white-space:nowrap;color:#0a0a0b;text-decoration:none;">${esc(tekst)}</a></td>`
    )
    .join("");
  return `<tr><td class="px" style="padding:14px 44px 40px;${F}">
    <table role="presentation" cellpadding="0" cellspacing="0"><tr>${celije}</tr></table>
    ${napomenaHtml ? `<p style="margin:28px 0 0;padding-top:18px;border-top:1px solid #ececef;font-size:12px;line-height:1.6;color:#9a9aa0;">${napomenaHtml}</p>` : ""}
  </td></tr>`;
}

/** Svijetla tabela "oznaka — vrijednost" (za interne mejlove vlasniku). */
export function tabela(redovi: [string, unknown][]): string {
  const tr = redovi
    .filter(([, v]) => String(v ?? "").trim() !== "")
    .map(
      ([k, v]) =>
        `<tr><td valign="top" style="padding:10px 16px;${F}font-size:11px;letter-spacing:1px;text-transform:uppercase;color:#8e8e94;white-space:nowrap;border-bottom:1px solid #ececef;">${esc(k)}</td><td style="padding:10px 16px;${F}font-size:14px;color:#0a0a0b;border-bottom:1px solid #ececef;">${esc(v).replace(/\n/g, "<br>")}</td></tr>`
    )
    .join("");
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #ececef;border-bottom:0;margin:0 0 16px;">${tr}</table>`;
}

/** Mejl potvrde za posjetioca. */
export function potvrdaMejl(formType: string, podaci: Podaci): string {
  const f = FORME[formType];
  if (!f) return "";
  const ime = t(podaci, "ime").split(/\s+/)[0];
  const duga = new Set(["poruka", "napomena"]);
  const kontakt = [t(podaci, "ime"), t(podaci, "telefon"), t(podaci, "email")]
    .filter(Boolean)
    .map(esc)
    .join(" · ");

  const unutra =
    blokUvod(`Potvrda · ${f.oznaka}`, ime ? `Hvala, ${ime}.` : "Hvala vam.", f.uvod(podaci)) +
    blokKartica(
      "Vaš zahtjev",
      f.naslovKartice(podaci),
      f.polja.map(([k, l]) => ({ oznaka: l, vrijednost: t(podaci, k), siroko: duga.has(k) }))
    ) +
    blokKoraci("Šta slijedi", f.koraci) +
    blokDugmad(
      [
        [f.dugme[0], `${SAJT}${f.dugme[1]}`],
        ["Pozovite nas", "tel:+38765063063"],
      ],
      kontakt ? `Vaši podaci: ${kontakt}` : ""
    );

  return okvirMejla(unutra, `Hvala${ime ? `, ${ime}` : ""} — primili smo vaš zahtjev.`);
}
