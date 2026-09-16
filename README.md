# SSCCS

The SSCCS home page: one document, static output, Astro. It carries the copy, the
structure, and the measurements of the page it replaced, and adds the interactive
figure.

## Run

```
npm install
npm run dev      # development server
npm run build    # static output in dist/
npm run preview  # serve the built output
npm run check    # astro check: types and diagnostics
```

## Layout

| | |
|---|---|
| `src/pages/index.astro` | the page, as an ordered list of sections |
| `src/components/` | one component per section, plus the figure |
| `src/components/Header.astro` | the navigation line above the title |
| `src/components/Intro.astro` | the title, the definition, and the figure |
| `src/components/Monument.astro` | the interactive scene and the code that drives it |
| `src/lib/monument.js` | the scene itself: the primitives of the model, as plotly traces |
| `src/components/Section.astro` | the shared section frame: an anchor, a heading, a slot |
| `src/layouts/Base.astro` | the document shell: the three landmarks, the fonts, the metadata, and the skip link |
| `src/styles/global.css` | the tokens, the reset, the base type, and the two shared primitives: the column and the definition list |
| `src/consts.ts` | the name, the description, the sections, and every link |
| `src/types/` | the one ambient declaration the untyped plotly bundle needs |
| `public/` | the mark, the favicon, the key, the headers, and the partner logos |

Component styles are scoped by Astro, so a rule lives in the `<style>` block of the
component that renders the element. The two exceptions are the elements more than one
component renders (the column and the definition list), which are in `global.css`, and
the note `Monument.astro` creates from its script, which no scope attribute reaches and
is therefore written as `:global(.monument__note)`.

The shell is `<header>`, `<main id="main" tabindex="-1">`, and `<footer>`. The skip
link targets the column, and `tabindex` is what moves the reading position with it.

## Design

The measurements are the ones the previous page was built with, because the
change is the framework rather than the design:

- one column, `min(1000px, max(800px, 60vw))`, 30px of padding, on white
- 15px body text at line-height 1.6, a 1.5rem title, 1.25rem section headings
- a centred navigation line at 0.85rem, a centred title with a 44px round mark
- black underlined links, one rule before the footer, a 0.85rem footer

Two things were added, both from the model itself: the six primitives as a
definition list in `The model`, and the machine-readable metadata in the head.
The opening block carries the scene behind it, anchored right and bleeding past
the window, at low opacity.

## Fonts

`astro.config.mjs` declares both families to Astro's Fonts API, which fetches the
woff2 files at build time, copies them into the output, and writes the `@font-face`
rules and the metric-adjusted fallbacks. Only the weights the page sets are
fetched: Archivo at 400 and 600, IBM Plex Mono at 400 and 500. `Base.astro` renders
the `<Font>` components, preloading the first one. The stylesheet reads the two
generated stacks through `var(--font-archivo)` and `var(--font-mono)`.

## The figure

`Monument.astro` loads plotly's gl3d bundle only when the figure is about to be
seen and only when the browser has WebGL, because that bundle is the largest
asset on the site. The scene is a JavaScript translation of the ontology in
`ssccs-primitives.dot`: Segments on the coordinate space, a Scheme binding them,
a Field raising a constraint potential, Observations collapsing into projections,
and Data as the shadow they cast. Its colours live in `src/lib/monument.js` and
belong to the drawing rather than to the page.

## Deploy

The site is on Cloudflare Pages as `ssccs-www`, served at `https://ssccs.org`.
The documentation site is a separate Pages project, `ssccs-docs`, served at
`https://docs.ssccs.org`.

`@astrojs/sitemap` writes `sitemap-index.xml` at build time, and `public/_headers`
sets the cache policy: hashed assets under `/_astro` are immutable, the HTML is
revalidated on every request.

`.github/workflows/deploy-cf-pages.yml` checks and builds on every pull request,
and deploys on every push to `main`. It needs two repository secrets on
`ssccsorg/ssccs-www`:

| Secret | |
|---|---|
| `CF_PAGES_DEPLOY` | a Cloudflare API token with the Account / Cloudflare Pages / Edit permission |
| `CF_ACCOUNT_ID` | the Cloudflare account ID |

For a local deploy, log Wrangler in and push the built output:

```
npm run build
npx wrangler@4 pages deploy dist --project-name=ssccs-www
```
