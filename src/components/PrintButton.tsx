"use client";

export default function PrintButton() {
  return (
    <button onClick={() => window.print()} className="btn-outline">
      Štampaj cijeli cjenovnik
    </button>
  );
}
