// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

import sitemap from '@astrojs/sitemap';

// https://astro.build/config
// Custom domain (www.defyprs.com) serves at root. Override via env only if needed
// for a temporary GitHub Pages project-site preview: BASE_PATH=/defy SITE_URL=https://dshmif-feature-rich.github.io/defy
const site = process.env.SITE_URL || 'https://www.defyprs.com';
const base = process.env.BASE_PATH || '/';
const payPortalEnabled = process.env.PUBLIC_PAY_PORTAL_ENABLED === 'true';

export default defineConfig({
  site,
  base,
  output: 'static',

  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [
    sitemap({
      filter: (page) => {
        // Keep /pay out of the public sitemap until the portal is intentionally enabled
        if (!payPortalEnabled && (page.includes('/pay') || page.endsWith('/pay/'))) {
          return false;
        }
        return true;
      },
    }),
  ],
});