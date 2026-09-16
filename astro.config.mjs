// @ts-check
import { defineConfig } from 'astro/config';

// ssccs.org is served by the Cloudflare Pages project ssccs-www. The canonical
// origin is set so Astro can emit absolute URLs for the social metadata.
export default defineConfig({
  site: 'https://ssccs.org',
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
