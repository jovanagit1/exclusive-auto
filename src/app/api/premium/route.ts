import { NextResponse } from "next/server";
import { getSubscribers, saveSubscribers, type Subscriber } from "@/lib/store";

/**
 * Javna ruta (BEZ admin prijave) — posjetioci sajta se ovdje prijavljuju da
 * postanu premium korisnici i dobijaju mejl kad izađe novo vozilo. Admin
 * i dalje vidi i upravlja cijelom listom preko Admin panel → Newsletter
 * (koji koristi istog "store" — /api/admin/newsletter).
 */
export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { email?: string; ime?: string };
    const email = body.email?.trim().toLowerCase();
    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { ok: false, error: "Unesite ispravnu email adresu." },
        { status: 400 }
      );
    }

    const subscribers = await getSubscribers();
    if (subscribers.some((s) => s.email === email)) {
      return NextResponse.json(
        { ok: false, error: "Ova email adresa je već prijavljena." },
        { status: 400 }
      );
    }

    const novi: Subscriber = {
      email,
      ime: body.ime?.trim() || undefined,
      napomena: "Prijavljen/a sa sajta",
      dodano: new Date().toISOString(),
    };
    await saveSubscribers([...subscribers, novi]);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[premium] greška:", err);
    const message = err instanceof Error ? err.message : "Nepoznata greška.";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
