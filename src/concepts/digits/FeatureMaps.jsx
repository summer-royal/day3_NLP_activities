import { useEffect, useRef } from "react";

function MapCanvas({ map, size }) {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const rows = map.length;
    const cols = map[0].length;

    // Normalize to 0-255
    let min = Infinity, max = -Infinity;
    for (const row of map) for (const v of row) { if (v < min) min = v; if (v > max) max = v; }
    const range = max - min || 1;

    const cellW = size / cols;
    const cellH = size / rows;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const v = Math.round(((map[r][c] - min) / range) * 255);
        ctx.fillStyle = `rgb(${v},${v},${v})`;
        ctx.fillRect(c * cellW, r * cellH, cellW, cellH);
      }
    }
  }, [map, size]);

  return <canvas ref={ref} width={size} height={size} className="digit-map-canvas" />;
}

function PixelGridCanvas({ grid }) {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const size = 112;
    const cell = size / 28;
    for (let r = 0; r < 28; r++) {
      for (let c = 0; c < 28; c++) {
        const v = grid[r][c];
        ctx.fillStyle = `rgb(${v},${v},${v})`;
        ctx.fillRect(c * cell, r * cell, cell, cell);
      }
    }
  }, [grid]);

  return <canvas ref={ref} width={112} height={112} className="digit-map-canvas" />;
}

export default function FeatureMaps({ result }) {
  const { pixel_grid, conv1_maps, conv2_maps, probabilities, prediction, confidence } = result;

  const topN = 4;
  const c1 = conv1_maps.slice(0, topN);
  const c2 = conv2_maps.slice(0, topN);

  return (
    <div className="digit-maps-wrap">
      <div className="digit-maps-row">
        <div className="digit-maps-group">
          <div className="digit-maps-label">Input (28×28)</div>
          <PixelGridCanvas grid={pixel_grid} />
        </div>

        <div className="digit-maps-arrow">→</div>

        <div className="digit-maps-group">
          <div className="digit-maps-label">Conv1 filters (first 4 of 32)</div>
          <div className="digit-maps-grid">
            {c1.map((map, i) => (
              <MapCanvas key={i} map={map} size={56} />
            ))}
          </div>
        </div>

        <div className="digit-maps-arrow">→</div>

        <div className="digit-maps-group">
          <div className="digit-maps-label">Conv2 filters (first 4 of 64)</div>
          <div className="digit-maps-grid">
            {c2.map((map, i) => (
              <MapCanvas key={i} map={map} size={56} />
            ))}
          </div>
        </div>

        <div className="digit-maps-arrow">→</div>

        <div className="digit-maps-group">
          <div className="digit-maps-label">Output probabilities</div>
          <div className="digit-prob-bars">
            {probabilities.map((p, i) => (
              <div key={i} className="digit-prob-row">
                <span className={`digit-prob-digit ${i === prediction ? "digit-prob-digit--pred" : ""}`}>{i}</span>
                <div className="digit-prob-bar-bg">
                  <div
                    className="digit-prob-bar-fill"
                    style={{
                      width: `${(p * 100).toFixed(1)}%`,
                      background: i === prediction ? "var(--accent)" : "var(--border-strong)",
                    }}
                  />
                </div>
                <span className="digit-prob-pct">{(p * 100).toFixed(1)}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="digit-prediction-banner">
        Prediction: <strong>{prediction}</strong>
        <span className="digit-confidence">({(confidence * 100).toFixed(1)}% confidence)</span>
      </div>
    </div>
  );
}
