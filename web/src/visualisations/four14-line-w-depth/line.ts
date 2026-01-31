import type { Vec4 } from "./math4d";

// Line length from original QBasic
const A = 1.25;

// Number of dots per line
export const NDOT = 100;

// W-scale for brightness calculation
export const WSCALE = 6.0;

// Get the two endpoints of the line (initially along X axis)
export function getLineEndpoints(): [Vec4, Vec4] {
  return [
    { x: A, y: 0, z: 0, w: 0 },
    { x: -A, y: 0, z: 0, w: 0 },
  ];
}
