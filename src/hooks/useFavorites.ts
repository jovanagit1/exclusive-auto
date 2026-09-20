"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * "Sačuvana vozila" (omiljena vozila posjetilaca) — pošto sajt nema
 * korisničke naloge, čuvamo listu sačuvanih vozila (po slug-u) u
 * localStorage browsera posjetioca. Svaki posjetilac ima svoju listu, samo
 * na svom uređaju/browseru (ne sinhronizuje se između uređaja).
 *
 * Koristimo useSyncExternalStore (a ne useState+useEffect) jer je to
 * standardni React način da se prati vanjski izvor podataka (localStorage)
 * bez neusklađenosti pri hidrataciji servera/klijenta.
 */
const KLJUC = "exclusive-auto-sacuvana-vozila";
const DOGADJAJ = "exclusive-auto-sacuvana-vozila-promjena";

let keširanaLista: string[] = [];
let keširaniSirovi: string | null = null;

function procitajListu(): string[] {
  if (typeof window === "undefined") return keširanaLista;
  let sirovo: string | null;
  try {
    sirovo = window.localStorage.getItem(KLJUC);
  } catch {
    return keširanaLista;
  }
  if (sirovo === keširaniSirovi) return keširanaLista;
  keširaniSirovi = sirovo;
  try {
    const parsirano = sirovo ? JSON.parse(sirovo) : [];
    keširanaLista = Array.isArray(parsirano)
      ? parsirano.filter((s): s is string => typeof s === "string")
      : [];
  } catch {
    keširanaLista = [];
  }
  return keširanaLista;
}

function upisiListu(nova: string[]) {
  try {
    window.localStorage.setItem(KLJUC, JSON.stringify(nova));
  } catch {
    // localStorage može biti nedostupan (privatni mod, blokirano) — u tom
    // slučaju "Sačuvana vozila" jednostavno neće trajno pamtiti izbor.
  }
  // "storage" event se ne pokreće u istom tabu koji je napravio izmjenu, pa
  // koristimo i sopstveni event da se ovaj isti tab odmah osvježi.
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

function getServerSnapshot(): string[] {
  return [];
}

export function useFavorites() {
  const sacuvana = useSyncExternalStore(subscribe, procitajListu, getServerSnapshot);
  const spremno = typeof window !== "undefined";

  const jeSacuvano = useCallback((slug: string) => sacuvana.includes(slug), [sacuvana]);

  const preklopi = useCallback((slug: string) => {
    const trenutno = procitajListu();
    const novo = trenutno.includes(slug)
      ? trenutno.filter((s) => s !== slug)
      : [...trenutno, slug];
    upisiListu(novo);
  }, []);

  return { sacuvana, jeSacuvano, preklopi, spremno };
}
