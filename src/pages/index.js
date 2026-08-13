import styles from "./index.module.css";
import { SsccsMonument } from "../components/SsccsMonument";

export default function Home() {
  return (
    <main
      style={{
        maxWidth: "100%",
        width: "clamp(800px, 90%, min(60%, 1000px))",
        margin: "0 auto",
        padding: "30px 20px",
        color: "#000",
        lineHeight: "1.6",
      }}
    >
      <nav className={styles.nav}>
        <span className={styles.group}>
          <a href={"https://docs.ssccs.org"}>Documentation</a>
        </span>
        <span style={{ fontWeight: "bold" }}>·</span>

        <span className={styles.group}>
          <a href={appendDateQuery("https://docs.ssccs.org/whitepaper/whitepaper.html")}>Whitepaper</a>
        </span>

        <span style={{ fontWeight: "bold" }}>·</span>
        
        <span className={styles.group}>
          <a href={"https://docs.ssccs.org/projects/"}>Projects</a>
        </span>
        
        <span style={{ fontWeight: "bold" }}>·</span>

        <span className={styles.group}>
          <a href={"https://github.com/ssccsorg"}>Code</a>
        </span>

        <span style={{ fontWeight: "bold" }}>·</span>

        <span className={styles.group}>
          <a href={"https://github.com/sponsors/ssccsorg"}>Support</a>          
        </span>        
        
        <span style={{ fontWeight: "bold" }}>·</span>

        <span className={styles.group}>
          <a href={"mailto:contact@ssccs.org"}>Contact</a> (
          <a href={"https://keys.openpgp.org/search?q=0xF812D4374FEE96A1"}>
            PGP Key
          </a>)
        </span>
      </nav>
      
      <p
        style={{ margin: "46px 0"}}
      />

      <h1 align="center" className={styles.titleRow}>
        <img
          src="https://avatars.githubusercontent.com/u/257801312?s=120&u=23732f7ce4bf24ce32f356fa47ee16b5b4548a3b&v=4"
          alt="SSCCS"
          className={styles.logo}
        />
        Schema–Segment Composition Computing System
      </h1>

      <hr
        style={{ margin: "30px 0", border: "0", borderTop: "1px solid #000" }}
      />
      
      <p>
        <a href="https://docs.ssccs.org/axioms/ssccs.html">SSCCS</a> (Schema–Segment Composition Computing System) is an open‑source computing systems initiative that replaces the instruction‑centric model with an observation‑driven architecture: computation is the collapse of structured potential across a coordinate space of immutable Segments and dynamic Fields. Parallelism and verifiability emerge from the structure itself, with near‑linear scalability and energy efficiency as consequences; state is the result of projection, and time is one coordinate among many.
      </p>

      <p>
        SSCCS is built by the{" "}
        <a href="https://docs.ssccs.org/axioms/">SSCCS Foundation</a>{" "}
        under an open‑core model, guided by its{" "}
        <a href="https://docs.ssccs.org/direction">
          operational direction
        </a>{" "}
        and <a href="https://docs.ssccs.org/philosophy/">philosophy</a>. The stack spans the full pipeline, from formal specifications, through a software compiler toolchain, to an open hardware architecture. The model is actively materalizaing on the current paradigm and silicon through <a href="https://docs.ssccs.org/projects/#recursive-synergy-of-the-shared-substrate">domain</a> instantiations including <a href="http://docs.ssccs.org/projects/nexus">neXus</a> and <a href="http://docs.ssccs.org/projects/syntagma">synTagma</a>.
      </p>

      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <SsccsMonument />
        <p style={{ fontSize: "12px", color: "#343434" }}>
          *Loops disappear into layout. Data, or state, is the shadow
          cast by collapsed possibility.
        </p>
      </div>

      <p></p>
      <h2>Stack</h2>

      <p>
        SSCCS is a software-first project: a compiler toolchain, a runtime, and
        an open binary format. The compiler maps structural descriptions through
        a layered lowering chain to hardware-specific backends. A
        target-agnostic HAL keeps the ontological core independent of the
        execution substrate. The same Scheme projects onto a CPU, an FPGA, or a
        processor-in-memory architecture without rewrites. A Rust reference
        implementation validates all core primitives.
      </p>

      <p></p>
      <h2>Why</h2>
      <ul>
        <li>
          Data movement dominates energy costs in modern computing. SSCCS keeps
          the structure stationary while projections emerge.
        </li>
        <li>
          Parallelism is inherent to the structure. Independent sub‑graphs
          within a Scheme can be observed concurrently—no locks, no
          synchronisation.
        </li>
        <li>
          Structural descriptions are compiled directly into the hardware
          substrate at build time. There is no runtime interpretation; the
          structural document is embedded into execution itself.
        </li>
        <li>
          Security and auditability are geometric consequences, not add‑on
          features. Immutable Segments carry cryptographic identity by design,
          and the geometric manifold provides inherent isolation. Independent
          sub‑graphs cannot interfere, and every observation is a deterministic,
          traceable collapse from blueprint to result.
        </li>
        <li>
          Digital sovereignty is a design property, not an afterthought. Policy
          sandboxes are enforced at the binary level, so organizations and
          individuals keep control of their computational environments, free
          from proprietary lock-in.
        </li>
      </ul>
      <p></p>
      <h2>Where</h2>
      <p>Workloads where data movement is the binding constraint:</p>
      <ul>
        <li>
          <a href="https://docs.ssccs.org/research/riscv_space.html">
            Space systems
          </a>
          : radiation tolerance from structural reproducibility. After an
          upset, the system re-observes the same immutable Scheme and
          deterministically returns to the same configuration, without
          redundant hardware.
        </li>
        <li>
          Embedded and edge systems: a no-allocator coordinate space fits
          OS-less microcontrollers and radiation-tolerant hardware, replacing
          hash units with combinational decoders.
        </li>
        <li>
          AI inference: model weights stay in place and computation moves to
          them, attacking the memory-bandwidth bottleneck behind inference
          latency and energy cost.
        </li>
        <li>
          Swarm robotics: agents observe a shared blueprint locally, making
          collective behavior emergent without coordination chatter.
        </li>
        <li>
          Climate and scientific computing: dependency grids become adjacency
          relations compiled into memory, so each timestep is a parallel
          observation instead of data movement.
        </li>
        <li>
          Scientific data infrastructure: <a href="https://docs.ssccs.org/works/cern/root-ttree">coordinate indexing</a> replaces hash
          lookup in large datasets, collapsing read-request bottlenecks from
          hours to seconds.
        </li>
      </ul>
      <p></p>
      <h2>Now</h2>
      <ul>
        <li>
          The core compiler and runtime are under{" "}
          <a href="https://github.com/ssccsorg/ssccs/graphs/commit-activity">
            active development.
          </a>{" "}
          Current focus is on Field composition algebra: making constraint sets
          composable while preserving observation determinism, with parallel
          work on{" "}
          <a href="https://docs.ssccs.org/research/rust_baremetal.html">
            compiler pipeline hardening
          </a>{" "}
          and{" "}
          <a href="https://docs.ssccs.org/research/riscv.html">
            hardware mapping
          </a>
          .
        </li>

        <li>
          <a href="https://docs.ssccs.org/projects/nexus">Nexus</a>:
          a domain instantiation of the SSCCS model. It provides
          contract‑governed, agentic coordination that ingests and connects
          heterogeneous knowledge into a unified, queryable structure.
        </li>
        <li>
          <a href="https://docs.ssccs.org/works/aws.html">
            Strategic partnerships
          </a>
          : with infrastructure leaders to extend the reach of agentic
          research environments.
        </li>
        <li>
          <a href="https://docs.ssccs.org/works/openhw_integration.html">
            Hardware validation
          </a>
          : phased prototyping from software emulation to FPGA deployment, with a
          parallel track for radiation‑tolerant platforms.
        </li>
      </ul>
      <p></p>
      <h2>Projects</h2>
      <p>
        The stack materializes as independent domain instantiations on the same
        substrate. Each one solves its own problem and strengthens the
        primitives for all.
      </p>
      <ul>
        <li>
          <a href="https://github.com/ssccsorg/ssccs/tree/main/poc">PoCs</a>:
          SSCCS is a paradigm, not a single implementation. Its abstract
          primitives are being proven in parallel across RTL, RISC-V assembly,
          and current-language PoCs before a reference compiler and runtime
          take shape.
        </li>
        <li>
          <a href="https://docs.ssccs.org/projects/nexus">neXus</a>: swarm
          computing runtime with n-dimensional state space storage and
          contract-governed agentic coordination over an immutable Fact space.
        </li>
        <li>
          <a href="https://docs.ssccs.org/projects/syntagma">synTagma</a>:
          spatial coordinate space computing; identity without hashing, the
          coordinate is the address.
        </li>
        <li>
          <a href="https://docs.ssccs.org/projects/chton">Chton</a>:
          materialization IO fabric for coordinate spaces over physical media;
          the storage format is the memory layout.
        </li>
        <li>
          <a href="https://docs.ssccs.org/projects/ev">ExaVerif</a>:
          exhaustive verification for RISC-V custom instructions, replacing
          random testing.
        </li>
        <li>
          <a href="https://docs.ssccs.org/projects/actus">Actus</a>: agent
          orchestration runtime across a shared knowledge space.
        </li>
        <li>
          <a href="https://docs.ssccs.org/projects/sdbs">SDBS</a>:
          single-path artifact compiler for reproducible, auditable knowledge base.
        </li>
      </ul>
      <p></p>
      <h2>Collaboration</h2>
      <p>
        We welcome partnerships from academia, industry, and public institutions
        worldwide — any nation with aligned public-interest programs. Domain
        instantiations of the SSCCS model are already in motion; we are selective
        about collaborators who bring engineering depth and long-term commitment.
        Opportunities include research collaboration, software toolchain
        development, and joint hardware validation. Current representative engagements:
      </p>
      <ul>
        <li>
          <a href="https://docs.ssccs.org/works/cern/">
            Contribution to CERN science ecosystem
          </a>
          : supporting to tackle the extreme computational challenges of High-Energy Physics (HEP) through our
          software stack.
        </li>
        <li>
          <a href="https://docs.ssccs.org/works/openhw_integration">
            Eclipse Foundation CORE-V platforms
          </a>
          : phased collaboration to validate our core primitives and materialization.
        </li>
      </ul>
      <p>
        For the full list of current engagements, see{" "}
        <a href="https://docs.ssccs.org/works/#current-engagements">
          Current Engagements
        </a>.
      </p>

      <p></p>
      <h2>Sponsorship</h2>
      <p>
        SSCCS is an independent, non-profit initiative committed to public-good
        infrastructure. The <a href="https://github.com/sponsors/ssccsorg">official sponsorship charter on GitHub Sponsors</a> describes the funded work: open-source releases, free documentation,
        and research into energy-efficient, verifiable computing.
      </p>
      <hr
        style={{ margin: "30px 0", border: "0", borderTop: "1px solid #000" }}
      />

      <footer
        style={{
          fontSize: "0.85rem",
        }}
      >
        <section>
          <p>
            © 2026 SSCCS Foundation — Open-source computing systems initiative
            building a computing model, software compiler infrastructure, and
            open hardware architecture.
          </p>
          <ul>
            <li>
              Whitepaper:{" "}
              <a href={appendDateQuery("https://ssccs.org/wp")}>PDF</a> /{" "}
              <a href={appendDateQuery("https://ssccs.org/wpw")}>HTML</a>{" "}
              Licensed under <i>CC BY-NC-ND 4.0</i>. DOI:{" "}
              <a
                href={appendDateQuery(
                  "https://doi.org/10.5281/zenodo.18759106",
                )}
              >
                10.5281/zenodo.18759106
              </a>{" "}
              via CERN/Zenodo, indexed by OpenAIRE.
            </li>
            <li>
              Official repository:{" "}
              <a href={"https://github.com/ssccsorg"}>GitHub</a>. Licensed under{" "}
              <i>Apache 2.0</i>. Authenticated via GPG:{" "}
              <a href={"https://keys.openpgp.org/search?q=BCCB196BADF50C99"}>
                BCCB196BADF50C99
              </a>
              .
            </li>
            <li>
              Governed by the{" "}
              <a href={"https://ssccs.org/legal"}>
                Foundational Charter and Statute
              </a>{" "}
              of the SSCCS Foundation (in formation).
            </li>
            <li>
              Provenance: Human-in-Command, AI-assisted. Full intellectual
              responsibility with author(s),{" "}
              <a href="https://ssccs.org/wpc2pa">C2PA-certified</a>. Aligns with{" "}
              <a href="https://www.iso.org/committee/6794475.html">
                ISO/IEC JTC 1/SC 42
              </a>{" "}
              human‑machine teaming frameworks.
            </li>
          </ul>
        </section>

        <hr
          style={{ margin: "30px 0", border: "0", borderTop: "1px solid #000" }}
        />

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "20px",
            marginTop: "15px",
          }}
        >
          {PARTNERS.map((logo) => (
            <PartnerLogo
              key={logo.name}
              href={logo.href}
              src={logo.src}
              alt={logo.name}
              height={logo.h}
            />
          ))}
        </div>
      </footer>
    </main>
  );
}

function appendDateQuery(url) {
  if (!url.startsWith("http")) {
    return url;
  }
  if (url.includes("?")) {
    return url;
  }
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const dateStr = `${year}${month}${day}`;
  return url + "?" + dateStr;
}

const PARTNERS = [
  {
    name: "C2PA",
    href: appendDateQuery("https://www.c2pa.org/"),
    src: appendDateQuery(
      "https://c2pa.org/wp-content/uploads/sites/33/2025/05/c2pa_logo.svg",
    ),
    h: "40px",
  },
  {
    name: "Open AIRE",
    href: appendDateQuery("https://www.openaire.eu/"),
    src: appendDateQuery("./images/openaire.svg"),
    h: "40px",
  },
  // {
  //   name: "CERN",
  //   href: appendDateQuery(
  //     "https://openscience.cern/zenodo",
  //   ),
  //   src: appendDateQuery("./images/cern.svg"),
  //   h: "60px",
  // },
];

const PartnerLogo = ({ href, src, alt, height }) => (
  <a href={href} target="_blank" rel="noopener noreferrer">
    <img
      src={src}
      alt={alt}
      style={{ height, width: "auto", display: "block" }}
    />
  </a>
);
