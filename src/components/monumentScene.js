// Builds the three-dimensional scene for the SSCCS homepage monument.
//
// The scene expresses the ontology of the primitives diagram in
// static/images/ssccs-primitives.dot:
//
//   Segments S = (c, id) sit immutably on a coordinate space and are bound
//   into a Scheme Sigma = (A, R, L, O). A Field F = (C, T) raises a constraint
//   potential over the coordinate space. The admissible set A(Sigma, F) is the
//   region where C(s) holds. An Observation Omega receives input from the
//   admissible set, applies the Field, and collapses to an ephemeral
//   Projection P = Omega(Sigma, F). Data D = I(P) is the shadow cast by
//   collapsed possibility.

const BASE_Z = -2.3; // ground plane of the coordinate space
const OBS_X = 0.8; // observation node, above the deeper potential well
const OBS_Y = -0.6;
const OBS_Z = 5.4; // observation node height
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
  // Eight admissible points closest to the observed well, for the input rays.
  const nearObs = [...admissible]
    .map((p) => ({ p, d: (p.x - OBS_X) ** 2 + (p.y - OBS_Y) ** 2 }))
    .sort((a, b) => a.d - b.d)
    .slice(0, 8)
    .map((e) => e.p);

  const raySegments = nearObs.map((p) => [
    [p.x, p.y, p.z],
    [OBS_X, OBS_Y, OBS_Z],
  ]);

  const anchorSegments = ANCHOR_CORNERS.map((c) => [
    [c[0], c[1], BASE_Z],
    [c[0], c[1], potential(c[0], c[1])],
  ]);

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
    // The observation node itself.
    {
      type: "scatter3d",
      mode: "markers",
      x: [OBS_X],
      y: [OBS_Y],
      z: [OBS_Z],
      marker: {
        color: "#d4a017",
        size: 11,
        symbol: "diamond",
        line: { color: "#000000", width: 1 },
      },
      name: "Observation Ω₁",
    },
    // Collapse: observation resolves to an ephemeral projection.
    lineTrace(
      [
        [
          [OBS_X, OBS_Y, OBS_Z],
          [OBS_X, OBS_Y, BASE_Z],
        ],
      ],
      { line: { color: "#111111", width: 3 }, showlegend: false },
    ),
    // Projection P = Omega(Sigma, F), ephemeral state on the ground plane.
    {
      type: "scatter3d",
      mode: "markers",
      x: [OBS_X],
      y: [OBS_Y],
      z: [BASE_Z],
      marker: { color: "#000000", size: 9, symbol: "square" },
      name: "Projection P₁ = Ω(Σ, F) · ephemeral",
    },
    // Data D = I(P), the shadow cast by collapsed possibility.
    {
      type: "scatter3d",
      mode: "markers",
      x: [OBS_X],
      y: [-0.15],
      z: [BASE_Z],
      marker: { color: "#000000", size: 6, symbol: "circle" },
      name: "Data D₁ = I(P₁) · shadow",
    },
    // Interpretation: projection is read into data.
    lineTrace(
      [
        [
          [OBS_X, OBS_Y, BASE_Z],
          [OBS_X, -0.15, BASE_Z],
        ],
      ],
      { line: { color: "#444444", width: 1.5, dash: "dot" }, showlegend: false },
    ),
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
        eye: { x: 1.1, y: 0.3, z: 0.95 },
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
