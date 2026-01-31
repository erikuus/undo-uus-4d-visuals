import type { Vec4 } from "./math4d";

// Original QBasic edge lengths (A, B, C, D for X, Y, Z, W axes)
// From four02.bas: A = .99, B = .61, C = .53, D = .45
const A = 0.99;
const B = 0.61;
const C = 0.53;
const D = 0.45;

// Vertex indices follow QBasic convention:
// TIP4(I, J, K, L, P) where I,J,K,L are 1 or 2 (mapped to 0,1 here)
// I=1 means +A, I=2 means -A, etc.

// Get flat array of vertices for easier processing
// Returns 16 vertices indexed by i*8 + j*4 + k*2 + l
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

// Edge definition with dimension info for color assignment
export type Edge = {
  from: number;
  to: number;
  dimension: number; // 1=X, 2=Y, 3=Z, 4=W (color index)
  // For visibility check: indices of the two vertices
  fromIndices: [number, number, number, number]; // [i, j, k, l]
  toIndices: [number, number, number, number];
};

// Generate all 32 edges with dimension-based coloring
// In four02.bas, each dimension has its own color (1-4)
// Hidden edge logic: edges connected to vertex with minimum W are hidden
export function getEdges(): Edge[] {
  const edges: Edge[] = [];

  // Generate all edges by iterating like QBasic
  // X-edges: vary I (dimension 1), fix J, K, L
  for (let j = 0; j < 2; j++) {
    for (let k = 0; k < 2; k++) {
      for (let l = 0; l < 2; l++) {
        edges.push({
          from: vertexIndex(0, j, k, l),
          to: vertexIndex(1, j, k, l),
          dimension: 1,
          fromIndices: [0, j, k, l],
          toIndices: [1, j, k, l],
        });
      }
    }
  }

  // Y-edges: vary J (dimension 2), fix I, K, L
  for (let i = 0; i < 2; i++) {
    for (let k = 0; k < 2; k++) {
      for (let l = 0; l < 2; l++) {
        edges.push({
          from: vertexIndex(i, 0, k, l),
          to: vertexIndex(i, 1, k, l),
          dimension: 2,
          fromIndices: [i, 0, k, l],
          toIndices: [i, 1, k, l],
        });
      }
    }
  }

  // Z-edges: vary K (dimension 3), fix I, J, L
  for (let i = 0; i < 2; i++) {
    for (let j = 0; j < 2; j++) {
      for (let l = 0; l < 2; l++) {
        edges.push({
          from: vertexIndex(i, j, 0, l),
          to: vertexIndex(i, j, 1, l),
          dimension: 3,
          fromIndices: [i, j, 0, l],
          toIndices: [i, j, 1, l],
        });
      }
    }
  }

  // W-edges: vary L (dimension 4), fix I, J, K
  for (let i = 0; i < 2; i++) {
    for (let j = 0; j < 2; j++) {
      for (let k = 0; k < 2; k++) {
        edges.push({
          from: vertexIndex(i, j, k, 0),
          to: vertexIndex(i, j, k, 1),
          dimension: 4,
          fromIndices: [i, j, k, 0],
          toIndices: [i, j, k, 1],
        });
      }
    }
  }

  return edges;
}

// Check if an edge should be hidden based on minimum W vertex
// From QBasic: edges connected to vertex (IM, JM, KM, LM) with minimum W are skipped
export function isEdgeVisible(
  edge: Edge,
  minWIndices: [number, number, number, number],
): boolean {
  const [im, jm, km, lm] = minWIndices;
  const [fi, fj, fk, fl] = edge.fromIndices;
  const [ti, tj, tk, tl] = edge.toIndices;

  // QBasic visibility conditions:
  // X-edges (dimension 1): skip if J=JM AND K=KM AND L=LM
  // Y-edges (dimension 2): skip if I=IM AND K=KM AND L=LM
  // Z-edges (dimension 3): skip if I=IM AND J=JM AND L=LM
  // W-edges (dimension 4): skip if I=IM AND J=JM AND K=KM

  if (edge.dimension === 1) {
    // X-edge: both vertices share same J, K, L
    if (fj === jm && fk === km && fl === lm) return false;
  } else if (edge.dimension === 2) {
    // Y-edge: both vertices share same I, K, L
    if (fi === im && fk === km && fl === lm) return false;
  } else if (edge.dimension === 3) {
    // Z-edge: both vertices share same I, J, L
    if (fi === im && fj === jm && fl === lm) return false;
  } else if (edge.dimension === 4) {
    // W-edge: both vertices share same I, J, K
    if (fi === im && fj === jm && fk === km) return false;
  }

  return true;
}

// Find the vertex with minimum W coordinate and return its indices
export function findMinWVertex(
  rotatedVertices: Vec4[],
): [number, number, number, number] {
  let minW = Infinity;
  let minIndices: [number, number, number, number] = [0, 0, 0, 0];

  for (let i = 0; i < 2; i++) {
    for (let j = 0; j < 2; j++) {
      for (let k = 0; k < 2; k++) {
        for (let l = 0; l < 2; l++) {
          const idx = vertexIndex(i, j, k, l);
          if (rotatedVertices[idx].w < minW) {
            minW = rotatedVertices[idx].w;
            minIndices = [i, j, k, l];
          }
        }
      }
    }
  }

  return minIndices;
}
