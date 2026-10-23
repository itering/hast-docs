import type { ReactNode } from 'react';
import { getDocsPages } from '@/content/docs/catalogue';
import { getDocsSearchAsset } from '@/content/docs/search-asset';
import { setLocaleFromParams } from '@/i18n/locale-param';
import { SiteDocsShell } from './site-docs-shell';
export default async function Layout({children,params}:{children:ReactNode;params:Promise<{locale:string}>}) {
  const locale=await setLocaleFromParams(params); const {file}=await getDocsSearchAsset(locale);
  return <SiteDocsShell locale={locale} searchIndexUrl={'/docs-search/'+file} pages={getDocsPages(locale).map(page=>({...page,toc:[]}))}>{children}</SiteDocsShell>;
}
