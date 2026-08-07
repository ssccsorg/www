// Interactive three-dimensional monument for the SSCCS homepage.
//
// Plotly is loaded lazily in the browser, because its modules reference
// browser globals during evaluation. Until the library arrives, a placeholder
// of the same dimensions is rendered. The scene drifts in a slow orbit until
// the visitor takes control with a pointer drag.

import { useEffect, useRef, useState } from "react";
import { MONUMENT_SCENE } from "./monumentScene";

const EYE = MONUMENT_SCENE.layout.scene.camera.eye;

export function SsccsMonument() {
  const plotRef = useRef(null);
  const [interacted, setInteracted] = useState(false);
  const [libs, setLibs] = useState(null);
  const [width, setWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1200,
  );

  useEffect(() => {
    let cancelled = false;
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    Promise.all([import("react-plotly.js"), import("plotly.js")]).then(
      ([plotModule, plotlyModule]) => {
        if (cancelled) {
          return;
        }
        setLibs({ Plot: plotModule.default, Plotly: plotlyModule.default });
      },
    );
    return () => {
      cancelled = true;
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Gentle orbit until the visitor drags the scene.
  useEffect(() => {
    if (interacted || !libs) {
      return undefined;
    }
    const radius = Math.hypot(EYE.x, EYE.y, EYE.z);
    let azimuth = Math.atan2(EYE.y, EYE.x);
    const id = window.setInterval(() => {
      azimuth += 0.008;
      const node = plotRef.current;
      if (!node) {
        return;
      }
      libs.Plotly.relayout(node, {
        "scene.camera.eye": {
          x: radius * Math.cos(azimuth),
          y: radius * Math.sin(azimuth),
          z: EYE.z,
        },
      });
    }, 90);
    return () => window.clearInterval(id);
  }, [interacted, libs]);

  const placeholderStyle = {
    width: "100%",
    height: "clamp(420px, 55vh, 640px)",
    position: "relative",
  };

  if (!libs) {
    return (
      <div role="img" aria-label="SSCCS primitives: Segments, Scheme, Field, Observation, Projection, Data" style={placeholderStyle} />
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
        ref={plotRef}
        data={MONUMENT_SCENE.data}
        layout={{
          ...MONUMENT_SCENE.layout,
          showlegend: showLegend,
          scene: {
            ...MONUMENT_SCENE.layout.scene,
            dragmode: "turntable",
            camera: {
              ...MONUMENT_SCENE.layout.scene.camera,
              eye: EYE,
            },
          },
        }}
        style={{ width: "100%", height: "100%" }}
        useResizeHandler={true}
        config={{ displayModeBar: false }}
      />
    </div>
  );
}
