"use client";

import { useState } from "react";

export type FormField = {
  name: string;
  label: string;
  type?: "text" | "email" | "tel" | "date" | "textarea" | "select";
  required?: boolean;
  placeholder?: string;
  options?: string[];
  colSpan2?: boolean;
};

export default function InquiryForm({
  formType,
  fields,
  submitLabel = "Pošalji upit",
}: {
  formType: string;
  fields: FormField[];
  submitLabel?: string;
}) {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle"
  );

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");

    // Formu pamtimo odmah — nakon "await" React više ne drži e.currentTarget,
    // pa je raniji poziv e.currentTarget.reset() pucao i prikazivao grešku
    // iako je upit uspješno poslat.
    const forma = e.currentTarget;
    const formData = new FormData(forma);
    const data = Object.fromEntries(formData.entries());

    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ formType, data }),
      });
      if (!res.ok) throw new Error("Slanje nije uspjelo");
      forma.reset();
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="card p-8 text-center">
        <p className="font-display text-xl text-accent">Hvala vam!</p>
        <p className="mt-2 text-sm text-foreground/80">
          Vaš upit je zaprimljen. Javit ćemo vam se u najkraćem mogućem roku.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-5 sm:grid-cols-2">
      {fields.map((field) => (
        <div
          key={field.name}
          className={field.colSpan2 ? "sm:col-span-2" : undefined}
        >
          <label
            htmlFor={field.name}
            className="mb-1.5 block text-xs uppercase tracking-wider text-muted"
          >
            {field.label}
            {field.required && <span className="text-accent"> *</span>}
          </label>

          {field.type === "textarea" ? (
            <textarea
              id={field.name}
              name={field.name}
              required={field.required}
              placeholder={field.placeholder}
              rows={4}
              className="input-field resize-none"
            />
          ) : field.type === "select" ? (
            <select
              id={field.name}
              name={field.name}
              required={field.required}
              defaultValue=""
              className="input-field"
            >
              <option value="" disabled>
                {field.placeholder ?? "Odaberite"}
              </option>
              {field.options?.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          ) : (
            <input
              id={field.name}
              name={field.name}
              type={field.type ?? "text"}
              required={field.required}
              placeholder={field.placeholder}
              className="input-field"
            />
          )}
        </div>
      ))}

      <div className="sm:col-span-2">
        <button
          type="submit"
          disabled={status === "sending"}
          className="btn-primary w-full sm:w-auto disabled:opacity-60"
        >
          {status === "sending" ? "Slanje..." : submitLabel}
        </button>
        {status === "error" && (
          <p className="mt-3 text-sm text-red-400">
            Došlo je do greške. Pokušajte ponovo ili nas kontaktirajte
            direktno telefonom.
          </p>
        )}
      </div>
    </form>
  );
}
