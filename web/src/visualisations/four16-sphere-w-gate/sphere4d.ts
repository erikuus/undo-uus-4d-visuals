import {
  rotateXY,
  rotateXZ,
  rotateYZ,
  rotateXW,
  rotateYW,
  rotateZW,
  type Vec4,
} from "./math4d";

const TWO_PI = 2 * Math.PI;

// Original QBasic angle increments (radians per point, after FACD scaling)
const FACD = 124.7354645891;
const DF = {
  xy: 3.034538902655 * FACD,
  xz: 5.028469563403 * FACD,
  yz: 7.037635209575 * FACD,
  xw: 11.06479853421 * FACD,
  yw: 13.08750265132 * FACD,
  zw: 17.00573092632 * FACD,
};

function wrapAngle(angle: number): number {
  while (angle >= TWO_PI) angle -= TWO_PI;
  while (angle < 0) angle += TWO_PI;
  return angle;
}

export function generateSpherePoints(count: number): Vec4[] {
  const points: Vec4[] = [];

  // Cumulative rotation angles (matching QBasic F(M,N) array)
  const angles = { xy: 0, xz: 0, yz: 0, xw: 0, yw: 0, zw: 0 };

  for (let i = 0; i < count; i += 1) {
    // Start from the original seed (NOT normalized, as in QBasic)
    let v: Vec4 = { x: 1, y: 0.7, z: 0.8, w: 0.9 };

    // Apply rotations in the same order as QBasic: M=2..4, N=1..M-1
    // M=2, N=1 => XY
    angles.xy = wrapAngle(angles.xy + DF.xy);
    v = rotateXY(v, angles.xy);

    // M=3, N=1 => XZ
    angles.xz = wrapAngle(angles.xz + DF.xz);
    v = rotateXZ(v, angles.xz);

    // M=3, N=2 => YZ
    angles.yz = wrapAngle(angles.yz + DF.yz);
    v = rotateYZ(v, angles.yz);

    // M=4, N=1 => XW
    angles.xw = wrapAngle(angles.xw + DF.xw);
    v = rotateXW(v, angles.xw);

    // M=4, N=2 => YW
    angles.yw = wrapAngle(angles.yw + DF.yw);
    v = rotateYW(v, angles.yw);

    // M=4, N=3 => ZW
    angles.zw = wrapAngle(angles.zw + DF.zw);
    v = rotateZW(v, angles.zw);

    points.push(v);
  }

  return points;
}
