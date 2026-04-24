import { classify, fmt, randomValues } from "./neuronMath.js";

const STEP_LABELS = ["1. Inputs", "2. Multiply", "3. Sum", "4. + Bias", "5. ReLU", "6. Decide"];

export default function NeuronWalkthrough({ question, inputs, values, onValuesChange, step, onStep }) {
  const canRun = inputs.length > 0;
  const result = canRun ? classify(inputs, values, question.bias) : null;

  const showMultiply = step >= 1;
  const showSum = step >= 2;
  const showBias = step >= 3;
  const showRelu = step >= 4;
  const showDecision = step >= 5;

  const products = inputs.map((inp) => ({
    ...inp,
    val: values[inp.id] ?? 0,
    product: (values[inp.id] ?? 0) * inp.weight,
  }));

  const handleShuffle = () => {
    onValuesChange(randomValues(inputs));
    onStep(1);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {/* Step badges */}
      <div className="neuron-wt-steps">
        {STEP_LABELS.map((label, i) => (
          <span
            key={i}
            className={`neuron-wt-badge ${
              i === step ? "neuron-wt-badge--active" : i < step ? "neuron-wt-badge--done" : ""
            }`}
          >
            {label}
          </span>
        ))}
      </div>

      {/* Example selector */}
      <div style={{ display: "flex", gap: 6 }}>
        <button className="btn btn--sm" onClick={handleShuffle}>
          🎲 Random example
        </button>
        {step > 0 && (
          <button className="btn btn--ghost btn--sm" onClick={() => onStep(0)}>
            Reset
          </button>
        )}
      </div>

      {!canRun ? (
        <div style={{ textAlign: "center", padding: "24px 0", color: "var(--text-faint)", fontSize: 13 }}>
          Add at least one input to run the neuron.
        </div>
      ) : (
        <>
          {/* Inputs */}
          <div>
            <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.6px", color: "var(--text-faint)", marginBottom: 6 }}>
              Inputs (1 = true, 0 = false)
            </div>
            <div className="neuron-wt-inputs">
              {inputs.map((inp) => {
                const v = values[inp.id] ?? 0;
                return (
                  <div
                    key={inp.id}
                    className={`neuron-wt-input-row ${v === 1 ? "neuron-wt-input-row--yes" : ""}`}
                  >
                    <span className="neuron-wt-input-name">{inp.text || "(no label)"}</span>
                    <span className={`neuron-wt-input-val ${v === 1 ? "neuron-wt-input-val--yes" : "neuron-wt-input-val--no"}`}>
                      {v} {v === 1 ? "(yes)" : "(no)"}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Multiply */}
          {showMultiply && (
            <div className="neuron-wt-math">
              <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.6px", color: "var(--text-faint)" }}>
                Multiply each input × its weight
              </div>
              <div className="neuron-wt-products">
                {products.map((p) => (
                  <div key={p.id} className="neuron-wt-product-row">
                    <span className="neuron-wt-product-name">{p.text || "(no label)"}</span>
                    <span style={{ fontFamily: "ui-monospace, monospace", fontSize: 13 }}>
                      <span>{p.val}</span>
                      <span style={{ color: "var(--text-faint)" }}> × </span>
                      <span style={{ color: p.weight > 0 ? "#2d7a3d" : p.weight < 0 ? "var(--error)" : "var(--text-faint)", fontWeight: 600 }}>
                        {fmt(p.weight)}
                      </span>
                      <span style={{ color: "var(--text-faint)" }}> = </span>
                      <span style={{ fontWeight: 700, color: p.product > 0 ? "#2d7a3d" : p.product < 0 ? "var(--error)" : "var(--text-faint)" }}>
                        {fmt(p.product)}
                      </span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Weighted sum */}
          {showSum && (
            <ResultRow
              label="Weighted sum"
              formula={products.map((p) => fmt(p.product)).join(" + ").replace(/\+ -/g, "− ")}
              value={result.weightedSum}
            />
          )}

          {/* Bias */}
          {showBias && (
            <ResultRow
              label={`+ Bias (${fmt(question.bias)})`}
              formula={`${fmt(result.weightedSum)} + ${fmt(question.bias)}`}
              value={result.preActivation}
              hint="The bias shifts the threshold — like the y-intercept in y = mx + b"
            />
          )}

          {/* ReLU */}
          {showRelu && (
            <ResultRow
              label="ReLU: max(0, x)"
              formula={`max(0, ${fmt(result.preActivation)})`}
              value={result.output}
              accent
            />
          )}

          {/* Decision */}
          {showDecision && (
            <div className={`neuron-decision ${result.decision === "yes" ? "neuron-decision--yes" : "neuron-decision--no"}`}>
              <div className="neuron-decision-label">Decision</div>
              <div className="neuron-decision-verdict" style={{ color: result.decision === "yes" ? "#2d7a3d" : "var(--error)" }}>
                {result.decision === "yes" ? question.yesLabel : question.noLabel}
              </div>
              <div className="neuron-decision-sub">
                {result.output > 0
                  ? `Since the output (${fmt(result.output)}) is greater than 0, the decision is "${question.yesLabel}."`
                  : `Since the output is not greater than 0 (ReLU clamped the negative pre-activation to 0), the decision is "${question.noLabel}."`
                }
              </div>
            </div>
          )}

          {/* Nav */}
          <div className="neuron-wt-nav">
            <span className="neuron-wt-counter">Step {Math.min(step + 1, 6)} / 6</span>
            <button
              className="btn btn--primary"
              disabled={step >= 5}
              onClick={() => onStep(Math.min(step + 1, 5))}
            >
              {step === 0 ? "Start" : step >= 5 ? "Done ✓" : "Next step →"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

function ResultRow({ label, formula, value, accent, hint }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 8 }}>
        <span style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.6px", color: "var(--text-faint)" }}>
          {label}
        </span>
        {hint && <span style={{ fontSize: 11, color: "var(--text-faint)", fontStyle: "italic" }}>{hint}</span>}
      </div>
      <div className={`neuron-wt-result ${accent ? "neuron-wt-result--accent" : ""}`}>
        <span style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.5px", color: "var(--text-muted)" }}>result</span>
        <span className="neuron-wt-result-formula">{formula}</span>
        <span className={`neuron-wt-result-val ${accent ? "neuron-wt-result-val--accent" : ""}`}>
          {fmt(value)}
        </span>
      </div>
    </div>
  );
}
