// Builds the three-dimensional scene behind the opening block of the homepage.
//
// The scene is the model drawn as a landscape rather than as a figure. The
// coordinate space fills the frame and bleeds off its edges, the axes carry no
// grid, ticks or box, and nothing in the scene is dark enough to compete with
// the text that passes in front of it.
//
//   Segments S = (c, id) are the nodes of the coordinate space. Each node is
//   immutable, and its address is its own coordinate rather than a hash. The
//   space is not a plane: it holds the three spatial axes and time among its
//   coordinates, so the lattice is a volume. A Scheme Sigma = (A, R, L, O)
//   binds some of those nodes into a layout, drawn as relations across the
//   ground. A Field F = (C, T) raises a constraint potential over the whole
//   space, and its level C(s) bounds the admissible set A(Sigma, F), drawn as
//   the boundary of the region where the constraint holds. Observations Omega
//   are a swarm: many viewpoints over one structure, each at its own height and
//   its own line of sight. Each collapses to an ephemeral Projection
//   P = Omega(Sigma, F), and Data D = I(P) is what that collapse records, on a
//   coordinate, because the coordinate is the address.

const SIZE = 6; // the coordinate space runs from -SIZE to SIZE on both ground axes
const STEP = 1.5; // spacing of the coordinate lattice
const LAYERS = 3; // the lattice is a volume: the space has more than two axes
const FIELD_N = 80; // resolution of the potential sheet
const SHEET = 5.25; // the sheet is inset from the lattice, so the volume shows around it
const BASE = 1.0; // mean height of the potential sheet
const SINK = 0.02; // lattice work sits this far proud of the sheet, so it reads as on it
const ADMISSIBLE = 0.9; // constraint threshold C(s), the level the admissible set is bounded at
const GROUND_Z = 0; // the level a transmitted line lands on: state, and the data it leaves
const REFRACTION = 1.5; // what the structure does to a line of sight that enters it
const OBSERVER_COUNT = 14; // observers over the structure
const REACH = 4.2; // how far across the structure one observer looks

const INK = {
  coordinate: "#b3b9bd",
  relation: "#9aa1a6",
  observation: "#c08b2a",
  collapse: "#d8b46a",
  through: "#c3b28a",
  projection: "#ffffff",
  projectionRing: "#98a0a5",
  data: "#7d8489",
};

// The sheet takes a real spectrum: the hue runs with the height of the ground,
// and the colours are made at a lightness that keeps the body text clear rather
// than being diluted towards white. Nothing here is a tint of a darker colour.
//
// The band sits between 68 and 74 percent lightness at 48 to 64 percent
// saturation, which measures 10:1 to 16:1 against a black glyph, so the sheet
// can be fully opaque and still let the reading column through.
const SPECTRUM_BAND = [
  { at: 0.0, hue: 200, sat: 52, light: 70 }, // low ground, the water end
  { at: 0.3, hue: 158, sat: 48, light: 68 },
  { at: 0.6, hue: 104, sat: 52, light: 70 },
  { at: 1.0, hue: 52, sat: 64, light: 74 }, // high ground, the gold end
];

const STOPS = 12;
const DRIFT_TURN = 24; // how far the spectrum turns over one drift cycle, in degrees

function hslToRgb(hue, sat, light) {
  const h = ((hue % 360) + 360) % 360;
  const s = sat / 100;
  const l = light / 100;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let rgb;
  if (h < 60) {
    rgb = [c, x, 0];
  } else if (h < 120) {
    rgb = [x, c, 0];
  } else if (h < 180) {
    rgb = [0, c, x];
  } else if (h < 240) {
    rgb = [0, x, c];
  } else if (h < 300) {
    rgb = [x, 0, c];
  } else {
    rgb = [c, 0, x];
  }
  return rgb.map((v) => Math.round((v + m) * 255));
}

function bandAt(t) {
  const clamped = Math.min(1, Math.max(0, t));
  for (let i = 1; i < SPECTRUM_BAND.length; i += 1) {
    if (clamped <= SPECTRUM_BAND[i].at || i === SPECTRUM_BAND.length - 1) {
      const from = SPECTRUM_BAND[i - 1];
      const to = SPECTRUM_BAND[i];
      const local = (clamped - from.at) / (to.at - from.at || 1);
      return {
        hue: from.hue + (to.hue - from.hue) * local,
        sat: from.sat + (to.sat - from.sat) * local,
        light: from.light + (to.light - from.light) * local,
      };
    }
  }
  return SPECTRUM_BAND[SPECTRUM_BAND.length - 1];
}

// The spectrum at a point of the drift. The band turns as a whole, so every
// phase of the drift is made of the same kind of colour: the sheet never fades
// towards white and never needs to be translucent.
export function spectrum(drift) {
  const turn = DRIFT_TURN * Math.sin(2 * Math.PI * drift);
  const stops = [];
  for (let i = 0; i < STOPS; i += 1) {
    const t = i / (STOPS - 1);
    const band = bandAt(t);
    const rgb = hslToRgb(band.hue + turn, band.sat, band.light);
    stops.push([t, `rgb(${rgb[0]},${rgb[1]},${rgb[2]})`]);
  }
  return stops;
}

// Constraint potential raised by the Field: the sum of a few harmonics with two
// basins. It gives the sheet its relief, and the level C(s) bounds the region
// the constraint admits.
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

function ground(x, y) {
  return BASE + relief(x, y);
}

function linspace(lo, hi, n) {
  const out = [];
  const step = (hi - lo) / (n - 1);
  for (let i = 0; i < n; i += 1) {
    out.push(lo + i * step);
  }
  return out;
}

// Plotly surface grids: each row is one constant-y slice.
function sheetGrid(n) {
  const xs = linspace(-SHEET, SHEET, n);
  const x = [];
  const y = [];
  const z = [];
  for (const yi of xs) {
    x.push(xs);
    y.push(xs.map(() => yi));
    z.push(xs.map((xi) => ground(xi, yi)));
  }
  return { x, y, z };
}

const COORDS = linspace(-SIZE, SIZE, Math.round((2 * SIZE) / STEP) + 1);

// The coordinate space as a volume: the lattice is a plane per layer, and time
// is one of the coordinates the layers are laid out along.
function latticeNodes() {
  const out = [];
  const layers = linspace(GROUND_Z + 0.15, BASE + 0.65, LAYERS);
  for (const z of layers) {
    for (const yi of COORDS) {
      for (const xi of COORDS) {
        out.push({ x: xi, y: yi, z });
      }
    }
  }
  return out;
}

// Relations of the Scheme: each one binds a run of coordinates into a layout.
const RELATIONS = [
  [
    [-4.5, -3.0],
    [-1.5, -4.5],
    [1.5, -3.0],
  ],
  [
    [1.5, -3.0],
    [4.5, -1.5],
    [3.0, 1.5],
  ],
  [
    [-4.5, 3.0],
    [-1.5, 1.5],
    [0.0, -1.5],
    [3.0, 1.5],
  ],
];

// A deterministic sequence, so the swarm is the same on every render.
function sequence(seed) {
  let state = seed >>> 0;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

// The normal of the structure at a coordinate, by central differences.
function surfaceNormal(x, y) {
  const e = 0.05;
  const dzdx = (ground(x + e, y) - ground(x - e, y)) / (2 * e);
  const dzdy = (ground(x, y + e) - ground(x, y - e)) / (2 * e);
  const length = Math.hypot(dzdx, dzdy, 1);
  return { x: -dzdx / length, y: -dzdy / length, z: 1 / length };
}

// What the structure does to a line of sight that enters it. A line entering a
// denser medium bends towards the normal, so the ratio is the inverse of the
// index the medium presents, and the angle the line arrives at is what decides
// where it comes out.
function transmit(v, n, index) {
  const eta = 1 / index;
  const cosI = -(v.x * n.x + v.y * n.y + v.z * n.z);
  const sin2T = eta * eta * (1 - cosI * cosI);
  if (sin2T > 1) {
    return null;
  }
  const cosT = Math.sqrt(1 - sin2T);
  return {
    x: eta * v.x + (eta * cosI - cosT) * n.x,
    y: eta * v.y + (eta * cosI - cosT) * n.y,
    z: eta * v.z + (eta * cosI - cosT) * n.z,
  };
}

// Where a line of sight from an observer first meets the structure, or null if
// it passes the sheet by. The meeting is bracketed and then bisected, so it
// sits on the sheet rather than near it.
function firstMeeting(origin, aim) {
  const span = { x: aim.x - origin.x, y: aim.y - origin.y, z: aim.z - origin.z };
  const length = Math.hypot(span.x, span.y, span.z);
  const dir = { x: span.x / length, y: span.y / length, z: span.z / length };
  const above = (p) => p.z - ground(p.x, p.y); // positive over the sheet, negative under it
  const steps = 240;
  let previous = origin;
  let previousAbove = above(origin);
  for (let i = 1; i <= steps; i += 1) {
    const t = (length * i) / steps;
    const point = { x: origin.x + dir.x * t, y: origin.y + dir.y * t, z: origin.z + dir.z * t };
    if (Math.abs(point.x) > SHEET || Math.abs(point.y) > SHEET) {
      return null;
    }
    if (previousAbove > 0 && above(point) <= 0) {
      let lo = 0;
      let hi = 1;
      for (let s = 0; s < 20; s += 1) {
        const mid = (lo + hi) / 2;
        const probe = {
          x: previous.x + (point.x - previous.x) * mid,
          y: previous.y + (point.y - previous.y) * mid,
          z: previous.z + (point.z - previous.z) * mid,
        };
        if (above(probe) > 0) {
          lo = mid;
        } else {
          hi = mid;
        }
      }
      return {
        dir,
        meet: {
          x: previous.x + (point.x - previous.x) * hi,
          y: previous.y + (point.y - previous.y) * hi,
          z: previous.z + (point.z - previous.z) * hi,
        },
      };
    }
    previous = point;
    previousAbove = above(point);
  }
  return null;
}

// One line of sight. It arrives at the structure, is transmitted through it at
// the angle it arrived, and what comes out lands on the level below as state.
function sightLine(origin, target) {
  const aim = { x: target.x, y: target.y, z: ground(target.x, target.y) };
  const meeting = firstMeeting(origin, aim);
  if (!meeting) {
    return null;
  }
  const through = transmit(meeting.dir, surfaceNormal(meeting.meet.x, meeting.meet.y), REFRACTION);
  if (!through || through.z >= -1e-4) {
    return null;
  }
  const travel = (GROUND_Z - meeting.meet.z) / through.z;
  if (!(travel > 0)) {
    return null;
  }
  return {
    meet: meeting.meet,
    land: {
      x: meeting.meet.x + through.x * travel,
      y: meeting.meet.y + through.y * travel,
      z: GROUND_Z,
    },
  };
}

// The swarm: observers over one structure. Each one takes several lines of
// sight, in directions taken at random, so a single observer reads the
// structure from several places at once.
function observers(count) {
  const next = sequence(20260216);
  const snap = (v) => Math.round(v / STEP) * STEP;
  const clamp = (v) => Math.max(-SIZE, Math.min(SIZE, v));
  const centres = [
    [-3.0, -2.5],
    [1.5, 2.5],
    [-1.5, 3.5],
    [3.5, -1.0],
    [0.0, -4.0],
    [-4.0, 1.0],
  ];
  const out = [];
  for (let i = 0; i < count; i += 1) {
    const centre = centres[i % centres.length];
    const jitter = i < centres.length ? 0 : STEP * (1 + Math.floor(next() * 2));
    const angle = next() * Math.PI * 2;
    const x = clamp(snap(centre[0] + jitter * Math.cos(angle)));
    const y = clamp(snap(centre[1] + jitter * Math.sin(angle)));
    const lift = 0.5 + next() * 0.6;
    const origin = { x, y, z: ground(x, y) + lift };
    const lines = [];
    const sights = 3 + Math.floor(next() * 2);
    for (let s = 0; s < sights; s += 1) {
      const line = sightLine(origin, {
        x: clamp(origin.x + (next() - 0.5) * REACH),
        y: clamp(origin.y + (next() - 0.5) * REACH),
      });
      if (line) {
        lines.push(line);
      }
    }
    if (lines.length > 0) {
      out.push({ origin, lines });
    }
  }
  return out;
}

function lineTrace(segments, options) {
  const x = [];
  const y = [];
  const z = [];
  for (const segment of segments) {
    for (const pt of segment) {
      x.push(pt[0]);
      y.push(pt[1]);
      z.push(pt.length > 2 ? pt[2] : ground(pt[0], pt[1]) + SINK);
    }
    x.push(null);
    y.push(null);
    z.push(null);
  }
  return { type: "scatter3d", mode: "lines", x, y, z, ...options };
}

// A path across the ground, sampled so it stays on the sheet.
function groundPath(points) {
  const out = [];
  for (let i = 0; i < points.length - 1; i += 1) {
    const [x0, y0] = points[i];
    const [x1, y1] = points[i + 1];
    const steps = Math.max(2, Math.round(Math.hypot(x1 - x0, y1 - y0) / 0.2));
    for (let s = 0; s <= steps; s += 1) {
      out.push([x0 + ((x1 - x0) * s) / steps, y0 + ((y1 - y0) * s) / steps]);
    }
  }
  return out;
}

const SWARM = observers(OBSERVER_COUNT);
const EVERY_LINE = SWARM.flatMap((o) => o.lines);

function build() {
  const nodes = latticeNodes();
  const sheet = sheetGrid(FIELD_N);

  const data = [
    // Field F = (C, T): the constraint potential. It is the relief of the
    // coordinate space, and the level C(s) bounds the admissible set.
    {
      type: "surface",
      x: sheet.x,
      y: sheet.y,
      z: sheet.z,
      colorscale: spectrum(0),
      contours: {
        x: { show: false },
        y: { show: false },
        z: {
          show: true,
          start: ADMISSIBLE,
          end: ADMISSIBLE,
          size: 1,
          color: INK.relation,
          width: 2,
          usecolormap: false,
        },
      },
      lighting: { ambient: 0.95, diffuse: 0.24, specular: 0, roughness: 1, fresnel: 0 },
      showscale: false,
      name: "Field F = (C, T) · potential",
    },
    // Segments S = (c, id): the coordinates the space is addressed by.
    {
      type: "scatter3d",
      mode: "markers",
      x: nodes.map((p) => p.x),
      y: nodes.map((p) => p.y),
      z: nodes.map((p) => p.z),
      marker: { color: INK.coordinate, size: 2, symbol: "circle" },
      name: "Segments S = (c, id) · coordinate volume",
    },
    // Scheme Sigma = (A, R, L, O): the relations that bind coordinates into a
    // layout.
    lineTrace(RELATIONS.map(groundPath), {
      line: { color: INK.relation, width: 2 },
      name: "Scheme Σ = (A, R, L, O)",
    }),
    // Observation Omega: the lines of sight an observer takes, arriving at the
    // structure from several directions at once.
    lineTrace(
      SWARM.flatMap((o) =>
        o.lines.map((l) => [
          [o.origin.x, o.origin.y, o.origin.z],
          [l.meet.x, l.meet.y, l.meet.z],
        ]),
      ),
      { line: { color: INK.collapse, width: 1.5, dash: "dot" }, name: "Observation Ω · lines of sight" },
    ),
    // What the structure transmits. Each line enters at the angle it arrived,
    // so what it lands as is set by that angle.
    lineTrace(
      EVERY_LINE.map((l) => [
        [l.meet.x, l.meet.y, l.meet.z],
        [l.land.x, l.land.y, l.land.z],
      ]),
      { line: { color: INK.through, width: 1.1, dash: "dot" }, name: "Ω · transmitted at the angle of arrival" },
    ),
    // Projection P = Omega(Sigma, F): the act, where a line meets the structure.
    {
      type: "scatter3d",
      mode: "markers",
      x: EVERY_LINE.map((l) => l.meet.x),
      y: EVERY_LINE.map((l) => l.meet.y),
      z: EVERY_LINE.map((l) => l.meet.z),
      marker: {
        color: INK.projection,
        size: 4.4,
        symbol: "circle",
        line: { color: INK.projectionRing, width: 1 },
      },
      name: "Projection P = Ω(Σ, F) · ephemeral",
    },
    // State · Data D = I(P): what the structure transmitted, landed below it.
    {
      type: "scatter3d",
      mode: "markers",
      x: EVERY_LINE.map((l) => l.land.x),
      y: EVERY_LINE.map((l) => l.land.y),
      z: EVERY_LINE.map((l) => l.land.z),
      marker: { color: INK.data, size: 3.4, symbol: "circle" },
      name: "State · Data D = I(P)",
    },
    // The swarm itself, one marker per observer.
    {
      type: "scatter3d",
      mode: "markers",
      x: SWARM.map((o) => o.origin.x),
      y: SWARM.map((o) => o.origin.y),
      z: SWARM.map((o) => o.origin.z),
      marker: { color: INK.observation, size: 7, symbol: "diamond" },
      name: "Observation Ω · the swarm",
    },
  ];

  const silent = {
    showbackground: false,
    showgrid: false,
    showline: false,
    zeroline: false,
    showticklabels: false,
    showspikes: false,
  };

  const layout = {
    autosize: true,
    margin: { l: 0, r: 0, t: 0, b: 0 },
    paper_bgcolor: "rgba(0,0,0,0)",
    plot_bgcolor: "rgba(0,0,0,0)",
    legend: {
      font: { size: 9, color: "#222222" },
      xanchor: "right",
      yanchor: "top",
      bgcolor: "rgba(255,255,255,0.3)",
      bordercolor: "#dddddd",
      borderwidth: 0.5,
      itemsizing: "constant",
    },
    scene: {
      // The space is square in plan, so the scene holds its shape while the
      // camera drifts around it. The distance and the height are set so the
      // whole drawing sits inside the frame with room to spare, rather than
      // being cut by it.
      aspectmode: "manual",
      aspectratio: { x: 1.5, y: 1.5, z: 0.62 },
      camera: {
        eye: { x: 1.061, y: -1.265, z: 0.380 },
        center: { x: 0, y: 0, z: -0.18 },
      },
      xaxis: { ...silent, title: { text: "segment coordinate space", font: { size: 11, color: "#666666" } } },
      yaxis: { ...silent, title: { text: "segment coordinate space", font: { size: 11, color: "#666666" } } },
      zaxis: { ...silent, title: { text: "coordinate · time among them", font: { size: 11, color: "#666666" } } },
    },
  };

  return { data, layout };
}

export const MONUMENT_SCENE = build();

// The surface trace is the first one, and its colour is the spectrum.
const SURFACE_TRACE = 0;
const DRIFT_PERIOD_MS = 240000; // four minutes for a full sweep between the two spectra
const DRIFT_STEP_MS = 6000;

// Shifts the sheet's spectrum a step at a time. The drift is slow enough that
// the colour is never seen to change and only a long look reveals that it has.
export function startSpectrumDrift(plot, plotly) {
  const started = Date.now();
  return window.setInterval(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }
    const drift = ((Date.now() - started) % DRIFT_PERIOD_MS) / DRIFT_PERIOD_MS;
    plotly.restyle(plot, { colorscale: [spectrum(drift)] }, [SURFACE_TRACE]);
  }, DRIFT_STEP_MS);
}
