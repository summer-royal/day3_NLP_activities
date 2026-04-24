export function relu(x) {
  return Math.max(0, x);
}

export function computeWeightedSum(inputs, values) {
  return inputs.reduce((sum, inp) => sum + (values[inp.id] ?? 0) * inp.weight, 0);
}

export function classify(inputs, values, bias) {
  const weightedSum = computeWeightedSum(inputs, values);
  const preActivation = weightedSum + bias;
  const output = relu(preActivation);
  return { weightedSum, preActivation, output, decision: output > 0 ? "yes" : "no" };
}

export function randomValues(inputs) {
  const vals = {};
  for (const inp of inputs) vals[inp.id] = Math.random() < 0.5 ? 0 : 1;
  return vals;
}

export function fmt(n) {
  if (Number.isInteger(n)) return n.toString();
  return n.toFixed(2).replace(/\.?0+$/, "");
}

let _uid = 0;
export function uid() {
  return `inp_${++_uid}`;
}
