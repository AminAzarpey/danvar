import { notFound } from 'next/navigation';
import Studio from '@/components/Studio';
import { copy, type Locale } from '@/content/studio';

export function generateStaticParams() {
  return ['en', 'fa', 'ar'].map((locale) => ({ locale }));
}
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const c = copy[locale as Locale];
  return {
    title: c ? `${c.brand} — ${c.descriptor}` : 'Danvar',
    description: c?.intro,
  };
}
export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!['en', 'fa', 'ar'].includes(locale)) notFound();
  return <Studio locale={locale as Locale} />;
}
