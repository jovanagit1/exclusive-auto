import { permanentRedirect } from "next/navigation";

/**
 * Stara adresa (otkup i zamjena). Otkup vozila je ukinut — ostala je samo
 * zamjena, pa svi stari linkovi i Google rezultati vode na novu stranicu.
 */
export default function ProdajVoziloPage() {
  permanentRedirect("/zamjena-vozila");
}
