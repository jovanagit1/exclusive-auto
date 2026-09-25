import type { Metadata } from "next";
import Link from "next/link";
import PlaceholderImage from "@/components/PlaceholderImage";

export const metadata: Metadata = {
  title: "O nama",
  description:
    "Exclusive Auto Banja Luka — više od deset godina u svijetu automobila. Uvoz i prodaja kvalitetnih i novih automobila iz Evrope, lizing i kredit.",
};

const brojke = [
  { vrijednost: "10+", opis: "godina iskustva" },
  { vrijednost: "5000+", opis: "zadovoljnih kupaca" },
  { vrijednost: "100%", opis: "provjereno" },
];

const usluge = [
  "Prodaja",
  "Uvoz po narudžbi",
  "Registracija",
  "Servis",
  "Detailing",
  "Stakla",
  "Šteta od grada",
  "Lizing i kredit",
];

export default function ONamaPage() {
  return (
    <div>
      <section className="border-b border-border">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-20 md:grid-cols-2 md:px-8 md:py-28">
          <div>
            <p className="section-label">O nama</p>
            <h1 className="font-display mt-3 text-4xl leading-tight">
              Više od deset godina u svijetu automobila
            </h1>
            <p className="mt-6 text-foreground/75">
              Exclusive Auto je firma iz Banje Luke posvećena uvozu i prodaji
              kvalitetnih i novih automobila iz Evrope.
            </p>
            <p className="mt-4 text-foreground/75">
              Cilj Exclusive Auta je jednostavan — svakom klijentu omogućiti da
              kupi vozilo u koje može imati povjerenja, bez iznenađenja i
              skrivenih troškova.
            </p>
            <p className="mt-4 text-foreground/75">
              Svako vozilo prije predaje prolazi servis, detailing i kompletnu
              pripremu.
            </p>
          </div>
          <PlaceholderImage label="Exclusive Auto" ratio="aspect-[4/3]" />
        </div>
      </section>

      <section className="border-y border-accent/40 bg-surface">
        <div className="mx-auto grid max-w-7xl grid-cols-1 divide-y divide-border px-5 sm:grid-cols-3 sm:divide-x sm:divide-y-0 md:px-8">
          {brojke.map((b) => (
            <div key={b.opis} className="flex flex-col items-center py-12 text-center md:py-16">
              <span className="mb-5 h-px w-10 bg-accent" />
              <p className="font-display text-5xl text-foreground md:text-6xl">{b.vrijednost}</p>
              <p className="mt-3 text-xs font-semibold uppercase tracking-[0.3em] text-muted">
                {b.opis}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-7xl px-5 py-20 md:px-8">
          <p className="section-label">Exclusive Auto</p>
          <h2 className="font-display mt-2 text-3xl">Sve na jednom mjestu</h2>
          <p className="mt-5 max-w-3xl leading-relaxed text-foreground/75">
            Prodaja, ali i uvoz po narudžbi, registracija, servis, detailing,
            stakla, šteta od grada — tim provjerenih ljudi koji radi sa istim
            ciljem.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            {usluge.map((u) => (
              <span
                key={u}
                className="rounded-full border border-border px-4 py-2 text-xs uppercase tracking-wider text-foreground/80"
              >
                {u}
              </span>
            ))}
          </div>

          <p className="font-display mt-12 text-2xl text-foreground">
            Naša najbolja reklama su naši zadovoljni kupci.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="/vozila" className="btn-primary">
              Pogledaj ponudu
            </Link>
            <Link href="/kontakt" className="btn-outline">
              Kontaktirajte nas
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
