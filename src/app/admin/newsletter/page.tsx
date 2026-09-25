import AdminNav from "@/components/admin/AdminNav";
import NewsletterManager from "@/components/admin/NewsletterManager";
import { getSubscribers } from "@/lib/store";

export const dynamic = "force-dynamic";

export default async function NewsletterAdminPage() {
  const subscribers = await getSubscribers();

  return (
    <div className="mx-auto max-w-3xl px-5 py-12 md:px-8">
      <AdminNav />
      <p className="section-label">Admin panel</p>
      <h1 className="font-display mt-2 text-3xl">Privatni salon (newsletter)</h1>
      <p className="mt-3 max-w-xl text-sm text-foreground/70">
        Članovi privatnog salona — prijavljeni sa sajta ili dodati ručno.
        Vide odjeljak &ldquo;Vozila u dolasku&rdquo; i dobijaju mejl kad se doda
        novo vozilo (uz uključenu opciju &ldquo;Pošalji obavještenje&rdquo;).
        Kad nekoga uklonite, gubi i pristup vozilima u dolasku.
      </p>

      <div className="mt-8">
        <NewsletterManager subscribers={subscribers} />
      </div>
    </div>
  );
}
