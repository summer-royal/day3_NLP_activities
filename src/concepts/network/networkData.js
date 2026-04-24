// XOR-like dataset: 4 clusters, 2 per class.
// Class 0 (circles) — top-left and bottom-right
// Class 1 (squares) — top-right and bottom-left
export const DATA = [
  { x: 0.20, y: 0.75, label: 0 }, { x: 0.15, y: 0.82, label: 0 },
  { x: 0.27, y: 0.70, label: 0 }, { x: 0.12, y: 0.68, label: 0 },
  { x: 0.22, y: 0.88, label: 0 },
  { x: 0.78, y: 0.22, label: 0 }, { x: 0.82, y: 0.16, label: 0 },
  { x: 0.73, y: 0.28, label: 0 }, { x: 0.88, y: 0.20, label: 0 },
  { x: 0.76, y: 0.32, label: 0 },
  { x: 0.78, y: 0.78, label: 1 }, { x: 0.82, y: 0.84, label: 1 },
  { x: 0.73, y: 0.72, label: 1 }, { x: 0.88, y: 0.76, label: 1 },
  { x: 0.76, y: 0.88, label: 1 },
  { x: 0.20, y: 0.22, label: 1 }, { x: 0.15, y: 0.16, label: 1 },
  { x: 0.27, y: 0.28, label: 1 }, { x: 0.12, y: 0.20, label: 1 },
  { x: 0.22, y: 0.32, label: 1 },
];

// Pre-trained weights that correctly solve this XOR pattern.
// H1 detects "both coords high", H2 detects "both coords low".
// W1[i] = [w_x1, w_x2], b1[i] = bias for hidden neuron i
export const TRAINED_WEIGHTS = {
  W1: [[3.0, 3.0], [-3.0, -3.0]],
  b1: [-4.0, 2.0],
  W2: [2.5, 2.5],
  b2: 1.5,
};

// Forward pass step-by-step for the example point (0.78, 0.78) — class 1
export const FORWARD_EXAMPLE = {
  x1: 0.78,
  x2: 0.78,
  label: 1,
  steps: [
    {
      name: 'Hidden neuron H1 \u2014 "both high" detector',
      formula: "z₁ = 3.0×x₁ + 3.0×x₂ − 4.0",
      formulaFull: "z₁ = 3.0×0.78 + 3.0×0.78 − 4.0 = 2.34 + 2.34 − 4.0 = 0.68",
      result: "h₁ = tanh(0.68) ≈ 0.59",
      value: 0.59,
      which: "h1",
    },
    {
      name: 'Hidden neuron H2 \u2014 "both low" detector',
      formula: "z₂ = −3.0×x₁ − 3.0×x₂ + 2.0",
      formulaFull: "z₂ = −3.0×0.78 − 3.0×0.78 + 2.0 = −2.34 − 2.34 + 2.0 = −2.68",
      result: "h₂ = tanh(−2.68) ≈ −0.99",
      value: -0.99,
      which: "h2",
    },
    {
      name: "Output neuron — combine H1 and H2",
      formula: "z₃ = 2.5×h₁ + 2.5×h₂ + 1.5",
      formulaFull: "z₃ = 2.5×0.59 + 2.5×(−0.99) + 1.5 = 1.48 − 2.48 + 1.5 = 0.50",
      result: "out = σ(0.50) ≈ 0.62 → Class 1 ✓",
      value: 0.62,
      which: "out",
    },
  ],
};
