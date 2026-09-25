import { NextResponse } from "next/server";
import {
  OWNER_EMAIL,
  posaljiMejl,
  sablonMejla,
  tabelaPodataka,
  paragraf,
  escapeHtml,
} from "@/lib/mailer";

/**
 * Prima sve upite sa sajta (kontakt, probna vožnja, uvoz, registracija):
 *   1. šalje obavještenje vlasniku (OWNER_EMAIL) sa svim podacima,
 *   2. šalje POTVRDU posjetiocu (ako je ostavio email) sa kopijom upita.
 * Podešavanje slanja mejlova: vidi src/lib/mailer.ts.
 */

const FORM_NASLOVI: Record<string, string> = {
  kontakt: "Kontakt upit",
  "probna-voznja": "Rezervacija probne vožnje",
  uvoz: "Upit za uvoz vozila",
  registracija: "Upit za registraciju vozila",
  kredit: "Upit za kredit",
  lizing: "Upit za lizing",
};

const POTVRDA_TEKST: Record<string, string> = {
  kontakt: "Primili smo vašu poruku i javićemo vam se u najkraćem roku.",
  "probna-voznja":
    "Primili smo vaš zahtjev za probnu vožnju. Tačan termin ćemo potvrditi telefonom ili mejlom.",
  uvoz: "Primili smo vaš upit za uvoz vozila. Krećemo u potragu i javljamo vam se sa ponudama.",
  registracija: "Primili smo vaš upit za registraciju vozila i uskoro vam se javljamo.",
  kredit: "Primili smo vaš upit za kredit. Javljamo vam se sa ponudom i narednim koracima.",
  lizing: "Primili smo vaš upit za lizing. Javljamo vam se sa ponudom po vašoj mjeri.",
};

const LABELI: Record<string, string> = {
  ime: "Ime i prezime",
  telefon: "Telefon",
  email: "Email",
  poruka: "Poruka",
  vozilo: "Vozilo",
  datum: "Željeni datum",
  napomena: "Napomena",
  markaModel: "Marka i model",
  odakle: "Uvoz iz",
  budzet: "Budžet",
  godiste: "Godište",
  status: "Status vozila",
  cijena: "Cijena vozila",
  ucesce: "Učešće",
  iznosKredita: "Iznos kredita",
  rok: "Rok otplate",
  rata: "Mjesečna rata",
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { formType, data } = body as {
      formType?: string;
      data?: Record<string, unknown>;
    };

    if (!formType || !data) {
      return NextResponse.json(
        { ok: false, error: "Nedostaju podaci." },
        { status: 400 }
      );
    }

    console.log(`[Upit: ${formType}]`, JSON.stringify(data, null, 2));

    const naslov = FORM_NASLOVI[formType] ?? `Novi upit (${formType})`;
    const redovi = Object.entries(data).map(
      ([k, v]) => [LABELI[k] ?? k, v] as [string, unknown]
    );
    const email = typeof data.email === "string" ? data.email.trim() : "";
    const ime = typeof data.ime === "string" ? data.ime.trim().split(" ")[0] : "";

    // 1. Vlasniku
    await posaljiMejl({
      to: OWNER_EMAIL,
      replyTo: email || undefined,
      subject: `${naslov} — ${String(data.ime ?? "")}`.trim(),
      html: sablonMejla(
        naslov,
        paragraf("Novi upit sa sajta exclusiveautobl.com:") + tabelaPodataka(redovi)
      ),
    });

    // 2. Potvrda posjetiocu
    if (email.includes("@")) {
      await posaljiMejl({
        to: email,
        replyTo: OWNER_EMAIL,
        subject: `Potvrda: ${naslov} — Exclusive Auto`,
        html: sablonMejla(
          ime ? `Hvala, ${ime}!` : "Hvala vam!",
          paragraf(escapeHtml(POTVRDA_TEKST[formType] ?? "Primili smo vaš upit.")) +
            paragraf("Kopija podataka koje ste poslali:") +
            tabelaPodataka(redovi) +
            paragraf(
              '<br>Za hitna pitanja pozovite nas na <a href="tel:+38765063063">065 063 063</a>.'
            )
        ),
      });
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[inquiries] greška:", e);
    return NextResponse.json(
      { ok: false, error: "Nevalidan zahtjev." },
      { status: 400 }
    );
  }
}
