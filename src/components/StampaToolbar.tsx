"use client";

import Link from "next/link";

export default function StampaToolbar({ broj }: { broj: number }) {
  return (
    <div className="stampa-toolbar mx-auto mb-6 flex max-w-[210mm] flex-wrap items-center justify-between gap-3 print:hidden">
      <Link href="/cjenovnik" className="text-sm text-neutral-600 hover:text-black">
        ← Nazad na cjenovnik
      </Link>
      <div className="flex items-center gap-4">
        <span className="text-sm text-neutral-500">
          {broj} {broj === 1 ? "vozilo" : "vozila"}
        </span>
        <button
          type="button"
          onClick={() => window.print()}
          className="rounded-sm bg-black px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-white hover:bg-neutral-800"
        >
          Štampaj / Sačuvaj PDF
        </button>
      </div>
    </div>
  );
}
