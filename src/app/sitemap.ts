import type { MetadataRoute } from "next";
import { getVehicles } from "@/lib/store";
import { SITE_URL } from "@/lib/structured-data";

// Statične stranice koje treba da Google indeksira. "Sačuvana vozila" (lična
// lista posjetioca u localStorage-u) i admin panel su namjerno izostavljeni
// — nemaju smisla u pretrazi.
const STATICNE_STRANICE = [
  { path: "", priority: 1, ucestalost: "daily" as const },
  { path: "/vozila", priority: 0.9, ucestalost: "daily" as const },
  { path: "/cjenovnik", priority: 0.7, ucestalost: "weekly" as const },
  { path: "/usluge", priority: 0.7, ucestalost: "monthly" as const },
  { path: "/uvoz", priority: 0.6, ucestalost: "monthly" as const },
  { path: "/prodaj-vozilo", priority: 0.7, ucestalost: "monthly" as const },
  { path: "/registracija", priority: 0.5, ucestalost: "monthly" as const },
  { path: "/probna-voznja", priority: 0.5, ucestalost: "monthly" as const },
  { path: "/galerija", priority: 0.5, ucestalost: "monthly" as const },
  { path: "/o-nama", priority: 0.5, ucestalost: "monthly" as const },
  { path: "/kontakt", priority: 0.6, ucestalost: "monthly" as const },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const vehicles = await getVehicles();
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
