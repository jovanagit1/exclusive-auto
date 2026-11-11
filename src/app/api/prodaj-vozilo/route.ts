import { NextResponse } from "next/server";
import { addOtkupZahtjev, getVehicleBySlug, type OtkupZahtjev } from "@/lib/store";
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
import { okvirMejla, blokUvod, blokKartica, blokKoraci, blokDugmad } from "@/lib/mejl-potvrda";

/**
 * Prima zahtjeve sa javne stranice "/zamjena-vozila" — posjetilac nudi svoje
 * vozilo u zamjenu za vozilo iz naše ponude, uz doplatu razlike. (Otkup
 * vozila je ukinut; stari zahtjevi tipa "prodaja" ostaju vidljivi u adminu.) Zahtjev se
 * ČUVA (Vercel Blob, isto skladište kao vozila/pretplatnici) tako da ga
 * admin uvijek može pregledati u Admin panel → Zamjena vozila — ovo je
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
      body.tip !== "zamjena"
    ) {
      return NextResponse.json(
        { ok: false, error: "Popunite sva obavezna polja." },
        { status: 400 }
      );
    }
    const zahtjev: OtkupZahtjev = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      tip: "zamjena",
      zamjenaZaSlug: body.zamjenaZaSlug?.trim() || undefined,
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

    // Mejlovi: vlasniku kompletan zahtjev, a posjetiocu potvrda sa sažetkom.
    let zamjenaNaziv = "";
    if (zahtjev.zamjenaZaSlug) {
      const v = await getVehicleBySlug(zahtjev.zamjenaZaSlug).catch(() => undefined);
      zamjenaNaziv = v ? `${v.marka} ${v.model} (${v.godiste})` : zahtjev.zamjenaZaSlug;
    }
    const tipTekst = "Zamjena vozila";
    const redovi: [string, unknown][] = [
      ["Zahtjev", tipTekst],
      ["Željeno vozilo iz ponude", zamjenaNaziv || "Još bira — predložiti"],
      ["Marka i model", `${zahtjev.marka} ${zahtjev.model}`],
      ["Godište", zahtjev.godiste],
      ["Kilometraža", `${zahtjev.kilometraza} km`],
      ["Gorivo", zahtjev.gorivo ?? ""],
      ["Mjenjač", zahtjev.mjenjac ?? ""],
      ["Boja", zahtjev.boja ?? ""],
      ["Očekivana vrijednost", zahtjev.procijenjenaCijena ?? ""],
      ["Stanje / napomena", zahtjev.opis ?? ""],
      ["Broj fotografija", String(zahtjev.slike.length)],
    ];
    const kontakt: [string, unknown][] = [
      ["Ime i prezime", zahtjev.ime],
      ["Telefon", zahtjev.telefon],
      ["Email", zahtjev.email ?? ""],
    ];
    const slikeHtml = zahtjev.slike.length
      ? '<div style="margin-top:16px;">' +
        zahtjev.slike
          .map(
            (src) =>
              `<a href="${escapeHtml(src)}"><img src="${escapeHtml(src)}" alt="" style="width:120px;height:90px;object-fit:cover;border-radius:4px;margin:0 6px 6px 0;border:1px solid #ddd;"></a>`
          )
          .join("") +
        "</div>"
      : "";

    await posaljiMejl({
      to: OWNER_EMAIL,
      replyTo: zahtjev.email,
      subject: `${tipTekst}: ${zahtjev.marka} ${zahtjev.model} — ${zahtjev.ime}`,
      html: sablonMejla(
        `${zahtjev.marka} ${zahtjev.model}`,
        paragraf("Novi zahtjev za zamjenu vozila (staro za novo, uz doplatu) sa stranice „Zamjena vozila“.") +
          tabelaPodataka(kontakt) +
          "<br>" +
          tabelaPodataka(redovi) +
          slikeHtml +
          "<br>" +
          dugme("Otvori u admin panelu", `${SITE_URL}/admin/otkup`)
      ),
    });

    if (zahtjev.email?.includes("@")) {
      await posaljiMejl({
        to: zahtjev.email,
        replyTo: OWNER_EMAIL,
        subject: "Potvrda: primili smo vaš zahtjev — Exclusive Auto",
        html: okvirMejla(
          blokUvod(
            "Potvrda · Zamjena vozila",
            `Hvala, ${zahtjev.ime.split(" ")[0]}.`,
            `Vaš zahtjev za zamjenu vozila <b>${escapeHtml(`${zahtjev.marka} ${zahtjev.model}`)}</b> je stigao do nas. Pregledaćemo podatke i javiti vam se sa procjenom i iznosom doplate.`
          ) +
            blokKartica("Vaše vozilo", `${zahtjev.marka} ${zahtjev.model}`, [
              { oznaka: "Godište", vrijednost: zahtjev.godiste },
              { oznaka: "Kilometraža", vrijednost: `${zahtjev.kilometraza} km` },
              { oznaka: "Gorivo", vrijednost: zahtjev.gorivo ?? "" },
              { oznaka: "Mjenjač", vrijednost: zahtjev.mjenjac ?? "" },
              { oznaka: "Boja", vrijednost: zahtjev.boja ?? "" },
              { oznaka: "Vaša očekivanja", vrijednost: zahtjev.procijenjenaCijena ?? "" },
              { oznaka: "Zamjena za", vrijednost: zamjenaNaziv || "Predložićemo vam vozilo", siroko: true },
              { oznaka: "Stanje / napomena", vrijednost: zahtjev.opis ?? "", siroko: true },
            ]) +
            blokKoraci("Šta slijedi", [
              ["Pregled", "Pregledamo podatke i fotografije vašeg vozila."],
              ["Procjena", "Javljamo vam se sa realnom procjenom vrijednosti."],
              ["Zamjena", "Doplaćujete razliku, a mi preuzimamo svu papirologiju."],
            ]) +
            blokDugmad(
              [
                ["Pogledaj ponudu", `${SITE_URL}/vozila`],
                ["Pozovite nas", "tel:+38765063063"],
              ],
              `Vaši podaci: ${[zahtjev.ime, zahtjev.telefon, zahtjev.email ?? ""].filter(Boolean).map(escapeHtml).join(" · ")}`
            ),
          "Primili smo vaš zahtjev — Exclusive Auto"
        ),
      });
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
