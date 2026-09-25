import nodemailer, { type Transporter } from "nodemailer";
import { Resend } from "resend";

/**
 * Zajednički modul za slanje SVIH mejlova sa sajta (forme, potvrde
 * korisnicima, newsletter, obavještenja vlasniku).
 *
 * PODEŠAVANJE — preporučeno: preko mejl naloga na vašem cPanel hostingu
 * (isti hosting gdje je aleksandar.maric@exclusiveautobl.com). U Vercel
 * projektu → Settings → Environment Variables dodajte:
 *
 *   SMTP_HOST  = npr. mail.exclusiveautobl.com  (sa "Connect Devices" stranice)
 *   SMTP_PORT  = 465
 *   SMTP_USER  = puna adresa naloga koji šalje, npr. noreply@exclusiveautobl.com
 *   SMTP_PASS  = šifra tog mejl naloga
 *   OWNER_EMAIL = aleksandar.maric@exclusiveautobl.com  (gdje stižu obavještenja)
 *
 * (Alternativa: RESEND_API_KEY ako se ikad pređe na Resend servis.)
 * Dok ništa od ovoga nije podešeno, sajt radi normalno — mejlovi se samo
 * preskaču i bilježe u Vercel logove.
 */

export const OWNER_EMAIL =
  process.env.OWNER_EMAIL ?? "aleksandar.maric@exclusiveautobl.com";
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.exclusiveautobl.com";

let transporter: Transporter | null = null;

function getTransporter(): Transporter | null {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!host || !user || !pass) return null;
  if (!transporter) {
    const port = Number(process.env.SMTP_PORT ?? 465);
    transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    });
  }
  return transporter;
}

function fromAdresa(): string {
  if (process.env.MAIL_FROM) return process.env.MAIL_FROM;
  if (process.env.SMTP_USER) return `Exclusive Auto <${process.env.SMTP_USER}>`;
  return process.env.RESEND_FROM ?? "Exclusive Auto <onboarding@resend.dev>";
}

export function mailKonfigurisan(): boolean {
  return Boolean(getTransporter() || process.env.RESEND_API_KEY);
}

/**
 * Šalje jedan mejl. Nikad ne baca grešku — vraća true/false, tako da forma
 * na sajtu uvijek radi, čak i kad slanje mejla ne uspije.
 */
export async function posaljiMejl(opts: {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
}): Promise<boolean> {
  try {
    const smtp = getTransporter();
    if (smtp) {
      await smtp.sendMail({
        from: fromAdresa(),
        to: opts.to,
        subject: opts.subject,
        html: opts.html,
        replyTo: opts.replyTo,
      });
      return true;
    }
    if (process.env.RESEND_API_KEY) {
      const resend = new Resend(process.env.RESEND_API_KEY);
      const { error } = await resend.emails.send({
        from: fromAdresa(),
        to: opts.to,
        subject: opts.subject,
        html: opts.html,
        replyTo: opts.replyTo,
      });
      if (error) {
        console.error("[mailer] Resend greška:", error);
        return false;
      }
      return true;
    }
    console.log(`[mailer] Mejl nije podešen — preskačem: "${opts.subject}" → ${opts.to}`);
    return false;
  } catch (err) {
    console.error(`[mailer] Slanje nije uspjelo ("${opts.subject}" → ${opts.to}):`, err);
    return false;
  }
}

export function escapeHtml(v: unknown): string {
  return String(v ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Tabela "oznaka — vrijednost" za mejlove (prazne vrijednosti se preskaču). */
export function tabelaPodataka(redovi: [string, unknown][]): string {
  const tr = redovi
    .filter(([, v]) => String(v ?? "").trim() !== "")
    .map(
      ([k, v]) =>
        `<tr><td style="padding:8px 14px;color:#6b6b70;font-size:13px;white-space:nowrap;vertical-align:top;border-bottom:1px solid #ececef;">${escapeHtml(
          k
        )}</td><td style="padding:8px 14px;font-size:14px;color:#111;border-bottom:1px solid #ececef;">${escapeHtml(
          v
        ).replace(/\n/g, "<br>")}</td></tr>`
    )
    .join("");
  return `<table style="width:100%;border-collapse:collapse;background:#f7f7f8;border-radius:6px;overflow:hidden;">${tr}</table>`;
}

/** Zajednički izgled svih mejlova (crno zaglavlje sa nazivom firme). */
export function sablonMejla(naslov: string, sadrzaj: string): string {
  return `<!doctype html><html><body style="margin:0;padding:0;background:#f2f2f4;">
<div style="font-family:Arial,Helvetica,sans-serif;max-width:600px;margin:0 auto;background:#ffffff;">
  <div style="background:#0a0a0b;padding:22px 28px;text-align:center;">
    <div style="color:#ffffff;font-size:20px;letter-spacing:5px;font-weight:bold;">EXCLUSIVE</div>
    <div style="color:#ffffff;font-size:11px;letter-spacing:6px;margin-top:2px;">— AUTO —</div>
  </div>
  <div style="padding:28px;">
    <h2 style="margin:0 0 14px;font-size:20px;color:#111;">${escapeHtml(naslov)}</h2>
    ${sadrzaj}
  </div>
  <div style="padding:18px 28px;border-top:1px solid #ececef;color:#8a8a8f;font-size:12px;line-height:1.6;">
    Exclusive Auto · Jaroslava Plecitija 17, 78000 Banja Luka<br>
    065 063 063 · 066 888 555 · <a href="${SITE_URL}" style="color:#8a8a8f;">exclusiveautobl.com</a>
  </div>
</div></body></html>`;
}

export function paragraf(tekst: string): string {
  return `<p style="margin:0 0 14px;color:#333;font-size:14px;line-height:1.6;">${tekst}</p>`;
}

export function dugme(tekst: string, href: string): string {
  return `<a href="${href}" style="background:#111;color:#fff;padding:12px 22px;text-decoration:none;border-radius:4px;font-size:13px;display:inline-block;margin-top:6px;">${escapeHtml(
    tekst
  )}</a>`;
}
