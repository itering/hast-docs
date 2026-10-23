import { notFound } from 'next/navigation';
import { isAppLocale } from './config';
export async function setLocaleFromParams(params: Promise<{ locale: string }>) {
  const { locale } = await params;
  if (!isAppLocale(locale)) notFound();
  return locale;
}
