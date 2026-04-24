import { useState } from "react";
import { DATA, TRAINED_WEIGHTS } from "./networkData.js";

const W = 260, H = 260;
const PAD = 20;
const INNER = W - PAD * 2;

let _plotCount = 0;

function toSvg(x, y) {
  return [PAD + x * INNER, PAD + (1 - y) * INNER];
}

function sigmoid(x) { return 1 / (1 + Math.exp(-x)); }
function tanh(x) { return Math.tanh(x); }

function predict(x1, x2, W1, b1, W2, b2) {
  const h1 = tanh(W1[0][0] * x1 + W1[0][1] * x2 + b1[0]);
  const h2 = tanh(W1[1][0] * x1 + W1[1][1] * x2 + b1[1]);
  return sigmoid(W2[0] * h1 + W2[1] * h2 + b2);
}

// Build a background grid for the decision boundary (20×20)
function buildBackground(weights) {
  const cells = [];
  const N = 20;
  for (let i = 0; i < N; i++) {
    for (let j = 0; j < N; j++) {
      const x1 = (j + 0.5) / N;
      const x2 = (i + 0.5) / N;
      const p = predict(x1, x2, weights.W1, weights.b1, weights.W2, weights.b2);
      cells.push({ x1, x2, p });
    }
  }
  return cells;
}

const BG_CELLS = buildBackground(TRAINED_WEIGHTS);
const CELL_SIZE = INNER / 20;

export function ScatterPlot({ showBoundary = false, highlightPoint = null, lineAngle = 45, linePos = 0.5 }) {
  const [clipId] = useState(() => `plotClip${++_plotCount}`);

  // Compute line endpoints in SVG space (line pivots around center x=0.5)
  const pivotX = PAD + 0.5 * INNER;
  const pivotY = PAD + (1 - linePos) * INNER;
  const m = -Math.tan((lineAngle * Math.PI) / 180);
  const lineY1 = pivotY + m * (PAD - pivotX);
  const lineY2 = pivotY + m * (W - PAD - pivotX);

  return (
    <svg width={W} height={H} style={{ display: "block", maxWidth: "100%" }}>
      <defs>
        <clipPath id={clipId}>
          <rect x={PAD} y={PAD} width={INNER} height={INNER} />
        </clipPath>
      </defs>

      {/* Background decision region */}
      {showBoundary && BG_CELLS.map(({ x1, x2, p }, i) => {
        const [sx, sy] = toSvg(x1, x2);
        const alpha = Math.abs(p - 0.5) * 0.6;
        const fill = p > 0.5
          ? `rgba(184,83,10,${alpha})`
          : `rgba(45,122,61,${alpha})`;
        return (
          <rect
            key={i}
            x={sx - CELL_SIZE / 2}
            y={sy - CELL_SIZE / 2}
            width={CELL_SIZE}
            height={CELL_SIZE}
            fill={fill}
          />
        );
      })}

      {/* Axes */}
      <line x1={PAD} y1={H - PAD} x2={W - PAD} y2={H - PAD} stroke="var(--border-strong)" strokeWidth={1} />
      <line x1={PAD} y1={PAD} x2={PAD} y2={H - PAD} stroke="var(--border-strong)" strokeWidth={1} />
      <text x={W / 2} y={H - 4} textAnchor="middle" fontSize={9} fill="var(--text-faint)">x₁</text>
      <text x={8} y={H / 2} textAnchor="middle" fontSize={9} fill="var(--text-faint)" transform={`rotate(-90,8,${H/2})`}>x₂</text>

      {/* Moveable single-neuron line */}
      {!showBoundary && (
        <line
          x1={PAD} y1={lineY1}
          x2={W - PAD} y2={lineY2}
          stroke="var(--accent)"
          strokeWidth={2}
          strokeDasharray="5 3"
          opacity={0.85}
          clipPath={`url(#${clipId})`}
        />
      )}

      {/* Data points */}
      {DATA.map((d, i) => {
        const [sx, sy] = toSvg(d.x, d.y);
        const isHighlighted = highlightPoint === i;
        const isClass0 = d.label === 0;
        const fill = isClass0 ? "#2d7a3d" : "#b8530a";
        const stroke = isHighlighted ? "#1a1a1a" : fill;
        const sw = isHighlighted ? 2 : 1;
        const r = isHighlighted ? 7 : 5;

        if (isClass0) {
          return (
            <circle
              key={i}
              cx={sx} cy={sy} r={r}
              fill={fill} stroke={stroke} strokeWidth={sw}
              opacity={0.85}
            />
          );
        }
        const s = r;
        return (
          <rect
            key={i}
            x={sx - s} y={sy - s}
            width={s * 2} height={s * 2}
            fill={fill} stroke={stroke} strokeWidth={sw}
            opacity={0.85}
          />
        );
      })}
    </svg>
  );
}

// Network architecture SVG: inputs → hidden → output
export function NetworkArchSVG({ highlightLayer = null, h1Val = null, h2Val = null, outVal = null }) {
  const NW = 260, NH = 200;
  const layers = [
    { label: "Input", nodes: [{ label: "x₁" }, { label: "x₂" }], x: 40 },
    { label: "Hidden", nodes: [{ label: "H1" }, { label: "H2" }], x: 130 },
    { label: "Output", nodes: [{ label: "out" }], x: 220 },
  ];

  const nodeY = (total, idx) => {
    const spacing = NH / (total + 1);
    return spacing * (idx + 1);
  };

  const nodePositions = layers.map((l) =>
    l.nodes.map((_, ni) => ({ x: l.x, y: nodeY(l.nodes.length, ni) }))
  );

  const vals = {
    H1: h1Val !== null ? h1Val.toFixed(2) : null,
    H2: h2Val !== null ? h2Val.toFixed(2) : null,
    out: outVal !== null ? outVal.toFixed(2) : null,
  };

  return (
    <svg width={NW} height={NH} style={{ display: "block", maxWidth: "100%" }}>
      {/* Edges */}
      {layers.slice(0, -1).map((_, li) =>
        nodePositions[li].flatMap((from, fi) =>
          nodePositions[li + 1].map((to, ti) => (
            <line
              key={`${li}-${fi}-${ti}`}
              x1={from.x + 16} y1={from.y}
              x2={to.x - 16} y2={to.y}
              stroke="var(--border-strong)"
              strokeWidth={1}
              opacity={0.6}
            />
          ))
        )
      )}

      {/* Nodes */}
      {layers.map((layer, li) =>
        layer.nodes.map((node, ni) => {
          const pos = nodePositions[li][ni];
          const isActive = highlightLayer === li;
          const val = vals[node.label];
          const fill = isActive ? "var(--accent-soft)" : "var(--bg-elevated)";
          const stroke = isActive ? "var(--accent)" : "var(--border-strong)";
          return (
            <g key={`${li}-${ni}`}>
              <circle
                cx={pos.x} cy={pos.y} r={16}
                fill={fill} stroke={stroke} strokeWidth={isActive ? 2 : 1}
              />
              <text x={pos.x} y={pos.y + 4} textAnchor="middle" fontSize={10} fontWeight={600} fill={isActive ? "var(--accent)" : "var(--text)"}>
                {node.label}
              </text>
              {val !== null && (
                <text x={pos.x} y={pos.y + 28} textAnchor="middle" fontSize={9} fill="var(--text-muted)" fontFamily="ui-monospace,monospace">
                  {val}
                </text>
              )}
            </g>
          );
        })
      )}

      {/* Layer labels */}
      {layers.map((l, li) => (
        <text key={li} x={l.x} y={NH - 4} textAnchor="middle" fontSize={9} fill="var(--text-faint)">
          {l.label}
        </text>
      ))}
    </svg>
  );
}
