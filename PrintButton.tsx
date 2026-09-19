"use client";

export default function PrintButton() {
  return (
    <button onClick={() => window.print()} className="btn-outline">
      Štampaj / Preuzmi kao PDF
    </button>
  );
}
