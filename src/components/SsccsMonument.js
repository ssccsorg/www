// Interactive three-dimensional monument for the SSCCS homepage.
//
// Plotly is loaded lazily in the browser, because its modules reference
// browser globals during evaluation. The gl3d partial bundle is used instead
// of the full library, because the scene only needs the surface and scatter3d
// trace types. Until the library arrives, a placeholder of the same
// dimensions is rendered. The scene drifts in a slow orbit until the visitor
// takes control with a pointer drag.

import { useEffect, useRef, useState } from "react";
import { MONUMENT_SCENE } from "./monumentScene";

const UNAVAILABLE_LABEL =
  "The interactive scene is unavailable in this browser. WebGL support or the plotly library could not be loaded.";

const SPINNER_KEYFRAMES = `
@keyframes ssccs-monument-spin {
  to {
    transform: rotate(360deg);
  }
}
`;

const SPINNER_STYLE = {
  width: "28px",
  height: "28px",
  border: "3px solid #dddddd",
  borderTopColor: "#222222",
  borderRadius: "50%",
  animation: "ssccs-monument-spin 0.9s linear infinite",
};

// A plotly scene with three-dimensional traces requires a WebGL context.
// Detect support up front so a browser without WebGL shows a message instead
// of an empty container that never resolves.
function webglAvailable() {
  try {
    const canvas = document.createElement("canvas");
    const gl =
      canvas.getContext("webgl") ||
      canvas.getContext("experimental-webgl");
    if (gl) {
      const lose = gl.getExtension("WEBGL_lose_context");
      if (lose) {
        lose.loseContext();
      }
    }
    return !!gl;
  } catch {
    return false;
  }
}

export function SsccsMonument() {
  const orbitRef = useRef(null);
  const [interacted, setInteracted] = useState(false);
  const [libs, setLibs] = useState(null);
  const [loadFailed, setLoadFailed] = useState(false);
  const [width, setWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1200,
  );

  useEffect(() => {
    let cancelled = false;
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    if (!webglAvailable()) {
      setLoadFailed(true);
      return () => window.removeEventListener("resize", handleResize);
    }
    Promise.all([
      import("react-plotly.js/factory"),
      import("plotly.js/dist/plotly-gl3d.min.js"),
    ])
      .then(([factoryModule, plotlyModule]) => {
        if (cancelled) {
          return;
        }
        const Plot = factoryModule.default(plotlyModule.default);
        setLibs({ Plot, Plotly: plotlyModule.default });
      })
      .catch(() => {
        if (!cancelled) {
          setLoadFailed(true);
        }
      });
    return () => {
      cancelled = true;
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Stop the orbit once the visitor takes control with a pointer drag.
  useEffect(() => {
    if (interacted && orbitRef.current) {
      window.clearInterval(orbitRef.current);
      orbitRef.current = null;
    }
  }, [interacted]);

  // Clear the orbit timer on unmount.
  useEffect(() => {
    return () => {
      if (orbitRef.current) {
        window.clearInterval(orbitRef.current);
      }
    };
  }, []);

  // Gentle orbit around the scene. Started from onInitialized, because
  // relayout needs the plotly graph to be fully laid out first. The orbit
  // moves the camera eye only, so the visitor's own center stays untouched.
  // The circle is derived from the camera actually applied to the scene at
  // this moment: its radius is the in-plane distance of the current eye and
  // its starting azimuth is the current eye angle. The first tick therefore
  // continues from the current view for any camera definition, so the drift
  // never snaps away from the view that was just shown.
  const startOrbit = (graphDiv) => {
    if (interacted || !libs || !graphDiv) {
      return;
    }
    if (orbitRef.current) {
      window.clearInterval(orbitRef.current);
    }
    const applied =
      (graphDiv._fullLayout &&
        graphDiv._fullLayout.scene &&
        graphDiv._fullLayout.scene.camera) ||
      MONUMENT_SCENE.layout.scene.camera;
    const { x, y, z } = applied.eye;
    const radius = Math.hypot(x, y);
    let azimuth = Math.atan2(y, x);
    orbitRef.current = window.setInterval(() => {
      azimuth += 0.008;
      if (!graphDiv._fullLayout) {
        return;
      }
      libs.Plotly.relayout(graphDiv, {
        "scene.camera.eye": {
          x: radius * Math.cos(azimuth),
          y: radius * Math.sin(azimuth),
          z,
        },
      });
    }, 90);
  };

  const placeholderStyle = {
    width: "100%",
    height: "clamp(420px, 55vh, 640px)",
    position: "relative",
  };

  const messageStyle = {
    ...placeholderStyle,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#555555",
    fontSize: "14px",
    textAlign: "center",
    padding: "0 24px",
    boxSizing: "border-box",
  };

  if (loadFailed) {
    return (
      <div
        role="img"
        aria-label="SSCCS primitives: Segments, Scheme, Field, Observation, Projection, Data"
        style={messageStyle}
      >
        {UNAVAILABLE_LABEL}
      </div>
    );
  }

  if (!libs) {
    return (
      <div
        role="img"
        aria-label="SSCCS primitives: Segments, Scheme, Field, Observation, Projection, Data"
        style={messageStyle}
      >
        <style>{SPINNER_KEYFRAMES}</style>
        <div style={SPINNER_STYLE} aria-hidden="true" />
      </div>
    );
  }

  const { Plot, Plotly } = libs;
  const showLegend = width > 720;

  return (
    <div
      role="img"
      aria-label="SSCCS primitives: Segments, Scheme, Field, Observation, Projection, Data"
      onPointerDown={() => setInteracted(true)}
      style={placeholderStyle}
    >
      <Plot
        data={MONUMENT_SCENE.data}
        layout={{
          ...MONUMENT_SCENE.layout,
          uirevision: "ssccs-monument",
          showlegend: showLegend,
          scene: {
            ...MONUMENT_SCENE.layout.scene,
            dragmode: "turntable",
            // The camera ships in the initial layout so the first frame
            // already shows the final view. The `uirevision` above keeps
            // the camera stable across re-renders, and the orbit animation
            // moves it with relayout.
            camera: MONUMENT_SCENE.layout.scene.camera,
          },
        }}
        onInitialized={(figure, graphDiv) => {
          startOrbit(graphDiv);
        }}
        style={{ width: "100%", height: "100%" }}
        useResizeHandler={true}
        config={{ displayModeBar: false }}
      />
    </div>
  );
}
