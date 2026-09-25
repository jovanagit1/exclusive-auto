import { formatPrice, formatKubikaza, formatSnaga, type Vehicle } from "./vehicles";
import { getSubscribers } from "./store";
import {
  OWNER_EMAIL,
  SITE_URL,
  posaljiMejl,
  sablonMejla,
  tabelaPodataka,
  paragraf,
  dugme,
  escapeHtml,
  mailKonfigurisan,
} from "./mailer";

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

  const link = `${SITE_URL}/vozila/${vehicle.slug}`;
  const slika = vehicle.slike?.[0];
  const naAkciji = Boolean(vehicle.akcija && vehicle.regularnaCijena);
  const cijenaHtml = naAkciji
    ? `<p style="margin:0 0 14px;"><span style="color:#999;text-decoration:line-through;font-size:15px;">${escapeHtml(
        formatPrice(vehicle.regularnaCijena!, vehicle.valuta)
      )}</span> &nbsp;<span style="color:#c0392b;font-size:22px;font-weight:bold;">${escapeHtml(
        formatPrice(vehicle.cijena, vehicle.valuta)
      )}</span></p>`
    : `<p style="margin:0 0 14px;font-size:22px;font-weight:bold;color:#111;">${escapeHtml(
        formatPrice(vehicle.cijena, vehicle.valuta)
      )}</p>`;

  const html = (ime?: string) =>
    sablonMejla(
      `${vehicle.marka} ${vehicle.model}`,
      paragraf(
        `${ime ? `Poštovani/a ${escapeHtml(ime.split(" ")[0])}, ` : ""}u našu ponudu upravo je stiglo novo vozilo — prvi saznajete kao Premium korisnik.`
      ) +
        (slika
          ? `<a href="${link}"><img src="${escapeHtml(slika)}" alt="" style="width:100%;border-radius:6px;margin:0 0 14px;display:block;"></a>`
          : "") +
        cijenaHtml +
        tabelaPodataka([
          ["Godište", String(vehicle.godiste)],
          ["Kilometraža", `${vehicle.km.toLocaleString("de-DE")} km`],
          ["Gorivo", vehicle.gorivo],
          ["Mjenjač", vehicle.mjenjac],
          ["Kubikaža", formatKubikaza(vehicle.kubikaza)],
          ["Snaga", formatSnaga(vehicle.snaga, vehicle.snagaKw)],
        ]) +
        "<br>" +
        dugme("Pogledaj vozilo", link) +
        `<p style="margin:22px 0 0;color:#9a9a9a;font-size:11px;">Ovaj mejl ste dobili jer ste prijavljeni na Exclusive Auto Premium listu. Za odjavu samo odgovorite na ovaj mejl.</p>`
    );

  let poslato = 0;
  for (const sub of subscribers) {
    const ok = await posaljiMejl({
      to: sub.email,
      replyTo: OWNER_EMAIL,
      subject: `Novo vozilo: ${vehicle.marka} ${vehicle.model}`,
      html: html(sub.ime),
    });
    if (ok) poslato++;
  }

  return { poslato, ukupno: subscribers.length };
}
