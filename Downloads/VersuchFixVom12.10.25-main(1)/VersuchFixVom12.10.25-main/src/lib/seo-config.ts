/**
 * SEO Configuration for Restaurant ALAS
 * Centralized SEO settings and constants
 */

export const SITE_CONFIG = {
  name: 'Restaurant ALAS',
  description: 'Traditionelle griechische Küche im Restaurant ALAS in Moos, Niederbayern. Erleben Sie authentische griechische Gastfreundschaft und köstliche Spezialitäten.',
  url: 'https://restaurant-alas.de',
  ogImage: '/og-image.jpg',

  contact: {
    phone: '+4909938230307',
    phoneDisplay: '09938 2320307',
    email: 'info@restaurant-alas.de',
  },

  address: {
    street: 'Bundesstr. 39',
    city: 'Moos',
    region: 'Niederbayern',
    postalCode: '94554',
    country: 'DE',
    countryName: 'Deutschland',
  },

  location: {
    latitude: 48.6667,
    longitude: 13.1667,
  },

  social: {
    facebook: 'https://www.facebook.com/p/Griechisches-Restaurant-ALAS-61552077044507/?locale=de_DE',
    instagram: 'https://www.instagram.com/griechischesrestaurantalas/',
  },

  business: {
    type: 'Restaurant',
    cuisine: 'Greek',
    cuisineDisplay: 'Griechische Küche',
    priceRange: '$$',
  },
} as const;

export const SEO_KEYWORDS: string[] = [
  'Restaurant Moos',
  'Griechisches Restaurant Moos',
  'Restaurant ALAS',
  'ALAS Moos',
  'Griechische Küche Niederbayern',
  'Restaurant Niederbayern',
  'Griechische Spezialitäten',
  'Mediterrane Küche Moos',
  'Restaurant Bundesstraße 39',
  'Essen gehen Moos',
  'Griechisch essen Niederbayern',
  'Restaurant in der Nähe',
];

export const SEO_PAGES = {
  home: {
    title: 'Restaurant ALAS Moos | Griechische Spezialitäten Niederbayern',
    description: 'Authentische griechische Küche im Herzen von Moos, Niederbayern. Restaurant ALAS bietet traditionelle griechische Spezialitäten und herzliche Gastfreundschaft. Jetzt Tisch reservieren!',
    keywords: [
      'Restaurant Moos',
      'Griechisches Restaurant Moos',
      'ALAS Moos',
      'Griechische Küche Niederbayern',
      'Restaurant Niederbayern',
    ] as string[],
  },
  menu: {
    title: 'Speisekarte | Restaurant ALAS Moos - Griechische Spezialitäten',
    description: 'Entdecken Sie unsere vielfältige Speisekarte mit authentischen griechischen Gerichten, frischen Vorspeisen, köstlichen Hauptspeisen und traditionellen Desserts im Restaurant ALAS Moos.',
    keywords: [
      'Speisekarte Restaurant ALAS',
      'Griechisches Essen Moos',
      'Griechische Gerichte',
      'Menü Restaurant Moos',
      'Griechische Vorspeisen',
    ] as string[],
  },
  impressum: {
    title: 'Impressum | Restaurant ALAS Moos',
    description: 'Impressum und rechtliche Informationen des Restaurant ALAS in Moos, Niederbayern.',
    keywords: ['Impressum', 'Restaurant ALAS', 'Kontakt'] as string[],
  },
  datenschutz: {
    title: 'Datenschutz | Restaurant ALAS Moos',
    description: 'Datenschutzerklärung des Restaurant ALAS in Moos, Niederbayern.',
    keywords: ['Datenschutz', 'Privacy Policy', 'Restaurant ALAS'] as string[],
  },
};
