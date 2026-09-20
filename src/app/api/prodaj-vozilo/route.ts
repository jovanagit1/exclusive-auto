import { NextResponse } from "next/server";
import { Resend } from "resend";
import { addOtkupZahtjev, type OtkupZahtjev } from "@/lib/store";

/**
 * Prima zahtjeve sa javne stranice "/prodaj-vozilo" — posjetilac nudi svoje
 * vozilo na prodaju ili traži zamjenu za vozilo iz naše ponude. Zahtjev se
 * ČUVA (Vercel Blob, isto skladište kao vozila/pretplatnici) tako da ga
 * admin uvijek može pregledati u Admin panel → Otkup/zamjena — ovo je
 * bitno jer mejl obavještenje (ispod) radi tek kad se poveže Resend nalog.
 */
export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<OtkupZahtjev>;

    if (
      !body.ime?.trim() ||
      !body.telefon?.trim() ||
      !body.marka?.trim() ||
      !body.model?.trim() ||
      !body.godiste?.trim() ||
      !body.kilometraza?.trim() ||
      (body.tip !== "prodaja" && body.tip !== "zamjena")
    ) {
      return NextResponse.json(
        { ok: false, error: "Popunite sva obavezna polja." },
        { status: 400 }
      );
    }
    if (body.tip === "zamjena" && !body.zamjenaZaSlug) {
      return NextResponse.json(
        { ok: false, error: "Izaberite vozilo iz ponude za zamjenu." },
        { status: 400 }
      );
    }

    const zahtjev: OtkupZahtjev = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      tip: body.tip,
      zamjenaZaSlug: body.tip === "zamjena" ? body.zamjenaZaSlug : undefined,
      ime: body.ime.trim(),
      telefon: body.telefon.trim(),
      email: body.email?.trim() || undefined,
      marka: body.marka.trim(),
      model: body.model.trim(),
      godiste: body.godiste.trim(),
      kilometraza: body.kilometraza.trim(),
      gorivo: body.gorivo?.trim() || undefined,
      mjenjac: body.mjenjac?.trim() || undefined,
      boja: body.boja?.trim() || undefined,
      opis: body.opis?.trim() || undefined,
      procijenjenaCijena: body.procijenjenaCijena?.trim() || undefined,
      slike: Array.isArray(body.slike) ? body.slike.filter((s) => typeof s === "string") : [],
      poslato: new Date().toISOString(),
      status: "novo",
    };

    // Log uvijek ostaje kao poslednja linija odbrane, isto kao kod ostalih formi.
    console.log("[prodaj-vozilo] novi zahtjev:", JSON.stringify(zahtjev, null, 2));

    try {
      await addOtkupZahtjev(zahtjev);
    } catch (storeErr) {
      console.error("[prodaj-vozilo] čuvanje u skladište nije uspjelo:", storeErr);
    }

    // Mejl obavještenje vlasniku — "best effort", isto kao kod ostalih formi.
    // Dok RESEND_API_KEY nije podešen (dogovoreno da se to radi kasnije),
    // ovo se samo preskače bez greške — zahtjev je ipak sačuvan iznad.
    const apiKey = process.env.RESEND_API_KEY;
    const ownerEmail = process.env.OWNER_EMAIL ?? "aleksandar.maric@exclusiveautobl.com";
    if (apiKey) {
      try {
        const resend = new Resend(apiKey);
        const fromAdresa =
          process.env.RESEND_FROM ?? "Exclusive Auto <onboarding@resend.dev>";
        const naslovTipa =
          zahtjev.tip === "zamjena" ? "Zahtjev za zamjenu vozila" : "Ponuda za otkup vozila";
        await resend.emails.send({
          from: fromAdresa,
          to: ownerEmail,
          replyTo: zahtjev.email,
          subject: `${naslovTipa} — ${zahtjev.marka} ${zahtjev.model}`,
          html: `
            <div style="font-family:Arial,Helvetica,sans-serif;max-width:560px;margin:0 auto;">
              <h2 style="margin:0 0 4px;">${naslovTipa}</h2>
              <p style="color:#6b6b70;font-size:13px;margin:0 0 16px;">
                Novi zahtjev sa stranice /prodaj-vozilo — pregledajte ga i u Admin panel → Otkup/zamjena.
              </p>
              <table style="width:100%;border-collapse:collapse;background:#f7f7f8;border-radius:6px;">
                <tr><td style="padding:6px 12px;color:#6b6b70;font-size:13px;">Ime</td><td style="padding:6px 12px;font-size:14px;">${zahtjev.ime}</td></tr>
                <tr><td style="padding:6px 12px;color:#6b6b70;font-size:13px;">Telefon</td><td style="padding:6px 12px;font-size:14px;">${zahtjev.telefon}</td></tr>
                <tr><td style="padding:6px 12px;color:#6b6b70;font-size:13px;">Vozilo</td><td style="padding:6px 12px;font-size:14px;">${zahtjev.marka} ${zahtjev.model}, ${zahtjev.godiste}, ${zahtjev.kilometraza} km</td></tr>
                ${zahtjev.procijenjenaCijena ? `<tr><td style="padding:6px 12px;color:#6b6b70;font-size:13px;">Procijenjena cijena</td><td style="padding:6px 12px;font-size:14px;">${zahtjev.procijenjenaCijena}</td></tr>` : ""}
              </table>
            </div>
          `,
        });
      } catch (mailErr) {
        console.error("[prodaj-vozilo] slanje mejla nije uspjelo:", mailErr);
      }
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[prodaj-vozilo] greška:", e);
    return NextResponse.json(
      { ok: false, error: "Nevalidan zahtjev." },
      { status: 400 }
    );
  }
}
