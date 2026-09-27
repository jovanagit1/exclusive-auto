import nodemailer, { type Transporter } from "nodemailer";
import { Resend } from "resend";
import { okvirMejla, blokUvod, blokSadrzaj, tabela } from "./mejl-potvrda";

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
  return tabela(redovi);
}

/**
 * Zajednički izgled mejlova (crno zaglavlje sa logom, crni footer sa
 * podacima firme) — vidi src/lib/mejl-potvrda.ts.
 */
export function sablonMejla(naslov: string, sadrzaj: string, oznaka = "Exclusive Auto"): string {
  return okvirMejla(blokUvod(oznaka, naslov) + blokSadrzaj(sadrzaj, 12, 40), naslov);
}

export function paragraf(tekst: string): string {
  return `<p style="margin:0 0 14px;color:#3c3c42;font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.65;">${tekst}</p>`;
}

export function dugme(tekst: string, href: string): string {
  return `<a href="${href}" style="background:#0a0a0b;color:#ffffff;padding:14px 26px;text-decoration:none;font-family:Arial,Helvetica,sans-serif;font-size:12px;font-weight:bold;letter-spacing:1.5px;text-transform:uppercase;display:inline-block;margin-top:6px;">${escapeHtml(
    tekst
  )}</a>`;
}
