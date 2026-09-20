"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * Konvertibilna marka (KM/BAM) je fiksno vezana za euro fiksnim kursom
 * valutnog odbora (currency board) Centralne banke BiH — 1 EUR = 1,95583 KM.
 * Ovaj kurs je na snazi od 1997. i ne mijenja se sa tržišnim kretanjima (za
 * razliku od običnih deviznih kurseva), pa ga je bezbjedno koristiti kao
 * fiksnu konstantu u kodu.
 *
 * VAŽNA NAPOMENA (nije pravni savjet): zvanična, obavezujuća cijena vozila
 * na sajtu i dalje treba biti u KM — to je i dalje osnovna/zakonska valuta u
 * BiH. Ovaj prikaz u EUR je ISKLJUČIVO informativan (za posjetioce iz
 * eurozone da lakše procijene cijenu) i jasno je označen kao takav — ne
 * mijenja stvarnu cijenu niti zamjenjuje KM iznos na računima/ugovorima.
 */
export const EUR_U_KM = 1.95583;

export type PrikazValute = "KM" | "EUR";

const KLJUC = "exclusive-auto-prikaz-valute";
const DOGADJAJ = "exclusive-auto-prikaz-valute-promjena";

function procitajPrikaz(): PrikazValute {
  if (typeof window === "undefined") return "KM";
  try {
    const sirovo = window.localStorage.getItem(KLJUC);
    return sirovo === "EUR" ? "EUR" : "KM";
  } catch {
    return "KM";
  }
}

function upisiPrikaz(nova: PrikazValute) {
  try {
    window.localStorage.setItem(KLJUC, nova);
  } catch {
    // localStorage nedostupan — izbor se neće trajno pamtiti, nije kritično.
  }
  window.dispatchEvent(new Event(DOGADJAJ));
}

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(DOGADJAJ, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(DOGADJAJ, callback);
  };
}

function getServerSnapshot(): PrikazValute {
  return "KM";
}

/**
 * Pretvara iznos IZ valute u kojoj je unesen u vozilu (KM ili EUR) U traženu
 * prikaznu valutu, po fiksnom kursu iznad. Ako su valute iste, vraća
 * originalan iznos bez zaokruživanja.
 */
export function konvertujCijenu(
  iznos: number,
  izValute: string,
  uValutu: PrikazValute
): number {
  const iz = izValute === "EUR" ? "EUR" : "KM";
  if (iz === uValutu) return iznos;
  if (iz === "KM" && uValutu === "EUR") return iznos / EUR_U_KM;
  if (iz === "EUR" && uValutu === "KM") return iznos * EUR_U_KM;
  return iznos;
}

/**
 * Svaka komponenta koja pozove ovaj hook automatski prati ISTI globalni
 * izbor (localStorage + custom event iznad) — nije potreban poseban
 * React Context provider da bi se izbor dijelio kroz cijelu stranicu.
 */
export function useDisplayCurrency() {
  const prikaz = useSyncExternalStore(subscribe, procitajPrikaz, getServerSnapshot);
  const postaviPrikaz = useCallback((nova: PrikazValute) => upisiPrikaz(nova), []);
  return { prikaz, postaviPrikaz };
}
