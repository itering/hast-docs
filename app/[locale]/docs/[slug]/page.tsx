import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { docsComponents } from '@hast/docs';
import { DocsLink } from '@/components/docs/docs-link';
import { setLocaleFromParams } from '@/i18n/locale-param';
import { docsPages, getDocsPages } from '@/content/docs/catalogue';
import { getDocsContent } from '@/content/docs/content';
import { LOCALES } from '@/i18n/config';
export const dynamicParams = false;
export function generateStaticParams() { return LOCALES.flatMap(locale => docsPages.map(({slug}) => ({locale, slug}))); }
export async function generateMetadata({params}:{params:Promise<{locale:string;slug:string}>}):Promise<Metadata> {
  const locale=await setLocaleFromParams(params); const {slug}=await params;
  const page=getDocsPages(locale).find(page=>page.slug===slug); if(!page)notFound();
  return {title:page.title+' | Hast Docs',description:page.description,alternates:{canonical:'/'+locale+'/docs/'+slug,languages:Object.fromEntries(LOCALES.map(language=>[language,'/'+language+'/docs/'+slug]))}};
}
export default async function Page({params}:{params:Promise<{locale:string;slug:string}>}) {
  const locale=await setLocaleFromParams(params); const {slug}=await params;
  if(!getDocsPages(locale).some(page=>page.slug===slug))notFound();
  const {docsContent}=await getDocsContent(locale); const Content=docsContent[slug as keyof typeof docsContent];
  return <Content components={{...docsComponents,a:DocsLink}} />;
}
