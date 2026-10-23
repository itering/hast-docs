import { strict as assert } from 'node:assert';
import { execFileSync } from 'node:child_process';
import { readdir, readFile, writeFile } from 'node:fs/promises';

const origin = new URL(process.env.NEXT_PUBLIC_DOCS_URL ?? 'http://localhost:3219').origin;
const urls: string[] = [];
for (const locale of ['en', 'ja', 'zh-CN']) {
  const source = (await readdir(`content/docs/${locale}`)).filter(name => name.endsWith('.mdx'));
  for (const file of source) {
    const slug = file.slice(0, -4);
    const route = `/${locale}/docs/${slug}`;
    const html = await readFile(`out${route}.html`, 'utf8');
    assert(html.includes(`lang="${locale}"`), `Missing document language: ${route}`);
    assert(html.includes('<h1'), `Missing rendered content: ${route}`);
    urls.push(`${origin}${route}`);
  }
}
await writeFile('out/sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.map(url => `<url><loc>${url}</loc></url>`).join('')}</urlset>\n`);
await writeFile('out/robots.txt', 'User-agent: *\nDisallow: /\n');
await writeFile('out/index.html', '<!doctype html><html lang="en"><meta charset="utf-8"><meta name="robots" content="noindex,nofollow"><meta http-equiv="refresh" content="0;url=/en/docs/overview"><title>Hast Docs</title><a href="/en/docs/overview">Read Hast Docs</a></html>\n');
const source = process.env.GITHUB_SHA ?? execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
await writeFile('out/release.json', JSON.stringify({ source, environment: 'staging', pages: urls.length, languages: ['en','ja','zh-CN'] }) + '\n');
console.log(`Verified ${urls.length} exported documentation pages; wrote staging metadata.`);
