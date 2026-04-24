import { useState } from "react";
import { FORWARD_EXAMPLE } from "./networkData.js";
import { NetworkArchSVG } from "./NetworkDiagram.jsx";

export default function ForwardPass() {
  const [step, setStep] = useState(0);
  const ex = FORWARD_EXAMPLE;
  const totalSteps = ex.steps.length;
  const done = step >= totalSteps;

  const h1Val = step >= 1 ? ex.steps[0].value : null;
  const h2Val = step >= 2 ? ex.steps[1].value : null;
  const outVal = step >= 3 ? ex.steps[2].value : null;

  const highlightLayer = step === 0 ? 0 : step <= 2 ? 1 : 2;

  return (
    <div className="fwd-layout">
      <div className="fwd-panel">
        <div className="fwd-panel-title">Example point: ({ex.x1}, {ex.x2}) — Class 1</div>

        <div style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 8 }}>
            The network processes this point layer by layer. Each step computes one neuron's output.
          </div>
          <div style={{ display: "flex", gap: 16, fontSize: 13, color: "var(--text-muted)" }}>
            <span><strong style={{ color: "var(--text)" }}>x₁</strong> = {ex.x1}</span>
            <span><strong style={{ color: "var(--text)" }}>x₂</strong> = {ex.x2}</span>
          </div>
        </div>

        <div className="fwd-steps">
          {step === 0 && (
            <div className="fwd-step fwd-step--active">
              <div className="fwd-step-head">
                <span className="fwd-step-num">Input layer</span>
                <span className="fwd-step-name">Feed in the values</span>
              </div>
              <div className="fwd-step-formula">x₁ = {ex.x1},  x₂ = {ex.x2}</div>
            </div>
          )}

          {ex.steps.map((s, i) => {
            const isActive = step === i + 1;
            const isDone = step > i + 1;
            return (
              <div
                key={i}
                className={`fwd-step ${isActive ? "fwd-step--active" : ""} ${isDone ? "fwd-step--done" : ""}`}
                style={{ opacity: step < i + 1 ? 0.35 : 1, transition: "opacity 200ms" }}
              >
                <div className="fwd-step-head">
                  <span className="fwd-step-num">Step {i + 1}</span>
                  <span className="fwd-step-name">{s.name}</span>
                </div>
                {(isActive || isDone) && (
                  <>
                    <div className="fwd-step-formula">{s.formulaFull}</div>
                    <div className="fwd-step-result">{s.result}</div>
                  </>
                )}
                {!isActive && !isDone && (
                  <div className="fwd-step-formula" style={{ opacity: 0.5 }}>{s.formula}</div>
                )}
              </div>
            );
          })}

          {done && (
            <div style={{
              padding: "16px 18px",
              borderRadius: 10,
              background: "rgba(184,83,10,0.08)",
              border: "2px solid var(--accent)",
              textAlign: "center",
            }}>
              <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.7px", color: "var(--text-muted)", marginBottom: 6 }}>
                Final prediction
              </div>
              <div style={{ fontSize: 22, fontWeight: 700, color: "var(--accent)" }}>
                Class 1 ✓
              </div>
              <div style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 4 }}>
                Output ≈ 0.62 → above 0.5 → Class 1 (correct!)
              </div>
            </div>
          )}
        </div>

        <div className="fwd-nav">
          <span className="fwd-counter">Step {Math.min(step + 1, totalSteps + 1)} / {totalSteps + 1}</span>
          <div style={{ display: "flex", gap: 8 }}>
            {step > 0 && (
              <button className="btn btn--ghost btn--sm" onClick={() => setStep(0)}>
                Reset
              </button>
            )}
            <button
              className="btn btn--primary"
              disabled={done}
              onClick={() => setStep((s) => Math.min(s + 1, totalSteps))}
            >
              {step === 0 ? "Start →" : done ? "Done ✓" : "Next →"}
            </button>
          </div>
        </div>
      </div>

      <div className="fwd-panel" style={{ background: "var(--bg-code)" }}>
        <div className="fwd-panel-title">Network diagram</div>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <NetworkArchSVG
            highlightLayer={highlightLayer}
            h1Val={h1Val}
            h2Val={h2Val}
            outVal={outVal}
          />
        </div>

        <div style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.6, marginTop: 12 }}>
          {step === 0 && "The inputs x₁ and x₂ are fed directly into both hidden neurons simultaneously."}
          {step === 1 && 'H1 is a "both high" detector. It fires when both x\u2081 and x\u2082 are large.'}
          {step === 2 && 'H2 is a "both low" detector. It fires when both x\u2081 and x\u2082 are small.'}
          {step >= 3 && "The output neuron combines H1 and H2. Either firing (both-high OR both-low) produces a positive output → Class 1."}
        </div>
      </div>
    </div>
  );
}
