import { NextResponse } from "next/server";
import { addOrUpdateVehicle, deleteVehicle } from "@/lib/store";
import { posaljiObavjestenjeONovomVozilu } from "@/lib/newsletter";
import type { Vehicle } from "@/lib/vehicles";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      vehicle: Vehicle;
      posaljiNewsletter?: boolean;
    };

    if (!body.vehicle?.slug) {
      return NextResponse.json(
        { ok: false, error: "Nedostaje slug vozila." },
        { status: 400 }
      );
    }

    await addOrUpdateVehicle(body.vehicle);

    let newsletter: { poslato: number; ukupno: number } | null = null;
    if (body.posaljiNewsletter) {
      try {
        newsletter = await posaljiObavjestenjeONovomVozilu(body.vehicle);
      } catch (err) {
        console.error("[admin/vozila] newsletter greška:", err);
      }
    }

    return NextResponse.json({ ok: true, newsletter });
  } catch (err) {
    console.error("[admin/vozila] greška:", err);
    const message = err instanceof Error ? err.message : "Nepoznata greška.";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { slug } = (await request.json()) as { slug?: string };
    if (!slug) {
      return NextResponse.json(
        { ok: false, error: "Nedostaje slug." },
        { status: 400 }
      );
    }
    await deleteVehicle(slug);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[admin/vozila] greška brisanja:", err);
    const message = err instanceof Error ? err.message : "Nepoznata greška.";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
