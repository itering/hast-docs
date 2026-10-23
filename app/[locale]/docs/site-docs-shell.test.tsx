// @vitest-environment jsdom
import type { ReactNode } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LOCALES } from '@/i18n/config';
import { SiteDocsShell } from './site-docs-shell';

const route = vi.hoisted(() => ({ slug: 'overview' }));
vi.mock('next/navigation', () => ({ useSelectedLayoutSegment: () => route.slug }));
vi.mock('@hast/docs', () => ({
  DocsShell: ({ children, headerExtras }: { children: ReactNode; headerExtras: ReactNode }) => (
    <><header className="docs-header">{headerExtras}</header>{children}</>
  ),
}));
afterEach(cleanup);

const labels = { en: 'English', ja: '日本語', 'zh-CN': '简体中文' };
describe('documentation language menu', () => {
  for (const locale of LOCALES) {
    for (const slug of ['overview', 'aip-api-reference']) {
      it(`keeps ${locale}/${slug} language choices outside header nav rules`, async () => {
        route.slug = slug;
        const user = userEvent.setup();
        render(<SiteDocsShell locale={locale} pages={[{ slug, title: 'Docs', description: '', group: 'Docs', toc: [] }]} searchIndexUrl="/docs-search/index.json">Content</SiteDocsShell>);
        const summary = screen.getByText(labels[locale], { selector: 'summary' });
        await user.click(summary);
        expect(summary.closest('details')?.open).toBe(true);
        const menu = screen.getByRole('navigation', { name: 'Language' });
        // The narrow-screen stylesheet hides .docs-header nav with !important.
        // Check selector isolation here; real browser layout acceptance is separate.
        expect(menu.matches('.docs-header nav')).toBe(false);
        expect(menu.classList.contains('docs-language-menu')).toBe(true);
        for (const language of LOCALES) {
          const link = within(menu).getByRole('link', { name: labels[language] });
          expect(link.getAttribute('href')).toBe(`/${language}/docs/${slug}`);
          expect(link.getAttribute('hreflang')).toBe(language);
          expect(link.getAttribute('aria-current')).toBe(language === locale ? 'true' : null);
        }
      });
    }
  }
});
