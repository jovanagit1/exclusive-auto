import type { MetadataRoute } from "next";
import { getVehicles } from "@/lib/store";
import { kategorijaVozila } from "@/lib/vehicles";
import { SITE_URL } from "@/lib/structured-data";

// Bez ovoga, Next.js pokušava da mapu sajta učita "statično" (jednom, pri
// build-u) i onda internо baca grešku čim primijeti da getVehicles() čita
// svježe podatke iz Vercel Blob-a (isto kao kod ostalih stranica koje
// prikazuju vozila — vidi npr. src/app/vozila/page.tsx). Ta greška se
// pojavljivala u Vercel logovima kao "Dynamic server usage" i uzrokovala da
// mapa sajta u međuvremenu koristi zastarjele/polazne podatke.
export const dynamic = "force-dynamic";

// Statične stranice koje treba da Google indeksira. "Sačuvana vozila" (lična
// lista posjetioca u localStorage-u) i admin panel su namjerno izostavljeni
// — nemaju smisla u pretrazi.
const STATICNE_STRANICE = [
  { path: "", priority: 1, ucestalost: "daily" as const },
  { path: "/vozila", priority: 0.9, ucestalost: "daily" as const },
  { path: "/cjenovnik", priority: 0.7, ucestalost: "weekly" as const },
  { path: "/usluge", priority: 0.7, ucestalost: "monthly" as const },
  { path: "/uvoz", priority: 0.6, ucestalost: "monthly" as const },
  { path: "/posredovanje", priority: 0.6, ucestalost: "weekly" as const },
  { path: "/prodaj-vozilo", priority: 0.7, ucestalost: "monthly" as const },
  { path: "/registracija", priority: 0.5, ucestalost: "monthly" as const },
  { path: "/probna-voznja", priority: 0.5, ucestalost: "monthly" as const },
  { path: "/galerija", priority: 0.5, ucestalost: "monthly" as const },
  { path: "/o-nama", priority: 0.5, ucestalost: "monthly" as const },
  { path: "/kontakt", priority: 0.6, ucestalost: "monthly" as const },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const vehicles = (await getVehicles()).filter((v) => kategorijaVozila(v) !== "dolazak");
  const sada = new Date();

  return [
    ...STATICNE_STRANICE.map((s) => ({
      url: `${SITE_URL}${s.path}`,
      lastModified: sada,
      changeFrequency: s.ucestalost,
      priority: s.priority,
    })),
    ...vehicles.map((v) => ({
      url: `${SITE_URL}/vozila/${v.slug}`,
      lastModified: sada,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
