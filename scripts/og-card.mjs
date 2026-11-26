// Draws the og card as SVG. The scene comes from og-scene.mjs, the mark from
// public/mark.svg, the type from the page's own faces.
//   node scripts/og-card.mjs > public/og.svg
//   rsvg-convert -w 1200 -h 630 -b white public/og.svg -o public/og.png
import { readFileSync } from 'node:fs';

const scene = process.env.OG_SCENE ? `./.tmp/${process.env.OG_SCENE}.mjs` : './og-scene.mjs';
const { og, schema } = await import(scene);

const { W, H, cells, far, latticed, schemed, observers } = og;

// The mark's own transform is kept: its paths are drawn in a 920-unit frame that
// the <g> around them scales and flips, and without that <g> they draw at a
// hundred times their size.
const mark = readFileSync(new URL('../public/mark.svg', import.meta.url), 'utf8');
const markGroup = mark
  .replace(/^[\s\S]*?(<g[^>]*>)/, '$1')
  .replace(/<\/g>[\s\S]*$/, '</g>')
  .replace(/\s+/g, ' ')
  .trim();

const ink = {
  lattice: '#b9bfc3',
  relation: '#8f979d',
  lift: 'rgba(192, 139, 42, .8)',
  through: 'rgba(198, 184, 150, .95)',
  meet: '#98a0a5',
  data: '#7d8489',
  swarm: '#c08b2a',
};

// The sheet first: one path of cells per tone, far to near, so a cell in front
// covers the one behind it and the sheet reads as one surface rather than a grid.
const byTone = new Map();
for (const cell of cells.slice().sort(far)) {
  if (!byTone.has(cell.fill)) byTone.set(cell.fill, []);
  byTone.get(cell.fill).push(cell.d);
}
const sheet = [...byTone]
  .map(([tone, paths]) => `<path d="${paths.join('')}" fill="${tone}" stroke="${tone}" stroke-width="0.8"/>`)
  .join('');

const asPath = (piece) => `<path d="${piece.d}" stroke="${piece.color}" stroke-width="${piece.width}"/>`;

// What stands over the sheet, far to near, so a hill hides what stands behind it.
const over = [
  // The relations lie on the sheet and stay exempt from the depth sort: a layout
  // is one object, and cutting it at every rise loses the run it describes.
  ...schemed.map((line) => ({ ...line, width: 2.4, color: ink.relation, exempt: true })),
  ...observers.flatMap((observer) => [
    ...observer.sights.map((sight) => ({
      depth: sight.depth,
      svg: `<path d="M${observer.place[0].toFixed(1)},${observer.place[1].toFixed(1)}L${sight.meet[0].toFixed(1)},${sight.meet[1].toFixed(1)}" stroke="${ink.lift}" stroke-width="1.4"/><path d="M${sight.meet[0].toFixed(1)},${sight.meet[1].toFixed(1)}L${sight.land[0].toFixed(1)},${sight.land[1].toFixed(1)}" stroke="${ink.through}" stroke-width="1.2"/><circle cx="${sight.meet[0].toFixed(1)}" cy="${sight.meet[1].toFixed(1)}" r="4.8" fill="#ffffff" stroke="${ink.meet}" stroke-width="1.1"/><circle cx="${sight.land[0].toFixed(1)}" cy="${sight.land[1].toFixed(1)}" r="2.8" fill="${ink.data}"/>`,
    })),
    {
      depth: observer.depth,
      svg: `<path d="M${(observer.place[0] - 5.5).toFixed(1)},${observer.place[1].toFixed(1)}L${observer.place[0].toFixed(1)},${(observer.place[1] - 9).toFixed(1)}L${(observer.place[0] + 5.5).toFixed(1)},${observer.place[1].toFixed(1)}L${observer.place[0].toFixed(1)},${(observer.place[1] + 9).toFixed(1)}Z" fill="${ink.swarm}"/>`,
    },
  ]),
];
const flat = over.filter((piece) => piece.exempt);
const sorted = over.filter((piece) => !piece.exempt).sort(far);

// The lattice is the subtlest line and it sits on the sheet, so it is drawn once,
// whole: cutting it at every rise would break it into dashes. What stands above
// the sheet is clipped to the field it belongs to.
const plate = `<path d="${latticed.map((line) => line.d).join('')}" stroke="${ink.lattice}" stroke-width="1"/>
      <g fill="none" stroke-linecap="round">${sorted.map((piece) => (piece.svg ? piece.svg : asPath(piece))).join('')}</g>
      <g fill="none" stroke-linecap="round">${flat.map(asPath).join('')}</g>`;

// The veil is the paper the copy reads against: a soft white risen out of the
// corner the type sits in. The sheet is framed whole inside the card, so the veil
// is there for contrast rather than to hide a crop.

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-labelledby="og-title og-desc">
  <defs>
    <clipPath id="sheet"><rect x="${schema.x.toFixed(0)}" y="${schema.y.toFixed(0)}" width="${schema.width.toFixed(0)}" height="${schema.height.toFixed(0)}"/></clipPath>
    <radialGradient id="veil" gradientUnits="userSpaceOnUse" cx="250" cy="430" r="430">
      <stop offset="0" stop-color="#ffffff" stop-opacity="0.88"/>
      <stop offset="0.6" stop-color="#ffffff" stop-opacity="0.62"/>
      <stop offset="1" stop-color="#ffffff" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <title id="og-title">SSCCS: Schema-Segment Composition Computing System</title>
  <desc id="og-desc">The model as one landscape: immutable segments on a coordinate space, a scheme binding them into a layout, a field raising a constraint potential, observers whose lines of sight are transmitted through the structure, and the state they record.</desc>
  <g id="scene" fill="none" stroke-linejoin="round">
    ${sheet}
  </g>
  <g clip-path="url(#sheet)" fill="none" stroke-linejoin="round" stroke-linecap="round">
    ${plate}
  </g>
  <rect width="${W}" height="${H}" fill="url(#veil)"/>
  <g id="mark" transform="translate(56 44) scale(${(116 / 949.8).toFixed(5)})" fill="#000000" stroke="none">${markGroup}</g>
  <text x="54" y="500" font-family="Archivo SemiBold, Archivo, Helvetica, Arial, sans-serif" font-size="126" font-weight="600" letter-spacing="-3">SSCCS</text>
  <text x="56" y="552" font-family="IBM Plex Mono, Menlo, monospace" font-size="22" fill="#333333">Schema-Segment Composition Computing System</text>
  <text x="56" y="584" font-family="IBM Plex Mono, Menlo, monospace" font-size="22" fill="#444444">Computation as the observation of deterministic structure</text>
</svg>`;

process.stdout.write(svg);
