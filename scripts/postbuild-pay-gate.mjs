/**
 * Strip /pay from the static build unless PUBLIC_PAY_PORTAL_ENABLED=true.
 * Nav/sitemap are gated separately; this prevents the HTML from shipping at all.
 */
import { rm } from 'node:fs/promises';
import { join } from 'node:path';

const enabled = process.env.PUBLIC_PAY_PORTAL_ENABLED === 'true';
const dist = new URL('../dist', import.meta.url).pathname;

if (enabled) {
  console.log('pay-portal: enabled — keeping dist/pay');
  process.exit(0);
}

const payDir = join(dist, 'pay');
try {
  await rm(payDir, { recursive: true, force: true });
  console.log('pay-portal: disabled — removed dist/pay from build output');
} catch (err) {
  console.warn('pay-portal: could not remove dist/pay', err);
  process.exit(1);
}
