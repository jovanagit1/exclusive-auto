import { NextResponse } from "next/server";
import { getSubscribers, saveSubscribers, type Subscriber } from "@/lib/store";
import {
  OWNER_EMAIL,
  SITE_URL,
  posaljiMejl,
  sablonMejla,
  tabelaPodataka,
  paragraf,
  dugme,
  escapeHtml,
} from "@/lib/mailer";
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
      subject: "Dobrodošli u privatni salon Exclusive Auto",
      html: sablonMejla(
        ime ? `Dobrodošli, ${ime}!` : "Dobrodošli u privatni salon!",
        paragraf(
          "Hvala što ste se prijavili u privatni salon Exclusive Auto. Od sada ćete prvi saznati kada nova vozila stignu u našu ponudu."
        ) +
          paragraf(
            "Šta to znači za vas:<br>• rane najave novih vozila, direktno na mejl<br>• kompletni podaci o vozilu i cijeni odmah u mejlu<br>• prilika da rezervišete vozilo prije redovne prodaje"
          ) +
          paragraf(
            "<b>Vaš pristup privatnom salonu:</b> kao član sada vidite i odjeljak <b>Vozila u dolasku</b> — vozila koja stižu u našu ponudu, prije nego što ih vide ostali posjetioci. Na ovom uređaju je pristup već otključan, a na telefonu ili drugom računaru ga otključavate klikom na dugme ispod."
          ) +
          dugme("Otvori Vozila u dolasku", await linkZaPristup(SITE_URL, novi.email)) +
          "&nbsp; " +
          dugme("Trenutna ponuda", `${SITE_URL}/vozila`) +
          `<p style="margin:22px 0 0;color:#9a9a9a;font-size:11px;line-height:1.6;">Prijavljeni ste sa adresom ${escapeHtml(
            novi.email
          )}. Ako ne želite više da primate obavještenja, samo odgovorite na ovaj mejl i uklonićemo vas sa liste.</p>`
      ),
    });

    await posaljiMejl({
      to: OWNER_EMAIL,
      replyTo: novi.email,
      subject: `Nova Premium prijava — ${novi.email}`,
      html: sablonMejla(
        "Nova prijava na Premium listu",
        paragraf("Neko se upravo prijavio na Premium listu (newsletter o novim vozilima):") +
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
