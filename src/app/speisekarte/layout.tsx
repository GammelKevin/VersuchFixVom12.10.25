import { Metadata } from 'next';
import { SEO_PAGES } from '@/lib/seo-config';

export const metadata: Metadata = {
  title: SEO_PAGES.menu.title,
  description: SEO_PAGES.menu.description,
  keywords: SEO_PAGES.menu.keywords,
  openGraph: {
    title: SEO_PAGES.menu.title,
    description: SEO_PAGES.menu.description,
    type: 'website',
  },
};

export default function SpeisekarteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
