import { useState, useRef, useEffect } from "react";
import { DATA, initNet, forward, trainEpoch, accuracy } from "./trainingData.js";

const SIZE = 260;
const PAD = 20;
const INNER = SIZE - PAD * 2;
const BG_N = 30; // 30×30 background grid

function toSvg(x, y) {
  return [PAD + x * INNER, PAD + (1 - y) * INNER];
}

function buildBgGrid(net) {
  const cells = [];
  for (let i = 0; i < BG_N; i++) {
    for (let j = 0; j < BG_N; j++) {
      const x1 = (j + 0.5) / BG_N;
      const x2 = (i + 0.5) / BG_N;
      const { out } = forward(x1, x2, net);
      cells.push({ x1, x2, p: out });
    }
  }
  return cells;
}

export default function TrainingDemo() {
  const [net, setNet] = useState(() => initNet());
  const [epoch, setEpoch] = useState(0);
  const [lossHistory, setLossHistory] = useState([]);
  const [bgCells, setBgCells] = useState(() => buildBgGrid(initNet()));
  const [acc, setAcc] = useState(0);
  const [training, setTraining] = useState(false);
  const netRef = useRef(net);
  const epochRef = useRef(0);
  const lossRef = useRef([]);
  const animRef = useRef(null);

  const cellSize = INNER / BG_N;

  const reset = () => {
    if (animRef.current) cancelAnimationFrame(animRef.current);
    setTraining(false);
    const fresh = initNet();
    netRef.current = fresh;
    epochRef.current = 0;
    lossRef.current = [];
    setNet({ ...fresh });
    setEpoch(0);
    setLossHistory([]);
    setBgCells(buildBgGrid(fresh));
    setAcc(0);
  };

  const runBatch = (batchEpochs) => {
    const n = netRef.current;
    let lastLoss = 0;
    for (let i = 0; i < batchEpochs; i++) {
      lastLoss = trainEpoch(DATA, n, 0.5);
      epochRef.current += 1;
      lossRef.current = [...lossRef.current, lastLoss];
    }
    setBgCells(buildBgGrid(n));
    setEpoch(epochRef.current);
    setLossHistory([...lossRef.current]);
    setAcc(accuracy(DATA, n));
    setNet({ ...n });
  };

  const handleTrain10 = () => runBatch(10);
  const handleTrain100 = () => runBatch(100);

  const toggleAuto = () => {
    if (training) {
      cancelAnimationFrame(animRef.current);
      setTraining(false);
    } else {
      setTraining(true);
      const loop = () => {
        if (epochRef.current >= 1000) { setTraining(false); return; }
        runBatch(5);
        animRef.current = requestAnimationFrame(loop);
      };
      animRef.current = requestAnimationFrame(loop);
    }
  };

  useEffect(() => () => { if (animRef.current) cancelAnimationFrame(animRef.current); }, []);

  // Loss chart
  const chartW = 260, chartH = 100;
  const chartPadX = 30, chartPadY = 10;
  const maxLoss = Math.max(...lossHistory, 1);
  const points = lossHistory.map((v, i) => {
    const x = chartPadX + (i / Math.max(lossHistory.length - 1, 1)) * (chartW - chartPadX - 10);
    const y = chartPadY + (1 - v / maxLoss) * (chartH - chartPadY * 2);
    return `${x},${y}`;
  });

  return (
    <div className="train-layout">
      {/* Left: scatter + controls */}
      <div className="train-panel">
        <div className="train-panel-title">Decision boundary</div>

        <div className="train-canvas-wrap">
          <svg width={SIZE} height={SIZE} style={{ display: "block", width: "100%" }}>
            {/* Background decision regions */}
            {bgCells.map(({ x1, x2, p }, i) => {
              const [sx, sy] = toSvg(x1, x2);
              const alpha = Math.abs(p - 0.5) * 0.7;
              const fill = p > 0.5
                ? `rgba(184,83,10,${alpha})`
                : `rgba(45,122,61,${alpha})`;
              return (
                <rect
                  key={i}
                  x={sx - cellSize / 2}
                  y={sy - cellSize / 2}
                  width={cellSize}
                  height={cellSize}
                  fill={fill}
                />
              );
            })}

            {/* Axes */}
            <line x1={PAD} y1={SIZE - PAD} x2={SIZE - PAD} y2={SIZE - PAD} stroke="var(--border-strong)" strokeWidth={1} />
            <line x1={PAD} y1={PAD} x2={PAD} y2={SIZE - PAD} stroke="var(--border-strong)" strokeWidth={1} />

            {/* Data points */}
            {DATA.map((d, i) => {
              const [sx, sy] = toSvg(d.x1, d.x2);
              const fill = d.label === 0 ? "#2d7a3d" : "#b8530a";
              const { out } = forward(d.x1, d.x2, net);
              const correct = (out >= 0.5 ? 1 : 0) === d.label;
              if (d.label === 0) {
                return <circle key={i} cx={sx} cy={sy} r={5} fill={fill} stroke={correct ? fill : "#1a1a1a"} strokeWidth={correct ? 1 : 2} opacity={0.9} />;
              }
              const s = 5;
              return <rect key={i} x={sx - s} y={sy - s} width={s * 2} height={s * 2} fill={fill} stroke={correct ? fill : "#1a1a1a"} strokeWidth={correct ? 1 : 2} opacity={0.9} />;
            })}
          </svg>
        </div>

        <div className="train-controls">
          <span className="train-epoch-display">Epoch <strong>{epoch}</strong></span>
          <span className="train-accuracy">Accuracy <strong>{(acc * 100).toFixed(0)}%</strong></span>
        </div>

        <div className="train-reset-row">
          <button className="btn btn--primary" onClick={handleTrain10} disabled={training || epoch >= 1000}>
            Train 10 epochs
          </button>
          <button className="btn" onClick={handleTrain100} disabled={training || epoch >= 1000}>
            +100 epochs
          </button>
          <button className={`btn ${training ? "btn--primary" : ""}`} onClick={toggleAuto} disabled={epoch >= 1000}>
            {training ? "⏸ Pause" : "▶ Auto"}
          </button>
          <button className="btn btn--ghost btn--sm" onClick={reset}>Reset</button>
        </div>
      </div>

      {/* Right: loss chart + explanation */}
      <div className="train-panel">
        <div className="train-panel-title">Loss over time</div>

        <div className="loss-chart-wrap">
          <div className="loss-chart-label">Cross-entropy loss</div>
          <svg
            className="loss-chart-svg"
            viewBox={`0 0 ${chartW} ${chartH}`}
            style={{ height: chartH, border: "1px solid var(--border)", borderRadius: 6, background: "var(--bg-code)" }}
          >
            {lossHistory.length > 1 && (
              <polyline
                points={points.join(" ")}
                fill="none"
                stroke="var(--accent)"
                strokeWidth={1.5}
              />
            )}
            {lossHistory.length === 0 && (
              <text x={chartW / 2} y={chartH / 2} textAnchor="middle" fontSize={11} fill="var(--text-faint)">
                No data yet — click Train to start
              </text>
            )}
            {/* Y axis label */}
            <text x={chartPadX - 4} y={chartPadY + 4} textAnchor="end" fontSize={8} fill="var(--text-faint)">
              {maxLoss.toFixed(1)}
            </text>
            <text x={chartPadX - 4} y={chartH - chartPadY} textAnchor="end" fontSize={8} fill="var(--text-faint)">
              0
            </text>
            {/* X axis label */}
            <text x={chartW - 8} y={chartH - 2} textAnchor="end" fontSize={8} fill="var(--text-faint)">
              epoch {epoch}
            </text>
          </svg>
        </div>

        <div className="train-explain">
          {epoch === 0 && (
            <>
              <strong>Before training:</strong> the network has random weights. It's guessing.
              Points with a thick black outline are being mis-classified.
              Click <strong>Train 10 epochs</strong> and watch the boundary shift.
            </>
          )}
          {epoch > 0 && epoch < 50 && (
            <>
              <strong>Early training:</strong> the network is starting to find structure.
              The decision regions are taking shape but still imprecise.
              Each epoch runs through all 20 training points once.
            </>
          )}
          {epoch >= 50 && epoch < 200 && (
            <>
              <strong>Getting better:</strong> loss is falling and the boundary is sharpening.
              The network has found that class 1 lives in the top-right and bottom-left, and is
              learning to carve out those regions.
            </>
          )}
          {epoch >= 200 && (
            <>
              <strong>Converged:</strong> the boundary separates all {DATA.length} points correctly.
              This is gradient descent working — thousands of tiny weight nudges, accumulated.
              The network now "knows" the XOR pattern.
            </>
          )}
        </div>

        <div style={{ padding: "12px 14px", background: "var(--bg-code)", borderRadius: 8, fontSize: 13, color: "var(--text-muted)", lineHeight: 1.6 }}>
          <strong style={{ color: "var(--text)" }}>How it works:</strong> after each forward pass,
          the network computes how wrong it was (the loss). Backpropagation traces that error back
          through every weight and nudges each one in the direction that reduces the loss.
          Repeat for every data point, every epoch.
        </div>
      </div>
    </div>
  );
}
