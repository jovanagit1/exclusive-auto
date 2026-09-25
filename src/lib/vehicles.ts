export type KategorijaVozila = "ponuda" | "dolazak" | "posredovanje";

export function kategorijaVozila(v: Pick<Vehicle, "kategorija">): KategorijaVozila {
  return v.kategorija ?? "ponuda";
}

export type Vehicle = {
  slug: string;
  marka: string;
  model: string;
  godiste: number;
  cijena: number;
  valuta: string;
  /** Da li je vozilo trenutno na akciji (popustu). */
  akcija?: boolean;
  /** Regularna (redovna) cijena prije akcije — prikazuje se precrtano. */
  regularnaCijena?: number;
  km: number;
  gorivo: string;
  mjenjac: string;
  /** Snaga motora u konjskim snagama, npr. "194 KS" — postojeće polje. */
  snaga: string;
  /** Snaga motora u kilovatima (kW) — samo broj, npr. "143". */
  snagaKw?: string;
  /** Kubikaža motora u cm³, npr. "1998". */
  kubikaza?: string;
  /** Tip karoserije, npr. "Limuzina", "SUV/Terensko"... */
  tipKaroserije?: string;
  /** Pogon: prednji / zadnji / 4x4. */
  pogon?: string;
  /** Broj vrata. */
  brojVrata?: string;
  boja: string;
  opis: string;
  /** Broj šasije (VIN) — prikazuje se odvojeno od opisa, na posebnom mjestu. */
  brojSasije?: string;
  oprema: string[];
  istaknuto?: boolean;
  /**
   * Gdje se vozilo prikazuje na sajtu:
   *  - "ponuda" (ili prazno): salonska ponuda, stranica /vozila
   *  - "dolazak": vozila u dolasku — vide ih SAMO prijavljeni u privatni salon
   *  - "posredovanje": tuđa vozila koja se prodaju posredstvom, stranica /posredovanje
   */
  kategorija?: KategorijaVozila;
  /** URL-ovi slika (Vercel Blob) — prva slika se koristi kao naslovna. */
  slike?: string[];

  // --- Dodatne informacije (padajući meniji admin panela) ---
  tipOvjesa?: string;
  /** Masa/težina vozila u kg. */
  masa?: string;
  garancija?: string;
  svjetla?: string;
  /** Broj sjedećih mjesta. */
  brojSjedista?: string;
  zastitaBlokada?: string;
  brojStepeniPrijenosa?: string;
  posjedujeGume?: string;
  emisioniStandard?: string;
  brojPrethodnihVlasnika?: string;
  velicinaFelgi?: string;
  klimatizacija?: string;
  muzikaOzvucenje?: string;
  parkingSenzori?: string;
  parkingKamera?: string;
  vrstaEnterijera?: string;
  roloZavjese?: string;
  kupiNaLeasing?: string;
  godinaPrveRegistracije?: string;
  registrovanDo?: string;

  /** Dodatna oprema/karakteristike označene kvačicom u admin panelu. */
  dodatnaOprema?: string[];
};

// PRIMJER / PLACEHOLDER PODACI — zamijenite stvarnim vozilima iz vaše ponude.
// Svako vozilo treba i svoju fotografiju u /public/vozila/{slug}.jpg (za sada
// se prikazuje elegantni placeholder umjesto slike).
export const vehicles: Vehicle[] = [
  {
    slug: "mercedes-benz-e-220-d",
    marka: "Mercedes-Benz",
    model: "E 220 d AMG Line",
    godiste: 2021,
    cijena: 42900,
    valuta: "KM",
    km: 68000,
    gorivo: "Dizel",
    mjenjac: "Automatik",
    snaga: "194 KS",
    boja: "Crna metalik",
    opis:
      "Reprezentativna limuzina u AMG paketu, uvezena i dodatno pripremljena u našem servisu. Kompletna servisna historija, prvi vlasnik.",
    oprema: [
      "AMG Line paket",
      "Kožna sjedišta, grijanje sjedišta",
      "Full LED farovi",
      "Navigacija, Apple CarPlay / Android Auto",
      "Kamera 360°",
    ],
    istaknuto: true,
  },
  {
    slug: "bmw-x5-30d",
    marka: "BMW",
    model: "X5 xDrive30d",
    godiste: 2020,
    cijena: 54500,
    valuta: "KM",
    km: 91000,
    gorivo: "Dizel",
    mjenjac: "Automatik",
    snaga: "265 KS",
    boja: "Siva metalik",
    opis:
      "Snažan i luksuzan SUV, redovno servisiran, spreman za registraciju i preuzimanje istog dana.",
    oprema: [
      "xDrive pogon na sva četiri točka",
      "Panorama krov",
      "Head-up displej",
      "Adaptivni tempomat",
      "Elektronski zadnja sjedišta",
    ],
    istaknuto: true,
  },
  {
    slug: "audi-a6-avant-40-tdi",
    marka: "Audi",
    model: "A6 Avant 40 TDI",
    godiste: 2019,
    cijena: 38900,
    valuta: "KM",
    km: 112000,
    gorivo: "Dizel",
    mjenjac: "Automatik (S tronic)",
    snaga: "204 KS",
    boja: "Bijela",
    opis:
      "Prostrana i ekonomična limuzina karavan izvedbe, idealna za poslovne i porodične potrebe.",
    oprema: [
      "Virtual Cockpit",
      "Matrix LED farovi",
      "Parking senzori + kamera",
      "Digitalni klima uređaj",
    ],
  },
  {
    slug: "volkswagen-passat-b8",
    marka: "Volkswagen",
    model: "Passat B8 2.0 TDI",
    godiste: 2018,
    cijena: 27900,
    valuta: "KM",
    km: 145000,
    gorivo: "Dizel",
    mjenjac: "Automatik (DSG)",
    snaga: "150 KS",
    boja: "Tamno plava",
    opis:
      "Pouzdan i ekonomičan izbor, uredna servisna knjižica, dva ključa, moguća zamjena.",
    oprema: [
      "DSG mjenjač",
      "Adaptivni tempomat",
      "Grijanje sjedišta",
      "Bi-Xenon farovi",
    ],
  },
];

export function getVehicle(slug: string) {
  return vehicles.find((v) => v.slug === slug);
}

export function formatPrice(cijena: number, valuta: string) {
  return `${cijena.toLocaleString("de-DE")} ${valuta}`;
}

/**
 * Prikazuje kubikažu kao litre sa jednom decimalom (npr. "1998" cm³ → "2.0"),
 * onako kako to rade auto-saloni — a ne kao sirovi broj kubnih centimetara.
 */
export function formatKubikaza(kubikaza?: string): string {
  if (!kubikaza) return "";
  const broj = Number(kubikaza.replace(",", "."));
  if (!Number.isFinite(broj) || broj <= 0) return kubikaza;
  // Ako je neko ipak upisao vrijednost već u litrama (npr. "2.0"), ne dijelimo je ponovo.
  const uCm3 = broj > 30 ? broj : broj * 1000;
  return (uCm3 / 1000).toFixed(1);
}

/**
 * Formatira snagu motora tako da UVIJEK ispravno prikazuje jedinice (KS / kW),
 * bez obzira da li je admin upisao samo broj (npr. "200") ili cijeli tekst
 * (npr. "200 KS") — izvlači broj i sam dodaje jedinicu.
 */
export function formatSnaga(snaga?: string, snagaKw?: string): string {
  if (!snaga) return "";
  const izvuciBroj = (v: string) => {
    const m = v.match(/[\d.,]+/);
    return m ? m[0].replace(",", ".") : v.trim();
  };
  const ks = izvuciBroj(snaga);
  const kw = snagaKw ? izvuciBroj(snagaKw) : "";
  return kw ? `${ks} KS (${kw} kW)` : `${ks} KS`;
}

/**
 * Standardni opis koji se automatski upisuje pri dodavanju NOVOG vozila u
 * admin panelu (80% vozila ima isti opis) — admin ga slobodno mijenja.
 */
export const STANDARDNI_OPIS =
  "Cijena do registracije. Uvoz iz Francuske — vozilo kao novo, bez tragova korištenja. " +
  "Uredno održavano i servisirano u ovlaštenom servisu, sa servisnom istorijom održavanja. " +
  "Izvanredno stanje, bez oštećenja, kao što se vidi na slikama. Dozvoljene sve provjere.";

const VIN_REGEX = /(?:broj\s*(?:š|s)asije|vin)\s*[:.\-]?\s*([A-HJ-NPR-Z0-9]{11,17})\b/i;

/**
 * Starija vozila imaju broj šasije upisan unutar opisa ("... BROJ ŠASIJE:
 * TMAJD81AGMJ017934"). Ova funkcija ga izvlači iz teksta, da bi se na
 * sajtu prikazao na svom posebnom mjestu, a opis ostao čist.
 */
export function razdvojiBrojSasije(vehicle: Pick<Vehicle, "opis" | "brojSasije">): {
  opis: string;
  brojSasije: string;
} {
  const opis = vehicle.opis ?? "";
  if (vehicle.brojSasije) {
    return { opis: opis.replace(VIN_REGEX, "").trim(), brojSasije: vehicle.brojSasije };
  }
  const m = opis.match(VIN_REGEX);
  if (!m) return { opis, brojSasije: "" };
  return {
    opis: opis.replace(m[0], "").replace(/[\s,;:.\-]+$/, "").trim(),
    brojSasije: m[1].toUpperCase(),
  };
}
