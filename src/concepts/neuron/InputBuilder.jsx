import { uid } from "./neuronMath.js";

export default function InputBuilder({ inputs, suggestions, onChange }) {
  const update = (id, patch) =>
    onChange(inputs.map((i) => (i.id === id ? { ...i, ...patch } : i)));
  const remove = (id) => onChange(inputs.filter((i) => i.id !== id));
  const add = (text = "", weight = 1) =>
    onChange([...inputs, { id: uid(), text, weight }]);

  const used = new Set(inputs.map((i) => i.text.toLowerCase().trim()));
  const available = suggestions.filter(
    (s) => !used.has(s.text.toLowerCase().trim())
  );

  return (
    <div className="neuron-builder-panel">
      <div className="neuron-input-list">
        {inputs.map((inp, idx) => (
          <div key={inp.id} className="neuron-input-card">
            <div className="neuron-input-header">
              <span className="neuron-input-id">x{idx + 1}</span>
              <input
                className="neuron-input-text"
                value={inp.text}
                placeholder="e.g. I'm hungry"
                onChange={(e) => update(inp.id, { text: e.target.value })}
              />
              <button className="neuron-remove-btn" onClick={() => remove(inp.id)}>
                ×
              </button>
            </div>
            <div className="neuron-weight-row">
              <span className="neuron-weight-label">weight</span>
              <input
                type="range"
                className="neuron-slider"
                min={-10}
                max={10}
                step={0.5}
                value={inp.weight}
                onChange={(e) => update(inp.id, { weight: parseFloat(e.target.value) })}
              />
              <span
                className={`neuron-weight-val ${
                  inp.weight > 0
                    ? "neuron-weight-val--pos"
                    : inp.weight < 0
                    ? "neuron-weight-val--neg"
                    : "neuron-weight-val--zero"
                }`}
              >
                {inp.weight > 0 ? "+" : ""}
                {inp.weight}
              </span>
            </div>
          </div>
        ))}
      </div>

      <button className="btn" style={{ width: "100%", borderStyle: "dashed" }} onClick={() => add()}>
        + Add an input
      </button>

      {available.length > 0 && (
        <div className="neuron-suggestions">
          <div className="neuron-suggestions-label">💡 Need ideas? Click to add:</div>
          <div className="neuron-suggestions-pills">
            {available.map((s) => (
              <button
                key={s.text}
                className={`neuron-sug-btn ${s.sign === "pos" ? "neuron-sug-btn--pos" : "neuron-sug-btn--neg"}`}
                onClick={() => add(s.text, s.sign === "pos" ? 2 : -2)}
              >
                + {s.text}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
