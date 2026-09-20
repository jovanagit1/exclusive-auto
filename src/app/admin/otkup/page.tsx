import AdminNav from "@/components/admin/AdminNav";
import OtkupManager from "@/components/admin/OtkupManager";
import { getOtkupZahtjevi, isBlobConfigured } from "@/lib/store";

export const dynamic = "force-dynamic";

export default async function OtkupAdminPage() {
  const zahtjevi = await getOtkupZahtjevi();
  const blobOk = isBlobConfigured();

  return (
    <div className="mx-auto max-w-4xl px-5 py-12 md:px-8">
      <AdminNav />
      <p className="section-label">Admin panel</p>
      <h1 className="font-display mt-2 text-3xl">
        Otkup/zamjena vozila ({zahtjevi.length})
      </h1>
      <p className="mt-3 max-w-xl text-sm text-foreground/70">
        Zahtjevi koje posjetioci šalju preko stranice &ldquo;/prodaj-vozilo&rdquo;
        — nude vozilo na prodaju ili traže zamjenu za nešto iz naše ponude.
      </p>

      {!blobOk && (
        <div className="mt-6 border border-red-400/40 bg-red-400/10 p-4 text-sm text-red-300">
          <strong>Pažnja:</strong> Vercel Blob skladište nije podešeno
          (BLOB_READ_WRITE_TOKEN) — novi zahtjevi se neće trajno sačuvati dok
          se ne uključi u Vercel → Storage → Create Database → Blob.
        </div>
      )}

      <div className="mt-8">
        <OtkupManager zahtjevi={zahtjevi} />
      </div>
    </div>
  );
}
