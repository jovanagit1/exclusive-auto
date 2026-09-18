import Link from "next/link";
import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 md:grid-cols-4 md:px-8">
        <div>
          <Logo />
          <p className="mt-4 text-sm leading-relaxed text-muted">
            Uvoz, prodaja i priprema vozila iz Evrope. Povjerenje izgrađeno na
            transparentnosti i kvalitetu.
          </p>
        </div>

        <div>
          <h3 className="section-label mb-4">Navigacija</h3>
          <ul className="space-y-2 text-sm text-foreground/80">
            <li><Link href="/vozila" className="hover:text-gold">Vozila</Link></li>
            <li><Link href="/usluge" className="hover:text-gold">Usluge</Link></li>
            <li><Link href="/galerija" className="hover:text-gold">Galerija</Link></li>
            <li><Link href="/o-nama" className="hover:text-gold">O nama</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="section-label mb-4">Usluge</h3>
          <ul className="space-y-2 text-sm text-foreground/80">
            <li><Link href="/uvoz" className="hover:text-gold">Uvoz vozila</Link></li>
            <li><Link href="/registracija" className="hover:text-gold">Registracija vozila</Link></li>
            <li><Link href="/probna-voznja" className="hover:text-gold">Probna vožnja</Link></li>
            <li><Link href="/usluge" className="hover:text-gold">Detailing i priprema</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="section-label mb-4">Kontakt</h3>
          <ul className="space-y-2 text-sm text-foreground/80">
            <li>Banja Luka, BiH</li>
            <li>
              <a href="tel:+38765000000" className="hover:text-gold">
                +387 65 000 000
              </a>
            </li>
            <li>
              <a
                href="mailto:info@exclusiveautobl.com"
                className="hover:text-gold"
              >
                info@exclusiveautobl.com
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border px-5 py-6 md:px-8">
        <p className="disclaimer mx-auto max-w-7xl">
          Usluge zatamnjenja stakala (tzv. „folija“) izvodimo isključivo u
          skladu sa važećim propisima o dozvoljenoj svjetlopropusnosti za
          vozila u saobraćaju. Poliranje i detailing vozila su kozmetičke
          usluge pripreme vozila i ne utiču na tehničke karakteristike
          vozila. Za detalje o zakonskim ograničenjima kontaktirajte nas
          prije zakazivanja termina.
        </p>
        <p className="mt-4 text-xs text-muted">
          © {new Date().getFullYear()} Exclusive Auto. Sva prava zadržana.
        </p>
      </div>
    </footer>
  );
}
