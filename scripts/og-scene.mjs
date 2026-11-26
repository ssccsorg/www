// The geometry of the og card: the monument's sheet, its lattice, a Scheme of
// relations, and observers whose lines of sight the sheet transmits. The
// projection is the camera the page's scene opens on, moved back along its own
// line of sight so the card and the page light the same field.
export const W = 1200;
export const H = 630;

const SHEET = 5.25;
const S = 800; // focal units per card pixel

// The Field's potential: the relief of the page's sheet, unchanged.
function relief(x, y) {
  return (
    0.30 * Math.sin(0.55 * x + 0.3 * y) +
    0.2 * Math.cos(0.4 * y - 0.25 * x) +
    0.14 * Math.sin(0.95 * x - 0.7 * y + 1.1) +
    0.09 * Math.cos(1.45 * x + 1.1 * y) +
    0.05 * Math.sin(2.1 * x - 1.7 * y) +
    0.28 * Math.exp(-((x + 2.2) ** 2 + (y - 1.8) ** 2) / 3.2) -
    0.34 * Math.exp(-((x - 2.4) ** 2 + (y + 1.9) ** 2) / 3.2)
  );
}
const ground = (x, y) => 1 + relief(x, y);

const declared = { x: 1.061, y: -1.265, z: 0.38 };
const k = 7.0;
// The card lifts the camera the page's scene defines, so the sheet is read from
// above rather than edge-on.
const PITCH = 0.75;
const world = { x: declared.x * k, y: declared.y * k, z: (declared.z + PITCH) * k };
const center = { x: 0, y: 0, z: -0.18 };
const f = { x: center.x - world.x, y: center.y - world.y, z: center.z - world.z };
const fl = Math.hypot(f.x, f.y, f.z);
const fw = { x: f.x / fl, y: f.y / fl, z: f.z / fl };
let right = { x: -fw.y, y: fw.x, z: 0 };
const rl = Math.hypot(right.x, right.y);
right = { x: right.x / rl, y: right.y / rl, z: 0 };
const up = {
  x: fw.y * right.z - fw.z * right.y,
  y: fw.z * right.x - fw.x * right.z,
  z: fw.x * right.y - fw.y * right.x,
};

const screen = (x, y, z) => {
  const d = { x: x - world.x, y: y - world.y, z: z - world.z };
  const depth = Math.abs(d.x * fw.x + d.y * fw.y + d.z * fw.z);
  return {
    sx: (d.x * right.x + d.y * right.y + d.z * right.z) / depth,
    sy: (d.x * up.x + d.y * up.y + d.z * up.z) / depth,
    depth,
  };
};
const onGround = (x, y) => screen(x, y, ground(x, y));

// The origin places the sheet's centre at half the card's width and rather above
// half its height, so the whole sheet sits inside the card with the type below it
// and a margin above. The landscape is framed, not cropped: no edge is lost.
let minx = Infinity, maxx = -Infinity, miny = Infinity, maxy = -Infinity;
const N = 48;
for (let i = 0; i <= N; i += 1) {
  for (let j = 0; j <= N; j += 1) {
    const q = onGround(-SHEET + (2 * SHEET * i) / N, -SHEET + (2 * SHEET * j) / N);
    minx = Math.min(minx, q.sx); maxx = Math.max(maxx, q.sx);
    miny = Math.min(miny, q.sy); maxy = Math.max(maxy, q.sy);
  }
}

const ox = 0.53 * W - ((minx + maxx) / 2) * S;
const oy = 0.515 * H + ((miny + maxy) / 2) * S;

function project(x, y, z) {
  const q = screen(x, y, z);
  return [ox + q.sx * S, oy - q.sy * S, q.depth];
}
const groundPoint = (x, y) => project(x, y, ground(x, y));

// The sheet's band: the page's spectrum, low ground towards the water end and
// high ground towards the gold, held light enough that the type over it stays
// the page's black.
const STOPS = 18;
const TONES = Array.from({ length: STOPS }, (_, i) => {
  const t = i / (STOPS - 1);
  const hue = (196 + (88 - 196) * (0.4 * t + 0.6 * t * t)).toFixed(0);
  const sat = (40 + 34 * Math.pow(t, 1.2)).toFixed(0);
  const light = (94 - 12 * t).toFixed(0);
  return `hsl(${hue} ${sat}% ${light}%)`;
});

function tone(x, y) {
  const t = Math.min(1, Math.max(0, (ground(x, y) - 0.31) / (1.73 - 0.31)));
  const slope = (relief(x + 0.12, y) - relief(x - 0.12, y)) / 0.24;
  const k = Math.round(t * (STOPS - 1) + 0.8 * Math.max(-1, Math.min(1, slope)) * (STOPS - 1) * 0.14);
  return TONES[Math.min(STOPS - 1, Math.max(0, k))];
}

const CELLS = 40;
const cells = [];
for (let i = 0; i < CELLS; i += 1) {
  for (let j = 0; j < CELLS; j += 1) {
    const x0 = -SHEET + (2 * SHEET * i) / CELLS;
    const y0 = -SHEET + (2 * SHEET * j) / CELLS;
    const step = (2 * SHEET) / CELLS;
    const corners = [[0, 0], [1, 0], [1, 1], [0, 1]].map(([dx, dy]) => {
      const p = groundPoint(x0 + dx * step, y0 + dy * step);
      return `${p[0].toFixed(0)},${p[1].toFixed(0)}`;
    });
    const centre = groundPoint(x0 + step / 2, y0 + step / 2);
    cells.push({ d: `M${corners.join('L')}Z`, fill: tone(x0 + step / 2, y0 + step / 2), depth: centre[2] });
  }
}

const boundary = [[-SHEET, -SHEET], [SHEET, -SHEET], [SHEET, SHEET], [-SHEET, SHEET]]
  .map(([x, y]) => groundPoint(x, y).slice(0, 2))
  .map((p) => p.map((v) => v.toFixed(1)).join(','))
  .join('L');
const boundaryPath = `M${boundary}Z`;

// A run of ground, sampled so it follows the relief. The sheet's own edges cut it:
// a field has no scene beyond its domain.
const LIFT = 7; // what a relation stands proud of the sheet, in card pixels
function sample(points, every, lift = 0) {
  const out = [];
  for (let k = 0; k < points.length - 1; k += 1) {
    const [x0, y0] = points[k];
    const [x1, y1] = points[k + 1];
    const steps = Math.max(2, Math.ceil(Math.hypot(x1 - x0, y1 - y0) / every));
    for (let s = k === 0 ? 0 : 1; s <= steps; s += 1) {
      const x = Math.max(-SHEET, Math.min(SHEET, x0 + ((x1 - x0) * s) / steps));
      const y = Math.max(-SHEET, Math.min(SHEET, y0 + ((y1 - y0) * s) / steps));
      const p = groundPoint(x, y);
      out.push([p[0], p[1] - lift, p[2]]);
    }
  }
  return out;
}

// Short runs that share a depth, so the scene can be drawn far to near.
function strokes(points) {
  const out = [];
  for (let k = 0; k < points.length - 1; k += 1) {
    const [a, b] = [points[k], points[k + 1]];
    out.push({
      d: `M${a[0].toFixed(0)},${a[1].toFixed(0)}L${b[0].toFixed(0)},${b[1].toFixed(0)}`,
      depth: (a[2] + b[2]) / 2,
    });
  }
  return out;
}

// Segments sit on the coordinate lattice, which is the space's own step. The
// lattice follows the sheet, so no line leaves the field it belongs to.
const latticeEdge = SHEET;
const lattice = [];
for (let v = -latticeEdge; v <= latticeEdge + 1e-6; v += 1.5) {
  lattice.push(sample([[-latticeEdge, v], [latticeEdge, v]], 0.5));
  lattice.push(sample([[v, -latticeEdge], [v, latticeEdge]], 0.5));
}
const latticed = lattice.flatMap(strokes);

// The Scheme: relations that bind coordinates into a layout.
const RELATIONS = [
  [[-4.5, -3.0], [-1.5, -4.5], [1.5, -3.0]],
  [[1.5, -3.0], [4.5, -1.5], [3.0, 1.5]],
  [[-4.5, 3.0], [-1.5, 1.5], [0.0, -1.5], [3.0, 1.5]],
];
const schemed = RELATIONS.flatMap((relation) => strokes(sample(relation, 0.3, LIFT)));

const far = (a, b) => b.depth - a.depth;

// Observers: a place over the sheet, and lines of sight that meet it and are
// carried on, downward, to where each one lands as state.
function sequence(seed) {
  let state = seed >>> 0;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 4294967296;
  };
}
const next = sequence(20261126);
const observers = [];
for (const home of [[-2.2, 2.8], [-0.2, 3.3], [1.8, 3.0], [3.6, 2.2], [2.6, 0.4], [-1.6, 0.8]]) {
  const x = home[0] + (next() - 0.5) * 0.7;
  const y = home[1] + (next() - 0.5) * 0.7;
  const place = project(x, y, ground(x, y) + 0.45 + next() * 0.25);
  const sights = [];
  for (let s = 0; s < 3; s += 1) {
    const tx = Math.max(-SHEET, Math.min(SHEET, x + (next() - 0.5) * 3.4));
    const ty = Math.max(-SHEET, Math.min(SHEET, y + (next() - 0.5) * 3.4));
    const meet = groundPoint(tx, ty);
    const dx = meet[0] - place[0];
    const dy = meet[1] - place[1];
    const length = Math.hypot(dx, dy) || 1;
    const land = [meet[0] + (dx / length) * 44, meet[1] + (dy / length) * 44 + 16, meet[2]];
    sights.push({ meet, land, depth: meet[2] });
  }
  observers.push({ place, sights, depth: place[2] });
}

// The card's box around the sheet, for the marks it carries.
const corners = [[-SHEET, -SHEET], [SHEET, -SHEET], [SHEET, SHEET], [-SHEET, SHEET]].map(([x, y]) => groundPoint(x, y));
const xs = corners.map((p) => p[0]);
const ys = corners.map((p) => p[1]);
export const schema = {
  x: Math.min(...xs),
  y: Math.min(...ys),
  width: Math.max(...xs) - Math.min(...xs),
  height: Math.max(...ys) - Math.min(...ys),
};

export const og = { W, H, cells, boundaryPath, far, latticed, schemed, observers };

