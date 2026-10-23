"use client";
import type { ReactNode } from 'react';
import Link from 'next/link';
import { useSelectedLayoutSegment } from 'next/navigation';
import { DocsShell, type DocsPageInfo } from '@hast/docs';
import { LOCALES, type AppLocale } from '@/i18n/config';
import { siteOrigin } from '@/lib/origins';
const labels={en:'English',ja:'日本語','zh-CN':'简体中文'};
export function SiteDocsShell({children,pages,locale,searchIndexUrl}:{children:ReactNode;pages:DocsPageInfo[];locale:AppLocale;searchIndexUrl:string}) {
  const slug=useSelectedLayoutSegment(); const page=pages.find(page=>page.slug===slug); if(!page)return children;
  return <DocsShell locale={locale} page={page} pages={pages} searchIndexUrl={searchIndexUrl} basePath={'/'+locale+'/docs'} homeHref={siteOrigin+'/'+locale}
    headerExtras={<details className="docs-language"><summary className="cursor-pointer">{labels[locale]}</summary><nav aria-label="Language">{LOCALES.map(language=><Link key={language} href={'/'+language+'/docs/'+page.slug} hrefLang={language} aria-current={language===locale?'true':undefined}>{labels[language]}</Link>)}</nav></details>}>
    {children}
  </DocsShell>;
}
