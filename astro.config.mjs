// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// ssccs.org is served by the Cloudflare Pages project ssccs-www. The canonical
// origin is set so Astro can emit absolute URLs for the sitemap and for the
// social metadata.
export default defineConfig({
  site: 'https://ssccs.org',

  integrations: [sitemap()],

  // The Fonts API fetches the faces from the provider at build time, copies the
  // woff2 files into the output, and writes both the @font-face rules and the
  // metric-adjusted fallbacks. Only the two weights the page sets are fetched, and
  // the first one is preloaded from the document head.
  fonts: [
    {
      provider: fontProviders.fontsource(),
      name: 'Archivo',
      cssVariable: '--font-archivo',
      weights: [400, 600],
      styles: ['normal'],
      subsets: ['latin'],
      fallbacks: ['ui-sans-serif', 'system-ui', 'sans-serif'],
    },
    {
      provider: fontProviders.fontsource(),
      name: 'IBM Plex Mono',
      cssVariable: '--font-mono',
      weights: [400, 500],
      styles: ['normal'],
      subsets: ['latin'],
      fallbacks: ['ui-monospace', 'monospace'],
    },
  ],

  vite: {
    build: {
      // The monument is a single scene, so it is one chunk: plotly's gl3d bundle
      // measures about 1.6 MB, and it is fetched only when the figure is about to
      // be seen. It is delivered on demand and never blocks the first paint, so
      // the warning threshold names that size rather than the default 500 kB.
      chunkSizeWarningLimit: 2000,
    },
  },
});
