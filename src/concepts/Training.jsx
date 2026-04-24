import { useState } from "react";
import ConceptRecap from "../components/ConceptRecap.jsx";

const TF_URL =
  "https://playground.tensorflow.org/#activation=tanh&batchSize=10&dataset=circle&regDataset=reg-plane&learningRate=0.03&regularizationRate=0&noise=0&networkShape=4,2&seed=0.42821&showTestData=false&discretize=false&percTrainData=50&x=true&y=true&xTimesY=false&xSquared=false&ySquared=false&cosX=false&sinX=false&cosY=false&sinY=false&collectStats=false&problem=classification&initZero=false&hideText=false&noise_hide=true&regularization_hide=true&regularizationRate_hide=true&activation_hide=true&batchSize_hide=true";

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

      <div className="eliza__stage" style={{ padding: 0, gap: 0 }}>
        {current.id === "demo" && (
          <iframe
            src={TF_URL}
            title="TensorFlow Playground"
            style={{
              flex: 1,
              width: "100%",
              border: "none",
              minHeight: 0,
            }}
            allow="accelerometer"
          />
        )}

        {current.id === "recap" && (
          <div style={{ padding: "20px 24px" }}>
            <ConceptRecap id="training" />
          </div>
        )}
      </div>
    </div>
  );
}
