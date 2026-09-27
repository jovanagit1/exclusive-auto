import { formatPrice, formatKubikaza, formatSnaga, kategorijaVozila, type Vehicle } from "./vehicles";
import { linkZaPristup } from "./salon";
import { getSubscribers } from "./store";
import {
  OWNER_EMAIL,
  SITE_URL,
  posaljiMejl,
  escapeHtml,
  mailKonfigurisan,
} from "./mailer";
import { okvirMejla, blokUvod, blokKartica, blokSlika, blokDugmad } from "./mejl-potvrda";

/**
 * Šalje obavještenje o novom vozilu svim Premium pretplatnicima.
 * Poziva se iz admin panela kad se doda novo vozilo uz uključenu opciju
 * "Pošalji obavještenje premium korisnicima".
 */
export async function posaljiObavjestenjeONovomVozilu(vehicle: Vehicle) {
  const subscribers = await getSubscribers();
  if (subscribers.length === 0 || !mailKonfigurisan()) {
    return { poslato: 0, ukupno: subscribers.length };
  }

  const uDolasku = kategorijaVozila(vehicle) === "dolazak";
  const slika = vehicle.slike?.[0];
  const naAkciji = Boolean(vehicle.akcija && vehicle.regularnaCijena);
  const cijenaHtml = naAkciji
    ? `<p style="margin:-10px 0 22px;font-family:Arial,Helvetica,sans-serif;"><span style="color:#8e8e94;text-decoration:line-through;font-size:15px;">${escapeHtml(
        formatPrice(vehicle.regularnaCijena!, vehicle.valuta)
      )}</span> &nbsp;<span style="color:#ff6b5e;font-size:22px;font-weight:bold;">${escapeHtml(
        formatPrice(vehicle.cijena, vehicle.valuta)
      )}</span></p>`
    : `<p style="margin:-10px 0 22px;font-family:Arial,Helvetica,sans-serif;font-size:22px;font-weight:bold;color:#ffffff;">${escapeHtml(
        formatPrice(vehicle.cijena, vehicle.valuta)
      )}</p>`;

  const html = (ime: string | undefined, link: string) =>
    okvirMejla(
      blokUvod(
        uDolasku ? "Exclusive Auto VIP · Stiže uskoro" : "Exclusive Auto VIP · Novo u ponudi",
        ime ? `${ime.split(" ")[0]}, ovo je za vas.` : "Ovo je za vas.",
        uDolasku
          ? "Ekskluzivno za VIP članove: ovo vozilo je na putu do nas i još nije u javnoj ponudi."
          : "U našu ponudu upravo je stiglo novo vozilo — kao VIP član saznajete prvi."
      ) +
        (slika ? blokSlika(slika, link) : "") +
        blokKartica(
          vehicle.marka,
          vehicle.model,
          [
            { oznaka: "Godište", vrijednost: String(vehicle.godiste) },
            { oznaka: "Kilometraža", vrijednost: `${vehicle.km.toLocaleString("de-DE")} km` },
            { oznaka: "Gorivo", vrijednost: vehicle.gorivo },
            { oznaka: "Mjenjač", vrijednost: vehicle.mjenjac },
            { oznaka: "Kubikaža", vrijednost: formatKubikaza(vehicle.kubikaza) },
            { oznaka: "Snaga", vrijednost: formatSnaga(vehicle.snaga, vehicle.snagaKw) },
          ],
          cijenaHtml
        ) +
        blokDugmad(
          [
            ["Pogledaj vozilo", link],
            ["Pozovite nas", "tel:+38765063063"],
          ],
          "Ovaj mejl ste dobili jer ste član EXCLUSIVE AUTO VIP. Za odjavu samo odgovorite na ovaj mejl."
        ),
      `${vehicle.marka} ${vehicle.model} — ${formatPrice(vehicle.cijena, vehicle.valuta)}`
    );

  let poslato = 0;
  for (const sub of subscribers) {
    // Lični link otključava privatni salon i na uređaju sa kojeg se otvori mejl.
    const link = await linkZaPristup(SITE_URL, sub.email, `/vozila/${vehicle.slug}`);
    const ok = await posaljiMejl({
      to: sub.email,
      replyTo: OWNER_EMAIL,
      subject: uDolasku
        ? `Stiže uskoro: ${vehicle.marka} ${vehicle.model}`
        : `Novo vozilo: ${vehicle.marka} ${vehicle.model}`,
      html: html(sub.ime, link),
    });
    if (ok) poslato++;
  }

  return { poslato, ukupno: subscribers.length };
}
