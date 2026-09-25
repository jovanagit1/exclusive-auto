/**
 * Katalog opreme za admin panel (kvačice umjesto ručnog kucanja).
 *
 *  - OPREMA_KATEGORIJE: opšta oprema koju može imati bilo koje vozilo,
 *    grupisana po kategorijama (isti redoslijed se koristi i na sajtu).
 *  - OPREMA_PO_MARKI: specifični paketi i oprema za marke koje Exclusive
 *    Auto najčešće prodaje. Prikazuje se u admin panelu kad se izabere ta
 *    marka.
 *
 * VAŽNO: nazivi stavki se čuvaju doslovno uz vozilo — ako se neki naziv
 * ovdje promijeni, stara vozila zadržavaju stari naziv (prikazaće se pod
 * "Ostala oprema"). Stavke iz ranije verzije admin panela su zadržane
 * pod istim nazivima.
 */

export type KategorijaOpreme = { naziv: string; stavke: string[] };

export const OPREMA_KATEGORIJE: KategorijaOpreme[] = [
  {
    naziv: "Status vozila",
    stavke: [
      "Servisna knjiga", "Registrovan", "Ocarinjen", "Strane tablice", "Na lizingu",
      "Dva ključa", "Garažiran", "Nepušačko vozilo", "Udaren",
      "Prilagođen invalidima", "Oldtimer",
    ],
  },
  {
    naziv: "Sigurnost i asistencija",
    stavke: [
      "ABS", "ESP", "Prednji airbagovi", "Bočni airbagovi", "Zavjesa airbagovi",
      "Airbag za koljena", "Isofix", "Tempomat", "Adaptivni tempomat",
      "Senzor mrtvog ugla", "Asistent za zadržavanje trake",
      "Upozorenje na napuštanje trake", "Prepoznavanje saobraćajnih znakova",
      "Automatsko kočenje u nuždi", "Upozorenje na umor vozača",
      "Upozorenje na saobraćaj pozadi (RCTA)", "Hill assist", "Hill descent control",
      "Park assist", "Alarm", "Noćna vizija",
    ],
  },
  {
    naziv: "Komfor",
    stavke: [
      "Digitalna klima", "El. podizači stakala", "Električni retrovizori",
      "El. preklopivi retrovizori", "Grijani retrovizori",
      "Autom. zatamnjivi retrovizor", "El. pomjeranje sjedišta", "Memorija sjedišta",
      "Grijanje sjedišta", "Grijanje zadnjih sjedišta", "Hlađenje sjedišta",
      "Masaža sjedišta", "Sportska sjedišta", "Grijani volan", "Kožni volan",
      "Komande na volanu", "Naslon za ruku", "Keyless ulaz i paljenje",
      "Start-Stop sistem", "El. otvaranje prtljažnika", "Otvaranje prtljažnika nogom",
      "Soft-close vrata", "Senzor kiše", "Senzor auto. svjetla",
      "Ambijentalno osvjetljenje", "Nezavisno grijanje (Webasto)",
      "Električna ručna kočnica", "Auto hold", "Ručice za mjenjač iza volana",
      "Izbor režima vožnje",
    ],
  },
  {
    naziv: "Multimedija",
    stavke: [
      "Navigacija", "Touch screen (ekran)", "Digitalna instrument tabla",
      "Head up display", "Bluetooth", "USB port", "Car play", "Android Auto",
      "Bežično punjenje telefona", "Glasovne komande", "DAB radio", "Wi-Fi hotspot",
    ],
  },
  {
    naziv: "Eksterijer",
    stavke: [
      "Metalik", "Alu felge", "Panorama krov", "Šiber", "Maglenke",
      "LED dnevna svjetla", "Auto kuka", "Krovni nosači", "Fabrički zatamnjena stakla",
      "Rezervni točak",
    ],
  },
];

/** Specifična oprema/paketi po marki (ključ je normalizovan naziv marke). */
export const OPREMA_PO_MARKI: Record<string, { naziv: string; stavke: string[] }> = {
  hyundai: {
    naziv: "Hyundai",
    stavke: [
      "N Line paket", "Hyundai SmartSense paket", "Krell ozvučenje", "Bose ozvučenje",
      "Bluelink (povezane usluge)", "Surround View Monitor (360° kamera)",
      "Blind-Spot View Monitor", "Smart Cruise Control sa Stop&Go",
      "Highway Driving Assist", "Lane Following Assist", "Remote Smart Parking Assist",
      "Hyundai Digital Key", "HTRAC pogon 4x4", "Električni prtljažnik Smart Tailgate",
    ],
  },
  peugeot: {
    naziv: "Peugeot",
    stavke: [
      "Peugeot i-Cockpit", "i-Cockpit 3D", "GT paket", "GT Line paket", "Allure paket",
      "Focal ozvučenje", "Peugeot Connect navigacija (3D)", "Drive Assist paket",
      "Night Vision", "Grip Control", "Visiopark 180° kamera", "Visiopark 360° kamera",
      "Full Park Assist", "Keyless Access & Start", "Hands-free prtljažnik",
      "Masažna sjedišta AGR", "Full LED farovi",
    ],
  },
  citroen: {
    naziv: "Citroën",
    stavke: [
      "Advanced Comfort sjedišta", "Progressive Hydraulic Cushions ovjes",
      "Shine paket", "Feel paket", "Grip Control", "Highway Driver Assist",
      "Citroën Connect Nav", "Head-up display (Citroën)", "ConnectedCAM Citroën",
      "Top Rear Vision kamera", "Airbump zaštita", "Hands-free prtljažnik",
      "Keyless Access & Start", "Panoramski krov (Citroën)",
    ],
  },
  bmw: {
    naziv: "BMW",
    stavke: [
      "M Sport paket", "M Sport Pro paket", "Luxury Line", "Sport Line", "xDrive pogon",
      "Adaptive M ovjes", "Integral Active Steering", "M sportske kočnice",
      "Harman Kardon ozvučenje", "Bowers & Wilkins ozvučenje",
      "BMW Live Cockpit Professional", "BMW Curved Display", "iDrive kontroler",
      "BMW Head-Up Display", "Driving Assistant", "Driving Assistant Professional",
      "Parking Assistant Plus", "Adaptive LED farovi", "BMW Laserlight",
      "Comfort Access", "Soft Close vrata", "Gesture Control",
      "Panoramski krov Sky Lounge", "BMW Display Key", "Ambijentalno svjetlo (BMW)",
      "Aktivna ventilacija sjedišta",
    ],
  },
  mercedes: {
    naziv: "Mercedes-Benz",
    stavke: [
      "AMG Line", "AMG Line Plus", "Night paket", "Avantgarde linija",
      "Exclusive linija", "4MATIC pogon", "MBUX multimedija",
      "MBUX Augmented Reality navigacija", "Widescreen Cockpit", "Burmester ozvučenje",
      "Burmester 3D ozvučenje", "Mercedes Head-Up Display", "Distronic (adaptivni tempomat)",
      "Driving Assistance paket", "Airmatic pneumatski ovjes",
      "Dynamic Body Control", "Multibeam LED farovi", "Digital Light farovi",
      "Keyless-Go paket", "Energizing Comfort", "Ambijentalno svjetlo (64 boje)",
      "Parking paket sa kamerom 360°", "Memory paket", "Easy-Pack prtljažnik",
      "Thermotronic klima",
    ],
  },
  audi: {
    naziv: "Audi",
    stavke: [
      "S line paket (spolja)", "S line paket (unutra)", "quattro pogon",
      "Audi virtual cockpit", "Audi virtual cockpit plus", "MMI Navigation plus",
      "MMI touch response", "Matrix LED farovi", "HD Matrix LED farovi",
      "Bang & Olufsen ozvučenje", "Bang & Olufsen 3D Premium", "Bose ozvučenje (Audi)",
      "Adaptive air suspension (zračni ovjes)", "Audi drive select",
      "Audi pre sense", "Adaptive cruise assist", "Audi Head-Up Display",
      "Audi phone box (bežično punjenje)", "Comfort key", "Ambient lighting paket",
      "Black optic paket", "Sportski diferencijal", "Park assist plus",
    ],
  },
  volkswagen: {
    naziv: "Volkswagen",
    stavke: [
      "R-Line paket", "Highline oprema", "Comfortline oprema", "Style oprema",
      "Elegance oprema", "4MOTION pogon", "Digital Cockpit (Active Info Display)",
      "Discover Pro navigacija", "Dynaudio ozvučenje", "Harman Kardon ozvučenje (VW)",
      "IQ.LIGHT LED Matrix farovi", "DCC adaptivni ovjes", "Travel Assist",
      "Area View 360° kamera", "Park Assist (VW)", "Keyless Access",
      "Easy Open & Close prtljažnik", "App-Connect", "VW Head-Up Display",
      "ErgoActive sjedišta",
    ],
  },
  skoda: {
    naziv: "Škoda",
    stavke: [
      "Laurin & Klement (L&K)", "Style oprema", "Ambition oprema", "Sportline paket",
      "RS paket", "4x4 pogon", "Virtual Cockpit (Škoda)", "Columbus navigacija",
      "Amundsen navigacija", "Canton ozvučenje", "Matrix LED farovi (Škoda)",
      "DCC adaptivni ovjes (Škoda)", "Travel Assist (Škoda)", "Area View 360° kamera (Škoda)",
      "Park Assist (Škoda)", "KESSY keyless", "Virtualna pedala (prtljažnik)",
      "Simply Clever paket", "Ergo sjedišta (Škoda)",
    ],
  },
  "alfa romeo": {
    naziv: "Alfa Romeo",
    stavke: [
      "Veloce paket", "Ti paket", "Sprint paket", "Q4 pogon", "Alfa DNA selektor",
      "Alfa Active Suspension", "Harman Kardon ozvučenje (Alfa)",
      "Alfa Connect navigacija", "Aluminijske ručice iza volana",
      "Sparco sportska sjedišta", "Brembo kočnice", "Performance paket",
      "Driver Assistance Plus", "Adaptivni tempomat sa Stop&Go (Alfa)",
      "Adaptivni bi-xenon farovi", "Matrix LED farovi (Alfa)",
    ],
  },
  kia: {
    naziv: "Kia",
    stavke: [
      "GT-Line paket", "GT paket", "Spirit oprema", "AWD pogon",
      "Harman Kardon ozvučenje (Kia)", "JBL ozvučenje", "Kia Connect (UVO)",
      "Surround View Monitor (Kia)", "Blind-Spot View Monitor (Kia)",
      "Smart Cruise Control (Kia)", "Highway Driving Assist (Kia)",
      "Remote Smart Parking Assist (Kia)", "Kia Digital Key",
      "Head-up display (Kia)", "Pametni električni prtljažnik",
    ],
  },
  volvo: {
    naziv: "Volvo",
    stavke: [
      "Inscription oprema", "R-Design paket", "Momentum oprema", "Ultimate oprema",
      "Plus oprema", "Core oprema", "AWD pogon (Volvo)", "Bowers & Wilkins ozvučenje (Volvo)",
      "Harman Kardon ozvučenje (Volvo)", "Pilot Assist", "IntelliSafe paket",
      "City Safety", "Sensus navigacija", "Google Built-in (Android Automotive)",
      "360° kamera (Volvo)", "Four-C aktivni ovjes", "Zračni ovjes (Volvo)",
      "Orrefors kristalna ručica mjenjača", "Head-up display (Volvo)",
      "Park Assist Pilot", "Keyless Drive (Volvo)", "Ventilirana sjedišta (Volvo)",
    ],
  },
  dacia: {
    naziv: "Dacia",
    stavke: [
      "Prestige oprema", "Comfort oprema", "Expression oprema", "Extreme oprema",
      "Journey oprema", "4x4 pogon (Dacia)", "Media Nav", "Media Display",
      "Multiview kamera", "Keycard / Keyless (Dacia)", "Hill Descent Control (Dacia)",
      "Blind Spot Warning (Dacia)", "Extended Grip", "Modularni krovni nosači",
      "Sleep Pack",
    ],
  },
};

/** Pretvara upisanu marku ("Mercedes-Benz", "Citroën", "ŠKODA") u ključ kataloga. */
export function kljucMarkeOpreme(marka: string): string | null {
  const k = marka
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/-/g, " ");
  if (k.startsWith("mercedes")) return "mercedes";
  if (k === "vw") return "volkswagen";
  return k in OPREMA_PO_MARKI ? k : null;
}

/**
 * Grupiše opremu vozila za prikaz na sajtu: po kategorijama, pa specifična
 * oprema marke, pa "Ostala oprema" (ručno upisane stavke i stari nazivi).
 */
export function grupisiOpremu(
  stavke: string[],
  marka: string
): { naziv: string; stavke: string[] }[] {
  const preostale = new Set(stavke.map((s) => s.trim()).filter(Boolean));
  const grupe: { naziv: string; stavke: string[] }[] = [];

  const kljuc = kljucMarkeOpreme(marka);
  const izvori: KategorijaOpreme[] = [
    ...(kljuc ? [{ naziv: `Paketi i oprema — ${OPREMA_PO_MARKI[kljuc].naziv}`, stavke: OPREMA_PO_MARKI[kljuc].stavke }] : []),
    ...OPREMA_KATEGORIJE.filter((k) => k.naziv !== "Status vozila"),
    ...OPREMA_KATEGORIJE.filter((k) => k.naziv === "Status vozila"),
  ];

  for (const izvor of izvori) {
    const nadjene = izvor.stavke.filter((s) => preostale.has(s));
    nadjene.forEach((s) => preostale.delete(s));
    if (nadjene.length) grupe.push({ naziv: izvor.naziv, stavke: nadjene });
  }
  // Specifične stavke drugih marki (npr. marka promijenjena) + ručni unos
  if (preostale.size) {
    grupe.push({
      naziv: "Ostala oprema",
      stavke: [...preostale].sort((a, b) => a.localeCompare(b, "bs")),
    });
  }
  return grupe;
}
