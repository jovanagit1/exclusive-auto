import { NextResponse } from "next/server";
import { getSubscribers, saveSubscribers, type Subscriber } from "@/lib/store";

export async function GET() {
  const subscribers = await getSubscribers();
  return NextResponse.json({ ok: true, subscribers });
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      email?: string;
      ime?: string;
      napomena?: string;
    };
    const email = body.email?.trim().toLowerCase();
    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { ok: false, error: "Nevalidna email adresa." },
        { status: 400 }
      );
    }

    const subscribers = await getSubscribers();
    if (subscribers.some((s) => s.email === email)) {
      return NextResponse.json(
        { ok: false, error: "Ovaj mejl je već na listi." },
        { status: 400 }
      );
    }

    const novi: Subscriber = {
      email,
      ime: body.ime?.trim() || undefined,
      napomena: body.napomena?.trim() || undefined,
      dodano: new Date().toISOString(),
    };
    await saveSubscribers([...subscribers, novi]);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[admin/newsletter] greška:", err);
    const message = err instanceof Error ? err.message : "Nepoznata greška.";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { email } = (await request.json()) as { email?: string };
    if (!email) {
      return NextResponse.json(
        { ok: false, error: "Nedostaje email." },
        { status: 400 }
      );
    }
    const subscribers = await getSubscribers();
    await saveSubscribers(subscribers.filter((s) => s.email !== email));
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[admin/newsletter] greška brisanja:", err);
    const message = err instanceof Error ? err.message : "Nepoznata greška.";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
