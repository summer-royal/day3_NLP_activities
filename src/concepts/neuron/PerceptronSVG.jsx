import { fmt } from "./neuronMath.js";

function trunc(str, n) {
  if (!str) return "(unnamed)";
  return str.length > n ? str.slice(0, n - 1) + "\u2026" : str;
}

// step === null  →  static (weights page, no values shown)
// step === 0–5  →  animated (run page, highlights progress)
export default function PerceptronSVG({ inputs, values, step, result, question }) {
  if (!inputs || inputs.length === 0) {
    return (
      <div style={{ padding: 20, textAlign: "center", color: "var(--text-faint)", fontSize: 13 }}>
        Add at least one input to see the diagram.
      </div>
    );
  }

  const n = inputs.length;
  const rowH = 70;
  const isRun = step !== null && step !== undefined;
  const extraH = isRun ? 78 : 0;
  const svgH = Math.max(n * rowH + 40, 200) + extraH;
  const svgW = 480;

  // Input node positions spread evenly inside the non-bias area
  const availH = svgH - extraH - 40;
  const spacing = availH / n;
  const inputYs = inputs.map((_, i) => 20 + spacing / 2 + i * spacing);

  const neuronY = (svgH - extraH) / 2;
  const inputNodeX = 130, inputNodeR = 18;
  const neuronX = 262, neuronR = 28;
  const reluBoxX = neuronX + neuronR + 18;
  const reluBoxW = 65;
  const outX = reluBoxX + reluBoxW + 15 + 24;  // +15 gap +24 radius
  const outR = 24;
  const biasY = neuronY + neuronR + 56;

  const edgX2 = neuronX - neuronR;

  // Highlight states keyed to walkthrough step
  const hlEdges = isRun && step >= 1;
  const hlNeuron = isRun && step >= 2;
  const hlBias = isRun && step >= 3;
  const hlRelu = isRun && step >= 4;
  const hlOutput = isRun && step >= 5;

  const accent = "#b8530a";
  const success = "#2d7a3d";
  const errorC = "#c0392b";

  return (
    <svg viewBox={`0 0 ${svgW} ${svgH}`} width="100%" style={{ maxWidth: svgW, display: "block" }}>

      {/* ── Input nodes ── */}
      {inputs.map((inp, i) => {
        const iy = inputYs[i];
        const val = isRun && values ? (values[inp.id] ?? 0) : null;
        const isYes = val === 1;

        return (
          <g key={inp.id}>
            <text
              x={inputNodeX - inputNodeR - 7} y={iy + 4}
              textAnchor="end" fontSize={11} fill="var(--text-muted)"
            >
              {trunc(inp.text, 14)}
            </text>
            <circle
              cx={inputNodeX} cy={iy} r={inputNodeR}
              fill={
                isRun
                  ? isYes ? "rgba(45,122,61,0.13)" : "var(--bg-code)"
                  : "var(--bg-elevated)"
              }
              stroke={isRun ? (isYes ? success : "var(--border-strong)") : "var(--border)"}
              strokeWidth={isRun ? 2 : 1.5}
            />
            {val !== null ? (
              <>
                <text x={inputNodeX} y={iy - 2} textAnchor="middle" fontSize={13} fontWeight={700}
                  fill={isYes ? success : "var(--text-muted)"}>
                  {val}
                </text>
                <text x={inputNodeX} y={iy + 13} textAnchor="middle" fontSize={9}
                  fill={isYes ? success : "var(--text-faint)"}>
                  {isYes ? "yes" : "no"}
                </text>
              </>
            ) : (
              <text x={inputNodeX} y={iy + 5} textAnchor="middle" fontSize={11}
                fontFamily="ui-monospace,monospace" fill="var(--text-muted)">
                x{i + 1}
              </text>
            )}
          </g>
        );
      })}

      {/* ── Edges + weight badges ── */}
      {inputs.map((inp, i) => {
        const iy = inputYs[i];
        const edgX1 = inputNodeX + inputNodeR;
        const midX = (edgX1 + edgX2) / 2;
        const midY = (iy + neuronY) / 2;
        const isPos = inp.weight > 0;

        const val = isRun && values ? (values[inp.id] ?? 0) : 0;
        const product = val * inp.weight;
        const label = hlEdges
          ? `${val}\u00d7${isPos ? "+" : ""}${fmt(inp.weight)}=${fmt(product)}`
          : `${isPos ? "+" : ""}${fmt(inp.weight)}`;
        const badgeW = Math.max(label.length * 7.4, 38);

        return (
          <g key={`edge-${inp.id}`}>
            <line
              x1={edgX1} y1={iy} x2={edgX2} y2={neuronY}
              stroke={
                hlEdges
                  ? isPos ? "rgba(45,122,61,0.55)" : "rgba(192,57,43,0.55)"
                  : isPos ? "rgba(45,122,61,0.28)" : "rgba(192,57,43,0.28)"
              }
              strokeWidth={hlEdges ? 2 : 1.5}
            />
            <rect
              x={midX - badgeW / 2} y={midY - 10}
              width={badgeW} height={20} rx={4}
              fill={isPos ? "rgba(45,122,61,0.08)" : "rgba(192,57,43,0.08)"}
              stroke={isPos ? "rgba(45,122,61,0.22)" : "rgba(192,57,43,0.22)"}
              strokeWidth={1}
            />
            <text
              x={midX} y={midY + 4}
              textAnchor="middle" fontSize={10}
              fontFamily="ui-monospace,monospace" fontWeight={600}
              fill={isPos ? success : errorC}
            >
              {label}
            </text>
          </g>
        );
      })}

      {/* ── Neuron ── */}
      <circle
        cx={neuronX} cy={neuronY} r={neuronR}
        fill={hlNeuron ? "var(--accent-soft)" : "var(--bg-elevated)"}
        stroke={hlNeuron ? accent : "var(--border-strong)"}
        strokeWidth={hlNeuron ? 2.5 : 2}
      />
      <text x={neuronX} y={neuronY - 5} textAnchor="middle" fontSize={16}
        fill={hlNeuron ? accent : "var(--text-muted)"}>Σ</text>
      {hlBias && result ? (
        <text x={neuronX} y={neuronY + 13} textAnchor="middle" fontSize={11}
          fontFamily="ui-monospace,monospace" fontWeight={700} fill={accent}>
          {fmt(result.preActivation)}
        </text>
      ) : hlNeuron && result ? (
        <text x={neuronX} y={neuronY + 13} textAnchor="middle" fontSize={11}
          fontFamily="ui-monospace,monospace" fontWeight={700} fill={accent}>
          {fmt(result.weightedSum)}
        </text>
      ) : null}

      {/* ── Bias annotation ── */}
      {isRun && (
        <>
          <line
            x1={neuronX} y1={neuronY + neuronR + 2}
            x2={neuronX} y2={biasY - 11}
            stroke={hlBias ? accent : "var(--border)"}
            strokeWidth={1.5} strokeDasharray="4 3"
            opacity={hlBias ? 1 : 0.28}
          />
          <rect
            x={neuronX - 30} y={biasY - 11} width={60} height={18} rx={4}
            fill={hlBias ? "var(--accent-soft)" : "var(--bg-code)"}
            stroke={hlBias ? "rgba(184,83,10,0.4)" : "var(--border)"}
            strokeWidth={1} opacity={hlBias ? 1 : 0.3}
          />
          <text x={neuronX} y={biasY + 2} textAnchor="middle" fontSize={10}
            fontFamily="ui-monospace,monospace"
            fill={hlBias ? accent : "var(--text-faint)"}
            opacity={hlBias ? 1 : 0.35}>
            {question ? `bias=${fmt(question.bias)}` : "bias"}
          </text>
        </>
      )}

      {/* ── Arrow: neuron → ReLU ── */}
      <line
        x1={neuronX + neuronR} y1={neuronY}
        x2={reluBoxX - 7} y2={neuronY}
        stroke="var(--border-strong)" strokeWidth={1.5}
      />
      <polygon
        points={`${reluBoxX - 7},${neuronY - 4} ${reluBoxX},${neuronY} ${reluBoxX - 7},${neuronY + 4}`}
        fill="var(--border-strong)"
      />

      {/* ── ReLU box ── */}
      <rect
        x={reluBoxX} y={neuronY - 16} width={reluBoxW} height={32} rx={6}
        fill={hlRelu ? "var(--accent-soft)" : "var(--bg-code)"}
        stroke={hlRelu ? accent : "var(--border)"}
        strokeWidth={hlRelu ? 2 : 1.5}
      />
      <text x={reluBoxX + reluBoxW / 2} y={neuronY - 3} textAnchor="middle"
        fontSize={11} fontWeight={700} fill={hlRelu ? accent : "var(--text-muted)"}>
        ReLU
      </text>
      {hlRelu && result ? (
        <text x={reluBoxX + reluBoxW / 2} y={neuronY + 11} textAnchor="middle"
          fontSize={11} fontFamily="ui-monospace,monospace" fontWeight={700} fill={accent}>
          {fmt(result.output)}
        </text>
      ) : (
        <text x={reluBoxX + reluBoxW / 2} y={neuronY + 11} textAnchor="middle"
          fontSize={10} fill="var(--text-faint)">
          max(0,x)
        </text>
      )}

      {/* ── Arrow: ReLU → output ── */}
      <line
        x1={reluBoxX + reluBoxW} y1={neuronY}
        x2={outX - outR - 7} y2={neuronY}
        stroke="var(--border-strong)" strokeWidth={1.5}
      />
      <polygon
        points={`${outX - outR - 7},${neuronY - 4} ${outX - outR},${neuronY} ${outX - outR - 7},${neuronY + 4}`}
        fill="var(--border-strong)"
      />

      {/* ── Output node ── */}
      <circle
        cx={outX} cy={neuronY} r={outR}
        fill={
          hlOutput && result
            ? result.decision === "yes" ? "rgba(45,122,61,0.13)" : "rgba(192,57,43,0.10)"
            : "var(--bg-elevated)"
        }
        stroke={
          hlOutput && result
            ? result.decision === "yes" ? success : errorC
            : "var(--border)"
        }
        strokeWidth={hlOutput ? 2 : 1.5}
      />
      {hlOutput && result && question ? (
        <text x={outX} y={neuronY + 4} textAnchor="middle" fontSize={9} fontWeight={700}
          fill={result.decision === "yes" ? success : errorC}>
          {trunc(result.decision === "yes" ? question.yesLabel : question.noLabel, 9)}
        </text>
      ) : (
        <text x={outX} y={neuronY + 6} textAnchor="middle" fontSize={16} fill="var(--text-faint)">?</text>
      )}

      {/* ── Column labels ── */}
      <text x={inputNodeX} y={svgH - extraH - 5} textAnchor="middle" fontSize={9} fill="var(--text-faint)">inputs</text>
      <text x={neuronX} y={svgH - extraH - 5} textAnchor="middle" fontSize={9} fill="var(--text-faint)">neuron</text>
      <text x={reluBoxX + reluBoxW / 2} y={svgH - extraH - 5} textAnchor="middle" fontSize={9} fill="var(--text-faint)">activation</text>
      <text x={outX} y={svgH - extraH - 5} textAnchor="middle" fontSize={9} fill="var(--text-faint)">decision</text>
    </svg>
  );
}
