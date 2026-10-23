import React from "react";
import { afterAll, describe, expect, it, vi } from "vitest";
import { LOCALES } from "../../i18n/config";
import { docsPages, getDocsPages } from "./catalogue";
import { docsRedirects } from "./redirects";

vi.mock("@/i18n/locale-param", () => ({
  setLocaleFromParams: async (params: Promise<{ locale: string }>) => (await params).locale,
}));
vi.mock("next/navigation", () => ({
  notFound: () => { throw new Error("not-found"); },
  redirect: (url: string) => { throw new Error(`redirect:${url}`); },
}));
vi.mock("@/i18n/config", () => import("../../i18n/config"));
vi.mock("@/content/docs/catalogue", () => import("./catalogue"));
vi.mock("@/content/docs/redirects", () => import("./redirects"));
vi.mock("@hast/docs", () => ({ docsComponents: {} }));
vi.mock("@/components/docs/docs-link", () => import("../../components/docs/docs-link"));
const contentLoader = vi.fn(async (locale: string) => ({ locale, docsContent: { overview: () => null } }));
vi.mock("@/content/docs/content", () => ({ getDocsContent: (locale: string) => contentLoader(locale) }));

import DocsPage, { generateStaticParams, generateMetadata } from "../../../app/[locale]/docs/[slug]/page";
import hosting from "../../../vercel.json";

vi.stubGlobal("React", React);
afterAll(() => vi.unstubAllGlobals());

describe("localized documentation routes", () => {
  it("prerenders every published page in all supported languages", () => {
    const params = generateStaticParams();
    for (const locale of LOCALES) {
      for (const { slug } of docsPages) expect(params).toContainEqual({ locale, slug });
    }
  });

  it.each(LOCALES)("keeps %s for content, redirects, and metadata", async (locale) => {
    const params = Promise.resolve({ locale, slug: "overview" });
    await DocsPage({ params });
    expect(contentLoader).toHaveBeenLastCalledWith(locale);
    const metadata = await generateMetadata({ params });
    expect(metadata.title).toBe(`${getDocsPages(locale)[0].title} | Hast Docs`);
    expect(metadata.alternates?.canonical).toBe(`/${locale}/docs/overview`);
    expect(Object.keys(metadata.alternates?.languages ?? {}).sort()).toEqual([...LOCALES].sort());
  });

  it("rejects unknown pages", async () => {
    await expect(DocsPage({ params: Promise.resolve({ locale: "en", slug: "missing" }) })).rejects.toThrow("not-found");
  });

  it.each(LOCALES)("preserves %s legacy API links in hosting redirects", async (locale) => {
    for (const [slug, destination] of Object.entries(docsRedirects)) {
      expect(docsPages.some((page) => page.slug === destination.split("#")[0])).toBe(true);
      expect(hosting.redirects).toContainEqual({
        source: `/:locale(en|ja|zh-CN)/docs/${slug}`,
        destination: `/:locale/docs/${destination}`,
        permanent: true,
      });
    }
  });
});
