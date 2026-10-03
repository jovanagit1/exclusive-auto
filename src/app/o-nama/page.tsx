import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "O nama — auto salon sa bonitetnom ocjenom A+",
  description:
    "Exclusive Auto Banja Luka — bonitetna ocjena A+, pismene garancije na porijeklo i kilometražu. Uvoz i prodaja novih i korištenih automobila iz Evrope.",
  alternates: { canonical: "/o-nama" },
};

const brojke = [
  { vrijednost: "10+", opis: "godina iskustva" },
  { vrijednost: "5000+", opis: "zadovoljnih kupaca" },
  { vrijednost: "100%", opis: "provjereno" },
];

const usluge = [
  "Prodaja",
  "Uvoz ključ u ruke",
  "Dostava na kućnu adresu",
  "Registracija i prepis",
  "Servis",
  "Detailing",
  "Stakla",
  "Šteta od grada",
  "Lizing i kredit",
];

export default function ONamaPage() {
  return (
    <div>
      <h1 className="sr-only">O nama — Exclusive Auto Banja Luka</h1>

      <section className="mx-auto max-w-7xl px-5 pt-16 md:px-8 md:pt-20">
        <p className="section-label">O nama</p>
        <div className="mt-6 grid grid-cols-1 border-y border-border sm:grid-cols-3">
          {brojke.map((b, i) => (
            <div
              key={b.opis}
              className={`px-6 py-12 text-center md:py-14 ${i > 0 ? "border-t border-border sm:border-l sm:border-t-0" : ""}`}
            >
              <p className="font-display text-5xl text-foreground md:text-6xl">{b.vrijednost}</p>
              <p className="mt-3 text-[0.7rem] uppercase tracking-[0.3em] text-muted">{b.opis}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-20">
        <div className="max-w-3xl space-y-5 text-lg leading-relaxed text-foreground/80">
          <p>
            Exclusive Auto ima visoku reputaciju na domaćem tržištu i{" "}
            <b className="text-foreground">zvaničnu bonitetnu ocjenu A+</b>, što salon
            pozicionira kao visoko pouzdanog partnera za uvoz i prodaju novih i
            korištenih automobila iz Evrope.
          </p>
          <p>
            Za automobile se izdaju pismene garancije koje Exclusive Auto daje na
            porijeklo vozila i tačnost pređenih kilometara.
          </p>
          <p>
            Proces od odabira vozila do odobrenja lizinga i preuzimanja vozila je
            maksimalno pojednostavljen, a{" "}
            <b className="text-foreground">
              salon nudi kompletnu uslugu registracije i prepisa vozila
            </b>
            .
          </p>
        </div>
      </section>

      <section className="border-t border-border">
        <div className="mx-auto max-w-7xl px-5 py-20 md:px-8">
          <p className="section-label">Exclusive Auto</p>
          <h2 className="font-display mt-2 text-3xl">Sve na jednom mjestu</h2>
          <div className="mt-5 max-w-3xl space-y-4 leading-relaxed text-foreground/75">
            <p>
              Prodaja, ali i uvoz po narudžbi, registracija, servis, detailing,
              stakla, šteta od grada — tim provjerenih ljudi koji radi sa istim
              ciljem.
            </p>
            <p>
              <b className="text-foreground">Ključ u ruke</b> uvoz automobila po
              tačnoj želji i narudžbi kupca iz Njemačke, Austrije, Francuske,
              Italije i Švajcarske, uz mogućnost dostave vozila na kućnu adresu.
            </p>
          </div>

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
            <Link href="/uvoz" className="btn-outline">
              Uvoz po narudžbi
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
