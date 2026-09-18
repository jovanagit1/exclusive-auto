import { NextResponse } from "next/server";

/**
 * Prima sve upite sa sajta (kontakt, probna vožnja, uvoz, registracija).
 *
 * VAŽNO — ovo je tehnički spreman "endpoint", ali trenutno SAMO loguje
 * upit u server log; ne šalje stvarni email. Prije puštanja sajta uživo,
 * povežite ga sa servisom za slanje mejlova, npr.:
 *
 *   1) Resend (https://resend.com) — dodajte RESEND_API_KEY u Vercel
 *      Environment Variables i pozovite Resend API ovdje ispod, ili
 *   2) Formspree / Web3Forms — jednostavnije, bez pisanja koda: samo
 *      zamijenite `action` atribut formi da šalje direktno njihovom API-ju.
 *
 * Do tada, upiti se i dalje mogu vidjeti u Vercel → Project → Logs.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { formType, data } = body as { formType?: string; data?: unknown };

    if (!formType || !data) {
      return NextResponse.json(
        { ok: false, error: "Nedostaju podaci." },
        { status: 400 }
      );
    }

    console.log(`[Upit: ${formType}]`, JSON.stringify(data, null, 2));

    // TODO: ovdje poslati email/notifikaciju vlasniku sajta kada se
    // poveže servis za slanje mejlova (vidi napomenu iznad).

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Nevalidan zahtjev." },
      { status: 400 }
    );
  }
}
