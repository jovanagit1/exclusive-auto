export type Vehicle = {
  slug: string;
  marka: string;
  model: string;
  godiste: number;
  cijena: number;
  valuta: string;
  km: number;
  gorivo: string;
  mjenjac: string;
  snaga: string;
  boja: string;
  opis: string;
  oprema: string[];
  istaknuto?: boolean;
  /** URL-ovi slika (Vercel Blob) — prva slika se koristi kao naslovna. */
  slike?: string[];
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
