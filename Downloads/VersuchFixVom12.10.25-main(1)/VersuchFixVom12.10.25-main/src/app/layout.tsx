import type { Metadata } from "next";
import { Playfair_Display, Poppins } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/context/theme-context";
import { ToastProvider } from "@/context/toast-context";
import { ConfirmProvider } from "@/context/confirm-context";
import { CookieConsentProvider } from "@/context/cookie-consent-context";
import { VisitorTracker } from "@/components/visitor-tracker";
import { CookieBanner } from "@/components/ui/cookie-banner";
import { CookieSettingsButton } from "@/components/ui/cookie-settings-button";
import { SITE_CONFIG, SEO_KEYWORDS } from "@/lib/seo-config";

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: 'swap',
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_CONFIG.url),
  title: {
    default: "Restaurant ALAS Moos | Griechische Spezialitäten Niederbayern",
    template: "%s | Restaurant ALAS Moos",
  },
  description: SITE_CONFIG.description,
  keywords: SEO_KEYWORDS,
  authors: [{ name: SITE_CONFIG.name }],
  creator: SITE_CONFIG.name,
  publisher: SITE_CONFIG.name,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'de_DE',
    url: SITE_CONFIG.url,
    siteName: SITE_CONFIG.name,
    title: 'Restaurant ALAS Moos | Griechische Spezialitäten Niederbayern',
    description: SITE_CONFIG.description,
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Restaurant ALAS - Griechische Spezialitäten in Moos',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Restaurant ALAS Moos | Griechische Spezialitäten',
    description: SITE_CONFIG.description,
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: SITE_CONFIG.url,
  },
  verification: {
    // Add Google Search Console verification when available
    // google: 'your-google-verification-code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" className="scroll-smooth">
      <body
        className={`${playfairDisplay.variable} ${poppins.variable} font-sans antialiased`}
      >
        <ThemeProvider>
          <ToastProvider>
            <ConfirmProvider>
              <CookieConsentProvider>
                <VisitorTracker />
                {children}
                <CookieBanner />
                <CookieSettingsButton />
              </CookieConsentProvider>
            </ConfirmProvider>
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
