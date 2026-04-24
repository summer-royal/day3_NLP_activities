// Visualizes the CNN as a layered node diagram:
// [16 input pixels] → [8 conv1 nodes] → [6 conv2 nodes] → [10 output nodes]
// Node color encodes activation strength; output nodes are sized by probability.

function lerp(a, b, t) { return a + (b - a) * t; }

function nodeFill(value, max) {
  if (max === 0) return "#333";
  const t = Math.min(Math.abs(value) / max, 1);
  const r = Math.round(lerp(40, 184, t));
  const g = Math.round(lerp(40, 83, t));
  const b = Math.round(lerp(40, 10, t));
  return `rgb(${r},${g},${b})`;
}

function grayscaleFill(v) {
  const c = Math.round(v);
  return `rgb(${c},${c},${c})`;
}

function probFill(p, isPred) {
  if (isPred) return "#b8530a";
  const t = p;
  const r = Math.round(lerp(220, 184, t));
  const g = Math.round(lerp(215, 83, t));
  const b = Math.round(lerp(205, 10, t));
  return `rgb(${r},${g},${b})`;
}

export default function NetworkSchematic({ result }) {
  const { pixel_grid, conv1_maps, conv2_maps, probabilities, prediction } = result;

  // Sample 16 input pixels in a 4×4 grid from the center of the 28×28 grid
  const inputNodes = [];
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      const row = 6 + r * 4;
      const col = 6 + c * 4;
      inputNodes.push(pixel_grid[row][col]);
    }
  }

  // 8 conv1 nodes — mean activation of first 8 feature maps
  const conv1Nodes = conv1_maps.slice(0, 8).map((map) => {
    const flat = map.flat();
    return flat.reduce((s, v) => s + v, 0) / flat.length;
  });
  const conv1Max = Math.max(...conv1Nodes.map(Math.abs), 1);

  // 6 conv2 nodes — mean activation of first 6 feature maps
  const conv2Nodes = conv2_maps.slice(0, 6).map((map) => {
    const flat = map.flat();
    return flat.reduce((s, v) => s + v, 0) / flat.length;
  });
  const conv2Max = Math.max(...conv2Nodes.map(Math.abs), 1);

  // Layout constants
  const W = 580, H = 300;
  const layers = [
    { nodes: inputNodes, x: 60, label: "Input\n(pixels)", count: 16, type: "input" },
    { nodes: conv1Nodes, x: 195, label: "Conv1\n(32 filters)", count: 8, type: "conv" },
    { nodes: conv2Nodes, x: 330, label: "Conv2\n(64 filters)", count: 6, type: "conv" },
    { nodes: probabilities, x: 490, label: "Output\n(digits 0–9)", count: 10, type: "output" },
  ];

  function nodeY(i, total) {
    const spacing = Math.min(22, (H - 60) / total);
    const totalH = spacing * (total - 1);
    return (H - totalH) / 2 + i * spacing;
  }

  function nodeR(i, type) {
    if (type === "output") return 4 + probabilities[i] * 10;
    return 7;
  }

  function fill(i, type) {
    if (type === "input") return grayscaleFill(inputNodes[i]);
    if (type === "conv" && layers.findIndex(l => l.type === "conv" && l.nodes === conv1Nodes) === layers.findIndex(l => l === layers[1]))
      return nodeFill(conv1Nodes[i], conv1Max);
    if (type === "output") return probFill(probabilities[i], i === prediction);
    return "#888";
  }

  // Precompute node positions
  const positions = layers.map((layer) =>
    layer.nodes.map((_, i) => ({ x: layer.x, y: nodeY(i, layer.count) }))
  );

  const connOpacity = 0.08;

  return (
    <div className="digit-schematic-wrap">
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: W, display: "block", margin: "0 auto" }}>
        {/* Connection lines between layers */}
        {layers.slice(0, -1).map((layer, li) =>
          positions[li].map((src, si) =>
            positions[li + 1].map((dst, di) => (
              <line
                key={`${li}-${si}-${di}`}
                x1={src.x} y1={src.y}
                x2={dst.x} y2={dst.y}
                stroke="#b8530a"
                strokeOpacity={connOpacity}
                strokeWidth={0.8}
              />
            ))
          )
        )}

        {/* Layer nodes */}
        {layers.map((layer, li) =>
          layer.nodes.map((val, i) => {
            const { x, y } = positions[li][i];
            const r = layer.type === "output" ? 4 + probabilities[i] * 10 : 7;
            let fillColor;
            if (layer.type === "input") fillColor = grayscaleFill(inputNodes[i]);
            else if (layer.type === "conv" && li === 1) fillColor = nodeFill(conv1Nodes[i], conv1Max);
            else if (layer.type === "conv" && li === 2) fillColor = nodeFill(conv2Nodes[i], conv2Max);
            else fillColor = probFill(probabilities[i], i === prediction);

            return (
              <g key={`node-${li}-${i}`}>
                <circle cx={x} cy={y} r={r} fill={fillColor} stroke="var(--border)" strokeWidth={0.5} />
                {layer.type === "output" && (
                  <>
                    <text x={x + r + 4} y={y + 4} fontSize={9} fill={i === prediction ? "var(--accent)" : "var(--text-muted)"} fontWeight={i === prediction ? 700 : 400}>
                      {i}
                    </text>
                    {i === prediction && (
                      <text x={x + r + 14} y={y + 4} fontSize={9} fill="var(--accent)" fontWeight={700}>
                        ← {(probabilities[i] * 100).toFixed(0)}%
                      </text>
                    )}
                  </>
                )}
              </g>
            );
          })
        )}

        {/* Layer labels */}
        {layers.map((layer, li) => {
          const lines = layer.label.split("\n");
          return lines.map((line, j) => (
            <text
              key={`lbl-${li}-${j}`}
              x={layer.x}
              y={H - 28 + j * 11}
              textAnchor="middle"
              fontSize={9}
              fill="var(--text-muted)"
            >
              {line}
            </text>
          ));
        })}
      </svg>

      <div className="digit-schematic-legend">
        <span className="digit-legend-dot" style={{ background: "#282828" }} /> low activation
        <span className="digit-legend-dot" style={{ background: "#b8530a", marginLeft: 12 }} /> high activation
        <span style={{ marginLeft: 12 }}>Output node size = probability</span>
      </div>
    </div>
  );
}
