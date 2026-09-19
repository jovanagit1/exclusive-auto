import AdminNav from "@/components/admin/AdminNav";
import VehicleForm from "@/components/admin/VehicleForm";

export const dynamic = "force-dynamic";

export default function NovoVoziloPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-12 md:px-8">
      <AdminNav />
      <p className="section-label">Admin panel</p>
      <h1 className="font-display mt-2 text-3xl">Dodaj vozilo</h1>
      <div className="mt-8">
        <VehicleForm />
      </div>
    </div>
  );
}
