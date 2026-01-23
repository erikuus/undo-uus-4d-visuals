import type { Vec4 } from "./math4d";

// Original QBasic edge lengths (A, B, C, D for X, Y, Z, W axes)
const A = 0.99;
const B = 0.61;
const C = 0.86;
const D = 0.74;

// Vertex naming: indices [i][j][k][l] where each is 0 or 1
// 0 = positive, 1 = negative (matching QBasic's 1=+, 2=-)
export type Vertex = {
  i: number; // X index
  j: number; // Y index
  k: number; // Z index
  l: number; // W index
};

export type Edge = {
  from: Vertex;
  to: Vertex;
  color: number; // Color index 1-14
};

// Generate all 16 vertices of the tesseract
export function generateVertices(): Vec4[][] {
  const vertices: Vec4[][][][] = [];

  for (let i = 0; i < 2; i++) {
    vertices[i] = [];
    for (let j = 0; j < 2; j++) {
      vertices[i][j] = [];
      for (let k = 0; k < 2; k++) {
        vertices[i][j][k] = [];
        for (let l = 0; l < 2; l++) {
          vertices[i][j][k][l] = {
            x: i === 0 ? A : -A,
            y: j === 0 ? B : -B,
            z: k === 0 ? C : -C,
            w: l === 0 ? D : -D,
          };
        }
      }
    }
  }

  return vertices as unknown as Vec4[][];
}

// Get flat array of vertices for easier processing
export function getVertexArray(): Vec4[] {
  const result: Vec4[] = [];
  for (let i = 0; i < 2; i++) {
    for (let j = 0; j < 2; j++) {
      for (let k = 0; k < 2; k++) {
        for (let l = 0; l < 2; l++) {
          result.push({
            x: i === 0 ? A : -A,
            y: j === 0 ? B : -B,
            z: k === 0 ? C : -C,
            w: l === 0 ? D : -D,
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

// All 32 edges with their color assignments (matching QBasic exactly)
// Colors 1-14 from the original EGA palette
export function getEdges(): Array<{ from: number; to: number; color: number }> {
  return [
    // X-axis edges (along dimension 1, i varies) - Lines 1-8
    { from: vertexIndex(0, 0, 0, 0), to: vertexIndex(1, 0, 0, 0), color: 1 },
    { from: vertexIndex(0, 1, 0, 0), to: vertexIndex(1, 1, 0, 0), color: 2 },
    { from: vertexIndex(0, 0, 1, 0), to: vertexIndex(1, 0, 1, 0), color: 3 },
    { from: vertexIndex(0, 1, 1, 0), to: vertexIndex(1, 1, 1, 0), color: 4 },
    { from: vertexIndex(0, 0, 0, 1), to: vertexIndex(1, 0, 0, 1), color: 4 },
    { from: vertexIndex(0, 1, 0, 1), to: vertexIndex(1, 1, 0, 1), color: 3 },
    { from: vertexIndex(0, 0, 1, 1), to: vertexIndex(1, 0, 1, 1), color: 2 },
    { from: vertexIndex(0, 1, 1, 1), to: vertexIndex(1, 1, 1, 1), color: 1 },

    // Y-axis edges (along dimension 2, j varies) - Lines 9-16
    { from: vertexIndex(0, 0, 0, 0), to: vertexIndex(0, 1, 0, 0), color: 5 },
    { from: vertexIndex(1, 0, 0, 0), to: vertexIndex(1, 1, 0, 0), color: 6 },
    { from: vertexIndex(0, 0, 1, 0), to: vertexIndex(0, 1, 1, 0), color: 7 },
    { from: vertexIndex(1, 0, 1, 0), to: vertexIndex(1, 1, 1, 0), color: 7 },
    { from: vertexIndex(0, 0, 0, 1), to: vertexIndex(0, 1, 0, 1), color: 7 },
    { from: vertexIndex(1, 0, 0, 1), to: vertexIndex(1, 1, 0, 1), color: 7 },
    { from: vertexIndex(0, 0, 1, 1), to: vertexIndex(0, 1, 1, 1), color: 6 },
    { from: vertexIndex(1, 0, 1, 1), to: vertexIndex(1, 1, 1, 1), color: 5 },

    // Z-axis edges (along dimension 3, k varies) - Lines 17-24
    { from: vertexIndex(0, 0, 0, 0), to: vertexIndex(0, 0, 1, 0), color: 8 },
    { from: vertexIndex(1, 0, 0, 0), to: vertexIndex(1, 0, 1, 0), color: 9 },
    { from: vertexIndex(0, 1, 0, 0), to: vertexIndex(0, 1, 1, 0), color: 10 },
    { from: vertexIndex(1, 1, 0, 0), to: vertexIndex(1, 1, 1, 0), color: 11 },
    { from: vertexIndex(0, 0, 0, 1), to: vertexIndex(0, 0, 1, 1), color: 11 },
    { from: vertexIndex(1, 0, 0, 1), to: vertexIndex(1, 0, 1, 1), color: 10 },
    { from: vertexIndex(0, 1, 0, 1), to: vertexIndex(0, 1, 1, 1), color: 9 },
    { from: vertexIndex(1, 1, 0, 1), to: vertexIndex(1, 1, 1, 1), color: 8 },

    // W-axis edges (along dimension 4, l varies) - Lines 25-32
    { from: vertexIndex(0, 0, 0, 0), to: vertexIndex(0, 0, 0, 1), color: 12 },
    { from: vertexIndex(1, 0, 0, 0), to: vertexIndex(1, 0, 0, 1), color: 13 },
    { from: vertexIndex(0, 1, 0, 0), to: vertexIndex(0, 1, 0, 1), color: 14 },
    { from: vertexIndex(1, 1, 0, 0), to: vertexIndex(1, 1, 0, 1), color: 15 }, // Default white
    { from: vertexIndex(0, 0, 1, 0), to: vertexIndex(0, 0, 1, 1), color: 15 }, // Default white
    { from: vertexIndex(1, 0, 1, 0), to: vertexIndex(1, 0, 1, 1), color: 14 },
    { from: vertexIndex(0, 1, 1, 0), to: vertexIndex(0, 1, 1, 1), color: 13 },
    { from: vertexIndex(1, 1, 1, 0), to: vertexIndex(1, 1, 1, 1), color: 12 },
  ];
}
