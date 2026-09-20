import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatKubikaza, formatSnaga } from "@/lib/vehicles";
import { getVehicleBySlug } from "@/lib/store";
import VehicleGallery from "@/components/VehicleGallery";
import FavoriteButton from "@/components/FavoriteButton";
import PriceTag from "@/components/PriceTag";

function KvacicaIkonica() {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      className="h-3.5 w-3.5 shrink-0 text-accent"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 10.5 8 14.5 16 6" />
    </svg>
  );
}

// Vozila se mogu dodati/izmijeniti u svakom trenutku preko admin panela,
// pa ova stranica uvijek učitava svježe podatke (bez statičkog keširanja).
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const vehicle = await getVehicleBySlug(slug);
  if (!vehicle) return {};
  return {
    title: `${vehicle.marka} ${vehicle.model}`,
    description: vehicle.opis,
  };
}

export default async function VehicleDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const vehicle = await getVehicleBySlug(slug);
  if (!vehicle) notFound();

  const specs: [string, string][] = [
    ["Godište", String(vehicle.godiste)],
    ["Kilometraža", `${vehicle.km.toLocaleString("de-DE")} km`],
    ["Gorivo", vehicle.gorivo],
    ["Mjenjač", vehicle.mjenjac],
    ...(vehicle.kubikaza ? ([["Kubikaža", formatKubikaza(vehicle.kubikaza)]] as [string, string][]) : []),
    ["Snaga", formatSnaga(vehicle.snaga, vehicle.snagaKw)],
    ...(vehicle.tipKaroserije ? ([["Tip", vehicle.tipKaroserije]] as [string, string][]) : []),
    ...(vehicle.pogon ? ([["Pogon", vehicle.pogon]] as [string, string][]) : []),
    ...(vehicle.brojVrata ? ([["Broj vrata", vehicle.brojVrata]] as [string, string][]) : []),
    ["Boja", vehicle.boja],
  ];

  // Sve popunjene "Dodatne informacije" (padajući meniji iz admin panela) —
  // prikazuju se samo one stavke koje su za ovo vozilo unijete.
  const sveDodatneInformacije: [string, string][] = [
    ["Tip ovjesa", vehicle.tipOvjesa ?? ""],
    ["Masa/Težina", vehicle.masa ? `${vehicle.masa} kg` : ""],
    ["Garancija", vehicle.garancija ?? ""],
    ["Svjetla", vehicle.svjetla ?? ""],
    ["Sjedećih mjesta", vehicle.brojSjedista ?? ""],
    ["Zaštita/Blokada", vehicle.zastitaBlokada ?? ""],
    ["Broj stepeni prijenosa", vehicle.brojStepeniPrijenosa ?? ""],
    ["Posjeduje gume", vehicle.posjedujeGume ?? ""],
    ["Emisioni standard", vehicle.emisioniStandard ?? ""],
    ["Broj prethodnih vlasnika", vehicle.brojPrethodnihVlasnika ?? ""],
    ["Veličina felgi", vehicle.velicinaFelgi ?? ""],
    ["Klimatizacija", vehicle.klimatizacija ?? ""],
    ["Muzika/ozvučenje", vehicle.muzikaOzvucenje ?? ""],
    ["Parking senzori", vehicle.parkingSenzori ?? ""],
    ["Parking kamera", vehicle.parkingKamera ?? ""],
    ["Vrsta enterijera", vehicle.vrstaEnterijera ?? ""],
    ["Rolo zavjese", vehicle.roloZavjese ?? ""],
    ["Kupi na leasing", vehicle.kupiNaLeasing ?? ""],
    ["Godina prve registracije", vehicle.godinaPrveRegistracije ?? ""],
    ["Registrovan do", vehicle.registrovanDo ?? ""],
  ];
  const dodatneInformacije = sveDodatneInformacije.filter(
    ([, vrijednost]) => vrijednost !== ""
  );

  // Sva oprema (ručno unijeta + kvačice iz admin panela) prikazuje se
  // zajedno, u jednoj urednoj, sortiranoj listi — bez razlike za posjetioca
  // odakle je koja stavka došla.
  const svaOprema = Array.from(
    new Set([...vehicle.oprema, ...(vehicle.dodatnaOprema ?? [])])
  ).sort((a, b) => a.localeCompare(b, "bs"));

  const naAkciji = Boolean(vehicle.akcija && vehicle.regularnaCijena);

  return (
    <div className="mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-20">
      <Link
        href="/vozila"
        className="text-xs uppercase tracking-wider text-muted hover:text-accent"
      >
        ← Sva vozila
      </Link>

      <div className="mt-6 grid gap-10 md:grid-cols-2">
        <div>
          <VehicleGallery
            slike={vehicle.slike}
            label={`${vehicle.marka} ${vehicle.model}`}
          />
        </div>

        <div>
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <p className="section-label">{vehicle.marka}</p>
              {naAkciji && (
                <span className="rounded-sm bg-red-500/15 px-2 py-0.5 text-xs font-semibold uppercase tracking-wider text-red-400">
                  Akcija
                </span>
              )}
            </div>
            <FavoriteButton slug={vehicle.slug} />
          </div>
          <h1 className="font-display mt-2 text-3xl">{vehicle.model}</h1>
          {naAkciji ? (
            <div className="mt-4 flex flex-wrap items-baseline gap-3">
              <PriceTag
                cijena={vehicle.regularnaCijena!}
                valuta={vehicle.valuta}
                className="text-lg text-muted line-through"
              />
              <PriceTag
                cijena={vehicle.cijena}
                valuta={vehicle.valuta}
                className="rounded-sm bg-red-500/10 px-3 py-1 text-2xl font-semibold text-red-400"
              />
            </div>
          ) : (
            <PriceTag
              cijena={vehicle.cijena}
              valuta={vehicle.valuta}
              className="mt-4 block text-2xl font-semibold text-accent"
            />
          )}

          <div className="mt-6 grid grid-cols-2 gap-4 border-y border-border py-6">
            {specs.map(([label, value]) => (
              <div key={label}>
                <p className="text-xs uppercase tracking-wider text-muted">
                  {label}
                </p>
                <p className="mt-1 text-sm text-foreground">{value}</p>
              </div>
            ))}
          </div>

          <p className="mt-6 text-sm leading-relaxed text-foreground/75">
            {vehicle.opis}
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="/probna-voznja" className="btn-primary">
              Zakaži probnu vožnju
            </Link>
            <Link href="/kontakt" className="btn-outline">
              Pošalji upit
            </Link>
          </div>
        </div>
      </div>

      {svaOprema.length > 0 && (
        <div className="mt-14 border-t border-border pt-10">
          <p className="section-label">Karakteristike</p>
          <h2 className="font-display mt-2 text-2xl">Oprema</h2>
          <ul className="mt-6 grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
            {svaOprema.map((item) => (
              <li
                key={item}
                className="flex items-start gap-2.5 text-sm text-foreground/80"
              >
                <KvacicaIkonica />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {dodatneInformacije.length > 0 && (
        <div className="mt-14 border-t border-border pt-10">
          <p className="section-label">Detalji</p>
          <h2 className="font-display mt-2 text-2xl">Dodatne informacije</h2>
          <div className="mt-6 overflow-hidden rounded-sm border border-border">
            {Array.from(
              { length: Math.ceil(dodatneInformacije.length / 2) },
              (_, red) => dodatneInformacije.slice(red * 2, red * 2 + 2)
            ).map((red, i) => (
              <div
                key={red[0][0]}
                className={`grid grid-cols-1 sm:grid-cols-2 ${
                  i > 0 ? "border-t border-border" : ""
                } ${i % 2 === 0 ? "bg-surface" : "bg-surface-2"}`}
              >
                {red.map(([label, value], kolona) => (
                  <div
                    key={label}
                    className={`flex items-center justify-between gap-4 px-5 py-3 text-sm ${
                      kolona === 1 ? "border-t border-border sm:border-t-0 sm:border-l" : ""
                    }`}
                  >
                    <span className="text-muted">{label}</span>
                    <span className="text-right font-medium text-foreground">{value}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
