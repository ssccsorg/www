// Builds the three-dimensional scene for the SSCCS homepage monument.
//
// The scene expresses the ontology of the primitives diagram in
// static/images/ssccs-primitives.dot:
//
//   Segments S = (c, id) sit immutably on a coordinate space and are bound
//   into a Scheme Sigma = (A, R, L, O). A Field F = (C, T) raises a constraint
//   potential over the coordinate space. The admissible set A(Sigma, F) is the
//   region where C(s) holds. Observations Omega spread around the vertical
//   center of the well, receive input from the admissible set, apply the
//   Field, and each collapses to its own ephemeral Projection
//   P = Omega(Sigma, F). Data D = I(P) is the shadow cast by collapsed
//   possibility.

const BASE_Z = -2.3; // ground plane of the coordinate space
const OBS_X = 0.8; // vertical center of the observed potential well
const OBS_Y = -0.6;
const OBS_Z = 5.4; // observation height
// The observations spread around the vertical center of the well. Each one
// collapses into its own projection, so projection count equals observation
// count.
const OBS_RADIUS = 1.15;
const OBS_COUNT = 3;
const ADMISSIBLE_MAX = 1.3; // constraint threshold C(s)
// Scatter3d markers always draw above the surface, so the admissible points
// are sunk slightly below the potential to make their centers meet the
// surface visually.
const ADMISSIBLE_SINK = 0.12;
const SURFACE_N = 60; // potential surface resolution
const FIELD_N = 30; // admissible sampling resolution
const GRID_N = 20; // base plane resolution

const VIRIDIS = [
  [0.0, "#440154"],
  [0.1111111111111111, "#482878"],
  [0.2222222222222222, "#3e4989"],
  [0.3333333333333333, "#31688e"],
  [0.4444444444444444, "#26828e"],
  [0.5555555555555556, "#1f9e89"],
  [0.6666666666666666, "#35b779"],
  [0.7777777777777778, "#6ece58"],
  [0.8888888888888888, "#b5de2b"],
  [1.0, "#fde725"],
];

// Constraint potential raised by the Field over the coordinate space.
// Two wells form the admissible basins that an Observation can collapse.
function potential(x, y) {
  const wellA = Math.exp(-((x - 0.8) ** 2 + (y + 0.6) ** 2) / 1.6);
  const wellB = Math.exp(-((x + 1.2) ** 2 + (y - 1.0) ** 2) / 1.2);
  return 2.2 + 0.12 * (x * x + y * y) - 1.8 * wellA - 1.4 * wellB;
}

// Unit normal of the potential surface at (x, y), by central differences.
function surfaceNormal(x, y) {
  const e = 0.05;
  const dzdx = (potential(x + e, y) - potential(x - e, y)) / (2 * e);
  const dzdy = (potential(x, y + e) - potential(x, y - e)) / (2 * e);
  const n = { x: -dzdx, y: -dzdy, z: 1 };
  const len = Math.hypot(n.x, n.y, n.z);
  return { x: n.x / len, y: n.y / len, z: n.z / len };
}

// Snell refraction of an incoming unit ray by the surface. The ray bends
// away from the normal when eta is above 1. Returns null on total internal
// reflection.
function refract(v, n, eta) {
  const dot = v.x * n.x + v.y * n.y + v.z * n.z;
  const cosI = -dot;
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

// Refractive index of the surface seen by the collapsing rays.
const REFRACTION_INDEX = 1.5;

function linspace(lo, hi, n) {
  const out = [];
  const step = (hi - lo) / (n - 1);
  for (let i = 0; i < n; i += 1) {
    out.push(lo + i * step);
  }
  return out;
}

// Plotly surface grids: each row is one constant-y slice.
function surfaceGrid(n) {
  const xs = linspace(-3, 3, n);
  const x = [];
  const y = [];
  const z = [];
  for (const yi of xs) {
    x.push(xs);
    y.push(xs.map(() => yi));
    z.push(xs.map((xi) => potential(xi, yi)));
  }
  return { x, y, z };
}

// Points of the coordinate space that satisfy the Field constraint C(s).
// The z coordinate is sunk below the potential surface so the marker centers
// appear to touch the surface instead of floating above it.
function admissiblePoints(n) {
  const out = [];
  const xs = linspace(-3, 3, n);
  for (const yi of xs) {
    for (const xi of xs) {
      const z = potential(xi, yi);
      if (z <= ADMISSIBLE_MAX) {
        out.push({ x: xi, y: yi, z: z - ADMISSIBLE_SINK });
      }
    }
  }
  return out;
}

const SEGMENT_STEP = [-3, -1.5, 0, 1.5, 3];

function segmentCoords() {
  const out = [];
  for (const xi of SEGMENT_STEP) {
    for (const yi of SEGMENT_STEP) {
      out.push([xi, yi, BASE_Z]);
    }
  }
  return out;
}

// The Scheme is a closed loop over Segment coordinates, plus interior
// relations. The closed loop reads as "loops disappear into layout".
const SCHEME_LOOP = [
  [-3, -3],
  [-1.5, -3],
  [0, -3],
  [1.5, -3],
  [3, -3],
  [3, -1.5],
  [3, 0],
  [1.5, 0],
  [0, 0],
  [-1.5, 0],
  [-3, 0],
  [-3, -1.5],
  [-3, -3],
];

const SCHEME_RELATIONS = [
  [
    [-3, -3],
    [0, 0],
  ],
  [
    [3, -3],
    [0, 0],
  ],
];

// Corners of the Scheme where the Field is bound to the static structure.
const ANCHOR_CORNERS = [
  [-3, -3],
  [3, -3],
  [3, 3],
  [-3, 3],
];

// Builds a scatter3d line trace from a list of polyline segments.
function lineTrace(segments, options) {
  const x = [];
  const y = [];
  const z = [];
  for (const segment of segments) {
    for (const pt of segment) {
      x.push(pt[0]);
      y.push(pt[1]);
      z.push(pt.length > 2 ? pt[2] : BASE_Z);
    }
    x.push(null);
    y.push(null);
    z.push(null);
  }
  return { type: "scatter3d", mode: "lines", x, y, z, ...options };
}

function build() {
  const grid = surfaceGrid(SURFACE_N);
  const baseGrid = surfaceGrid(GRID_N);

  const admissible = admissiblePoints(FIELD_N);

  // Observations spread around the vertical center of the well. Each one
  // reads the admissible points below it and collapses into its own
  // projection, aligned with its own angle.
  const obsPositions = [];
  for (let i = 0; i < OBS_COUNT; i += 1) {
    const angle = (2 * Math.PI * i) / OBS_COUNT - Math.PI / 2;
    obsPositions.push({
      x: OBS_X + OBS_RADIUS * Math.cos(angle),
      y: OBS_Y + OBS_RADIUS * Math.sin(angle),
      z: OBS_Z,
    });
  }

  // Each observation touches a ring of admissible points below it, taken
  // further out so the projection rays spread wider. Every contacted point
  // becomes its own projection, so projection count equals the number of
  // admissible contact points.
  const contactPoints = [];
  const raySegments = [];
  for (const obs of obsPositions) {
    const near = [...admissible]
      .map((p) => ({ p, d: (p.x - obs.x) ** 2 + (p.y - obs.y) ** 2 }))
      .sort((a, b) => a.d - b.d)
      .slice(4, 8)
      .map((e) => e.p);
    for (const p of near) {
      contactPoints.push({ x: p.x, y: p.y, z: p.z, obs });
      raySegments.push([
        [p.x, p.y, p.z],
        [obs.x, obs.y, obs.z],
      ]);
    }
  }

  const anchorSegments = ANCHOR_CORNERS.map((c) => [
    [c[0], c[1], BASE_Z],
    [c[0], c[1], potential(c[0], c[1])],
  ]);

  // Each contacted admissible point is fixed as an ephemeral projection on
  // the potential surface, with the same contact treatment as the admissible
  // markers. Its interpretation falls to the coordinate space ground as a
  // data shadow.
  const projPoints = contactPoints.map((c) => ({
    x: c.x,
    y: c.y,
    z: c.z,
  }));
  const collapseSegments = contactPoints.map((c) => [
    [c.obs.x, c.obs.y, c.obs.z],
    [c.x, c.y, c.z],
  ]);
  // The interpretation of each projection is refracted by the potential
  // surface: the data shadow leaves at the incidence angle, bent by the
  // curved surface, and lands on the coordinate space ground.
  const dataPoints = [];
  const interpretSegments = [];
  for (let i = 0; i < contactPoints.length; i += 1) {
    const p = projPoints[i];
    const obs = contactPoints[i].obs;
    const v = { x: p.x - obs.x, y: p.y - obs.y, z: p.z - obs.z };
    const vLen = Math.hypot(v.x, v.y, v.z);
    const vn = { x: v.x / vLen, y: v.y / vLen, z: v.z / vLen };
    const r = refract(vn, surfaceNormal(p.x, p.y), REFRACTION_INDEX);
    let dx = p.x;
    let dy = p.y;
    if (r && r.z < -1e-6) {
      const t = (BASE_Z - p.z) / r.z;
      if (t > 0) {
        dx = p.x + t * r.x;
        dy = p.y + t * r.y;
      }
    }
    dataPoints.push({ x: dx, y: dy, z: BASE_Z });
    interpretSegments.push([
      [p.x, p.y, p.z],
      [dx, dy, BASE_Z],
    ]);
  }

  const data = [
    // Coordinate space ground plane, the substrate of immutable Segments.
    {
      type: "surface",
      x: baseGrid.x,
      y: baseGrid.y,
      z: baseGrid.x.map((row) => row.map(() => BASE_Z)),
      colorscale: [
        [0, "#d8d8d8"],
        [1, "#d8d8d8"],
      ],
      contours: { x: { show: false }, y: { show: false }, z: { show: false } },
      opacity: 0.4,
      showscale: false,
      name: "Coordinate space · ground",
    },
    // Field constraint potential rising over the coordinate space.
    {
      type: "surface",
      x: grid.x,
      y: grid.y,
      z: grid.z,
      colorscale: VIRIDIS,
      contours: {
        x: { show: true, color: "rgba(30,30,30,0.25)", width: 1 },
        y: { show: true, color: "rgba(30,30,30,0.25)", width: 1 },
        z: { show: false },
      },
      opacity: 0.92,
      showscale: false,
      name: "Field F = (C, T) · potential",
    },
    // The admissible set A(Sigma, F) = {s | C(s)}.
    {
      type: "scatter3d",
      mode: "markers",
      x: admissible.map((p) => p.x),
      y: admissible.map((p) => p.y),
      z: admissible.map((p) => p.z),
      marker: {
        color: "#d4a017",
        size: 3.5,
        opacity: 0.85,
        symbol: "circle",
      },
      name: "Admissible set A(Σ, F)",
    },
    // Immutable Segments S = (c, id) on the coordinate space.
    {
      type: "scatter3d",
      mode: "markers",
      x: segmentCoords().map((p) => p[0]),
      y: segmentCoords().map((p) => p[1]),
      z: segmentCoords().map((p) => p[2]),
      marker: { color: "#8a93a6", size: 4, opacity: 0.9, symbol: "circle" },
      name: "Segments S = (c, id) · immutable",
    },
    // Static Scheme: closed loop plus interior relations.
    lineTrace([SCHEME_LOOP, ...SCHEME_RELATIONS], {
      line: { color: "#1a1a1a", width: 2.5 },
      name: "Scheme Σ = (A, R, L, O) · static",
    }),
    // Vertical anchors: the Scheme binds the Field to the static structure.
    lineTrace(anchorSegments, {
      line: { color: "#b9b9b9", width: 1 },
      name: "anchors · binds",
    }),
    // Observation input rays: admissible points converge on the observer.
    lineTrace(raySegments, {
      line: { color: "#c96f1a", width: 2, dash: "dot" },
      name: "Observation Ω · applies Field",
    }),
    // The observation nodes, spread around the vertical center of the well.
    {
      type: "scatter3d",
      mode: "markers",
      x: obsPositions.map((o) => o.x),
      y: obsPositions.map((o) => o.y),
      z: obsPositions.map((o) => o.z),
      marker: {
        color: "#d4a017",
        size: 11,
        symbol: "diamond",
        line: { color: "#000000", width: 1 },
      },
      name: "Observation Ω",
    },
    // Collapse: each observation fixes its contacted admissible points as
    // ephemeral projections on the potential surface.
    lineTrace(collapseSegments, {
      line: { color: "#aaaaaa", width: 1 },
      showlegend: false,
    }),
    // Projection P = Omega(Sigma, F), one per admissible contact point.
    {
      type: "scatter3d",
      mode: "markers",
      x: projPoints.map((p) => p.x),
      y: projPoints.map((p) => p.y),
      z: projPoints.map((p) => p.z+0.1),
      marker: { color: "#b9b9b9", size: 4.5, symbol: "square" },
      name: "Projection P = Ω(Σ, F) · ephemeral",
    },
    // Data D = I(P), shadows refracted through the surface onto the ground.
    {
      type: "scatter3d",
      mode: "markers",
      x: dataPoints.map((p) => p.x),
      y: dataPoints.map((p) => p.y),
      z: dataPoints.map((p) => p.z),
      marker: { color: "#999999", size: 4, symbol: "circle" },
      name: "Data D = I(P) · shadow",
    },
    // Interpretation: each projection is refracted to a ground shadow.
    lineTrace(interpretSegments, {
      line: { color: "#262626", width: 0.75, dash: "dot" },
      showlegend: false,
    }),
    // Axiom text.
    {
      type: "scatter3d",
      mode: "text",
      x: [0],
      y: [0],
      z: [6.7],
      text: [],
      textfont: { color: "#111111", size: 15 },
      textposition: "middle center",
      showlegend: false,
      hoverinfo: "none",
    },
  ];

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
      aspectmode: "manual",
      aspectratio: { x: 1.2, y: 1.2, z: 1.2 },
      camera: {
        eye: { x: 1.6, y: 1, z: 0.8 },
        center: { x: 0, y: 0, z: -0.3 },
      },
      xaxis: {
        title: { text: "segment coordinate space", font: { size: 11, color: "#666666" } },
        showbackground: false,
        showgrid: true,
        gridcolor: "#e8e8e8",
        zeroline: false,
        showticklabels: false,
        showspikes: false,
      },
      yaxis: {
        title: { text: "segment coordinate space", font: { size: 11, color: "#666666" } },
        showbackground: false,
        showgrid: true,
        gridcolor: "#e8e8e8",
        zeroline: false,
        showticklabels: false,
        showspikes: false,
      },
      zaxis: {
        title: { text: "constraint potential", font: { size: 11, color: "#666666" } },
        showbackground: false,
        showgrid: true,
        gridcolor: "#e8e8e8",
        zeroline: false,
        showticklabels: false,
        showspikes: false,
      },
    },
  };

  return { data, layout };
}

export const MONUMENT_SCENE = build();
