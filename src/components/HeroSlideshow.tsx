"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { LogoFull } from "./Logo";
import PriceTag from "./PriceTag";

export type HeroSlajd = {
  slika: string;
  naziv: string;
  godiste: number;
  cijena: number;
  valuta: string;
  slug: string;
};

/** Koliko dugo jedno vozilo ostaje na ekranu (ms). */
const TRAJANJE = 7000;

/**
 * Početni ekran preko cijele visine: izmjenjuju se prve fotografije SVIH
 * vozila iz salonske ponude (lagano zamućene, sa sporim "Ken Burns"
 * približavanjem i mekim pretapanjem). Lista dolazi direktno iz baze, pa
 * se svako novo vozilo dodato u admin panelu automatski pojavi ovdje.
 */
export default function HeroSlideshow({ slajdovi }: { slajdovi: HeroSlajd[] }) {
  const [aktivni, setAktivni] = useState(0);
  const [krug, setKrug] = useState(0); // restartuje animaciju trake napretka
  const ukupno = slajdovi.length;

  const idiNa = useCallback(
    (i: number) => {
      if (ukupno === 0) return;
      setAktivni(((i % ukupno) + ukupno) % ukupno);
      setKrug((k) => k + 1);
    },
    [ukupno]
  );

  useEffect(() => {
    if (ukupno < 2) return;
    let tajmer: ReturnType<typeof setTimeout>;
    const zakazi = () => {
      tajmer = setTimeout(() => {
        if (document.visibilityState === "visible") idiNa(aktivni + 1);
        else zakazi();
      }, TRAJANJE);
    };
    zakazi();
    return () => clearTimeout(tajmer);
  }, [aktivni, krug, ukupno, idiNa]);

  const trenutno = slajdovi[aktivni];

  return (
    <section className="hero relative h-[100svh] min-h-[640px] w-full overflow-hidden bg-background">
      {/* Fotografije */}
      {ukupno > 0 ? (
        slajdovi.map((s, i) => (
          <div
            key={s.slug}
            className={`hero-slajd absolute inset-0 ${i === aktivni ? "is-active" : ""}`}
            aria-hidden={i !== aktivni}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={s.slika}
              alt=""
              className="h-full w-full object-cover"
              loading={i === 0 ? "eager" : "lazy"}
              fetchPriority={i === 0 ? "high" : "auto"}
            />
          </div>
        ))
      ) : (
        <div className="hero-prazno absolute inset-0" />
      )}

      {/* Zatamnjenja — tekst uvijek čitljiv, a donja ivica se stapa sa stranicom */}
      <div className="pointer-events-none absolute inset-0 bg-background/25" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-background/90 via-background/45 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-44 bg-gradient-to-b from-background/85 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-background via-background/55 to-transparent" />
      <div className="hero-vinjeta pointer-events-none absolute inset-0" />

      {/* Sadržaj */}
      <div className="relative mx-auto flex h-full max-w-7xl flex-col justify-end px-5 pb-28 md:px-8 md:pb-32">
        <div className="hero-ulaz max-w-2xl">
          <LogoFull className="h-24 w-auto text-white sm:h-32 md:h-40" />
          <span className="mt-8 block h-px w-16 bg-white/60" />
          <p className="font-display mt-6 text-3xl leading-tight text-foreground md:text-5xl">
            Vozila birana sa pažnjom.
          </p>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-foreground/70 md:text-base">
            Uvoz i prodaja novih i korištenih automobila iz Evrope — sa
            pismenom garancijom na porijeklo, kilometražu, motor i mjenjač.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="/vozila" className="btn-primary">
              Pogledaj ponudu
            </Link>
            <Link href="/probna-voznja" className="btn-outline border-white/40 backdrop-blur-sm">
              Zakaži probnu vožnju
            </Link>
          </div>
        </div>
      </div>

      {/* Donja traka: napredak + trenutno vozilo */}
      {ukupno > 0 && trenutno && (
        <div className="absolute inset-x-0 bottom-0">
          <div className="mx-auto flex max-w-7xl items-end justify-between gap-6 px-5 pb-8 md:px-8 md:pb-10">
            <div className="flex items-center gap-4">
              <span className="font-display text-sm tabular-nums text-foreground">
                {String(aktivni + 1).padStart(2, "0")}
                <span className="text-muted"> / {String(ukupno).padStart(2, "0")}</span>
              </span>
              {ukupno > 1 && (
                <div className="flex items-center gap-2">
                  {slajdovi.map((s, i) => (
                    <button
                      key={s.slug}
                      type="button"
                      onClick={() => idiNa(i)}
                      aria-label={`Prikaži ${s.naziv}`}
                      className="group py-3"
                    >
                      <span className="relative block h-[2px] w-6 overflow-hidden bg-white/20 transition-colors group-hover:bg-white/40 sm:w-10">
                        {i === aktivni && (
                          <span
                            key={krug}
                            className="hero-napredak absolute inset-y-0 left-0 bg-white"
                            style={{ animationDuration: `${TRAJANJE}ms` }}
                          />
                        )}
                        {i < aktivni && <span className="absolute inset-0 bg-white/60" />}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <Link
              key={trenutno.slug}
              href={`/vozila/${trenutno.slug}`}
              className="hero-vozilo group hidden text-right sm:block"
            >
              <p className="text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-muted">
                U ponudi · {trenutno.godiste}
              </p>
              <p className="font-display mt-1 text-xl text-foreground">{trenutno.naziv}</p>
              <p className="mt-1 flex items-center justify-end gap-3 text-sm text-foreground/80">
                <PriceTag cijena={trenutno.cijena} valuta={trenutno.valuta} />
                <span className="text-xs uppercase tracking-wider text-foreground/60 transition-colors group-hover:text-white">
                  Pogledaj →
                </span>
              </p>
            </Link>
          </div>
        </div>
      )}
    </section>
  );
}
