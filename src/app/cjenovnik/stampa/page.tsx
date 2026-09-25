import type { Metadata } from "next";
import { getVehicles } from "@/lib/store";
import { formatPrice, formatKubikaza } from "@/lib/vehicles";
import { LogoFull } from "@/components/Logo";
import StampaToolbar from "@/components/StampaToolbar";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Ponuda odabranih vozila",
  robots: { index: false, follow: false },
};

/**
 * Stranica za štampu/PDF odabranih vozila iz cjenovnika (npr. kad kupac na
 * placu bira između 2–3 vozila). Za svako vozilo: prva (naslovna)
 * fotografija, godište, kilometraža, kubikaža i cijena. Otvara se iz
 * Cjenovnika preko "Štampaj / PDF odabranih".
 */
export default async function StampaPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { v } = await searchParams;
  const slugovi = (Array.isArray(v) ? v.join(",") : v ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const sva = await getVehicles();
  const vozila = slugovi
    .map((s) => sva.find((x) => x.slug === s))
    .filter((x): x is NonNullable<typeof x> => Boolean(x));

  const datum = new Date().toLocaleDateString("bs-BA", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  return (
    <div className="stampa-wrap min-h-screen bg-neutral-200 px-4 py-8 text-black print:bg-white print:p-0">
      <style>{`
        @page { size: A4; margin: 12mm; }
        @media print {
          html, body { background: #fff !important; }
          .stampa-list { box-shadow: none !important; padding: 0 !important; }
        }
        .stampa-wrap { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      `}</style>

      <StampaToolbar broj={vozila.length} />

      <div className="stampa-list mx-auto max-w-[210mm] bg-white p-[12mm] shadow-xl">
        <div className="flex items-end justify-between border-b-2 border-black pb-4">
          <LogoFull className="h-20 w-auto text-black" />
          <div className="text-right text-[10px] leading-relaxed text-neutral-700">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-black">
              Ponuda vozila
            </p>
            <p>Datum: {datum}</p>
            <p>Jaroslava Plecitija 17, 78000 Banja Luka</p>
            <p>065 063 063 · 066 888 555</p>
          </div>
        </div>

        {vozila.length === 0 && (
          <p className="py-16 text-center text-sm text-neutral-500">
            Nije odabrano nijedno vozilo. Vratite se na cjenovnik i označite
            vozila kvačicom.
          </p>
        )}

        <div className="divide-y divide-neutral-300">
          {vozila.map((vozilo) => {
            const naAkciji = Boolean(vozilo.akcija && vozilo.regularnaCijena);
            const slika = vozilo.slike?.[0];
            const podaci: [string, string][] = [
              ["Godište", String(vozilo.godiste)],
              ["Kilometraža", `${vozilo.km.toLocaleString("de-DE")} km`],
              ["Kubikaža", vozilo.kubikaza ? formatKubikaza(vozilo.kubikaza) : "—"],
            ];
            return (
              <article
                key={vozilo.slug}
                className="grid grid-cols-[88mm_1fr] gap-6 py-6"
                style={{ breakInside: "avoid" }}
              >
                <div className="aspect-[4/3] overflow-hidden rounded-sm border border-neutral-300 bg-neutral-100">
                  {slika ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={slika} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-xs text-neutral-400">
                      Bez fotografije
                    </div>
                  )}
                </div>

                <div className="flex flex-col">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-neutral-500">
                    {vozilo.marka}
                  </p>
                  <h2 className="mt-1 font-display text-2xl leading-tight">
                    {vozilo.model}
                  </h2>

                  <div className="mt-3">
                    {naAkciji ? (
                      <div className="flex flex-wrap items-baseline gap-3">
                        <span className="text-sm text-neutral-500 line-through">
                          {formatPrice(vozilo.regularnaCijena!, vozilo.valuta)}
                        </span>
                        <span className="text-2xl font-bold text-red-700">
                          {formatPrice(vozilo.cijena, vozilo.valuta)}
                        </span>
                        <span className="rounded-sm bg-red-700 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white">
                          Akcija
                        </span>
                      </div>
                    ) : (
                      <span className="text-2xl font-bold">
                        {formatPrice(vozilo.cijena, vozilo.valuta)}
                      </span>
                    )}
                  </div>

                  <dl className="mt-4 grid grid-cols-3 gap-3 border-t border-neutral-300 pt-4">
                    {podaci.map(([label, value]) => (
                      <div key={label}>
                        <dt className="text-[9px] uppercase tracking-wider text-neutral-500">
                          {label}
                        </dt>
                        <dd className="mt-0.5 text-sm font-semibold">{value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </article>
            );
          })}
        </div>

        <div className="mt-2 border-t-2 border-black pt-3 text-center text-[9px] uppercase tracking-[0.2em] text-neutral-600">
          www.exclusiveautobl.com · Sva vozila pogledajte na našem sajtu
        </div>
      </div>
    </div>
  );
}
