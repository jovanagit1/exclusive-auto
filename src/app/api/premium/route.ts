import { NextResponse } from "next/server";
import { getSubscribers, saveSubscribers, type Subscriber } from "@/lib/store";
import {
  OWNER_EMAIL,
  SITE_URL,
  posaljiMejl,
  sablonMejla,
  tabelaPodataka,
  paragraf,
  escapeHtml,
} from "@/lib/mailer";
import { U_DOLASKU_AKTIVNO } from "@/lib/u-dolasku";
import { okvirMejla, blokUvod, blokKartica, blokSadrzaj, blokDugmad } from "@/lib/mejl-potvrda";
import { SALON_COOKIE, opcijeKolacica, vrijednostKolacica, linkZaPristup } from "@/lib/salon";

/**
 * Javna ruta (BEZ admin prijave) — posjetioci se prijavljuju na Premium
 * listu (newsletter o novim vozilima). Nakon prijave:
 *   1. novi pretplatnik dobija mejl dobrodošlice (potvrdu prijave),
 *   2. vlasnik (OWNER_EMAIL) dobija obavještenje o novoj prijavi.
 */
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
      // Već je na listi — samo mu otključamo privatni salon u ovom browseru.
      const res = NextResponse.json({ ok: true, vecPrijavljen: true });
      res.cookies.set(SALON_COOKIE, await vrijednostKolacica(email), opcijeKolacica);
      return res;
    }

    const novi: Subscriber = {
      email,
      ime: body.ime?.trim() || undefined,
      napomena: "Prijavljen/a sa sajta",
      dodano: new Date().toISOString(),
    };
    await saveSubscribers([...subscribers, novi]);

    const ime = novi.ime ? novi.ime.split(" ")[0] : "";

    await posaljiMejl({
      to: novi.email,
      replyTo: OWNER_EMAIL,
      subject: "Dobrodošli u EXCLUSIVE AUTO VIP",
      html: okvirMejla(
        blokUvod(
          "Exclusive Auto VIP",
          ime ? `Dobrodošli, ${ime}.` : "Dobrodošli.",
          "Hvala što ste postali član EXCLUSIVE AUTO VIP. Od sada prvi saznajete kada nova vozila stignu u našu ponudu."
        ) +
          blokKartica(
            "Vaše članstvo",
            "EXCLUSIVE AUTO VIP",
            [],
            `<p style="margin:-8px 0 20px;font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.9;color:#d8d8dc;">
              ${U_DOLASKU_AKTIVNO ? "— Vozila u dolasku, prije svih ostalih<br>" : ""}
              — Najave novih vozila direktno na mejl<br>
              — Kompletni podaci i cijena odmah u mejlu<br>
              — Prilika da rezervišete vozilo prije redovne prodaje
            </p>`
          ) +
          (U_DOLASKU_AKTIVNO
            ? blokSadrzaj(
                "Na ovom uređaju je VIP pristup već otključan. Na telefonu ili drugom računaru ga otključavate klikom na dugme ispod.",
                26,
                0
              )
            : "") +
          blokDugmad(
            U_DOLASKU_AKTIVNO
              ? [
                  ["Vozila u dolasku", await linkZaPristup(SITE_URL, novi.email)],
                  ["Trenutna ponuda", `${SITE_URL}/vozila`],
                ]
              : [
                  ["Trenutna ponuda", `${SITE_URL}/vozila`],
                  ["Pozovite nas", "tel:+38765063063"],
                ],
            `Prijavljeni ste sa adresom ${escapeHtml(
              novi.email
            )}. Ako ne želite više da primate obavještenja, samo odgovorite na ovaj mejl i uklonićemo vas sa liste.`
          ),
        "Dobrodošli u EXCLUSIVE AUTO VIP"
      ),
    });

    await posaljiMejl({
      to: OWNER_EMAIL,
      replyTo: novi.email,
      subject: `Novi VIP član — ${novi.email}`,
      html: sablonMejla(
        "Novi VIP član",
        paragraf("Neko se upravo prijavio u EXCLUSIVE AUTO VIP (newsletter o novim vozilima):") +
          tabelaPodataka([
            ["Email", novi.email],
            ["Ime", novi.ime ?? ""],
            ["Ukupno na listi", String(subscribers.length + 1)],
          ])
      ),
    });

    const res = NextResponse.json({ ok: true });
    res.cookies.set(SALON_COOKIE, await vrijednostKolacica(novi.email), opcijeKolacica);
    return res;
  } catch (err) {
    console.error("[premium] greška:", err);
    const message = err instanceof Error ? err.message : "Nepoznata greška.";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
