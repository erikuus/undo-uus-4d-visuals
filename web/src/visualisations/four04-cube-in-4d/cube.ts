import type { Vec4 } from "./math4d";

// Original QBasic asymmetric cuboid dimensions from four04.bas
// This is a 3D object (W=0) rotating in 4D space
const XP = 0.9;
const XM = 0.0;
const YP = 0.8;
const YM = 0.0;
const ZP = 0.7;
const ZM = 0.0;

// Get flat array of vertices for easier processing
// Returns 8 vertices (3D cube) indexed by i*4 + j*2 + k
// All vertices have W=0 (3D object embedded in 4D)
export function getVertexArray(): Vec4[] {
  const result: Vec4[] = [];
  for (let i = 0; i < 2; i++) {
    for (let j = 0; j < 2; j++) {
      for (let k = 0; k < 2; k++) {
        result.push({
          x: i === 0 ? XP : XM,
          y: j === 0 ? YP : YM,
          z: k === 0 ? ZP : ZM,
          w: 0, // 3D object - W coordinate is always 0
        });
      }
    }
  }
  return result;
}

// Convert 3 binary indices to flat array index
export function vertexIndex(i: number, j: number, k: number): number {
  return i * 4 + j * 2 + k;
}

// Edge definition - all edges visible, monochrome
export type Edge = {
  from: number;
  to: number;
};

// Generate all 12 edges of the 3D cube
export function getEdges(): Edge[] {
  const edges: Edge[] = [];

  // X-edges: vary I, fix J, K (4 edges)
  for (let j = 0; j < 2; j++) {
    for (let k = 0; k < 2; k++) {
      edges.push({
        from: vertexIndex(0, j, k),
        to: vertexIndex(1, j, k),
      });
    }
  }

  // Y-edges: vary J, fix I, K (4 edges)
  for (let i = 0; i < 2; i++) {
    for (let k = 0; k < 2; k++) {
      edges.push({
        from: vertexIndex(i, 0, k),
        to: vertexIndex(i, 1, k),
      });
    }
  }

  // Z-edges: vary K, fix I, J (4 edges)
  for (let i = 0; i < 2; i++) {
    for (let j = 0; j < 2; j++) {
      edges.push({
        from: vertexIndex(i, j, 0),
        to: vertexIndex(i, j, 1),
      });
    }
  }

  return edges;
}
