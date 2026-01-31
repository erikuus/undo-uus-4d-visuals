import type { Vec4 } from "./math4d";

// Original QBasic asymmetric tesseract dimensions from four03.bas
// Each axis has different positive and negative extents
const XP = 0.9;
const XM = 0.0;
const YP = 0.8;
const YM = 0.0;
const ZP = 0.7;
const ZM = 0.0;
const WP = 1.2;
const WM = 0.0;

// Get flat array of vertices for easier processing
// Returns 16 vertices indexed by i*8 + j*4 + k*2 + l
// Note: asymmetric - I=1 means +XP, I=2 means XM (which is 0), etc.
export function getVertexArray(): Vec4[] {
  const result: Vec4[] = [];
  for (let i = 0; i < 2; i++) {
    for (let j = 0; j < 2; j++) {
      for (let k = 0; k < 2; k++) {
        for (let l = 0; l < 2; l++) {
          result.push({
            x: i === 0 ? XP : XM,
            y: j === 0 ? YP : YM,
            z: k === 0 ? ZP : ZM,
            w: l === 0 ? WP : WM,
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

// Edge definition - all edges visible, monochrome
export type Edge = {
  from: number;
  to: number;
};

// Generate all 32 edges (all visible in four03)
export function getEdges(): Edge[] {
  const edges: Edge[] = [];

  // X-edges: vary I, fix J, K, L
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

  // Y-edges: vary J, fix I, K, L
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

  // Z-edges: vary K, fix I, J, L
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

  // W-edges: vary L, fix I, J, K
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
