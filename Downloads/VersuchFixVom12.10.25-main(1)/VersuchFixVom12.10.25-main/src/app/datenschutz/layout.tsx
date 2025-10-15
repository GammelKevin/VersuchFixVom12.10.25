import { Metadata } from 'next';
import { SEO_PAGES } from '@/lib/seo-config';

export const metadata: Metadata = {
  title: SEO_PAGES.datenschutz.title,
  description: SEO_PAGES.datenschutz.description,
  keywords: SEO_PAGES.datenschutz.keywords,
  robots: {
    index: false,
    follow: true,
  },
};

export default function DatenschutzLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
