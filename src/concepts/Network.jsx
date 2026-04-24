import { useState } from "react";
import { ScatterPlot, NetworkArchSVG } from "./network/NetworkDiagram.jsx";
import ForwardPass from "./network/ForwardPass.jsx";
import ConceptRecap from "../components/ConceptRecap.jsx";

const STEPS = [
  { id: "oneline", label: "One Line" },
  { id: "addlayer", label: "Add a Layer" },
  { id: "forward", label: "Follow the Signal" },
  { id: "recap", label: "Recap" },
];

export default function Network() {
  const [stepIdx, setStepIdx] = useState(0);
  const [lineAngle, setLineAngle] = useState(30);
  const [linePos, setLinePos] = useState(0.5);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const current = STEPS[stepIdx];

  const handleLineChange = (setter) => (e) => {
    setter(Number(e.target.value));
    setHasInteracted(true);
  };

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
        {current.id === "oneline" && (
          <>
            <div className="section-head">
              <h3>A single neuron can only draw one straight line</h3>
            </div>

            <div className="network-challenge">
              Can you move the decision boundary so that all the green circles are on one
              side of the line and all the orange squares are on the other side?
            </div>

            <div className="network-layout">
              <div className="network-panel">
                <div className="network-panel-title">The dataset</div>
                <div className="scatter-wrap">
                  <ScatterPlot
                    showBoundary={false}
                    lineAngle={lineAngle}
                    linePos={linePos}
                  />
                </div>
                <div className="legend-row">
                  <span className="legend-item">
                    <svg width={12} height={12}><circle cx={6} cy={6} r={5} fill="#2d7a3d" /></svg>
                    Class 0 (circles)
                  </span>
                  <span className="legend-item">
                    <svg width={12} height={12}><rect x={1} y={1} width={10} height={10} fill="#b8530a" /></svg>
                    Class 1 (squares)
                  </span>
                </div>

                <div className="network-line-controls">
                  <div className="network-line-control">
                    <span className="network-line-control-label">Rotate</span>
                    <input
                      type="range" min={-80} max={80} step={1}
                      value={lineAngle}
                      className="network-line-slider"
                      onChange={handleLineChange(setLineAngle)}
                    />
                    <span className="network-line-val">{lineAngle > 0 ? "+" : ""}{lineAngle}°</span>
                  </div>
                  <div className="network-line-control">
                    <span className="network-line-control-label">Shift</span>
                    <input
                      type="range" min={10} max={90} step={1}
                      value={Math.round(linePos * 100)}
                      className="network-line-slider"
                      onChange={handleLineChange((v) => setLinePos(v / 100))}
                    />
                  </div>
                </div>

                {hasInteracted && !showAnswer && (
                  <button
                    className="btn btn--ghost btn--sm"
                    style={{ marginTop: 14 }}
                    onClick={() => setShowAnswer(true)}
                  >
                    Do you want to see the correct answer?
                  </button>
                )}

                {showAnswer && (
                  <div className="network-reveal">
                    <strong>This was a trick question!</strong> No matter what diagonal line
                    on the scatter plot you try, there is no line that perfectly separates
                    the green circles from the orange squares. This is the issue with a
                    single-neuron network!
                  </div>
                )}
              </div>

              <div className="network-panel">
                <div className="network-panel-title">Single neuron</div>
                <div className="network-svg-wrap">
                  <NetworkArchSVG />
                </div>
                <div className="network-caption">
                  A single neuron with 2 inputs has only <strong>3 parameters</strong> (w₁, w₂, bias).
                  That's exactly enough to define one line — and no more.
                </div>
                <div style={{ marginTop: 12, padding: "12px 14px", background: "var(--bg-code)", borderRadius: 8, fontSize: 13, color: "var(--text-muted)", lineHeight: 1.6 }}>
                  The green circles cluster top-left and bottom-right. The orange squares cluster top-right and bottom-left. No single straight line can split them.
                </div>
              </div>
            </div>
          </>
        )}

        {current.id === "addlayer" && (
          <>
            <div className="section-head">
              <h3>A hidden layer lets the network draw curves</h3>
              <p>
                Adding one hidden layer with 2 neurons gives the network enough freedom to
                correctly separate all 4 clusters. The colored background shows the network's
                decision regions — orange = Class 1, green = Class 0.
              </p>
            </div>
            <div className="network-layout">
              <div className="network-panel">
                <div className="network-panel-title">With a hidden layer</div>
                <div className="scatter-wrap">
                  <ScatterPlot showBoundary={true} />
                </div>
                <div className="legend-row">
                  <span className="legend-item">
                    <svg width={12} height={12}><circle cx={6} cy={6} r={5} fill="#2d7a3d" /></svg>
                    Class 0
                  </span>
                  <span className="legend-item">
                    <svg width={12} height={12}><rect x={1} y={1} width={10} height={10} fill="#b8530a" /></svg>
                    Class 1
                  </span>
                </div>
                <div className="scatter-caption">
                  Every point now lands in the correct colored region. The network learned two separate linear boundaries and combined them.
                </div>
              </div>
              <div className="network-panel">
                <div className="network-panel-title">2-layer network (2 → 2 → 1)</div>
                <div className="network-svg-wrap">
                  <NetworkArchSVG />
                </div>
                <div className="network-caption">
                  <strong>H1</strong> detects "both inputs are high" (top-right region).
                  <strong> H2</strong> detects "both inputs are low" (bottom-left region).
                  The output fires if either H1 or H2 fires.
                </div>
                <div style={{ marginTop: 12, padding: "12px 14px", background: "var(--bg-code)", borderRadius: 8, fontSize: 13, color: "var(--text-muted)", lineHeight: 1.6 }}>
                  Each hidden neuron still draws one line — but the output neuron combines those two lines into a more complex shape.
                </div>
              </div>
            </div>
          </>
        )}

        {current.id === "forward" && (
          <>
            <div className="section-head">
              <h3>Step through the math yourself</h3>
              <p>
                Pick a point from the top-right cluster (Class 1) and follow its journey through
                both hidden neurons to the output.
              </p>
            </div>
            <ForwardPass />
          </>
        )}

        {current.id === "recap" && <ConceptRecap id="network" />}
      </div>
    </div>
  );
}
