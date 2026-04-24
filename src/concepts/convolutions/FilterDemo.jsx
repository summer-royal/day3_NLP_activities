import { useState } from "react";
import { IMAGE, IMG_W, FILTERS, convolve } from "./filtersData.js";

const OUT_W = IMG_W - 2; // 6

function grayStyle(v) {
  return { backgroundColor: `rgb(${v},${v},${v})` };
}

export default function FilterDemo({ mode }) {
  const [filterId, setFilterId] = useState(FILTERS[0].id);
  // step: which output cell is being computed (0 to OUT_W*OUT_W-1)
  const [step, setStep] = useState(null); // null = not stepped in yet

  const filter = FILTERS.find((f) => f.id === filterId) || FILTERS[0];
  const outputMap = convolve(IMAGE, filter.kernel);

  // When filter changes, reset step
  const handleFilterChange = (id) => {
    setFilterId(id);
    setStep(null);
  };

  const maxSteps = OUT_W * OUT_W; // 36
  const curStep = step === null ? 0 : step;
  const outRow = Math.floor(curStep / OUT_W); // 0-5
  const outCol = curStep % OUT_W;             // 0-5

  // The 3×3 patch of the input image at the current cursor position
  const patchVals = [];
  for (let kr = 0; kr < 3; kr++) {
    for (let kc = 0; kc < 3; kc++) {
      const r = outRow + kr;
      const c = outCol + kc;
      patchVals.push(IMAGE[r * IMG_W + c]);
    }
  }

  // Compute the current output value (raw, before normalization)
  const rawVal = patchVals.reduce((s, v, i) => {
    const kr = Math.floor(i / 3), kc = i % 3;
    return s + v * filter.kernel[kr][kc];
  }, 0);

  const mathLines = patchVals.map((v, i) => {
    const kr = Math.floor(i / 3), kc = i % 3;
    const k = filter.kernel[kr][kc];
    const fmt = (n) => {
      if (Number.isInteger(n)) return n.toString();
      return n.toFixed(3);
    };
    return `${v} × ${fmt(k)} = ${(v * k).toFixed(1)}`;
  });

  const started = step !== null;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Filter selector */}
      <div>
        <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.6px", color: "var(--text-faint)", marginBottom: 8 }}>
          Choose a filter
        </div>
        <div className="conv-filter-btns">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              className={`conv-filter-btn ${f.id === filterId ? "conv-filter-btn--active" : ""}`}
              onClick={() => handleFilterChange(f.id)}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="conv-filter-desc" style={{ marginTop: 8 }}>
          {filter.description}
        </div>
      </div>

      {/* Grids row */}
      <div className="conv-grids-row">
        {/* Input image */}
        <div className="conv-grid-section">
          <div className="conv-grid-section-label">Input (8×8)</div>
          <div
            className="conv-grid"
            style={{ gridTemplateColumns: `repeat(${IMG_W}, 1fr)` }}
          >
            {IMAGE.map((v, i) => {
              const r = Math.floor(i / IMG_W);
              const c = i % IMG_W;
              const inPatch =
                started &&
                r >= outRow && r < outRow + 3 &&
                c >= outCol && c < outCol + 3;
              return (
                <div
                  key={i}
                  className={`conv-cell ${inPatch ? "conv-cell--highlight" : ""}`}
                  style={{ ...grayStyle(v), minWidth: 30, minHeight: 30 }}
                >
                  <span style={{ fontSize: 8, color: v > 128 ? "rgba(0,0,0,0.35)" : "rgba(255,255,255,0.45)" }}>
                    {v}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Filter kernel */}
        <div className="conv-grid-section">
          <div className="conv-grid-section-label">Filter (3×3)</div>
          <div className="conv-grid" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
            {filter.kernel.flat().map((k, i) => {
              const fmt = (n) => {
                if (n === 0) return "0";
                if (Number.isInteger(n)) return n.toString();
                return n.toFixed(2);
              };
              return (
                <div
                  key={i}
                  className={`conv-filter-cell ${k > 0 ? "conv-filter-cell--pos" : k < 0 ? "conv-filter-cell--neg" : "conv-filter-cell--zero"}`}
                >
                  {fmt(k)}
                </div>
              );
            })}
          </div>
        </div>

        <div className="conv-arrow">→</div>

        {/* Output feature map */}
        <div className="conv-grid-section">
          <div className="conv-grid-section-label">Output (6×6)</div>
          <div className="conv-grid" style={{ gridTemplateColumns: `repeat(${OUT_W}, 1fr)` }}>
            {outputMap.map((v, i) => {
              const r = Math.floor(i / OUT_W), c = i % OUT_W;
              const isCurrent = started && r === outRow && c === outCol;
              return (
                <div
                  key={i}
                  className={`conv-cell ${isCurrent ? "conv-cell--cursor" : ""}`}
                  style={{
                    ...grayStyle(started && i <= curStep ? v : 200),
                    minWidth: 36,
                    minHeight: 36,
                    opacity: started && i <= curStep ? 1 : 0.2,
                  }}
                >
                  {started && i <= curStep && (
                    <span style={{ fontSize: 8, color: v > 128 ? "rgba(0,0,0,0.35)" : "rgba(255,255,255,0.45)" }}>
                      {v}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Math box */}
      {started && (
        <div className="conv-math-box">
          <div style={{ marginBottom: 4, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.6px", color: "var(--text-faint)" }}>
            At position (row {outRow}, col {outCol})
          </div>
          {mathLines.map((line, i) => (
            <div key={i}>{line}</div>
          ))}
          <div style={{ borderTop: "1px solid var(--border)", marginTop: 6, paddingTop: 6, fontWeight: 700 }}>
            Sum = {rawVal.toFixed(1)} → normalized to {outputMap[curStep]}
          </div>
        </div>
      )}

      {/* Step controls */}
      <div className="conv-step-nav">
        <button
          className="btn btn--primary"
          disabled={started && curStep >= maxSteps - 1}
          onClick={() => setStep((s) => (s === null ? 0 : Math.min(s + 1, maxSteps - 1)))}
        >
          {!started ? "Start stepping →" : curStep >= maxSteps - 1 ? "Done ✓" : "Next position →"}
        </button>
        {started && (
          <button className="btn btn--ghost btn--sm" onClick={() => setStep(null)}>
            Reset
          </button>
        )}
        {started && (
          <span className="conv-pos-label">
            Position {curStep + 1} / {maxSteps}
          </span>
        )}
      </div>
    </div>
  );
}
