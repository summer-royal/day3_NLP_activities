import { useState } from "react";
import FilterDemo from "./convolutions/FilterDemo.jsx";
import ConceptRecap from "../components/ConceptRecap.jsx";

const STEPS = [
  { id: "step", label: "One Filter" },
  { id: "compare", label: "Compare Filters" },
  { id: "recap", label: "Recap" },
];

export default function Convolutions() {
  const [stepIdx, setStepIdx] = useState(0);
  const current = STEPS[stepIdx];

  return (
    <div className="eliza">
      <div className="eliza__stepper">
        {STEPS.map((s, i) => (
          <button
            key={s.id}
            className={`eliza__step ${i === stepIdx ? "eliza__step--active" : ""}`}
            onClick={() => setStepIdx(i)}
          >
            <span className="eliza__step-num">0{i + 1}</span>
            {s.label}
          </button>
        ))}
      </div>

      <div className="eliza__stage">
        {current.id === "step" && (
          <>
            <div className="section-head">
              <h3>A filter slides across the image one position at a time</h3>
              <p>
                At each position, the filter multiplies its 9 weights by the 9 underlying pixel values
                and sums the results. That single number becomes one pixel in the output — the <strong>feature map</strong>.
                Click <strong>Start stepping</strong> to watch it happen.
              </p>
            </div>
            <FilterDemo mode="step" />
          </>
        )}

        {current.id === "compare" && (
          <>
            <div className="section-head">
              <h3>Different filters detect different things</h3>
              <p>
                Switch between the four filters and step through the same image each time.
                Notice how each filter produces a completely different feature map from the same input.
              </p>
            </div>
            <FilterDemo mode="compare" />
            <div style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 12,
              marginTop: 4,
            }}>
              {[
                { title: "Edge detectors", body: "Horizontal and vertical edge filters produce high values (bright pixels in the output) exactly where brightness changes sharply. They find the boundaries of objects." },
                { title: "Blur", body: "The blur filter replaces each pixel with the average of its 3×3 neighborhood. Edges get smeared. Used in preprocessing to reduce noise before applying an edge detector." },
                { title: "Sharpen", body: "Sharpen amplifies differences. Center pixel × 5, neighbors × −1. Edges pop out brighter. Flat regions are unchanged." },
                { title: "CNNs learn their own filters", body: "In a real CNN, the filter weights aren't hand-designed — they're learned from training data. Early layers tend to learn edge-like filters; deeper layers learn textures, shapes, and object parts." },
              ].map(({ title, body }) => (
                <div
                  key={title}
                  style={{
                    padding: "14px 16px",
                    background: "var(--bg-elevated)",
                    border: "1px solid var(--border)",
                    borderRadius: 10,
                    fontSize: 13,
                    lineHeight: 1.6,
                    color: "var(--text-muted)",
                  }}
                >
                  <strong style={{ color: "var(--text)", display: "block", marginBottom: 4 }}>{title}</strong>
                  {body}
                </div>
              ))}
            </div>
          </>
        )}

        {current.id === "recap" && <ConceptRecap id="convolutions" />}
      </div>
    </div>
  );
}
