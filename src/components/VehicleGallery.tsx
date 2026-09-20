"use client";

import { useCallback, useEffect, useState } from "react";
import PlaceholderImage from "./PlaceholderImage";

/**
 * Galerija fotografija vozila:
 *  - Klik na glavnu (veliku) sliku otvara puni prikaz (lightbox).
 *  - Klik na bilo koju sličicu ispod odmah prikazuje TU fotografiju kao
 *    glavnu (ne mora se listati od prve do zadnje).
 *  - Strelice na glavnoj slici mijenjaju fotografiju bez otvaranja lightbox-a.
 *  - U lightbox-u rade i strelice na ekranu i strelice na tastaturi
 *    (lijevo/desno), a Esc zatvara prikaz.
 */
export default function VehicleGallery({
  slike,
  label,
}: {
  slike?: string[];
  label: string;
}) {
  const images = slike && slike.length > 0 ? slike : [];
  const [glavniIndeks, setGlavniIndeks] = useState(0);
  const [otvoreno, setOtvoreno] = useState(false);
  const [lightboxIndeks, setLightboxIndeks] = useState(0);

  const sljedeca = useCallback(() => {
    setGlavniIndeks((i) => (i + 1) % images.length);
  }, [images.length]);

  const prethodna = useCallback(() => {
    setGlavniIndeks((i) => (i - 1 + images.length) % images.length);
  }, [images.length]);

  const lightboxSljedeca = useCallback(() => {
    setLightboxIndeks((i) => (i + 1) % images.length);
  }, [images.length]);

  const lightboxPrethodna = useCallback(() => {
    setLightboxIndeks((i) => (i - 1 + images.length) % images.length);
  }, [images.length]);

  const zatvoriLightbox = useCallback(() => {
    setOtvoreno(false);
    setGlavniIndeks(lightboxIndeks);
  }, [lightboxIndeks]);

  useEffect(() => {
    if (!otvoreno) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") zatvoriLightbox();
      else if (e.key === "ArrowRight") lightboxSljedeca();
      else if (e.key === "ArrowLeft") lightboxPrethodna();
    }
    window.addEventListener("keydown", onKeyDown);
    const prijasnjiOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prijasnjiOverflow;
    };
  }, [otvoreno, zatvoriLightbox, lightboxSljedeca, lightboxPrethodna]);

  if (images.length === 0) {
    return <PlaceholderImage label={label} ratio="aspect-[4/3]" />;
  }

  return (
    <div>
      <div className="group relative aspect-[4/3] overflow-hidden border border-border bg-surface-2">
        <button
          type="button"
          onClick={() => {
            setLightboxIndeks(glavniIndeks);
            setOtvoreno(true);
          }}
          className="block h-full w-full cursor-zoom-in"
          aria-label="Otvori sliku preko cijelog ekrana"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={images[glavniIndeks]}
            alt={`${label} — slika ${glavniIndeks + 1}`}
            className="h-full w-full object-cover"
          />
        </button>

        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                prethodna();
              }}
              aria-label="Prethodna slika"
              className="absolute left-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-xl text-white opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                sljedeca();
              }}
              aria-label="Sljedeća slika"
              className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-xl text-white opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
            >
              ›
            </button>
            <span className="pointer-events-none absolute bottom-2 right-2 rounded-sm bg-black/70 px-2 py-1 text-xs text-white">
              {glavniIndeks + 1} / {images.length}
            </span>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div className="mt-3 grid grid-cols-4 gap-2 sm:grid-cols-5">
          {images.map((src, i) => (
            <button
              key={src + i}
              type="button"
              onClick={() => setGlavniIndeks(i)}
              className={`aspect-square overflow-hidden rounded-sm border transition-colors ${
                i === glavniIndeks
                  ? "border-accent"
                  : "border-border opacity-80 hover:opacity-100"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt={`${label} — sličica ${i + 1}`}
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </button>
          ))}
        </div>
      )}

      {otvoreno && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/95 p-4"
          role="dialog"
          aria-modal="true"
          aria-label={`${label} — puni prikaz slika`}
          onClick={zatvoriLightbox}
        >
          <button
            type="button"
            onClick={zatvoriLightbox}
            aria-label="Zatvori"
            className="absolute right-4 top-4 text-3xl leading-none text-white/80 hover:text-white"
          >
            ✕
          </button>

          {images.length > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                lightboxPrethodna();
              }}
              aria-label="Prethodna slika"
              className="absolute left-2 top-1/2 -translate-y-1/2 p-3 text-4xl text-white/70 hover:text-white sm:left-6"
            >
              ‹
            </button>
          )}

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={images[lightboxIndeks]}
            alt={`${label} — slika ${lightboxIndeks + 1}`}
            className="max-h-[88vh] max-w-[92vw] object-contain"
            onClick={(e) => e.stopPropagation()}
          />

          {images.length > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                lightboxSljedeca();
              }}
              aria-label="Sljedeća slika"
              className="absolute right-2 top-1/2 -translate-y-1/2 p-3 text-4xl text-white/70 hover:text-white sm:right-6"
            >
              ›
            </button>
          )}

          <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-sm text-white/70">
            {lightboxIndeks + 1} / {images.length}
          </p>
        </div>
      )}
    </div>
  );
}
