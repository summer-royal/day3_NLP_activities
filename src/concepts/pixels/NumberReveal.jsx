import { useState } from "react";
import { OBJECTS } from "./pixelObjects.js";

const BG = { r: 248, g: 249, b: 250 };

function brightness(r, g, b) {
  return (r * 299 + g * 587 + b * 114) / 1000;
}

function toGray(r, g, b) {
  return Math.round(0.299 * r + 0.587 * g + 0.114 * b);
}

export default function NumberReveal({ colors, selectedId }) {
  const [mode, setMode] = useState("rgb"); // "rgb" | "gray" | "red" | "green" | "blue"
  const obj = OBJECTS.find((o) => o.id === selectedId) || OBJECTS[0];

  const cellStyle = (val) => {
    if (val === 0) return { bg: `rgb(248,249,250)`, nums: null };
    const c = colors[val - 1];
    const { r, g, b } = c;
    if (mode === "gray") {
      const v = toGray(r, g, b);
      return { bg: `rgb(${v},${v},${v})`, nums: [`${v}`] };
    }
    if (mode === "red") return { bg: `rgb(${r},0,0)`, nums: [`${r}`] };
    if (mode === "green") return { bg: `rgb(0,${g},0)`, nums: [`${g}`] };
    if (mode === "blue") return { bg: `rgb(0,0,${b})`, nums: [`${b}`] };
    return { bg: `rgb(${r},${g},${b})`, nums: [`${r}`, `${g}`, `${b}`] };
  };

  const modes = [
    { id: "rgb", label: "RGB" },
    { id: "red", label: "Red only" },
    { id: "green", label: "Green only" },
    { id: "blue", label: "Blue only" },
    { id: "gray", label: "Grayscale" },
  ];

  return (
    <div className="num-reveal-layout">
      <div className="num-reveal-grid-wrap">
        <div className="pixel-toggle-row" style={{ flexWrap: "wrap", gap: 4 }}>
          {modes.map((m) => (
            <button
              key={m.id}
              className={`pixel-toggle-btn ${mode === m.id ? "pixel-toggle-btn--active" : ""}`}
              onClick={() => setMode(m.id)}
            >
              {m.label}
            </button>
          ))}
        </div>

        <div className="pixel-grid">
          {obj.grid.map((val, idx) => {
            const { bg, nums } = cellStyle(val);
            const dark = (() => {
              if (val === 0) return false;
              const c = colors[val - 1];
              if (mode === "gray") return toGray(c.r, c.g, c.b) < 128;
              if (mode === "red") return c.r < 128;
              if (mode === "green") return c.g < 128;
              if (mode === "blue") return c.b < 128;
              return brightness(c.r, c.g, c.b) < 128;
            })();
            const textColor = dark ? "rgba(255,255,255,0.65)" : "rgba(0,0,0,0.45)";

            return (
              <div
                key={idx}
                className="pixel-cell pixel-cell--num"
                style={{ backgroundColor: bg }}
              >
                {nums && val > 0 && (
                  <span className="pixel-num" style={{ color: textColor }}>
                    {nums.join("\n").split("\n").map((n, i) => (
                      <span key={i} style={{ display: "block" }}>{n}</span>
                    ))}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="num-reveal-info">
        <div className="num-reveal-card">
          <h3>What you're seeing</h3>
          <p>
            {mode === "rgb" && "Each pixel stores three numbers — R, G, B — each from 0 to 255. A full-color image is nothing more than a 2D grid of these triplets."}
            {mode === "red" && "Only the red channel is shown. Bright = high red value. Dark = low red value. The computer stores this as one matrix of numbers."}
            {mode === "green" && "Only the green channel. Humans are most sensitive to green light, so it gets the most weight in how we perceive brightness."}
            {mode === "blue" && "Only the blue channel. Notice how the same pixel looks different in each channel."}
            {mode === "gray" && "Grayscale collapses three numbers into one: 0.299R + 0.587G + 0.114B. Many CV algorithms work in grayscale to cut memory and computation by 3×."}
          </p>
          {mode === "gray" && (
            <code className="pixel-formula">gray = 0.299 × R + 0.587 × G + 0.114 × B</code>
          )}
        </div>

        <div className="num-reveal-card">
          <h3>How much data is an image?</h3>
          <p>
            This 12×12 grid has <strong>144 pixels</strong>. Each pixel = 3 numbers = 3 bytes.
            Total: <strong>432 bytes</strong>.
          </p>
          <p>
            A typical phone photo (12 megapixels) stores <strong>36 million numbers</strong> per frame —
            before any compression.
          </p>
        </div>

        <div className="num-reveal-card">
          <h3>Why does this matter for AI?</h3>
          <p>
            A neural network's first layer takes these pixel values as input.
            For a 224×224 color image (common in modern models), that's
            <strong> 150,528 numbers</strong> fed in at once — one per neuron in the first layer.
          </p>
        </div>
      </div>
    </div>
  );
}
