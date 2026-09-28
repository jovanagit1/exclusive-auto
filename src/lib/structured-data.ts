/**
 * JSON-LD strukturirani podaci (schema.org) tipa "AutoDealer" — pomažu
 * Google-u (i AI pretraživačima) da tačno prepoznaju da je Exclusive Auto
 * prodavac vozila u Banja Luci, sa tačnom adresom, telefonom i radnim
 * vremenom. Ovo NE garantuje prvo mjesto na Google-u (na to utiče mnogo
 * faktora — Google Business Profile, recenzije, broj posjeta, konkurencija),
 * ali je osnovni, neophodan korak da se sajt uopšte ispravno "razumije".
 */
export const SITE_URL = "https://www.exclusiveautobl.com";

/**
 * "WebSite" — Google iz ovoga uzima NAZIV sajta koji prikazuje iznad
 * linka u rezultatima (umjesto golog "exclusiveautobl.com").
 */
export const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Exclusive Auto",
  alternateName: ["EXCLUSIVE AUTO", "Exclusive Auto Banja Luka"],
  url: `${SITE_URL}/`,
};

export const autoDealerJsonLd = {
  "@context": "https://schema.org",
  "@type": "AutoDealer",
  name: "Exclusive Auto",
  description:
    "Prodaja novih i polovnih automobila u Banjoj Luci. Uvoz vozila iz Evrope, priprema i prodaja uz garanciju na porijeklo i kilometražu.",
  url: SITE_URL,
  logo: `${SITE_URL}/logo/logo-google.png`,
  image: `${SITE_URL}/logo/logo-google.png`,
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
