"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { LogoTekst } from "./Logo";
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
 * Početni video (Kling spot). Dok postoji, ide preko cijelog ekrana umjesto
 * fotografija, a dole desno se i dalje smjenjuju vozila iz ponude (naziv,
 * cijena, link). Za novi spot: zamijenite fajlove u public/video.
 * Postavite na null da se vrati slajd šou fotografija.
 */
const VIDEO: { mp4: string; mp4Mobilni: string; poster: string } | null = {
  mp4: "/video/hero-1080.mp4",
  mp4Mobilni: "/video/hero-720.mp4",
  poster: "/video/hero-poster.jpg",
};

/**
 * Početni ekran preko cijele visine: izmjenjuju se prve fotografije SVIH
 * vozila iz salonske ponude (lagano zamućene, sa sporim "Ken Burns"
 * približavanjem i mekim pretapanjem). Lista dolazi direktno iz baze, pa
 * se svako novo vozilo dodato u admin panelu automatski pojavi ovdje.
 */
export default function HeroSlideshow({ slajdovi }: { slajdovi: HeroSlajd[] }) {
  const [aktivni, setAktivni] = useState(0);
  const ukupno = slajdovi.length;

  // Svaki put počinje od drugog vozila: nasumičan izbor, ali nikad isto
  // vozilo kojim je počela prethodna posjeta (pamti se u pregledaču).
  // Izbor se desi dok je još uvijek preko ekrana splash sa logom.
  useEffect(() => {
    if (ukupno < 2) return;
    let prosli = "";
    try {
      prosli = localStorage.getItem("ea_hero_start") ?? "";
    } catch {}
    const kandidati = slajdovi.map((_, i) => i).filter((i) => slajdovi[i].slug !== prosli);
    const izbor = kandidati[Math.floor(Math.random() * kandidati.length)] ?? 0;
    try {
      localStorage.setItem("ea_hero_start", slajdovi[izbor].slug);
    } catch {}
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setAktivni(izbor);
    // Samo pri prvom prikazu stranice.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (ukupno < 2) return;
    let tajmer: ReturnType<typeof setTimeout>;
    const zakazi = () => {
      tajmer = setTimeout(() => {
        if (document.visibilityState === "visible") setAktivni((a) => (a + 1) % ukupno);
        else zakazi();
      }, TRAJANJE);
    };
    zakazi();
    return () => clearTimeout(tajmer);
  }, [aktivni, ukupno]);

  // Telefon dobija lakšu (720p) verziju videa, kompjuter Full HD.
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  useEffect(() => {
    if (!VIDEO) return;
    const mobilni = window.matchMedia("(max-width: 767px)").matches;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setVideoSrc(mobilni ? VIDEO.mp4Mobilni : VIDEO.mp4);
  }, []);

  const trenutno = slajdovi[aktivni];

  return (
    <section className="hero tamno relative h-[calc(100svh-4rem)] min-h-[560px] w-full overflow-hidden bg-background md:h-[calc(100svh-5rem)]">
      {VIDEO ? (
        /* Video: nijem, u petlji, bez kontrola; telefon dobija lakšu verziju */
        <video
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster={VIDEO.poster}
          src={videoSrc ?? undefined}
          aria-hidden="true"
        />
      ) : ukupno > 0 ? (
        /* Fotografije vozila (kad nema videa) */
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
      <div className={`pointer-events-none absolute inset-0 ${VIDEO ? "bg-background/10" : "bg-background/25"}`} />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-background/80 via-background/20 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-background/90 via-background/40 to-transparent" />
      <div className="hero-vinjeta pointer-events-none absolute inset-0" />

      {/* Sadržaj: dole lijevo natpis firme, opis i dugmad; dole desno vozilo sa slike */}
      <div className="relative mx-auto flex h-full max-w-7xl items-end justify-between gap-8 px-5 pb-14 md:px-8 md:pb-20">
        <div className="hero-ulaz max-w-xl">
          <h1>
            <span className="sr-only">
              Exclusive Auto — prodaja novih i polovnih automobila, Banja Luka
            </span>
            <LogoTekst className="h-12 w-auto text-white sm:h-16 md:h-[4.6rem]" />
          </h1>
          <span className="mt-6 block h-px w-16 bg-white/60" />
          <p className="mt-5 max-w-md text-sm leading-relaxed text-white/75 md:text-base">
            Uvoz i prodaja novih i korištenih automobila iz Evrope — uz
            pismenu garanciju na porijeklo i kilometražu.
          </p>
          <div className="mt-8 flex flex-wrap gap-3 md:gap-4">
            <Link href="/vozila" className="btn-primary">
              Pogledaj ponudu
            </Link>
            <Link href="/probna-voznja" className="btn-outline border-white/50">
              Zakaži probnu vožnju
            </Link>
          </div>
        </div>

        {ukupno > 0 && trenutno && (
          <Link
            key={trenutno.slug}
            href={`/vozila/${trenutno.slug}`}
            className="hero-vozilo group hidden shrink-0 pb-1 text-right sm:block"
          >
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-muted">
              U ponudi · {trenutno.godiste}
            </p>
            <p className="font-naziv-vozila mt-1 text-xl text-foreground">{trenutno.naziv}</p>
            <p className="mt-1 flex items-center justify-end gap-3 text-sm text-foreground/80">
              <PriceTag cijena={trenutno.cijena} valuta={trenutno.valuta} />
              <span className="text-xs uppercase tracking-wider text-foreground/60 transition-colors group-hover:text-white">
                Pogledaj →
              </span>
            </p>
          </Link>
        )}
      </div>
    </section>
  );
}
