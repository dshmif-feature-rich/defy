import { readdir, readFile, stat } from 'node:fs/promises';
import { join } from 'node:path';

const dist = new URL('../dist', import.meta.url).pathname;
const requiredPages = [
  'index.html',
  'about-us/index.html',
  'meet-john/index.html',
  'aging/index.html',
  'cancer/index.html',
  'gravity/index.html',
  'services/index.html',
  'contact-us/index.html',
];
const legacyRedirects = [
  'about-us.html',
  'meet-john.html',
  'aging.html',
  'cancer.html',
  'gravity.html',
  'services.html',
  'contact-us.html',
];

let failures = 0;

async function checkExists(rel) {
  try {
    await stat(join(dist, rel));
    console.log(`✓ ${rel}`);
  } catch {
    console.error(`✗ missing ${rel}`);
    failures++;
  }
}

async function checkHtml(rel, checks) {
  const html = await readFile(join(dist, rel), 'utf8');
  for (const [label, pattern] of checks) {
    if (!pattern.test(html)) {
      console.error(`✗ ${rel}: ${label}`);
      failures++;
    } else {
      console.log(`✓ ${rel}: ${label}`);
    }
  }
}

console.log('=== Page files ===');
for (const page of requiredPages) await checkExists(page);

console.log('\n=== Legacy redirects ===');
for (const page of legacyRedirects) await checkExists(page);

console.log('\n=== SEO / assets ===');
await checkExists('sitemap-index.xml');
await checkExists('robots.txt');
await checkExists('CNAME');
await checkExists('og-image.png');

console.log('\n=== HTML checks ===');
const seoChecks = [
  ['meta description', /<meta name="description"/],
  ['canonical link', /<link rel="canonical"/],
  ['og:title', /<meta property="og:title"/],
  ['JSON-LD', /application\/ld\+json/],
];

for (const page of requiredPages) {
  await checkHtml(page, seoChecks);
}

const { stdout } = await import('node:child_process').then(({ execSync }) => ({
  stdout: execSync(`du -sh "${dist}"`, { encoding: 'utf8' }).trim(),
}));
console.log(`\n=== Dist size: ${stdout} ===`);

if (failures) {
  console.error(`\n${failures} check(s) failed`);
  process.exit(1);
}

console.log('\nAll preflight checks passed.');