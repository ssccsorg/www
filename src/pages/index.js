import BrowserOnly from "@docusaurus/BrowserOnly";
import useBaseUrl from "@docusaurus/useBaseUrl";
import { isMobileSafari } from "../utils/detector";
import { ResponsivePlot } from "../components/ResponsivePlot";
import styles from "./index.module.css";

export default function Home() {
  return (
    <main
      style={{
        maxWidth: "100%",
        width: "clamp(800px, 90%, min(60%, 1000px))",
        margin: "0 auto",
        padding: "40px 20px",
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
          <a href={"https://docs.ssccs.org/projects/"}>Ecosystem</a>
        </span>
        
        <span style={{ fontWeight: "bold" }}>·</span>

        <span className={styles.group}>
          <a href={"https://github.com/ssccsorg"}>Code</a>
        </span>
        
        <span style={{ fontWeight: "bold" }}>·</span>

        <span className={styles.group}>
          <a href={"mailto:contact@ssccs.org"}>Contact</a> /{" "}
          <a href={"https://keys.openpgp.org/search?q=0xF812D4374FEE96A1"}>
            PGP Key
          </a>
        </span>
      </nav>

      <hr
        style={{ margin: "30px 0", border: "0", borderTop: "1px solid #000" }}
      />

      <h1 align="center">Schema–Segment Composition Computing System</h1>

      <hr
        style={{ margin: "30px 0", border: "0", borderTop: "1px solid #000" }}
      />

      <p>
        <a href="https://docs.ssccs.org/axioms/ssccs.html">SSCCS</a> (Schema–Segment Composition Computing System) is an observation‑driven computing model grounded in the epistemology of possible worlds, redefining computation as the collapse of structured potential. From the Turing machine to the von Neumann architecture, all digital computing has been an instantiation of propositional logic; SSCCS radically reduces that linguistic frame to its origin, operating directly on the primordial resonance that exists before explanation and symbols emerge. Immutable Segments arranged by Schemes, projected through Fields under their dynamic constraints and Observation. State or data is the result of the projection, and time is one of coordinates. Therefore parallelism and verifiability emerge naturally from structure, have near-linear scalability and energy consumption.
      </p>
      

      <p>
        This project is from the <a href="https://docs.ssccs.org/axioms/">SSCCS Foundation</a>: an open‑source computing systems initiative building a complete stack of silicon compiler infrastructure from technical specifications, through a software compiler toolchain to an open hardware architecture. We are under an open‑core model by our{" "}
        <a href="https://docs.ssccs.org/direction">
          operational direction
        </a>{" "}
        and <a href="https://docs.ssccs.org/philosophy/">philosophy</a>. Our philosophy provides the foundational definition that constitutes the practitioner's mode of being and identity. The model validation is actively materializing through domain instantiations including <a href="http://docs.ssccs.org/projects/nexus">neXus</a> and <a href="http://docs.ssccs.org/projects/syntagma">synTagma</a>.
      </p>

      <BrowserOnly fallback={<div style={{ height: "540px" }}></div>}>
        {() => {
          const svgUrl = useBaseUrl("/images/ontology3d.svg");
          if (isMobileSafari()) {
            return (
              <div
                style={{
                  width: "100%",
                  height: "clamp(400px, 50vh, 600px)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <img
                  src={svgUrl}
                  alt="SSCCS Ontology Structure"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                  }}
                />
                <p style={{ fontSize: "12px", color: "#343434" }}>
                  *Loops disappear into layout. Data, or state, is the shadow
                  cast by collapsed possibility.
                </p>
              </div>
            );
          } else {
            return <ResponsivePlot />;
          }
        }}
      </BrowserOnly>

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
      </ul>
      <p></p>
      <h2>Where</h2>
      <p>
        The model is built for workloads where data movement is the binding
        constraint. For example:
      </p>
      <ul>
        <li>
          <a href="https://docs.ssccs.org/research/riscv_space.html">
            Space systems
          </a>
          : Radiation tolerance comes from structural reproducibility. After an
          upset, the system re‑observes the same immutable Scheme,
          deterministically arriving at the same configuration without expensive
          hardware redundancy.
        </li>
        <li>
          AI inference (LLMs, diffusion models, etc.): Model weights are largely
          static. An observation‑centric model keeps them in place and performs
          computation where they reside, directly tackling the memory bandwidth
          bottleneck that dominates inference latency and energy consumption.
        </li>
        <li>
          Swarm robotics: Distributed agents observe a shared structural
          blueprint (e.g., formation geometry) while moving locally. This
          eliminates expensive coordination chatter and makes collective
          behavior an emergent property of observing the same Scheme under
          different local Fields.
        </li>
        <li>
          Climate and scientific computing: Massive dependency grids (e.g., PDE
          stencils) can be encoded as adjacency relations in a Scheme. The
          compiler maps these relations directly into the memory subsystem so
          that each timestep becomes a parallel observation of the grid, not a
          sequence of explicit data movements.
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
          <a href="https://docs.ssccs.org/partnerships/aws.html">
            Strategic partnerships
          </a>
          : with infrastructure leaders to extend the reach of agentic
          research environments.
        </li>
        <li>
          <a href="https://docs.ssccs.org/partnerships/openhw_integration.html">
            Hardware validation
          </a>
          : phased prototyping from software emulation to FPGA deployment, with a
          parallel track for radiation‑tolerant platforms.
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
        development, and joint hardware validation.
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
  {
    name: "CERN",
    href: appendDateQuery(
      "https://openscience.cern/zenodo",
    ),
    src: appendDateQuery("./images/cern.svg"),
    h: "60px",
  },
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
