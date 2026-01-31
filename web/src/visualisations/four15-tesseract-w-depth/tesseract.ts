import type { Vec4 } from "./math4d";

// Tesseract dimensions from QBasic
const A = 0.75;

// Number of dots per edge
export const NDOT = 150;

// W-scale for brightness calculation (note: negative in original)
// Increased from original 2.0 for more prominent depth shading
export const WSCALE = 4.0;

// Get flat array of vertices for the tesseract
// Returns 16 vertices indexed by i*8 + j*4 + k*2 + l
export function getVertexArray(): Vec4[] {
  const result: Vec4[] = [];
  for (let i = 0; i < 2; i++) {
    for (let j = 0; j < 2; j++) {
      for (let k = 0; k < 2; k++) {
        for (let l = 0; l < 2; l++) {
          result.push({
            x: i === 0 ? A : -A,
            y: j === 0 ? A : -A,
            z: k === 0 ? A : -A,
            w: l === 0 ? A : -A,
          });
        }
      }
    }
  }
  return result;
}

// Convert 4 binary indices to flat array index
export function vertexIndex(
  i: number,
  j: number,
  k: number,
  l: number,
): number {
  return i * 8 + j * 4 + k * 2 + l;
}

// Edge definition
export type Edge = {
  from: number;
  to: number;
};

// Generate all 32 edges of the tesseract
export function getEdges(): Edge[] {
  const edges: Edge[] = [];

  // X-edges: vary I, fix J, K, L (8 edges)
  for (let j = 0; j < 2; j++) {
    for (let k = 0; k < 2; k++) {
      for (let l = 0; l < 2; l++) {
        edges.push({
          from: vertexIndex(0, j, k, l),
          to: vertexIndex(1, j, k, l),
        });
      }
    }
  }

  // Y-edges: vary J, fix I, K, L (8 edges)
  for (let i = 0; i < 2; i++) {
    for (let k = 0; k < 2; k++) {
      for (let l = 0; l < 2; l++) {
        edges.push({
          from: vertexIndex(i, 0, k, l),
          to: vertexIndex(i, 1, k, l),
        });
      }
    }
  }

  // Z-edges: vary K, fix I, J, L (8 edges)
  for (let i = 0; i < 2; i++) {
    for (let j = 0; j < 2; j++) {
      for (let l = 0; l < 2; l++) {
        edges.push({
          from: vertexIndex(i, j, 0, l),
          to: vertexIndex(i, j, 1, l),
        });
      }
    }
  }

  // W-edges: vary L, fix I, J, K (8 edges)
  for (let i = 0; i < 2; i++) {
    for (let j = 0; j < 2; j++) {
      for (let k = 0; k < 2; k++) {
        edges.push({
          from: vertexIndex(i, j, k, 0),
          to: vertexIndex(i, j, k, 1),
        });
      }
    }
  }

  return edges;
}
