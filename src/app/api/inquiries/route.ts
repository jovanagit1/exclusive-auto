import { NextResponse } from "next/server";
import { Resend } from "resend";

/**
 * Prima sve upite sa sajta (kontakt, probna vožnja, uvoz, registracija) i
 * šalje ih direktno na email vlasnika preko Resend-a (https://resend.com).
 *
 * PODEŠAVANJE (obavezno prije lansiranja):
 *   1. Napravite besplatan nalog na https://resend.com
 *   2. U Vercel projektu → Settings → Environment Variables dodajte:
 *        RESEND_API_KEY  = vaš Resend API ključ
 *        OWNER_EMAIL     = mejl na koji upiti treba da stižu
 *                          (npr. aleksandar.maric@exclusiveautobl.com)
 *      Opcionalno:
 *        RESEND_FROM     = adresa "šalje se sa" (podrazumijevano je
 *                          Resend-ova test adresa dok ne verifikujete svoj
 *                          domen kod Resend-a — vidi README za detalje)
 *   3. Redeploy na Vercelu (izmjena env varijabli traži novi deploy).
 *
 * Dok RESEND_API_KEY nije podešen, upit se samo loguje u server log
 * (Vercel → Logs) — sajt i dalje radi, samo mejl ne stiže.
 */

const FORM_NASLOVI: Record<string, string> = {
  kontakt: "Kontakt upit",
  "probna-voznja": "Rezervacija probne vožnje",
  uvoz: "Upit za uvoz vozila",
  registracija: "Upit za registraciju vozila",
};

const FORM_LABELI: Record<string, Record<string, string>> = {};

function formatirajPodatke(data: Record<string, unknown>, formType: string) {
  const labeli = FORM_LABELI[formType] ?? {};
  return Object.entries(data)
    .filter(([, vrijednost]) => String(vrijednost ?? "").trim() !== "")
    .map(
      ([kljuc, vrijednost]) =>
        `<tr><td style="padding:6px 12px;color:#6b6b70;font-size:13px;white-space:nowrap;vertical-align:top;">${
          labeli[kljuc] ?? kljuc
        }</td><td style="padding:6px 12px;font-size:14px;">${String(
          vrijednost
        )}</td></tr>`
    )
    .join("");
}

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

    const apiKey = process.env.RESEND_API_KEY;
    const ownerEmail = process.env.OWNER_EMAIL;

    if (!apiKey || !ownerEmail) {
      console.log(
        "[inquiries] RESEND_API_KEY ili OWNER_EMAIL nisu podešeni — mejl NIJE poslat, upit je samo zabilježen u log."
      );
      return NextResponse.json({ ok: true, emailSent: false });
    }

    // Slanje mejla je "best effort" — posjetilac NIKAD ne smije dobiti grešku
    // na formi samo zato što je slanje mejla zakazalo (npr. Resend je privremeno
    // nedostupan, domen nije verifikovan, greška u mreži...). Upit je već
    // zabilježen u log iznad, pa je ovaj try/catch odvojen od spoljašnjeg —
    // šta god da se ovdje desi, posjetilac vidi da je poruka poslata.
    try {
      const resend = new Resend(apiKey);
      const naslov = FORM_NASLOVI[formType] ?? `Novi upit (${formType})`;
      const fromAdresa =
        process.env.RESEND_FROM ?? "Exclusive Auto <onboarding@resend.dev>";

      const { error } = await resend.emails.send({
        from: fromAdresa,
        to: ownerEmail,
        replyTo:
          typeof data.email === "string" && data.email ? data.email : undefined,
        subject: `${naslov} — Exclusive Auto sajt`,
        html: `
          <div style="font-family:Arial,Helvetica,sans-serif;max-width:560px;margin:0 auto;">
            <h2 style="margin:0 0 4px;">${naslov}</h2>
            <p style="color:#6b6b70;font-size:13px;margin:0 0 16px;">
              Novi upit sa sajta exclusiveautobl.com
            </p>
            <table style="width:100%;border-collapse:collapse;background:#f7f7f8;border-radius:6px;">
              ${formatirajPodatke(data, formType)}
            </table>
          </div>
        `,
      });

      if (error) {
        console.error("[inquiries] Resend greška:", error);
        return NextResponse.json({ ok: true, emailSent: false });
      }

      return NextResponse.json({ ok: true, emailSent: true });
    } catch (mailErr) {
      console.error("[inquiries] Slanje mejla nije uspjelo:", mailErr);
      return NextResponse.json({ ok: true, emailSent: false });
    }
  } catch (e) {
    console.error("[inquiries] greška:", e);
    return NextResponse.json(
      { ok: false, error: "Nevalidan zahtjev." },
      { status: 400 }
    );
  }
}
