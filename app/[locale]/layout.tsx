import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import { LOCALES } from '@/i18n/config';
import { setLocaleFromParams } from '@/i18n/locale-param';
import { docsOrigin } from '@/lib/origins';
import '@/styles.css';
import '../site.css';
export const dynamicParams = false;
export const metadata: Metadata = { metadataBase: new URL(docsOrigin), robots: { index: false, follow: false } };
export function generateStaticParams() { return LOCALES.map(locale => ({ locale })); }
export default async function Layout({ children, params }: { children: ReactNode; params: Promise<{locale:string}> }) {
  const locale = await setLocaleFromParams(params);
  return <html lang={locale} suppressHydrationWarning><head><script dangerouslySetInnerHTML={{__html: 'try{const t=localStorage.getItem("theme");document.documentElement.dataset.theme=t==="dark"||(t!=="light"&&matchMedia("(prefers-color-scheme: dark)").matches)?"dark":"light"}catch{}'}} /></head><body>{children}</body></html>;
}
