export interface CookieCategory {
  id: string;
  name: string;
  description: string;
  required: boolean;
  cookies: {
    name: string;
    purpose: string;
    duration: string;
    provider: string;
  }[];
}

export const COOKIE_CATEGORIES: CookieCategory[] = [
  {
    id: "essential",
    name: "Essenziell",
    description:
      "Diese Cookies sind für die Grundfunktionen der Website erforderlich und können nicht deaktiviert werden.",
    required: true,
    cookies: [
      {
        name: "theme",
        purpose: "Speichert Ihre Theme-Präferenz (Hell/Dunkel Modus)",
        duration: "Unbegrenzt",
        provider: "Restaurant ALAS (First-Party)",
      },
      {
        name: "auth_token",
        purpose: "Session-Verwaltung für Admin-Bereich",
        duration: "Session",
        provider: "Restaurant ALAS (First-Party)",
      },
    ],
  },
  {
    id: "analytics",
    name: "Analytik & Statistik",
    description:
      "Diese Cookies helfen uns zu verstehen, wie Besucher mit unserer Website interagieren, um sie zu verbessern.",
    required: false,
    cookies: [
      {
        name: "visitor_session",
        purpose: "Zählt eindeutige Besucher für Statistiken",
        duration: "Session",
        provider: "Restaurant ALAS (First-Party)",
      },
    ],
  },
];

export const CONSENT_VERSION = "1.0";
