// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

import sitemap from '@astrojs/sitemap';

// https://astro.build/config
// Support conditional base for GitHub Pages preview (e.g. /defy) vs. custom domain at root.
// Override via env for the /defy preview: BASE_PATH=/defy SITE_URL=https://dshmif-feature-rich.github.io/defy
// After custom domain cutover, omit the envs (or set BASE_PATH=/) so it defaults to root.
const site = process.env.SITE_URL || 'https://defyprs.com';
const base = process.env.BASE_PATH || '/';

export default defineConfig({
  site,
  base,
  output: 'static',

  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [sitemap()],
});