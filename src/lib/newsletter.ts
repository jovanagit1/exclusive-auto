import { Resend } from "resend";
import { formatPrice, type Vehicle } from "./vehicles";
import { getSubscribers } from "./store";

/**
 * Šalje obavještenje o novom vozilu svim premium pretplatnicima
 * (korisnicima koji su kupili 2+ vozila kod Exclusive Auto — Aco ih ručno
 * dodaje u Admin panel → Newsletter).
 */
export async function posaljiObavjestenjeONovomVozilu(vehicle: Vehicle) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error(
      "RESEND_API_KEY nije podešen — newsletter mejlovi se ne mogu poslati."
    );
  }

  const subscribers = await getSubscribers();
  if (subscribers.length === 0) {
    return { poslato: 0, ukupno: 0 };
  }

  const resend = new Resend(apiKey);
  const fromAdresa =
    process.env.RESEND_FROM ?? "Exclusive Auto <onboarding@resend.dev>";
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.exclusiveautobl.com";
  const link = `${siteUrl}/vozila/${vehicle.slug}`;
  const slika = vehicle.slike?.[0];

  let poslato = 0;
  for (const sub of subscribers) {
    try {
      const { error } = await resend.emails.send({
        from: fromAdresa,
        to: sub.email,
        subject: `Novo vozilo za vas: ${vehicle.marka} ${vehicle.model}`,
        html: `
          <div style="font-family:Arial,Helvetica,sans-serif;max-width:560px;margin:0 auto;">
            <p style="font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:#8a8a8a;margin:0 0 6px;">
              Exclusive Auto · Premium obavještenje
            </p>
            <h2 style="margin:0 0 10px;">${vehicle.marka} ${vehicle.model}</h2>
            ${
              slika
                ? `<img src="${slika}" alt="" style="width:100%;border-radius:6px;margin-bottom:14px;display:block;" />`
                : ""
            }
            <p style="font-size:20px;font-weight:700;margin:0 0 10px;">${formatPrice(
              vehicle.cijena,
              vehicle.valuta
            )}</p>
            <p style="color:#444;font-size:14px;line-height:1.55;margin:0 0 18px;">${
              vehicle.opis
            }</p>
            <a href="${link}" style="background:#111;color:#fff;padding:11px 20px;text-decoration:none;border-radius:4px;font-size:13px;display:inline-block;">
              Pogledaj vozilo
            </a>
            <p style="margin-top:24px;color:#9a9a9a;font-size:11px;">
              Ovaj mejl ste dobili jer ste premium korisnik Exclusive Auto.
            </p>
          </div>
        `,
      });
      if (!error) poslato++;
      else console.error(`[newsletter] Greška za ${sub.email}:`, error);
    } catch (err) {
      console.error(`[newsletter] Greška za ${sub.email}:`, err);
    }
  }

  return { poslato, ukupno: subscribers.length };
}
