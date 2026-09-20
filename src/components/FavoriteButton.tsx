"use client";

import { useFavorites } from "@/hooks/useFavorites";

/**
 * Dugme u obliku srca za dodavanje/uklanjanje vozila iz "Sačuvana vozila"
 * liste. Koristi se i na kartici vozila (VehicleCard) i na stranici detalja
 * vozila. `stopPropagation` je bitan na kartici jer je cijela kartica link
 * ka detaljima — klik na srce ne smije otvoriti stranicu vozila.
 */
export default function FavoriteButton({
  slug,
  size = "md",
  className = "",
}: {
  slug: string;
  size?: "sm" | "md";
  className?: string;
}) {
  const { jeSacuvano, preklopi, spremno } = useFavorites();
  const sacuvano = spremno && jeSacuvano(slug);
  const dimenzija = size === "sm" ? "h-8 w-8" : "h-10 w-10";
  const ikonica = size === "sm" ? "h-4 w-4" : "h-5 w-5";

  return (
    <button
      type="button"
      aria-label={sacuvano ? "Ukloni iz sačuvanih vozila" : "Sačuvaj vozilo"}
      aria-pressed={sacuvano}
      title={sacuvano ? "Ukloni iz sačuvanih vozila" : "Sačuvaj vozilo"}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        preklopi(slug);
      }}
      className={`flex ${dimenzija} items-center justify-center rounded-full border transition-colors ${
        sacuvano
          ? "border-accent bg-accent text-background"
          : "border-border bg-background/70 text-foreground backdrop-blur hover:border-accent hover:text-accent"
      } ${className}`}
    >
      <svg
        viewBox="0 0 24 24"
        fill={sacuvano ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth={1.75}
        className={ikonica}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 20.727c-.246 0-.492-.086-.687-.259C7.94 17.516 3 12.94 3 9.03 3 6.256 5.153 4 7.813 4c1.532 0 2.9.79 3.75 1.997A4.53 4.53 0 0 1 15.312 4C17.973 4 20.125 6.256 20.125 9.03c0 3.91-4.94 8.487-8.313 11.438a1.03 1.03 0 0 1-.687.259Z"
        />
      </svg>
    </button>
  );
}
