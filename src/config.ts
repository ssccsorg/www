export const site = {
  name: 'SSCCS',
  fullName: 'Schema–Segment Composition Computing System',
  organization: 'SSCCS Foundation',
  tagline: 'Computation as the observation of deterministic structure',
  description:
    'SSCCS is an open-source computing systems initiative. It replaces the sequential instruction-centric model with a geometric one: state is the result of projection, and time is one coordinate among many.',
  docs: 'https://docs.ssccs.org',
  whitepaper: 'https://docs.ssccs.org/whitepaper/whitepaper.pdf',
  whitepaperHtml: 'https://docs.ssccs.org/whitepaper/whitepaper',
  projects: 'https://docs.ssccs.org/projects/',
  works: 'https://docs.ssccs.org/works/',
  axioms: 'https://docs.ssccs.org/axioms/',
  axiomsSsccs: 'https://docs.ssccs.org/axioms/ssccs.html',
  philosophy: 'https://docs.ssccs.org/philosophy/',
  direction: 'https://docs.ssccs.org/direction',
  github: 'https://github.com/ssccsorg',
  poc: 'https://github.com/ssccsorg/ssccs/tree/main/poc',
  sponsors: 'https://github.com/sponsors/ssccsorg',
  contact: 'contact@ssccs.org',
  // The key published on the organisation's navigation line.
  contactKey: 'https://keys.openpgp.org/search?q=0xF812D4374FEE96A1',
  contactKeyId: '0xF812D4374FEE96A1',
  // The key that signs commits in the official repository.
  commitKey: 'https://keys.openpgp.org/search?q=BCCB196BADF50C99',
  commitKeyId: 'BCCB196BADF50C99',
  whitepaperDoi: 'https://doi.org/10.5281/zenodo.18759106',
  whitepaperDoiId: '10.5281/zenodo.18759106',
  charter: 'https://ssccs.org/legal',
  provenance: 'https://ssccs.org/wpc2pa',
  isoTeams: 'https://www.iso.org/committee/6794475.html',
} as const;

// The destinations an outside reader arrives for. The document's own sections
// are reached from its contents list rather than from the masthead.
export const elsewhere = [
  { label: 'Documentation', href: site.docs },
  { label: 'Whitepaper', href: site.whitepaper },
  { label: 'Projects', href: site.projects },
  { label: 'Works', href: site.works },
  { label: 'Code', href: site.github },
] as const;

export const nav = [
  { id: 'model', label: 'The model' },
  { id: 'stack', label: 'Stack' },
  { id: 'why', label: 'Why' },
  { id: 'where', label: 'Where' },
  { id: 'now', label: 'Now' },
  { id: 'projects', label: 'Projects' },
  { id: 'engagements', label: 'Engagements' },
  { id: 'sponsorship', label: 'Sponsorship' },
] as const;

// The primitives of the ontology, in the order the monument builds them.
export const primitives = [
  {
    name: 'Segment S = (c, id)',
    body: 'Immutable. Sits on the coordinate space and carries its identity from the coordinate rather than from a hash.',
  },
  {
    name: 'Scheme Σ = (A, R, L, O)',
    body: 'The static structure that binds Segments into a layout. It is compiled, and it is not interpreted at run time.',
  },
  {
    name: 'Field F = (C, T)',
    body: 'Raises a constraint potential over the coordinate space. The admissible set A(Σ, F) is the region where C holds.',
  },
  {
    name: 'Observation Ω',
    body: 'Reads the admissible set, applies the Field, and collapses. Loops disappear into layout.',
  },
  {
    name: 'Projection P = Ω(Σ, F)',
    body: 'Ephemeral, and one per observation. It exists as the act of observation and leaves nothing behind.',
  },
  {
    name: 'Data D = I(P)',
    body: 'The shadow cast by collapsed possibility. Data, or state, is the result of projection.',
  },
] as const;

export const reasons = [
  'Data movement dominates energy costs in modern computing. SSCCS keeps the structure stationary while projections emerge.',
  'Parallelism is inherent to the structure. Independent sub-graphs within a Scheme are observed concurrently, with no locks and no synchronisation.',
  'Structural descriptions are compiled into the hardware substrate at build time. There is no runtime interpretation; the structural document is embedded into execution itself.',
  'Security and auditability are geometric consequences rather than add-on features. Immutable Segments carry cryptographic identity by design, and the manifold provides isolation, so every observation is a deterministic, traceable collapse from blueprint to result.',
  'Digital sovereignty is a design property. Policy sandboxes are enforced at the binary level, so organisations and individuals keep control of their computational environments without proprietary lock-in.',
] as const;

export const workloads = [
  {
    name: 'Space systems',
    href: 'https://docs.ssccs.org/research/riscv_space.html',
    body: 'radiation tolerance from structural reproducibility: after an upset, the system re-observes the same immutable Scheme and returns to the same configuration, without redundant hardware.',
  },
  {
    name: 'Embedded and edge systems',
    body: 'a no-allocator coordinate space fits OS-less microcontrollers and radiation-tolerant hardware, replacing hash units with combinational decoders.',
  },
  {
    name: 'AI inference',
    body: 'model weights stay in place and computation moves to them, which attacks the memory-bandwidth bottleneck behind inference latency and energy cost.',
  },
  {
    name: 'Swarm robotics',
    body: 'agents observe a shared blueprint locally, so collective behaviour emerges without coordination chatter.',
  },
  {
    name: 'Climate and scientific computing',
    body: 'dependency grids become adjacency relations compiled into memory, so each timestep is a parallel observation rather than data movement.',
  },
  {
    name: 'Scientific data infrastructure',
    href: 'https://docs.ssccs.org/works/cern/root-ttree/',
    body: 'coordinate indexing replaces hash lookup in large datasets, collapsing read-request bottlenecks from hours to seconds.',
  },
] as const;

export const projects = [
  {
    name: 'neXus',
    href: 'https://docs.ssccs.org/projects/nexus',
    body: 'isomorphic runtime fabric unifying swarm agents and spatial storage.',
  },
  {
    name: 'synTagma',
    href: 'https://docs.ssccs.org/projects/syntagma',
    body: 'spatial coordinate space computing from software to hardware; identity without hashing, the coordinate is the address.',
  },
  {
    name: 'Chton',
    href: 'https://docs.ssccs.org/projects/chton',
    body: 'materialisation IO fabric for coordinate spaces over physical media; the storage format is the memory layout.',
  },
  {
    name: 'ExaVerif',
    href: 'https://docs.ssccs.org/projects/ev',
    body: 'exhaustive verification for RISC-V custom instructions, replacing random testing.',
  },
  {
    name: 'actus',
    href: 'https://docs.ssccs.org/projects/actus',
    body: 'spatial execution runtime for agents and system actions at scale.',
  },
  {
    name: 'telos',
    href: 'https://docs.ssccs.org/projects/telos',
    body: 'a general agent runs as a fleet of peers with coordinate teleport.',
  },
  {
    name: 'kineTics',
    href: 'https://docs.ssccs.org/projects/kinetics',
    body: 'supervises every executor type under one coordinate-based contract.',
  },
  {
    name: 'SDBS',
    href: 'https://docs.ssccs.org/projects/sdbs',
    body: 'single-path artifact compiler for a reproducible, auditable knowledge base.',
  },
] as const;

export const engagements = [
  {
    name: 'AI infrastructure ecosystem',
    href: 'https://docs.ssccs.org/works/llms/',
    body: 'contributing to the industry-standard inference engines through the structural computing stack:',
    items: [
      { label: 'vLLM', href: 'https://docs.ssccs.org/works/llms/vllm/' },
      { label: 'llama.cpp', href: 'https://docs.ssccs.org/works/llms/llamacpp/' },
    ],
  },
  {
    name: 'CERN science software ecosystem',
    href: 'https://docs.ssccs.org/works/cern/',
    body: 'supporting extreme computational challenges in high-energy physics through the software stack:',
    items: [{ label: 'ROOT TTree', href: 'https://docs.ssccs.org/works/cern/root-ttree/' }],
  },
  {
    name: 'Databases',
    href: 'https://docs.ssccs.org/works/duckdb/',
    body: 'the multi-dimensional query bottleneck, addressed by subspace rather than by a scan:',
    items: [{ label: 'DuckDB coordinate lattice', href: 'https://docs.ssccs.org/works/duckdb/lattice/' }],
  },
  {
    name: 'Eclipse Foundation CORE-V ecosystem',
    href: 'https://docs.ssccs.org/works/openhw_integration',
    body: 'advancing open-source RISC-V verification and validation through the exhaustive verification primitives.',
    items: [],
  },
] as const;
