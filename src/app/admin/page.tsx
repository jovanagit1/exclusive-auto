import Link from "next/link";
import { getVehicles } from "@/lib/store";
import { isBlobConfigured } from "@/lib/store";
import { formatPrice } from "@/lib/vehicles";
import AdminNav from "@/components/admin/AdminNav";
import DeleteVehicleButton from "@/components/admin/DeleteVehicleButton";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const vehicles = await getVehicles();
  const blobOk = isBlobConfigured();

  return (
    <div className="mx-auto max-w-5xl px-5 py-12 md:px-8">
      <AdminNav />

      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="section-label">Admin panel</p>
          <h1 className="font-display mt-2 text-3xl">Vozila ({vehicles.length})</h1>
        </div>
        <Link href="/admin/vozila/novo" className="btn-primary">
          + Dodaj vozilo
        </Link>
      </div>

      {!blobOk && (
        <div className="mt-6 border border-red-400/40 bg-red-400/10 p-4 text-sm text-red-300">
          <strong>Pažnja:</strong> Vercel Blob skladište nije podešeno
          (BLOB_READ_WRITE_TOKEN). Izmjene vozila se neće trajno sačuvati dok
          se ne uključi u Vercel → Storage → Create Database → Blob.
        </div>
      )}

      <div className="mt-8 divide-y divide-border border-y border-border">
        {vehicles.length === 0 && (
          <p className="py-10 text-center text-sm text-muted">
            Nema vozila. Dodajte prvo vozilo dugmetom iznad.
          </p>
        )}
        {vehicles.map((v) => (
          <div
            key={v.slug}
            className="flex flex-wrap items-center justify-between gap-4 py-4"
          >
            <div className="flex items-center gap-4">
              <div className="h-14 w-20 shrink-0 overflow-hidden rounded-sm border border-border bg-surface-2">
                {v.slike?.[0] ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={v.slike[0]}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                ) : null}
              </div>
              <div>
                <p className="text-sm font-medium">
                  {v.marka} {v.model}
                  {v.kategorija === "dolazak" && (
                    <span className="ml-2 rounded-sm border border-accent px-1.5 py-0.5 text-[0.6rem] uppercase tracking-wider text-accent">U dolasku</span>
                  )}
                  {v.kategorija === "posredovanje" && (
                    <span className="ml-2 rounded-sm border border-border px-1.5 py-0.5 text-[0.6rem] uppercase tracking-wider text-muted">Posredovanje</span>
                  )}
                </p>
                <p className="text-xs text-muted">
                  {v.godiste} · {formatPrice(v.cijena, v.valuta)} ·{" "}
                  {v.slike?.length ?? 0} slika
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href={`/admin/vozila/${v.slug}`}
                className="text-xs uppercase tracking-wider text-muted hover:text-accent"
              >
                Izmijeni
              </Link>
              <DeleteVehicleButton slug={v.slug} naziv={`${v.marka} ${v.model}`} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
