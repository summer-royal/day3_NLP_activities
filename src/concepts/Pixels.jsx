import { useState } from "react";
import PaintCanvas from "./pixels/PaintCanvas.jsx";
import NumberReveal from "./pixels/NumberReveal.jsx";
import { DEFAULT_COLORS } from "./pixels/pixelObjects.js";
import ConceptRecap from "../components/ConceptRecap.jsx";

const STEPS = [
  { id: "paint", label: "Paint It" },
  { id: "numbers", label: "See the Numbers" },
  { id: "recap", label: "Recap" },
];

export default function Pixels() {
  const [stepIdx, setStepIdx] = useState(0);
  const [selectedId, setSelectedId] = useState("flower");
  const [colors, setColors] = useState(DEFAULT_COLORS.map((c) => ({ ...c })));

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
        {current.id === "paint" && (
          <>
            <div className="section-head">
              <h3>Images are grids of color values</h3>
              <p>
                Pick an object and set the RGB values for each color zone. Watch the pixel grid update in real time.
                When you're ready, click <strong>Numbers</strong> in the toggle to see what the computer actually stores.
              </p>
            </div>
            <PaintCanvas
              colors={colors}
              setColors={setColors}
              selectedId={selectedId}
              setSelectedId={setSelectedId}
            />
          </>
        )}

        {current.id === "numbers" && (
          <>
            <div className="section-head">
              <h3>Under the hood: every pixel is three numbers</h3>
              <p>
                Toggle between views to see how the same image looks as R, G, B channels separately — or collapsed
                into a single grayscale value.
              </p>
            </div>
            <NumberReveal colors={colors} selectedId={selectedId} />
          </>
        )}

        {current.id === "recap" && <ConceptRecap id="pixels" />}
      </div>
    </div>
  );
}
