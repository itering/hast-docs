import { strict as assert } from 'node:assert';
import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';

const locales = ['en', 'ja', 'zh-CN'];
const baseline = (await readdir('content/docs/en')).filter(name => name.endsWith('.mdx')).sort();
assert(baseline.length > 0, 'Documentation must include product pages');
const forbidden = /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----|\b(?:gh[pousr]_[A-Za-z0-9]{30,}|github_pat_[A-Za-z0-9_]{30,}|xox[baps]-[A-Za-z0-9-]{20,}|hook_[a-f0-9]{40,})|\/Users\/[^\s]+/;
for (const locale of locales) {
  const directory = `content/docs/${locale}`;
  const files = (await readdir(directory)).filter(name => name.endsWith('.mdx')).sort();
  assert.deepEqual(files, baseline, `Page coverage differs for ${locale}`);
  for (const file of files) {
    const body = await readFile(join(directory, file), 'utf8');
    assert(!forbidden.test(body), `Private material in ${locale}/${file}`);
    assert(!body.includes('openwiki/') && !body.includes('github.com/itering/hast-mono/blob/'), `Private source link in ${locale}/${file}`);
    for (const match of body.matchAll(/(?:src=|\]\()"?(\/docs\/[^"\s)]+)/g)) {
      await readFile(join('public', match[1]));
    }
  }
}
console.log(`Checked ${baseline.length * locales.length} pages in ${locales.length} languages and their image references.`);
