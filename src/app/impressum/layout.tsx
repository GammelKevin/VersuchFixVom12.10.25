import { Metadata } from 'next';
import { SEO_PAGES } from '@/lib/seo-config';

export const metadata: Metadata = {
  title: SEO_PAGES.impressum.title,
  description: SEO_PAGES.impressum.description,
  keywords: SEO_PAGES.impressum.keywords,
  robots: {
    index: false,
    follow: true,
  },
};

export default function ImpressumLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
