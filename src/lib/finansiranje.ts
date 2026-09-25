/**
 * Uslovi za informativni izračun rate kredita (Addiko Bank — namjenski
 * kredit za vozila). Kamatna stopa je izračunata iz Addiko kalkulatora
 * (50.000 KM / 120 mj. = 559,89 KM). Ako banka promijeni uslove, dovoljno
 * je ovdje izmijeniti brojeve.
 */
export const KREDIT = {
  banka: "Addiko Bank",
  godisnjaKamata: 6.19, // nominalna, u %
  minIznos: 300,
  maxIznos: 50000,
  minRok: 12,
  maxRok: 120,
};

/**
 * Lizing (Addiko): starost vozila + rok otplate ne smije preći 12 godina,
 * minimalno učešće 10%, vozilo je u vlasništvu banke do otplate. Kamatu za
 * lizing banka nije navela, pa se za informativni izračun koristi ista
 * stopa kao za kredit — promijenite "godisnjaKamata" kad dobijete tačnu.
 */
export const LIZING = {
  godisnjaKamata: 6.19,
  minUcesceProcenat: 10,
  maxUcesceProcenat: 60,
  maxStarostPlusRokGodina: 12,
  minRok: 12,
  maxRok: 120,
};

/** Najduži mogući rok lizinga (u mjesecima) za vozilo datog godišta. */
export function maxRokLizinga(godiste: number, danas = new Date()): number {
  const starost = Math.max(0, danas.getFullYear() - godiste);
  const preostaloGodina = LIZING.maxStarostPlusRokGodina - starost;
  return Math.min(LIZING.maxRok, Math.max(0, preostaloGodina * 12));
}

/** Mjesečna rata (anuitet) za iznos, godišnju kamatu u % i broj mjeseci. */
export function mjesecnaRata(iznos: number, godisnjaKamata: number, mjeseci: number): number {
  if (iznos <= 0 || mjeseci <= 0) return 0;
  const r = godisnjaKamata / 100 / 12;
  if (r === 0) return iznos / mjeseci;
  return (iznos * r) / (1 - Math.pow(1 + r, -mjeseci));
}
