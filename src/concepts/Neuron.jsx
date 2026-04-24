import { useState, useEffect } from "react";
import { QUESTIONS } from "./neuron/questions.js";
import { uid, randomValues, classify } from "./neuron/neuronMath.js";
import InputBuilder from "./neuron/InputBuilder.jsx";
import NeuronWalkthrough from "./neuron/NeuronWalkthrough.jsx";
import PerceptronSVG from "./neuron/PerceptronSVG.jsx";
import ConceptRecap from "../components/ConceptRecap.jsx";

const STEPS = [
  { id: "pick", label: "Pick a Question" },
  { id: "weights", label: "Set Weights" },
  { id: "run", label: "Run the Math" },
  { id: "recap", label: "Recap" },
];

const CUSTOM_ID = "custom";

function buildInputs(q) {
  return q.suggestions.slice(0, 3).map((s) => ({
    id: uid(),
    text: s.text,
    weight: s.sign === "pos" ? 2 : -2,
  }));
}

const WHATS_HAPPENING = (
  <>
    <p style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.6 }}>
      <strong style={{ color: "var(--text)" }}>Step 2 — Multiply:</strong> Each input value (0 or 1) is multiplied by its weight. An input value of 1 means "Yes/True" for that input; a value of 0 means "No/False." That's how the neuron "weighs" each piece of evidence.
    </p>
    <p style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.6, marginTop: 10 }}>
      <strong style={{ color: "var(--text)" }}>Step 3 — Sum:</strong> All the products get added together into one number.
    </p>
    <p style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.6, marginTop: 10 }}>
      <strong style={{ color: "var(--text)" }}>Step 5 — ReLU:</strong> max(0, x). If the total is negative, output 0. Otherwise, let the signal through. This is the <em>activation function</em> — the neuron's on/off switch.
    </p>
    <p style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.6, marginTop: 10 }}>
      <strong style={{ color: "var(--text)" }}>Step 6 — Decide:</strong> If the output is positive → yes. Zero → no.
    </p>
  </>
);

export default function Neuron() {
  const [stepIdx, setStepIdx] = useState(0);
  const [selectedQId, setSelectedQId] = useState(QUESTIONS[0].id);
  const [customQ, setCustomQ] = useState({ prompt: "", yesLabel: "Yes", noLabel: "No" });
  const [useCustom, setUseCustom] = useState(false);
  const [inputsByQ, setInputsByQ] = useState(() =>
    Object.fromEntries(QUESTIONS.map((q) => [q.id, buildInputs(q)]))
  );
  const [valuesByQ, setValuesByQ] = useState({});
  const [wtStep, setWtStep] = useState(0);
  const [gatesPassed, setGatesPassed] = useState(new Set());

  const question = useCustom
    ? { id: CUSTOM_ID, bias: 0, suggestions: [], ...customQ }
    : QUESTIONS.find((q) => q.id === selectedQId) || QUESTIONS[0];

  const inputs = inputsByQ[question.id] || [];
  const values = valuesByQ[question.id] || {};
  const result = inputs.length > 0 ? classify(inputs, values, question.bias) : null;

  useEffect(() => {
    if (!valuesByQ[question.id]) {
      setValuesByQ((prev) => ({ ...prev, [question.id]: randomValues(inputs) }));
    }
    setWtStep(0);
  }, [question.id]);

  const setInputs = (next) => {
    setInputsByQ((prev) => ({ ...prev, [question.id]: next }));
    setValuesByQ((prev) => {
      const existing = prev[question.id] || {};
      const vals = {};
      for (const i of next) vals[i.id] = existing[i.id] ?? 0;
      return { ...prev, [question.id]: vals };
    });
    setWtStep(0);
  };

  const passGate = (stepId) =>
    setGatesPassed((prev) => new Set([...prev, stepId]));

  const current = STEPS[stepIdx];
  const gatePassed = gatesPassed.has(current.id);

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

        {/* ── PICK A QUESTION ── */}

        {current.id === "pick" && !gatePassed && (
          <>
            <div className="section-head">
              <h3>A neuron answers a yes/no question</h3>
              <p>
                A single neuron is built to make one decision: yes or no. It takes in a set of
                inputs — each one a fact about the situation — and computes a weighted sum. Inputs
                that push toward "yes" get positive weights; inputs that push toward "no" get
                negative weights. The result is a number the neuron uses to decide.
              </p>
              <p style={{ marginTop: 8 }}>
                In the next step you'll pick which inputs matter and how much. Then you'll watch
                the neuron do its math.
              </p>
            </div>
            <div style={{ marginTop: 16 }}>
              <button className="btn btn--primary" onClick={() => passGate("pick")}>
                Continue →
              </button>
            </div>
          </>
        )}

        {current.id === "pick" && gatePassed && (
          <>
            <div className="section-head">
              <h3>Pick a question for your neuron to answer</h3>
              <p>Choose one of the examples below, or write your own yes/no question.</p>
            </div>
            <div className="neuron-questions-grid">
              {QUESTIONS.map((q) => (
                <button
                  key={q.id}
                  className={`neuron-q-btn ${!useCustom && q.id === selectedQId ? "neuron-q-btn--active" : ""}`}
                  onClick={() => { setSelectedQId(q.id); setUseCustom(false); }}
                >
                  {q.prompt}
                  <div className="neuron-q-meta">{q.yesLabel} · {q.noLabel}</div>
                </button>
              ))}
            </div>

            <div className="neuron-custom-q-section">
              <div className="neuron-custom-q-label">Or write your own question</div>
              <div className="neuron-custom-q-fields">
                <input
                  className={`neuron-input-text neuron-custom-q-prompt ${useCustom ? "neuron-input-text--active" : ""}`}
                  placeholder="e.g. Should I go to the gym today?"
                  value={customQ.prompt}
                  onChange={(e) => {
                    setCustomQ((c) => ({ ...c, prompt: e.target.value }));
                    if (e.target.value) setUseCustom(true);
                  }}
                />
                <div style={{ display: "flex", gap: 8 }}>
                  <input
                    className="neuron-input-text"
                    placeholder="Yes label (e.g. Go!)"
                    value={customQ.yesLabel === "Yes" ? "" : customQ.yesLabel}
                    style={{ flex: 1 }}
                    onChange={(e) => setCustomQ((c) => ({ ...c, yesLabel: e.target.value || "Yes" }))}
                  />
                  <input
                    className="neuron-input-text"
                    placeholder="No label (e.g. Skip it)"
                    value={customQ.noLabel === "No" ? "" : customQ.noLabel}
                    style={{ flex: 1 }}
                    onChange={(e) => setCustomQ((c) => ({ ...c, noLabel: e.target.value || "No" }))}
                  />
                </div>
              </div>
              {useCustom && customQ.prompt && (
                <div className="neuron-custom-q-active-badge">✓ Using your question</div>
              )}
            </div>

            <div style={{ marginTop: 16 }}>
              <button className="btn btn--primary" onClick={() => setStepIdx(1)}>
                Use this question →
              </button>
            </div>
          </>
        )}

        {/* ── SET WEIGHTS ── */}

        {current.id === "weights" && !gatePassed && (
          <>
            <div className="neuron-selected-prompt">
              <div className="neuron-selected-label">Your question</div>
              <div className="neuron-selected-text">{question.prompt || "(no question set)"}</div>
            </div>
            <div className="section-head">
              <h3>What is a weight?</h3>
              <p>
                Each input gets multiplied by a weight. That weight can be any number from negative
                infinity to positive infinity. As a reminder, you are asking a "yes" or "no" question,
                and a negative weight pushes the answer towards no. The magnitude of the weight (how
                large the weight is) determines how important the weight is.
              </p>
            </div>
            <div style={{ marginTop: 16 }}>
              <button className="btn btn--primary" onClick={() => passGate("weights")}>
                Continue →
              </button>
            </div>
          </>
        )}

        {current.id === "weights" && gatePassed && (
          <>
            <div className="neuron-selected-prompt">
              <div className="neuron-selected-label">Your question</div>
              <div className="neuron-selected-text">{question.prompt || "(no question set)"}</div>
            </div>
            <div className="section-head">
              <h3>Which inputs matter — and how much?</h3>
            </div>
            <div className="neuron-builder-layout">
              <div className="neuron-panel">
                <div className="neuron-panel-title">Inputs &amp; weights</div>
                <InputBuilder
                  inputs={inputs}
                  suggestions={question.suggestions}
                  onChange={setInputs}
                />
              </div>
              <div className="neuron-panel" style={{ background: "var(--bg-code)" }}>
                <div className="neuron-panel-title">What is a weight?</div>
                <p style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.6 }}>
                  Each input gets multiplied by a weight. That weight can be any number from
                  negative infinity to positive infinity. As a reminder, you are asking a "yes"
                  or "no" question, and a negative weight pushes the answer towards no. The
                  magnitude of the weight (how large the weight is) determines how important
                  the weight is.
                </p>
                <div style={{ marginTop: 16 }}>
                  <button className="btn btn--primary" onClick={() => setStepIdx(2)}>
                    Run the neuron →
                  </button>
                </div>
              </div>
            </div>

            <div className="neuron-diagram-card">
              <div className="neuron-panel-title" style={{ marginBottom: 10 }}>Your perceptron</div>
              <PerceptronSVG inputs={inputs} />
            </div>
          </>
        )}

        {/* ── RUN THE MATH ── */}

        {current.id === "run" && !gatePassed && (
          <>
            <div className="neuron-selected-prompt">
              <div className="neuron-selected-label">Your question</div>
              <div className="neuron-selected-text">{question.prompt || "(no question set)"}</div>
            </div>
            <div className="section-head">
              <h3>Running an example through your perceptron</h3>
              <p>
                We will now run your perceptron on an example to see how this network would classify
                your example. You can choose to make your own example by providing values for each
                input, or you can auto-generate an example.
              </p>
            </div>
            <div className="neuron-whats-happening">
              <div className="neuron-panel-title">What's happening</div>
              {WHATS_HAPPENING}
            </div>
            <div style={{ marginTop: 16 }}>
              <button className="btn btn--primary" onClick={() => passGate("run")}>
                Continue →
              </button>
            </div>
          </>
        )}

        {current.id === "run" && gatePassed && (
          <>
            <div className="neuron-selected-prompt">
              <div className="neuron-selected-label">Your question</div>
              <div className="neuron-selected-text">{question.prompt || "(no question set)"}</div>
            </div>
            <div className="section-head">
              <h3>Step through the computation</h3>
              <p>
                Click <strong>Start</strong> to walk through every step the neuron takes.
                Hit <strong>Random example</strong> to try different input combinations.
              </p>
            </div>
            <div className="neuron-builder-layout">
              <div className="neuron-panel">
                <div className="neuron-panel-title">The neuron thinks</div>
                <NeuronWalkthrough
                  question={question}
                  inputs={inputs}
                  values={values}
                  onValuesChange={(v) =>
                    setValuesByQ((prev) => ({ ...prev, [question.id]: v }))
                  }
                  step={wtStep}
                  onStep={setWtStep}
                />
              </div>
              <div className="neuron-panel" style={{ background: "var(--bg-code)" }}>
                <div className="neuron-panel-title" style={{ marginBottom: 10 }}>Your perceptron</div>
                <PerceptronSVG
                  inputs={inputs}
                  values={values}
                  step={wtStep}
                  result={result}
                  question={question}
                />
                <div style={{ marginTop: 16 }}>
                  <div className="neuron-panel-title" style={{ marginBottom: 8 }}>What's happening</div>
                  {WHATS_HAPPENING}
                </div>
              </div>
            </div>
          </>
        )}

        {current.id === "recap" && <ConceptRecap id="neuron" />}
      </div>
    </div>
  );
}
