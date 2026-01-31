import type { Vec4 } from "./math4d";

// Original QBasic symmetric cube dimensions from four06.bas
const AP = 0.8;
const AM = -0.8;

// Number of dots per edge (increased for denser appearance)
export const NDOT = 25;

// Get flat array of vertices for easier processing
// Returns 8 vertices (3D cube) indexed by i*4 + j*2 + k
// All vertices have W=0 (3D object embedded in 4D)
export function getVertexArray(): Vec4[] {
  const result: Vec4[] = [];
  for (let i = 0; i < 2; i++) {
    for (let j = 0; j < 2; j++) {
      for (let k = 0; k < 2; k++) {
        result.push({
          x: i === 0 ? AP : AM,
          y: j === 0 ? AP : AM,
          z: k === 0 ? AP : AM,
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

// Edge definition for dotted line rendering
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

// Face definition - two opposite faces (Z=AP and Z=AM) with different colors
export type Face = {
  // Corner vertices for the face (for interpolation)
  v11: number; // vertex at (0,0,k)
  v12: number; // vertex at (0,1,k)
  v21: number; // vertex at (1,0,k)
  colorIndex: number; // 0 or 1 for the two face colors
};

// Get the two Z-faces (opposite faces on Z axis)
export function getFaces(): Face[] {
  return [
    {
      // Z = AP face (k=0)
      v11: vertexIndex(0, 0, 0),
      v12: vertexIndex(0, 1, 0),
      v21: vertexIndex(1, 0, 0),
      colorIndex: 0,
    },
    {
      // Z = AM face (k=1)
      v11: vertexIndex(0, 0, 1),
      v12: vertexIndex(0, 1, 1),
      v21: vertexIndex(1, 0, 1),
      colorIndex: 1,
    },
  ];
}
