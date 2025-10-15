'use client';

import { SITE_CONFIG } from '@/lib/seo-config';

interface OpeningHoursData {
  day: string;
  open_time_1: string | null;
  close_time_1: string | null;
  open_time_2: string | null;
  close_time_2: string | null;
  closed: boolean;
}

interface StructuredDataProps {
  openingHours?: OpeningHoursData[];
}

const DAY_MAPPING: Record<string, string> = {
  'Montag': 'Monday',
  'Dienstag': 'Tuesday',
  'Mittwoch': 'Wednesday',
  'Donnerstag': 'Thursday',
  'Freitag': 'Friday',
  'Samstag': 'Saturday',
  'Sonntag': 'Sunday',
};

export function StructuredData({ openingHours }: StructuredDataProps) {
  // Generate opening hours specification
  const openingHoursSpecification = openingHours?.map(hour => {
    if (hour.closed) return null;

    const specs = [];

    // First opening time
    if (hour.open_time_1 && hour.close_time_1) {
      specs.push({
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: DAY_MAPPING[hour.day] || hour.day,
        opens: hour.open_time_1.substring(0, 5),
        closes: hour.close_time_1.substring(0, 5),
      });
    }

    // Second opening time (if exists)
    if (hour.open_time_2 && hour.close_time_2) {
      specs.push({
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: DAY_MAPPING[hour.day] || hour.day,
        opens: hour.open_time_2.substring(0, 5),
        closes: hour.close_time_2.substring(0, 5),
      });
    }

    return specs;
  }).flat().filter(Boolean) || [];

  const restaurantSchema = {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    '@id': SITE_CONFIG.url,
    name: SITE_CONFIG.name,
    description: SITE_CONFIG.description,
    url: SITE_CONFIG.url,
    telephone: SITE_CONFIG.contact.phone,
    email: SITE_CONFIG.contact.email,
    image: [
      `${SITE_CONFIG.url}/og-image.jpg`,
      `${SITE_CONFIG.url}/restaurant-interior.jpg`,
      `${SITE_CONFIG.url}/greek-food.jpg`,
    ],
    servesCuisine: SITE_CONFIG.business.cuisine,
    priceRange: SITE_CONFIG.business.priceRange,
    address: {
      '@type': 'PostalAddress',
      streetAddress: SITE_CONFIG.address.street,
      addressLocality: SITE_CONFIG.address.city,
      addressRegion: SITE_CONFIG.address.region,
      postalCode: SITE_CONFIG.address.postalCode,
      addressCountry: SITE_CONFIG.address.country,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: SITE_CONFIG.location.latitude,
      longitude: SITE_CONFIG.location.longitude,
    },
    openingHoursSpecification: openingHoursSpecification.length > 0 ? openingHoursSpecification : undefined,
    acceptsReservations: 'True',
    menu: `${SITE_CONFIG.url}/speisekarte`,
    hasMenu: `${SITE_CONFIG.url}/speisekarte`,
    sameAs: [
      SITE_CONFIG.social.facebook,
      SITE_CONFIG.social.instagram,
    ],
    currenciesAccepted: 'EUR',
    paymentAccepted: 'Cash, Credit Card, Debit Card',
    potentialAction: {
      '@type': 'ReserveAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: SITE_CONFIG.url,
        actionPlatform: [
          'http://schema.org/DesktopWebPlatform',
          'http://schema.org/MobileWebPlatform',
        ],
      },
      result: {
        '@type': 'Reservation',
        name: 'Tischreservierung',
      },
    },
  };

  // Breadcrumb Schema
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: SITE_CONFIG.url,
      },
    ],
  };

  // Organization Schema
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_CONFIG.name,
    url: SITE_CONFIG.url,
    logo: `${SITE_CONFIG.url}/logo.png`,
    description: SITE_CONFIG.description,
    address: {
      '@type': 'PostalAddress',
      streetAddress: SITE_CONFIG.address.street,
      addressLocality: SITE_CONFIG.address.city,
      addressRegion: SITE_CONFIG.address.region,
      postalCode: SITE_CONFIG.address.postalCode,
      addressCountry: SITE_CONFIG.address.country,
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: SITE_CONFIG.contact.phone,
      contactType: 'Reservations',
      email: SITE_CONFIG.contact.email,
      availableLanguage: ['German', 'Greek'],
    },
    sameAs: [
      SITE_CONFIG.social.facebook,
      SITE_CONFIG.social.instagram,
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(restaurantSchema).replace(/</g, '\\u003c'),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema).replace(/</g, '\\u003c'),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema).replace(/</g, '\\u003c'),
        }}
      />
    </>
  );
}
