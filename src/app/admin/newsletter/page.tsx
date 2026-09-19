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
      <h1 className="font-display mt-2 text-3xl">Premium newsletter</h1>
      <p className="mt-3 max-w-xl text-sm text-foreground/70">
        Ovdje ručno dodajete korisnike koji su kupili 2 ili više vozila kod
        Exclusive Auto. Kad se doda novo vozilo (uz uključenu opciju
        &ldquo;Pošalji obavještenje&rdquo;), svi sa ove liste dobijaju mejl.
      </p>

      <div className="mt-8">
        <NewsletterManager subscribers={subscribers} />
      </div>
    </div>
  );
}
