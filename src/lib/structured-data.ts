/**
 * JSON-LD strukturirani podaci (schema.org) tipa "AutoDealer" — pomažu
 * Google-u (i AI pretraživačima) da tačno prepoznaju da je Exclusive Auto
 * prodavac vozila u Banja Luci, sa tačnom adresom, telefonom i radnim
 * vremenom. Ovo NE garantuje prvo mjesto na Google-u (na to utiče mnogo
 * faktora — Google Business Profile, recenzije, broj posjeta, konkurencija),
 * ali je osnovni, neophodan korak da se sajt uopšte ispravno "razumije".
 */
export const SITE_URL = "https://www.exclusiveautobl.com";

export const autoDealerJsonLd = {
  "@context": "https://schema.org",
  "@type": "AutoDealer",
  name: "Exclusive Auto",
  description:
    "Prodaja i uvoz polovnih vozila u Banjoj Luci. Registracija, detailing i priprema vozila.",
  url: SITE_URL,
  telephone: "+38765063063",
  email: "aleksandar.maric@exclusiveautobl.com",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Jaroslava Plecitija 17",
    addressLocality: "Banja Luka",
    addressRegion: "Republika Srpska",
    postalCode: "78000",
    addressCountry: "BA",
  },
  areaServed: {
    "@type": "City",
    name: "Banja Luka",
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
      ],
      opens: "09:00",
      closes: "17:00",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Saturday"],
      opens: "09:00",
      closes: "15:00",
    },
  ],
};
