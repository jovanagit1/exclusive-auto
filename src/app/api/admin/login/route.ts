import { NextResponse } from "next/server";
import {
  ADMIN_SESSION_COOKIE,
  checkPassword,
  createSessionValue,
  isAdminPasswordConfigured,
} from "@/lib/admin-auth";

export async function POST(request: Request) {
  if (!isAdminPasswordConfigured()) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "ADMIN_PASSWORD nije podešen na serveru. Dodajte ga u Vercel → Settings → Environment Variables i redeploy-ujte sajt.",
      },
      { status: 500 }
    );
  }

  const { password } = (await request.json().catch(() => ({}))) as {
    password?: string;
  };

  if (!password || !(await checkPassword(password))) {
    return NextResponse.json(
      { ok: false, error: "Pogrešna lozinka." },
      { status: 401 }
    );
  }

  const session = await createSessionValue();
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_SESSION_COOKIE, session, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 dana
  });
  return res;
}
