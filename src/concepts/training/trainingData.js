// Same XOR-like dataset used in Era 3
export const DATA = [
  { x1: 0.20, x2: 0.75, label: 0 }, { x1: 0.15, x2: 0.82, label: 0 },
  { x1: 0.27, x2: 0.70, label: 0 }, { x1: 0.12, x2: 0.68, label: 0 },
  { x1: 0.22, x2: 0.88, label: 0 },
  { x1: 0.78, x2: 0.22, label: 0 }, { x1: 0.82, x2: 0.16, label: 0 },
  { x1: 0.73, x2: 0.28, label: 0 }, { x1: 0.88, x2: 0.20, label: 0 },
  { x1: 0.76, x2: 0.32, label: 0 },
  { x1: 0.78, x2: 0.78, label: 1 }, { x1: 0.82, x2: 0.84, label: 1 },
  { x1: 0.73, x2: 0.72, label: 1 }, { x1: 0.88, x2: 0.76, label: 1 },
  { x1: 0.76, x2: 0.88, label: 1 },
  { x1: 0.20, x2: 0.22, label: 1 }, { x1: 0.15, x2: 0.16, label: 1 },
  { x1: 0.27, x2: 0.28, label: 1 }, { x1: 0.12, x2: 0.20, label: 1 },
  { x1: 0.22, x2: 0.32, label: 1 },
];

// Network: 2 inputs → 2 hidden (tanh) → 1 output (sigmoid)
// Returns a fresh random-weights network object.
export function initNet() {
  const r = () => (Math.random() - 0.5) * 0.8;
  return {
    W1: [[r(), r()], [r(), r()]],
    b1: [r(), r()],
    W2: [r(), r()],
    b2: r(),
  };
}

function sigmoid(x) { return 1 / (1 + Math.exp(-x)); }

export function forward(x1, x2, net) {
  const { W1, b1, W2, b2 } = net;
  const z1 = W1[0][0] * x1 + W1[0][1] * x2 + b1[0];
  const z2 = W1[1][0] * x1 + W1[1][1] * x2 + b1[1];
  const h1 = Math.tanh(z1);
  const h2 = Math.tanh(z2);
  const z3 = W2[0] * h1 + W2[1] * h2 + b2;
  const out = sigmoid(z3);
  return { h1, h2, out };
}

export function trainEpoch(data, net, lr = 0.5) {
  const { W1, b1, W2, b2 } = net;
  let loss = 0;

  for (const { x1, x2, label } of data) {
    const { h1, h2, out } = forward(x1, x2, net);
    loss += -label * Math.log(out + 1e-9) - (1 - label) * Math.log(1 - out + 1e-9);

    const dOut = out - label;
    net.W2[0] -= lr * dOut * h1;
    net.W2[1] -= lr * dOut * h2;
    net.b2    -= lr * dOut;

    const dh1 = dOut * net.W2[0] * (1 - h1 * h1);
    const dh2 = dOut * net.W2[1] * (1 - h2 * h2);

    net.W1[0][0] -= lr * dh1 * x1; net.W1[0][1] -= lr * dh1 * x2; net.b1[0] -= lr * dh1;
    net.W1[1][0] -= lr * dh2 * x1; net.W1[1][1] -= lr * dh2 * x2; net.b1[1] -= lr * dh2;
  }

  return loss / data.length;
}

export function accuracy(data, net) {
  let correct = 0;
  for (const { x1, x2, label } of data) {
    const { out } = forward(x1, x2, net);
    if ((out >= 0.5 ? 1 : 0) === label) correct++;
  }
  return correct / data.length;
}
