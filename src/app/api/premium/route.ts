import { NextResponse } from "next/server";
import { Resend } from "resend";
import { getSubscribers, saveSubscribers, type Subscriber } from "@/lib/store";

/**
 * Javna ruta (BEZ admin prijave) — posjetioci sajta se ovdje prijavljuju da
 * postanu premium korisnici i dobijaju mejl kad izađe novo vozilo. Admin
 * i dalje vidi i upravlja cijelom listom preko Admin panel → Newsletter
 * (koji koristi istog "store" — /api/admin/newsletter).
 *
 * Nakon uspješne prijave šalju se DVA mejla preko Resend-a (isti servis kao
 * za kontakt formu i newsletter o novim vozilima):
 *   1. Mejl dobrodošlice novom pretplatniku.
 *   2. Kratko obavještenje vlasniku (OWNER_EMAIL) da je neko novi prijavljen.
 * Dok RESEND_API_KEY nije podešen na Vercelu, ovo se samo preskače (bez
 * greške) — prijava i dalje radi, samo mejlovi ne stižu dok se Resend ne
 * poveže. Vidi napomenu u /api/inquiries/route.ts za korake podešavanja.
 */

function getResendPodesavanja() {
  const apiKey = process.env.RESEND_API_KEY;
  const ownerEmail = process.env.OWNER_EMAIL ?? "aleksandar.maric@exclusiveautobl.com";
  const fromAdresa = process.env.RESEND_FROM ?? "Exclusive Auto <onboarding@resend.dev>";
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.exclusiveautobl.com";
  return { apiKey, ownerEmail, fromAdresa, siteUrl };
}

/**
 * Mejl dobrodošlice koji dobija novi premium pretplatnik.
 * Prijedlog teksta — Jovana je zamoljena da odobri/izmijeni prije lansiranja,
 * ali kod je spreman i radiće čim se RESEND_API_KEY podesi na Vercelu.
 */
function mejlDobrodoslice(subscriber: Subscriber, siteUrl: string) {
  const ime = subscriber.ime ? subscriber.ime.split(" ")[0] : "";
  const pozdrav = ime ? `Dobrodošli, ${ime}!` : "Dobrodošli u Exclusive Auto Premium!";
  return {
    subject: "Dobrodošli u Exclusive Auto Premium",
    html: `
      <div style="font-family:Arial,Helvetica,sans-serif;max-width:560px;margin:0 auto;">
        <p style="font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:#8a8a8a;margin:0 0 6px;">
          Exclusive Auto · Premium članstvo
        </p>
        <h2 style="margin:0 0 14px;">${pozdrav}</h2>
        <p style="color:#333;font-size:14px;line-height:1.6;margin:0 0 14px;">
          Hvala što ste se prijavili na Exclusive Auto Premium listu. Od sada
          ćete prvi saznati kada nova vozila stignu u našu ponudu — prije nego
          što ih uopšte objavimo na sajtu.
        </p>
        <p style="color:#333;font-size:14px;line-height:1.6;margin:0 0 14px;">
          Šta to znači za vas:
        </p>
        <ul style="color:#333;font-size:14px;line-height:1.8;margin:0 0 20px;padding-left:20px;">
          <li>Rane, ekskluzivne najave novih vozila — mejlom, čim ih unesemo</li>
          <li>Kompletni podaci o vozilu i cijeni odmah u mejlu</li>
          <li>Prilika da rezervišete vozilo prije nego što stigne u redovnu prodaju</li>
        </ul>
        <a href="${siteUrl}/vozila" style="background:#111;color:#fff;padding:11px 20px;text-decoration:none;border-radius:4px;font-size:13px;display:inline-block;">
          Pogledajte trenutnu ponudu
        </a>
        <p style="margin-top:28px;color:#9a9a9a;font-size:11px;line-height:1.6;">
          Ovaj mejl ste dobili jer ste se prijavili na Exclusive Auto Premium
          listu na exclusiveautobl.com. Ako se niste prijavili vi, ili ne
          želite više da primate ova obavještenja, samo nam odgovorite na ovaj
          mejl i uklonićemo vas sa liste.
        </p>
      </div>
    `,
  };
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { email?: string; ime?: string };
    const email = body.email?.trim().toLowerCase();
    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { ok: false, error: "Unesite ispravnu email adresu." },
        { status: 400 }
      );
    }

    const subscribers = await getSubscribers();
    if (subscribers.some((s) => s.email === email)) {
      return NextResponse.json(
        { ok: false, error: "Ova email adresa je već prijavljena." },
        { status: 400 }
      );
    }

    const novi: Subscriber = {
      email,
      ime: body.ime?.trim() || undefined,
      napomena: "Prijavljen/a sa sajta",
      dodano: new Date().toISOString(),
    };
    await saveSubscribers([...subscribers, novi]);

    // Slanje mejlova je "best effort" — prijava je već sačuvana iznad, pa
    // eventualna greška pri slanju mejla ne smije pokvariti odgovor korisniku.
    const { apiKey, ownerEmail, fromAdresa, siteUrl } = getResendPodesavanja();
    if (!apiKey) {
      console.log(
        "[premium] RESEND_API_KEY nije podešen — mejl dobrodošlice i obavještenje vlasniku NISU poslati (prijava je ipak sačuvana)."
      );
    } else {
      const resend = new Resend(apiKey);

      try {
        const dobrodoslica = mejlDobrodoslice(novi, siteUrl);
        const { error } = await resend.emails.send({
          from: fromAdresa,
          to: novi.email,
          subject: dobrodoslica.subject,
          html: dobrodoslica.html,
        });
        if (error) console.error("[premium] Greška pri slanju mejla dobrodošlice:", error);
      } catch (err) {
        console.error("[premium] Greška pri slanju mejla dobrodošlice:", err);
      }

      try {
        const { error } = await resend.emails.send({
          from: fromAdresa,
          to: ownerEmail,
          subject: "Novi premium pretplatnik — Exclusive Auto sajt",
          html: `
            <div style="font-family:Arial,Helvetica,sans-serif;max-width:560px;margin:0 auto;">
              <h2 style="margin:0 0 4px;">Novi premium pretplatnik</h2>
              <p style="color:#6b6b70;font-size:13px;margin:0 0 16px;">
                Neko se upravo prijavio na Premium listu na sajtu.
              </p>
              <table style="width:100%;border-collapse:collapse;background:#f7f7f8;border-radius:6px;">
                <tr><td style="padding:6px 12px;color:#6b6b70;font-size:13px;white-space:nowrap;">Email</td><td style="padding:6px 12px;font-size:14px;">${novi.email}</td></tr>
                ${novi.ime ? `<tr><td style="padding:6px 12px;color:#6b6b70;font-size:13px;white-space:nowrap;">Ime</td><td style="padding:6px 12px;font-size:14px;">${novi.ime}</td></tr>` : ""}
              </table>
            </div>
          `,
        });
        if (error) console.error("[premium] Greška pri slanju obavještenja vlasniku:", error);
      } catch (err) {
        console.error("[premium] Greška pri slanju obavještenja vlasniku:", err);
      }
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[premium] greška:", err);
    const message = err instanceof Error ? err.message : "Nepoznata greška.";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
