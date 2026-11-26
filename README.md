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
| `src/pages/index.astro` | the page, in reading order: the opening block, current work, projects, application domains, engagements, sponsorship, the depth group |
| `src/components/` | one component per section, plus the figure |
| `src/components/Header.astro` | the navigation line above the title |
| `src/components/Intro.astro` | the title, the definition, the control that opens the depth group, and the figure |
| `src/components/Monument.astro` | the interactive scene and the code that drives it |
| `src/lib/monument.js` | the scene itself: the primitives of the model, as plotly traces |
| `src/components/Section.astro` | the shared section frame: an anchor, a heading, a slot, and an inset mode for a section nested in a group |
| `src/components/Depth.astro` | the group fold holding the model, the architecture, and the design principles |
| `src/layouts/Base.astro` | the document shell: the three landmarks, the fonts, the metadata, and the skip link |
| `src/styles/global.css` | the tokens, the reset, the base type, and the two shared primitives: the column and the definition list |
| `src/consts.ts` | the name, the description, the sections, and every link |
| `src/types/` | the one ambient declaration the untyped plotly bundle needs |
| `scripts/og-card.mjs` | renders the social card from the scene's own geometry; `scripts/og-scene.mjs` holds that geometry |
| `public/` | the mark, the favicon, the social card, the key, the headers, and the partner logos |

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
- black underlined links, a rule before the footer, a 0.85rem footer

Two things were added, both from the model itself: the six primitives as a
definition list in `The model`, and the machine-readable metadata in the head.
The opening block carries the scene behind it, anchored right and bleeding past
the window, at low opacity.

The sections read in the order a visitor asks: what this is, what runs today,
where it applies, and how to take part. The sponsorship closes that order, and
the model, the architecture, and the design principles sit below it in one group
fold on a single header row, styled as a section like the others, which opens on
a height transition where the browser supports one and on the native instant
toggle elsewhere. Opening the group brings its header to the top of the viewport,
and an anchor that targets a section inside the group opens it and lands on that
section. The opening block leads with the definition, then one line at a lower
rank on what the stack is made of, then a control that opens the group below and
scrolls to it.

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

## The social card

`public/og.svg` is the image a link to the site carries: the name, the tagline, and
the landscape the opening block draws, in one card. `public/og.png` is the same
card at 1200 by 630, which is the size the head declares and the size a crawler
shows when it will not take an SVG. Both come from `scripts/og-card.mjs`, which
draws the card out of `scripts/og-scene.mjs`: the monument's sheet, projected with
the camera the page's scene opens on, moved back along its own line of sight, so
the sheet's relief, its spectrum, the lattice on it, the Scheme's relations, and
the observers' lines of sight all come from the scene's model rather than from the
card being drawn by hand.

The landscape is drawn whole: the sheet is framed inside the card, with a margin
above and a little air on each side, so no edge of it is cropped. The camera is the
page's own, lifted so the sheet is read as a surface rather than edge-on. The copy
sits below and to the left of the landscape, on a soft white veil risen out of that
corner, which keeps the type on the page's own paper without cutting the drawing.

| Part of the card | What is there |
|---|---|
| top and right | air, with the sheet's far ground a little inside the edge |
| centre | the field, its lattice, the Scheme's relations, and the observers |
| top left | the mark |
| bottom left | the name, under the veil, and the two lines of the tagline |

A `clipPath` cuts the lattice, the relations, and the observers at the sheet's own
box, so nothing is drawn past the field it belongs to. The sheet itself is drawn in
full, which is what keeps the composition balanced top to bottom.

```
node scripts/og-card.mjs > public/og.svg
rsvg-convert -w 1200 -h 630 -b white public/og.svg -o public/og.png
```

The type is Archivo at 600 and IBM Plex Mono, the page's own faces, resolved from
the machine that renders the PNG. The card's lines are text so the copy stays
selectable in the SVG, and the mark is `public/mark.svg` itself, so the two cannot
drift apart.

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
