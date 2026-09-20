import { NextResponse } from "next/server";
import {
  deleteOtkupZahtjev,
  updateOtkupZahtjevStatus,
  type OtkupZahtjev,
} from "@/lib/store";

export async function PATCH(request: Request) {
  try {
    const { id, status } = (await request.json()) as {
      id?: string;
      status?: OtkupZahtjev["status"];
    };
    if (!id || !status) {
      return NextResponse.json(
        { ok: false, error: "Nedostaje id ili status." },
        { status: 400 }
      );
    }
    await updateOtkupZahtjevStatus(id, status);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[admin/otkup] greška:", err);
    const message = err instanceof Error ? err.message : "Nepoznata greška.";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = (await request.json()) as { id?: string };
    if (!id) {
      return NextResponse.json(
        { ok: false, error: "Nedostaje id." },
        { status: 400 }
      );
    }
    await deleteOtkupZahtjev(id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[admin/otkup] greška brisanja:", err);
    const message = err instanceof Error ? err.message : "Nepoznata greška.";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
