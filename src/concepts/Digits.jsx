import { useState } from "react";
import DrawingCanvas from "./digits/DrawingCanvas.jsx";
import NetworkSchematic from "./digits/NetworkSchematic.jsx";
import FeatureMaps from "./digits/FeatureMaps.jsx";
import ConceptRecap from "../components/ConceptRecap.jsx";

const STEPS = [
  { id: "draw", label: "Draw a Digit" },
  { id: "network", label: "See the Network" },
  { id: "recap", label: "Recap" },
];

export default function Digits() {
  const [stepIdx, setStepIdx] = useState(0);
  const [result, setResult] = useState(null);
  const current = STEPS[stepIdx];

  const handleResult = (data) => {
    setResult(data);
    setStepIdx(1);
  };

  const handleClear = () => {
    setResult(null);
  };

  return (
    <div className="eliza">
      <div className="eliza__stepper">
        {STEPS.map((s, i) => (
          <button
            key={s.id}
            className={`eliza__step ${i === stepIdx ? "eliza__step--active" : ""}`}
            onClick={() => setStepIdx(i)}
            disabled={i === 1 && !result}
          >
            <span className="eliza__step-num">0{i + 1}</span>
            {s.label}
          </button>
        ))}
      </div>

      <div className="eliza__stage">
        {current.id === "draw" && (
          <>
            <div className="section-head">
              <h3>Draw a digit and let the CNN classify it</h3>
              <p>
                Draw any digit from 0 to 9. The model was trained on 60,000 handwritten
                examples from the MNIST dataset. After it classifies your drawing, switch
                to "See the Network" to explore what happened inside.
              </p>
            </div>
            <div className="digit-draw-layout">
              <DrawingCanvas onResult={handleResult} onClear={handleClear} />
              {result && (
                <div className="digit-draw-preview">
                  <div className="digit-draw-result">
                    Predicted: <strong className="digit-draw-pred">{result.prediction}</strong>
                    <span className="digit-confidence">({(result.confidence * 100).toFixed(1)}% confidence)</span>
                  </div>
                  <button className="btn btn--primary btn--sm" style={{ marginTop: 8 }} onClick={() => setStepIdx(1)}>
                    See what the network did →
                  </button>
                </div>
              )}
            </div>
          </>
        )}

        {current.id === "network" && result && (
          <>
            <div className="section-head">
              <h3>What the network saw</h3>
              <p>
                The diagram below shows the CNN as a chain of nodes. Each layer
                transforms the image into a new representation. Node brightness
                shows activation strength; the output nodes are sized by probability.
              </p>
            </div>
            <NetworkSchematic result={result} />
            <div className="section-head" style={{ marginTop: 24 }}>
              <h3>Feature maps and probabilities</h3>
              <p>
                Each convolutional filter produces a feature map — a new image
                highlighting where that filter's pattern appeared. The final column
                shows the probability the network assigned to each digit.
              </p>
            </div>
            <FeatureMaps result={result} />
          </>
        )}

        {current.id === "network" && !result && (
          <div style={{ padding: "40px 0", textAlign: "center", color: "var(--text-muted)" }}>
            Draw a digit first to see the network visualization.
          </div>
        )}

        {current.id === "recap" && <ConceptRecap id="digits" />}
      </div>
    </div>
  );
}
