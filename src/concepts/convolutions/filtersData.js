// 8×8 grayscale pixel-art smiley face
// B=220 (light), D=30 (dark)
// Row 0-1: oval head top   Row 2: eyes   Row 3-4: cheeks
// Row 5: smile bar         Row 6-7: oval head bottom
export const IMAGE = [
   30,  30, 220, 220, 220, 220,  30,  30,  // row 0 — head top
   30, 220,  30,  30,  30,  30, 220,  30,  // row 1 — sides
  220,  30, 220,  30,  30, 220,  30, 220,  // row 2 — eyes
  220,  30,  30,  30,  30,  30,  30, 220,  // row 3 — cheeks
  220,  30,  30,  30,  30,  30,  30, 220,  // row 4 — cheeks
  220,  30, 220, 220, 220, 220,  30, 220,  // row 5 — smile
   30, 220,  30,  30,  30,  30, 220,  30,  // row 6 — sides
   30,  30, 220, 220, 220, 220,  30,  30,  // row 7 — head bottom
];
export const IMG_W = 8;

export const FILTERS = [
  {
    id: "edge_h",
    label: "Horizontal Edge",
    kernel: [
      [-1, -2, -1],
      [ 0,  0,  0],
      [ 1,  2,  1],
    ],
    description:
      "Detects horizontal edges — places where brightness changes sharply from top to bottom. Bright pixels in the output = strong edge.",
  },
  {
    id: "edge_v",
    label: "Vertical Edge",
    kernel: [
      [-1, 0, 1],
      [-2, 0, 2],
      [-1, 0, 1],
    ],
    description:
      "Detects vertical edges — changes from left to right. Exactly like horizontal edge detection, just rotated 90°.",
  },
  {
    id: "blur",
    label: "Blur",
    kernel: [
      [1/9, 1/9, 1/9],
      [1/9, 1/9, 1/9],
      [1/9, 1/9, 1/9],
    ],
    description:
      "Averages each pixel with its 8 neighbors. Sharp changes get smoothed out. Used in preprocessing to reduce noise.",
  },
  {
    id: "sharpen",
    label: "Sharpen",
    kernel: [
      [ 0, -1,  0],
      [-1,  5, -1],
      [ 0, -1,  0],
    ],
    description:
      "Amplifies differences between a pixel and its neighbors. Edges get brighter, flat regions stay the same. The opposite of blur.",
  },
];

// Compute the convolution output for the full image with a given 3×3 kernel.
// Output is (IMG_W-2) × (IMG_W-2) = 6×6.
export function convolve(image, kernel) {
  const OUT_W = IMG_W - 2;
  const out = [];
  for (let r = 0; r < OUT_W; r++) {
    for (let c = 0; c < OUT_W; c++) {
      let sum = 0;
      for (let kr = 0; kr < 3; kr++) {
        for (let kc = 0; kc < 3; kc++) {
          sum += image[(r + kr) * IMG_W + (c + kc)] * kernel[kr][kc];
        }
      }
      out.push(sum);
    }
  }
  // Normalize to 0–255 for display
  const min = Math.min(...out);
  const max = Math.max(...out);
  const range = max - min || 1;
  return out.map((v) => Math.round(((v - min) / range) * 255));
}
