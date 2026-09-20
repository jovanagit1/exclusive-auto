import { notFound } from "next/navigation";
import AdminNav from "@/components/admin/AdminNav";
import VehicleForm from "@/components/admin/VehicleForm";
import { getVehicleBySlug } from "@/lib/store";

export const dynamic = "force-dynamic";

export default async function IzmjenaVozilaPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const vehicle = await getVehicleBySlug(slug);
  if (!vehicle) notFound();

  return (
    <div className="mx-auto max-w-5xl px-5 py-12 md:px-8">
      <AdminNav />
      <p className="section-label">Admin panel</p>
      <h1 className="font-display mt-2 text-3xl">
        Izmijeni: {vehicle.marka} {vehicle.model}
      </h1>
      <div className="mt-8">
        <VehicleForm initial={vehicle} />
      </div>
    </div>
  );
}
