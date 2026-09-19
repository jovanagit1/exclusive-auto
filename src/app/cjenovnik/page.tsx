import type { Metadata } from "next";
import Link from "next/link";
import { getVehicles } from "@/lib/store";
import { formatPrice } from "@/lib/vehicles";
import PrintButton from "@/components/PrintButton";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Cjenovnik",
  description: "Kompletna sveska ponude — sva vozila Exclusive Auto na jednom mjestu.",
};

export default async function CjenovnikPage() {
  const vehicles = await getVehicles();

  return (
    <div className="mx-auto max-w-5xl px-5 py-16 md:px-8 md:py-20">
      <div className="flex flex-wrap items-end justify-between gap-4 print:hidden">
        <div>
          <p className="section-label">Sveska ponude</p>
          <h1 className="font-display mt-2 text-4xl">Cjenovnik</h1>
          <p className="mt-3 max-w-xl text-sm text-foreground/70">
            Kompletan pregled svih vozila u ponudi — pogodno za štampu ili
            čuvanje kao PDF.
          </p>
        </div>
        <PrintButton />
      </div>

      <div className="mb-10 hidden print:block">
        <h1 className="font-display text-2xl">Exclusive Auto — Cjenovnik</h1>
        <p className="text-xs text-muted">
          {new Date().toLocaleDateString("bs-BA")}
        </p>
      </div>

      <div className="mt-8 overflow-x-auto border border-border print:mt-0 print:border-black">
        <table className="w-full min-w-[640px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-border bg-surface text-left text-xs uppercase tracking-wider text-muted print:bg-white print:text-black">
              <th className="px-4 py-3">Vozilo</th>
              <th className="px-4 py-3">Godište</th>
              <th className="px-4 py-3">Kilometraža</th>
              <th className="px-4 py-3">Gorivo / Mjenjač</th>
              <th className="px-4 py-3 text-right">Cijena</th>
            </tr>
          </thead>
          <tbody>
            {vehicles.map((v) => (
              <tr
                key={v.slug}
                className="border-b border-border last:border-0 print:border-black"
              >
                <td className="px-4 py-3">
                  <Link
                    href={`/vozila/${v.slug}`}
                    className="font-medium hover:text-accent print:text-black"
                  >
                    {v.marka} {v.model}
                  </Link>
                </td>
                <td className="px-4 py-3">{v.godiste}</td>
                <td className="px-4 py-3">{v.km.toLocaleString("de-DE")} km</td>
                <td className="px-4 py-3">
                  {v.gorivo} · {v.mjenjac}
                </td>
                <td className="px-4 py-3 text-right font-semibold text-accent print:text-black">
                  {formatPrice(v.cijena, v.valuta)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {vehicles.length === 0 && (
          <p className="p-8 text-center text-sm text-muted">
            Trenutno nema vozila u ponudi.
          </p>
        )}
      </div>
    </div>
  );
}
