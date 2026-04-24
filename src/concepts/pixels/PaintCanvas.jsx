import { useState } from "react";
import { OBJECTS, DEFAULT_COLORS } from "./pixelObjects.js";

const BG = { r: 248, g: 249, b: 250 };

function clamp(v) {
  return Math.min(255, Math.max(0, parseInt(v) || 0));
}

function brightness(r, g, b) {
  return (r * 299 + g * 587 + b * 114) / 1000;
}

export default function PaintCanvas({ colors, setColors, selectedId, setSelectedId }) {
  const [numView, setNumView] = useState(false);

  const obj = OBJECTS.find((o) => o.id === selectedId) || OBJECTS[0];

  const handleColorChange = (zoneIdx, channel, val) => {
    const next = colors.map((c, i) =>
      i === zoneIdx ? { ...c, [channel]: clamp(val) } : c
    );
    setColors(next);
  };

  const resetColors = () => setColors(DEFAULT_COLORS.map((c) => ({ ...c })));

  return (
    <div className="pixel-layout">
      {/* Left: controls */}
      <div>
        <div className="pixel-objects-label">Pick an object</div>
        <div className="pixel-objects-grid">
          {OBJECTS.map((o) => (
            <button
              key={o.id}
              className={`pixel-obj-btn ${o.id === selectedId ? "pixel-obj-btn--active" : ""}`}
              onClick={() => {
                setSelectedId(o.id);
                resetColors();
              }}
            >
              <span className="pixel-obj-emoji">{o.emoji}</span>
              {o.name}
            </button>
          ))}
        </div>

        <div className="pixel-colors-label">Set the colors</div>
        <div className="pixel-color-zones">
          {obj.colorLabels.map((label, i) => {
            const c = colors[i];
            return (
              <div key={i} className="pixel-zone">
                <div className="pixel-zone-name">
                  {i + 1}. {label}
                </div>
                <div className="pixel-rgb-row">
                  <div className="pixel-rgb-inputs">
                    {["r", "g", "b"].map((ch) => (
                      <input
                        key={ch}
                        type="number"
                        min={0}
                        max={255}
                        value={c[ch]}
                        onChange={(e) => handleColorChange(i, ch, e.target.value)}
                        className="pixel-rgb-input"
                      />
                    ))}
                  </div>
                  <div
                    className="pixel-swatch"
                    style={{ backgroundColor: `rgb(${c.r},${c.g},${c.b})` }}
                  />
                </div>
                <div className="pixel-rgb-labels">
                  <span>R</span>
                  <span>G</span>
                  <span>B</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right: canvas */}
      <div className="pixel-canvas-wrap">
        <div className="pixel-canvas-bar">
          <span className="pixel-canvas-label">
            <span className="pixel-live-dot" />
            Live raster view
          </span>
          <div className="pixel-toggle-row">
            <button
              className={`pixel-toggle-btn ${!numView ? "pixel-toggle-btn--active" : ""}`}
              onClick={() => setNumView(false)}
            >
              Colors
            </button>
            <button
              className={`pixel-toggle-btn ${numView ? "pixel-toggle-btn--active" : ""}`}
              onClick={() => setNumView(true)}
            >
              Numbers
            </button>
          </div>
        </div>

        <div className="pixel-grid">
          {obj.grid.map((val, idx) => {
            const color = val > 0 ? colors[val - 1] : BG;
            const { r, g, b } = color;
            const bg = `rgb(${r},${g},${b})`;
            const dark = brightness(r, g, b) < 128;

            if (numView && val > 0) {
              return (
                <div
                  key={idx}
                  className="pixel-cell pixel-cell--num"
                  style={{ backgroundColor: bg }}
                >
                  <span
                    className="pixel-num"
                    style={{ color: dark ? "rgba(255,255,255,0.55)" : "rgba(0,0,0,0.4)" }}
                  >
                    {r}
                    <br />
                    {g}
                    <br />
                    {b}
                  </span>
                </div>
              );
            }

            return (
              <div
                key={idx}
                className="pixel-cell"
                style={{ backgroundColor: bg }}
              />
            );
          })}
        </div>

        <div className="pixel-hint">
          {numView
            ? "Each colored cell shows its R, G, B values. Three numbers = one pixel."
            : "Adjust the RGB sliders on the left to paint the image. Then toggle to Numbers to see what the computer stores."}
        </div>
      </div>
    </div>
  );
}
