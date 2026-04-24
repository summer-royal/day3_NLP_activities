import { useState } from "react";
import TrainingDemo from "./training/TrainingDemo.jsx";
import ConceptRecap from "../components/ConceptRecap.jsx";

const STEPS = [
  { id: "demo", label: "Train It" },
  { id: "recap", label: "Recap" },
];

export default function Training() {
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
        {current.id === "demo" && (
          <>
            <div className="section-head">
              <h3>Watch a network learn from scratch</h3>
              <p>
                The network starts with random weights — it has no idea what it's doing.
                Each training epoch runs through all 20 data points, measures the error,
                and nudges every weight a small step in the right direction. Watch the
                decision boundary evolve and the loss curve fall.
              </p>
            </div>
            <TrainingDemo />
          </>
        )}

        {current.id === "recap" && <ConceptRecap id="training" />}
      </div>
    </div>
  );
}
